const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("settlement-management.js", "utf8");
const start = source.indexOf("  function latestCompletedDispatch");
const end = source.indexOf("  function completedTime", start);
assert.ok(start >= 0 && end > start, "settlement container helpers must exist");

const waybills = [
  { waybillNo: "WB-1", boxNo1: "TCLU8374621", boxNo2: "MSKU4920184" },
  { waybillNo: "WB-2", containers: [{ boxNo: "OOLU1000001" }, { boxNo: "CMAU6502739" }] },
];
const dispatches = [
  { waybillNo: "WB-1", status: "已完成", dispatchTime: "2026-10-01", boxNo1: "TCLU8374621", boxNo2: "MSKU4920184" },
  { waybillNo: "WB-2", status: "已完成", dispatchTime: "2026-10-02" },
];
const context = vm.createContext({ waybills, dispatches });
vm.runInContext(source.slice(start, end), context);

assert.equal(context.matchesContainerNumber("tclu837", { waybillNo: "WB-1" }), true, "箱号1应支持忽略大小写的部分匹配");
assert.equal(context.matchesContainerNumber("4920184", { waybillNo: "WB-1" }), true, "箱号2应参与 OR 匹配");
assert.equal(context.matchesContainerNumber("6502739", { waybillNo: "WB-2" }), true, "历史记录应回查运单 containers 数组中的第二箱号");
assert.equal(context.matchesContainerNumber("4920184", { waybillNo: "WB-1", boxNo1: "LOCKED000001", boxNo2: "-" }), false, "已生成单据应以箱号快照为准");
assert.equal(context.matchesContainerNumber("NOT-FOUND", { waybillNo: "WB-1" }), false, "无匹配箱号不应返回记录");
assert.equal(context.matchesContainerNumber("", { waybillNo: "WB-1" }), true, "空查询应保留全部记录");

console.log("Settlement container number filter test passed");
