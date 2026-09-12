// Verification of symmetric encryption for bytea storage
export async function encryptToken(token, secret) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest("SHA-256", enc.encode(secret));
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(token)
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  // Return postgres bytea hex format: \x...
  let hex = "\\x";
  for (let i = 0; i < combined.length; i++) {
    hex += combined[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export async function decryptToken(hexString, secret) {
  let cleanHex = hexString;
  if (cleanHex.startsWith("\\x")) cleanHex = cleanHex.slice(2);
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  const iv = bytes.slice(0, 12);
  const ciphertext = bytes.slice(12);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest("SHA-256", enc.encode(secret));
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

async function test() {
  const secret = "brahma-default-key-sec-2026";
  const token = "ghp_MockGitHubToken1234567890abcdefABCDEF";
  const encrypted = await encryptToken(token, secret);
  console.log("Encrypted bytea:", encrypted.slice(0, 30) + "...");
  const decrypted = await decryptToken(encrypted, secret);
  console.log("Decrypted token match:", decrypted === token);
}

test();
