import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BROWSER_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const PORT = 9224;

const artifactDir = process.env.ARTIFACT_DIR || "C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d9db743a-e765-489a-a5eb-24b0549d257e";

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log("=== BROWSER CDP AUTHENTICATED ACTIVITY & WORKPULSE VISUAL PROOF ===");
  console.log("Using browser binary:", BROWSER_PATH);

  const userDataDir = path.join(artifactDir, "scratch", "cdp-profile-auth");
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const browserProc = spawn(BROWSER_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    "--disable-extensions",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1440,900",
    "about:blank",
  ]);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (res.ok) {
        const list = await res.json();
        const pageTarget = list.find((t) => t.type === "page" || !t.url.startsWith("chrome-"));
        if (pageTarget && pageTarget.webSocketDebuggerUrl) {
          wsUrl = pageTarget.webSocketDebuggerUrl;
          break;
        }
      }
    } catch {
      // retry
    }
  }

  if (!wsUrl) {
    console.error("Failed to connect to CDP endpoint!");
    browserProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  let idSeq = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idSeq++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((r) => (ws.onopen = r));
  await send("Page.enable");
  await send("Runtime.enable");

  // Step 1: Login
  console.log("Navigating to http://localhost:8080/login to authenticate...");
  await send("Page.navigate", { url: "http://localhost:8080/login" });
  await sleep(3000);

  console.log("Injecting admin credentials and submitting login form...");
  await send("Runtime.evaluate", {
    expression: `(() => {
      const emailInput = document.querySelector('input[type="email"], #email');
      const passInput = document.querySelector('input[type="password"], #password');
      if (emailInput && passInput) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(emailInput, 'priya.nair@brahma.dev');
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        setter.call(passInput, 'AdminSecurePass123!');
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
        passInput.dispatchEvent(new Event('change', { bubbles: true }));
        const btn = document.querySelector('button[type="submit"]');
        if (btn) btn.click();
      }
    })()`,
  });

  await sleep(4000);

  async function capture(url, screenshotName) {
    console.log(`\nNavigating to ${url}...`);
    await send("Page.navigate", { url });
    await sleep(2500);

    const evalRes = await send("Runtime.evaluate", {
      expression: "document.title",
      returnByValue: true,
    });
    console.log(`Page title: "${evalRes?.result?.value}"`);

    const shot = await send("Page.captureScreenshot", { format: "png" });
    const shotPath = path.join(artifactDir, screenshotName);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, "base64"));
    console.log(`Saved screenshot to: ${shotPath}`);
  }

  // 1. Stream Mode
  await capture("http://localhost:8080/app/activity", "activity_stream.png");

  // 2. Table Mode
  await capture("http://localhost:8080/app/activity?mode=table", "activity_table.png");

  // 3. Heatmap Mode
  await capture("http://localhost:8080/app/activity?mode=heatmap", "activity_heatmap.png");

  // 4. WorkPulse Command Center
  await capture("http://localhost:8080/app/activity?view=pulse", "activity_pulse.png");

  // 5. Scoped Project Activity
  await capture("http://localhost:8080/app/projects/f2d67ab3-8668-42d6-98de-7750da4c1bc8/activity", "project_activity_scoped.png");

  ws.close();
  browserProc.kill();

  console.log("\nAll visual proofs successfully recorded and saved to artifacts directory!");
}

run().catch((e) => {
  console.error("Browser test error:", e);
  process.exit(1);
});
