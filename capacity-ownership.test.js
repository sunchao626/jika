const assert = require("node:assert/strict");

const storage = new Map();
global.localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
};

const CapacityOwnership = require("./capacity-ownership.js");

assert.equal(CapacityOwnership.normalizeType("自有司机"), "自营");
assert.equal(CapacityOwnership.normalizeType("外协"), "三方");
assert.equal(CapacityOwnership.SELF_ORGANIZATION, "万物时空");
assert.equal(CapacityOwnership.normalizeOrganizationName("本公司"), "万物时空");
assert.match(CapacityOwnership.badgeMarkup("自营", "司机：王师傅 · 本公司"), /司机：王师傅 · 万物时空/);

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
assert.match(mixed.tooltip, /司机：王师傅 · 万物时空/);
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

storage.set(CapacityOwnership.STORAGE_KEY, "[]");
storage.set(CapacityOwnership.CUSTOMER_STORAGE_KEY, JSON.stringify([
  { customerNo: "KH-2001", customerName: "仅客户单位", businessRole: "客户", customerStatus: "启用" },
  { customerNo: "KH-2002", customerName: "统一三方单位", businessRole: "客户+三方供应商", customerStatus: "启用", contactName: "周经理", mobile: "13800002002", legacySupplierId: "SUP-009" },
]));
assert.deepEqual(CapacityOwnership.readSuppliers().map((item) => item.id), ["KH-2002"]);
assert.equal(CapacityOwnership.findSupplier("SUP-009").name, "统一三方单位");
assert.equal(CapacityOwnership.findSupplier("统一三方单位").contact, "周经理");
assert.equal(CapacityOwnership.findSupplier("仅客户单位"), undefined);

console.log("Capacity ownership rules test passed");
