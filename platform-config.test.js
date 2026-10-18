const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const source = fs.readFileSync("platform-config.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const access = fs.readFileSync("user-access.js", "utf8");
const adminMobile = fs.readFileSync("admin-mobile.html", "utf8");
const driverMobile = fs.readFileSync("mobile.html", "utf8");

test("platform configuration is the first system configuration entry and has a routed page", () => {
  const systemStart = html.indexOf("系统配置");
  const platformStart = html.indexOf('data-page="platform-config"', systemStart);
  const customerStart = html.indexOf('data-page="customer-archives"', systemStart);
  assert.ok(platformStart > systemStart && platformStart < customerStart);
  assert.match(html, /id="platformConfigPage"/);
  assert.match(app, /platformConfig: document\.querySelector\("#platformConfigPage"\)/);
  assert.match(app, /"platform-config": \{ title: "平台配置", kicker: "系统配置 \/ 平台配置", view: "platformConfig" \}/);
});

test("configuration covers enterprise, brand, administrator, preview and release history", () => {
  ["enterprise", "brand", "administrators", "history"].forEach((tab) => assert.match(html, new RegExp(`data-platform-tab="${tab}"`)));
  ["enterpriseFullName", "enterpriseShortName", "platformName", "adminMobileName", "driverAppName"].forEach((name) => assert.match(html, new RegExp(`name="${name}"`)));
  assert.match(html, /id="platformPreviewBrowserTitle"/);
  assert.match(html, /id="platformPublishDialog"/);
  assert.match(html, /微信官方名称及头像需在微信公众平台修改/);
  assert.match(styles, /\.platform-config-shell \{ display: grid/);
});

test("draft, publish, validation and administrator safeguards are interactive", () => {
  assert.match(source, /DRAFT_KEY/);
  assert.match(source, /PUBLISHED_KEY/);
  assert.match(source, /HISTORY_KEY/);
  assert.match(source, /function validate\(\)/);
  assert.match(html, /系统必须始终保留至少 1 个启用的超级管理员/);
  assert.match(source, /beforeunload/);
  assert.match(source, /confirmPlatformPublish/);
  assert.match(access, /id: "platformConfig", name: "平台配置"/);
});

test("published brand configuration is shared by all three interfaces", () => {
  assert.match(html, /<script src="platform-config\.js"><\/script>/);
  assert.match(adminMobile, /<script src="platform-config\.js"><\/script>/);
  assert.match(driverMobile, /<script src="platform-config\.js"><\/script>/);
  assert.match(source, /function applyPublishedBrand/);
});

console.log("Platform configuration tests passed");
