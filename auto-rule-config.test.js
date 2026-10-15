const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "auto-dispatch.js"), "utf8");
const sharedRules = fs.readFileSync(path.join(root, "dispatch-rules.js"), "utf8");

test("自动派单规则说明包含过滤、打分和兜底规则", () => {
  assert.match(html, /查看规则说明/);
  assert.match(html, /过滤规则/);
  assert.match(html, /打分规则/);
  assert.match(html, /兜底规则/);
  assert.match(html, /车辆状态 = 空闲/);
  assert.match(html, /订单状态改为“待人工派单”/);
});

test("自动派单规则配置覆盖全部硬规则和软规则", () => {
  for (const field of [
    "filterVehicleStatus",
    "filterDriverStatus",
    "filterDailyTrips",
    "filterCapacity",
    "filterTimeWindow",
    "filterCrossRoute",
    "scoreIdle",
    "scoreInTransit",
    "scoreRouteMatch",
    "scoreDriverLoad",
    "scoreDistance",
    "scoreDelay",
    "scoreTimeTight",
  ]) {
    assert.match(script, new RegExp(field));
  }
  assert.match(script, /collectRuleControls/);
  assert.match(script, /ruleConfig/);
  assert.match(html, /dispatch-rules\.js[\s\S]*app\.js/);
  assert.match(script, /DispatchRuleRegistry\?\.scoreMatch/);
  assert.match(sharedRules, /线路专属车辆/);
  assert.match(sharedRules, /司机熟悉线路/);
});
