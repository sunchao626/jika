const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const behavior = fs.readFileSync("admin-dialogs.js", "utf8");

for (const id of ["routeDialog", "dispatchDialog", "vehicleDialog", "driverDialog", "addDialog"]) {
  assert.match(html, new RegExp(`id="${id}"[^>]*data-breadcrumb=|data-breadcrumb="[^"]+"[^>]*id="${id}"`), `${id} 缺少页面路径`);
}

const entryMarkup = ["routeDialog", "dispatchDialog", "vehicleDialog", "driverDialog", "addDialog"].map((id, index, ids) => {
  const start = html.indexOf(`id="${id}"`);
  const nextStarts = ids.slice(index + 1).map((nextId) => html.indexOf(`id="${nextId}"`)).filter((position) => position > start);
  return html.slice(start, nextStarts.length ? Math.min(...nextStarts) : html.length);
}).join("\n");
for (const label of entryMarkup.matchAll(/<label class="([^"]*\bfield\b[^"]*)"[^>]*>([\s\S]*?)<\/(?:label)>/g)) {
  if (!/\brequired\b/.test(label[2])) continue;
  assert.match(label[1], /\brequired-field\b/, `必填控件缺少 required-field：${label[2].slice(0, 60)}`);
  assert.match(label[2], /class="field-label"/, `必填字段缺少可视标签：${label[2].slice(0, 60)}`);
}

assert.match(css, /dialog\.admin-form-dialog\[open\][\s\S]*inset:\s*76px 0 0 232px/);
assert.match(css, /dialog\.admin-form-dialog::backdrop[\s\S]*background:\s*transparent/);
assert.match(css, /dialog\.admin-form-dialog\.photo-requirement-dialog\[open\][\s\S]*width:\s*min\(640px, calc\(100vw - 40px\)\) !important[\s\S]*height:\s*fit-content !important[\s\S]*min-height:\s*0 !important/);
assert.match(css, /dialog\.admin-form-dialog\.photo-requirement-dialog::backdrop\s*\{\s*background:\s*rgba\(25, 37, 56, \.38\)/);
assert.match(css, /\.photo-requirement-dialog \.driver-form-body\s*\{[\s\S]*overflow-y:\s*auto/);
assert.match(css, /\.photo-requirement-dialog \.form-actions\s*\{[\s\S]*justify-content:\s*flex-end/);
assert.match(html, /name="name"[\s\S]*name="quantity"[\s\S]*name="description"/);
assert.match(css, /\.admin-form-dialog \.form-actions,[\s\S]*position:\s*relative[\s\S]*min-height:\s*72px[\s\S]*flex:\s*0 0 auto/);
assert.match(css, /\.admin-form-dialog \.waybill-form-actions\s*\{\s*justify-content:\s*space-between/);
assert.match(css, /\.customer-section-nav/);
assert.match(html, /class="customer-section-nav"/);
assert.match(html, /type="submit" form="customerForm"/);
assert.ok(html.indexOf('id="customerForm"') < html.indexOf('class="customer-entry-actions"'), "客户保存栏应位于表单内容之后");
assert.match(css, /\.customer-entry-page\s*\{[\s\S]*position:\s*fixed[\s\S]*flex-direction:\s*column[\s\S]*overflow:\s*hidden/);
assert.match(css, /\.customer-entry-page > form\s*\{[\s\S]*flex:\s*1 1 auto[\s\S]*overflow-y:\s*auto/);
assert.match(css, /\.customer-entry-actions\s*\{[\s\S]*flex:\s*0 0 auto[\s\S]*border-top:/);
assert.match(css, /\.admin-form-dialog \.required-field > \.field-label::after/);
assert.match(behavior, /customerSectionNav/);
assert.doesNotMatch(html, />统计分析<\/button>/);
assert.doesNotMatch(html, /class="nav-child"[^>]*data-page="auto-dispatch"/);
assert.match(html, /data-page="auto-dispatch-config"[^>]*>自动派单配置<\/button>/);
assert.match(css, /\.sidebar\s*\{[\s\S]*?display:\s*flex[\s\S]*?height:\s*100vh[\s\S]*?flex-direction:\s*column[\s\S]*?overflow:\s*hidden/);
assert.match(css, /\.nav-menu\s*\{[\s\S]*?flex:\s*1 1 auto[\s\S]*?overflow-y:\s*auto/);

console.log("entry page style tests passed");
