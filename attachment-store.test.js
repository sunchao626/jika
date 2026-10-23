const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const store = fs.readFileSync("attachment-store.js", "utf8");
const settlement = fs.readFileSync("settlement-management.js", "utf8");

assert.match(html, /<script src="attachment-store\.js"><\/script>/);
assert.match(store, /indexedDB\.open/);
assert.match(store, /objectStore\(STORE_NAME\)\.put/);
assert.match(settlement, /AttachmentStore\?\.save/);
assert.match(settlement, /data-attachment-open/);

console.log("Attachment persistence contract test passed");
