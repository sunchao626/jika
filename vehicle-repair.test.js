const test = require("node:test");
const assert = require("node:assert/strict");
const VehicleRepair = require("./vehicle-repair.js");

test("repair submission creates a driver-sourced record and preserves submitter", () => {
  const result = VehicleRepair.createRecord([], {
    plateNo: "沪D·A9021", description: "右后轮漏气", source: "司机报修", reporterId: "SJ-1002", reporterName: "赵亮",
  }, { id: "WX-1", now: "2026-10-14T08:00:00", vehicleState: "在用" });
  assert.equal(result.record.source, "司机报修");
  assert.equal(result.record.reporterName, "赵亮");
  assert.equal(result.record.status, "待维修");
  assert.equal(result.record.previousVehicleState, "在用");
});

test("only one open repair per vehicle is allowed", () => {
  const created = VehicleRepair.createRecord([], { plateNo: "沪D·A9021", description: "轮胎故障" }, { id: "WX-1" });
  assert.match(VehicleRepair.createRecord([created.record], { plateNo: "沪D·A9021", description: "灯故障" }).error, /未完成维修单/);
});

test("closing the final repair restores the prior usable vehicle state", () => {
  const created = VehicleRepair.createRecord([], { plateNo: "浙B·K7812", description: "故障" }, { id: "WX-1", vehicleState: "在用" });
  const started = VehicleRepair.transition([created.record], "WX-1", "维修中", { now: "2026-10-14T09:00:00" });
  assert.equal(started.vehicleState, "维修中");
  const completed = VehicleRepair.transition(started.records, "WX-1", "已完成", { now: "2026-10-14T10:00:00" });
  assert.equal(completed.vehicleState, "在用");
  assert.equal(completed.record.startedAt, "2026-10-14T09:00:00");
});

test("closing a repair does not release a vehicle with another open repair", () => {
  const first = VehicleRepair.createRecord([], { plateNo: "沪D·A9021", description: "故障一" }, { id: "WX-1" }).record;
  const second = { ...VehicleRepair.createRecord([], { plateNo: "浙B·K7812", description: "故障二" }, { id: "WX-2" }).record, plateNo: first.plateNo };
  const result = VehicleRepair.transition([first, second], first.id, "已取消");
  assert.equal(result.vehicleState, "维修中");
});

test("cancelled repair restores a previously stopped vehicle as stopped", () => {
  const created = VehicleRepair.createRecord([], { plateNo: "苏E·T5568", description: "故障" }, { id: "WX-1", vehicleState: "停用" });
  const result = VehicleRepair.transition([created.record], "WX-1", "已取消");
  assert.equal(result.vehicleState, "停用");
});

test("uploaded evidence references survive repair record persistence", () => {
  const storage = new Map();
  const adapter = { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) };
  const file = { id: "repair-file-1", name: "故障照片.jpg", type: "image/jpeg", uploadedAt: "2026-10-14 08:00" };
  VehicleRepair.save([{ id: "WX-1", plateNo: "沪D·A9021", evidence: [file] }], adapter);
  assert.deepEqual(VehicleRepair.load(adapter)[0].evidence, [file]);
});
