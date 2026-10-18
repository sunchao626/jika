const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const access = fs.readFileSync(path.join(root, "user-access.js"), "utf8");
const platformConfig = fs.readFileSync(path.join(root, "platform-config.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const api = require("./operation-log.js");

test("operation logs are linked from system settings and the permission matrix", () => {
  assert.match(html, /data-page="operation-logs"[^>]*>操作日志<\/button>/);
  assert.match(html, /id="operationLogPage"/);
  assert.match(html, /id="operationLogDetailDialog"/);
  assert.match(app, /"operation-logs": \{ title: "操作日志", kicker: "系统配置 \/ 操作日志", view: "operationLogs" \}/);
  assert.match(app, /window\.OperationLogManager\?\.render\(\)/);
  assert.match(access, /id: "operationLogs", name: "操作日志", actions: \["view"\]/);
  assert.match(access, /window\.OperationLogManager\.record/);
  assert.match(platformConfig, /function recordAudit/);
  assert.match(platformConfig, /window\.OperationLogManager\?\.record/);
  assert.match(styles, /\.operation-log-table/);
});

test("all requested search and filter controls are present", () => {
  for (const name of ["keyword", "module", "action", "operator", "result", "startDate", "endDate"]) {
    assert.match(html, new RegExp(`name="${name}"`));
  }
  for (const column of ["操作时间", "操作模块", "操作类型", "操作人", "操作对象", "操作内容", "结果"]) {
    assert.match(html, new RegExp(`<th>${column}</th>`));
  }
  assert.match(html, /管理员只读/);
  assert.doesNotMatch(html.slice(html.indexOf('id="operationLogPage"'), html.indexOf('id="operationLogDetailDialog"')), /新增日志|删除日志|编辑日志/);
});

test("log filtering supports keyword, dimensions, result, and inclusive dates", () => {
  assert.ok(api.seedLogs.length >= 10);
  assert.ok(api.filterLogs(api.seedLogs, { keyword: "WB20261018012" }).every((item) => item.targetId === "WB20261018012"));
  assert.ok(api.filterLogs(api.seedLogs, { module: "userAccess" }).every((item) => item.moduleId === "userAccess"));
  assert.ok(api.filterLogs(api.seedLogs, { action: "login", result: "failure" }).every((item) => item.actionId === "login" && item.result === "failure"));
  const dated = api.filterLogs(api.seedLogs, { startDate: "2026-10-17", endDate: "2026-10-17" });
  assert.ok(dated.length > 0);
  assert.ok(dated.every((item) => item.time.startsWith("2026-10-17")));
});

test("pagination clamps pages and keeps newest records first", () => {
  const sorted = api.filterLogs(api.seedLogs, {});
  assert.ok(sorted[0].time >= sorted.at(-1).time);
  const first = api.paginate(sorted, 1, 5);
  assert.equal(first.rows.length, 5);
  assert.equal(first.currentPage, 1);
  const overflow = api.paginate(sorted, 999, 5);
  assert.equal(overflow.currentPage, overflow.totalPages);
});

test("normalized records retain audit detail without inventing edit operations", () => {
  const record = api.normalizeLog({ content: "登录失败", result: "failure", failureReason: "账号已停用", changes: [] });
  assert.equal(record.result, "failure");
  assert.equal(record.failureReason, "账号已停用");
  assert.ok(record.id.startsWith("LOG-"));
  assert.ok(record.traceId.startsWith("TRC-"));
  assert.equal(api.formatShanghaiTimestamp(new Date("2026-10-18T02:30:45Z")), "2026-10-18 10:30:45");
});

test("records with the same trace id update instead of duplicating", () => {
  const logs = [];
  api.upsertLog(logs, { traceId: "TRC-DISPATCH-1", time: "2026-10-18 09:00:00", content: "推断记录" });
  api.upsertLog(logs, { traceId: "TRC-DISPATCH-1", time: "2026-10-18 09:00:00", content: "字段级记录", changes: [{ field: "driver", before: "甲", after: "乙" }] });
  assert.equal(logs.length, 1);
  assert.equal(logs[0].content, "字段级记录");
  assert.equal(logs[0].changes[0].after, "乙");
});
