const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("mobile.html", "utf8");
const script = fs.readFileSync("mobile.js", "utf8");
const styles = fs.readFileSync("mobile.css", "utf8");

assert.match(html, /class="profile-menu-group profile-service-group"/);
assert.match(html, /<h2>功能与服务<\/h2>/);
assert.doesNotMatch(html, /data-open-messages/);
assert.doesNotMatch(html, />消息通知</);
assert.match(html, /data-profile-page="personal"[^>]*>基础信息/);
assert.match(html, /id="profileCertificationBadge"[^>]*data-profile-page="certification"/);
assert.match(html, /data-profile-page="vehicle"[^>]*>.*车辆信息/s);
assert.match(html, /id="profileVehiclePlate"/);
assert.match(html, /id="profileVehicleDescription"/);
assert.match(html, /data-profile-page="settings"[^>]*>.*系统设置/s);
assert.match(script, /profileVehiclePlate/);
assert.match(script, /profileVehicleDescription/);
assert.match(script, /FONT_SIZE_STORAGE_KEY/);
assert.match(script, /function loadFontSize\(\)/);
assert.match(script, /function applyFontSize\(/);
assert.match(script, /querySelectorAll\("\.font-size-options button\[data-font-size\]"\)/);
assert.match(script, /closest\("\.font-size-options button\[data-font-size\]"\)/);
assert.doesNotMatch(script, /closest\("\[data-font-size\]"\)/);
assert.match(script, /data-subpage-action="open-documents"/);
assert.match(script, /subpageAction === "open-insurance"/);
assert.match(script, /id="personalEditForm"/);
assert.match(script, /id="documentEditForm"/);
assert.match(script, /subpageAction === "cancel-personal-edit"/);
assert.match(script, /subpageAction === "cancel-document-edit"/);
assert.match(script, /DRIVER_PROFILE_STORAGE_KEY/);
assert.match(script, /maskCredential\(driver\.licenseNo\)/);
assert.match(script, /maskCredential\(driver\.qualificationNo\)/);
assert.match(styles, /\.profile-view\s*\{\s*overflow-y: hidden;/);
assert.match(styles, /\.phone-shell\[data-font-size="small"\]/);
assert.match(styles, /\.font-size-options button\.active/);

console.log("Mobile profile settings test passed");
