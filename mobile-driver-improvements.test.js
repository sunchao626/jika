const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("mobile.html", "utf8");
const script = fs.readFileSync("mobile.js", "utf8");
const styles = fs.readFileSync("mobile.css", "utf8");
const store = fs.readFileSync("dispatch-store.js", "utf8");

assert.doesNotMatch(html, /id="taskDrawerButton"/);
assert.doesNotMatch(html, /class="task-drawer"/);
assert.doesNotMatch(script, /openTaskDrawer|renderTaskDrawer/);

assert.match(html, /data-call-service[^>]*type="button"/);
assert.match(html, />客服电话</);
assert.match(script, /window\.location\.href = "tel:4008006688"/);

assert.match(script, /class="subpage-summary vehicle-summary"/);
assert.match(script, /data-subpage-action="report-vehicle-repair"/);
assert.match(script, /data-subpage-action="edit-vehicle"/);
assert.match(script, /id="vehicleEditForm"/);
assert.match(script, /DRIVER_VEHICLE_STORAGE_KEY/);
assert.match(styles, /\.vehicle-summary-actions/);

assert.match(script, /profile-credential-section/);
assert.match(script, /CERTIFICATION_DOCUMENT_GROUPS/);
assert.match(script, /multiple/);
assert.match(script, /data-preview-credential/);
assert.match(script, /openCredentialPreview/);
assert.match(script, /replaceCredentialAttachmentsFromForm/);
assert.match(store, /async function deletePhotos/);

assert.match(script, /credentialUploadCardsMarkup/);
assert.match(script, /data-credential-upload-card/);
assert.match(script, /data-preview-selected-credential/);
assert.match(script, /hydrateCredentialInlinePreviews/);
assert.match(styles, /\.credential-upload-card-grid/);
assert.match(styles, /\.credential-card-preview/);
assert.doesNotMatch(script, /documents:\s*"证件管理"/);
assert.doesNotMatch(script, /openProfileSubpage\("documents"\)/);
assert.doesNotMatch(script, /管理证件|证件管理/);

console.log("Mobile driver improvements test passed");
