const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("admin-mobile.html", "utf8");
const script = fs.readFileSync("admin-mobile.js", "utf8");
const css = fs.readFileSync("admin-mobile.css", "utf8");
const desktop = fs.readFileSync("index.html", "utf8");
const desktopScript = fs.readFileSync("app.js", "utf8");
const customerScript = fs.readFileSync("customer.js", "utf8");

assert.match(desktop, /href="admin-mobile\.html"[^>]*>管理移动端<\/a>\s*<a class="mobile-entry" href="mobile\.html"/);
assert.match(html, /data-view="workbench"[\s\S]*data-view="messages"[\s\S]*data-view="profile"/);
assert.match(html, /id="reportsView"[\s\S]*数据报表/);
assert.match(html, /data-view="reports"[^>]*>[\s\S]*报表/);
for (const reportSection of ["运输金额", "运力状态", "实时运力任务", "计划完成统计"]) assert.ok(html.includes(reportSection), `数据报表缺少 ${reportSection}`);
for (const reportFilter of ["reportDateRange", "reportCustomer", "reportProject", "reportRoute", "reportThreshold"]) assert.ok(html.includes(`id="${reportFilter}"`), `数据报表缺少筛选 ${reportFilter}`);
assert.match(html, /data-report-amount="customer"[\s\S]*data-report-amount="route"/);
assert.match(css, /\.manager-bottom-nav\s*\{[^}]*grid-template-columns:\s*repeat\(4,1fr\)/);
assert.match(html, /id="profileView"[\s\S]*今日操作[\s\S]*派单及时率[\s\S]*待办事项/);
for (const profileAction of ["profile", "role", "notification", "security", "help"]) {
  assert.match(html, new RegExp(`data-profile-action="${profileAction}"`), `我的页面缺少 ${profileAction} 入口`);
}
assert.doesNotMatch(html, /返回后台系统|data-profile-action="desktop"/, "小程序管理端不应提供返回后台系统入口");
assert.match(html, /id="managerProfileSubpage"[\s\S]*id="profileSubpageContent"/);
assert.match(css, /\.profile-view\s*\{[^}]*overflow-y:\s*hidden/);
assert.match(css, /\.profile-menu button\s*\{[^}]*min-height:\s*52px/);
assert.match(script, /MANAGER_PROFILE_STORAGE_KEY/);
assert.match(script, /function openProfileSubpage\(action\)/);
assert.match(script, /function saveManagerProfile\(event\)/);
assert.match(script, /profileDraftAvatar/);
assert.match(script, /部门和角色由系统管理员维护/);
assert.match(script, /data-notification-setting/);
assert.match(script, /function renderReports\(\)/);
assert.match(script, /function reportTaskRows\(/);
assert.match(script, /reportRanges = \{ yesterday: \{ label: "昨日", days: 1, endOffset: -1 \}, today: \{ label: "今日", days: 1, endOffset: 0 \}, last7: \{ label: "近7天", days: 7, endOffset: 0 \}, month: \{ label: "近一月", days: 30, endOffset: 0 \} \}/);
assert.match(script, /if \(view === "reports"\) renderReports\(\)/);
assert.match(script, /if \(state\.currentView === "reports"\) renderReports\(\)/);
assert.match(script, /data-report-capacity-scope/);
assert.match(script, /container-logistics-dashboard-near-complete/);

for (const label of ["计划与任务", "固定线路管理", "任务派单", "派单列表", "运力管理", "车辆档案管理", "挂车档案", "司机档案", "客户管理"]) {
  assert.ok(html.includes(label), `工作台缺少 ${label} 入口`);
}
assert.doesNotMatch(html, /data-open-module="waybill"|data-quick-action="waybill"|运单管理|新增运单/, "工作台不应展示运单管理入口或新增运单快捷操作");
assert.doesNotMatch(script, /\["waybill",\s*"运单管理"/, "侧边导航不应展示运单管理入口");
for (const moduleName of ["plan", "route", "dispatch-management", "dispatch", "capacity", "vehicle", "trailer", "driver", "customer"]) {
  assert.match(html, new RegExp(`data-open-module="${moduleName}"`), `缺少 ${moduleName} 工作台入口`);
}

for (const moduleName of ["waybill", "route", "dispatch", "auto", "vehicle", "driver", "customer", "reminder"]) {
  assert.match(script, new RegExp(`\\b${moduleName}: \\{`), `缺少 ${moduleName} 移动业务数据`);
}

assert.match(script, /function openModule\(/);
assert.match(script, /function openDetail\(/);
assert.match(script, /moduleSearch.*addEventListener\("input"/);
assert.match(script, /classList\.add\("subpage-open"\)/);
assert.match(html, /vendor\/lucide\.min\.js/);
assert.match(html, /data-open-module="driver"[\s\S]*?data-lucide="user-round"[\s\S]*?司机档案/);
assert.doesNotMatch(html, /data-lucide="badge-user"/);
assert.match(html, /id="managerEntryView"/);
assert.match(html, /id="managerEntryForm"/);
assert.match(html, /class="entry-scroll"[\s\S]*class="entry-actions"/);
assert.match(css, /\.entry-actions\s*\{[^}]*position:\s*sticky[^}]*bottom:\s*0[^}]*flex:\s*0 0 auto/);

for (const moduleName of ["waybill", "route", "dispatch", "auto", "vehicle", "driver", "customer"]) {
  assert.ok(script.includes(`"${moduleName}"`), `缺少 ${moduleName} 表单模块配置`);
}

assert.match(script, /function waybillEntryMarkup\(/);
assert.match(script, /function dispatchEntryMarkup\(/);
assert.match(script, /function autoEntryMarkup\(/);
assert.match(script, /listFieldLimit: 6/);
assert.match(script, /function renderPlanDetail\(/);
assert.match(script, /function renderRouteDetail\(/);
assert.match(script, /编辑线路资料/);
assert.match(script, /data-edit-route="\$\{h\(item\.id\)\}"/);
assert.match(script, /function setDetailEditAction\(moduleName, recordId, label\)/);
assert.match(script, /dataset\.editModule = moduleName/);
assert.match(script, /data-edit-module="\$\{h\(sourceModule\)\}"/);
assert.match(script, /function renderAssetDetail\(moduleName, item\)/);
assert.match(script, /\["capacity", "vehicle", "trailer", "driver", "customer"\]\.includes\(state\.currentModule\)/);
assert.match(script, /function buildAssetRecord\(moduleName, values\)/);
assert.match(script, /function rebuildCapacityCatalog\(/);
assert.match(script, /function rebuildDispatchManagementCatalog\(\)/);
assert.match(script, /function ensurePendingDispatchSamples\(\)/);
assert.match(script, /const pendingDispatchSamples = \[/);
for (const dispatchId of ["PD-M-2101", "PD-M-2102", "PD-M-2103", "PD-M-2104"]) {
  assert.ok(script.includes(dispatchId), `待派单样例缺少 ${dispatchId}`);
}
assert.match(script, /data-start-dispatch="\$\{h\(item\.id\)\}"/);
assert.match(script, />开始派单<\/button>/);
assert.match(script, /openEntry\("dispatch", dispatchId\)/, "开始派单应直接进入运力分配表单");
assert.match(script, /const pendingDispatchCount = moduleCatalog\.dispatch\.items\.filter/);
assert.match(script, /\$\{pendingCount\} 条任务等待派单/);
assert.match(css, /\.list-card-actions\s*\{[^}]*display:\s*flex/);
assert.match(script, /function renderDispatchManagementDetail\(item\)/);
assert.match(script, /function renderDispatchDetail\(item\)/);
assert.match(script, /function buildDispatchRecord\(values\)/);
assert.match(script, /state\.currentModule === "dispatch-management"/);
assert.match(script, /state\.currentModule === "dispatch"/);
for (const fieldName of ["waybillId", "projectId", "routeId", "boxType", "boxNo1", "sealNo1", "boxNo2", "sealNo2", "driverId", "vehicleId", "trailerId", "vehicleType", "consignee", "arrivalTime", "arrivalLocation", "note"]) {
  assert.ok(script.includes(`name: "${fieldName}"`), `移动管理端派单表单缺少后台字段 ${fieldName}`);
}
assert.equal((script.match(/class="mobile-container-group"/g) || []).length, 2, "每组箱号和铅封号应有独立集装箱分组");
assert.match(script, /每个集装箱对应填写自己的铅封号/);
assert.match(script, /mobile-container-fields[\s\S]*name: "boxNo1"[\s\S]*name: "sealNo1"/);
assert.match(css, /\.mobile-dispatch-box-grid > \.mobile-field\s*\{[^}]*max-width:\s*190px/);
assert.match(css, /@media\s*\(max-width:\s*360px\)[\s\S]*\.mobile-container-fields\s*\{\s*grid-template-columns:\s*1fr/);
for (const detailLabel of ["任务与派单信息", "司机与车辆", "线路与箱信息", "运输节点记录", "其他后台字段"]) {
  assert.ok(script.includes(detailLabel), `派单详情缺少 ${detailLabel}`);
}
assert.match(script, /snapshot\.waybills = sharedWaybills\.map/, "派单保存后应同步关联运单");
assert.match(script, /\["capacity", "dispatch-management"\]\.includes\(moduleName\)/, "运力和派单管理不应显示无效新增按钮");
assert.match(script, /function certificationStatusLabel\(status\)/);
assert.match(script, /重新选择文件将替换现有附件/);
assert.match(script, /\.filter\(\(\[, value\]\) => !\(value instanceof File\) \|\| Boolean\(value\.name\)\)/, "编辑时未重新选择附件应保留后台原值");
assert.match(script, /editAsset && editAsset\.id !== "detailActionButton"/, "详情顶部编辑入口不应被重复处理");
assert.match(desktopScript, /function hydrateAdminDataSnapshot\(\)/);
for (const collection of ["vehicles", "trailers", "drivers", "fixedRoutes"]) {
  assert.match(desktopScript, new RegExp(`\\[${collection}, snapshot\\.${collection}, "[^"]+"`), `后台启动时未恢复 ${collection} 共享数据`);
}
assert.match(desktopScript, /const untouched = target\.filter/, "后台恢复移动端快照时应保留尚未同步的原始档案");
assert.match(customerScript, /const sharedCustomers = window\.AdminDataBridge\?\.read\?\.\(\)\?\.customers/);
assert.match(css, /\.detail-edit-button\s*\{[^}]*background:\s*var\(--primary\)/);
assert.match(css, /\.detail-action-bar\s*\{[^}]*display:\s*flex/);
assert.match(script, /function openDetail\(item\)[\s\S]*?\$\("#moduleView"\)\.classList\.remove\("open"\)[\s\S]*?\$\("#managerDetailView"\)\.classList\.add\("open"\)/, "查看详情应切换到独立的二级详情页");
assert.match(script, /\$\("#detailBackButton"\)\.addEventListener\("click", \(\) => \{[\s\S]*?\$\("#moduleView"\)\.classList\.add\("open"\)/, "详情页返回应回到模块列表");
assert.match(script, /function populateMobileRouteOptions\(/);
assert.match(script, /function populateMobileProjectOptions\(/);
assert.match(script, /data-edit-route=/);
assert.match(script, /existingIndex >= 0\) moduleCatalog\[moduleName\]\.items\.splice/);
for (const fieldName of ["routeCode", "customerId", "customerName", "projectId", "projectName", "pickupPoint", "loadingPoint", "unloadingPoint", "dropoffPoint", "mileage", "estimatedRevenue", "baseFreight", "commissionType", "commissionValue", "commissionRemark", "defaultVehicle", "defaultDriver"]) {
  assert.ok(script.includes(fieldName), `固定线路列表 / 详情 / 表单缺少后台字段 ${fieldName}`);
}
assert.match(script, /计划任务编号[\s\S]*线路信息[\s\S]*派单与执行信息/);
assert.doesNotMatch(script.slice(script.indexOf('moduleCatalog.plan.items ='), script.indexOf('moduleCatalog.capacity.items =')), /派发模式/);
assert.doesNotMatch(script.slice(script.indexOf('function renderPlanDetail('), script.indexOf('const MOBILE_RECORDS_KEY')), /派发模式/);
for (const fieldName of ["planTaskNo", "executionTime", "taskType", "projectName", "routeId", "customerId", "boxType", "containers", "receivableFees", "payableFees"]) {
  assert.ok(script.includes(`${fieldName}:`), `计划详情未覆盖后台字段 ${fieldName}`);
}
assert.match(script, /function createMobileRecord\(/);
assert.match(script, /function saveEntry\(/);
assert.match(script, /querySelectorAll\("\[required\]"\)/);
const mobilePlanConfig = script.slice(script.indexOf('  plan: {'), script.indexOf('\n  },', script.indexOf('  plan: {')));
assert.doesNotMatch(mobilePlanConfig, /派单方式|提前量|dispatchMode|dispatchAdvanceMinutes/);
assert.match(css, /\.mobile-field input:invalid\.touched/);
for (const fieldName of ["routeState", "commissionType", "ownership", "vehicleState", "gender", "driverState", "customerStatus"]) {
  assert.match(script, new RegExp(`name: "${fieldName}"[^\n]*required: true`), `${fieldName} 缺少必填标识`);
}
assert.match(script, /updateWaybillCustomer/);
assert.match(script, /updateDispatchSummary/);
assert.match(script, /container-logistics-manager-mobile-records-v1/);

console.log("admin mobile tests passed");
