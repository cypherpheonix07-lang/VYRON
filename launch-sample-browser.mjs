import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BROWSER_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const PORT = 9226;

const userDataDir = path.join(process.cwd(), ".chrome-demo-profile");
if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir, { recursive: true });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("=== LAUNCHING VISIBLE BROWSER WITH SAMPLE DATA ===");
  console.log("Browser executable:", BROWSER_PATH);

  // Spawn visible Chrome window with remote debugging enabled
  const browserProc = spawn(BROWSER_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=1440,920",
    "http://localhost:8080/login",
  ], {
    detached: true,
    stdio: "ignore",
  });

  browserProc.unref();

  console.log("Browser launched. Connecting via CDP to initialize session...");

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
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
      // Retrying
    }
  }

  if (!wsUrl) {
    console.log("Browser window is active on your desktop at http://localhost:8080/login.");
    return;
  }

  const ws = new WebSocket(wsUrl);
  let idSeq = 1;
  const callbacks = new Map();

  function sendCmd(method, params = {}) {
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

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  await sendCmd("Page.enable");
  await sendCmd("Runtime.enable");

  console.log("Navigating to login...");
  await sendCmd("Page.navigate", { url: "http://localhost:8080/login" });
  await sleep(2500);

  // Inject login credentials and submit
  console.log("Submitting credentials and activating demo sample data...");
  await sendCmd("Runtime.evaluate", {
    expression: `
      (async () => {
        try {
          const emailInput = document.querySelector('input[type="email"]');
          const passInput = document.querySelector('input[type="password"]');

          if (emailInput && passInput) {
            const setVal = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setVal.call(emailInput, 'priya.nair@brahma.dev');
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));

            setVal.call(passInput, 'AdminSecurePass123!');
            passInput.dispatchEvent(new Event('input', { bubbles: true }));

            const submitBtn = document.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.click();
          }
        } catch(e) {
          console.error(e);
        }
      })()
    `,
  });

  // Wait for login and routing to complete
  await sleep(3500);

  // Set demo mode in sessionStorage and navigate to dashboard with demo data active
  console.log("Activating Demo Mode session in browser context...");
  await sendCmd("Runtime.evaluate", {
    expression: `
      (() => {
        const demoSession = {
          isDemo: true,
          demoProjectId: 'demo-proj-1',
          demoDomain: 'fintech',
          activatedAt: Date.now(),
          demoSessionId: 'demo-session-visible'
        };
        sessionStorage.setItem('brahma_demo_session', JSON.stringify(demoSession));
        window.location.href = '/app/dashboard';
      })()
    `,
  });

  await sleep(2000);
  ws.close();

  console.log("\n=============================================================");
  console.log("SUCCESS: Visible Chrome window is running on your desktop!");
  console.log("URL: http://localhost:8080/app/dashboard");
  console.log("Sample Data: ACTIVE (FinTech Ledger, Drones, Healthcare FHIR)");
  console.log("=============================================================\n");
}

main().catch(console.error);
