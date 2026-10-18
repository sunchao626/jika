const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const api = require("./dispatch-operation-log.js");

test("dispatch list and detail expose the same accountability drawer", () => {
  assert.match(app, /data-operation-log-dispatch="\$\{dispatch\.id\}"[^>]*>操作记录<\/button>/);
  assert.match(html, /id="dispatchDetailOperationLogBtn"[^>]*>[\s\S]*?操作记录<\/button>/);
  assert.match(html, /id="dispatchOperationLogDrawer"/);
  assert.match(html, /id="dispatchOperationSearch"/);
  assert.match(html, /id="viewFullOperationLogBtn"/);
  assert.match(html, /data-operation-category="dispatch"/);
  assert.match(html, /data-operation-category="status"/);
  assert.match(html, /data-operation-category="system"/);
  assert.match(styles, /\.dispatch-operation-drawer/);
  assert.match(fs.readFileSync(path.join(root, "dispatch-operation-log.js"), "utf8"), /OperationLogManager/);
});

test("records aggregate every dispatch attempt under one waybill", () => {
  const dispatches = [
    { id: "PD-1", waybillNo: "WB-1", orderDate: "2026-10-17", dispatchMode: "manual", driverName: "司机甲", timeline: [{ node: "已派单", time: "2026-10-17 08:00", desc: "首次派单" }, { node: "取消", time: "2026-10-17 09:00", desc: "撤销派单" }] },
    { id: "PD-2", waybillNo: "WB-1", orderDate: "2026-10-17", dispatchMode: "auto", driverName: "司机乙", timeline: [{ node: "已派单", time: "2026-10-17 10:00", desc: "重新派单" }, { node: "已提货", time: "2026-10-17 11:00", desc: "司机提货" }] },
    { id: "PD-3", waybillNo: "WB-2", orderDate: "2026-10-17", timeline: [] },
  ];
  const records = api.getWaybillRecords(dispatches, "WB-1");
  assert.equal(records.length, 4);
  assert.deepEqual([...new Set(records.map((item) => item.dispatchId))].sort(), ["PD-1", "PD-2"]);
  assert.ok(records[0].time >= records.at(-1).time);
});

test("field-level audit replaces inferred timeline detail without duplication", () => {
  const dispatch = { id: "PD-1", waybillNo: "WB-1", dispatchMode: "manual", driverName: "司机甲", timeline: [{ node: "派单调整", time: "2026-10-18 09:30", desc: "调整运力" }] };
  api.ensureRecords(dispatch);
  api.record(dispatch, {
    signature: "timeline:0:2026-10-18 09:30:派单调整",
    time: "2026-10-18 09:30",
    category: "dispatch",
    action: "编辑派单",
    summary: "将司机甲调整为司机乙",
    changes: [{ field: "driver", label: "司机", before: "司机甲", after: "司机乙" }],
  });
  assert.equal(dispatch.operationRecords.length, 1);
  assert.equal(dispatch.operationRecords[0].changes[0].after, "司机乙");
});

test("record filters search accountability content and category", () => {
  const records = [
    api.normalizeRecord({ id: "PD-1", waybillNo: "WB-1" }, { category: "dispatch", action: "编辑派单", operatorName: "张调度", summary: "调整司机", changes: [{ field: "driver", before: "甲", after: "乙" }] }),
    api.normalizeRecord({ id: "PD-1", waybillNo: "WB-1" }, { category: "status", action: "完成提货", operatorName: "王司机", operatorAccount: "driver-01", summary: "司机上报提货" }),
  ];
  assert.equal(api.filterRecords(records, { category: "dispatch" }).length, 1);
  assert.equal(api.filterRecords(records, { keyword: "王司机" }).length, 1);
  assert.equal(api.filterRecords(records, { keyword: "乙" }).length, 1);
  assert.equal(api.summarize(records).operators, 2);
});

test("system operation log keeps the original dispatch event time", () => {
  const received = [];
  globalThis.OperationLogManager = { record: (entry) => received.push(entry) };
  const dispatch = { id: "PD-1", waybillNo: "WB-1", routeName: "港区线路" };
  const record = api.normalizeRecord(dispatch, {
    id: "DOP-1",
    time: "2026-10-17 08:25:00",
    action: "编辑派单",
    summary: "调整承运司机",
  });
  api.syncRecordToSystem(record, dispatch);
  delete globalThis.OperationLogManager;
  assert.equal(received.length, 1);
  assert.equal(received[0].time, "2026-10-17 08:25:00");
  assert.equal(received[0].traceId, "DISPATCH-DOP-1");
});

test("revoking a dispatch requires and records a reason", () => {
  assert.match(html, /id="revokeDispatchReason"[^>]*required/);
  assert.match(app, /if \(!reason\)[\s\S]*请填写撤销原因/);
  assert.match(app, /action: "撤销派单"/);
  assert.match(app, /reason,/);
});

