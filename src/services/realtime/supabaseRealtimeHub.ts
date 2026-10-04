/**
 * VYRON — ENHANCED SUPABASE REAL-TIME HUB
 * Production-grade Realtime Channel Manager supporting:
 * 1. Postgres Database Change Listeners (INSERT, UPDATE, DELETE with typed filters)
 * 2. High-speed Broadcast Channels (sub-millisecond peer signals, anomaly alerts, telemetry)
 * 3. Ephemeral Presence Tracking (online roster, active role, last seen heartbeat)
 * 4. Resilient Connection Lifecycle (CONNECTING -> SUBSCRIBED -> TIMED_OUT -> RECONNECTING)
 * 
 * Strictly ZERO Raw SQL Interpolation. Uses Supabase Client SDK query builders.
 */

import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export type ChannelStatus =
  | "DISCONNECTED"
  | "CONNECTING"
  | "SUBSCRIBED"
  | "TIMED_OUT"
  | "CHANNEL_ERROR"
  | "CLOSED";

export type BroadcastEventType =
  | "ANOMALY_ALERT"
  | "PIPELINE_UPDATE"
  | "PEER_REVIEW_SIGNAL"
  | "CRYPTO_SEAL_VERIFIED"
  | "USER_PRESENCE_HEARTBEAT"
  | "TEST_PING"
  | "TEST_PONG";

export interface RealtimeMessage<T = Record<string, unknown>> {
  id: string;
  channel: string;
  type: BroadcastEventType | string;
  sender: {
    userId: string;
    role: "student" | "teacher" | "professional" | "admin";
    name: string;
  };
  payload: T;
  timestamp: string;
  latencyMs?: number;
}

export interface PresenceMember {
  userId: string;
  name: string;
  role: "student" | "teacher" | "professional" | "admin";
  onlineAt: string;
  activePersona: string;
}

export interface PostgresListenerConfig {
  table: string;
  schema?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
  onPayload: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void;
}

export interface RealtimeHubListener {
  onStatusChange?: (status: ChannelStatus, latencyMs?: number) => void;
  onMessage?: (message: RealtimeMessage) => void;
  onPresenceSync?: (members: PresenceMember[]) => void;
}

class SupabaseRealtimeHub {
  private channelName: string;
  private channel: RealtimeChannel | null = null;
  private status: ChannelStatus = "DISCONNECTED";
  private listeners: Set<RealtimeHubListener> = new Set();
  private messageHistory: RealtimeMessage[] = [];
  private presenceMembers: Map<string, PresenceMember> = new Map();
  private maxHistorySize = 100;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private pingStartTime = 0;

  constructor(defaultChannel = "vyron:global_realtime_stream") {
    this.channelName = defaultChannel;
  }

  /**
   * Get current channel subscription status
   */
  public getStatus(): ChannelStatus {
    return this.status;
  }

  /**
   * Get active channel name
   */
  public getChannelName(): string {
    return this.channelName;
  }

  /**
   * Get message history
   */
  public getMessageHistory(): RealtimeMessage[] {
    return [...this.messageHistory];
  }

  /**
   * Get online presence members
   */
  public getPresenceMembers(): PresenceMember[] {
    return Array.from(this.presenceMembers.values());
  }

