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

const legacyMixed = CapacityOwnership.normalizeResource({ capacityOwnership: "混合运力", supplierId: "", supplierName: "" }, "vehicle");
assert.equal(legacyMixed.capacityOwnership, "自营");
assert.equal(legacyMixed.ownership, "自有");
assert.equal(CapacityOwnership.normalizeType("待确定"), "自营");
const staleAlias = CapacityOwnership.normalizeResource({ capacityOwnership: "待确定", ownership: "外协", supplierName: "临港外协集卡车队" }, "vehicle");
assert.equal(staleAlias.capacityOwnership, "三方", "a determinate legacy alias wins over a stale pending field");

const mismatched = CapacityOwnership.groupSnapshot([
  { role: "司机", name: "王师傅", capacityOwnership: "自营" },
  { role: "车辆", name: "浙B12345", capacityOwnership: "三方", supplierName: "临港外协集卡车队" },
]);
assert.equal(mismatched.type, "三方", "the vehicle determines the stored snapshot while compatibility remains false");
assert.equal(mismatched.compatible, false);
assert.deepEqual(mismatched.supplierNames, ["临港外协集卡车队"]);
assert.match(mismatched.tooltip, /司机：王师傅 · 万物时空/);
assert.match(mismatched.tooltip, /车辆：浙B12345 · 临港外协集卡车队/);

assert.equal(CapacityOwnership.normalizeType("自营+三方"), "自营");
assert.equal(CapacityOwnership.isCompatible([
  { capacityOwnership: "三方" }, { capacityOwnership: "三方" },
]), true);
assert.equal(CapacityOwnership.isCompatible([
  { capacityOwnership: "自营" }, { capacityOwnership: "三方" },
]), false);
const missingResource = CapacityOwnership.groupSnapshot([
  { role: "司机", capacityOwnership: "自营" },
  { role: "车辆", capacityOwnership: "三方" },
], { missingRequired: true });
assert.equal(missingResource.type, "三方");
assert.equal(missingResource.compatible, false, "a missing assigned resource must fail compatibility checks");
assert.equal(CapacityOwnership.groupSnapshot([]).type, "自营");
assert.equal(CapacityOwnership.matchesFilter("自营", "三方"), false);

const sorted = CapacityOwnership.sortSelfFirst([
  { id: "third", capacityOwnership: "三方" },
  { id: "self", capacityOwnership: "自营" },
]);
assert.deepEqual(sorted.map((item) => item.id), ["self", "third"]);

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
