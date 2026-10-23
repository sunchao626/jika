const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");

const planStart = html.indexOf("计划与派单");
const routeStart = html.indexOf("线路管理", planStart);
const vehicleStart = html.indexOf("车辆管理", routeStart);
assert.ok(planStart >= 0 && routeStart > planStart && vehicleStart > routeStart, "线路管理应位于计划与派单和车辆管理之间");

const planSection = html.slice(html.lastIndexOf('<section class="nav-section', planStart), routeStart);
const routeSection = html.slice(html.lastIndexOf('<section class="nav-section', routeStart), vehicleStart);
assert.doesNotMatch(planSection, /data-page="fixed-routes"/);
assert.match(routeSection, /线路管理[\s\S]*data-page="fixed-routes"[^>]*>固定线路管理<\/button>/);
assert.doesNotMatch(html, />办公管理<\/button>/);
assert.doesNotMatch(html, />基础资料<\/button>/);
const dashboardStart = html.indexOf("数据看板");
const settlementStart = html.indexOf("结算管理", dashboardStart);
assert.ok(dashboardStart >= 0 && settlementStart > dashboardStart, "数据看板应位于结算管理之前");
const dashboardSection = html.slice(html.lastIndexOf('<section class="nav-section', dashboardStart), html.indexOf('</section>', dashboardStart));
const settlementSection = html.slice(html.lastIndexOf('<section class="nav-section', settlementStart), html.indexOf('</section>', settlementStart));
assert.doesNotMatch(dashboardSection, /data-page="finance-reports"|运输成本台账/);
assert.doesNotMatch(dashboardSection, /data-page="driver-expenses"|data-page="settlement-management"/);
assert.match(settlementSection, /结算中心[\s\S]*data-page="settlement-management"[^>]*>结算管理<\/button>[\s\S]*data-page="driver-expenses"[^>]*>司机费用上报<\/button>/);
assert.match(settlementSection, /data-page="finance-reports"[^>]*>运输管理台账<\/button>/);
for (const [page, label] of [
  ["settlement-receivable", "应收账款管理"],
  ["settlement-payable", "三方应付结算"],
  ["settlement-payroll", "自营结算"],
  ["settlement-abnormal", "异常费用管理"],
  ["settlement-transactions", "发票与收付款"],
  ["settlement-energy", "预充值管理"],
]) assert.match(settlementSection, new RegExp(`data-page="${page}"[^>]*>${label}<\\/button>`));
assert.doesNotMatch(settlementSection, /data-settlement-target/);
const systemStart = html.indexOf("系统配置");
const systemSection = html.slice(html.lastIndexOf('<section class="nav-section', systemStart), html.indexOf('</section>', systemStart));
assert.match(systemSection, /系统配置[\s\S]*data-page="customer-archives"[^>]*>客户管理<\/button>/);
assert.match(html, /id="routeDialog"[^>]*data-breadcrumb="线路管理 \/ 固定线路管理 \/ 线路建档"/);
assert.match(html, /id="projectDialog"[^>]*data-breadcrumb="线路管理 \/ 固定线路管理 \/ 项目建档"/);
assert.match(app, /"fixed-routes": \{ title: "固定线路管理", kicker: "线路管理 \/ 固定线路", view: "route" \}/);
assert.match(app, /"customer-archives": \{ title: "客户管理", kicker: "系统配置 \/ 客户管理", view: "customer" \}/);

console.log("Backend navigation hierarchy test passed");
