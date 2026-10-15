const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const auto = fs.readFileSync("auto-dispatch.js", "utf8");
assert.match(html, /data-page="waybill"[^>]*>计划与任务/);
for (const id of ["planTaskDialog", "planTaskForm", "planTaskBatchInput", "planRouteSelect", "planExecutionTime", "planBoxType", "batchPlanTaskBtn", "planTaskQuantity", "generatePlanTaskBtn", "planTaskList", "planTaskListToggleBtn"]) {
  assert.ok(html.includes(`id="${id}"`), `缺少计划任务控件 ${id}`);
}
const planDialogMarkup = html.slice(html.indexOf('id="planTaskDialog"'), html.indexOf('</dialog>', html.indexOf('id="planTaskDialog"')));
assert.doesNotMatch(planDialogMarkup, /派发策略|name="dispatchMode"|name="batchDispatchMode"|planAdvanceMinutes|planBatchAdvanceMinutes/);
assert.match(planDialogMarkup, /统一进入待派发池/);
for (const id of ["planTaskTextInput", "planTaskTextRecognizeBtn"]) assert.ok(html.includes(`id="${id}"`), `缺少文字识别控件 ${id}`);
assert.ok(!html.includes('id="planRoutePreview"'), "不应再展示已选线路模块");
assert.match(app, /function renderPlanTaskList\(/);
assert.match(app, /function resizePlanTaskList\(/);
assert.match(app, /data-plan-task-row-route/);
assert.match(app, /data-plan-task-row-box/);
assert.match(app, /data-plan-task-delete/);
assert.match(app, /planTaskListItems\.splice\(index, 1\)/);
assert.match(app, /generatePlanTaskBtn/);
assert.match(app, /请先点击“生成派单任务”生成任务清单/);
const routeOptionsStart = app.indexOf("function getPlanTaskRouteOptions(");
const routeOptionsEnd = app.indexOf("function getPlanTaskBoxOptions(", routeOptionsStart);
assert.ok(routeOptionsStart >= 0 && routeOptionsEnd > routeOptionsStart, "缺少计划任务线路选项生成器");
assert.doesNotMatch(app.slice(routeOptionsStart, routeOptionsEnd), /routeCode/);
assert.match(html, /<th>计划任务<\/th><th>客户<\/th><th>项目<\/th><th>线路<\/th><th>线路节点<\/th>/);
const planTableMarkup = html.slice(html.indexOf('class="fixed-action-table plan-task-table"'), html.indexOf("</table>", html.indexOf('class="fixed-action-table plan-task-table"')));
assert.doesNotMatch(planTableMarkup, /派发模式/);
const renderRowsStart = app.indexOf("function renderRows(");
const renderRowsEnd = app.indexOf("function normalize(", renderRowsStart);
assert.doesNotMatch(app.slice(renderRowsStart, renderRowsEnd), /dispatch-mode|const mode = auto/);
assert.match(app.slice(renderRowsStart, renderRowsEnd), /colspan="11"/);
assert.equal((html.match(/id="planTaskDetailPage"/g) || []).length, 1, "计划详情使用独立二级页面");
assert.ok(html.includes('id="planTaskDetailBackBtn"'), "计划详情页应提供返回计划任务列表入口");
assert.ok(html.includes('id="planTaskDetailPageContent"'), "计划详情页应有独立内容容器");
assert.doesNotMatch(html, /id="planDispatchDetailDialog"|id="planDispatchDetailContent"/, "计划详情不应继续使用弹窗");
assert.doesNotMatch(html, /id="planWaybillDetailDialog"|id="planWaybillDetailContent"|<strong>运单详情<\/strong>/, "计划详情中不应再有运单详情页面");
assert.match(app, /data-view-plan-dispatch=.*?type="button">查看详情/);
assert.match(html, /id="cancelPlanDialog"/);
assert.match(app, /data-cancel-plan=/);
assert.match(app, /function requestCancelPlan\(/);
assert.match(app, /function cancelPlan\(/);
assert.doesNotMatch(app, /const hasException = dispatchList\.some/);
assert.match(app, /planStatus = "已取消"/);
assert.match(app, /switchPage\("plan-task-detail"\)/);
assert.match(app, /planTaskDetailBackBtn\?\.addEventListener\("click", \(\) => switchPage\("waybill"\)\)/);
assert.doesNotMatch(app, /data-view-plan-waybills|data-view-waybill-detail|查看运单/);
assert.match(app, /<strong>计划信息<\/strong>[\s\S]*<strong>派单情况<\/strong>/);
assert.match(app, /<span>计划编号<\/span>[\s\S]*<span>客户<\/span>[\s\S]*<span>项目<\/span>[\s\S]*<span>任务类型<\/span>[\s\S]*<span>执行时间<\/span>[\s\S]*<span>运输线路<\/span>/);
for (const type of ["提空装货", "提重送货", "排空箱（A→B）", "排重箱（A→B）"]) assert.ok(html.includes(type), `缺少任务类型 ${type}`);
for (const customer of ["华贸", "陆港多联", "中铁联集项目"]) assert.ok(app.includes(`customerName: "${customer}"`), `缺少客户 ${customer}`);
for (const project of ["比亚迪", "提箱装货", "X387", "X8588", "X8786", "捷运通BYD", "聚丙烯"]) assert.ok(app.includes(`projectName: "${project}"`), `缺少项目 ${project}`);
for (const field of ["pickupPoint", "loadingPoint", "unloadingPoint", "dropoffPoint"]) assert.match(app, new RegExp(`${field}:`), `缺少线路节点字段 ${field}`);
assert.match(app, /function parsePlanTaskCsv\(/);
assert.match(app, /function createPlanTaskRecords\(/);
assert.match(app, /function updatePlanTaskRecords\(/);
assert.match(planDialogMarkup, /固定线路（选填）/);
assert.doesNotMatch(planDialogMarkup, /name="routeId"[^>]*required/);
for (const field of ["data-plan-task-box-no-1", "data-plan-task-seal-no-1", "data-plan-task-box-no-2", "data-plan-task-seal-no-2"]) assert.ok(app.includes(field), `子任务缺少字段 ${field}`);
assert.match(app, /renderRouteStops\(route/);
assert.doesNotMatch(app, /isPlanTaskAutoDispatch|input\[name="batchDispatchMode"\]|input\[name="dispatchMode"\]/);
assert.match(auto, /function isAutoDispatchDue\(/);

const start = app.indexOf("function resolvePlanTaskRoute(");
const end = app.indexOf("function refreshAfterPlanTaskCreate(", start);
const waybills = [];
const dispatches = [];
const context = vm.createContext({
  waybills,
  dispatches,
  fixedRoutes: [{ id: "XL-001", routeCode: "XL-NB-001", routeName: "北仑港至江北仓", customerId: "KH-ZT", projectId: "PR-ZT-X8786", projectName: "X8786", origin: "港区", destination: "仓库", routeState: "启用", estimatedRevenue: 2860, baseFreight: 2600 }, { id: "XL-002", routeCode: "XL-NB-002", routeName: "梅山港至金华南站", customerId: "KH-ZT", projectId: "PR-ZT-X387", projectName: "X387", origin: "梅山港", destination: "金华南站", routeState: "启用", estimatedRevenue: 2550, baseFreight: 2380 }],
  routeAccountCatalog: [{ customerId: "KH-ZT", projectId: "PR-ZT-X387", projectName: "X387" }, { customerId: "KH-ZT", projectId: "PR-ZT-X8786", projectName: "X8786" }],
  getRouteAccount: (customerId, projectId) => ({ customerId, projectId, projectName: "X8786" }),
  waybillRouteMap: {},
  PLAN_TASK_TYPES: ["提空装货", "提重送货", "排空箱（A→B）", "排重箱（A→B）"],
  normalize: (value) => String(value || "").trim().toLowerCase(),
  getNextWaybillNo: () => `WB20260928001`,
  createPendingDispatch(waybill, route) { dispatches.push({ waybillNo: waybill.waybillNo, status: "待派单", routeId: route?.id || "", autoDispatch: waybill.autoDispatch }); },
  saveWaybills() {},
  window: { CustomerManager: { getActiveCustomerByName: () => ({ customerNo: "KH-1008" }) } },
});
vm.runInContext(app.slice(start, end), context);
const parserStart = app.indexOf("function parsePlanTaskCsvLine(");
const parserEnd = app.indexOf("function normalizePlanTaskExecutionTime(", parserStart);
vm.runInContext(app.slice(parserStart, parserEnd), context);
const imported = context.parsePlanTaskCsv("执行时间,线路,柜型,客户名称,项目名称,任务类型,运单数量,箱号1,铅封号1,箱号2,铅封号2\n2026-09-28 08:00,,40HQ,华贸,比亚迪,提空装货,1,BOX-A,SEAL-A,BOX-B,SEAL-B");
assert.equal(imported[0].routeValue, "", "固定线路允许在导入中留空");
assert.equal(imported[0].boxNo2, "BOX-B");
assert.equal(imported[0].sealNo2, "SEAL-B");
const result = context.createPlanTaskRecords([{ executionTime: "2026-09-28 08:00", routeValue: "北仑港至江北仓", boxType: "40HQ", customerName: "宁波远海供应链有限公司", projectName: "进口柜日配", taskType: "提空装货", autoDispatch: true, dispatchAdvanceMinutes: 30 }]);
assert.equal(result.created.length, 1);
assert.equal(waybills[0].taskType, "提空装货");
assert.equal(waybills[0].projectId, "PR-ZT-X8786");
assert.equal(waybills[0].autoDispatch, false, "new plan tasks enter the pending pool without an auto-dispatch choice");
assert.equal(waybills[0].dispatchAdvanceMinutes, 0);
assert.equal(dispatches[0].status, "待派单");
const noRoute = context.createPlanTaskRecords([{ executionTime: "2026-09-28 10:00", routeId: "", boxType: "20GP", customerName: "华贸", projectName: "比亚迪", customerId: "KH-HM", taskType: "提空装货", quantity: 1, boxNo1: "", sealNo1: "", boxNo2: "BOX-ONLY", sealNo2: "SEAL-ONLY" }]);
assert.equal(noRoute.created.length, 1, "没有固定线路也应创建计划任务");
assert.equal(noRoute.created[0].routeId, "");
assert.equal(noRoute.created[0].boxNo1, "BOX-ONLY", "只有第二组输入时压紧存入箱号1");
assert.equal(noRoute.created[0].sealNo1, "SEAL-ONLY", "只有第二组输入时压紧存入铅封号1");
assert.equal(noRoute.created[0].boxNo2, "");
const twoBoxes = context.createPlanTaskRecords([{ executionTime: "2026-09-28 11:00", routeId: "", boxType: "40HQ", customerName: "华贸", projectName: "比亚迪", quantity: 1, boxNo1: "BOX-1", sealNo1: "SEAL-1", boxNo2: "BOX-2", sealNo2: "SEAL-2" }]);
assert.equal(twoBoxes.created[0].containers.length, 2);
assert.equal(twoBoxes.created[0].boxNo2, "BOX-2");
const editedWaybill = { waybillNo: "WB-EDIT", planTaskId: "PT-EDIT", routeId: "XL-001", boxNo1: "OLD", sealNo1: "OLD-S", boxNo2: "", sealNo2: "", containers: [], freight: 100, receivable: 120, payable: 90, profit: 30 };
const editedDispatch = { waybillNo: "WB-EDIT", routeId: "XL-001", routeName: "Old route", status: "待派单" };
const editContext = vm.createContext({
  waybills: [editedWaybill], dispatches: [editedDispatch], waybillRouteMap: { "WB-EDIT": "XL-001" },
  getPlanTaskGroups: () => [{ id: "PT-EDIT", canEdit: true, waybills: [editedWaybill] }],
  normalizePlanTaskExecutionTime: (value) => value,
  resolvePlanTaskRoute: () => null,
  getRouteStops: () => [{ value: "待维护" }, { value: "待维护" }, { value: "待维护" }, { value: "待维护" }],
  getRouteMileageSnapshot: () => null, formatWaybillBoxes: () => "BOX-NEW", routeAccountCatalog: [],
  getRouteAccount: () => null, saveWaybills() {}, saveDispatches() {},
  window: { CustomerManager: { getActiveCustomerByName: () => ({ customerNo: "KH-1008" }) } },
});
const editStart = app.indexOf("function normalizePlanTaskContainerPairs(");
const editEnd = app.indexOf("function refreshAfterPlanTaskCreate(", editStart);
vm.runInContext(app.slice(editStart, editEnd), editContext);
assert.equal(editContext.updatePlanTaskRecords("PT-EDIT", { executionTime: "2026-09-28T12:00", customerName: "华贸", customerId: "KH-HM", projectName: "比亚迪", projectId: "PR-HM", taskType: "提空装货" }, [{ routeValue: "", boxType: "40HQ", boxNo1: "", sealNo1: "", boxNo2: "BOX-NEW", sealNo2: "SEAL-NEW" }]), true);
assert.equal(editedWaybill.routeId, "", "编辑可清空固定线路");
assert.equal(editedWaybill.boxNo1, "BOX-NEW", "编辑时单组数据始终写入箱号1");
assert.equal(editedWaybill.sealNo1, "SEAL-NEW", "编辑时单组数据始终写入铅封号1");
assert.equal(editedWaybill.boxNo2, "");
assert.equal(editedWaybill.receivable, 120, "清空线路不清空既有金额");
assert.equal(editedDispatch.routeName, "未指定线路");
const varied = context.createPlanTaskRecords([{ executionTime: "2026-09-28 09:00", routeId: "XL-001", boxType: "40HQ", customerName: "宁波远海供应链有限公司", projectName: "进口柜日配", taskType: "提空装货", taskItems: [{ routeId: "XL-001", boxType: "20GP" }, { routeId: "XL-002", boxType: "40GP" }], quantity: 2 }]);
assert.equal(varied.created.length, 2);
assert.equal(varied.created[0].planTaskId, varied.created[1].planTaskId);
assert.deepEqual(new Set(varied.created.map((item) => item.routeId)), new Set(["XL-001", "XL-002"]));
assert.deepEqual(new Set(varied.created.map((item) => item.boxType)), new Set(["20GP", "40GP"]));
console.log("Plan task creation test passed");
