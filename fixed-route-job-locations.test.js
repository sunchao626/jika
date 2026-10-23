const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const start = source.indexOf("function renderRouteJobLocationEditor(");
const end = source.indexOf("function closeRouteForm(", start);
assert.ok(start >= 0 && end > start, "fixed route job location helpers should be present");
assert.match(html, /id="routeTaskTypeSelect"/);
assert.match(html, /id="routeJobLocationEditor"/);
assert.match(html, /route-job-location-section/);
assert.match(html, /class="form-grid route-basic-grid"/);
assert.match(html, /class="route-job-location-count"/);
assert.doesNotMatch(html.slice(html.indexOf('id="routeForm"'), html.indexOf("</form>", html.indexOf('id="routeForm"'))), /name="origin"|name="destination"/);
assert.ok(html.includes("<th>任务类型</th><th>作业地点</th>"));
assert.match(html, /id="routeTaskTypeFilter"/);
const routeTable = html.slice(html.indexOf('aria-label="固定线路列表"'), html.indexOf('id="routeBody"'));
assert.doesNotMatch(routeTable, /<th>提箱地<\/th>|<th>装卸地<\/th>/);
assert.match(source, /route.taskType === taskType/);
assert.ok(source.includes('renderConfiguredJobLocations(route.jobLocations, "route-job-location-list")'));
assert.ok(source.includes("const saved = Array.isArray(route.jobLocations) ? route.jobLocations : []"));
assert.ok(source.includes('renderConfiguredJobLocations(locations, "plan-route-job-locations")'));
assert.ok(source.includes('route.taskType)?.jobLocations || []'));

const profiles = {
  提空装货: { jobLocations: [{ id: "E1", name: "提空地" }, { id: "E2", name: "装货地" }, { id: "E3", name: "落重地" }] },
  排空箱: { jobLocations: [{ id: "X1", name: "提空地" }, { id: "X2", name: "还空地" }] },
};
const editor = { innerHTML: "" };
const hint = { textContent: "" };
const context = vm.createContext({
  window: { DispatchTaskNodes: { profile: (type) => profiles[type] || null } },
  document: { querySelector: (selector) => selector === "#routeJobLocationEditor" ? editor : selector === "#routeJobLocationHint" ? hint : null },
  dashboardEscape: (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]),
});
vm.runInContext(source.slice(start, end), context);

context.renderRouteJobLocationEditor("提空装货", [], true);
assert.equal((editor.innerHTML.match(/data-route-job-location/g) || []).length, 3);
assert.match(editor.innerHTML, /提空地/);
assert.match(editor.innerHTML, /落重地/);
assert.equal(hint.textContent, "提空装货 · 3 个作业地点");

context.renderRouteJobLocationEditor("排空箱", [], true);
assert.equal((editor.innerHTML.match(/data-route-job-location/g) || []).length, 2);
assert.match(editor.innerHTML, /还空地/);
assert.doesNotMatch(editor.innerHTML, /落重地/);
assert.equal(hint.textContent, "排空箱 · 2 个作业地点");

context.renderRouteJobLocationEditor("排空箱", [{ id: "X2", name: "还空地", address: "宁波还箱区" }], false);
assert.match(editor.innerHTML, /value="宁波还箱区"/);
console.log("Fixed route job location test passed");
