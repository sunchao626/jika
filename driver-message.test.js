const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("mobile.html", "utf8");
const source = fs.readFileSync("mobile.js", "utf8");

assert.match(html, /data-view="messages"[^>]*>[\s\S]*?<span>消息<\/span>/);
assert.match(html, /id="driverMessageTabs"[\s\S]*data-message-filter="task"[\s\S]*data-message-filter="warning"[\s\S]*data-message-filter="announcement"/);
assert.match(html, /id="driverReadAllButton"/);
assert.doesNotMatch(html, /data-view="assistant"|id="assistantView"/);

const start = source.indexOf("function loadReadDriverMessageIds(");
const end = source.indexOf("function normalizeDemoDispatches(", start);
assert.ok(start >= 0 && end > start, "driver message helpers must exist");

const storage = new Map();
const dispatches = [
  { id: "D-1", waybillNo: "WB-1", routeName: "临港至嘉定", status: "已派单", dispatchTime: "2026-10-14 08:30" },
];
const context = vm.createContext({
  state: { currentDriverId: "SJ-1001" },
  DRIVER_MESSAGE_READ_STORAGE_KEY: "container-logistics-driver-message-read-v1",
  DEMO_DRIVER_ANNOUNCEMENT: {
    id: "driver-demo-announcement-20261014",
    title: "安全公告",
    content: "请规范作业",
    type: "公告",
    publishedAt: "2026-10-14 09:15",
  },
  localStorage: {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
  },
  currentDriver: () => ({ licenseExpiry: "2000-01-01", qualificationExpiry: "2099-01-01" }),
  currentDriverAnnouncements: () => [],
  driverDispatches: () => dispatches,
  daysUntil: (date) => date === "2000-01-01" ? -1 : 800,
});
vm.runInContext(`${source.slice(start, end)}\nthis.api = { driverMessages, saveDriverMessageReadIds };`, context);

const firstDriverMessages = context.api.driverMessages();
assert.ok(firstDriverMessages.some((item) => item.type === "task" && item.dispatchId === "D-1"));
assert.ok(firstDriverMessages.some((item) => item.type === "warning" && item.title === "驾驶证已过期"));
assert.ok(firstDriverMessages.some((item) => item.type === "announcement" && item.id === "driver-demo-announcement-20261014"));

context.api.saveDriverMessageReadIds(["task-D-1"]);
assert.equal(context.api.driverMessages().find((item) => item.id === "task-D-1").unread, false);
context.state.currentDriverId = "SJ-1002";
assert.equal(context.api.driverMessages().find((item) => item.id === "task-D-1").unread, true);

console.log("Driver message center tests passed");
