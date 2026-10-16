const assert = require("node:assert/strict");

const storage = new Map();
global.localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
};

const CapacityOwnership = require("./capacity-ownership.js");

assert.equal(CapacityOwnership.normalizeType("自有司机"), "自营");
assert.equal(CapacityOwnership.normalizeType("外协"), "三方");

const migrated = CapacityOwnership.normalizeResource({ driverType: "外协司机", fleet: "杭州危运车队" }, "driver");
assert.equal(migrated.capacityOwnership, "三方");
assert.equal(migrated.supplierName, "杭州危险品运输车队");
assert.ok(migrated.supplierId);

const mixed = CapacityOwnership.groupSnapshot([
  { role: "司机", name: "王师傅", capacityOwnership: "自营" },
  { role: "车辆", name: "浙B12345", capacityOwnership: "三方", supplierName: "临港外协集卡车队" },
]);
assert.equal(mixed.type, "自营+三方");
assert.deepEqual(mixed.supplierNames, ["临港外协集卡车队"]);
assert.match(mixed.tooltip, /司机：王师傅 · 本公司/);
assert.match(mixed.tooltip, /车辆：浙B12345 · 临港外协集卡车队/);

assert.equal(CapacityOwnership.matchesFilter("自营", "自营+三方", true), true);
assert.equal(CapacityOwnership.matchesFilter("三方", "自营+三方", true), true);
assert.equal(CapacityOwnership.matchesFilter("自营", "自营+三方"), false);

const sorted = CapacityOwnership.sortSelfFirst([
  { id: "third", capacityOwnership: "三方" },
  { id: "self", capacityOwnership: "自营" },
  { id: "mixed", capacityOwnership: "自营+三方" },
]);
assert.deepEqual(sorted.map((item) => item.id), ["self", "mixed", "third"]);

const supplier = CapacityOwnership.ensureSupplier("宁波测试供应商", { contact: "李经理" });
assert.equal(CapacityOwnership.findSupplier("宁波测试供应商").id, supplier.id);
assert.equal(CapacityOwnership.findSupplier(supplier.id).contact, "李经理");
const renamedSuppliers = CapacityOwnership.readSuppliers();
renamedSuppliers.find((item) => item.id === supplier.id).name = "宁波测试供应商（新）";
CapacityOwnership.saveSuppliers(renamedSuppliers);
const renamedResource = CapacityOwnership.normalizeResource({ capacityOwnership: "三方", supplierId: supplier.id, supplierName: "宁波测试供应商" }, "vehicle");
assert.equal(renamedResource.supplierName, "宁波测试供应商（新）");
assert.equal(CapacityOwnership.organizationName(renamedResource), "宁波测试供应商（新）");

console.log("Capacity ownership rules test passed");
