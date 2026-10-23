const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const mobile = fs.readFileSync("mobile.js", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const adminMobile = fs.readFileSync("admin-mobile.js", "utf8");
const mobileStyles = fs.readFileSync("mobile.css", "utf8");

const profiles = {
  "提空装货": { jobLocations: [{ id: "A", name: "提空地" }, { id: "B", name: "装货地" }, { id: "C", name: "落重地" }] },
  "排空箱（A→B）": { jobLocations: [{ id: "D", name: "提空地" }, { id: "E", name: "还空地" }] },
};
const start = mobile.indexOf("function dispatchJobLocations(");
const end = mobile.indexOf("function taskNodes(", start);
assert.ok(start >= 0 && end > start, "driver job-location helpers should exist");
const context = vm.createContext({
  window: { DispatchTaskNodes: { profile: (type) => profiles[type] || null } },
  dispatchTaskType: (dispatch) => dispatch.taskType,
  h: (value) => String(value ?? ""),
});
vm.runInContext(mobile.slice(start, end), context);

const threeLocations = context.dispatchJobLocations({ taskType: "提空装货", origin: "港区空箱场", destination: "客户仓库", loadAddress: "铁路站" });
assert.deepEqual(threeLocations.map((item) => [item.name, item.address]), [["提空地", "港区空箱场"], ["装货地", "客户仓库"], ["落重地", "铁路站"]]);
const twoLocations = context.dispatchJobLocations({ taskType: "排空箱（A→B）", origin: "A 堆场", loadAddress: "B 堆场", destination: "旧终点" });
assert.deepEqual(twoLocations.map((item) => [item.name, item.address]), [["提空地", "A 堆场"], ["还空地", "B 堆场"]]);

const supplied = context.dispatchJobLocations({ taskType: "提空装货", jobLocations: [{ id: "A", name: "提空地", address: "自定义 A" }, { id: "B", name: "装货地", address: "自定义 B" }, { id: "C", name: "落重地", address: "自定义 C" }] });
assert.equal(supplied[2].address, "自定义 C", "dispatch-specific addresses must take precedence");
const markup = context.renderDispatchJobLocations({ taskType: "排空箱（A→B）", origin: "A 堆场", loadAddress: "B 堆场" }, "test-locations");
assert.equal((markup.match(/driver-job-location-row/g) || []).length, 2);
assert.match(markup, /作业地点[\s\S]*2 个地点[\s\S]*01[\s\S]*提空地[\s\S]*02[\s\S]*还空地/);

const taskCard = mobile.slice(mobile.indexOf("function taskCard("), mobile.indexOf("function emptyState("));
const orderCard = mobile.slice(mobile.indexOf("function orderCard("), mobile.indexOf("function renderOrders("));
const detail = mobile.slice(mobile.indexOf("function renderDetail("), mobile.indexOf("function renderAll("));
assert.match(taskCard, /renderDispatchJobLocations\(dispatch, "task-card-locations"\)/);
assert.doesNotMatch(taskCard, /class="route-block"/, "pending/active cards should not duplicate the old two-point route");
assert.match(orderCard, /renderDispatchJobLocations\(dispatch, "order-card-locations"\)/);
assert.doesNotMatch(orderCard, /class="order-route"/, "waybill cards should not duplicate the old two-point route");
assert.match(detail, /renderDispatchJobLocations\(dispatch, "detail-job-locations"\)/);
assert.doesNotMatch(detail, /class="route-block"/, "driver details should use the configured job locations only");

assert.match(app, /class="dispatch-list-job-locations"[\s\S]*padStart\(2, "0"\)[\s\S]*location\.name/);
assert.match(app, /dispatch\.jobLocations\?\.length \? dispatch\.jobLocations : waybill\?\.jobLocations\?\.length \? waybill\.jobLocations/);
assert.match(adminMobile, /function dispatchJobLocationRows\(/);
assert.match(adminMobile, /作业地点 · \$\{h\(jobLocationRows\.length\)\} 个/);
assert.match(mobileStyles, /\.driver-job-location-row/);

console.log("Two-stop and three-stop job-location display test passed");
