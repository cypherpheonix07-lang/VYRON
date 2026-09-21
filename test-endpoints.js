const http = require("http");

function check(url) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          console.log(`[${res.statusCode}] ${url} (length: ${data.length})`);
          resolve({ status: res.statusCode, length: data.length });
        });
      })
      .on("error", (err) => {
        console.log(`[ERR] ${url} - ${err.message}`);
        resolve({ status: 0, error: err.message });
      });
  });
}

async function run() {
  console.log("Testing Vite dev server endpoints:");
  await check("http://localhost:8080/");
  await check("http://localhost:8080/login");
  await check("http://localhost:8080/app");
  await check("http://localhost:8080/src/entry-client.tsx");
  await check("http://localhost:8080/@vite/client");
}

run();
