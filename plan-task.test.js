const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const auto = fs.readFileSync("auto-dispatch.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
assert.match(html, /data-page="waybill"[^>]*>计划与任务/);
for (const id of ["planTaskDialog", "planTaskForm", "planTaskBatchInput", "planRouteSelect", "planExecutionDate", "planBoxType", "batchPlanTaskBtn", "planTaskQuantity", "generatePlanTaskBtn", "planTaskList", "planTaskListToggleBtn"]) {
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
assert.match(html, /<th>客户<\/th><th>项目<\/th><th>线路<\/th><th>线路节点<\/th>/);
assert.doesNotMatch(html.slice(html.indexOf('class="fixed-action-table plan-task-table"'), html.indexOf("</table>", html.indexOf('class="fixed-action-table plan-task-table"'))), /<th>计划任务<\/th>/);
const planTableMarkup = html.slice(html.indexOf('class="fixed-action-table plan-task-table"'), html.indexOf("</table>", html.indexOf('class="fixed-action-table plan-task-table"')));
assert.doesNotMatch(planTableMarkup, /派发模式/);
assert.equal((planTableMarkup.match(/<th(?:\s|>)/g) || []).length, 9, "计划任务表头应与九个内容列一一对应");
assert.equal((planTableMarkup.match(/<col(?:\s|\/>)/g) || []).length, 9, "计划任务表应为每个表头定义一个固定列宽");
assert.match(planTableMarkup, /<th>预估金额<\/th>/);
const renderRowsStart = app.indexOf("function renderRows(");
const renderRowsEnd = app.indexOf("function normalize(", renderRowsStart);
const renderRowsSource = app.slice(renderRowsStart, renderRowsEnd);
assert.doesNotMatch(renderRowsSource, /dispatch-mode|const mode = auto/);
assert.match(renderRowsSource, /colspan="9"/);
const planTaskDataRowStart = renderRowsSource.indexOf("return `<tr>");
const planTaskDataRowEnd = renderRowsSource.indexOf("</tr>", planTaskDataRowStart);
const planTaskDataRow = renderRowsSource.slice(planTaskDataRowStart, planTaskDataRowEnd);
assert.equal((planTaskDataRow.match(/<td(?:\s|>)/g) || []).length, 9, "计划任务数据行应与九列表头一一对应");
assert.match(renderRowsSource, /plan-task-execution-counts/);
assert.match(renderRowsSource, /已完成 \$\{group\.completed\}/);
assert.match(renderRowsSource, /未完成 \$\{group\.uncompleted\}/);
assert.doesNotMatch(renderRowsSource, /plan-task-count/);
assert.match(styles, /\.plan-task-table th:nth-child\(8\), \.plan-task-table td:nth-child\(8\) \{[^}]*text-align: right/);
assert.match(styles, /\.plan-task-execution-counts \{[^}]*gap: 12px/);
assert.match(app, /if \(meta\.view === "waybill"\) \{\s*const planTaskTableWrap = tableBody\?\.closest\("\.table-wrap"\);\s*if \(planTaskTableWrap\) planTaskTableWrap\.scrollLeft = 0;/);
assert.doesNotMatch(app.slice(renderRowsStart, renderRowsEnd), /task-progress/);
assert.match(styles, /\.plan-task-table\s*\{[^}]*table-layout:\s*fixed/);
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
assert.match(app, /<span>计划编号<\/span>[\s\S]*<span>客户<\/span>[\s\S]*<span>项目<\/span>[\s\S]*<span>任务类型<\/span>[\s\S]*<span>计划执行日期<\/span>[\s\S]*<span>运输线路<\/span>/);
assert.match(app, /data-plan-task-row-berthing-time/);
assert.match(html, /<th>计划执行日期<\/th><th>子任务执行情况<\/th>/);
assert.match(html, /<th>多选<\/th><th>客户项目<\/th><th>运输线路<\/th><th>任务类型<\/th><th>计划靠台时间<\/th>/);
assert.doesNotMatch(html.slice(html.indexOf('<table class="dispatch-management-task-table">'), html.indexOf('</table>', html.indexOf('<table class="dispatch-management-task-table">'))), /任务 \/ 来源|计划日期<\/th>/);
assert.match(html, /id="planTaskQuickStats"[^>]*aria-label="计划任务快捷统计"/);

const planGroupsStart = app.indexOf("function getPlanTaskToday(");
const planGroupsEnd = app.indexOf("function renderRows(", planGroupsStart);
const planGroupsContext = vm.createContext({ dispatches: [] });
vm.runInContext(app.slice(planGroupsStart, planGroupsEnd), planGroupsContext);
const grouped = (items) => planGroupsContext.getPlanTaskGroups(items)[0];
const inProgressPlan = grouped([
  { planTaskId: "PLAN-MIX", waybillNo: "WB-DONE", status: "已完成" },
  { planTaskId: "PLAN-MIX", waybillNo: "WB-ACTIVE", status: "运输中" },
  { planTaskId: "PLAN-MIX", waybillNo: "WB-PENDING", status: "待派单" },
  { planTaskId: "PLAN-MIX", waybillNo: "WB-CANCELLED", planStatus: "已取消" },
]);
assert.equal(inProgressPlan.status, "进行中");
assert.equal(inProgressPlan.completed, 1);
assert.equal(inProgressPlan.uncompleted, 2, "cancelled subtasks should not be counted as incomplete");
assert.equal(grouped([{ planTaskId: "PLAN-NEW", waybillNo: "WB-NEW", status: "待派单" }]).status, "未开始");
assert.equal(grouped([{ planTaskId: "PLAN-DONE", waybillNo: "WB-FINISHED", status: "已完成" }]).status, "已完成");
assert.equal(grouped([{ planTaskId: "PLAN-CANCEL", waybillNo: "WB-VOID", planStatus: "已取消" }]).status, "已取消");
const metricGroups = planGroupsContext.getPlanTaskGroups([
  { planTaskId: "PLAN-OVERDUE", waybillNo: "WB-LATE", planExecutionDate: "2026-10-18", plannedBerthingTime: "2026-10-18T09:00", status: "待派单" },
  { planTaskId: "PLAN-TODAY", waybillNo: "WB-TODAY", planExecutionDate: "2026-10-19", plannedBerthingTime: "2026-10-19T09:00", status: "已派单" },
  { planTaskId: "PLAN-UPCOMING", waybillNo: "WB-FUTURE", planExecutionDate: "2026-10-20", plannedBerthingTime: "2026-10-20T09:00", status: "待派单" },
  { planTaskId: "PLAN-DONE-OLD", waybillNo: "WB-DONE-OLD", planExecutionDate: "2026-10-18", plannedBerthingTime: "2026-10-18T09:00", status: "已完成" },
]);
assert.deepEqual({ ...planGroupsContext.getPlanTaskQuickStatValues(metricGroups, "2026-10-19") }, { overdue: 1, pendingDispatch: 2, todayBerthing: 1, inProgress: 1, upcoming: 1 });
assert.deepEqual(Array.from(planGroupsContext.filterPlanTaskGroups(metricGroups, "overdue", "2026-10-19"), (group) => group.id), ["PLAN-OVERDUE"]);
assert.deepEqual(Array.from(planGroupsContext.filterPlanTaskGroups(metricGroups, "today-berthing", "2026-10-19"), (group) => group.id), ["PLAN-TODAY"]);
assert.deepEqual(Array.from(planGroupsContext.filterPlanTaskGroups(metricGroups, "upcoming", "2026-10-19"), (group) => group.id), ["PLAN-UPCOMING"]);
assert.match(app, /planTaskQuickFilter = planTaskQuickFilter === stat\.dataset\.planTaskFilter \? "" : stat\.dataset\.planTaskFilter/);
assert.match(styles, /\.plan-task-quick-stats \{ display: grid; grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
assert.match(styles, /@media \(max-width: 1120px\) \{ \.plan-task-quick-stats \{ grid-template-columns: repeat\(3, minmax\(0, 1fr\)\); \} \}/);
assert.match(styles, /@media \(max-width: 720px\) \{ \.plan-task-quick-stats \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
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
  window: {
    CustomerManager: { getActiveCustomerByName: () => ({ customerNo: "KH-1008" }) },
    DispatchTaskNodes: {
      snapshot: (name) => ({ name, nodes: [{ name: "已提空", photoRequirements: [] }] }),
    },
  },
});
vm.runInContext(app.slice(start, end), context);
const parserStart = app.indexOf("function parsePlanTaskCsvLine(");
const parserEnd = app.indexOf("function normalizePlanTaskContainerPairs(", parserStart);
vm.runInContext(app.slice(parserStart, parserEnd), context);
const imported = context.parsePlanTaskCsv("计划执行日期,计划靠台时间,线路,柜型,客户名称,项目名称,任务类型,运单数量,箱号1,铅封号1,箱号2,铅封号2\n2026-09-28,2026-09-28 08:00,,40HQ,华贸,比亚迪,提空装货,1,BOX-A,SEAL-A,BOX-B,SEAL-B");
assert.equal(imported[0].planExecutionDate, "2026-09-28");
assert.equal(imported[0].plannedBerthingTime, "2026-09-28 08:00");
assert.equal(imported[0].routeValue, "", "固定线路允许在导入中留空");
assert.equal(imported[0].boxNo2, "BOX-B");
assert.equal(imported[0].sealNo2, "SEAL-B");
const result = context.createPlanTaskRecords([{ planExecutionDate: "2026-09-28", routeValue: "北仑港至江北仓", boxType: "40HQ", customerName: "宁波远海供应链有限公司", projectName: "进口柜日配", taskType: "提空装货", plannedBerthingTime: "2026-09-28T08:45", autoDispatch: true, dispatchAdvanceMinutes: 30 }]);
assert.equal(result.created.length, 1);
assert.equal(waybills[0].taskType, "提空装货");
assert.equal(waybills[0].taskConfigSnapshot.name, "提空装货", "new plan task snapshots come directly from the selected task type");
assert.equal(Object.hasOwn(waybills[0], "transportTaskTypeId"), false, "new plan tasks do not use a transport task type mapping");
assert.equal(waybills[0].planExecutionDate, "2026-09-28");
assert.equal(waybills[0].plannedBerthingTime, "2026-09-28T08:45");
assert.equal(waybills[0].projectId, "PR-ZT-X8786");
assert.equal(waybills[0].autoDispatch, false, "new plan tasks enter the pending pool without an auto-dispatch choice");
assert.equal(waybills[0].dispatchAdvanceMinutes, 0);
assert.equal(dispatches[0].status, "待派单");
const noRoute = context.createPlanTaskRecords([{ planExecutionDate: "2026-09-28", plannedBerthingTime: "2026-09-28T10:00", routeId: "", boxType: "20GP", customerName: "华贸", projectName: "比亚迪", customerId: "KH-HM", taskType: "提空装货", quantity: 1, boxNo1: "", sealNo1: "", boxNo2: "BOX-ONLY", sealNo2: "SEAL-ONLY" }]);
assert.equal(noRoute.created.length, 1, "没有固定线路也应创建计划任务");
assert.equal(noRoute.created[0].routeId, "");
assert.equal(noRoute.created[0].boxNo1, "BOX-ONLY", "只有第二组输入时压紧存入箱号1");
assert.equal(noRoute.created[0].sealNo1, "SEAL-ONLY", "只有第二组输入时压紧存入铅封号1");
assert.equal(noRoute.created[0].boxNo2, "");
const twoBoxes = context.createPlanTaskRecords([{ planExecutionDate: "2026-09-28", plannedBerthingTime: "2026-09-28T11:00", routeId: "", boxType: "40HQ", customerName: "华贸", projectName: "比亚迪", quantity: 1, boxNo1: "BOX-1", sealNo1: "SEAL-1", boxNo2: "BOX-2", sealNo2: "SEAL-2" }]);
assert.equal(twoBoxes.created[0].containers.length, 2);
assert.equal(twoBoxes.created[0].boxNo2, "BOX-2");
const editedWaybill = { waybillNo: "WB-EDIT", planTaskId: "PT-EDIT", routeId: "XL-001", boxNo1: "OLD", sealNo1: "OLD-S", boxNo2: "", sealNo2: "", containers: [], freight: 100, receivable: 120, payable: 90, profit: 30 };
const editedDispatch = { waybillNo: "WB-EDIT", routeId: "XL-001", routeName: "Old route", status: "待派单" };
const editContext = vm.createContext({
  waybills: [editedWaybill], dispatches: [editedDispatch], waybillRouteMap: { "WB-EDIT": "XL-001" },
  getPlanTaskGroups: () => [{ id: "PT-EDIT", canEdit: true, waybills: [editedWaybill] }],
  normalizePlanTaskExecutionTime: (value) => value,
  resolvePlanTaskRoute: () => null,
  getRouteStops: () => [{ value: "待维护" }, { value: "待维护" }, { value: "待维护" }, { value: "待维护" }], normalizePlanTaskDate: (value) => value,
  getRouteMileageSnapshot: () => null, formatWaybillBoxes: () => "BOX-NEW", routeAccountCatalog: [],
  getRouteAccount: () => null, saveWaybills() {}, saveDispatches() {},
  window: { CustomerManager: { getActiveCustomerByName: () => ({ customerNo: "KH-1008" }) } },
});
const editStart = app.indexOf("function normalizePlanTaskContainerPairs(");
const editEnd = app.indexOf("function refreshAfterPlanTaskCreate(", editStart);
vm.runInContext(app.slice(editStart, editEnd), editContext);
assert.equal(editContext.updatePlanTaskRecords("PT-EDIT", { planExecutionDate: "2026-09-28", customerName: "华贸", customerId: "KH-HM", projectName: "比亚迪", projectId: "PR-HM", taskType: "提空装货" }, [{ routeValue: "", boxType: "40HQ", plannedBerthingTime: "2026-09-28T12:00", boxNo1: "", sealNo1: "", boxNo2: "BOX-NEW", sealNo2: "SEAL-NEW" }]), true);
assert.equal(editedWaybill.routeId, "", "编辑可清空固定线路");
assert.equal(editedWaybill.boxNo1, "BOX-NEW", "编辑时单组数据始终写入箱号1");
assert.equal(editedWaybill.sealNo1, "SEAL-NEW", "编辑时单组数据始终写入铅封号1");
assert.equal(editedWaybill.boxNo2, "");
assert.equal(editedWaybill.receivable, 120, "清空线路不清空既有金额");
assert.equal(editedDispatch.routeName, "未指定线路");
const varied = context.createPlanTaskRecords([{ planExecutionDate: "2026-09-28", plannedBerthingTime: "2026-09-28T09:00", routeId: "XL-001", boxType: "40HQ", customerName: "宁波远海供应链有限公司", projectName: "进口柜日配", taskType: "提空装货", taskItems: [{ routeId: "XL-001", boxType: "20GP", plannedBerthingTime: "2026-09-28T09:00" }, { routeId: "XL-002", boxType: "40GP", plannedBerthingTime: "2026-09-28T10:30" }], quantity: 2 }]);
assert.equal(varied.created.length, 2);
assert.equal(varied.created[0].planTaskId, varied.created[1].planTaskId);
assert.deepEqual(new Set(varied.created.map((item) => item.routeId)), new Set(["XL-001", "XL-002"]));
assert.deepEqual(new Set(varied.created.map((item) => item.boxType)), new Set(["20GP", "40GP"]));
assert.deepEqual(Array.from(varied.created, (item) => item.plannedBerthingTime).sort(), ["2026-09-28T09:00", "2026-09-28T10:30"]);
console.log("Plan task creation test passed");