  /**
   * Subscribe and initialize channel with Presence, Broadcast, and optional Postgres changes
   */
  public async subscribeChannel(
    channelName?: string,
    currentUser?: { userId: string; name: string; role: "student" | "teacher" | "professional" | "admin" },
    postgresConfigs?: PostgresListenerConfig[]
  ): Promise<RealtimeChannel> {
    if (channelName && channelName !== this.channelName) {
      await this.disconnect();
      this.channelName = channelName;
    }

    if (this.channel && this.status === "SUBSCRIBED") {
      return this.channel;
    }

    this.setStatus("CONNECTING");

    const channel = supabase.channel(this.channelName, {
      config: {
        broadcast: { ack: true, self: true },
        presence: {
          key: currentUser?.userId || `guest_${Math.random().toString(36).substring(2, 7)}`,
        },
      },
    });

    // 1. Broadcast Event Listeners
    channel.on("broadcast", { event: "*" }, (event) => {
      const data = event.payload as RealtimeMessage;
      let calculatedLatency: number | undefined;

      if (data.type === "TEST_PONG" && this.pingStartTime > 0) {
        calculatedLatency = Date.now() - this.pingStartTime;
        this.pingStartTime = 0;
      }

      const receivedMsg: RealtimeMessage = {
        ...data,
        id: data.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        latencyMs: calculatedLatency !== undefined ? calculatedLatency : data.latencyMs,
      };

      this.messageHistory = [receivedMsg, ...this.messageHistory].slice(0, this.maxHistorySize);

      for (const listener of this.listeners) {
        listener.onMessage?.(receivedMsg);
      }
    });

    // 2. Presence Event Listeners
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const members: PresenceMember[] = [];

        for (const key of Object.keys(state)) {
          const presences = state[key] as Array<Record<string, unknown>>;
          for (const p of presences) {
            members.push({
              userId: String(p["userId"] || key),
              name: String(p["name"] || "Operator"),
              role: (p["role"] as PresenceMember["role"]) || "student",
              onlineAt: String(p["onlineAt"] || new Date().toISOString()),
              activePersona: String(p["activePersona"] || "Default"),
            });
          }
        }

        this.presenceMembers = new Map(members.map((m) => [m.userId, m]));
        for (const listener of this.listeners) {
          listener.onPresenceSync?.(members);
        }
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        for (const p of newPresences as Array<Record<string, unknown>>) {
          const member: PresenceMember = {
            userId: String(p["userId"]),
            name: String(p["name"] || "Operator"),
            role: (p["role"] as PresenceMember["role"]) || "student",
            onlineAt: String(p["onlineAt"] || new Date().toISOString()),
            activePersona: String(p["activePersona"] || "Default"),
          };
          this.presenceMembers.set(member.userId, member);
        }
        for (const listener of this.listeners) {
          listener.onPresenceSync?.(Array.from(this.presenceMembers.values()));
        }
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        for (const p of leftPresences as Array<Record<string, unknown>>) {
          this.presenceMembers.delete(String(p["userId"]));
        }
        for (const listener of this.listeners) {
          listener.onPresenceSync?.(Array.from(this.presenceMembers.values()));
        }
      });

    // 3. Postgres Database Change Listeners (Typed & Parameterized)
    if (postgresConfigs && postgresConfigs.length > 0) {
      for (const pCfg of postgresConfigs) {
        channel.on(
          "postgres_changes",
          {
            event: pCfg.event || "*",
            schema: pCfg.schema || "public",
            table: pCfg.table,
            ...(pCfg.filter ? { filter: pCfg.filter } : {}),
          },
          (payload) => {
            pCfg.onPayload(payload);
          }
        );
      }
    }

    // Subscribe with lifecycle handling
    channel.subscribe((subStatus) => {
      if (subStatus === "SUBSCRIBED") {
        this.reconnectAttempts = 0;
        this.setStatus("SUBSCRIBED");

        // Track presence if currentUser is provided
        if (currentUser) {
          channel.track({
            userId: currentUser.userId,
            name: currentUser.name,
            role: currentUser.role,
            onlineAt: new Date().toISOString(),
            activePersona: currentUser.role.toUpperCase(),
          });
        }
      } else if (subStatus === "TIMED_OUT") {
        this.setStatus("TIMED_OUT");
        this.attemptReconnect();
      } else if (subStatus === "CHANNEL_ERROR") {
        this.setStatus("CHANNEL_ERROR");
        this.attemptReconnect();
      } else if (subStatus === "CLOSED") {
        this.setStatus("CLOSED");
      }
    });

    this.channel = channel;
    return channel;
  }

  /**
   * Broadcast a high-speed event to all peers in the channel
   */
  public async broadcastMessage<T = Record<string, unknown>>(
    type: BroadcastEventType | string,
    payload: T,
    sender: {
      userId: string;
      role: "student" | "teacher" | "professional" | "admin";
      name: string;
    }
  ): Promise<boolean> {
    if (!this.channel || this.status !== "SUBSCRIBED") {
      console.warn("[RealtimeHub] Cannot broadcast message: Channel not subscribed.");
      return false;
    }

    if (type === "TEST_PING") {
      this.pingStartTime = Date.now();
    }

    const message: RealtimeMessage<T> = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      channel: this.channelName,
      type,
      sender,
      payload,
      timestamp: new Date().toISOString(),
    };

    try {
      const resp = await this.channel.send({
        type: "broadcast",
        event: type,
        payload: message,
      });
      return resp === "ok";
    } catch (err) {
      console.error("[RealtimeHub] Broadcast failed:", err);
      return false;
    }
  }

  /**
   * Perform roundtrip ping probe to measure realtime broadcast latency
   */
  public async pingLatency(sender: {
    userId: string;
    role: "student" | "teacher" | "professional" | "admin";
    name: string;
  }): Promise<void> {
    await this.broadcastMessage("TEST_PING", { pingTime: Date.now() }, sender);
  }

  /**
   * Graceful disconnection
   */
  public async disconnect(): Promise<void> {
    if (this.channel) {
      await supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.setStatus("DISCONNECTED");
    this.presenceMembers.clear();
  }

  /**
   * Add listener for realtime updates
   */
  public addListener(listener: RealtimeHubListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setStatus(status: ChannelStatus) {
    this.status = status;
    for (const listener of this.listeners) {
      listener.onStatusChange?.(status);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[RealtimeHub] Max reconnect attempts reached.");
      return;
    }
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 8000);
    setTimeout(() => {
      this.subscribeChannel(this.channelName);
    }, delay);
  }
}

export const supabaseRealtimeHub = new SupabaseRealtimeHub();
