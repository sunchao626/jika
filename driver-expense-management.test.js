const assert = require("node:assert/strict");
const fs = require("node:fs");
const expenseReport = require("./expense-report.js");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const mobile = fs.readFileSync("mobile.js", "utf8");

assert.match(html, /data-page="driver-expenses"[^>]*>司机费用上报/);
assert.match(html, /id="driverExpensePage"/);
assert.match(html, /id="driverExpenseQueryForm"/);
for (const field of ["driverId", "keyword", "type", "status", "startDate", "endDate"]) {
  assert.match(html, new RegExp(`name="${field}"`));
}
for (const id of ["driverExpenseSelectAll", "driverExpenseSelectPageBtn", "driverExpenseInvertPageBtn", "driverExpenseApproveSelectedBtn", "driverExpenseApproveAllBtn"]) {
  assert.match(html, new RegExp(`id="${id}"`));
}
for (const label of ["上报编号", "司机", "关联运单", "车辆", "费用类型", "金额", "发生日期", "费用凭证", "备注", "上报时间", "审核状态", "审核信息", "操作"]) {
  assert.ok(html.includes(label), `missing expense column: ${label}`);
}
assert.match(html, /id="driverExpenseReviewDialog"/);
assert.match(html, /id="rejectDriverExpenseBtn"[^>]*>驳回/);
assert.match(html, /id="approveDriverExpenseBtn"[^>]*>审核通过/);
assert.match(app, /"driver-expenses": \{ title: "司机费用上报"/);
assert.match(app, /DRIVER_EXPENSE_STORAGE_KEY = "container-logistics-driver-expenses-v1"/);
assert.match(app, /function renderDriverExpensePage/);
assert.match(app, /function applyDriverExpenseReview/);
assert.match(app, /function mergeDriverExpenseRecords/);
assert.match(app, /type: "driver-expense-sync-data"/);
assert.match(app, /data-driver-expense-action="approve"/);
assert.match(app, /data-driver-expense-action="reject"/);
assert.match(app, /当前筛选结果中的全部/);
assert.match(styles, /\.driver-expense-table-tools/);
assert.match(styles, /\.driver-expense-status\.approved/);
assert.match(mobile, /expenseStatusMeta/);
assert.match(mobile, /event\.key === EXPENSE_STORAGE_KEY/);
assert.match(mobile, /type: "driver-expense-update"/);
assert.match(mobile, /"driver-expense-sync-data"/);

const records = [
  { id: "E1", driverId: "D1", driverName: "赵亮", type: "fuel", typeLabel: "加油", date: "2026-10-14", status: "pending", waybillNo: "WB1", vehicleId: "沪D1" },
  { id: "E2", driverId: "D1", driverName: "赵亮", type: "parking", typeLabel: "停车费", date: "2026-10-13", status: "approved", waybillNo: "WB2", vehicleId: "沪D1" },
  { id: "E3", driverId: "D2", driverName: "王海", type: "repair", typeLabel: "维修", date: "2026-10-12", status: "pending", waybillNo: "WB3", vehicleId: "浙B1" },
];

assert.deepEqual(expenseReport.filterRecords(records, { driverId: "D1" }).map((item) => item.id), ["E1", "E2"]);
assert.deepEqual(expenseReport.filterRecords(records, { keyword: "wb3", status: "pending" }).map((item) => item.id), ["E3"]);
assert.deepEqual(expenseReport.filterRecords(records, { startDate: "2026-10-13", endDate: "2026-10-14" }).map((item) => item.id), ["E1", "E2"]);

const reviewed = expenseReport.applyReview(records, ["E1", "E2"], "approved", { reviewedAt: "2026-10-14 10:00", reviewedBy: "管理员" });
assert.equal(reviewed[0].status, "approved");
assert.equal(reviewed[0].reviewedBy, "管理员");
assert.equal(reviewed[1].status, "approved", "already reviewed records should remain unchanged");
assert.equal(reviewed[1].reviewedBy, undefined, "already reviewed records must not be reviewed again");

const rejected = expenseReport.applyReview(records, ["E3"], "rejected", { rejectionReason: "缺少凭证" });
assert.equal(rejected[2].status, "rejected");
assert.equal(rejected[2].rejectionReason, "缺少凭证");

console.log("Driver expense management test passed");
