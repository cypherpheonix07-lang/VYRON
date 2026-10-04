import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

const client1 = createClient(url, anonKey);
const client2 = createClient(url, anonKey);

async function testRealtime() {
  console.log("Testing Realtime Broadcast...");
  let received = false;

  const ch1 = client1.channel("test-room", { config: { broadcast: { self: true } } });

  ch1.on("broadcast", { event: "ping" }, (payload) => {
    console.log("Received broadcast ping:", payload);
    received = true;
  });

  await new Promise((resolve) => {
    ch1.subscribe(async (status) => {
      console.log("Channel status:", status);
      if (status === "SUBSCRIBED") {
        console.log("Sending broadcast ping...");
        await ch1.send({
          type: "broadcast",
          event: "ping",
          payload: { message: "hello world", timestamp: Date.now() },
        });
        setTimeout(resolve, 2000);
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        resolve();
      }
    });
  });

  await client1.removeChannel(ch1);
  console.log("Realtime test finished. Received:", received);
}

testRealtime();
