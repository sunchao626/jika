const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = __dirname;
const source = fs.readFileSync(path.join(root, "feedback-management.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const mobileHtml = fs.readFileSync(path.join(root, "mobile.html"), "utf8");
const adminMobileHtml = fs.readFileSync(path.join(root, "admin-mobile.html"), "utf8");
const mobileJs = fs.readFileSync(path.join(root, "mobile.js"), "utf8");
const adminMobileJs = fs.readFileSync(path.join(root, "admin-mobile.js"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const accessJs = fs.readFileSync(path.join(root, "user-access.js"), "utf8");

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

function loadApi() {
  const context = vm.createContext({ window: {}, Date, Math, console, CustomEvent: undefined });
  vm.runInContext(source, context);
  return context.window.FeedbackManager;
}

test("driver and manager feedback use one normalized data model", () => {
  const api = loadApi();
  const storage = createStorage();
  const driver = api.create({ id: "FB-D", source: "driver", submitterId: "SJ-1002", submitterName: "赵亮", categoryCode: "driver_dispatch", description: "派单详情中的地址显示不完整，需要优化。", createdAt: "2026-10-18 08:00" }, storage);
  const manager = api.create({ id: "FB-M", source: "manager", submitterId: "ZD-1008", submitterName: "张调度", categoryCode: "manager_report", description: "报表筛选条件希望能够保留上次选择。", createdAt: "2026-10-18 09:00" }, storage);
  assert.equal(driver.sourceLabel, "司机端");
  assert.equal(manager.sourceLabel, "管理端");
  assert.equal(api.load(storage).length, 2);
  assert.equal(api.bySubmitter("driver", "SJ-1002", storage).length, 1);
  assert.equal(api.categories("driver").some((item) => item.code === "manager_report"), false);
  assert.equal(api.categories("manager").some((item) => item.code === "manager_report"), true);
});

test("statistics use total, today, week, and month submission windows", () => {
  const api = loadApi();
  const records = [
    api.normalize({ id: "A", source: "driver", description: "A", createdAt: "2026-10-18 08:00" }),
    api.normalize({ id: "B", source: "manager", description: "B", createdAt: "2026-10-13 08:00" }),
    api.normalize({ id: "C", source: "driver", description: "C", createdAt: "2026-10-01 08:00" }),
    api.normalize({ id: "D", source: "driver", description: "D", createdAt: "2026-09-30 08:00" }),
  ];
  const stats = api.stats(records, new Date("2026-10-18T12:00:00"));
  assert.deepEqual({ ...stats }, { all: 4, today: 1, week: 2, month: 3 });
  assert.equal(api.filter(records, { source: "driver", period: "month" }, new Date("2026-10-18T12:00:00")).length, 2);
});

test("processing preserves history and public replies", () => {
  const api = loadApi();
  const storage = createStorage();
  api.create({ id: "FB-1", source: "driver", submitterId: "SJ-1002", submitterName: "赵亮", categoryCode: "system_error", description: "运输节点页面无法打开，请协助处理。" }, storage);
  const updated = api.update("FB-1", { status: "resolved", handlerName: "系统管理员", publicReply: "问题已修复，请重新进入页面。" }, "系统管理员", storage);
  assert.equal(updated.status, "resolved");
  assert.equal(updated.publicReply, "问题已修复，请重新进入页面。");
  assert.ok(updated.history.some((item) => item.action === "status"));
  assert.ok(updated.history.some((item) => item.action === "reply"));
});

test("media rules allow images and videos within limits", () => {
  const api = loadApi();
  assert.equal(api.validateFiles([{ name: "screen.png", type: "image/png", size: 1024 }, { name: "issue.mp4", type: "video/mp4", size: 4096 }]).error, "");
  assert.match(api.validateFiles([{ name: "large.png", type: "image/png", size: 11 * 1024 * 1024 }]).error, /10 MB/);
  assert.match(api.validateFiles([{ name: "doc.pdf", type: "application/pdf", size: 1024 }]).error, /图片或视频/);
  assert.match(api.validateFiles(Array.from({ length: 3 }, (_, index) => ({ name: `${index}.mp4`, type: "video/mp4", size: 1024 }))).error, /最多上传 2 个/);
});

test("all three products expose the unified feedback workflow", () => {
  assert.match(mobileHtml, /data-profile-page="feedback"[^>]*>[\s\S]*?意见反馈/);
  assert.ok(mobileHtml.indexOf('src="feedback-management.js"') < mobileHtml.indexOf('src="mobile.js"'));
  assert.match(mobileJs, /id="driverFeedbackForm"/);
  assert.match(mobileJs, /FeedbackManager\.saveAttachments/);
  assert.match(adminMobileHtml, /data-profile-action="help"[^>]*>[\s\S]*?帮助与反馈/);
  assert.ok(adminMobileHtml.indexOf('src="feedback-management.js"') < adminMobileHtml.indexOf('src="admin-mobile.js"'));
  assert.match(adminMobileJs, /id="managerFeedbackForm"/);
  assert.match(adminMobileJs, /source: "manager"/);
  assert.match(indexHtml, /data-page="feedback-management"[^>]*>意见反馈管理/);
  assert.match(indexHtml, /id="feedbackManagementPage"/);
  assert.match(source, /\["all", "意见反馈总数"/);
  assert.match(appJs, /"feedback-management": \{ title: "意见反馈管理"/);
  assert.match(accessJs, /id: "feedbackManagement", name: "意见反馈管理"/);
});

console.log("Unified feedback management tests passed");
