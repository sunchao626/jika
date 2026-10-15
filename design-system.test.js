const assert = require("node:assert/strict");
const fs = require("node:fs");

const read = (file) => fs.readFileSync(file, "utf8");
const tokens = read("design-tokens.css");
const desktop = read("index.html");
const driver = read("mobile.html");
const manager = read("admin-mobile.html");
const driverCss = read("mobile.css");
const managerCss = read("admin-mobile.css");
const driverScript = read("mobile.js");
const managerScript = read("admin-mobile.js");
const appScript = read("app.js");

for (const [page, surfaceCss] of [[desktop, "styles.css"], [driver, "mobile.css"], [manager, "admin-mobile.css"]]) {
  assert.ok(page.indexOf(`href="${surfaceCss}"`) < page.indexOf('href="design-tokens.css"'), `${surfaceCss} must load before shared tokens`);
  assert.match(page, /href="design-tokens\.css"/);
}
assert.match(tokens, /--primary:\s*#4779ed/);
for (const css of [read("styles.css"), driverCss, managerCss]) {
  assert.doesNotMatch(css, /--primary:\s*#/i, "surface styles must not redefine the platform primary color");
}

assert.match(driver, /id="orderStatusTabs"[^>]*role="group"[^>]*aria-label="运单状态筛选"/);
assert.match(driver, /class="filter-chip active"[^>]*aria-pressed="true"/);
assert.match(driverScript, /item\.setAttribute\("aria-pressed", String\(active\)\)/);
assert.match(managerScript, /class="filter-chip \$\{active \? "active" : ""\}"[^>]*aria-pressed="\$\{active\}"/);
assert.match(tokens, /\.order-status-tabs button\.filter-chip,[\s\S]*\.module-filter-row button\.filter-chip/);

for (const id of ["workbenchPendingCount", "workbenchTransitCount", "workbenchIdleCount", "workbenchAlertCount"]) {
  assert.match(manager, new RegExp(`id="${id}"`));
  assert.match(managerScript, new RegExp(`#${id}"\\)\\.textContent`));
}
assert.match(manager, /class="metric-card"[^>]*data-open-module="dispatch"/);
assert.match(desktop, /class="dispatch-stat metric-card/);
assert.match(driverScript, /class="drawer-stat metric-card/);
assert.match(read("dispatch-management.js"), /dispatch-management-stat metric-card/);

assert.match(manager, /id="managerEntryView" role="dialog" aria-modal="true"/);
assert.match(managerScript, /event\.key === "Escape"[\s\S]*closeEntry\(\)/);
assert.match(tokens, /dialog\.admin-form-dialog\[open\][\s\S]*border-radius:\s*18px 18px 0 0/);
assert.match(appScript, /function showApplicationAlert\(/);
assert.match(appScript, /function askApplicationConfirm\(/);
assert.doesNotMatch(appScript, /window\.(?:alert|confirm)\(/);
assert.match(appScript, /setTimeout\(\(\) => \{[\s\S]*\}, 2500\)/);
assert.match(driverScript, /classList\.remove\("show"\), 2500\)/);
assert.match(managerScript, /classList\.remove\("show"\), 2500\)/);
assert.match(read("user-access.js"), /feedback\.hidden = true; \}, 2500\)/);

console.log("design system consistency tests passed");
