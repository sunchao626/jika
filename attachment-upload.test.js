const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const component = fs.readFileSync("attachment-upload.js", "utf8");
const app = fs.readFileSync("app.js", "utf8");

const fileInputs = html.match(/<input[^>]+type="file"[^>]+data-upload-hint="[^"]+"[^>]*>/g) || [];
assert.equal(fileInputs.length, 6, "all six backend attachment controls should remain functional file inputs");
fileInputs.forEach((input) => {
  assert.match(input, /accept="\.jpg,\.jpeg,\.png,\.pdf"/);
  assert.match(input, /data-upload-hint=/);
});
assert.ok(html.indexOf('src="attachment-upload.js"') < html.indexOf('src="app.js"'));
assert.match(component, /querySelectorAll\("\.file-field input\[type='file'\]"\)/);
assert.match(component, /attachment-picker-remove/);
assert.match(component, /文件超过 10 MB/);
assert.match(component, /setExisting/);
assert.match(component, /getValue/);
assert.match(styles, /\.file-field\.attachment-ready > input\[type="file"\]/);
assert.match(styles, /\.file-field\.has-file \.attachment-picker/);
assert.match(styles, /\.file-field\.file-error \.attachment-picker/);
assert.doesNotMatch(styles, /\.admin-form-dialog \.file-field input\[type="file"\]/);
assert.match(app, /AttachmentPicker\?\.setExisting/);
assert.match(app, /AttachmentPicker\?\.getValue/);
console.log("Attachment picker component test passed");
