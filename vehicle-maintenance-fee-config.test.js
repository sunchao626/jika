const test = require("node:test");
const assert = require("node:assert/strict");
const FeeConfig = require("./vehicle-maintenance-fee-config.js");
const html = require("node:fs").readFileSync("index.html", "utf8");
const app = require("node:fs").readFileSync("app.js", "utf8");

test("default maintenance fees include insurance, inspection and Beidou", () => {
  const items = FeeConfig.load({ getItem: () => null });
  assert.ok(items.some((item) => item.name === "交强险" && item.periodRequired && item.serviceProviderRequired));
  assert.ok(items.some((item) => item.name === "商业险" && item.costMode === "direct"));
  assert.ok(items.some((item) => item.category === "审验费用"));
  assert.ok(items.some((item) => item.name === "北斗服务费"));
});

test("fee project code is unique and reminders require a period", () => {
  const existing = [FeeConfig.normalize({ id: "MF-1", code: "BX-JQX", name: "交强险" })];
  assert.match(FeeConfig.validate(existing, { code: "BX-JQX", name: "重复项目" }), /已存在/);
  assert.match(FeeConfig.validate(existing, { code: "NEW", name: "新项目", reminderEnabled: true, periodRequired: false }), /起止时间/);
});

test("fee project persistence keeps rule switches", () => {
  const storage = new Map();
  const adapter = { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) };
  FeeConfig.save([{ code: "BY-001", name: "专项保养", category: "保养费用", costMode: "parts_labor", affectsDispatch: true, enabled: true }], adapter);
  const [saved] = FeeConfig.load(adapter);
  assert.equal(saved.costMode, "parts_labor");
  assert.equal(saved.affectsDispatch, true);
});

test("maintenance configuration and record query are routed in the interface", () => {
  assert.match(html, /data-page="vehicle-maintenance-fees"[^>]*>车辆维护费用配置/);
  assert.match(html, /id="vehicleMaintenanceFeeConfigPage"/);
  assert.match(html, /data-repair-tab="records"[^>]*>维修保养记录查询/);
  assert.match(app, /"vehicle-maintenance-fees": \{ title: "车辆维护费用配置"/);
});

test("creation time is readonly while actual repair time is selected", () => {
  assert.match(html, /创建时间<input name="createdAt" type="datetime-local" readonly/);
  assert.match(html, /维修时间<\/span><input name="repairedAt" type="datetime-local" required/);
  assert.match(app, /createdAt: currentRepair\?\.createdAt \|\| currentRepair\?\.reportedAt \|\| currentLocalDateTimeValue\(\)/);
});

test("work order items expose configured costs and automatic total", () => {
  assert.match(html, /id="addVehicleRepairItemBtn"/);
  assert.match(html, /name="partsCost"/);
  assert.match(html, /name="laborCost"/);
  assert.match(html, /name="otherCost"/);
  assert.match(html, /id="vehicleRepairTotal"/);
  assert.match(app, /VehicleRepair\.calculateTotal\(vehicleRepairDraftItems\)/);
});
