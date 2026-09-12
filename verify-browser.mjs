import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BROWSER_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const PORT = 9222;

const artifactDir = "C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\85921fb3-8151-4b24-9474-9ccc1a773414";

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log("=== BROWSER CDP AUDIT & INTERACTIVITY TEST ===");
  console.log("Using browser binary:", BROWSER_PATH);

  const userDataDir = path.join(artifactDir, "scratch", "cdp-profile");
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  // 1. Launch Chrome with remote debugging and no extensions
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

  // Wait for CDP port to open
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
    console.error("Failed to connect to Chrome DevTools endpoint!");
    browserProc.kill();
    process.exit(1);
  }

  console.log("Connected to Chrome DevTools Protocol at:", wsUrl);

  const ws = new WebSocket(wsUrl);
  let idSeq = 1;
  const callbacks = new Map();
  const consoleLogs = [];
  const pageErrors = [];

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idSeq++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.reject(msg.error);
      else cb.resolve(msg.result);
    }

    if (msg.method === "Console.messageAdded") {
      const m = msg.params.message;
      consoleLogs.push(`[CONSOLE ${m.level.toUpperCase()}] ${m.text}`);
    } else if (msg.method === "Runtime.consoleAPICalled") {
      const args = msg.params.args.map((a) => a.value ?? a.description ?? JSON.stringify(a)).join(" ");
      consoleLogs.push(`[CONSOLE ${msg.params.type.toUpperCase()}] ${args}`);
    } else if (msg.method === "Runtime.exceptionThrown") {
      const desc = msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text;
      pageErrors.push(`[EXCEPTION] ${desc}`);
    }
  };

  // Enable domains
  await send("Console.enable");
  await send("Runtime.enable");
  await send("Page.enable");
  await send("DOM.enable");

  console.log("\n[1/4] Navigating to http://localhost:8080/ ...");
  await send("Page.navigate", { url: "http://localhost:8080/" });

  // Wait 4 seconds for full hydration and initial renders
  await sleep(4000);

  // Evaluate DOM state
  console.log("\n[2/4] Inspecting DOM & UI State on Landing Page...");
  const domInfo = await send("Runtime.evaluate", {
    expression: `(() => {
      return {
        title: document.title,
        url: window.location.href,
        h1: document.querySelector('h1')?.innerText,
        linksCount: document.querySelectorAll('a').length,
        buttonsCount: document.querySelectorAll('button').length,
        navLinks: Array.from(document.querySelectorAll('nav a, header a')).map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') })),
        badges: Array.from(document.querySelectorAll('[class*="badge"], [class*="rounded"]')).slice(0, 10).map(e => e.innerText.trim()).filter(Boolean),
        metricsCards: Array.from(document.querySelectorAll('[class*="border"]')).slice(0, 8).map(e => e.innerText.trim().replace(/\\n+/g, ' | ')).filter(t => t.length > 5 && t.length < 80)
      };
    })()`,
    returnByValue: true,
  });

  console.log("DOM State Result:", JSON.stringify(domInfo.result?.value, null, 2));

  // Capture screenshot of landing
  console.log("\n[3/4] Capturing full-page screenshot...");
  const screenshotRes = await send("Page.captureScreenshot", { format: "png" });
  if (screenshotRes?.data) {
    const buffer = Buffer.from(screenshotRes.data, "base64");
    const outPath = path.join(artifactDir, "browser_landing_verified.png");
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot to: ${outPath} (${buffer.length} bytes)`);
  }

  // Test Interactivity: Click on "AI Tool Showcase" / discover
  console.log("\n[4/4] Testing Interactivity: Clicking nav links and testing route transitions...");

  // Click on "Login" button/link
  const clickLoginResult = await send("Runtime.evaluate", {
    expression: `(() => {
      const loginLink = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Login'));
      if (loginLink) {
        loginLink.click();
        return { clicked: true, text: loginLink.innerText, href: loginLink.getAttribute('href') };
      }
      return { clicked: false };
    })()`,
    returnByValue: true,
  });

  console.log("Click Login Link Result:", clickLoginResult.result?.value);
  await sleep(2500);

  // Check state on login page
  const loginDomInfo = await send("Runtime.evaluate", {
    expression: `(() => {
      return {
        url: window.location.href,
        title: document.title,
        heading: document.querySelector('h1, h2')?.innerText,
        inputs: Array.from(document.querySelectorAll('input')).map(i => ({ name: i.name, type: i.type, placeholder: i.placeholder })),
        buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean),
        tabs: Array.from(document.querySelectorAll('[role="tab"], button')).slice(0, 6).map(t => t.innerText.trim()).filter(Boolean)
      };
    })()`,
    returnByValue: true,
  });

  console.log("Login Page DOM State:", JSON.stringify(loginDomInfo.result?.value, null, 2));

  // Capture screenshot of login page
  const loginScreenshot = await send("Page.captureScreenshot", { format: "png" });
  if (loginScreenshot?.data) {
    const buffer = Buffer.from(loginScreenshot.data, "base64");
    const outPath = path.join(artifactDir, "browser_login_verified.png");
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved login screenshot to: ${outPath} (${buffer.length} bytes)`);
  }

  // Test tab switching interactivity on login page: Click "Magic Link" tab
  const tabSwitchResult = await send("Runtime.evaluate", {
    expression: `(() => {
      const magicTab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Magic Link'));
      if (magicTab) {
        magicTab.click();
        return { clicked: true, text: magicTab.innerText };
      }
      return { clicked: false };
    })()`,
    returnByValue: true,
  });
  console.log("Tab Switch (Magic Link) Result:", tabSwitchResult.result?.value);
  await sleep(1000);

  const magicLinkInputs = await send("Runtime.evaluate", {
    expression: `(() => {
      return {
        inputs: Array.from(document.querySelectorAll('input')).map(i => ({ type: i.type, placeholder: i.placeholder })),
        submitButton: Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Magic') || b.innerText.includes('Link') || b.innerText.includes('Send'))?.innerText
      };
    })()`,
    returnByValue: true,
  });
  console.log("After tab switch inputs:", JSON.stringify(magicLinkInputs.result?.value, null, 2));

  // Clean up
  ws.close();
  browserProc.kill();

  console.log("\n=== CONSOLE LOGS CAPTURED ===");
  if (consoleLogs.length === 0) console.log("No console warnings or errors emitted.");
  else consoleLogs.forEach((l) => console.log(l));

  console.log("\n=== PAGE EXCEPTIONS / ERRORS ===");
  if (pageErrors.length === 0) console.log("Zero unhandled page exceptions! Clean execution.");
  else pageErrors.forEach((e) => console.log(e));

  // Save audit report
  const auditReport = {
    timestamp: new Date().toISOString(),
    landingDom: domInfo.result?.value,
    loginDom: loginDomInfo.result?.value,
    tabSwitch: tabSwitchResult.result?.value,
    magicLinkState: magicLinkInputs.result?.value,
    consoleLogs,
    pageErrors,
  };
  fs.writeFileSync(
    path.join(artifactDir, "browser_verification_report.json"),
    JSON.stringify(auditReport, null, 2),
  );
  console.log("\nVerification report saved to browser_verification_report.json");
}

run().catch((e) => {
  console.error("Audit error:", e);
  process.exit(1);
});
