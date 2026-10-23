const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const start = source.indexOf("function getDispatchJobLocationDefaults(");
const end = source.indexOf("function updateDispatchEditableFields(", start);
assert.ok(start >= 0 && end > start, "dispatch location helpers should be present");
assert.match(html, /id="dispatchJobLocationFields"/);

const profiles = {
  "提空装货": { jobLocations: [{ id: "L1", name: "提空地" }, { id: "L2", name: "装货地" }, { id: "L3", name: "落重地" }] },
  "提重卸货": { jobLocations: [{ id: "H1", name: "提重地" }, { id: "H2", name: "卸货地" }, { id: "H3", name: "还空地" }] },
  "排空箱（A→B）": { jobLocations: [{ id: "E1", name: "提空地" }, { id: "E2", name: "还空地" }] },
};
const fieldContainer = { innerHTML: "" };
const context = vm.createContext({
  window: { DispatchTaskNodes: { profile: (type) => profiles[type] || null, resolve: (type) => type } },
  document: { querySelector: (selector) => selector === "#dispatchJobLocationFields" ? fieldContainer : null },
  dashboardEscape: (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]),
});
vm.runInContext(source.slice(start, end), context);

const route = { pickupPoint: "港区空箱场", origin: "重箱堆场", loadingPoint: "客户仓库", unloadingPoint: "客户卸货仓", dropoffPoint: "铁路站", destination: "场站" };
const threeStops = context.getDispatchJobLocationDefaults("提空装货", route, []);
assert.deepEqual(threeStops.map((item) => [item.name, item.address]), [["提空地", "港区空箱场"], ["装货地", "客户仓库"], ["落重地", "铁路站"]]);
context.renderDispatchJobLocations("提空装货", route, {}, null);
assert.equal((fieldContainer.innerHTML.match(/data-dispatch-job-location/g) || []).length, 3);
assert.match(fieldContainer.innerHTML, /提空地/);
assert.match(fieldContainer.innerHTML, /value="港区空箱场"/);

const heavyStops = context.getDispatchJobLocationDefaults("提重卸货", route, []);
assert.deepEqual(heavyStops.map((item) => [item.name, item.address]), [["提重地", "重箱堆场"], ["卸货地", "客户卸货仓"], ["还空地", "铁路站"]]);

const twoStops = context.getDispatchJobLocationDefaults("排空箱（A→B）", route, []);
assert.deepEqual(twoStops.map((item) => [item.name, item.address]), [["提空地", "港区空箱场"], ["还空地", "铁路站"]]);
context.renderDispatchJobLocations("排空箱（A→B）", route, {}, null);
assert.equal((fieldContainer.innerHTML.match(/data-dispatch-job-location/g) || []).length, 2);

const saved = context.getDispatchJobLocationDefaults("排空箱（A→B）", route, [{ id: "E2", name: "还空地", address: "调度自定义地址" }]);
assert.equal(saved[1].address, "调度自定义地址", "saved dispatch addresses take precedence over route defaults");
console.log("Dispatch job location test passed");
