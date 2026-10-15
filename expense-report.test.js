const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("mobile.js", "utf8");
const html = fs.readFileSync("mobile.html", "utf8");
const styles = fs.readFileSync("mobile.css", "utf8");
const expenseReport = require("./expense-report.js");

assert.match(html, /data-profile-page="expenses"[^>]*>[\s\S]*费用上报/);
assert.match(html, /<script src="expense-report\.js"><\/script>/);
for (const label of ["加油", "充电", "燃气费", "路桥费", "停车费", "维修", "提箱费", "其他"]) {
  assert.match(source, new RegExp(`label: "${label}"`));
}
assert.match(source, /expenses: "费用上报"/);
assert.match(source, /id="expenseForm"/);
assert.match(source, /name="dispatchId" data-expense-waybill required/);
assert.match(source, /name="vehicleId" required/);
assert.match(source, /name="customType" type="text"[^>]*required/);
assert.match(source, /name="amount" type="number"/);
assert.match(source, /name="date" type="date"/);
assert.match(source, /name="receipt" type="file"/);
assert.match(source, /name="remark" rows="3"/);
assert.match(source, /state\.expenses\.unshift\(\{/);
assert.match(source, /saveExpenses\(state\.expenses\)/);
assert.match(source, /waybillNo: dispatch\.waybillNo/);
assert.match(source, /vehicleId,/);
assert.match(source, /function expenseStatusMeta/);
assert.match(source, /data-expense-type/);
assert.match(source, /back-expense-types/);
assert.match(source, /function openProfileSubpage[\s\S]*elements\.bottomNav\.hidden = true/);
assert.match(source, /function closeProfileSubpage[\s\S]*elements\.bottomNav\.hidden = false/);
assert.match(styles, /\.expense-type-grid \{ display: grid; grid-template-columns: repeat\(2/);
assert.match(styles, /\.expense-upload\.selected/);
assert.match(styles, /\.expense-field select/);

const dispatches = [
  { id: "completed-new", driverId: "D1", status: "已完成", dispatchTime: "2026-10-13 18:00" },
  { id: "active-old", driverId: "D1", status: "运输中", dispatchTime: "2026-10-12 08:00" },
  { id: "active-new", driverId: "D1", status: "运输中", dispatchTime: "2026-10-14 09:00" },
  { id: "pending", driverId: "D1", status: "已派单", dispatchTime: "2026-10-14 10:00" },
  { id: "other-driver", driverId: "D2", status: "运输中", dispatchTime: "2026-10-14 11:00" },
];
assert.equal(expenseReport.getDefaultDispatch(dispatches, "D1").id, "active-new");
assert.deepEqual(expenseReport.getSelectableDispatches(dispatches, "D1").map((item) => item.id), ["active-new", "active-old", "completed-new"]);
assert.equal(expenseReport.getDefaultDispatch(dispatches.filter((item) => item.status !== "运输中"), "D1").id, "completed-new");
assert.equal(expenseReport.getDefaultDispatch([], "D1"), null);

console.log("Mobile expense report test passed");
