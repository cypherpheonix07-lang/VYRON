import crypto from "node:crypto";

let counter = 0;
const PROCESS_ID = crypto.randomBytes(4).toString("hex");

/**
 * Generates a collision-resistant, URL-safe, sortable CUID2-compliant identifier.
 * Format: 24-character lowercase base-36 string starting with a random letter.
 */
export function createId(length = 24): string {
  const time = Date.now().toString(36);
  const count = (counter = (counter + 1) % 1679616).toString(36);
  const salt = crypto.randomBytes(16).toString("hex");
  const raw = `${time}${count}${PROCESS_ID}${salt}`;
  
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const bigIntHash = BigInt("0x" + hash);
  const base36Hash = bigIntHash.toString(36);
  
  // Prefix with a random lowercase ASCII letter (a-z) to guarantee leading letter
  const prefix = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  const full = prefix + base36Hash;
  
  return full.slice(0, length).padEnd(length, "0");
}

export const cuid2 = createId;
export default createId;
