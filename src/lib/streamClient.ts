/**
 * PROJECT BRAHMA — SSE Streaming Client
 * Consumes token-by-token streaming events from /llm/stream with AbortController support.
 */

export interface StreamEvent {
  event: "start" | "token" | "end" | "error";
  text?: string;
  model?: string;
  usage?: { prompt_tokens: number; completion_tokens: number };
  error?: string;
}

export interface StreamOptions {
  prompt: string;
  model?: string;
  system_prompt?: string;
  project_id?: string;
  onToken: (token: string) => void;
  onStart?: (model: string) => void;
  onComplete?: (usage?: { prompt_tokens: number; completion_tokens: number }) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

export async function streamLLMResponse(options: StreamOptions): Promise<string> {
  const {
    prompt,
    model = "claude-3-5-sonnet-20241022",
    system_prompt,
    project_id = "default_project",
    onToken,
    onStart,
    onComplete,
    onError,
    signal,
  } = options;

  let fullText = "";

  try {
    const response = await fetch("http://127.0.0.1:8000/llm/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model,
        system_prompt,
        project_id,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`LLM Stream failed with HTTP ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No readable stream body returned from LLM gateway.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const dataStr = trimmed.replace(/^data:\s*/, "");
        try {
          const parsed: StreamEvent = JSON.parse(dataStr);
          if (parsed.event === "start" && parsed.model) {
            onStart?.(parsed.model);
          } else if (parsed.event === "token" && parsed.text) {
            fullText += parsed.text;
            onToken(parsed.text);
          } else if (parsed.event === "end") {
            onComplete?.(parsed.usage);
          } else if (parsed.event === "error") {
            throw new Error(parsed.error || "Streaming error from LLM gateway");
          }
        } catch (e) {
          console.warn("[StreamClient] Parse error for line:", line, e);
        }
      }
    }

    return fullText;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("[StreamClient] Request aborted by user.");
    } else {
      onError?.(err);
    }
    throw err;
  }
}
