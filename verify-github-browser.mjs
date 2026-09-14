import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BROWSER_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const PORT = 9225;

const artifactDir = process.env.ARTIFACT_DIR || "C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\608200fc-3e38-4831-ad35-75f7422598e3";

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log("=== BROWSER CDP GITHUB CONNECTOR VISUAL VERIFICATION ===");
  console.log("Using browser:", BROWSER_PATH);

  const userDataDir = path.join(artifactDir, "scratch", "cdp-profile-github");
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

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.id && callbacks.has(data.id)) {
      const cb = callbacks.get(data.id);
      callbacks.delete(data.id);
      cb(data.result);
    }
  };

  await new Promise((r) => (ws.onopen = r));

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const id = idSeq++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  const capture = async (name) => {
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    const filePath = path.join(artifactDir, `${name}.png`);
    fs.writeFileSync(filePath, Buffer.from(data, "base64"));
    console.log(`[CAPTURED] ${name}.png -> ${filePath}`);
  };

  await send("Page.enable");
  await send("DOM.enable");
  await send("Runtime.enable");

  // 1. Authenticate via login
  console.log("Navigating to login...");
  await send("Page.navigate", { url: "http://localhost:8080/login" });
  await sleep(3000);

  console.log("Injecting admin credentials with React nativeValueSetter...");
  await send("Runtime.evaluate", {
    expression: `(() => {
      const emailInput = document.querySelector('input[type="email"], #email');
      const passInput = document.querySelector('input[type="password"], #password');
      if (emailInput && passInput) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        if (emailInput._valueTracker) emailInput._valueTracker.setValue('');
        setter.call(emailInput, 'priya.nair@brahma.dev');
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));

        if (passInput._valueTracker) passInput._valueTracker.setValue('');
        setter.call(passInput, 'AdminSecurePass123!');
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
        passInput.dispatchEvent(new Event('change', { bubbles: true }));

        const btn = document.querySelector('button[type="submit"]');
        if (btn) btn.click();
      }
    })()`,
  });
  await sleep(4000);

  // 2. Navigate to Project Studio Integrations
  const projectId = "4f460a3c-aa38-4fbe-868a-b2d7d7ac208c";
  console.log(`Navigating to Studio Integrations: /app/studio/${projectId}/integrations...`);
  await send("Page.navigate", { url: `http://localhost:8080/app/studio/${projectId}/integrations` });
  await sleep(5000);

  await capture("github_connector_hub");

  // 3. Open Account Selector Modal
  console.log("Triggering Add Repository / Account Selector modal...");
  await send("Runtime.evaluate", {
    expression: `(() => {
      const addBtn = document.getElementById('btn-add-repository') || document.getElementById('btn-link-first-repo');
      if (addBtn) addBtn.click();
    })()`,
  });
  await sleep(1500);
  await capture("github_account_selector");

  // 4. Continue to Repo Selector Modal
  console.log("Continuing to Repo Selector Modal...");
  await send("Runtime.evaluate", {
    expression: `(() => {
      const contBtn = document.getElementById('btn-account-selector-continue');
      if (contBtn) contBtn.click();
    })()`,
  });
  await sleep(2500);
  await capture("github_repo_selector");

  // Close modal
  await send("Runtime.evaluate", {
    expression: `(() => {
      const cancelBtn = document.getElementById('btn-repo-selector-cancel');
      if (cancelBtn) cancelBtn.click();
    })()`,
  });
  await sleep(1000);

  // 5. Navigate to Architecture Blueprint with live repo data
  console.log(`Navigating to Architecture Blueprint: /app/projects/${projectId}/blueprint...`);
  await send("Page.navigate", { url: `http://localhost:8080/app/projects/${projectId}/blueprint` });
  await sleep(3500);
  await capture("github_blueprint_live");

  console.log("\nALL VISUAL PROOF SCREENSHOTS CAPTURED SUCCESSFULLY!");

  ws.close();
  browserProc.kill();
  process.exit(0);
}

run().catch((e) => {
  console.error("Browser verification error:", e);
  process.exit(1);
});
