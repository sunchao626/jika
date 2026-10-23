const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");

for (const id of [
  "planTaskTemplatesBtn", "planTaskTemplateManagerDialog", "planTaskTemplateEditorDialog",
  "planTaskTemplateSearch", "planTaskTemplateTypeFilter", "planTaskTemplateBody",
  "planTaskTemplateForm", "planTaskTemplateItems", "planTaskTemplateRoute",
  "planTaskTemplateTypeCards",
]) assert.ok(html.includes(`id="${id}"`), `缺少计划任务模板控件 ${id}`);
assert.match(html, /计划任务模板/);
assert.match(app, /使用该模板开始创建/);
assert.match(html, /class="btn primary" type="button" id="planTaskTemplatesBtn"/);
assert.match(html, /class="vehicle-dialog plan-template-manager-dialog"/);
assert.match(html, /class="vehicle-dialog plan-template-editor-dialog"/);
assert.match(html, /id="planTaskTemplateTypeCards"[^>]*role="radiogroup"/);
assert.doesNotMatch(html, /id="planTaskTemplateTaskType"/);
assert.match(app, /getSelectedPlanTaskType\("#planTaskTemplateTypeCards"\)/);
const templateRouteSelect = html.slice(html.indexOf('<select name="routeId" id="planTaskTemplateRoute"'), html.indexOf("</select>", html.indexOf('<select name="routeId" id="planTaskTemplateRoute"')));
assert.match(templateRouteSelect, /不指定固定线路/);
assert.doesNotMatch(templateRouteSelect, /required/);
assert.match(app, /planTaskTemplatesBtn[\s\S]*openPlanTaskTemplateManager/);
assert.match(app, /data-plan-template-action="use"/);
assert.match(app, /planTaskTemplateForm\?\.addEventListener\("submit"/);
assert.match(app, /localStorage\.setItem\(PLAN_TASK_TEMPLATE_STORAGE_KEY/);
assert.match(app, /planTaskTemplateBody\?\.addEventListener\("click"/);
assert.match(app, /data-save-plan-template=/);
assert.match(app, /data-save-plan-template[\s\S]*openPlanTaskTemplateEditor\(null, group\)/);
assert.match(styles, /\.plan-template-manager-dialog/);
assert.match(styles, /\.plan-template-table-wrap table \{ width: 100%; min-width: 960px; table-layout: fixed;/);
assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.plan-template-editor-body/);

const start = app.indexOf("const PLAN_TASK_TYPES =");
const end = app.indexOf("let planTaskTemplates =", start);
const stored = new Map();
const context = vm.createContext({
  PLAN_TASK_TYPES: ["提空装货", "提重送货", "排空箱（A→B）", "排重箱（A→B）"],
  PLAN_TASK_BOX_TYPES: ["40HQ", "40GP", "20GP", "45HQ"],
  Date,
  console,
  localStorage: {
    getItem: (key) => stored.get(key) ?? null,
    setItem: (key, value) => stored.set(key, value),
  },
});
vm.runInContext(app.slice(start, end), context);

const normalized = context.normalizePlanTaskTemplate({
  id: "TPL-1", name: " 常用提空 ", taskType: "提空装货", customerId: "C1", projectId: "P1",
  routeId: "R1", boxType: "40GP", quantity: 2,
  taskItems: [{ boxType: "20GP" }, { routeId: "R2", boxType: "45HQ" }],
});
assert.equal(normalized.name, "常用提空");
assert.equal(normalized.quantity, 2);
assert.equal(normalized.taskItems[0].routeId, "R1", "未指定子任务线路时继承模板线路");
assert.equal(normalized.taskItems[0].boxType, "20GP", "保留子任务柜型覆盖值");
assert.equal(normalized.taskItems[1].routeId, "R2");
assert.equal(normalized.taskItems[1].boxType, "45HQ");
assert.equal(normalized.taskItems.length, normalized.quantity);
assert.equal(context.savePlanTaskTemplates([normalized]), true);
assert.equal(context.loadPlanTaskTemplates()[0].id, "TPL-1");

console.log("计划任务模板交互与数据归一化检查通过");
