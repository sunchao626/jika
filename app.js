const CapacityOwnership = window.CapacityOwnership || {
  TYPES: { SELF: "自营", THIRD: "三方", PENDING: "待确定" },
  SELF_ORGANIZATION: "万物时空",
  normalizeType(value) { return ["三方", "外协", "外协司机", "三方司机", "外部", "外部司机"].includes(value) ? "三方" : "自营"; },
  normalizeOrganizationName(value) { return String(value ?? "").trim(); },
  normalizeOrganizationText(value) { return String(value ?? ""); },
  organizationName(record = {}) { return this.normalizeType(record.capacityOwnership || record.ownership || record.driverType) === "自营" ? this.SELF_ORGANIZATION : record.supplierName || record.fleetName || record.fleet || "未配置供应商"; },
  normalizeResource(record = {}, kind = "vehicle") { record.capacityOwnership = this.normalizeType(record.capacityOwnership || record.ownership || record.driverType); record.organizationName = this.organizationName(record); record.supplierName = record.capacityOwnership === "三方" ? record.organizationName : ""; if (kind === "driver") record.driverType = record.capacityOwnership === "三方" ? "三方司机" : "自有司机"; else record.ownership = record.capacityOwnership === "三方" ? "外协" : "自有"; return record; },
  groupSnapshot(resources = [], options = {}) { const list = resources.filter(Boolean).map((item) => ({ role: item.role || "运力", name: item.name || "未选择", type: this.normalizeType(item.capacityOwnership || item.ownership || item.driverType), organizationName: this.organizationName(item), supplierName: item.supplierName || "" })); const types = new Set(list.map((item) => item.type)); const compatible = !options.missingRequired && list.length > 0 && types.size === 1; const type = list.find((item) => item.role === "车辆")?.type || list[0]?.type || this.normalizeType(options.fallbackType); return { type, compatible, resources: list, supplierNames: [...new Set(list.filter((item) => item.type === "三方").map((item) => item.organizationName))], tooltip: list.map((item) => `${item.role}：${item.name} · ${item.organizationName}`).join("\n") }; },
  isCompatible(resources = [], options = {}) { return this.groupSnapshot(resources, options).compatible; },
  matchesFilter(value, filter) { return !filter || this.normalizeType(value) === this.normalizeType(filter); },
  badgeMarkup(value, tooltip = "") { const type = this.normalizeType(value); const className = type === "自营" ? "self" : type === "三方" ? "third" : "pending"; return `<span class="capacity-ownership-badge ${className}"${tooltip ? ` title="${this.normalizeOrganizationText(tooltip).replaceAll('"', '&quot;')}"` : ""}>${type}</span>`; },
  sortSelfFirst(records, getter = (item) => item.capacityOwnership) { const order = { 自营: 0, 三方: 1, 待确定: 2 }; return [...records].sort((a, b) => (order[this.normalizeType(getter(a))] ?? 9) - (order[this.normalizeType(getter(b))] ?? 9)); },
  readSuppliers() { return []; }, findSupplier() { return null; },
};

function organizationDisplayName(value, fallback = "") {
  const normalized = CapacityOwnership.normalizeOrganizationName(value);
  return normalized || fallback;
}

const waybills = [
  {
    waybillNo: "WB20260916001",
    taskType: "提空装货",
    executionTime: "2026-09-16T08:00",
    dispatchMode: "auto",
    orderDate: "2026-09-16",
    customerId: "KH-HM",
    customerName: "华贸",
    projectId: "PR-HM-BYD",
    projectName: "比亚迪",
    routeId: "XL-001",
    billNo: "BL-NB26091601",
    loadAddress: "宁波北仑港区二期 / 江北仓",
    dispatchNo: "PC-260916-A01",
    dispatchDate: "2026-09-16",
    boxNo1: "TCLU8374621",
    sealNo1: "S983421",
    boxNo2: "-",
    sealNo2: "-",
    boxType: "40HQ",
    auditState: "草拟",
    needReceipt: "是",
    receivedReceipt: "否",
    remark: "上午装柜",
    freight: 2600,
    receivable: 2860,
    entryDate: "2026-09-16",
    profit: 420,
    payable: 2440,
    carrier: "甬港联运车队",
    returnPoint: "北仑三期堆场",
  },
  {
    waybillNo: "WB20260916002",
    taskType: "提重送货",
    executionTime: "2026-09-17T07:30",
    dispatchMode: "manual",
    orderDate: "2026-09-16",
    customerId: "KH-LG",
    customerName: "陆港多联",
    projectId: "PR-LG-TH",
    projectName: "提箱装货",
    routeId: "XL-002",
    billNo: "BL-SH26091607",
    loadAddress: "上海洋山港 / 昆山综合保税区",
    dispatchNo: "PC-260916-B03",
    dispatchDate: "2026-09-17",
    boxNo1: "MSKU4920183",
    sealNo1: "S771204",
    boxNo2: "MSKU4920184",
    sealNo2: "S771205",
    boxType: "20GP*2",
    auditState: "草拟",
    needReceipt: "是",
    receivedReceipt: "否",
    remark: "双拖作业",
    freight: 3200,
    receivable: 3520,
    entryDate: "2026-09-16",
    profit: 560,
    payable: 2960,
    carrier: "沪甬通达运输",
    returnPoint: "洋山一期空箱区",
  },
  {
    waybillNo: "WB20260916003",
    taskType: "排空箱（A→B）",
    executionTime: "2026-09-16T18:00",
    dispatchMode: "auto",
    orderDate: "2026-09-15",
    customerId: "KH-ZT",
    customerName: "中铁联集项目",
    projectId: "PR-ZT-X387",
    projectName: "X387",
    routeId: "XL-003",
    billNo: "BL-HZ26091518",
    loadAddress: "杭州萧山仓 / 宁波梅山码头",
    dispatchNo: "PC-260916-C02",
    dispatchDate: "2026-09-16",
    boxNo1: "CMAU6502739",
    sealNo1: "S650889",
    boxNo2: "-",
    sealNo2: "-",
    boxType: "40GP",
    auditState: "草拟",
    needReceipt: "否",
    receivedReceipt: "否",
    remark: "夜间进港",
    freight: 2380,
    receivable: 2550,
    entryDate: "2026-09-16",
    profit: 350,
    payable: 2200,
    carrier: "杭甬快线车队",
    returnPoint: "梅山保税港区",
  },
  {
    waybillNo: "WB20260916004",
    taskType: "排重箱（A→B）",
    executionTime: "2026-09-18T14:00",
    dispatchMode: "manual",
    orderDate: "2026-09-14",
    customerId: "KH-ZT",
    customerName: "中铁联集项目",
    projectId: "PR-ZT-X8588",
    projectName: "X8588",
    routeId: "XL-004",
    billNo: "BL-SZ26091409",
    loadAddress: "苏州工业园区 / 上海外高桥",
    dispatchNo: "PC-260916-D05",
    dispatchDate: "2026-09-18",
    boxNo1: "OOLU3087642",
    sealNo1: "S214700",
    boxNo2: "-",
    sealNo2: "-",
    boxType: "20GP",
    auditState: "草拟",
    needReceipt: "是",
    receivedReceipt: "否",
    remark: "客户指定司机",
    freight: 1850,
    receivable: 1980,
    entryDate: "2026-09-16",
    profit: 260,
    payable: 1720,
    carrier: "苏沪集运物流",
    returnPoint: "外高桥五期",
  },
  {
    waybillNo: "WB20261022001",
    planTaskId: "PT-DEMO-PENDING-001",
    planTaskNo: "PT20261022001",
    taskType: "提空装货",
    executionTime: "2026-10-25T08:00",
    plannedBerthingTime: "2026-10-25T08:00",
    planExecutionDate: "2026-10-25",
    dispatchMode: "pending",
    orderDate: "2026-10-22",
    customerId: "KH-HM",
    customerName: "华贸",
    projectId: "PR-HM-BYD",
    projectName: "比亚迪",
    routeId: "XL-001",
    billNo: "BL-NB26102201",
    loadAddress: "宁波北仑港区二期 / 比亚迪宁波基地",
    dispatchNo: "",
    dispatchDate: "",
    boxNo1: "",
    sealNo1: "",
    boxNo2: "",
    sealNo2: "",
    boxType: "40HQ",
    status: "待派单",
    auditState: "草拟",
    needReceipt: "是",
    receivedReceipt: "否",
    remark: "未开始计划演示 · 子任务 1",
    freight: 2600,
    receivable: 2860,
    entryDate: "2026-10-22",
    profit: 420,
    payable: 2440,
    carrier: "待分配",
    returnPoint: "北仑三期堆场",
  },
  {
    waybillNo: "WB20261022002",
    planTaskId: "PT-DEMO-PENDING-001",
    planTaskNo: "PT20261022001",
    taskType: "提空装货",
    executionTime: "2026-10-25T10:30",
    plannedBerthingTime: "2026-10-25T10:30",
    planExecutionDate: "2026-10-25",
    dispatchMode: "pending",
    orderDate: "2026-10-22",
    customerId: "KH-HM",
    customerName: "华贸",
    projectId: "PR-HM-BYD",
    projectName: "比亚迪",
    routeId: "XL-001",
    billNo: "BL-NB26102202",
    loadAddress: "宁波北仑港区二期 / 比亚迪宁波基地",
    dispatchNo: "",
    dispatchDate: "",
    boxNo1: "",
    sealNo1: "",
    boxNo2: "",
    sealNo2: "",
    boxType: "20GP",
    status: "待派单",
    auditState: "草拟",
    needReceipt: "是",
    receivedReceipt: "否",
    remark: "未开始计划演示 · 子任务 2",
    freight: 2100,
    receivable: 2320,
    entryDate: "2026-10-22",
    profit: 340,
    payable: 1980,
    carrier: "待分配",
    returnPoint: "北仑三期堆场",
  },
  {
    waybillNo: "WB20261022003",
    planTaskId: "PT-DEMO-PENDING-002",
    planTaskNo: "PT20261022002",
    taskType: "排空箱（A→B）",
    executionTime: "2026-10-26T14:00",
    plannedBerthingTime: "2026-10-26T14:00",
    planExecutionDate: "2026-10-26",
    dispatchMode: "pending",
    orderDate: "2026-10-22",
    customerId: "KH-ZT",
    customerName: "中铁联集项目",
    projectId: "PR-ZT-X8786",
    projectName: "X8786",
    routeId: "XL-005",
    billNo: "BL-NB26102203",
    loadAddress: "宁波穿山港 / 义乌保税物流中心",
    dispatchNo: "",
    dispatchDate: "",
    boxNo1: "",
    sealNo1: "",
    boxNo2: "",
    sealNo2: "",
    boxType: "40GP",
    status: "待派单",
    auditState: "草拟",
    needReceipt: "否",
    receivedReceipt: "否",
    remark: "未开始计划演示 · 单子任务",
    freight: 2860,
    receivable: 3180,
    entryDate: "2026-10-22",
    profit: 430,
    payable: 2750,
    carrier: "待分配",
    returnPoint: "穿山港还箱区",
  },
];

const WAYBILL_STORAGE_KEY = "container-logistics-waybills-v1";
const seedWaybillNumbers = new Set(waybills.map((item) => item.waybillNo));
try {
  const savedWaybills = JSON.parse(localStorage.getItem(WAYBILL_STORAGE_KEY) || "[]");
  if (Array.isArray(savedWaybills)) {
    const known = new Set(seedWaybillNumbers);
    savedWaybills.forEach((item) => {
      if (!item || typeof item.waybillNo !== "string" || known.has(item.waybillNo)) return;
      known.add(item.waybillNo);
      waybills.push(item);
    });
  }
} catch (error) {
  console.warn("运单数据读取失败，使用初始数据。", error);
}

// Legacy records are treated as one-record parent tasks so the task list can stay aggregated.
let initializedWaybillOperator = false;
waybills.forEach((item) => {
  if (!item.planTaskId) item.planTaskId = `PT-LEGACY-${item.waybillNo}`;
  if (!item.planTaskNo) item.planTaskNo = item.planTaskId;
  if (!item.orderOperatorName) {
    item.orderOperatorName = "张调度";
    initializedWaybillOperator = true;
  }
  if (!item.projectName) item.projectName = "未分配项目";
  if (!item.planExecutionDate) item.planExecutionDate = String(item.executionTime || item.orderDate || "").slice(0, 10);
  if (!item.plannedBerthingTime) item.plannedBerthingTime = item.executionTime || `${item.planExecutionDate || item.orderDate}T08:00`;
});
if (initializedWaybillOperator) saveWaybills();

function saveWaybills() {
  try {
    localStorage.setItem(WAYBILL_STORAGE_KEY, JSON.stringify(waybills.filter((item) => !seedWaybillNumbers.has(item.waybillNo))));
  } catch (error) {
    console.warn("运单数据保存失败。", error);
  }
}

function currentOrderOperatorName() {
  return typeof document === "undefined" ? "后台用户" : document.querySelector("#userAccountButton .user-account-copy strong")?.textContent.trim() || "后台用户";
}

const columns = [
  "waybillNo",
  "taskType",
  "planExecutionDate",
  "plannedBerthingTime",
  "executionTime",
  "dispatchMode",
  "orderDate",
  "customerId",
  "customerName",
  "billNo",
  "loadAddress",
  "dispatchNo",
  "dispatchDate",
  "boxNo1",
  "sealNo1",
  "boxNo2",
  "sealNo2",
  "boxType",
  "auditState",
  "needReceipt",
  "receivedReceipt",
  "remark",
  "freight",
  "receivable",
  "entryDate",
  "profit",
  "payable",
  "carrier",
  "returnPoint",
];

const moneyFields = new Set(["freight", "receivable", "profit", "payable"]);
const tableBody = document.querySelector("#waybillBody");
const moreBtn = document.querySelector("#moreBtn");
const moreMenu = document.querySelector("#moreMenu");
const addBtn = document.querySelector("#addBtn");
const batchPlanTaskBtn = document.querySelector("#batchPlanTaskBtn");
const addDialog = document.querySelector("#addDialog");
const waybillForm = document.querySelector("#waybillForm");
const planTaskDialog = document.querySelector("#planTaskDialog");
const planTaskForm = document.querySelector("#planTaskForm");
const planTaskBatchMode = document.querySelector("#planTaskBatchMode");
const planTaskSingleMode = document.querySelector("#planTaskSingleMode");
const planTaskBatchInput = document.querySelector("#planTaskBatchInput");
const planTaskTemplateManagerDialog = document.querySelector("#planTaskTemplateManagerDialog");
const planTaskTemplateEditorDialog = document.querySelector("#planTaskTemplateEditorDialog");
const planTaskTemplateForm = document.querySelector("#planTaskTemplateForm");
const planTaskTemplateBody = document.querySelector("#planTaskTemplateBody");
const planTaskTemplateItemsBody = document.querySelector("#planTaskTemplateItems");
const waybillContainerBody = document.querySelector("#waybillContainerBody");
const receivableFeeBody = document.querySelector("#receivableFeeBody");
const payableFeeBody = document.querySelector("#payableFeeBody");
const queryForm = document.querySelector("#queryForm");
const resultText = document.querySelector("#resultText");
const planTaskQuickStats = document.querySelector("#planTaskQuickStats");
let planTaskQuickFilter = "";
const pageTitle = document.querySelector("#pageTitle");
const pageKicker = document.querySelector("#pageKicker");
const userAccountWrap = document.querySelector(".user-account-wrap");
const userAccountButton = document.querySelector("#userAccountButton");
const userAccountMenu = document.querySelector("#userAccountMenu");
const userActionFeedback = document.querySelector("#userActionFeedback");
let userActionFeedbackTimer;
const appNoticeDialog = document.querySelector("#appNoticeDialog");
const appConfirmDialog = document.querySelector("#appConfirmDialog");
let pendingAppConfirmation = null;

function showApplicationAlert(message) {
  const text = document.querySelector("#appNoticeText");
  if (!appNoticeDialog || !text) return showUserActionFeedback(String(message));
  text.textContent = String(message);
  if (!appNoticeDialog.open) appNoticeDialog.showModal();
}

function askApplicationConfirm(message, { label = "确认", danger = false } = {}, action) {
  document.querySelector("#appConfirmText").textContent = message;
  const confirmButton = document.querySelector("#acceptAppConfirmBtn");
  confirmButton.textContent = label;
  confirmButton.classList.toggle("danger", danger);
  confirmButton.classList.toggle("primary", !danger);
  pendingAppConfirmation = action;
  appConfirmDialog.showModal();
}

document.querySelector("#closeAppNoticeBtn")?.addEventListener("click", () => appNoticeDialog.close());
document.querySelector("#cancelAppConfirmBtn")?.addEventListener("click", () => { pendingAppConfirmation = null; appConfirmDialog.close(); });
document.querySelector("#acceptAppConfirmBtn")?.addEventListener("click", () => { const action = pendingAppConfirmation; pendingAppConfirmation = null; appConfirmDialog.close(); action?.(); });
appConfirmDialog?.addEventListener("cancel", () => { pendingAppConfirmation = null; });

function setUserAccountMenu(open) {
  if (!userAccountButton || !userAccountMenu) return;
  userAccountButton.setAttribute("aria-expanded", String(open));
  userAccountMenu.hidden = !open;
}

function showUserActionFeedback(action) {
  if (!userActionFeedback) return;
  const messages = {
    logout: "退出登录功能演示，当前登录状态未改变",
  };
  userActionFeedback.textContent = messages[action] || "操作演示完成";
  userActionFeedback.hidden = false;
  window.clearTimeout(userActionFeedbackTimer);
  userActionFeedbackTimer = window.setTimeout(() => {
    userActionFeedback.hidden = true;
  }, 2500);
}

userAccountButton?.addEventListener("click", () => {
  const willOpen = userAccountButton.getAttribute("aria-expanded") !== "true";
  if (willOpen && userActionFeedback) userActionFeedback.hidden = true;
  setUserAccountMenu(willOpen);
});

userAccountMenu?.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-user-action]");
  if (!actionButton) return;
  setUserAccountMenu(false);
  showUserActionFeedback(actionButton.dataset.userAction);
});

document.addEventListener("click", (event) => {
  if (userAccountWrap && !userAccountWrap.contains(event.target)) setUserAccountMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || userAccountButton?.getAttribute("aria-expanded") !== "true") return;
  setUserAccountMenu(false);
  userAccountButton.focus();
});
const REMINDER_TEMPLATE_STORAGE_KEY = "container-logistics-reminder-templates-v1";
const reminderTemplateSeed = [
  { id: "NT-001", code: "VEHICLE_ARRIVAL", name: "车辆到达仓库提醒", eventType: "车辆到达", scope: "全部车队", triggerTiming: "immediate", offsetMinutes: 0, sendTime: "09:00", recipients: ["调度员"], channels: ["站内消息", "司机移动端"], forceLogic: "普通提醒", repeatInterval: "不重复", maxRepeats: 1, enabled: true, title: "车辆已到达{{当前节点}}", content: "车辆 {{车牌号}} 已到达 {{当前节点}}，请及时安排下一步作业。", updatedAt: "2026-09-18 10:20" },
  { id: "NT-002", code: "PHOTO_REQUIRED", name: "节点拍照缺失提醒", eventType: "节点拍照", scope: "指定任务类型", triggerTiming: "after", offsetMinutes: 10, sendTime: "09:00", recipients: ["司机", "调度员"], channels: ["司机移动端", "站内消息"], forceLogic: "必须处理", repeatInterval: "每 30 分钟", maxRepeats: 3, enabled: true, title: "{{当前节点}}照片待补交", content: "运单 {{运单号}} 的 {{当前节点}} 尚未上传现场照片，请完成拍照后再提交节点。", updatedAt: "2026-09-18 09:45" },
  { id: "NT-003", code: "CERT_EXPIRING", name: "证照临期提醒", eventType: "证照临期", scope: "全部车队", triggerTiming: "before", offsetMinutes: 30, sendTime: "08:30", recipients: ["车辆管理员", "管理员"], channels: ["站内消息"], forceLogic: "重复提醒并升级", repeatInterval: "每天 1 次", maxRepeats: 0, enabled: true, title: "{{车牌号}}证照即将到期", content: "{{车牌号}} 的证照将于 {{到期日期}} 到期，请及时完成续办并上传新证照。", updatedAt: "2026-09-17 16:10" },
  { id: "NT-004", code: "CERT_EXPIRED", name: "证照过期阻断提醒", eventType: "证照过期", scope: "全部车队", triggerTiming: "immediate", offsetMinutes: 0, sendTime: "09:00", recipients: ["车辆管理员", "调度员", "管理员"], channels: ["站内消息", "微信/短信"], forceLogic: "阻断业务", repeatInterval: "每天 1 次", maxRepeats: 0, enabled: true, title: "{{车牌号}}证照已过期", content: "{{车牌号}} 的证照已于 {{到期日期}} 过期，系统已暂停其派单资格，请完成续办。", updatedAt: "2026-09-16 14:30" },
  { id: "NT-005", code: "DISPATCH_REJECTED", name: "司机拒单提醒", eventType: "司机拒单", scope: "全部车队", triggerTiming: "immediate", offsetMinutes: 0, sendTime: "09:00", recipients: ["调度员"], channels: ["站内消息"], forceLogic: "必须处理", repeatInterval: "不重复", maxRepeats: 1, enabled: true, title: "司机拒绝了新的派单", content: "司机 {{司机姓名}} 拒绝运单 {{运单号}}，请查看原因并重新安排派单。", updatedAt: "2026-09-15 11:05" },
  { id: "NT-006", code: "PHOTO_UPLOAD_FAILED", name: "照片上传失败提醒", eventType: "照片上传失败", scope: "全部车队", triggerTiming: "immediate", offsetMinutes: 0, sendTime: "09:00", recipients: ["司机", "调度员"], channels: ["司机移动端", "站内消息"], forceLogic: "普通提醒", repeatInterval: "每 2 小时", maxRepeats: 3, enabled: false, title: "现场照片上传失败", content: "运单 {{运单号}} 的现场照片上传失败，请检查网络后重新提交。", updatedAt: "2026-09-12 15:40" },
];
const reminderTemplates = (() => {
  try {
    const stored = JSON.parse(localStorage.getItem(REMINDER_TEMPLATE_STORAGE_KEY) || "null");
    return Array.isArray(stored) && stored.length ? stored : reminderTemplateSeed.map((item) => ({ ...item, recipients: [...item.recipients], channels: [...item.channels] }));
  } catch (error) {
    return reminderTemplateSeed.map((item) => ({ ...item, recipients: [...item.recipients], channels: [...item.channels] }));
  }
})();
let reminderTemplateEditingId = "";
let reminderTemplateCurrentPage = 1;

const ANNOUNCEMENT_STORAGE_KEY = "container-logistics-announcements-v1";
const announcementSeed = [
  { id: "AN-001", title: "国庆期间港区作业安排", type: "运营通知", content: "国庆期间各港区作业时间按现场预约安排执行，请提前确认进港计划。", scope: "全部司机", targetDriverIds: [], attachment: "", status: "已发布", publishedAt: "2026-10-01 08:30", published: true },
  { id: "AN-002", title: "雨季行车安全提醒", type: "安全提醒", content: "近期雨天增多，请检查雨刷、轮胎和灯光，进出港区减速慢行。", scope: "部分司机 · 3 人", targetDriverIds: ["SJ-1001", "SJ-1002", "SJ-1004"], attachment: "安全行车指引.pdf", status: "已发布", publishedAt: "2026-09-26 16:20", published: true },
];
const announcements = (() => {
  try {
    const stored = JSON.parse(localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) || "null");
    return Array.isArray(stored) ? stored : announcementSeed.map((item) => ({ ...item, targetDriverIds: [...item.targetDriverIds] }));
  } catch (error) {
    return announcementSeed.map((item) => ({ ...item, targetDriverIds: [...item.targetDriverIds] }));
  }
})();
let announcementCurrentPage = 1;
let announcementSelectedDriverIds = new Set();

function saveAnnouncements() {
  try { localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(announcements)); } catch (error) { console.warn("公告保存失败。", error); }
}
saveAnnouncements();

function saveReminderTemplates() {
  try { localStorage.setItem(REMINDER_TEMPLATE_STORAGE_KEY, JSON.stringify(reminderTemplates)); } catch (error) { console.warn("提醒模板保存失败。", error); }
  window.dispatchEvent(new CustomEvent("reminder-templates-updated", { detail: reminderTemplates.map((item) => ({ ...item })) }));
}

window.ReminderTemplateManager = {
  list(options = {}) {
    return reminderTemplates.filter((item) => !options.enabledOnly || item.enabled).map((item) => ({ ...item, recipients: [...(item.recipients || [])], channels: [...(item.channels || [])] }));
  },
  get(id) {
    const item = reminderTemplates.find((template) => template.id === id);
    return item ? { ...item, recipients: [...(item.recipients || [])], channels: [...(item.channels || [])] } : null;
  },
};

const pageViews = {
  dashboard: document.querySelector("#dashboardPage"),
  waybill: document.querySelector("#waybillPage"),
  route: document.querySelector("#routePage"),
  dispatch: document.querySelector("#dispatchPage"),
  dispatchDetail: document.querySelector("#dispatchDetailPage"),
  planTaskDetail: document.querySelector("#planTaskDetailPage"),
  dispatchManagement: document.querySelector("#dispatchManagementPage"),
  capacity: document.querySelector("#capacityPage"),
  autoDispatch: document.querySelector("#autoDispatchPage"),
  autoDispatchConfig: document.querySelector("#autoDispatchConfigPage"),
  transportTaskConfig: document.querySelector("#transportTaskConfigPage"),
  vehicleMaintenanceFees: document.querySelector("#vehicleMaintenanceFeeConfigPage"),
  userAccess: document.querySelector("#userAccessPage"),
  operationLogs: document.querySelector("#operationLogPage"),
  platformConfig: document.querySelector("#platformConfigPage"),
  operationsOverview: document.querySelector("#operationsOverviewPage"),
  waybillProfit: document.querySelector("#waybillProfitPage"),
  operationsReport: document.querySelector("#operationsReportPage"),
  selfOwnedVehicleAnalysis: document.querySelector("#selfOwnedVehicleAnalysisPage"),
  finance: document.querySelector("#financePage"),
  driverExpenses: document.querySelector("#driverExpensePage"),
  settlement: document.querySelector("#settlementPage"),
  vehicleRepairs: document.querySelector("#vehicleRepairPage"),
  customer: document.querySelector("#customerPage"),
  reminderTemplates: document.querySelector("#reminderTemplatePage"),
  announcements: document.querySelector("#announcementPage"),
  feedbackManagement: document.querySelector("#feedbackManagementPage"),
  vehicle: document.querySelector("#vehiclePage"),
  trailer: document.querySelector("#trailerPage"),
  driver: document.querySelector("#driverPage"),
};
const pageMeta = {
  home: { title: "首页看板", kicker: "运营中心 / 全局驾驶舱", view: "dashboard", navPage: "vehicle-dashboard" },
  "vehicle-dashboard": { title: "首页看板", kicker: "运营中心 / 全局驾驶舱", view: "dashboard", navPage: "vehicle-dashboard" },
  waybill: { title: "计划与任务", kicker: "计划与派单 / 计划任务", view: "waybill" },
  "fixed-routes": { title: "固定线路管理", kicker: "线路管理 / 固定线路", view: "route" },
  "dispatch-management": { title: "任务派单", kicker: "计划与派单 / 调度工作台", view: "dispatchManagement" },
  "dispatch-list": { title: "派单列表", kicker: "计划与派单 / 派单调度", view: "dispatch" },
  "dispatch-detail": { title: "派单详情", kicker: "计划与派单 / 派单列表 / 派单详情", view: "dispatchDetail", navPage: "dispatch-list" },
  "plan-task-detail": { title: "计划 / 派单详情", kicker: "计划与派单 / 计划与任务 / 详情", view: "planTaskDetail", navPage: "waybill" },
  "capacity-management": { title: "运力管理", kicker: "计划与派单 / 运力状态", view: "capacity" },
  "auto-dispatch": { title: "自动派单", kicker: "计划与派单 / 智能调度", view: "autoDispatch" },
  "auto-dispatch-config": { title: "自动派单配置", kicker: "系统配置 / 自动派单", view: "autoDispatchConfig" },
  "transport-task-config": { title: "任务类型配置", kicker: "系统配置 / 任务类型配置", view: "transportTaskConfig" },
  "vehicle-maintenance-fees": { title: "车辆维护费用配置", kicker: "系统配置 / 车辆维护费用配置", view: "vehicleMaintenanceFees" },
  "user-access": { title: "用户与权限", kicker: "系统配置 / 用户与权限", view: "userAccess" },
  "operation-logs": { title: "操作日志", kicker: "系统配置 / 操作日志", view: "operationLogs" },
  "platform-config": { title: "平台配置", kicker: "系统配置 / 平台配置", view: "platformConfig" },
  "operations-overview": { title: "运营经营概览", kicker: "数据看板 / 运营经营概览", view: "operationsOverview" },
  "waybill-profit": { title: "基础运单利润", kicker: "数据看板 / 基础运单利润", view: "waybillProfit" },
  "operations-report": { title: "运营分析报表", kicker: "数据看板 / 运营分析报表", view: "operationsReport" },
  "self-owned-vehicle-analysis": { title: "自营车辆分析表", kicker: "数据看板 / 自营车辆分析表", view: "selfOwnedVehicleAnalysis" },
  "finance-reports": { title: "运输管理台账", kicker: "结算中心 / 运输管理台账", view: "finance" },
  "driver-expenses": { title: "司机费用上报", kicker: "结算中心 / 司机费用上报", view: "driverExpenses" },
  "settlement-management": { title: "结算管理", kicker: "结算中心 / 结算管理", view: "settlement", settlementModule: "overview" },
  "settlement-receivable": { title: "应收账款管理", kicker: "结算中心 / 应收账款管理", view: "settlement", settlementModule: "receivable" },
  "settlement-payable": { title: "三方应付结算", kicker: "结算中心 / 三方应付结算", view: "settlement", settlementModule: "payable" },
  "settlement-payroll": { title: "自营结算", kicker: "结算中心 / 自营结算", view: "settlement", settlementModule: "payroll" },
  "settlement-abnormal": { title: "异常费用管理", kicker: "结算中心 / 异常费用管理", view: "settlement", settlementModule: "abnormal" },
  "settlement-transactions": { title: "发票与收付款", kicker: "结算中心 / 发票与收付款", view: "settlement", settlementModule: "transactions" },
  "settlement-energy": { title: "预充值管理", kicker: "结算中心 / 预充值管理", view: "settlement", settlementModule: "energy" },
  "vehicle-repairs": { title: "车辆维修保养", kicker: "车辆管理 / 维修保养", view: "vehicleRepairs" },
  "customer-archives": { title: "客户管理", kicker: "系统配置 / 客户管理", view: "customer" },
  "reminder-templates": { title: "消息提醒模板", kicker: "系统配置 / 消息提醒", view: "reminderTemplates" },
  announcements: { title: "公告管理", kicker: "系统配置 / 公告管理", view: "announcements" },
  "feedback-management": { title: "意见反馈管理", kicker: "系统配置 / 意见反馈管理", view: "feedbackManagement" },
  vehicle: {
    title: "车辆管理",
    kicker: "车辆管理 / 车辆台账",
    view: "vehicle",
    module: "archives",
    navPage: "vehicle-archives",
  },
  "vehicle-archives": {
    title: "车辆管理",
    kicker: "车辆管理 / 车辆台账",
    view: "vehicle",
    module: "archives",
  },
  "trailer-archives": {
    title: "车辆档案管理",
    kicker: "车辆管理 / 车辆档案",
    view: "trailer",
  },
  "driver-archives": {
    title: "司机档案管理",
    kicker: "司机管理 / 司机档案",
    view: "driver",
  },
};

const today = new Date();
today.setHours(0, 0, 0, 0);
const trailers = [
  { id: "TR-001", plateNo: "浙B·挂7812", trailerType: "集装箱骨架车", vin: "LZ9GCS2A6PX781201", engineNo: "", ownership: "自有", fleet: "宁波一车队", trailerState: "在用", registrationCertNo: "浙B挂7812", permitNo: "浙交运管宁字330206-TR01", operatingPermitExpiry: "2027-10-18", inspectionDue: "2026-10-18", mandatoryInsuranceCompany: "太平洋财险宁波分公司", mandatoryInsuranceNo: "CPIC-TR-7812-M", mandatoryInsuranceExpiry: "2026-10-05", commercialInsuranceCompany: "太平洋财险宁波分公司", commercialInsuranceNo: "CPIC-TR-7812-C", commercialInsuranceExpiry: "2026-10-05", insuranceNo: "CPIC-TR-7812", insuranceDue: "2026-10-05", attachments: "行驶证、营运证、保单", remark: "港区短驳常用挂车" },
  { id: "TR-002", plateNo: "沪D·挂9021", trailerType: "集装箱骨架车", vin: "LZ9GCS2A6PX902102", engineNo: "", ownership: "外协", fleet: "上海外协车队", trailerState: "在用", registrationCertNo: "沪D挂9021", permitNo: "沪交运管字310115-TR02", operatingPermitExpiry: "2027-09-28", inspectionDue: "2026-09-28", mandatoryInsuranceCompany: "中国人保上海分公司", mandatoryInsuranceNo: "PICC-TR-9021-M", mandatoryInsuranceExpiry: "2026-11-12", commercialInsuranceCompany: "中国人保上海分公司", commercialInsuranceNo: "PICC-TR-9021-C", commercialInsuranceExpiry: "2026-11-12", insuranceNo: "PICC-TR-9021", insuranceDue: "2026-11-12", attachments: "行驶证、保单", remark: "临港双拖挂车" },
  { id: "TR-003", plateNo: "苏E·挂5568", trailerType: "集装箱骨架车", vin: "LZ9GCS2A6PX556803", engineNo: "", ownership: "自有", fleet: "苏州二车队", trailerState: "停用", registrationCertNo: "苏E挂5568", permitNo: "苏交运管苏字320500-TR03", operatingPermitExpiry: "2026-08-30", inspectionDue: "2026-08-30", mandatoryInsuranceCompany: "平安财险苏州分公司", mandatoryInsuranceNo: "PAIC-TR-5568-M", mandatoryInsuranceExpiry: "2026-09-10", commercialInsuranceCompany: "平安财险苏州分公司", commercialInsuranceNo: "PAIC-TR-5568-C", commercialInsuranceExpiry: "2026-09-10", insuranceNo: "PAIC-TR-5568", insuranceDue: "2026-09-10", attachments: "行驶证、营运证、保单", remark: "待复检，暂不调度" },
  { id: "TR-004", plateNo: "浙A·挂2190", trailerType: "危险品罐式挂车", vin: "LZ9GCS2A6PX219004", engineNo: "", ownership: "外协", fleet: "杭州危运车队", trailerState: "在用", registrationCertNo: "浙A挂2190", permitNo: "浙交运管杭字330109-TR04", operatingPermitExpiry: "2027-12-20", inspectionDue: "2026-12-20", mandatoryInsuranceCompany: "中国人保杭州分公司", mandatoryInsuranceNo: "PICC-TR-2190-M", mandatoryInsuranceExpiry: "2026-09-30", commercialInsuranceCompany: "中国人保杭州分公司", commercialInsuranceNo: "PICC-TR-2190-C", commercialInsuranceExpiry: "2026-09-30", insuranceNo: "PICC-TR-2190", insuranceDue: "2026-09-30", attachments: "营运证、保单", remark: "危险品运输专用" },
];
const vehicles = [
  {
    plateNo: "浙B·K7812",
    driver: "王海 / 13800008881",
    fleet: "宁波一车队",
    fleetName: "宁波港区集卡车队",
    trailerId: "TR-001",
    vehicleType: "集装箱牵引车",
    vin: "LZGCL2M43PX260188",
    engineNo: "WP13H560E68-24091",
    curbWeight: 8.6,
    ratedLoad: 31.4,
    fuelConsumption: 32.5,
    registrationCertNo: "浙B0007812",
    technicalLevel: "一级",
    technicalLevelExpiry: "2027-10-18",
    drivingLicenseNo: "浙B7812",
    drivingLicenseExpiry: "2027-10-18",
    permitNo: "浙交运管宁字330206-8891",
    operatingPermitExpiry: "2027-10-18",
    commercialInsuranceNo: "CPIC20260916002",
    commercialInsuranceCompany: "太平洋财险宁波分公司",
    commercialInsuranceExpiry: "2026-10-05",
    mandatoryInsuranceNo: "CPIC20260916001",
    mandatoryInsuranceCompany: "太平洋财险宁波分公司",
    mandatoryInsuranceExpiry: "2026-10-05",
    cargoInsuranceNo: "CPIC20260916003",
    cargoInsuranceExpiry: "2026-10-05",
    ownership: "自有",
    vehicleState: "在用",
    inspectionDue: "2026-10-18",
    insuranceDue: "2026-10-05",
    remark: "港区短驳主力车辆",
    attachments: "行驶证、营运证",
  },
  {
    plateNo: "沪D·A9021",
    driver: "赵亮 / 13900006662",
    fleet: "上海外协车队",
    fleetName: "临港外协集卡车队",
    trailerId: "TR-002",
    vehicleType: "重型半挂牵引车",
    vin: "LZGCX2T68NX110245",
    engineNo: "MC13H540E61-11820",
    curbWeight: 9.2,
    ratedLoad: 32,
    fuelConsumption: 34.1,
    registrationCertNo: "沪D0009021",
    technicalLevel: "一级",
    technicalLevelExpiry: "2027-09-28",
    drivingLicenseNo: "沪D9021",
    drivingLicenseExpiry: "2027-09-28",
    permitNo: "沪交运管字310115-6720",
    operatingPermitExpiry: "2027-09-28",
    commercialInsuranceNo: "PICC20261112008",
    commercialInsuranceCompany: "中国人保上海分公司",
    commercialInsuranceExpiry: "2026-11-12",
    mandatoryInsuranceNo: "PICC20261112009",
    mandatoryInsuranceCompany: "中国人保上海分公司",
    mandatoryInsuranceExpiry: "2026-11-12",
    cargoInsuranceNo: "PICC20261112010",
    cargoInsuranceExpiry: "2026-11-12",
    ownership: "外协",
    vehicleState: "在用",
    inspectionDue: "2026-09-28",
    insuranceDue: "2026-11-12",
    remark: "临港外协运力",
    attachments: "行驶证",
  },
  {
    plateNo: "苏E·T5568",
    driver: "刘军 / 13700003335",
    fleet: "苏州二车队",
    fleetName: "苏州园区集卡车队",
    trailerId: "TR-003",
    vehicleType: "集装箱骨架车",
    vin: "LA9941G37M0SZ1007",
    engineNo: "YC6K1346-50-92716",
    curbWeight: 7.8,
    ratedLoad: 30.5,
    fuelConsumption: 31.8,
    registrationCertNo: "苏E0005568",
    technicalLevel: "二级",
    technicalLevelExpiry: "2026-08-30",
    drivingLicenseNo: "苏E5568",
    drivingLicenseExpiry: "2026-08-30",
    permitNo: "苏交运管苏字320500-3109",
    operatingPermitExpiry: "2026-08-30",
    commercialInsuranceNo: "PAIC20260910017",
    commercialInsuranceCompany: "平安财险苏州分公司",
    commercialInsuranceExpiry: "2026-09-10",
    mandatoryInsuranceNo: "PAIC20260910018",
    mandatoryInsuranceCompany: "平安财险苏州分公司",
    mandatoryInsuranceExpiry: "2026-09-10",
    cargoInsuranceNo: "PAIC20260910019",
    cargoInsuranceExpiry: "2026-09-10",
    ownership: "自有",
    vehicleState: "停用",
    inspectionDue: "2026-08-30",
    insuranceDue: "2026-09-10",
    remark: "待复检，暂不排班",
    attachments: "行驶证、营运证、保单",
  },
  {
    plateNo: "浙A·F2190",
    driver: "陈涛 / 13600002228",
    fleet: "杭州危运车队",
    fleetName: "杭州危险品运输车队",
    trailerId: "TR-004",
    vehicleType: "危险品牵引车",
    vin: "LZZPCLNC9PA882019",
    engineNo: "D13TCIF2-33402",
    curbWeight: 10.1,
    ratedLoad: 29.8,
    fuelConsumption: 35.6,
    registrationCertNo: "浙A0002190",
    technicalLevel: "一级",
    technicalLevelExpiry: "2027-12-20",
    drivingLicenseNo: "浙A2190",
    drivingLicenseExpiry: "2027-12-20",
    permitNo: "浙交运管杭字330109-7721",
    operatingPermitExpiry: "2027-12-20",
    commercialInsuranceNo: "PICC20260930031",
    commercialInsuranceCompany: "中国人保杭州分公司",
    commercialInsuranceExpiry: "2026-09-30",
    mandatoryInsuranceNo: "PICC20260930032",
    mandatoryInsuranceCompany: "中国人保杭州分公司",
    mandatoryInsuranceExpiry: "2026-09-30",
    cargoInsuranceNo: "PICC20260930033",
    cargoInsuranceExpiry: "2026-09-30",
    ownership: "外协",
    vehicleState: "在用",
    inspectionDue: "2026-12-20",
    insuranceDue: "2026-09-30",
    remark: "需随车携带危化品资质",
    attachments: "营运证、保单",
  },
];

const inspectionRecords = [
  ["浙B·K7812", "车辆年检", "2025-10-18", "2026-10-18", "宁波机动车检测中心", 680, "通过"],
  ["沪D·A9021", "营运证年审", "2025-09-28", "2026-09-28", "上海临港运输审验站", 520, "通过"],
  ["苏E·T5568", "车辆年检", "2025-08-30", "2026-08-30", "苏州园区机动车检测站", 640, "待复检"],
  ["浙A·F2190", "营运证年审", "2025-12-20", "2026-12-20", "杭州交通运输服务中心", 560, "通过"],
];

const insurancePolicies = [
  ["浙B·K7812", "交强险", "太平洋财险宁波分公司", "CPIC20260916001", 1000000, "2026-10-05", 8600, "2025-10-06 至 2026-10-05", "电子保单"],
  ["浙B·K7812", "商业险", "太平洋财险宁波分公司", "CPIC20260916002", 3000000, "2026-10-05", 12800, "2025-10-06 至 2026-10-05", "电子保单"],
  ["沪D·A9021", "承运人责任险", "中国人保上海分公司", "PICC20261112008", 2000000, "2026-11-12", 9200, "2025-11-13 至 2026-11-12", "电子保单"],
  ["苏E·T5568", "交强险", "平安财险苏州分公司", "PAIC20260910017", 1000000, "2026-09-10", 7900, "2025-09-11 至 2026-09-10", "电子保单"],
  ["浙A·F2190", "商业险", "中国人保杭州分公司", "PICC20260930031", 2500000, "2026-09-30", 11600, "2025-10-01 至 2026-09-30", "电子保单"],
];

const VEHICLE_COMPLIANCE_STORAGE_KEY = "container-logistics-vehicle-compliance-v1";
const inspectionRecordFields = ["plateNo", "inspectionType", "inspectionDate", "nextInspectionDue", "inspectionAgency", "inspectionFee", "inspectionResult", "remark"];
const insurancePolicyFields = ["plateNo", "insuranceType", "insuranceCompany", "policyNo", "insuredAmount", "policyExpiry", "premium", "policyPeriod", "attachment", "policyStart", "remark"];

function loadVehicleComplianceRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(VEHICLE_COMPLIANCE_STORAGE_KEY) || "{}");
    if (Array.isArray(saved.inspections)) inspectionRecords.push(...saved.inspections.filter((record) => record && typeof record === "object" && !Array.isArray(record)));
    if (Array.isArray(saved.policies)) insurancePolicies.push(...saved.policies.filter((record) => record && typeof record === "object" && !Array.isArray(record)));
  } catch (error) {
    console.warn("车辆审验或保险记录读取失败，使用初始记录。", error);
  }
  vehicles.forEach((vehicle) => {
    const inspectionDates = inspectionRecords
      .filter((record) => complianceRecordValue(record, inspectionRecordFields, "plateNo") === vehicle.plateNo)
      .map((record) => complianceRecordValue(record, inspectionRecordFields, "nextInspectionDue"))
      .filter(Boolean);
    if (inspectionDates.length) vehicle.inspectionDue = latestDate(vehicle.inspectionDue, inspectionDates.sort().at(-1));

    const policyFields = {
      "交强险": ["mandatoryInsuranceNo", "mandatoryInsuranceExpiry"],
      "商业险": ["commercialInsuranceNo", "commercialInsuranceExpiry"],
      "货物险": ["cargoInsuranceNo", "cargoInsuranceExpiry"],
      "承运人责任险": ["liabilityInsuranceNo", "liabilityInsuranceExpiry"],
    };
    Object.entries(policyFields).forEach(([type, [numberField, expiryField]]) => {
      const matchingPolicies = insurancePolicies.filter((policy) =>
        complianceRecordValue(policy, insurancePolicyFields, "plateNo") === vehicle.plateNo &&
        complianceRecordValue(policy, insurancePolicyFields, "insuranceType") === type
      );
      if (!matchingPolicies.length) return;
      const latestPolicy = matchingPolicies.reduce((current, candidate) =>
        String(complianceRecordValue(candidate, insurancePolicyFields, "policyExpiry") || "") > String(complianceRecordValue(current, insurancePolicyFields, "policyExpiry") || "") ? candidate : current
      );
      vehicle[numberField] = complianceRecordValue(latestPolicy, insurancePolicyFields, "policyNo") || vehicle[numberField];
      vehicle[expiryField] = latestDate(vehicle[expiryField], complianceRecordValue(latestPolicy, insurancePolicyFields, "policyExpiry"));
    });
    const insuranceDates = [vehicle.commercialInsuranceExpiry, vehicle.mandatoryInsuranceExpiry, vehicle.cargoInsuranceExpiry, vehicle.liabilityInsuranceExpiry].filter(Boolean);
    if (insuranceDates.length) vehicle.insuranceDue = insuranceDates.sort()[0];
  });
}

function saveVehicleComplianceRecords() {
  try {
    localStorage.setItem(VEHICLE_COMPLIANCE_STORAGE_KEY, JSON.stringify({
      inspections: inspectionRecords.filter((record) => !Array.isArray(record)),
      policies: insurancePolicies.filter((record) => !Array.isArray(record)),
    }));
  } catch (error) {
    console.warn("车辆审验或保险记录保存失败。", error);
  }
}

loadVehicleComplianceRecords();

let selectedVehicle = vehicles[0];
let vehicleRepairRecords = window.VehicleRepair.load();
let vehicleMaintenanceFeeItems = window.VehicleMaintenanceFeeConfig.load();
vehicleRepairRecords.filter((record) => window.VehicleRepair.OPEN_STATUSES.has(record.status) && repairRecordAffectsDispatch(record)).forEach((record) => {
  const vehicle = vehicles.find((item) => item.plateNo === record.plateNo);
  if (vehicle) vehicle.vehicleState = "维修中";
});
let vehicleCurrentPage = 1;
let vehiclePageSize = 10;
let vehicleFormMode = "create";
let editingVehiclePlate = "";
let deletingVehiclePlate = "";
let trailerCurrentPage = 1;
let trailerPageSize = 10;
let trailerFormMode = "create";
let editingTrailerId = "";
let deletingTrailerId = "";

const vehicleQueryForm = document.querySelector("#vehicleQueryForm");
const vehicleDialog = document.querySelector("#vehicleDialog");
const vehicleForm = document.querySelector("#vehicleForm");
const inspectionRecordDialog = document.querySelector("#inspectionRecordDialog");
const inspectionRecordForm = document.querySelector("#inspectionRecordForm");
const insurancePolicyDialog = document.querySelector("#insurancePolicyDialog");
const insurancePolicyForm = document.querySelector("#insurancePolicyForm");
const deleteVehicleDialog = document.querySelector("#deleteVehicleDialog");
const vehiclePageSizeSelect = document.querySelector("#vehiclePageSize");
const vehiclePageJump = document.querySelector("#vehiclePageJump");
const vehiclePrevPage = document.querySelector("#vehiclePrevPage");
const vehicleNextPage = document.querySelector("#vehicleNextPage");
const vehicleCurrentPageButton = document.querySelector("#vehicleCurrentPage");
const trailerQueryForm = document.querySelector("#trailerQueryForm");
const trailerBody = document.querySelector("#trailerBody");
const trailerDialog = document.querySelector("#trailerDialog");
const trailerForm = document.querySelector("#trailerForm");
const deleteTrailerDialog = document.querySelector("#deleteTrailerDialog");
const trailerPageSizeSelect = document.querySelector("#trailerPageSize");
const trailerPageJump = document.querySelector("#trailerPageJump");
const trailerPrevPage = document.querySelector("#trailerPrevPage");
const trailerNextPage = document.querySelector("#trailerNextPage");
const trailerCurrentPageButton = document.querySelector("#trailerCurrentPage");

const drivers = [
  {
    id: "SJ-1001", name: "王海", gender: "男", idCard: "330206198805182418", phone: "13800008881",
    address: "宁波市北仑区新碶街道", emergencyContact: "王静", emergencyPhone: "13700001126",
    entryDate: "2021-03-15", driverType: "自有司机", driverState: "运输中", certificationStatus: "verified", fleet: "宁波一队",
    licenseNo: "330206198805182418", licenseClass: "A2", licenseIssueDate: "2014-05-18", licenseExpiry: "2027-05-18",
    licenseAttachment: "驾驶证扫描件", qualificationNo: "330206002891", qualificationExpiry: "2026-10-08",
    qualificationAttachment: "从业资格证照片", bankCard: "6222020200008812", bankName: "中国工商银行宁波北仑支行", remark: "长期负责北仑港区集装箱运输",
  },
  {
    id: "SJ-1002", name: "赵亮", gender: "男", idCard: "310115198912093617", phone: "13900006662",
    address: "上海市浦东新区临港大道", emergencyContact: "赵敏", emergencyPhone: "13600007832",
    entryDate: "2022-07-08", driverType: "三方司机", capacityOwnership: "三方", supplierName: "临港外协集卡车队", driverState: "运输中", certificationStatus: "verified", fleet: "临港外协车队",
    licenseNo: "310115198912093617", licenseClass: "A2", licenseIssueDate: "2015-09-28", licenseExpiry: "2026-09-28",
    licenseAttachment: "驾驶证扫描件", qualificationNo: "310115006720", qualificationExpiry: "2026-12-18",
    qualificationAttachment: "从业资格证照片", bankCard: "6217001200006635", bankName: "中国建设银行上海临港支行", remark: "熟悉洋山港及临港作业流程",
  },
  {
    id: "SJ-1003", name: "刘军", gender: "男", idCard: "320500198706263011", phone: "13700003335",
    address: "苏州市工业园区星湖街", emergencyContact: "刘芳", emergencyPhone: "13500009218",
    entryDate: "2020-11-20", driverType: "自有司机", driverState: "停用", certificationStatus: "pending", fleet: "苏州二队",
    licenseNo: "320500198706263011", licenseClass: "A2", licenseIssueDate: "2012-08-30", licenseExpiry: "2026-08-30",
    licenseAttachment: "驾驶证扫描件", qualificationNo: "320500003109", qualificationExpiry: "2026-09-10",
    qualificationAttachment: "从业资格证照片", bankCard: "6228480400003351", bankName: "中国农业银行苏州园区支行", remark: "证件续办中",
  },
  {
    id: "SJ-1004", name: "陈涛", gender: "男", idCard: "330109199003154812", phone: "13600002228",
    address: "杭州市萧山区市心南路", emergencyContact: "陈晓", emergencyPhone: "13800004116",
    entryDate: "2023-02-06", driverType: "三方司机", capacityOwnership: "三方", supplierName: "杭州危险品运输车队", driverState: "空闲", certificationStatus: "verified", fleet: "杭州车队",
    licenseNo: "330109199003154812", licenseClass: "A2", licenseIssueDate: "2016-03-15", licenseExpiry: "2028-03-15",
    licenseAttachment: "驾驶证扫描件", qualificationNo: "330109007721", qualificationExpiry: "2027-12-20",
    qualificationAttachment: "从业资格证照片", bankCard: "6212261200002289", bankName: "中国工商银行杭州萧山支行", remark: "主要负责杭州至宁波往返线路",
  },
  {
    id: "SJ-1005", name: "周凯", gender: "男", idCard: "330205199511083219", phone: "13500007719",
    address: "宁波市江北区洪塘街道", emergencyContact: "周梅", emergencyPhone: "13700005231",
    entryDate: "2026-10-08", driverType: "自有司机", driverState: "停用", certificationStatus: "unverified", fleet: "宁波二队",
    licenseNo: "330205199511083219", licenseClass: "A2", licenseIssueDate: "2019-11-08", licenseExpiry: "2029-11-08",
    licenseAttachment: "驾驶证扫描件", qualificationNo: "330205008519", qualificationExpiry: "2028-06-30",
    qualificationAttachment: "从业资格证照片", bankCard: "6222020200007719", bankName: "中国工商银行宁波江北支行", remark: "入职资料待复核",
  },
];

function ensureDefaultDrivers() {
  if (drivers.length) return;
  for (let index = 1; index <= 20; index += 1) {
    const sequence = String(index).padStart(2, "0");
    const idCard = `3302001990${sequence}000000`;
    drivers.push({
      id: `SJ-DEMO-${sequence}`, name: `默认司机${sequence}`, gender: "男", idCard,
      phone: `138${String(index).padStart(8, "0")}`, address: "宁波市默认地址", emergencyContact: "默认联系人", emergencyPhone: `139${String(index).padStart(8, "0")}`,
      entryDate: "2026-01-01", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", fleet: "演示车队",
      licenseNo: idCard, licenseClass: "A2", licenseIssueDate: "2024-01-01", licenseExpiry: "2029-12-31",
      licenseAttachment: "默认驾驶证扫描件", qualificationNo: `330200${String(index).padStart(6, "0")}`, qualificationExpiry: "2029-12-31",
      qualificationAttachment: "默认从业资格证照片", bankCard: "", bankName: "", remark: "系统默认司机",
    });
  }
}

ensureDefaultDrivers();

function normalizeDriverRecord(record = {}, defaults = {}, index = 0) {
  const merged = { ...defaults, ...record };
  const rawSequence = String(merged.id || index + 1).replace(/\D/g, "");
  const sequence = rawSequence.slice(-4).padStart(4, "0");
  const demoValues = {
    id: `SJ-TEST-${sequence}`,
    name: `测试司机${sequence.slice(-2)}`,
    gender: "男",
    idCard: `33020619900101${sequence}`,
    phone: `1380000${sequence}`,
    address: "宁波市北仑区新碶街道测试路 88 号",
    emergencyContact: "李女士",
    emergencyPhone: `1390000${sequence}`,
    entryDate: "2026-03-18",
    driverType: "自有司机",
    driverState: "停用",
    certificationStatus: "unverified",
    fleet: "宁波测试车队",
    licenseNo: `33020619900101${sequence}`,
    licenseClass: "A2",
    licenseIssueDate: "2018-06-18",
    licenseExpiry: "2029-06-18",
    licenseAttachment: "驾驶证测试扫描件.pdf",
    qualificationNo: `33020600${sequence}`,
    qualificationExpiry: "2029-12-31",
    qualificationAttachment: "从业资格证测试照片.jpg",
    bankCard: `622202020000${sequence}`,
    bankName: "中国工商银行宁波北仑支行",
    remark: "测试档案，证照资料齐全",
  };
  Object.entries(demoValues).forEach(([field, fallback]) => {
    const value = String(merged[field] ?? "").trim();
    if (!value || ["undefined", "null", "nan"].includes(value.toLowerCase())) merged[field] = fallback;
  });
  return merged;
}

drivers.forEach((driver, index) => Object.assign(driver, normalizeDriverRecord(driver, {}, index)));

function enabledOwnDrivers() {
  return CapacityOwnership.sortSelfFirst(drivers.filter((driver) => driver.driverState !== "停用"));
}

function availableOwnDrivers() {
  return enabledOwnDrivers().filter((driver) =>
    driver.driverState === "空闲" &&
    driver.certificationStatus === "verified" &&
    daysUntil(driver.licenseExpiry) >= 0 &&
    daysUntil(driver.qualificationExpiry) >= 0
  );
}

const DRIVER_CERTIFICATION_STORAGE_KEY = "container-logistics-driver-certifications-v1";
const DEMO_CERTIFICATION_MIGRATIONS = {
  "SJ-1002": { from: "unverified", to: "verified" },
  "SJ-1004": { from: "rejected", to: "verified", legacyReason: "身份证背面照片模糊，请重新上传" },
};

function loadDriverCertifications() {
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(DRIVER_CERTIFICATION_STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }
  Object.entries(DEMO_CERTIFICATION_MIGRATIONS).forEach(([driverId, migration]) => {
    const record = stored[driverId];
    if (!record || record.status !== migration.from || (migration.legacyReason && record.reason !== migration.legacyReason)) return;
    stored[driverId] = {
      ...record,
      status: migration.to,
      submittedAt: record.submittedAt || "2026-08-12 09:20",
      reviewedAt: "2026-08-12 11:05",
      reason: "",
    };
  });
  drivers.forEach((driver) => {
    const record = stored[driver.id];
    if (record) {
      driver.certificationStatus = record.status || "unverified";
      driver.certificationSubmittedAt = record.submittedAt || "";
      driver.certificationReviewedAt = record.reviewedAt || "";
      driver.certificationReason = record.reason || "";
      driver.certificationFiles = record;
    } else {
      const hasSubmitted = driver.certificationStatus !== "unverified";
      stored[driver.id] = {
        status: driver.certificationStatus || "unverified",
        submittedAt: hasSubmitted ? (driver.certificationStatus === "pending" ? "2026-09-20 15:36" : "2026-08-12 09:20") : "",
        reviewedAt: ["verified", "rejected"].includes(driver.certificationStatus) ? "2026-08-12 11:05" : "",
        reason: driver.certificationReason || "",
        idCardFront: hasSubmitted ? "身份证人像面.jpg" : "",
        idCardBack: hasSubmitted ? "身份证国徽面.jpg" : "",
        licenseAttachment: hasSubmitted ? driver.licenseAttachment : "",
        qualificationAttachment: hasSubmitted ? driver.qualificationAttachment : "",
      };
    }
    driver.certificationFiles = stored[driver.id];
    driver.certificationSubmittedAt = stored[driver.id].submittedAt || "";
    driver.certificationReviewedAt = stored[driver.id].reviewedAt || "";
  });
  localStorage.setItem(DRIVER_CERTIFICATION_STORAGE_KEY, JSON.stringify(stored));
}

function saveDriverCertification(driver) {
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(DRIVER_CERTIFICATION_STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }
  stored[driver.id] = {
    ...(stored[driver.id] || {}),
    status: driver.certificationStatus,
    submittedAt: driver.certificationSubmittedAt || stored[driver.id]?.submittedAt || "",
    reviewedAt: driver.certificationReviewedAt || "",
    reason: driver.certificationReason || "",
  };
  localStorage.setItem(DRIVER_CERTIFICATION_STORAGE_KEY, JSON.stringify(stored));
}

loadDriverCertifications();

let driverCurrentPage = 1;
let driverPageSize = 10;
let driverFormMode = "create";
let editingDriverId = "";
let deletingDriverId = "";
let selectedDriverDetail = null;
const selectedDriverIds = new Set();
let renderedDriverIds = [];

const driverQueryForm = document.querySelector("#driverQueryForm");
const driverBody = document.querySelector("#driverBody");
const driverDialog = document.querySelector("#driverDialog");
const driverForm = document.querySelector("#driverForm");
const deleteDriverDialog = document.querySelector("#deleteDriverDialog");
const driverSelectAll = document.querySelector("#driverSelectAll");
const driverPageSizeSelect = document.querySelector("#driverPageSize");
const driverPageJump = document.querySelector("#driverPageJump");
const driverPrevPage = document.querySelector("#driverPrevPage");
const driverNextPage = document.querySelector("#driverNextPage");
const driverCurrentPageButton = document.querySelector("#driverCurrentPage");
const driverMoreBtn = document.querySelector("#driverMoreBtn");
const driverMoreMenu = document.querySelector("#driverMoreMenu");
const driverDetailPanel = document.querySelector("#driverDetailPanel");
const driverCertificationDialog = document.querySelector("#driverCertificationDialog");
const certificationReviewContent = document.querySelector("#certificationReviewContent");
const certificationReviewNote = document.querySelector("#certificationReviewNote");
let reviewingDriverId = "";

const routeAccountCatalog = [
  { customerId: "KH-HM", customerName: "华贸", projectId: "PR-HM-BYD", projectName: "比亚迪" },
  { customerId: "KH-LG", customerName: "陆港多联", projectId: "PR-LG-TH", projectName: "提箱装货" },
  { customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X387", projectName: "X387" },
  { customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X8588", projectName: "X8588" },
  { customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X8786", projectName: "X8786" },
  { customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-JYT", projectName: "捷运通BYD" },
  { customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-PP", projectName: "聚丙烯" },
];
const fixedRoutes = [
  { id: "XL-001", routeCode: "XL-HM-BYD", customerId: "KH-HM", customerName: "华贸", projectId: "PR-HM-BYD", projectName: "比亚迪", routeName: "北仑港—比亚迪宁波基地", origin: "宁波北仑港区二期", destination: "北仑三期堆场", pickupPoint: "北仑二期空箱堆场", loadingPoint: "比亚迪宁波基地", unloadingPoint: "宁波铁路北站", dropoffPoint: "北仑三期堆场", viaPoints: "北仑收费站", taskType: "提空装货", mileage: 46.2, routeState: "启用", estimatedRevenue: 2860, baseFreight: 2600, commissionType: "fixed", commissionValue: 420, commissionRemark: "含港区等待补贴", defaultVehicle: "浙B·K7812", defaultDriver: "王海", remark: "比亚迪项目日常线路" },
  { id: "XL-002", routeCode: "XL-LG-TH", customerId: "KH-LG", customerName: "陆港多联", projectId: "PR-LG-TH", projectName: "提箱装货", routeName: "洋山港—昆山保税区", origin: "上海洋山港", destination: "洋山一期堆场", pickupPoint: "洋山港空箱区", loadingPoint: "昆山综合保税区", unloadingPoint: "上海芦潮港铁路站", dropoffPoint: "洋山一期堆场", viaPoints: "东海大桥、沪昆高速", taskType: "提重送货", mileage: 122.5, routeState: "启用", estimatedRevenue: 3520, baseFreight: 3200, commissionType: "rate", commissionValue: 16, commissionRemark: "按预估收入 16% 计提", defaultVehicle: "沪D·A9021", defaultDriver: "赵亮", remark: "提箱装货项目双拖线路" },
  { id: "XL-003", routeCode: "XL-ZT-X387", customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X387", projectName: "X387", routeName: "梅山港—金华南站", origin: "宁波梅山港", destination: "梅山保税港区", pickupPoint: "梅山港空箱区", loadingPoint: "杭州萧山仓", unloadingPoint: "金华南站", dropoffPoint: "梅山保税港区", viaPoints: "杭甬高速", taskType: "排空箱（A→B）", mileage: 191.8, routeState: "启用", estimatedRevenue: 2550, baseFreight: 2380, commissionType: "fixed", commissionValue: 350, commissionRemark: "夜间进港另补 80 元", defaultVehicle: "浙A·F2190", defaultDriver: "陈涛", remark: "X387 项目出口线路" },
  { id: "XL-004", routeCode: "XL-ZT-X8588", customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X8588", projectName: "X8588", routeName: "外高桥—苏州园区", origin: "上海外高桥", destination: "外高桥五期", pickupPoint: "外高桥空箱区", loadingPoint: "苏州工业园区", unloadingPoint: "上海芦潮港站", dropoffPoint: "外高桥五期", viaPoints: "京沪高速", taskType: "排重箱（A→B）", mileage: 165.4, routeState: "启用", estimatedRevenue: 1980, baseFreight: 1850, commissionType: "rate", commissionValue: 15, commissionRemark: "按实际确认收入核算", defaultVehicle: "苏E·T5568", defaultDriver: "刘军", remark: "X8588 项目固定线路" },
  { id: "XL-005", routeCode: "XL-ZT-X8786", customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X8786", projectName: "X8786", routeName: "穿山港—义乌保税区", origin: "宁波穿山港", destination: "穿山港还箱区", pickupPoint: "穿山港空箱区", loadingPoint: "义乌保税物流中心", unloadingPoint: "金华南站", dropoffPoint: "穿山港还箱区", viaPoints: "甬金高速", mileage: 212.7, routeState: "启用", estimatedRevenue: 3180, baseFreight: 2860, commissionType: "fixed", commissionValue: 430, commissionRemark: "含甬金高速补贴", defaultVehicle: "浙B·D9026", defaultDriver: "周明", remark: "X8786 项目固定线路" },
  { id: "XL-006", routeCode: "XL-ZT-JYT", customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-JYT", projectName: "捷运通BYD", routeName: "北仑港—绍兴比亚迪", origin: "宁波北仑港", destination: "北仑三期堆场", pickupPoint: "北仑港空箱区", loadingPoint: "绍兴比亚迪基地", unloadingPoint: "宁波铁路北站", dropoffPoint: "北仑三期堆场", viaPoints: "杭甬高速", mileage: 78.6, routeState: "启用", estimatedRevenue: 3050, baseFreight: 2740, commissionType: "rate", commissionValue: 14, commissionRemark: "按预估收入 14% 计提", defaultVehicle: "浙B·M6681", defaultDriver: "李强", remark: "捷运通 BYD 项目线路" },
  { id: "XL-007", routeCode: "XL-ZT-PP", customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-PP", projectName: "聚丙烯", routeName: "梅山港—镇海石化仓", origin: "宁波梅山港", destination: "梅山保税港区", pickupPoint: "梅山港空箱区", loadingPoint: "镇海石化仓", unloadingPoint: "金华南站", dropoffPoint: "梅山保税港区", viaPoints: "宁波绕城高速", mileage: 63.9, routeState: "启用", estimatedRevenue: 2780, baseFreight: 2490, commissionType: "fixed", commissionValue: 380, commissionRemark: "化工品运输按固定标准计提", defaultVehicle: "浙B·R5108", defaultDriver: "孙磊", remark: "聚丙烯项目固定线路" },
];
const fixedRouteDemoDefaults = new Map(fixedRoutes.map((route) => [route.id, { ...route }]));
fixedRoutes.forEach((route, index) => {
  const types = window.DispatchTaskNodes?.taskTypes?.() || [];
  if (!route.taskType) route.taskType = types[index % Math.max(types.length, 1)]?.name || "提空装货";
  const template = window.DispatchTaskNodes?.profile?.(route.taskType)?.jobLocations || [];
  if (!Array.isArray(route.jobLocations) || !route.jobLocations.length || route.jobLocations.some((location) => !location.name)) {
    const addresses = [route.pickupPoint || route.origin, route.loadingPoint || route.destination, route.unloadingPoint || route.dropoffPoint || route.destination];
    route.jobLocations = template.map((location, locationIndex) => ({ id: location.id, name: location.name, address: addresses[locationIndex] || "" }));
  } else if (template.length) {
    const addresses = [route.pickupPoint || route.origin, route.loadingPoint || route.destination, route.unloadingPoint || route.dropoffPoint || route.destination];
    const existing = new Map(route.jobLocations.map((location) => [location.id || location.name, location]));
    route.jobLocations = template.map((location, locationIndex) => {
      const saved = existing.get(location.id) || existing.get(location.name);
      return { id: location.id, name: location.name, address: saved?.address || addresses[locationIndex] || "" };
    });
  }
});

const ROUTE_STORAGE_KEY = "container-logistics-fixed-routes-v1";
try {
  const storedRoutes = JSON.parse(localStorage.getItem(ROUTE_STORAGE_KEY) || "null");
  if (Array.isArray(storedRoutes)) {
    fixedRoutes.splice(0, fixedRoutes.length, ...storedRoutes.map((route) => normalizeFixedRouteJobLocations({
      ...(fixedRouteDemoDefaults.get(route.id) || {}),
      ...route,
      mileage: route.mileage === "" || route.mileage === null || route.mileage === undefined ? "" : Number(route.mileage) || 0,
    })));
  }
} catch (error) {
  console.warn("固定线路数据读取失败，使用初始数据。", error);
}

function saveFixedRoutes() {
  try { localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(fixedRoutes)); } catch (error) { console.warn("固定线路数据保存失败。", error); }
}

function getRouteStops(route = {}) {
  return [
    { key: "pickup", label: "提箱", value: route.pickupPoint || route.origin || "待维护" },
    { key: "loading", label: "装货", value: route.loadingPoint || route.origin || "待维护" },
    { key: "unloading", label: "卸货", value: route.unloadingPoint || route.destination || "待维护" },
    { key: "dropoff", label: "落箱", value: route.dropoffPoint || route.destination || "待维护" },
  ];
}

function renderRouteStops(route, className = "task-route-stops") {
  if (className === "plan-route-stops") {
    const template = window.DispatchTaskNodes?.profile?.(route.taskType)?.jobLocations || [];
    const saved = Array.isArray(route.jobLocations) ? route.jobLocations : [];
    const defaults = [route.pickupPoint || route.origin, route.loadingPoint || route.destination, route.unloadingPoint || route.dropoffPoint || route.destination];
    const locations = template.map((location, index) => {
      const current = saved.find((item) => item.id === location.id || item.name === location.name);
      return { ...location, address: current?.address || defaults[index] || "" };
    });
    return renderConfiguredJobLocations(locations, "plan-route-job-locations");
  }
  return `<div class="${className}">${getRouteStops(route).map((stop) => `<span class="route-stop ${stop.key}"><i aria-hidden="true"></i><small>${stop.label}</small><strong title="${stop.value}">${stop.value}</strong></span>`).join("")}</div>`;
}

function renderConfiguredJobLocations(locations = [], className = "configured-job-locations") {
  const rows = Array.isArray(locations) ? locations.filter((location) => location?.name) : [];
  return rows.length
    ? `<div class="${className}">${rows.map((location) => `<div><span>${dashboardEscape(location.name)}：</span><strong title="${dashboardEscape(location.address || "待维护")}">${dashboardEscape(location.address || "待维护")}</strong></div>`).join("")}</div>`
    : '<span class="route-node-empty">作业地点待维护</span>';
}

function getRouteCustomers() {
  return [...new Map(routeAccountCatalog.map((item) => [item.customerId, { customerId: item.customerId, customerName: item.customerName }])).values()];
}

function getRouteProjects(customerId = "") {
  return routeAccountCatalog.filter((item) => !customerId || item.customerId === customerId);
}

function getRouteAccount(customerId = "", projectId = "") {
  return routeAccountCatalog.find((item) => (!customerId || item.customerId === customerId) && (!projectId || item.projectId === projectId));
}

function getNextProjectId(customerId = "") {
  const prefix = `PR-${String(customerId || "PROJECT").replace(/^KH-/, "")}-`;
  let sequence = 1;
  while (routeAccountCatalog.some((item) => item.projectId === `${prefix}${String(sequence).padStart(3, "0")}`)) sequence += 1;
  return `${prefix}${String(sequence).padStart(3, "0")}`;
}


const dispatchSeed = [
  { id: "PD-1001", waybillNo: "WB20260916001", planTaskNo: "PT-LEGACY-WB20260916001", taskType: "提空装货", dispatchMode: "auto", customerName: "华贸", projectName: "比亚迪", orderDate: "2026-09-16", plannedBerthingTime: "2026-09-16T08:00", routeId: "XL-001", routeName: "北仑港至江北仓", origin: "宁波北仑港区二期", destination: "宁波江北物流园", dispatchTime: "2026-09-16 08:35", driverId: "SJ-1001", driverName: "王海", phone: "13800008881", vehicleId: "浙B·K7812", trailerId: "TR-001", vehicleType: "燃油车", status: "运输中", currentNode: "在途", boxes: "TCLU8374621 / 40HQ", estimatedRevenue: 2860, commission: 420, note: "上午装柜", pushed: true, jobLocations: [{ id: "提空装货-LOC-1", name: "提空地", address: "宁波北仑港区二期·空箱堆场" }, { id: "提空装货-LOC-2", name: "装货地", address: "宁波市北仑区比亚迪宁波基地" }, { id: "提空装货-LOC-3", name: "落重地", address: "宁波北仑三期堆场" }], timeline: [{ node: "已派单", time: "2026-09-16 08:35", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已提货", time: "2026-09-16 10:12", desc: "司机已完成提货，上传装柜现场照片", photos: ["装柜现场-001.jpg"] }, { node: "在途", time: "2026-09-16 11:05", desc: "车辆驶离装货地，运输中", photos: ["运输途中-001.jpg"] }] },
  { id: "PD-1002", waybillNo: "WB20260916002", planTaskNo: "PT-LEGACY-WB20260916002", taskType: "提重送货", dispatchMode: "manual", customerName: "陆港多联", projectName: "提箱装货", orderDate: "2026-09-16", plannedBerthingTime: "2026-09-17T07:30", routeId: "XL-002", routeName: "洋山港至昆山保税区", origin: "上海洋山港", destination: "昆山综合保税区", dispatchTime: "2026-09-16 09:10", driverId: "SJ-1002", driverName: "赵亮", phone: "13900006662", vehicleId: "沪D·A9021", trailerId: "TR-002", vehicleType: "燃油车", status: "已派单", currentNode: "待提货", boxes: "MSKU4920183 / MSKU4920184", estimatedRevenue: 3520, commission: 563.2, note: "双拖作业，按现场指引进港", pushed: true, timeline: [{ node: "已派单", time: "2026-09-16 09:10", desc: "派单已推送至司机微信小程序", photos: [] }] },
  { id: "PD-1003", waybillNo: "WB20260916003", planTaskNo: "PT-LEGACY-WB20260916003", taskType: "排空箱（A→B）", dispatchMode: "auto", customerName: "中铁联集项目", projectName: "X387", orderDate: "2026-09-15", plannedBerthingTime: "2026-09-16T18:00", routeId: "XL-003", routeName: "萧山仓至梅山码头", origin: "杭州萧山仓", destination: "宁波梅山码头", dispatchTime: "2026-09-15 16:40", driverId: "SJ-1004", driverName: "陈涛", phone: "13600002228", vehicleId: "浙A·F2190", trailerId: "TR-004", vehicleType: "燃油车", status: "已完成", currentNode: "已送达", boxes: "CMAU6502739 / 40GP", estimatedRevenue: 2550, commission: 350, note: "夜间进港", pushed: true, jobLocations: [{ id: "排空箱（A→B）-LOC-1", name: "提空地", address: "杭州萧山仓空箱区" }, { id: "排空箱（A→B）-LOC-2", name: "还空地", address: "宁波梅山码头空箱区" }], timeline: [{ node: "已派单", time: "2026-09-15 16:40", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "已提货", time: "2026-09-15 18:22", desc: "完成提货", photos: ["提货现场-003.jpg"] }, { node: "已送达", time: "2026-09-16 06:55", desc: "货柜已送达梅山码头", photos: ["送达凭证-003.jpg"] }] },
  { id: "PD-1004", waybillNo: "WB20260916004", planTaskNo: "PT-LEGACY-WB20260916004", taskType: "排重箱（A→B）", dispatchMode: "manual", customerName: "中铁联集项目", projectName: "X8588", orderDate: "2026-09-14", plannedBerthingTime: "2026-09-18T14:00", routeId: "XL-004", routeName: "苏州园区至外高桥", origin: "苏州工业园区", destination: "上海外高桥五期", dispatchTime: "2026-09-14 14:20", driverId: "SJ-1003", driverName: "刘军", phone: "13700003335", vehicleId: "苏E·T5568", trailerId: "TR-003", vehicleType: "燃油车", status: "取消", currentNode: "待派单", boxes: "OOLU3087642 / 20GP", estimatedRevenue: 1980, commission: 297, note: "线路价格调整，原派单取消", pushed: true, timeline: [{ node: "已派单", time: "2026-09-14 14:20", desc: "派单已推送至司机微信小程序", photos: [] }, { node: "取消", time: "2026-09-14 15:05", desc: "未开始提货，后台撤销派单", photos: [] }] },
  { id: "PD-1005", waybillNo: "WB20260916005", planTaskNo: "PT-LEGACY-WB20260916005", taskType: "提空装货", dispatchMode: "pending", customerName: "华贸", projectName: "比亚迪", orderDate: "2026-09-16", routeId: "XL-001", routeName: "北仑港至江北仓", origin: "宁波北仑港区二期", destination: "宁波江北物流园", dispatchTime: "待调度", driverId: "", driverName: "待分配", phone: "待分配", vehicleId: "待分配", trailerId: "未绑定", vehicleType: "燃油车", status: "待派单", currentNode: "待派单", boxes: "待装箱", estimatedRevenue: 2860, commission: 420, note: "等待调度", pushed: false, timeline: [] },
  { id: "PD-DEMO-PENDING-001-01", waybillNo: "WB20261022001", planTaskId: "PT-DEMO-PENDING-001", planTaskNo: "PT20261022001", taskType: "提空装货", dispatchMode: "pending", customerName: "华贸", projectName: "比亚迪", orderDate: "2026-10-22", planExecutionDate: "2026-10-25", plannedBerthingTime: "2026-10-25T08:00", routeId: "XL-001", routeName: "北仑港—比亚迪宁波基地", origin: "宁波北仑港区二期", destination: "比亚迪宁波基地", dispatchTime: "待调度", driverId: "", driverName: "待分配", phone: "待分配", vehicleId: "待分配", trailerId: "未绑定", vehicleType: "燃油车", status: "待派单", currentNode: "待派单", boxes: "待装箱 / 40HQ", estimatedRevenue: 2860, commission: 420, note: "未开始计划演示", pushed: false, timeline: [] },
  { id: "PD-DEMO-PENDING-001-02", waybillNo: "WB20261022002", planTaskId: "PT-DEMO-PENDING-001", planTaskNo: "PT20261022001", taskType: "提空装货", dispatchMode: "pending", customerName: "华贸", projectName: "比亚迪", orderDate: "2026-10-22", planExecutionDate: "2026-10-25", plannedBerthingTime: "2026-10-25T10:30", routeId: "XL-001", routeName: "北仑港—比亚迪宁波基地", origin: "宁波北仑港区二期", destination: "比亚迪宁波基地", dispatchTime: "待调度", driverId: "", driverName: "待分配", phone: "待分配", vehicleId: "待分配", trailerId: "未绑定", vehicleType: "燃油车", status: "待派单", currentNode: "待派单", boxes: "待装箱 / 20GP", estimatedRevenue: 2320, commission: 340, note: "未开始计划演示", pushed: false, timeline: [] },
  { id: "PD-DEMO-PENDING-002-01", waybillNo: "WB20261022003", planTaskId: "PT-DEMO-PENDING-002", planTaskNo: "PT20261022002", taskType: "排空箱（A→B）", dispatchMode: "pending", customerName: "中铁联集项目", projectName: "X8786", orderDate: "2026-10-22", planExecutionDate: "2026-10-26", plannedBerthingTime: "2026-10-26T14:00", routeId: "XL-005", routeName: "穿山港—义乌保税区", origin: "宁波穿山港", destination: "义乌保税物流中心", dispatchTime: "待调度", driverId: "", driverName: "待分配", phone: "待分配", vehicleId: "待分配", trailerId: "未绑定", vehicleType: "燃油车", status: "待派单", currentNode: "待派单", boxes: "待装箱 / 40GP", estimatedRevenue: 3180, commission: 430, note: "未开始计划演示", pushed: false, timeline: [] },
];
const dispatches = window.DispatchStore.load(dispatchSeed);
function snapshotLegacyDispatches() {
  let changed = false;
  dispatches.forEach((dispatch) => {
    const waybill = (typeof waybills === "undefined" ? [] : waybills).find((item) => item.waybillNo === dispatch.waybillNo);
    if (!dispatch.taskConfigSnapshot) {
      const taskType = window.DispatchTaskNodes.resolve(dispatch.taskType || waybill?.taskType);
      const sourceSnapshot = waybill?.taskConfigSnapshot || window.DispatchTaskNodes.snapshot(taskType);
      if (!sourceSnapshot) return;
      const snapshot = JSON.parse(JSON.stringify(sourceSnapshot));
      if (!waybill?.taskConfigSnapshot && Array.isArray(dispatch.photoRequirements) && dispatch.photoRequirements.length) {
        snapshot.nodes = window.DispatchTaskNodes.distributeLegacyPhotoRequirements(taskType, dispatch.photoRequirements, snapshot.nodes);
      }
      dispatch.taskConfigSnapshot = snapshot;
      dispatch.orderOperatorName = dispatch.orderOperatorName || waybill?.orderOperatorName || "张调度";
      changed = true;
    }
    if (waybill) {
      if (!waybill.taskConfigSnapshot) {
        waybill.taskConfigSnapshot = JSON.parse(JSON.stringify(dispatch.taskConfigSnapshot));
        changed = true;
      }
    }
  });
  waybills.forEach((waybill) => {
    if (waybill.taskConfigSnapshot) return;
    const dispatchSnapshot = dispatches.find((item) => item.waybillNo === waybill.waybillNo)?.taskConfigSnapshot;
    const snapshot = dispatchSnapshot || window.DispatchTaskNodes.snapshot(waybill.taskType);
    if (!snapshot) return;
    waybill.taskConfigSnapshot = JSON.parse(JSON.stringify(snapshot));
    changed = true;
  });
  if (changed) {
    window.DispatchStore.save(dispatches);
    saveWaybills();
  }
}
const DISPATCH_VEHICLE_TYPES = ["LNG", "燃油车", "新能源车"];
const DEFAULT_AUTO_DISPATCH_IDS = new Set(["PD-1001", "PD-1003"]);
const DEMO_PENDING_PLAN_DISPATCH_IDS = new Set(["PD-DEMO-PENDING-001-01", "PD-DEMO-PENDING-001-02", "PD-DEMO-PENDING-002-01"]);

function hydrateAdminDataSnapshot() {
  const snapshot = window.AdminDataBridge?.read?.();
  if (!snapshot) return;
  [
    [waybills, snapshot.waybills, "waybillNo"],
    [dispatches, snapshot.dispatches, "id"],
    [fixedRoutes, snapshot.fixedRoutes, "id"],
    [vehicles, snapshot.vehicles, "plateNo", "vin"],
    [trailers, snapshot.trailers, "id"],
    [drivers, snapshot.drivers, "id"],
    [routeAccountCatalog, snapshot.routeAccounts, "projectId"],
  ].forEach(([target, records, key, secondaryKey]) => {
    if (!Array.isArray(records)) return;
    const defaultsByKey = new Map(target.map((record) => [record?.[key], record]).filter(([value]) => value));
    const normalizedRecords = records.map((record, index) => {
      const defaults = defaultsByKey.get(record?.[key]) || {};
      const merged = { ...defaults, ...record };
      Object.keys(defaults).forEach((field) => {
        if (record?.[field] == null || ["", "undefined", "null", "nan"].includes(String(record[field]).trim().toLowerCase())) merged[field] = defaults[field];
      });
      return target === drivers ? normalizeDriverRecord(merged, defaults, index) : merged;
    });
    const recordKeys = new Set(normalizedRecords.map((record) => record?.[key]).filter(Boolean));
    const secondaryKeys = new Set(secondaryKey ? normalizedRecords.map((record) => record?.[secondaryKey]).filter(Boolean) : []);
    const untouched = target.filter((record) => !recordKeys.has(record?.[key]) && (!secondaryKey || !secondaryKeys.has(record?.[secondaryKey])));
    target.splice(0, target.length, ...normalizedRecords, ...untouched);
  });
}

hydrateAdminDataSnapshot();
snapshotLegacyDispatches();

vehicles.forEach((vehicle) => CapacityOwnership.normalizeResource(vehicle, "vehicle"));
trailers.forEach((trailer) => CapacityOwnership.normalizeResource(trailer, "trailer"));
drivers.forEach((driver) => CapacityOwnership.normalizeResource(driver, "driver"));

function getCapacityOwnershipSnapshot(driverId, vehicleId, trailerId) {
  const driver = drivers.find((item) => item.id === driverId);
  const vehicle = vehicles.find((item) => item.plateNo === vehicleId);
  const trailer = trailers.find((item) => item.id === trailerId);
  return CapacityOwnership.groupSnapshot([
    driver && { ...driver, role: "司机", name: driver.name },
    vehicle && { ...vehicle, role: "车辆", name: vehicle.plateNo },
    trailer && { ...trailer, role: "挂车", name: trailer.plateNo },
  ], { missingRequired: !driver || !vehicle || Boolean(trailerId && !trailer) });
}

function applyCapacitySnapshot(record, force = false) {
  if (!record) return record;
  if (record.status === "待派单" && !record.driverId && !record.vehicleId) {
    delete record.capacityOwnershipSnapshot;
    delete record.capacityOwnershipDetailSnapshot;
    delete record.capacityOwnershipTooltipSnapshot;
    return record;
  }
  const snapshot = getCapacityOwnershipSnapshot(record.driverId, record.vehicleId, record.trailerId);
  if (!snapshot.resources.some((item) => item.role === "车辆")) snapshot.type = CapacityOwnership.normalizeType(record.capacityOwnershipSnapshot || record.carrierTypeSnapshot);
  const driver = drivers.find((item) => item.id === record.driverId);
  const vehicle = vehicles.find((item) => item.plateNo === record.vehicleId);
  const trailer = trailers.find((item) => item.id === record.trailerId);
  Object.assign(record, {
    capacityOwnershipSnapshot: snapshot.type,
    capacityOwnershipDetailSnapshot: snapshot.resources,
    capacityOwnershipTooltipSnapshot: snapshot.tooltip,
    driverOrganizationSnapshot: driver ? CapacityOwnership.organizationName(driver) : "待确定",
    vehicleOrganizationSnapshot: vehicle ? CapacityOwnership.organizationName(vehicle) : "待确定",
    trailerOrganizationSnapshot: trailer ? CapacityOwnership.organizationName(trailer) : "未绑定",
    carrierTypeSnapshot: vehicle?.capacityOwnership || "待确定",
    carrierUnitSnapshot: vehicle ? CapacityOwnership.organizationName(vehicle) : "待确定",
  });
  return record;
}

function refreshThirdPartyCustomerDatalist() {
  const list = document.querySelector("#thirdPartyCustomerOptions");
  if (!list) return;
  list.innerHTML = CapacityOwnership.readSuppliers().filter((item) => item.status !== "停用").map((item) => `<option value="${dashboardEscape(item.name)}">${dashboardEscape(item.id)}</option>`).join("");
}

function syncCapacityOwnershipForm(form) {
  const typeField = form?.elements.capacityOwnership;
  const supplierField = form?.elements.supplierName;
  if (!typeField || !supplierField) return;
  const isThirdParty = CapacityOwnership.normalizeType(typeField.value) === CapacityOwnership.TYPES.THIRD;
  supplierField.closest("[data-third-party-field]").hidden = !isThirdParty;
  supplierField.required = isThirdParty;
  if (!isThirdParty) {
    supplierField.value = "";
    supplierField.setCustomValidity("");
  }
}

function validateCapacityOwnershipForm(form) {
  syncCapacityOwnershipForm(form);
  const type = CapacityOwnership.normalizeType(form.elements.capacityOwnership?.value);
  const input = form.elements.supplierName;
  if (type !== CapacityOwnership.TYPES.THIRD) return true;
  const supplier = CapacityOwnership.findSupplier(input.value);
  input.setCustomValidity(supplier?.status === "启用" ? "" : "请选择客户管理中已启用且具有三方供应商角色的单位。");
  if (!supplier || supplier.status !== "启用") {
    input.reportValidity();
    return false;
  }
  input.value = supplier.name;
  return true;
}

function capacityFieldsFromForm(form, kind) {
  const type = CapacityOwnership.normalizeType(form.elements.capacityOwnership?.value);
  const supplier = type === CapacityOwnership.TYPES.THIRD ? CapacityOwnership.findSupplier(form.elements.supplierName?.value) : null;
  const result = { capacityOwnership: type, supplierId: supplier?.id || "", supplierName: supplier?.name || "", organizationName: type === CapacityOwnership.TYPES.SELF ? CapacityOwnership.SELF_ORGANIZATION || "万物时空" : supplier?.name || "" };
  if (kind === "driver") result.driverType = type === CapacityOwnership.TYPES.THIRD ? "三方司机" : "自有司机";
  else result.ownership = type === CapacityOwnership.TYPES.THIRD ? "外协" : "自有";
  return result;
}

function ensureDemoAutoDispatches() {
  const hasAutoDispatch = dispatches.some((item) => item.dispatchMode === "auto" || DEFAULT_AUTO_DISPATCH_IDS.has(item.id));
  if (hasAutoDispatch) return;
  const missing = dispatchSeed
    .filter((item) => DEFAULT_AUTO_DISPATCH_IDS.has(item.id) && !dispatches.some((current) => current.id === item.id))
    .map((item) => ({ ...item, dispatchMode: "auto", timeline: item.timeline.map((entry) => ({ ...entry, photos: [...entry.photos] })) }));
  if (!missing.length) return;
  dispatches.push(...missing);
  saveDispatches();
}

ensureDemoAutoDispatches();

function ensureDemoPendingPlanDispatches() {
  const missing = dispatchSeed
    .filter((item) => DEMO_PENDING_PLAN_DISPATCH_IDS.has(item.id) && !dispatches.some((current) => current.id === item.id))
    .map((item) => ({ ...item, timeline: item.timeline.map((entry) => ({ ...entry, photos: [...(entry.photos || [])] })) }));
  if (!missing.length) return;
  dispatches.push(...missing);
  saveDispatches();
}

ensureDemoPendingPlanDispatches();

function getDispatchVehicleType(dispatch) {
  return DISPATCH_VEHICLE_TYPES.includes(dispatch?.vehicleType) ? dispatch.vehicleType : "燃油车";
}

function getRouteMileageSnapshot(route) {
  const mileage = Number(route?.mileage);
  return route && route.mileage !== "" && Number.isFinite(mileage) && mileage >= 0 ? mileage : null;
}

function normalizeDispatchRecord(dispatch) {
  if (!dispatch || typeof dispatch !== "object") return dispatch;
  const demoDefaults = dispatchSeed.find((item) => item.id === dispatch.id);
  if (demoDefaults) {
    Object.entries(demoDefaults).forEach(([field, value]) => {
      if (dispatch[field] == null || ["", "undefined", "null", "nan"].includes(String(dispatch[field]).trim().toLowerCase())) dispatch[field] = value;
    });
  }
  dispatch.vehicleType = getDispatchVehicleType(dispatch);
  const route = fixedRoutes.find((item) => item.id === dispatch.routeId);
  if (!Object.prototype.hasOwnProperty.call(dispatch, "routeMileageSnapshot")) dispatch.routeMileageSnapshot = dispatch.status === "待派单" ? null : getRouteMileageSnapshot(route);
  const waybill = waybills.find((item) => item.waybillNo === dispatch.waybillNo);
  if (waybill) {
    dispatch.planTaskId = dispatch.planTaskId || waybill.planTaskId;
    dispatch.planTaskNo = dispatch.planTaskNo || waybill.planTaskNo || waybill.planTaskId || waybill.waybillNo;
    dispatch.taskType = dispatch.taskType || waybill.taskType || "提空装货";
    dispatch.projectId = dispatch.projectId || waybill.projectId || "";
    dispatch.projectName = dispatch.projectName || waybill.projectName || "未分配项目";
  }
  applyCapacitySnapshot(dispatch);
  return dispatch;
}

dispatches.forEach(normalizeDispatchRecord);
window.DispatchStore.save(dispatches);
publishAdminDataSnapshot();

const ACTIVE_DRIVER_DISPATCH_STATES = new Set(["已派单", "运输中"]);
const LEGACY_DISABLED_DRIVER_STATES = new Set(["离职", "待入职", "停岗"]);

function driverHasActiveDispatch(driverId) {
  return Boolean(driverId) && dispatches.some((dispatch) =>
    dispatch.driverId === driverId && ACTIVE_DRIVER_DISPATCH_STATES.has(dispatch.status)
  );
}

function syncDriverOperationalStates() {
  drivers.forEach((driver) => {
    if (LEGACY_DISABLED_DRIVER_STATES.has(driver.driverState)) {
      driver.driverState = "停用";
      return;
    }
    if (driver.certificationStatus !== "verified") {
      driver.driverState = "停用";
      return;
    }
    if (driver.driverState === "停用") return;
    if (driver.driverState === "休假中" && !driverHasActiveDispatch(driver.id)) return;
    if (driverHasActiveDispatch(driver.id)) {
      driver.driverState = "运输中";
      return;
    }
    if (driver.driverState === "在职" || driver.driverState === "运输中" || !["空闲", "停用", "休假中"].includes(driver.driverState)) {
      driver.driverState = "空闲";
    }
  });
}

if (typeof window !== "undefined") window.applyCapacitySnapshot = applyCapacitySnapshot;

syncDriverOperationalStates();

function saveDispatches() {
  window.DispatchStore.save(dispatches);
  publishAdminDataSnapshot();
}

function publishAdminDataSnapshot() {
  if (!window.AdminDataBridge) return;
  const existing = window.AdminDataBridge.read() || {};
  window.AdminDataBridge.write({ ...existing,
    waybills,
    dispatches,
    fixedRoutes,
    vehicles,
    vehicleRepairs: vehicleRepairRecords,
    trailers,
    drivers,
    routeAccounts: typeof routeAccountCatalog !== "undefined" ? routeAccountCatalog : [],
  });
}

function getWaybillContainers(waybill) {
  if (Array.isArray(waybill.containers) && waybill.containers.length) return waybill.containers;
  const boxType = String(waybill.boxType || "40HQ").replace(/\*\d+$/, "");
  return [
    { boxNo: waybill.boxNo1, sealNo: waybill.sealNo1, boxType, pickupPoint: waybill.pickupPoint1, returnPoint: waybill.returnPoint },
    { boxNo: waybill.boxNo2, sealNo: waybill.sealNo2, boxType, pickupPoint: waybill.pickupPoint2, returnPoint: waybill.returnPoint },
  ].filter((item, index) => index === 0 || (item.boxNo && item.boxNo !== "-"));
}

function formatWaybillBoxes(waybill) {
  return getWaybillContainers(waybill).map((container) => [
    container.boxNo && container.boxNo !== "-" ? container.boxNo : "待装箱",
    container.sealNo && container.sealNo !== "-" ? `封号 ${container.sealNo}` : "",
    container.boxType || "-",
  ].filter(Boolean).join(" / ")).join("；");
}

function createPendingDispatch(waybill, route) {
  const dispatch = {
    id: `PD-${Date.now()}-${waybill.waybillNo}`,
    dispatchMode: "pending",
    waybillNo: waybill.waybillNo,
    planTaskId: waybill.planTaskId || `PT-LEGACY-${waybill.waybillNo}`,
    planTaskNo: waybill.planTaskNo || waybill.planTaskId || waybill.waybillNo,
    orderDate: waybill.orderDate,
    planExecutionDate: waybill.planExecutionDate || String(waybill.executionTime || waybill.orderDate || "").slice(0, 10),
    plannedBerthingTime: waybill.plannedBerthingTime || waybill.executionTime || `${waybill.orderDate}T08:00`,
    executionTime: waybill.plannedBerthingTime || waybill.executionTime || `${waybill.orderDate}T08:00`,
    taskType: waybill.taskType || "提空装货",
    taskConfigSnapshot: waybill.taskConfigSnapshot || (typeof window !== "undefined" ? window.DispatchTaskNodes?.snapshot?.(waybill.taskType || "提空装货") || null : null),
    orderOperatorName: waybill.orderOperatorName || (typeof currentOrderOperatorName === "function" ? currentOrderOperatorName() : "后台用户"),
    autoDispatch: waybill.autoDispatch === undefined ? true : Boolean(waybill.autoDispatch),
    dispatchAdvanceMinutes: Number(waybill.dispatchAdvanceMinutes) || 0,
    routeId: route?.id || "",
    routeName: route?.routeName || "未指定线路",
    customerId: waybill.customerId || route?.customerId || "-",
    customerName: waybill.customerName || route?.customerName || "-",
    projectId: waybill.projectId || route?.projectId || "",
    projectName: waybill.projectName || route?.projectName || "未分配项目",
    origin: route?.origin || waybill.loadAddress,
    destination: route?.destination || "-",
    loadAddress: waybill.loadAddress,
    dispatchTime: "",
    driverId: "",
    driverName: "待分配",
    phone: "-",
    vehicleId: "",
    status: "待派单",
    currentNode: "待派单",
    boxes: formatWaybillBoxes(waybill),
    boxNo1: waybill.boxNo1 || "-", sealNo1: waybill.tempSealNo1 ?? waybill.sealNo1 ?? "-", tempSealNo1: waybill.tempSealNo1 ?? waybill.sealNo1 ?? "-", railSealNo1: waybill.railSealNo1 || "-", seaSealNo1: waybill.seaSealNo1 || "-",
    boxNo2: waybill.boxNo2 || "-", sealNo2: waybill.tempSealNo2 ?? waybill.sealNo2 ?? "-", tempSealNo2: waybill.tempSealNo2 ?? waybill.sealNo2 ?? "-", railSealNo2: waybill.railSealNo2 || "-", seaSealNo2: waybill.seaSealNo2 || "-",
    estimatedRevenue: route ? Number(route.estimatedRevenue) || 0 : waybill.receivable,
    commission: route ? calculateRouteCommission(route) : 0,
    thirdPartyCarrierSnapshot: route?.thirdPartyCarrier || "",
    thirdPartyPricingMethodSnapshot: route?.thirdPartyPricingMethod || "perTrip",
    thirdPartySettlementPriceSnapshot: route?.thirdPartyEnabled ? Number(route.thirdPartySettlementPrice) || 0 : 0,
    thirdPartySettlementCycleSnapshot: route?.thirdPartySettlementCycle || "月结30天",
    thirdPartyInvoiceRequiredSnapshot: route?.thirdPartyInvoiceRequired !== false,
    note: "",
    pushed: false,
    timeline: [],
  };
  globalThis.DispatchOperationLog?.record(dispatch, {
    signature: "pending-created",
    time: `${waybill.orderDate} 08:00`,
    category: "system",
    action: "生成待派单任务",
    summary: `运单 ${waybill.waybillNo} 进入待派单池，等待调度分配运力`,
    operatorName: "系统",
    operatorAccount: "system",
    operatorRole: "系统",
    source: "运单状态联动",
    changes: [{ field: "status", label: "派单状态", before: "计划任务", after: "待派单" }],
  });
  dispatches.unshift(dispatch);
  saveDispatches();
  return dispatch;
}

let routeCurrentPage = 1;
let routePageSize = 10;
let routeHierarchyScope = { type: "all", id: "" };
let routeFormMode = "create";
let editingRouteId = "";
let deletingRouteId = "";
const selectedRouteIds = new Set();
let renderedRouteIds = [];

const routeQueryForm = document.querySelector("#routeQueryForm");
const routeBody = document.querySelector("#routeBody");
const routeDialog = document.querySelector("#routeDialog");
const routeForm = document.querySelector("#routeForm");
const deleteRouteDialog = document.querySelector("#deleteRouteDialog");
const routeSelectAll = document.querySelector("#routeSelectAll");
const routePageSizeSelect = document.querySelector("#routePageSize");
const routePageJump = document.querySelector("#routePageJump");
const routePrevPage = document.querySelector("#routePrevPage");
const routeNextPage = document.querySelector("#routeNextPage");
const routeCurrentPageButton = document.querySelector("#routeCurrentPage");
const routeMoreBtn = document.querySelector("#routeMoreBtn");
const routeMoreMenu = document.querySelector("#routeMoreMenu");
const projectDialog = document.querySelector("#projectDialog");
const projectForm = document.querySelector("#projectForm");
const projectCustomerSelect = document.querySelector("#projectCustomerSelect");

let dispatchCurrentPage = 1;
let dispatchPageSize = 10;
let deletingDispatchId = "";
let currentDispatchDetailId = "";
let currentPlanTaskDetailId = "";
let dispatchDetailPhotoTargets = [];
let dispatchPhotoPreviewObjectUrl = "";
let activePageName = "vehicle-dashboard";
const selectedDispatchIds = new Set();
let renderedDispatchIds = [];
const dispatchQueryForm = document.querySelector("#dispatchQueryForm");
const dispatchBody = document.querySelector("#dispatchBody");
const dispatchDialog = document.querySelector("#dispatchDialog");
const dispatchForm = document.querySelector("#dispatchForm");
const dispatchDetailDialog = document.querySelector("#dispatchDetailDialog");
const dispatchDetailPageContent = document.querySelector("#dispatchDetailPageContent");
const dispatchDetailPageSubtitle = document.querySelector("#dispatchDetailPageSubtitle");
const planTaskDetailPageContent = document.querySelector("#planTaskDetailPageContent");
const planTaskDetailPageSubtitle = document.querySelector("#planTaskDetailPageSubtitle");
const planTaskDetailBackBtn = document.querySelector("#planTaskDetailBackBtn");
const cancelPlanDialog = document.querySelector("#cancelPlanDialog");
const cancelPlanText = document.querySelector("#cancelPlanText");
const confirmCancelPlanBtn = document.querySelector("#confirmCancelPlanBtn");
let cancellingPlanTaskId = "";
const dispatchDetailEditBtn = document.querySelector("#dispatchDetailEditBtn");
const dispatchDetailOperationLogBtn = document.querySelector("#dispatchDetailOperationLogBtn");
const dispatchDetailBackBtn = document.querySelector("#dispatchDetailBackBtn");
const dispatchPhotoPreviewDialog = document.querySelector("#dispatchPhotoPreviewDialog");
const dispatchPhotoPreviewBody = document.querySelector("#dispatchPhotoPreviewBody");
const dispatchPhotoPreviewTitle = document.querySelector("#dispatchPhotoPreviewTitle");
const dispatchPhotoPreviewMeta = document.querySelector("#dispatchPhotoPreviewMeta");
const revokeDispatchDialog = document.querySelector("#revokeDispatchDialog");
const dispatchSelectAll = document.querySelector("#dispatchSelectAll");
const dispatchPageSizeSelect = document.querySelector("#dispatchPageSize");
const dispatchPageJump = document.querySelector("#dispatchPageJump");
const dispatchPrevPage = document.querySelector("#dispatchPrevPage");
const dispatchNextPage = document.querySelector("#dispatchNextPage");
const dispatchCurrentPageButton = document.querySelector("#dispatchCurrentPage");
const dispatchMoreBtn = document.querySelector("#dispatchMoreBtn");
const dispatchMoreMenu = document.querySelector("#dispatchMoreMenu");

let capacityCurrentPage = 1;
let capacityPageSize = 10;
const capacityQueryForm = document.querySelector("#capacityQueryForm");
const capacityBody = document.querySelector("#capacityBody");
const capacityPageSizeSelect = document.querySelector("#capacityPageSize");
const capacityPageJump = document.querySelector("#capacityPageJump");
const capacityPrevPage = document.querySelector("#capacityPrevPage");
const capacityNextPage = document.querySelector("#capacityNextPage");
const capacityCurrentPageButton = document.querySelector("#capacityCurrentPage");

function formatMoney(value) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);
}

function getPlanTaskToday(value = new Date()) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPlanTaskDate(value) {
  const date = String(value || "").replace("T", " ").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

function getPlanTaskGroups(rows = waybills) {
  const groups = new Map();
  rows.forEach((waybill) => {
    const id = waybill.planTaskId || `PT-LEGACY-${waybill.waybillNo}`;
    if (!groups.has(id)) groups.set(id, { id, taskNo: waybill.planTaskNo || id, waybills: [], first: waybill });
    groups.get(id).waybills.push(waybill);
  });
  return [...groups.values()].map((group) => {
    const dispatchList = typeof dispatches === "undefined" ? [] : group.waybills.flatMap((waybill) => dispatches.filter((dispatch) => dispatch.waybillNo === waybill.waybillNo));
    const statusFor = (waybill) => waybill.planStatus === "已取消" ? "已取消" : dispatchList.find((item) => item.waybillNo === waybill.waybillNo)?.status || waybill.status || "待派单";
    const childStatuses = new Map(group.waybills.map((waybill) => [waybill.waybillNo, statusFor(waybill)]));
    const completed = group.waybills.filter((waybill) => childStatuses.get(waybill.waybillNo) === "已完成").length;
    const moving = group.waybills.filter((waybill) => childStatuses.get(waybill.waybillNo) === "运输中").length;
    const assigned = group.waybills.filter((waybill) => childStatuses.get(waybill.waybillNo) === "已派单").length;
    const cancelled = group.waybills.filter((waybill) => ["取消", "已取消"].includes(childStatuses.get(waybill.waybillNo))).length;
    const pending = Math.max(0, group.waybills.length - completed - moving - assigned - cancelled);
    const active = moving + assigned;
    const totalActiveTasks = group.waybills.length - cancelled;
    const uncompleted = Math.max(0, totalActiveTasks - completed);
    const isCancelled = totalActiveTasks === 0;
    const status = isCancelled ? "已取消" : completed === totalActiveTasks ? "已完成" : completed + active > 0 ? "进行中" : "未开始";
    const canCancel = status === "未开始" && !dispatchList.some((item) => ["运输中", "已完成"].includes(item.status));
    const canEdit = status === "未开始" && dispatchList.every((item) => item.status === "待派单");
    return { ...group, dispatchList, childStatuses, completed, uncompleted, assigned, moving, active, pending, cancelled, status, canCancel, canEdit };
  });
}

function getRecordOwner(record = {}) {
  return record.createdByName || record.creatorName || record.ownerName || record.createdBy || record.orderOperatorName || record.operatorName || record.owner || "未记录";
}

function getPlanTaskQuickStatValues(groups, today = getPlanTaskToday()) {
  const isOpenPlan = (group) => !["已完成", "已取消"].includes(group.status);
  const planDate = (group) => getPlanTaskDate(group.first.planExecutionDate || group.first.executionTime || group.first.orderDate);
  return {
    overdue: groups.filter((group) => isOpenPlan(group) && planDate(group) && planDate(group) < today).length,
    pendingDispatch: groups.reduce((sum, group) => sum + group.pending, 0),
    todayBerthing: groups.reduce((sum, group) => sum + group.waybills.filter((waybill) => {
      const status = group.childStatuses.get(waybill.waybillNo);
      return getPlanTaskDate(waybill.plannedBerthingTime || waybill.executionTime) === today && !["已完成", "取消", "已取消"].includes(status);
    }).length, 0),
    inProgress: groups.filter((group) => group.status === "进行中").length,
    upcoming: groups.filter((group) => group.status === "未开始" && planDate(group) > today).length,
  };
}

function filterPlanTaskGroups(groups, filter, today = getPlanTaskToday()) {
  if (!filter) return groups;
  const isOpenPlan = (group) => !["已完成", "已取消"].includes(group.status);
  const planDate = (group) => getPlanTaskDate(group.first.planExecutionDate || group.first.executionTime || group.first.orderDate);
  return groups.filter((group) => {
    if (filter === "overdue") return isOpenPlan(group) && planDate(group) && planDate(group) < today;
    if (filter === "pending-dispatch") return group.pending > 0;
    if (filter === "today-berthing") return group.waybills.some((waybill) => {
      const status = group.childStatuses.get(waybill.waybillNo);
      return getPlanTaskDate(waybill.plannedBerthingTime || waybill.executionTime) === today && !["已完成", "取消", "已取消"].includes(status);
    });
    if (filter === "in-progress") return group.status === "进行中";
    if (filter === "upcoming") return group.status === "未开始" && planDate(group) > today;
    return true;
  });
}

function renderPlanTaskQuickStats(groups) {
  const values = getPlanTaskQuickStatValues(groups);
  const stats = [
    ["overdue", "已延期计划", values.overdue, "alarm-clock", "overdue"],
    ["pending-dispatch", "待派发子任务", values.pendingDispatch, "clipboard-list", "pending"],
    ["today-berthing", "今日待靠台", values.todayBerthing, "calendar-clock", "today"],
    ["in-progress", "进行中计划", values.inProgress, "truck", "moving"],
    ["upcoming", "即将执行计划", values.upcoming, "calendar-range", "tomorrow"],
  ];
  planTaskQuickStats.innerHTML = stats.map(([filter, label, count, icon, style]) => `<button class="dispatch-management-stat plan-task-quick-stat ${style}${planTaskQuickFilter === filter ? " active" : ""}" type="button" data-plan-task-filter="${filter}" aria-pressed="${planTaskQuickFilter === filter}"><span class="dispatch-management-stat-icon"><i data-lucide="${icon}" aria-hidden="true"></i></span><div><span>${label}</span><strong>${count}</strong></div></button>`).join("");
  window.lucide?.createIcons();
}

function renderRows(rows) {
  publishAdminDataSnapshot();
  const scopedRows = window.UserAccess?.filterRecords ? window.UserAccess.filterRecords(rows) : rows;
  const groups = getPlanTaskGroups(scopedRows);
  renderPlanTaskQuickStats(groups);
  const visibleGroups = filterPlanTaskGroups(groups, planTaskQuickFilter);
  const visibleTaskCount = visibleGroups.reduce((sum, group) => sum + group.waybills.length, 0);
  if (resultText) resultText.textContent = `共 ${visibleGroups.length} 个计划任务，子任务 ${visibleTaskCount} 条；可进入详情查看计划信息与派单情况`;
  if (!visibleGroups.length) {
    tableBody.innerHTML = '<tr><td class="no-data-cell" colspan="9">暂无符合条件的计划任务</td></tr>';
    return;
  }
  tableBody.innerHTML = visibleGroups.map((group) => {
    const first = group.first;
    const route = fixedRoutes.find((item) => item.id === (first.routeId || waybillRouteMap[first.waybillNo]));
    const planDate = first.planExecutionDate || String(first.executionTime || first.orderDate || "-").slice(0, 10);
    const planDateValue = getPlanTaskDate(planDate);
    const isOverdue = planDateValue && planDateValue < getPlanTaskToday() && !["已完成", "已取消"].includes(group.status);
    return `<tr>
      <td class="task-customer"><strong>${dashboardEscape(first.customerName || route?.customerName || "-")}</strong></td>
      <td class="task-project"><strong>${dashboardEscape(first.projectName || route?.projectName || "未分配项目")}</strong><small>${dashboardEscape(route?.routeName || first.routeId || "未指定线路")}</small></td>
      <td><strong>${dashboardEscape(first.taskTypeNameSnapshot || first.taskType || "提空装货")}</strong><small>${dashboardEscape(String(planDate).replace("T", " ").slice(0, 16))}</small></td>
      <td class="task-route-nodes">${route ? renderRouteStops(route, "plan-route-stops") : '<span class="route-node-empty">未指定固定线路</span>'}</td>
      <td class="plan-task-execution-cell"><div class="plan-task-execution-counts" aria-label="有效子任务共 ${group.completed + group.uncompleted} 项，已完成 ${group.completed} 项，未完成 ${group.uncompleted} 项"><span>完成 ${group.completed} / ${group.completed + group.uncompleted}</span><span>未完成 ${group.uncompleted}</span></div></td>
      <td class="plan-task-execution-cell"><div class="plan-task-execution-counts" aria-label="已派单 ${group.assigned + group.moving + group.completed} 项，待派单 ${group.pending} 项"><span>已派 ${group.assigned + group.moving + group.completed}</span><span>待派 ${group.pending}</span></div></td>
      <td><span class="plan-task-status">${dashboardEscape(group.status)}</span>${isOverdue ? '<small class="plan-task-overdue">已逾期</small>' : ""}</td>
      <td class="plan-task-creator"><strong>${dashboardEscape(getRecordOwner(first))}</strong></td>
      <td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn" data-view-plan-dispatch="${dashboardEscape(group.id)}" type="button">查看详情</button>${group.canEdit ? `<button class="link-btn" data-edit-plan="${dashboardEscape(group.id)}" type="button">编辑计划</button>` : ""}${group.canCancel ? `<button class="link-btn danger-link" data-cancel-plan="${dashboardEscape(group.id)}" type="button">取消计划</button>` : ""}</div></td>
    </tr>`;
  }).join("");
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function businessText(value, fallback = "未维护") {
  const text = String(value ?? "").trim();
  return text && !["undefined", "null", "nan"].includes(text.toLowerCase()) ? text : fallback;
}

function businessCell(value, fallback = "未维护") {
  return dashboardEscape(businessText(value, fallback));
}

function businessDateWithDays(value, fallback = "待补录") {
  const dateText = businessText(value, "");
  if (!dateText) return fallback;
  const remainingDays = daysUntil(dateText);
  return Number.isFinite(remainingDays) ? `${dashboardEscape(dateText)}（${remainingDays} 天）` : dashboardEscape(dateText);
}

function daysUntil(dateText) {
  const target = new Date(`${dateText}T00:00:00`);
  return Math.ceil((target - today) / 86400000);
}

function getDueInfo(vehicle, warningDays = 30) {
  const insuranceDates = [
    vehicle.insuranceDue,
    vehicle.commercialInsuranceExpiry,
    vehicle.mandatoryInsuranceExpiry,
    vehicle.cargoInsuranceExpiry,
    vehicle.liabilityInsuranceExpiry,
  ].filter(Boolean);
  const inspectionDates = [
    vehicle.inspectionDue,
    vehicle.operatingPermitExpiry,
    vehicle.technicalLevelExpiry,
    vehicle.drivingLicenseExpiry,
  ].filter(Boolean);
  const insuranceDays = insuranceDates.length ? Math.min(...insuranceDates.map(daysUntil)) : Infinity;
  const inspectionDays = inspectionDates.length ? Math.min(...inspectionDates.map(daysUntil)) : Infinity;

  if (insuranceDays < 0 || inspectionDays < 0) {
    return { key: "expired", label: "已过期", rowClass: "expired-row" };
  }
  if (insuranceDays <= warningDays) {
    return { key: "insurance", label: "保险即将到期", rowClass: "warning-row" };
  }
  if (inspectionDays <= warningDays) {
    return { key: "inspection", label: "审验即将到期", rowClass: "warning-row" };
  }
  return { key: "normal", label: "正常", rowClass: "" };
}

function getAssetDueState(dateText) {
  if (!dateText) return { key: "empty", label: "未录入", rowClass: "" };
  const days = daysUntil(dateText);
  if (!Number.isFinite(days)) return { key: "empty", label: "未录入", rowClass: "" };
  if (days < 0) return { key: "expired", label: `已逾期 ${Math.abs(days)} 天`, rowClass: "expired-row" };
  if (days <= 31) return { key: "upcoming", label: days === 0 ? "今天到期" : `${days} 天后到期`, rowClass: "warning-row" };
  return { key: "normal", label: "正常", rowClass: "" };
}

function isExpiredOrDueWithinNaturalMonth(dateText, referenceDate = today) {
  if (!dateText || String(dateText).length !== 10 || dateText[4] !== "-" || dateText[7] !== "-") return false;
  const [year, month, dayOfMonth] = dateText.split("-").map(Number);
  const expiry = new Date(year, month - 1, dayOfMonth);
  if (expiry.getFullYear() !== year || expiry.getMonth() !== month - 1 || expiry.getDate() !== dayOfMonth) return false;
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  const nextMonth = new Date(start);
  const day = nextMonth.getDate();
  nextMonth.setDate(1);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const monthEnd = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
  nextMonth.setDate(Math.min(day, monthEnd));
  return expiry < start || expiry <= nextMonth;
}

function getVehicleStateClass(state) {
  if (state === "在用") return "active-state";
  if (state === "报废") return "scrap-state";
  if (state === "闲置") return "idle-state";
  if (state === "停用") return "stop-state";
  if (state === "维修中") return "maintenance-state";
  return "stop-state";
}

function filterRows(formData) {
  return waybills.filter((item) => {
    const matchedWaybill = normalize(item.waybillNo).includes(normalize(formData.get("waybillNo")));
    const matchedCustomer = normalize(item.customerName).includes(normalize(formData.get("customerName")));
    const matchedAddress = normalize(item.loadAddress).includes(normalize(formData.get("loadAddress")));
    const matchedDispatch = normalize(item.dispatchNo).includes(normalize(formData.get("dispatchNo")));
    const matchedDate = !formData.get("planExecutionDate") || item.planExecutionDate === formData.get("planExecutionDate");
    const matchedDestination =
      !formData.get("destination") || normalize(item.loadAddress).includes(normalize(formData.get("destination")));
    return (
      matchedWaybill &&
      matchedCustomer &&
      matchedAddress &&
      matchedDispatch &&
      matchedDate &&
      matchedDestination
    );
  });
}

function filterVehicles(formData) {
  const plateNo = normalize(formData.get("plateNo"));
  const vehicleState = formData.get("vehicleState");
  const dueStatus = formData.get("dueStatus");
  const warningDays = Number(formData.get("warningDays")) || 30;
  const capacityOwnership = formData.get("capacityOwnership");
  return vehicles.filter((item) => {
    const matchedPlate = normalize(item.plateNo).includes(plateNo);
    const matchedState = !vehicleState || item.vehicleState === vehicleState;
    const matchedDueStatus = !dueStatus || getDueInfo(item, warningDays).key === dueStatus;
    return matchedPlate && matchedState && matchedDueStatus && CapacityOwnership.matchesFilter(item.capacityOwnership, capacityOwnership, true);
  });
}

function getTrailerById(trailerId = "") {
  return trailers.find((trailer) => trailer.id === trailerId);
}

function getTrailerLabel(trailerId = "") {
  return getTrailerById(trailerId)?.plateNo || "未绑定";
}

function getVehicleDriverLabel(vehicle) {
  const archivedDriver = businessText(vehicle?.driver, "");
  if (archivedDriver) return archivedDriver;
  const assignedDriver = typeof dispatches !== "undefined"
    ? [...dispatches].reverse().find((dispatch) => dispatch.vehicleId === vehicle?.plateNo && dispatch.driverName)
    : null;
  return assignedDriver ? [assignedDriver.driverName, assignedDriver.phone].filter(Boolean).join(" / ") : "未绑定司机";
}

function getWarningDays() {
  const form = document.querySelector("#vehicleQueryForm");
  const value = Number(new FormData(form).get("warningDays"));
  return Number.isFinite(value) && value > 0 ? value : 30;
}

function renderVehicleRows(rows, warningDays = 30) {
  const vehicleBody = document.querySelector("#vehicleBody");
  if (!rows.length) {
    vehicleBody.innerHTML = '<tr><td class="no-data-cell" colspan="12">暂无符合条件的车辆</td></tr>';
    return;
  }

  vehicleBody.innerHTML = rows
    .map((vehicle, index) => {
      const dueInfo = getDueInfo(vehicle, warningDays);
      return `
        <tr class="${dueInfo.rowClass}">
          <td>${(vehicleCurrentPage - 1) * vehiclePageSize + index + 1}</td>
          <td>${businessCell(vehicle.plateNo, "待录入车牌")}</td>
          <td>${businessCell(getTrailerLabel(vehicle.trailerId), "未绑定挂车")}</td>
          <td>${CapacityOwnership.badgeMarkup(vehicle.capacityOwnership)}</td>
          <td>${businessCell(CapacityOwnership.organizationName(vehicle), "待确认")}</td>
          <td>${businessCell(getVehicleDriverLabel(vehicle), "未绑定司机")}</td>
          <td><span class="state-pill ${getVehicleStateClass(vehicle.vehicleState)}">${businessCell(vehicle.vehicleState, "状态待确认")}</span></td>
          <td>${renderDueDateCell(vehicle.inspectionDue)}</td>
          <td>${renderDueDateCell(vehicle.mandatoryInsuranceExpiry || vehicle.insuranceDue)}</td>
          <td>${renderDueDateCell(vehicle.commercialInsuranceExpiry)}</td>
          <td>${businessCell(vehicle.permitNo, "待补录")}</td>
          <td class="fixed-action-column">
            <div class="vehicle-action-group">
              <button class="link-btn" data-detail-plate="${vehicle.plateNo}" type="button">详情</button>
              ${window.VehicleRepair?.hasOpenRepair(vehicleRepairRecords, vehicle.plateNo) ? `<button class="link-btn" data-view-vehicle-repair="${dashboardEscape(vehicle.plateNo)}" type="button">查看维修</button>` : `<button class="link-btn" data-repair-plate="${dashboardEscape(vehicle.plateNo)}" type="button">发起维修</button>`}
              <button class="link-btn" data-edit-plate="${vehicle.plateNo}" type="button">编辑</button>
              <button class="link-btn delete-btn" data-delete-plate="${vehicle.plateNo}" type="button">删除</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderDueDateCell(dateText) {
  const status = getAssetDueState(dateText);
  return `<span class="vehicle-due-date ${status.key}" title="${status.label}">${dashboardEscape(dateText || "待补录")}</span><small class="vehicle-due-caption ${status.key}">${status.label}</small>`;
}

function renderReminderCards(warningDays = 30) {
  const counts = { expired: 0, insurance: 0, inspection: 0, normal: 0 };
  vehicles.forEach((vehicle) => {
    const info = getDueInfo(vehicle, warningDays);
    counts[info.key] += 1;
  });
  const activeStatus = vehicleQueryForm.elements.dueStatus.value;
  const renderCard = (status, className, label, count, description) => `
    <button class="reminder-card ${className} ${activeStatus === status ? "is-active" : ""}" data-vehicle-due-status="${status}" type="button" aria-pressed="${activeStatus === status}">
      <strong>${label}</strong>
      <span>${count}</span>
      <small>${description}</small>
    </button>`;

  document.querySelector("#vehicleReminderCards").innerHTML = `
    <header class="vehicle-dashboard-heading">
      <h2 id="vehicleInsuranceSummaryTitle">车辆保险情况</h2>
    </header>
    ${renderCard("expired", "expired", "已过期", counts.expired, "审验或保险已逾期")}
    ${renderCard("insurance", "insurance", "保险即将到期", counts.insurance, `${warningDays} 天内保险到期`)}
    ${renderCard("inspection", "inspection", "审验即将到期", counts.inspection, `${warningDays} 天内审验到期`)}
    ${renderCard("normal", "normal", "正常车辆", counts.normal, "暂无临期事项")}
  `;
}

function applyVehicleDueStatusFilter(status) {
  vehicleQueryForm.elements.dueStatus.value = status;
  vehicleCurrentPage = 1;
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
}

function renderVehicleDetailBase(vehicle) {
  if (!vehicle) {
    document.querySelector("#vehicleDetailBase").innerHTML = "";
    return;
  }

  const detailGroups = [
    {
      title: "基础资料",
      description: "车辆归属与当前使用信息",
      items: [
        ["车牌号码", vehicle.plateNo],
        ["驾驶员", vehicle.driver],
        ["所属车队", vehicle.fleet],
        ["车队名称", vehicle.fleetName],
        ["默认挂车", getTrailerLabel(vehicle.trailerId)],
        ["运力归属", vehicle.capacityOwnership],
        ["所属单位", CapacityOwnership.organizationName(vehicle)],
        ["车辆状态", vehicle.vehicleState],
      ],
    },
    {
      title: "车辆参数",
      description: "车型、识别信息与运输参数",
      items: [
        ["车辆类型", vehicle.vehicleType],
        ["车架号", vehicle.vin],
        ["发动机号", vehicle.engineNo],
        ["整备质量（吨）", vehicle.curbWeight],
        ["百公里油耗（升）", vehicle.fuelConsumption],
        ["核定载质量（吨）", vehicle.ratedLoad],
      ],
    },
    {
      title: "证照信息",
      description: "登记、技术等级和营运证照",
      items: [
        ["车辆登记证号", vehicle.registrationCertNo],
        ["车辆技术等级", vehicle.technicalLevel],
        ["车辆技术等级有效期", vehicle.technicalLevelExpiry],
        ["行驶证号", vehicle.drivingLicenseNo],
        ["行驶证有效期", vehicle.drivingLicenseExpiry],
        ["营运证号", vehicle.permitNo],
        ["营运证有效期", vehicle.operatingPermitExpiry],
        ["审验到期", vehicle.inspectionDue],
      ],
    },
    {
      title: "保险与附件",
      description: "车辆保单、到期日期与电子资料",
      items: [
        ["商业险承保单位", vehicle.commercialInsuranceCompany],
        ["商业险单号", vehicle.commercialInsuranceNo],
        ["商业险有效期", vehicle.commercialInsuranceExpiry],
        ["交强险承保单位", vehicle.mandatoryInsuranceCompany],
        ["交强险保单号", vehicle.mandatoryInsuranceNo],
        ["交强险到期", vehicle.mandatoryInsuranceExpiry],
        ["货物险单号", vehicle.cargoInsuranceNo],
        ["货物险有效期", vehicle.cargoInsuranceExpiry],
        ["保险到期", vehicle.insuranceDue],
        ["备注", vehicle.remark],
        ["附件资料", vehicle.attachments],
      ],
    },
  ];

  document.querySelector("#detailVehicleTitle").textContent = businessText(vehicle.plateNo, "待录入车牌");
  document.querySelector("#detailVehicleMeta").textContent = `${businessText(vehicle.vehicleType, "待维护车型")} · ${businessText(vehicle.capacityOwnership, "待确认归属")} · ${businessText(CapacityOwnership.organizationName(vehicle), "待确认单位")}`;
  const detailVehicleState = document.querySelector("#detailVehicleState");
  detailVehicleState.textContent = businessText(vehicle.vehicleState, "状态待确认");
  detailVehicleState.className = `state-pill ${getVehicleStateClass(vehicle.vehicleState)}`;
  document.querySelector("#detailVehicleDriver").textContent = getVehicleDriverLabel(vehicle);
  document.querySelector("#detailVehicleFleet").textContent = vehicle.fleetName || vehicle.fleet || "—";
  document.querySelector("#detailVehicleInspectionDue").textContent = vehicle.inspectionDue || "—";
  document.querySelector("#detailVehicleInsuranceDue").textContent = vehicle.insuranceDue || "—";
  document.querySelector("#vehicleDetailBase").innerHTML = detailGroups
    .map(
      (group) => `
        <section class="vehicle-info-section" aria-label="${group.title}">
          <header>
            <div>
              <strong>${group.title}</strong>
              <span>${group.description}</span>
            </div>
            <small>${group.items.length} 项</small>
          </header>
          <dl class="vehicle-info-list">
            ${group.items
              .map(
                ([label, value]) => `
                  <div class="detail-item">
                    <dt>${label}</dt>
                    <dd>${businessCell(value, "未维护")}</dd>
                  </div>
                `
              )
              .join("")}
          </dl>
        </section>
      `
    )
    .join("");
}

function complianceRecordValue(record, fields, key) {
  return Array.isArray(record) ? record[fields.indexOf(key)] : record?.[key];
}

function complianceStatus(dateText, warningDays = 30) {
  if (!dateText) return { key: "normal", label: "未设置", days: Infinity };
  const days = daysUntil(dateText);
  if (days < 0) return { key: "expired", label: "已过期", days };
  if (days <= warningDays) return { key: "inspection", label: "即将到期", days };
  return { key: "normal", label: "有效", days };
}

function renderComplianceStatus(dateText, warningDays = 30, type = "inspection") {
  const status = complianceStatus(dateText, warningDays);
  const statusKey = status.key === "inspection" ? type : status.key;
  const detail = Number.isFinite(status.days) ? (status.days < 0 ? `逾期 ${Math.abs(status.days)} 天` : `剩余 ${status.days} 天`) : "";
  return `<span class="due-pill ${statusKey}" title="${dashboardEscape(detail)}">${status.label}</span>`;
}

function renderInspectionRows(plateNo = selectedVehicle?.plateNo || "") {
  const records = inspectionRecords
    .filter((record) => !plateNo || complianceRecordValue(record, inspectionRecordFields, "plateNo") === plateNo)
    .sort((left, right) => String(complianceRecordValue(right, inspectionRecordFields, "nextInspectionDue") || "").localeCompare(String(complianceRecordValue(left, inspectionRecordFields, "nextInspectionDue") || "")));
  document.querySelector("#inspectionBody").innerHTML = records.length ? records.map((record) => {
    const dueDate = complianceRecordValue(record, inspectionRecordFields, "nextInspectionDue");
    const result = complianceRecordValue(record, inspectionRecordFields, "inspectionResult") || "—";
    const status = complianceStatus(dueDate);
    return `<tr class="${status.key === "expired" ? "expired-row" : status.key === "inspection" ? "warning-row" : ""}">
      <td>${dashboardEscape(complianceRecordValue(record, inspectionRecordFields, "plateNo"))}</td>
      <td>${dashboardEscape(complianceRecordValue(record, inspectionRecordFields, "inspectionType") || "—")}</td>
      <td>${dashboardEscape(complianceRecordValue(record, inspectionRecordFields, "inspectionDate") || "—")}</td>
      <td>${dashboardEscape(dueDate || "—")}</td>
      <td>${dashboardEscape(complianceRecordValue(record, inspectionRecordFields, "inspectionAgency") || "—")}</td>
      <td class="money">${formatMoney(complianceRecordValue(record, inspectionRecordFields, "inspectionFee") || 0)}</td>
      <td>${dashboardEscape(result)}</td>
      <td>${renderComplianceStatus(dueDate, 30, "inspection")}</td>
    </tr>`;
  }).join("") : '<tr><td class="no-data-cell" colspan="8">暂无审验记录</td></tr>';
}

function renderInsuranceRows(plateNo = selectedVehicle?.plateNo || "") {
  const policies = insurancePolicies
    .filter((policy) => !plateNo || complianceRecordValue(policy, insurancePolicyFields, "plateNo") === plateNo)
    .sort((left, right) => String(complianceRecordValue(right, insurancePolicyFields, "policyExpiry") || "").localeCompare(String(complianceRecordValue(left, insurancePolicyFields, "policyExpiry") || "")));
  document.querySelector("#insuranceBody").innerHTML = policies.length ? policies.map((policy) => {
    const dueDate = complianceRecordValue(policy, insurancePolicyFields, "policyExpiry");
    const status = complianceStatus(dueDate);
    const policyPeriod = complianceRecordValue(policy, insurancePolicyFields, "policyPeriod") || [policy.policyStart, policy.policyExpiry].filter(Boolean).join(" 至 ") || "—";
    return `<tr class="${status.key === "expired" ? "expired-row" : status.key === "inspection" ? "warning-row" : ""}">
      <td>${dashboardEscape(complianceRecordValue(policy, insurancePolicyFields, "plateNo"))}</td>
      <td>${dashboardEscape(complianceRecordValue(policy, insurancePolicyFields, "insuranceType") || "—")}</td>
      <td>${dashboardEscape(complianceRecordValue(policy, insurancePolicyFields, "insuranceCompany") || "—")}</td>
      <td>${dashboardEscape(complianceRecordValue(policy, insurancePolicyFields, "policyNo") || "—")}</td>
      <td class="money">${formatMoney(complianceRecordValue(policy, insurancePolicyFields, "insuredAmount") || 0)}</td>
      <td>${dashboardEscape(dueDate || "—")}</td>
      <td class="money">${formatMoney(complianceRecordValue(policy, insurancePolicyFields, "premium") || 0)}</td>
      <td>${dashboardEscape(policyPeriod)}</td>
      <td>${dashboardEscape(complianceRecordValue(policy, insurancePolicyFields, "attachment") || "—")}</td>
      <td>${renderComplianceStatus(dueDate, 30, "insurance")}</td>
    </tr>`;
  }).join("") : '<tr><td class="no-data-cell" colspan="10">暂无保险记录</td></tr>';
}

function openInspectionRecordDialog() {
  if (!selectedVehicle) return;
  inspectionRecordForm.reset();
  inspectionRecordForm.elements.plateNo.value = selectedVehicle.plateNo;
  inspectionRecordDialog.showModal();
}

function openInsurancePolicyDialog() {
  if (!selectedVehicle) return;
  insurancePolicyForm.reset();
  insurancePolicyForm.elements.plateNo.value = selectedVehicle.plateNo;
  insurancePolicyDialog.showModal();
}

function closeVehicleRecordDialog(dialog, form) {
  if (dialog.open) dialog.close();
  form.reset();
}

function latestDate(currentDate, nextDate) {
  return !currentDate || currentDate < nextDate ? nextDate : currentDate;
}

function addInspectionRecord(values) {
  const record = {
    ...values,
    id: `INS-${Date.now()}`,
    inspectionFee: Number(values.inspectionFee) || 0,
  };
  inspectionRecords.unshift(record);
  const vehicle = vehicles.find((item) => item.plateNo === record.plateNo);
  if (vehicle) {
    vehicle.inspectionDue = latestDate(vehicle.inspectionDue, record.nextInspectionDue);
    if (record.inspectionType === "营运证年审") vehicle.operatingPermitExpiry = latestDate(vehicle.operatingPermitExpiry, record.nextInspectionDue);
  }
  saveVehicleComplianceRecords();
}

function addInsurancePolicy(values) {
  const period = `${values.policyStart} 至 ${values.policyExpiry}`;
  const record = {
    ...values,
    id: `POL-${Date.now()}`,
    insuredAmount: Number(values.insuredAmount) || 0,
    premium: Number(values.premium) || 0,
    policyPeriod: period,
  };
  insurancePolicies.unshift(record);
  const vehicle = vehicles.find((item) => item.plateNo === record.plateNo);
  if (vehicle) {
    const insuranceFields = {
      "交强险": ["mandatoryInsuranceNo", "mandatoryInsuranceExpiry", "mandatoryInsuranceCompany"],
      "商业险": ["commercialInsuranceNo", "commercialInsuranceExpiry", "commercialInsuranceCompany"],
      "货物险": ["cargoInsuranceNo", "cargoInsuranceExpiry", "cargoInsuranceCompany"],
      "承运人责任险": ["liabilityInsuranceNo", "liabilityInsuranceExpiry", "liabilityInsuranceCompany"],
    }[record.insuranceType];
    if (insuranceFields) {
      const [numberField, expiryField, companyField] = insuranceFields;
      vehicle[numberField] = record.policyNo;
      vehicle[expiryField] = latestDate(vehicle[expiryField], record.policyExpiry);
      if (companyField) vehicle[companyField] = record.insuranceCompany;
    }
    const coverageDates = [vehicle.commercialInsuranceExpiry, vehicle.mandatoryInsuranceExpiry, vehicle.cargoInsuranceExpiry, vehicle.liabilityInsuranceExpiry].filter(Boolean);
    vehicle.insuranceDue = coverageDates.length ? coverageDates.sort()[0] : latestDate(vehicle.insuranceDue, record.policyExpiry);
  }
  saveVehicleComplianceRecords();
}

function renderReminderRows(warningDays = 30, plateNo = selectedVehicle?.plateNo || "") {
  const source = plateNo ? vehicles.filter((vehicle) => vehicle.plateNo === plateNo) : vehicles;
  const rows = source
    .map((vehicle) => ({ vehicle, dueInfo: getDueInfo(vehicle, warningDays) }))
    .filter((item) => item.dueInfo.key !== "normal");

  document.querySelector("#reminderBody").innerHTML = rows
    .map(({ vehicle, dueInfo }) => {
      const suggestion =
        dueInfo.key === "expired"
          ? "立即补办审验或续保，暂停高风险派车"
          : dueInfo.key === "insurance"
            ? "联系保险公司续保并上传新保单"
            : "预约审验机构，登记下次到期日期";
      return `
        <tr class="${dueInfo.rowClass}">
          <td>${businessCell(vehicle.plateNo, "待录入车牌")}</td>
          <td>${businessCell(getVehicleDriverLabel(vehicle), "未绑定司机")}</td>
          <td>${renderDueDateCell(vehicle.mandatoryInsuranceExpiry || vehicle.insuranceDue)}</td>
          <td>${renderDueDateCell(vehicle.commercialInsuranceExpiry)}</td>
          <td>${renderDueDateCell(vehicle.inspectionDue)}</td>
          <td><span class="due-pill ${dueInfo.key}">${dueInfo.label}</span></td>
          <td>${suggestion}</td>
        </tr>
      `;
    })
    .join("");

  document.querySelector("#reminderText").textContent = "到期日期已区分逾期、今天到期及未来一个自然月内到期";
}

function getFilteredVehicles() {
  return filterVehicles(new FormData(vehicleQueryForm));
}

function countExpiredVehicleInsurances(rows = vehicles, referenceDate = new Date()) {
  const boundary = new Date(referenceDate);
  boundary.setHours(0, 0, 0, 0);
  return rows.filter((vehicle) => {
    return [vehicle.mandatoryInsuranceExpiry, vehicle.commercialInsuranceExpiry, vehicle.insuranceDue]
      .filter(Boolean)
      .some((dateText) => {
        const expiry = new Date(`${dateText}T00:00:00`);
        return Number.isFinite(expiry.getTime()) && expiry < boundary;
      });
  }).length;
}

function renderVehicleInsuranceNavAlert(referenceDate = new Date()) {
  const badge = document.querySelector("#vehicleInsuranceExpiredBadge");
  const tooltip = document.querySelector("#vehicleInsuranceExpiredTooltip");
  if (!badge || !tooltip) return;
  const count = countExpiredVehicleInsurances(vehicles, referenceDate);
  const message = `${count}个保险已过期，请及时处理`;
  badge.textContent = String(count);
  badge.hidden = count === 0;
  tooltip.textContent = message;
  tooltip.hidden = count === 0;
}

function renderVehiclePagination(total) {
  const totalPages = Math.max(1, Math.ceil(total / vehiclePageSize));
  vehicleCurrentPage = Math.min(Math.max(1, vehicleCurrentPage), totalPages);
  vehicleCurrentPageButton.textContent = vehicleCurrentPage;
  vehiclePrevPage.disabled = vehicleCurrentPage <= 1;
  vehicleNextPage.disabled = vehicleCurrentPage >= totalPages;
  vehiclePageJump.max = totalPages;
  vehiclePageJump.value = vehicleCurrentPage;
}

function renderVehiclePage(rows = vehicles, warningDays = 30) {
  publishAdminDataSnapshot();
  renderVehicleInsuranceNavAlert();
  vehiclePageSize = Number(vehiclePageSizeSelect.value) || 10;
  renderVehiclePagination(rows.length);
  const start = (vehicleCurrentPage - 1) * vehiclePageSize;
  const pageRows = rows.slice(start, start + vehiclePageSize);

  renderReminderCards(warningDays);
  renderVehicleRows(pageRows, warningDays);
  renderVehicleDetailBase(selectedVehicle);
  renderInspectionRows(selectedVehicle?.plateNo || "");
  renderInsuranceRows(selectedVehicle?.plateNo || "");
  renderReminderRows(warningDays, selectedVehicle?.plateNo || "");
  document.querySelector("#vehicleResultText").textContent = `共 ${rows.length} 辆车，当前第 ${vehicleCurrentPage} / ${Math.max(1, Math.ceil(rows.length / vehiclePageSize))} 页`;
}

function populateVehicleTrailerOptions(currentTrailerId = "") {
  const select = document.querySelector("#vehicleTrailerSelect");
  if (!select) return;
  const options = trailers.filter((trailer) =>
    (trailer.trailerState === "在用" || trailer.id === currentTrailerId) &&
    (!vehicles.some((vehicle) => vehicle.trailerId === trailer.id && vehicle.plateNo !== editingVehiclePlate) || trailer.id === currentTrailerId)
  );
  select.innerHTML = '<option value="">不指定</option>' + options.map((trailer) => `<option value="${trailer.id}">${trailer.plateNo} / ${trailer.trailerType}${trailer.trailerState !== "在用" ? "（当前停用）" : ""}</option>`).join("");
  select.value = currentTrailerId || "";
}

function openVehicleForm(mode, plateNo = "") {
  closeVehicleDetail();
  vehicleFormMode = mode;
  editingVehiclePlate = plateNo;
  vehicleForm.reset();

  const vehicle = vehicles.find((item) => item.plateNo === plateNo);
  const hasOpenRepair = window.VehicleRepair.hasOpenRepair(vehicleRepairRecords, plateNo);
  populateVehicleTrailerOptions(vehicle?.trailerId || "");
  document.querySelector("#vehicleFormTitle").textContent = mode === "edit" ? "编辑车辆档案" : "新增车辆档案";
  vehicleForm.dataset.attachments = vehicle?.attachments || "";
  const drivingLicenseAttachment = vehicle?.drivingLicenseAttachment || (vehicle?.attachments?.includes("行驶证") ? "行驶证扫描件" : "");
  const operatingPermitAttachment = vehicle?.operatingPermitAttachment || (vehicle?.attachments?.includes("营运证") ? "营运证照片" : "");
  window.AttachmentPicker?.setExisting(vehicleForm.elements.drivingLicense, drivingLicenseAttachment);
  window.AttachmentPicker?.setExisting(vehicleForm.elements.operatingPermit, operatingPermitAttachment);

  if (vehicle) {
    [
      "plateNo",
      "driver",
      "fleet",
      "fleetName",
      "trailerId",
      "engineNo",
      "curbWeight",
      "fuelConsumption",
      "ratedLoad",
      "registrationCertNo",
      "vehicleType",
      "technicalLevel",
      "technicalLevelExpiry",
      "drivingLicenseNo",
      "drivingLicenseExpiry",
      "permitNo",
      "operatingPermitExpiry",
      "commercialInsuranceNo",
      "commercialInsuranceCompany",
      "commercialInsuranceExpiry",
      "mandatoryInsuranceNo",
      "mandatoryInsuranceCompany",
      "mandatoryInsuranceExpiry",
      "cargoInsuranceNo",
      "cargoInsuranceExpiry",
      "capacityOwnership", "supplierName",
      "vehicleState",
      "vin",
      "inspectionDue",
      "insuranceDue",
      "remark",
    ].forEach(
      (fieldName) => {
        if (vehicleForm.elements[fieldName]) vehicleForm.elements[fieldName].value = vehicle[fieldName] || "";
      }
    );
    vehicleForm.elements.supplierName.value = vehicle.capacityOwnership === CapacityOwnership.TYPES.THIRD ? CapacityOwnership.organizationName(vehicle) : "";
  }
  if (!vehicle) vehicleForm.elements.capacityOwnership.value = CapacityOwnership.TYPES.SELF;
  refreshThirdPartyCustomerDatalist();
  syncCapacityOwnershipForm(vehicleForm);
  vehicleForm.elements.vehicleState.disabled = hasOpenRepair;

  vehicleDialog.showModal();
}

function closeVehicleForm() {
  if (vehicleDialog.open) vehicleDialog.close();
  vehicleForm.reset();
  vehicleForm.elements.vehicleState.disabled = false;
  vehicleFormMode = "create";
  editingVehiclePlate = "";
}

function getVehicleFormData() {
  const formData = new FormData(vehicleForm);
  const drivingLicenseAttachment = window.AttachmentPicker?.getValue(vehicleForm.elements.drivingLicense) || "";
  const operatingPermitAttachment = window.AttachmentPicker?.getValue(vehicleForm.elements.operatingPermit) || "";
  const retainedAttachments = (vehicleForm.dataset.attachments || "").split("、")
    .filter((name) => name && !name.includes("行驶证") && !name.includes("营运证") && name !== "未上传");
  const attachmentNames = [drivingLicenseAttachment, operatingPermitAttachment, ...retainedAttachments].filter(Boolean);

  return {
    plateNo: formData.get("plateNo").trim(),
    driver: formData.get("driver").trim(),
    fleet: formData.get("fleet").trim(),
    fleetName: formData.get("fleetName").trim(),
    trailerId: formData.get("trailerId") || "",
    vehicleType: formData.get("vehicleType").trim(),
    vin: formData.get("vin").trim(),
    engineNo: formData.get("engineNo").trim(),
    curbWeight: formData.get("curbWeight"),
    fuelConsumption: formData.get("fuelConsumption"),
    ratedLoad: formData.get("ratedLoad"),
    registrationCertNo: formData.get("registrationCertNo").trim(),
    technicalLevel: formData.get("technicalLevel").trim(),
    technicalLevelExpiry: formData.get("technicalLevelExpiry"),
    drivingLicenseNo: formData.get("drivingLicenseNo").trim(),
    drivingLicenseExpiry: formData.get("drivingLicenseExpiry"),
    permitNo: formData.get("permitNo").trim(),
    operatingPermitExpiry: formData.get("operatingPermitExpiry"),
    commercialInsuranceNo: formData.get("commercialInsuranceNo").trim(),
    commercialInsuranceCompany: formData.get("commercialInsuranceCompany").trim(),
    commercialInsuranceExpiry: formData.get("commercialInsuranceExpiry"),
    mandatoryInsuranceNo: formData.get("mandatoryInsuranceNo").trim(),
    mandatoryInsuranceCompany: formData.get("mandatoryInsuranceCompany").trim(),
    mandatoryInsuranceExpiry: formData.get("mandatoryInsuranceExpiry"),
    cargoInsuranceNo: formData.get("cargoInsuranceNo").trim(),
    cargoInsuranceExpiry: formData.get("cargoInsuranceExpiry"),
    ...capacityFieldsFromForm(vehicleForm, "vehicle"),
    vehicleState: formData.get("vehicleState"),
    inspectionDue: formData.get("inspectionDue"),
    insuranceDue: formData.get("insuranceDue"),
    remark: formData.get("remark").trim(),
    drivingLicenseAttachment,
    operatingPermitAttachment,
    attachments: attachmentNames.length ? attachmentNames.join("、") : "未上传",
  };
}

function requestDeleteVehicle(plateNo) {
  const vehicle = vehicles.find((item) => item.plateNo === plateNo);
  if (!vehicle) return;
  deletingVehiclePlate = plateNo;
  document.querySelector("#deleteVehicleText").textContent = `确认删除车辆 ${plateNo} 吗？关联的审验和保单记录也会一并移除。`;
  deleteVehicleDialog.showModal();
}

function closeDeleteVehicleDialog() {
  if (deleteVehicleDialog.open) deleteVehicleDialog.close();
  deletingVehiclePlate = "";
}

function deleteVehicle(plateNo) {
  const vehicleIndex = vehicles.findIndex((item) => item.plateNo === plateNo);
  if (vehicleIndex < 0) return;

  vehicles.splice(vehicleIndex, 1);
  [inspectionRecords, insurancePolicies].forEach((records) => {
    for (let index = records.length - 1; index >= 0; index -= 1) {
      if (complianceRecordValue(records[index], records === inspectionRecords ? inspectionRecordFields : insurancePolicyFields, "plateNo") === plateNo) records.splice(index, 1);
    }
  });
  saveVehicleComplianceRecords();

  if (selectedVehicle?.plateNo === plateNo) selectedVehicle = vehicles[0];
  closeDeleteVehicleDialog();
  closeVehicleDetail();
  closeVehicleForm();
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
  renderTrailerPage(getFilteredTrailers());
}

function filterTrailers(formData) {
  const plateNo = normalize(formData.get("plateNo"));
  const vehicleType = normalize(formData.get("vehicleType"));
  const organization = normalize(formData.get("organization"));
  const conditions = [
    { field: "mandatoryDue", date: (item) => item.mandatoryInsuranceExpiry || item.insuranceDue },
    { field: "commercialDue", date: (item) => item.commercialInsuranceExpiry || item.insuranceDue },
    { field: "inspectionDueFilter", date: (item) => item.inspectionDue },
  ];
  const assets = [
    ...vehicles.map((item) => ({ ...item, assetKind: "vehicle", assetId: item.plateNo, assetType: item.vehicleType || "牵引车", assetState: item.vehicleState })),
    ...trailers.map((item) => ({ ...item, assetKind: "trailer", assetId: item.plateNo, assetType: item.trailerType, engineNo: item.engineNo || "", assetState: item.trailerState, capacityOwnership: item.capacityOwnership, mandatoryInsuranceExpiry: item.mandatoryInsuranceExpiry || item.insuranceDue, commercialInsuranceExpiry: item.commercialInsuranceExpiry || item.insuranceDue })),
  ];
  return assets.filter((item) =>
    normalize(item.plateNo).includes(plateNo) &&
    normalize(item.assetType).includes(vehicleType) &&
    normalize(CapacityOwnership.organizationName(item)).includes(organization) &&
    conditions.every(({ field, date }) => !formData.get(field) || isExpiredOrDueWithinNaturalMonth(date(item)))
  );
}

function getFilteredTrailers() {
  return filterTrailers(new FormData(trailerQueryForm));
}

function renderTrailerRows(rows) {
  if (!rows.length) {
    trailerBody.innerHTML = '<tr><td class="no-data-cell" colspan="14">暂无符合条件的车辆档案</td></tr>';
    return;
  }
  trailerBody.innerHTML = rows.map((item) => {
    const isVehicle = item.assetKind === "vehicle";
    const identity = isVehicle ? item.plateNo : item.id;
    const type = isVehicle ? item.vehicleType : item.trailerType;
    const state = isVehicle ? item.vehicleState : item.trailerState;
    const inspectionDue = getAssetDueState(item.inspectionDue);
    const mandatoryDue = getAssetDueState(item.mandatoryInsuranceExpiry || item.insuranceDue);
    const commercialDue = getAssetDueState(item.commercialInsuranceExpiry || item.insuranceDue);
    const esc = (value) => dashboardEscape(value || "—");
    return `<tr class="${[inspectionDue, mandatoryDue, commercialDue].some((due) => due.key === "expired") ? "expired-row" : [inspectionDue, mandatoryDue, commercialDue].some((due) => due.key === "upcoming") ? "warning-row" : ""}">
      <td><strong class="primary-text">${esc(item.plateNo)}</strong><small>${isVehicle ? "牵引车" : "挂车"} · ${esc(state)}</small></td>
      <td>${esc(type)}</td><td>${esc(CapacityOwnership.organizationName(item))}</td><td>${esc(item.vin)}</td><td>${esc(item.engineNo)}</td>
      <td>${esc(item.mandatoryInsuranceCompany)}</td><td>${esc(item.mandatoryInsuranceNo)}</td><td>${renderDueDateCell(item.mandatoryInsuranceExpiry || item.insuranceDue)}</td>
      <td>${esc(item.commercialInsuranceCompany)}</td><td>${esc(item.commercialInsuranceNo)}</td><td>${renderDueDateCell(item.commercialInsuranceExpiry || item.insuranceDue)}</td><td>${renderDueDateCell(item.inspectionDue)}</td><td>${esc(item.permitNo)}</td>
      <td class="fixed-action-column"><div class="vehicle-action-group">${isVehicle ? `<button class="link-btn" data-edit-plate="${dashboardEscape(identity)}" type="button">编辑</button><button class="link-btn delete-btn" data-delete-plate="${dashboardEscape(identity)}" type="button">删除</button>` : `<button class="link-btn" data-edit-trailer="${dashboardEscape(identity)}" type="button">编辑</button><button class="link-btn delete-btn" data-delete-trailer="${dashboardEscape(identity)}" type="button">删除</button>`}</div></td>
    </tr>`;
  }).join("");
}

function renderTrailerPage(rows = getFilteredTrailers()) {
  publishAdminDataSnapshot();
  if (!trailerBody || !trailerPageSizeSelect) return;
  trailerPageSize = Number(trailerPageSizeSelect.value) || 10;
  const totalPages = Math.max(1, Math.ceil(rows.length / trailerPageSize));
  trailerCurrentPage = Math.min(Math.max(1, trailerCurrentPage), totalPages);
  const start = (trailerCurrentPage - 1) * trailerPageSize;
  renderTrailerRows(rows.slice(start, start + trailerPageSize));
  trailerCurrentPageButton.textContent = trailerCurrentPage;
  trailerPrevPage.disabled = trailerCurrentPage <= 1;
  trailerNextPage.disabled = trailerCurrentPage >= totalPages;
  trailerPageJump.max = totalPages;
  trailerPageJump.value = trailerCurrentPage;
  document.querySelector("#trailerTotalText").textContent = `共 ${rows.length} 条记录`;
  document.querySelector("#trailerResultText").textContent = `共 ${rows.length} 条车辆档案，当前第 ${trailerCurrentPage} / ${totalPages} 页`;
  document.querySelector("#trailerActiveBadge").textContent = `车辆 ${vehicles.length + trailers.length}`;
}

function openTrailerForm(mode, trailerId = "") {
  trailerFormMode = mode;
  editingTrailerId = trailerId;
  trailerForm.reset();
  const trailer = trailers.find((item) => item.id === trailerId);
  document.querySelector("#trailerFormTitle").textContent = mode === "edit" ? "编辑挂车档案" : "新增挂车档案";
  if (trailer) {
    ["plateNo", "trailerType", "vin", "engineNo", "fleet", "capacityOwnership", "supplierName", "trailerState", "registrationCertNo", "permitNo", "operatingPermitExpiry", "inspectionDue", "mandatoryInsuranceCompany", "mandatoryInsuranceNo", "mandatoryInsuranceExpiry", "commercialInsuranceCompany", "commercialInsuranceNo", "commercialInsuranceExpiry", "insuranceNo", "insuranceDue", "attachments", "remark"].forEach((fieldName) => {
      if (trailerForm.elements[fieldName]) trailerForm.elements[fieldName].value = trailer[fieldName] || "";
    });
    trailerForm.elements.supplierName.value = trailer.capacityOwnership === CapacityOwnership.TYPES.THIRD ? CapacityOwnership.organizationName(trailer) : "";
  }
  if (!trailer) trailerForm.elements.capacityOwnership.value = CapacityOwnership.TYPES.SELF;
  refreshThirdPartyCustomerDatalist();
  syncCapacityOwnershipForm(trailerForm);
  trailerDialog.showModal();
}

function closeTrailerForm() {
  if (trailerDialog?.open) trailerDialog.close();
  trailerForm?.reset();
  trailerFormMode = "create";
  editingTrailerId = "";
}

function getTrailerFormData() {
  const formData = new FormData(trailerForm);
  return {
    id: editingTrailerId || `TR-${Date.now()}`,
    plateNo: String(formData.get("plateNo") || "").trim(),
    trailerType: String(formData.get("trailerType") || "").trim(),
    vin: String(formData.get("vin") || "").trim(),
    engineNo: String(formData.get("engineNo") || "").trim(),
    fleet: String(formData.get("fleet") || "").trim(),
    ...capacityFieldsFromForm(trailerForm, "trailer"),
    trailerState: formData.get("trailerState"),
    registrationCertNo: String(formData.get("registrationCertNo") || "").trim(),
    permitNo: String(formData.get("permitNo") || "").trim(),
    operatingPermitExpiry: formData.get("operatingPermitExpiry"),
    inspectionDue: formData.get("inspectionDue"),
    mandatoryInsuranceCompany: String(formData.get("mandatoryInsuranceCompany") || "").trim(),
    mandatoryInsuranceNo: String(formData.get("mandatoryInsuranceNo") || "").trim(),
    mandatoryInsuranceExpiry: formData.get("mandatoryInsuranceExpiry"),
    commercialInsuranceCompany: String(formData.get("commercialInsuranceCompany") || "").trim(),
    commercialInsuranceNo: String(formData.get("commercialInsuranceNo") || "").trim(),
    commercialInsuranceExpiry: formData.get("commercialInsuranceExpiry"),
    insuranceNo: String(formData.get("insuranceNo") || "").trim(),
    insuranceDue: formData.get("insuranceDue"),
    attachments: String(formData.get("attachments") || "").trim() || "未上传",
    remark: String(formData.get("remark") || "").trim(),
  };
}

function requestDeleteTrailer(trailerId) {
  const trailer = trailers.find((item) => item.id === trailerId);
  if (!trailer) return;
  if (vehicles.some((vehicle) => vehicle.trailerId === trailerId)) {
    showApplicationAlert("该挂车已被车辆档案关联，请先解除关联后再删除。");
    return;
  }
  deletingTrailerId = trailerId;
  document.querySelector("#deleteTrailerText").textContent = `确认删除挂车 ${trailer.plateNo} 吗？删除后将无法恢复。`;
  deleteTrailerDialog.showModal();
}

function closeDeleteTrailerDialog() {
  if (deleteTrailerDialog?.open) deleteTrailerDialog.close();
  deletingTrailerId = "";
}

function deleteTrailer(trailerId) {
  const index = trailers.findIndex((trailer) => trailer.id === trailerId);
  if (index < 0) return;
  trailers.splice(index, 1);
  closeDeleteTrailerDialog();
  renderTrailerPage(getFilteredTrailers());
}

function getDriverExpiryInfo(driver) {
  const licenseDays = daysUntil(driver.licenseExpiry);
  const qualificationDays = daysUntil(driver.qualificationExpiry);
  if (licenseDays < 0 || qualificationDays < 0) return { key: "expired", label: "已过期", rowClass: "expired-row" };
  if (licenseDays <= 30 && qualificationDays <= 30) return { key: "warning", label: "多证件即将到期", rowClass: "warning-row" };
  if (licenseDays <= 30) return { key: "license", label: "驾驶证即将到期", rowClass: "warning-row" };
  if (qualificationDays <= 30) return { key: "qualification", label: "从业资格证即将到期", rowClass: "warning-row" };
  return { key: "normal", label: "正常", rowClass: "" };
}

function getDriverStateClass(state) {
  if (state === "空闲") return "active-state";
  if (state === "运输中") return "maintenance-state";
  if (state === "休假中") return "leave-state";
  return "stop-state";
}

function getCertificationInfo(status) {
  return {
    unverified: { label: "未认证", className: "" },
    pending: { label: "待审核", className: "pending" },
    verified: { label: "已认证", className: "verified" },
    rejected: { label: "未通过", className: "rejected" },
  }[status] || { label: "未认证", className: "" };
}

function canReviewDriverCertification(driver) {
  return driver.certificationStatus === "pending" && driver.driverState !== "运输中";
}

function maskCertificationId(value) {
  return String(value || "").replace(/^(\d{6})\d+(\w{4})$/, "$1********$2");
}

function openCertificationReview(driverId) {
  const driver = drivers.find((item) => item.id === driverId);
  if (!driver) return;
  reviewingDriverId = driverId;
  const status = getCertificationInfo(driver.certificationStatus);
  const files = driver.certificationFiles || {};
  certificationReviewContent.innerHTML = `
    <div class="certification-review-summary">
      <div><span>司机姓名</span><strong>${businessCell(driver.name, "测试司机")}</strong></div>
      <div><span>身份证号</span><strong>${businessCell(maskCertificationId(driver.idCard), "330206********9999")}</strong></div>
      <div><span>认证状态</span><strong><em class="certification-badge ${status.className}">${status.label}</em></strong></div>
      <div><span>联系电话</span><strong>${businessCell(driver.phone, "13800009999")}</strong></div>
      <div><span>准驾车型</span><strong>${businessCell(driver.licenseClass, "A2")}</strong></div>
      <div><span>提交时间</span><strong>${businessCell(driver.certificationSubmittedAt, "尚未提交")}</strong></div>
    </div>
    <div class="certification-file-grid">
      <div class="certification-file-card"><i>身份</i><div><strong>身份证人像面</strong><span>${businessCell(files.idCardFront, "身份证人像面测试图.jpg")}</span></div></div>
      <div class="certification-file-card"><i>身份</i><div><strong>身份证国徽面</strong><span>${businessCell(files.idCardBack, "身份证国徽面测试图.jpg")}</span></div></div>
      <div class="certification-file-card"><i>驾驶</i><div><strong>驾驶证照片</strong><span>${businessCell(files.licenseAttachment || driver.licenseAttachment, "驾驶证测试扫描件.pdf")}</span></div></div>
      <div class="certification-file-card"><i>资格</i><div><strong>从业资格证</strong><span>${businessCell(files.qualificationAttachment || driver.qualificationAttachment, "从业资格证测试照片.jpg")}</span></div></div>
    </div>`;
  certificationReviewNote.value = driver.certificationReason || "";
  const canReview = canReviewDriverCertification(driver);
  document.querySelector("#certificationDialogTitle").textContent = canReview ? "司机认证审核" : "司机认证资料";
  document.querySelector("#certificationDialogSubtitle").textContent = canReview ? "核验司机身份、驾驶证及从业资格资料" : "查看司机认证状态及已提交资料";
  document.querySelector("#certificationReviewNoteField").hidden = !canReview;
  document.querySelector("#cancelCertificationReviewBtn").textContent = canReview ? "取消" : "关闭";
  document.querySelector("#approveCertificationBtn").disabled = !canReview;
  document.querySelector("#approveCertificationBtn").hidden = !canReview;
  document.querySelector("#rejectCertificationBtn").disabled = !canReview;
  document.querySelector("#rejectCertificationBtn").hidden = !canReview;
  driverCertificationDialog.showModal();
}

function closeCertificationReview() {
  if (driverCertificationDialog.open) driverCertificationDialog.close();
  reviewingDriverId = "";
  certificationReviewNote.value = "";
}

function reviewDriverCertification(result) {
  const driver = drivers.find((item) => item.id === reviewingDriverId);
  if (!driver || !canReviewDriverCertification(driver)) return;
  const note = certificationReviewNote.value.trim();
  if (result === "rejected" && !note) {
    certificationReviewNote.focus();
    certificationReviewNote.setCustomValidity("驳回认证时请填写审核意见");
    certificationReviewNote.reportValidity();
    return;
  }
  certificationReviewNote.setCustomValidity("");
  driver.certificationStatus = result;
  driver.certificationReason = result === "rejected" ? note : "";
  driver.certificationReviewedAt = window.DispatchStore.nowText();
  driver.driverState = result === "verified" ? (driverHasActiveDispatch(driver.id) ? "运输中" : "空闲") : "停用";
  saveDriverCertification(driver);
  closeCertificationReview();
  renderDriverPage(getFilteredDrivers());
}

function filterDrivers(formData) {
  const name = normalize(formData.get("driverName"));
  const idCard = normalize(formData.get("idCard"));
  const phone = normalize(formData.get("phone"));
  const state = formData.get("driverState");
  const expiryType = formData.get("expiryType");
  const capacityOwnership = formData.get("capacityOwnership");

  return drivers.filter((driver) => {
    const licenseDays = daysUntil(driver.licenseExpiry);
    const qualificationDays = daysUntil(driver.qualificationExpiry);
    const matchesExpiry =
      !expiryType ||
      (expiryType === "驾驶证即将到期" && licenseDays >= 0 && licenseDays <= 30) ||
      (expiryType === "从业资格证即将到期" && qualificationDays >= 0 && qualificationDays <= 30) ||
      (expiryType === "已过期" && (licenseDays < 0 || qualificationDays < 0));

    return (
      normalize(driver.name).includes(name) &&
      normalize(driver.idCard).includes(idCard) &&
      normalize(driver.phone).includes(phone) &&
      (!state || driver.driverState === state) &&
      matchesExpiry && CapacityOwnership.matchesFilter(driver.capacityOwnership, capacityOwnership, true)
    );
  });
}

function getFilteredDrivers() {
  return filterDrivers(new FormData(driverQueryForm));
}

function countExpiredDriverCredentials(rows = drivers, referenceDate = new Date()) {
  const boundary = new Date(referenceDate);
  boundary.setHours(0, 0, 0, 0);
  return rows.filter((driver) => [driver.licenseExpiry, driver.qualificationExpiry].some((date) => {
    if (!date) return false;
    const expiry = new Date(`${date}T00:00:00`);
    return Number.isFinite(expiry.getTime()) && expiry < boundary;
  })).length;
}

function renderDriverCredentialNavAlert(referenceDate = new Date()) {
  const badge = document.querySelector("#driverCredentialExpiredBadge");
  const tooltip = document.querySelector("#driverCredentialExpiredTooltip");
  if (!badge || !tooltip) return;
  const count = countExpiredDriverCredentials(drivers, referenceDate);
  badge.textContent = String(count);
  badge.hidden = count === 0;
  tooltip.textContent = `${count}个证件已过期，请及时处理`;
  tooltip.hidden = count === 0;
}

function renderDriverSummaryCards() {
  const ownDrivers = drivers;
  const attendanceCounts = {
    total: ownDrivers.length,
    leave: ownDrivers.filter((driver) => driver.driverState === "休假中").length,
    normal: ownDrivers.filter((driver) => ["空闲", "运输中"].includes(driver.driverState)).length,
    stopped: ownDrivers.filter((driver) => driver.driverState === "停用").length,
  };
  const certificateCounts = ownDrivers.reduce((summary, driver) => {
    const licenseDays = daysUntil(driver.licenseExpiry);
    const qualificationDays = daysUntil(driver.qualificationExpiry);
    if (licenseDays < 0 || qualificationDays < 0) summary.expired += 1;
    else if (licenseDays <= 30 || qualificationDays <= 30) summary.expiring += 1;
    else if (driver.certificationStatus !== "verified") summary.pending += 1;
    else summary.normal += 1;
    return summary;
  }, { normal: 0, expiring: 0, expired: 0, pending: 0 });

  document.querySelector("#driverSummaryCards").innerHTML = `
    <section class="driver-summary-group attendance-summary-group" aria-label="司机考勤状态">
      <header class="driver-summary-heading"><strong>考勤状态</strong><span>全部司机的当前出勤与停运情况</span></header>
      <div class="driver-summary-grid">
        <div class="reminder-card driver-total-card"><strong>全部司机</strong><span>${attendanceCounts.total}</span><small>已建立司机档案</small></div>
        <div class="reminder-card driver-leave-card"><strong>休假中</strong><span>${attendanceCounts.leave}</span><small>当前不参与排班</small></div>
        <div class="reminder-card driver-active-card"><strong>正常状态</strong><span>${attendanceCounts.normal}</span><small>空闲或运输中</small></div>
        <div class="reminder-card driver-warning-card"><strong>停运状态</strong><span>${attendanceCounts.stopped}</span><small>当前不可参与派车</small></div>
      </div>
    </section>
    <section class="driver-summary-group certificate-summary-group" aria-label="司机证件状态统计">
      <header class="driver-summary-heading"><strong>证件状态统计</strong><span>按驾驶证和从业资格证综合状态统计</span></header>
      <div class="driver-summary-grid">
        <div class="reminder-card driver-certificate-normal"><strong>正常证件</strong><span>${certificateCounts.normal}</span><small>证件有效且已认证</small></div>
        <div class="reminder-card driver-certificate-expiring"><strong>即将到期</strong><span>${certificateCounts.expiring}</span><small>30 天内需要续办</small></div>
        <div class="reminder-card driver-certificate-expired"><strong>已过期</strong><span>${certificateCounts.expired}</span><small>需要立即处理</small></div>
        <div class="reminder-card driver-certificate-pending"><strong>待认证</strong><span>${certificateCounts.pending}</span><small>认证资料待核验</small></div>
      </div>
    </section>
  `;
}

function updateDriverSelection() {
  const selectedOnPage = renderedDriverIds.filter((id) => selectedDriverIds.has(id)).length;
  driverSelectAll.checked = renderedDriverIds.length > 0 && selectedOnPage === renderedDriverIds.length;
  driverSelectAll.indeterminate = selectedOnPage > 0 && selectedOnPage < renderedDriverIds.length;
  document.querySelector("#driverSelectedText").textContent = `已选择 ${selectedDriverIds.size} 名司机`;
}

function renderDriverRows(rows) {
  renderedDriverIds = rows.map((driver) => driver.id);
  if (!rows.length) {
    driverBody.innerHTML = '<tr><td class="no-data-cell" colspan="16">暂无符合条件的司机档案</td></tr>';
    updateDriverSelection();
    return;
  }

  driverBody.innerHTML = rows
    .map((driver) => {
      const expiryInfo = getDriverExpiryInfo(driver);
      const certificationInfo = getCertificationInfo(driver.certificationStatus);
      const certificationAction = canReviewDriverCertification(driver)
        ? `<button class="link-btn" data-review-driver="${businessCell(driver.id, "待补录")}" type="button">认证审核</button>`
        : `<button class="link-btn" data-view-certification="${businessCell(driver.id, "待补录")}" type="button">查看认证资料</button>`;
      return `
        <tr class="${expiryInfo.rowClass}">
          <td><input class="driver-row-check" data-driver-id="${businessCell(driver.id, "待补录")}" type="checkbox" ${selectedDriverIds.has(driver.id) ? "checked" : ""} /></td>
          <td><strong class="primary-text">${businessCell(driver.name, "测试司机")}</strong></td>
          <td>${businessCell(driver.gender, "男")}</td>
          <td>${businessCell(driver.phone, "13800009999")}</td>
          <td>${businessCell(driver.idCard, "330206199001019999")}</td>
          <td><span class="state-pill ${getDriverStateClass(driver.driverState)}">${businessCell(driver.driverState, "停用")}</span></td>
          <td><span class="certification-badge ${certificationInfo.className}">${certificationInfo.label}</span></td>
          <td>${CapacityOwnership.badgeMarkup(driver.capacityOwnership)}</td>
          <td>${businessCell(CapacityOwnership.organizationName(driver), "待确认")}</td>
          <td>${businessCell(driver.fleet, "宁波测试车队")}</td>
          <td>${businessCell(driver.entryDate, "2026-03-18")}</td>
          <td>${businessCell(driver.licenseClass, "A2")}</td>
          <td>${businessCell(driver.licenseExpiry, "2029-06-18")}</td>
          <td>${businessCell(driver.qualificationExpiry, "2029-12-31")}</td>
          <td><span class="due-pill ${expiryInfo.key}">${expiryInfo.label}</span></td>
          <td class="fixed-action-column">
            <div class="vehicle-action-group">
              <button class="link-btn" data-detail-driver="${businessCell(driver.id, "待补录")}" type="button">详情</button>
              ${certificationAction}
              <button class="link-btn" data-edit-driver="${businessCell(driver.id, "待补录")}" type="button">编辑</button>
              <button class="link-btn delete-btn" data-delete-driver="${businessCell(driver.id, "待补录")}" type="button">删除</button>
            </div>
          </td>
        </tr>`;
    })
    .join("");
  updateDriverSelection();
}

function renderDriverDetail(driver) {
  const detailRoot = document.querySelector("#driverDetailBase");
  if (!driver) {
    detailRoot.innerHTML = '<div class="driver-detail-empty">未找到司机档案，请返回列表重新选择。</div>';
    return;
  }

  const certificationInfo = getCertificationInfo(driver.certificationStatus);
  const detailGroups = [
    {
      title: "基础资料",
      description: "身份、联系信息与当前在岗情况",
      items: [
        ["姓名", driver.name],
        ["性别", driver.gender],
        ["身份证号码", driver.idCard],
        ["手机号", driver.phone],
        ["住址", driver.address],
        ["紧急联系人", driver.emergencyContact],
        ["紧急联系电话", driver.emergencyPhone],
        ["入职日期", driver.entryDate],
        ["运力归属", driver.capacityOwnership],
        ["所属单位", CapacityOwnership.organizationName(driver)],
        ["司机状态", driver.driverState],
        ["所属车队", driver.fleet],
        ["认证状态", certificationInfo.label],
      ],
    },
    {
      title: "驾驶证",
      description: "准驾资格、证件期限与电子附件",
      items: [
        ["驾驶证号", driver.licenseNo],
        ["准驾车型", driver.licenseClass],
        ["发证日期", driver.licenseIssueDate],
        ["有效期截止日期", driver.licenseExpiry],
        ["驾驶证附件", driver.licenseAttachment],
      ],
    },
    {
      title: "道路运输从业资格证",
      description: "从业资格与证件有效期",
      items: [
        ["资格证号", driver.qualificationNo],
        ["有效期截止日期", driver.qualificationExpiry],
        ["证件附件", driver.qualificationAttachment],
      ],
    },
    {
      title: "其他信息",
      description: "结算账户与档案备注",
      items: [
        ["银行卡号", driver.bankCard],
        ["开户银行", driver.bankName],
        ["备注", driver.remark],
      ],
    },
  ];

  document.querySelector("#detailDriverTitle").textContent = businessText(driver.name, "测试司机");
  document.querySelector("#detailDriverMeta").textContent = `${businessText(driver.capacityOwnership, "自营")} · ${businessText(CapacityOwnership.organizationName(driver), "万物时空")} / ${businessText(driver.licenseClass, "A2")}`;
  const detailDriverState = document.querySelector("#detailDriverState");
  detailDriverState.textContent = businessText(driver.driverState, "停用");
  detailDriverState.className = `state-pill ${getDriverStateClass(driver.driverState)}`;
  document.querySelector("#detailDriverPhone").textContent = businessText(driver.phone, "13800009999");
  document.querySelector("#detailDriverFleet").textContent = businessText(driver.fleet, "宁波测试车队");
  document.querySelector("#detailDriverEntryDate").textContent = businessText(driver.entryDate, "2026-03-18");
  const detailDriverCertification = document.querySelector("#detailDriverCertification");
  detailDriverCertification.textContent = certificationInfo.label;
  detailDriverCertification.className = `certification-badge ${certificationInfo.className}`;
  const renderDetailGroup = (group) => `
        <section class="vehicle-info-section" aria-label="${group.title}">
          <header>
            <div>
              <strong>${group.title}</strong>
              <span>${group.description}</span>
            </div>
            <small>${group.items.length} 项</small>
          </header>
          <dl class="vehicle-info-list">
            ${group.items
              .map(
                ([label, value]) => `
                  <div class="detail-item">
                    <dt>${label}</dt>
                    <dd>${businessCell(value, "测试数据待补充")}</dd>
                  </div>
                `
              )
              .join("")}
          </dl>
        </section>
      `;
  detailRoot.innerHTML = `
    <div class="driver-detail-column" aria-label="个人资料与其他信息">
      ${renderDetailGroup(detailGroups[0])}
      ${renderDetailGroup(detailGroups[3])}
    </div>
    <div class="driver-detail-column" aria-label="证件信息">
      ${renderDetailGroup(detailGroups[1])}
      ${renderDetailGroup(detailGroups[2])}
    </div>
  `;
}

function renderDriverPagination(total) {
  const totalPages = Math.max(1, Math.ceil(total / driverPageSize));
  driverCurrentPage = Math.min(Math.max(1, driverCurrentPage), totalPages);
  driverCurrentPageButton.textContent = driverCurrentPage;
  driverPrevPage.disabled = driverCurrentPage <= 1;
  driverNextPage.disabled = driverCurrentPage >= totalPages;
  driverPageJump.max = totalPages;
  driverPageJump.value = driverCurrentPage;
  document.querySelector("#driverTotalText").textContent = `共 ${total} 条记录`;
}

function renderDriverPage(rows = drivers) {
  publishAdminDataSnapshot();
  renderDriverCredentialNavAlert();
  driverPageSize = Number(driverPageSizeSelect.value) || 10;
  renderDriverPagination(rows.length);
  const start = (driverCurrentPage - 1) * driverPageSize;
  renderDriverSummaryCards();
  renderDriverRows(rows.slice(start, start + driverPageSize));
  document.querySelector("#driverResultText").textContent = `共 ${rows.length} 条司机档案，当前第 ${driverCurrentPage} / ${Math.max(1, Math.ceil(rows.length / driverPageSize))} 页`;
  document.querySelector("#driverActiveBadge").textContent = `空闲 ${availableOwnDrivers().length}`;
}

function openDriverDetail(driverId) {
  const driver = drivers.find((item) => item.id === driverId);
  if (!driver) return;
  selectedDriverDetail = driver;
  document.querySelector("#driverPage").classList.add("detail-mode");
  driverDetailPanel.classList.add("open");
  renderDriverDetail(driver);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeDriverDetail() {
  document.querySelector("#driverPage").classList.remove("detail-mode");
  driverDetailPanel.classList.remove("open");
}

function openDriverForm(mode, driverId = "") {
  driverFormMode = mode;
  editingDriverId = driverId;
  driverForm.reset();
  const driver = drivers.find((item) => item.id === driverId);
  document.querySelector("#driverFormTitle").textContent = mode === "edit" ? "编辑司机档案" : "新增司机档案";
  driverForm.dataset.licenseAttachment = driver?.licenseAttachment || "";
  driverForm.dataset.qualificationAttachment = driver?.qualificationAttachment || "";
  window.AttachmentPicker?.setExisting(driverForm.elements.licenseAttachment, driver?.licenseAttachment === "未上传" ? "" : driver?.licenseAttachment || "");
  window.AttachmentPicker?.setExisting(driverForm.elements.qualificationAttachment, driver?.qualificationAttachment === "未上传" ? "" : driver?.qualificationAttachment || "");

  if (driver) {
    [
      "name", "gender", "idCard", "phone", "address", "emergencyContact", "emergencyPhone", "entryDate",
      "driverState", "fleet", "licenseNo", "licenseClass", "licenseIssueDate", "licenseExpiry", "qualificationNo",
      "qualificationExpiry", "bankCard", "bankName", "remark", "capacityOwnership", "supplierName",
    ].forEach((fieldName) => {
      driverForm.elements[fieldName].value = businessText(driver[fieldName], "");
    });
    driverForm.elements.supplierName.value = driver.capacityOwnership === CapacityOwnership.TYPES.THIRD ? CapacityOwnership.organizationName(driver) : "";
  }
  if (!driver) driverForm.elements.capacityOwnership.value = CapacityOwnership.TYPES.SELF;
  refreshThirdPartyCustomerDatalist();
  syncCapacityOwnershipForm(driverForm);
  driverDialog.showModal();
}

function closeDriverForm() {
  if (driverDialog.open) driverDialog.close();
  driverForm.reset();
  driverFormMode = "create";
  editingDriverId = "";
}

function getDriverFormData() {
  const formData = new FormData(driverForm);
  const textFields = [
    "name", "gender", "idCard", "phone", "address", "emergencyContact", "emergencyPhone", "entryDate",
    "driverState", "fleet", "licenseNo", "licenseClass", "licenseIssueDate", "licenseExpiry", "qualificationNo",
    "qualificationExpiry", "bankCard", "bankName", "remark",
  ];
  const data = Object.fromEntries(textFields.map((fieldName) => [fieldName, String(formData.get(fieldName) || "").trim()]));
  Object.assign(data, capacityFieldsFromForm(driverForm, "driver"));
  data.licenseAttachment = window.AttachmentPicker?.getValue(driverForm.elements.licenseAttachment) || "未上传";
  data.qualificationAttachment = window.AttachmentPicker?.getValue(driverForm.elements.qualificationAttachment) || "未上传";
  return data;
}

function requestDeleteDriver(driverId) {
  const driver = drivers.find((item) => item.id === driverId);
  if (!driver) return;
  deletingDriverId = driverId;
  document.querySelector("#deleteDriverText").textContent = `确认删除司机 ${driver.name} 的档案吗？删除后将无法恢复。`;
  deleteDriverDialog.showModal();
}

function closeDeleteDriverDialog() {
  if (deleteDriverDialog.open) deleteDriverDialog.close();
  deletingDriverId = "";
}

function deleteDriver(driverId) {
  const index = drivers.findIndex((driver) => driver.id === driverId);
  if (index < 0) return;
  drivers.splice(index, 1);
  selectedDriverIds.delete(driverId);
  if (selectedDriverDetail?.id === driverId) selectedDriverDetail = null;
  closeDeleteDriverDialog();
  closeDriverDetail();
  renderDriverPage(getFilteredDrivers());
}

function calculateRouteCommission(route) {
  return route.commissionType === "rate"
    ? Number(route.estimatedRevenue) * Number(route.commissionValue) / 100
    : Number(route.commissionValue);
}

function filterRoutes(formData) {
  const routeCode = normalize(formData.get("routeCode"));
  const routeName = normalize(formData.get("routeName"));
  const origin = normalize(formData.get("origin"));
  const destination = normalize(formData.get("destination"));
  const routeState = formData.get("routeState");
  const taskType = formData.get("taskType");
  return fixedRoutes.filter((route) =>
    normalize(route.routeCode).includes(routeCode) &&
    normalize(route.routeName).includes(routeName) &&
    normalize(route.origin).includes(origin) &&
    normalize(route.destination).includes(destination) &&
    (!routeState || route.routeState === routeState) &&
    (!taskType || route.taskType === taskType)
  );
}

function getFilteredRoutes() {
  const rows = filterRoutes(new FormData(routeQueryForm));
  return window.UserAccess?.filterRecords ? window.UserAccess.filterRecords(rows) : rows;
}

function getScopedRoutes(rows) {
  if (routeHierarchyScope.type === "customer") return rows.filter((route) => route.customerId === routeHierarchyScope.id);
  if (routeHierarchyScope.type === "project") return rows.filter((route) => route.projectId === routeHierarchyScope.id);
  if (routeHierarchyScope.type === "route") return rows.filter((route) => route.id === routeHierarchyScope.id);
  return rows;
}

function updateRouteSelection() {
  const selectedOnPage = renderedRouteIds.filter((id) => selectedRouteIds.has(id)).length;
  routeSelectAll.checked = renderedRouteIds.length > 0 && selectedOnPage === renderedRouteIds.length;
  routeSelectAll.indeterminate = selectedOnPage > 0 && selectedOnPage < renderedRouteIds.length;
  document.querySelector("#routeSelectedText").textContent = `已选择 ${selectedRouteIds.size} 条线路`;
  const listSelection = document.querySelector("#routeListSelectionText");
  if (listSelection) listSelection.textContent = `已选择 ${selectedRouteIds.size} 条线路`;
}

function renderRouteRows(rows) {
  renderedRouteIds = rows.map((route) => route.id);
  if (!rows.length) {
    routeBody.innerHTML = '<tr><td class="no-data-cell" colspan="14">暂无符合条件的固定线路</td></tr>';
    updateRouteSelection();
    return;
  }

  routeBody.innerHTML = rows.map((route) => {
    const commissionDisplay = route.commissionType === "rate" ? `${route.commissionValue}%` : formatMoney(route.commissionValue);
    return `
      <tr>
        <td><input class="route-row-check" data-route-id="${route.id}" type="checkbox" ${selectedRouteIds.has(route.id) ? "checked" : ""} /></td>
        <td><strong class="primary-text">${route.routeCode}</strong></td><td>${route.customerName || "-"}</td><td>${route.projectName || "-"}</td><td>${dashboardEscape(route.routeName || "-")}</td><td>${dashboardEscape(route.taskType || "-")}</td><td>${renderConfiguredJobLocations(route.jobLocations, "route-job-location-list")}</td>
        <td>${route.mileage !== "" && route.mileage !== null && route.mileage !== undefined ? `${Number(route.mileage).toFixed(1)} KM` : "待维护"}</td><td class="money">${formatMoney(route.estimatedRevenue)}</td><td>${route.commissionType === "rate" ? "按收入比例提成" : "固定金额提成"}</td>
        <td>${commissionDisplay}<small class="commission-result">预计 ${formatMoney(calculateRouteCommission(route))}</small></td>
        <td><span class="route-state ${route.routeState === "启用" ? "enabled" : "disabled"}">${route.routeState}</span></td><td>${route.remark || "-"}</td>
        <td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn" data-edit-route="${route.id}" type="button">编辑</button><button class="link-btn delete-btn" data-delete-route="${route.id}" type="button">删除</button></div></td>
      </tr>`;
  }).join("");
  updateRouteSelection();
}

function renderRoutePagination(total) {
  const totalPages = Math.max(1, Math.ceil(total / routePageSize));
  routeCurrentPage = Math.min(Math.max(1, routeCurrentPage), totalPages);
  routeCurrentPageButton.textContent = routeCurrentPage;
  routePrevPage.disabled = routeCurrentPage <= 1;
  routeNextPage.disabled = routeCurrentPage >= totalPages;
  routePageJump.max = totalPages;
  routePageJump.value = routeCurrentPage;
  document.querySelector("#routeTotalText").textContent = `共 ${total} 条记录`;
}

function renderRoutePage(rows = fixedRoutes) {
  publishAdminDataSnapshot();
  const routeTaskTypeFilter = document.querySelector("#routeTaskTypeFilter");
  if (routeTaskTypeFilter) {
    const selectedTaskType = routeTaskTypeFilter.value;
    const taskTypes = window.DispatchTaskNodes?.taskTypes?.() || [];
    routeTaskTypeFilter.innerHTML = '<option value="">全部任务类型</option>' + taskTypes.map((item) => `<option value="${dashboardEscape(item.name)}">${dashboardEscape(item.name)}</option>`).join("");
    routeTaskTypeFilter.value = selectedTaskType;
  }
  rows = getScopedRoutes(rows);
  routePageSize = Number(routePageSizeSelect.value) || 10;
  renderRoutePagination(rows.length);
  const start = (routeCurrentPage - 1) * routePageSize;
  renderRouteRows(rows.slice(start, start + routePageSize));
  document.querySelector("#routeResultText").textContent = `共 ${rows.length} 条线路，当前第 ${routeCurrentPage} / ${Math.max(1, Math.ceil(rows.length / routePageSize))} 页`;
  document.querySelector("#routeActiveBadge").textContent = `启用 ${fixedRoutes.filter((route) => route.routeState === "启用").length}`;
  renderRouteHierarchy();
  const scopeTitle = document.querySelector("#routeScopeTitle");
  const scopeText = document.querySelector("#routeScopeText");
  const scope = routeHierarchyScope.type === "customer" ? getRouteCustomers().find((item) => item.customerId === routeHierarchyScope.id)?.customerName : routeHierarchyScope.type === "project" ? getRouteAccount("", routeHierarchyScope.id)?.projectName : routeHierarchyScope.type === "route" ? fixedRoutes.find((item) => item.id === routeHierarchyScope.id)?.routeName : "全部线路";
  if (scopeTitle) scopeTitle.textContent = scope || "全部线路";
  if (scopeText) scopeText.textContent = routeHierarchyScope.type === "all" ? "展示所有客户的线路" : `当前范围 ${rows.length} 条线路`;
  refreshWaybillRouteOptions();
}

function renderRouteHierarchy() {
  const tree = document.querySelector("#routeTreeContent");
  if (!tree) return;
  const customers = getRouteCustomers().map((customer) => ({
    ...customer,
    projects: getRouteProjects(customer.customerId).map((project) => ({ ...project, routes: fixedRoutes.filter((route) => route.projectId === project.projectId) })),
  }));
  tree.innerHTML = customers.map((customer) => `<section class="route-tree-customer" data-tree-customer="${customer.customerId}"><div class="route-tree-customer-head"><button class="route-tree-collapse" data-route-tree-collapse type="button" aria-expanded="true" aria-label="展开或收起"><i data-lucide="chevron-down" aria-hidden="true"></i></button><button class="route-tree-customer-link" data-route-customer-id="${customer.customerId}" type="button"><strong>${customer.customerName}</strong></button><em>${customer.projects.length} 个项目</em></div><div class="route-tree-projects">${customer.projects.map((project) => `<div class="route-tree-project"><button class="route-tree-project-label ${routeHierarchyScope.type === "project" && routeHierarchyScope.id === project.projectId ? "active" : ""}" data-route-project-id="${project.projectId}" type="button"><span>${project.projectName}</span><small>${project.routes.length} 条线路</small></button></div>`).join("")}</div></section>`).join("");
  window.lucide?.createIcons();
}

function populateProjectForm(customerId = "") {
  if (!projectForm || !projectCustomerSelect) return;
  projectCustomerSelect.innerHTML = '<option value="">请选择客户</option>' + getRouteCustomers().map((item) => `<option value="${item.customerId}">${item.customerName}</option>`).join("");
  const scopedCustomerId = routeHierarchyScope.type === "customer"
    ? routeHierarchyScope.id
    : routeHierarchyScope.type === "project"
      ? getRouteAccount("", routeHierarchyScope.id)?.customerId
      : routeHierarchyScope.type === "route"
        ? fixedRoutes.find((item) => item.id === routeHierarchyScope.id)?.customerId
        : "";
  const preferredCustomerId = customerId || scopedCustomerId || "";
  projectCustomerSelect.value = preferredCustomerId || getRouteCustomers()[0]?.customerId || "";
  projectForm.elements.projectId.value = getNextProjectId(projectCustomerSelect.value);
  projectForm.elements.projectName.value = "";
}

function openProjectForm(customerId = "") {
  if (!projectDialog || !projectForm) return;
  projectForm.reset();
  populateProjectForm(customerId);
  projectDialog.showModal();
  projectForm.elements.projectName.focus();
}

function closeProjectForm() {
  if (projectDialog?.open) projectDialog.close();
  projectForm?.reset();
}

function saveProjectFromForm() {
  const customerId = String(projectForm.elements.customerId.value || "").trim();
  const projectName = String(projectForm.elements.projectName.value || "").trim();
  if (!customerId || !projectName) return false;
  const duplicate = routeAccountCatalog.some((item) => item.customerId === customerId && normalize(item.projectName) === normalize(projectName));
  if (duplicate) {
    showApplicationAlert("同一客户下已存在同名项目，请更换项目名称。");
    projectForm.elements.projectName.focus();
    return false;
  }
  const customer = getRouteCustomers().find((item) => item.customerId === customerId);
  const project = { customerId, customerName: customer?.customerName || "", projectId: getNextProjectId(customerId), projectName };
  routeAccountCatalog.push(project);
  routeHierarchyScope = { type: "project", id: project.projectId };
  routeCurrentPage = 1;
  closeProjectForm();
  renderRoutePage(getFilteredRoutes());
  return true;
}

function populateRouteAssociations() {
  const vehicleSelect = document.querySelector("#routeDefaultVehicle");
  const driverSelect = document.querySelector("#routeDefaultDriver");
  const ownershipFilter = document.querySelector("#routeCapacityOwnershipFilter")?.value || "";
  const currentVehicle = vehicleSelect.value;
  const currentDriver = driverSelect.value;
  const vehicleOptions = CapacityOwnership.sortSelfFirst(vehicles.filter((vehicle) => vehicle.vehicleState === "在用" && CapacityOwnership.matchesFilter(vehicle.capacityOwnership, ownershipFilter, true)));
  const driverOptions = CapacityOwnership.sortSelfFirst(enabledOwnDrivers().filter((driver) => CapacityOwnership.matchesFilter(driver.capacityOwnership, ownershipFilter, true)));
  vehicleSelect.innerHTML = '<option value="">不指定</option>' + vehicleOptions.map((vehicle) => `<option value="${dashboardEscape(vehicle.plateNo)}">【${vehicle.capacityOwnership}】${dashboardEscape(vehicle.plateNo)} · ${dashboardEscape(CapacityOwnership.organizationName(vehicle))}</option>`).join("");
  driverSelect.innerHTML = '<option value="">不指定</option>' + driverOptions.map((driver) => `<option value="${dashboardEscape(driver.name)}">【${driver.capacityOwnership}】${dashboardEscape(driver.name)} · ${dashboardEscape(CapacityOwnership.organizationName(driver))}</option>`).join("");
  if ([...vehicleSelect.options].some((option) => option.value === currentVehicle)) vehicleSelect.value = currentVehicle;
  if ([...driverSelect.options].some((option) => option.value === currentDriver)) driverSelect.value = currentDriver;
  const customerSelect = document.querySelector("#routeCustomerSelect");
  const projectSelect = document.querySelector("#routeProjectSelect");
  if (customerSelect && projectSelect) {
    customerSelect.innerHTML = '<option value="">请选择客户</option>' + getRouteCustomers().map((item) => `<option value="${item.customerId}">${item.customerName}</option>`).join("");
    projectSelect.innerHTML = '<option value="">请选择项目</option>' + routeAccountCatalog.map((item) => `<option value="${item.projectId}">${item.projectName}</option>`).join("");
  }
}

function updateRouteCommissionPreview() {
  const type = routeForm.elements.commissionType.value;
  const revenue = Number(routeForm.elements.estimatedRevenue.value) || 0;
  const value = Number(routeForm.elements.commissionValue.value) || 0;
  document.querySelector("#routeCommissionLabel").textContent = type === "rate" ? "提成比例（%）" : "固定提成金额（元）";
  routeForm.elements.commissionValue.max = type === "rate" ? "100" : "";
  document.querySelector("#routeCommissionPreview").value = type === "rate" ? (revenue * value / 100).toFixed(2) : value.toFixed(2);
}

function openRouteForm(mode, routeId = "") {
  routeFormMode = mode;
  editingRouteId = routeId;
  routeForm.reset();
  populateRouteAssociations();
  const route = fixedRoutes.find((item) => item.id === routeId);
  populateRouteTaskTypes(route?.taskType || "");
  document.querySelector("#routeFormTitle").textContent = mode === "edit" ? "编辑固定线路" : "新增固定线路";
  if (route) {
    ["routeName", "viaPoints", "mileage", "routeState", "remark", "estimatedRevenue", "baseFreight", "commissionType", "commissionValue", "commissionRemark", "defaultVehicle", "defaultDriver", "thirdPartyCarrier", "thirdPartyPricingMethod", "thirdPartySettlementPrice", "thirdPartySettlementCycle"].forEach((fieldName) => {
      if (route[fieldName] !== undefined && route[fieldName] !== null) routeForm.elements[fieldName].value = route[fieldName];
    });
    routeForm.elements.thirdPartyEnabled.value = String(Boolean(route.thirdPartyEnabled));
    routeForm.elements.thirdPartyInvoiceRequired.value = String(route.thirdPartyInvoiceRequired !== false);
    routeForm.elements.customerId.value = route.customerId || "";
    routeForm.elements.projectId.value = route.projectId || "";
    renderRouteJobLocationEditor(route.taskType, route.jobLocations || [], false);
  }
  updateRouteCommissionPreview();
  routeDialog.showModal();
}

document.querySelector("#routeTaskTypeSelect")?.addEventListener("change", (event) => renderRouteJobLocationEditor(event.target.value, [], true));

function populateRouteTaskTypes(selectedType = "") {
  const select = document.querySelector("#routeTaskTypeSelect");
  if (!select) return;
  const types = window.DispatchTaskNodes?.taskTypes?.() || [];
  select.innerHTML = '<option value="">请选择任务类型</option>' + types.map((type) => '<option value="' + dashboardEscape(type.name) + '">' + dashboardEscape(type.name) + '</option>').join("");
  select.value = types.some((type) => type.name === selectedType) ? selectedType : (types[0]?.name || "");
  renderRouteJobLocationEditor(select.value, [], true);
}

function renderRouteJobLocationEditor(taskType, currentLocations = [], reset = true) {
  const editor = document.querySelector("#routeJobLocationEditor");
  const hint = document.querySelector("#routeJobLocationHint");
  if (!editor) return;
  const profile = window.DispatchTaskNodes?.profile?.(taskType);
  const template = profile?.jobLocations || [];
  const previous = new Map((Array.isArray(currentLocations) ? currentLocations : []).map((location) => [location.id || location.name, location]));
  if (!profile) { editor.innerHTML = '<p class="route-job-location-empty">请先选择任务类型</p>'; if (hint) hint.textContent = "选择任务类型后将显示对应作业地点"; return; }
  editor.innerHTML = template.map((location, index) => {
    const old = !reset ? previous.get(location.id) || previous.get(location.name) : null;
    return '<label class="field route-job-location-field"><span class="field-label">' + String(index + 1).padStart(2, "0") + ' · ' + dashboardEscape(location.name) + '</span><input data-route-job-location data-location-id="' + dashboardEscape(location.id) + '" data-location-name="' + dashboardEscape(location.name) + '" value="' + dashboardEscape(old?.address || "") + '" maxlength="160" placeholder="请输入' + dashboardEscape(location.name) + '地址" /></label>';
  }).join("") || '<p class="route-job-location-empty">该任务类型暂未配置作业地点</p>';
  if (hint) hint.textContent = taskType + ' · ' + template.length + ' 个作业地点';
}

function normalizeFixedRouteJobLocations(route) {
  if (!route) return route;
  const taskType = route.taskType || (window.DispatchTaskNodes?.taskTypes?.() || [])[0]?.name || "";
  const template = window.DispatchTaskNodes?.profile?.(taskType)?.jobLocations || [];
  const existing = new Map((Array.isArray(route.jobLocations) ? route.jobLocations : []).map((location) => [location.id || location.name, location]));
  const legacyAddresses = [route.pickupPoint || route.origin, route.loadingPoint || route.destination, route.unloadingPoint || route.dropoffPoint || route.destination];
  route.taskType = taskType;
  route.jobLocations = template.map((location, index) => ({
    id: location.id,
    name: location.name,
    address: existing.get(location.id)?.address || existing.get(location.name)?.address || legacyAddresses[index] || "",
  }));
  return route;
}

function closeRouteForm() {
  if (routeDialog.open) routeDialog.close();
  routeForm.reset();
  routeFormMode = "create";
  editingRouteId = "";
}

function getRouteFormData() {
  const formData = new FormData(routeForm);
  const thirdPartySupplier = CapacityOwnership.findSupplier(formData.get("thirdPartyCarrier"));
  const jobLocations = [...(typeof document !== "undefined" ? document.querySelectorAll("#routeJobLocationEditor [data-route-job-location]") : [])].map((input) => ({ id: input.dataset.locationId, name: input.dataset.locationName, address: String(input.value || "").trim() }));
  const firstAddress = jobLocations.find((location) => /提箱|提空|提重/.test(location.name))?.address || jobLocations[0]?.address || "";
  const finalAddress = [...jobLocations].reverse().find((location) => /还箱|落箱|还空|还重|落重/.test(location.name))?.address || jobLocations.at(-1)?.address || "";
  return {
    routeName: String(formData.get("routeName") || "").trim(),
    taskType: String(formData.get("taskType") || "").trim(),
    jobLocations,
    origin: firstAddress, destination: finalAddress,
    viaPoints: String(formData.get("viaPoints") || "").trim(), routeState: formData.get("routeState"), remark: String(formData.get("remark") || "").trim(),
    mileage: Number(formData.get("mileage")) || 0,
    estimatedRevenue: Number(formData.get("estimatedRevenue")) || 0, baseFreight: Number(formData.get("baseFreight")) || 0, commissionType: formData.get("commissionType"),
    commissionValue: Number(formData.get("commissionValue")) || 0, commissionRemark: String(formData.get("commissionRemark") || "").trim(),
    defaultVehicle: formData.get("defaultVehicle"), defaultDriver: formData.get("defaultDriver"),
    thirdPartyEnabled: formData.get("thirdPartyEnabled") === "true",
    thirdPartyCarrier: String(formData.get("thirdPartyCarrier") || "").trim(),
    thirdPartySupplierId: thirdPartySupplier?.id || "",
    thirdPartyPricingMethod: formData.get("thirdPartyPricingMethod") || "perTrip",
    thirdPartySettlementPrice: Number(formData.get("thirdPartySettlementPrice")) || 0,
    thirdPartySettlementCycle: formData.get("thirdPartySettlementCycle") || "月结30天",
    thirdPartyInvoiceRequired: formData.get("thirdPartyInvoiceRequired") !== "false",
    customerId: formData.get("customerId"),
    customerName: (typeof routeAccountCatalog !== "undefined" ? getRouteAccount(formData.get("customerId"))?.customerName : "") || "",
    projectId: formData.get("projectId"),
    projectName: (typeof routeAccountCatalog !== "undefined" ? getRouteAccount("", formData.get("projectId"))?.projectName : "") || "",
  };
}

let routeSequence = 0;
function getNextRouteCode() {
  routeSequence = Math.max(routeSequence, ...fixedRoutes.map((route) => {
    const match = /^XL-(?:[A-Z]+-)?(\d+)$/.exec(route.routeCode);
    return match ? Number(match[1]) : 0;
  }));
  return `XL-${String(++routeSequence).padStart(3, "0")}`;
}

function requestDeleteRoute(routeId) {
  const route = fixedRoutes.find((item) => item.id === routeId);
  if (!route) return;
  deletingRouteId = routeId;
  document.querySelector("#deleteRouteText").textContent = `确认删除线路 ${route.routeName}（${route.routeCode}）吗？删除后将无法恢复。`;
  deleteRouteDialog.showModal();
}

function closeDeleteRouteDialog() {
  if (deleteRouteDialog.open) deleteRouteDialog.close();
  deletingRouteId = "";
}

function deleteRoute(routeId) {
  const index = fixedRoutes.findIndex((route) => route.id === routeId);
  if (index < 0) return;
  fixedRoutes.splice(index, 1);
  saveFixedRoutes();
  selectedRouteIds.delete(routeId);
  closeDeleteRouteDialog();
  renderRoutePage(getFilteredRoutes());
}

function refreshWaybillRouteOptions() {
  const select = document.querySelector("#waybillRouteSelect");
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = '<option value="">请选择固定线路</option>' + fixedRoutes.filter((route) => route.routeState === "启用").map((route) => `<option value="${route.id}">${route.routeCode} / ${route.routeName}</option>`).join("");
  select.value = fixedRoutes.some((route) => route.id === currentValue) ? currentValue : "";
}

const waybillRouteMap = {
  WB20260916001: "XL-001",
  WB20260916002: "XL-002",
  WB20260916003: "XL-003",
  WB20260916004: "XL-004",
};

waybills.forEach((item) => {
  const route = fixedRoutes.find((candidate) => candidate.id === item.routeId || candidate.id === waybillRouteMap[item.waybillNo]);
  if (!route) return;
  if (waybillRouteMap[item.waybillNo]) {
    item.customerId = route.customerId;
    item.customerName = route.customerName;
    item.projectId = route.projectId;
    item.projectName = route.projectName;
  } else {
    item.customerId = item.customerId || route.customerId;
    item.customerName = item.customerName || route.customerName;
    item.projectId = item.projectId || route.projectId;
    item.projectName = item.projectName === "未分配项目" ? route.projectName : (item.projectName || route.projectName);
  }
});

function getRouteForWaybill(waybillNo) {
  const waybill = waybills.find((item) => item.waybillNo === waybillNo);
  return fixedRoutes.find((route) => route.id === (waybillRouteMap[waybillNo] || waybill?.routeId)) || null;
}

function getDispatchStatusClass(status) {
  return { 待派单: "pending", 已派单: "assigned", 运输中: "moving", 已完成: "completed", 取消: "cancelled" }[status] || "pending";
}

function getDispatchAcceptanceStatus(dispatch = {}) {
  if (["取消", "已取消"].includes(dispatch.status)) return "已撤销";
  if (["已拒绝", "拒单"].includes(dispatch.status) || dispatch.acceptanceStatus === "已拒单") return "已拒单";
  if (["运输中", "已完成"].includes(dispatch.status) || dispatch.acceptanceStatus === "已接单") return "已接单";
  if (dispatch.status === "已派单") return "待接单";
  return "未派单";
}

function getDispatchTransportStatus(dispatch = {}) {
  if (dispatch.status === "待派单") return "未开始";
  if (dispatch.status === "已派单") return "待开始";
  if (dispatch.status === "运输中") return "运输中";
  if (dispatch.status === "已完成") return "已完成";
  if (["取消", "已取消"].includes(dispatch.status)) return "已取消";
  return dispatch.status || "待确认";
}

const seedAutoDispatchIds = new Set(["PD-1001", "PD-1003"]);

function getDispatchMode(dispatch) {
  if (dispatch.status === "待派单") return "pending";
  if (dispatch.dispatchMode === "auto" || dispatch.dispatchMode === "manual") return dispatch.dispatchMode;
  return seedAutoDispatchIds.has(dispatch.id) ? "auto" : "manual";
}

function renderDispatchStats() {
  document.querySelector("#dispatchTotalStat").textContent = dispatches.length;
  document.querySelector("#dispatchAutoStat").textContent = dispatches.filter((item) => getDispatchMode(item) === "auto").length;
  document.querySelector("#dispatchManualStat").textContent = dispatches.filter((item) => getDispatchMode(item) === "manual").length;
  document.querySelector("#dispatchPendingStat").textContent = dispatches.filter((item) => getDispatchMode(item) === "pending").length;
  const mode = dispatchQueryForm.elements.dispatchMode.value;
  document.querySelectorAll("[data-dispatch-mode]").forEach((button) => {
    const active = button.dataset.dispatchMode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function populateDispatchFilters() {
  const routeFilter = document.querySelector("#dispatchRouteFilter");
  const driverFilter = document.querySelector("#dispatchDriverFilter");
  const vehicleFilter = document.querySelector("#dispatchVehicleFilter");
  const vehicleTypeFilter = document.querySelector("#dispatchVehicleTypeFilter");
  const taskTypeFilter = document.querySelector("#dispatchTaskTypeFilter");
  const currentValues = { route: routeFilter.value, driver: driverFilter.value, vehicle: vehicleFilter.value };
  routeFilter.innerHTML = '<option value="">全部线路</option>' + fixedRoutes.map((route) => `<option value="${route.id}">${route.routeName}</option>`).join("");
  driverFilter.innerHTML = '<option value="">全部司机</option>' + CapacityOwnership.sortSelfFirst(drivers).map((driver) => `<option value="${driver.name}">${driver.name} / ${driver.capacityOwnership}</option>`).join("");
  vehicleFilter.innerHTML = '<option value="">全部车辆</option>' + vehicles.map((vehicle) => `<option value="${vehicle.plateNo}">${vehicle.plateNo}</option>`).join("");
  const vehicleTypes = [...new Set([...vehicles.map((vehicle) => vehicle.vehicleType), ...dispatches.map((dispatch) => dispatch.vehicleType)].filter(Boolean))];
  const taskTypes = [...new Set(dispatches.map((dispatch) => dispatch.taskType || waybills.find((waybill) => waybill.waybillNo === dispatch.waybillNo)?.taskType).filter(Boolean))];
  const currentType = vehicleTypeFilter.value;
  const currentTask = taskTypeFilter.value;
  vehicleTypeFilter.innerHTML = '<option value="">全部运力类型</option>' + vehicleTypes.map((value) => `<option>${dashboardEscape(value)}</option>`).join("");
  taskTypeFilter.innerHTML = '<option value="">全部任务类型</option>' + taskTypes.map((value) => `<option>${dashboardEscape(value)}</option>`).join("");
  routeFilter.value = currentValues.route;
  driverFilter.value = currentValues.driver;
  vehicleFilter.value = currentValues.vehicle;
  vehicleTypeFilter.value = currentType;
  taskTypeFilter.value = currentTask;
}

function filterDispatches(formData) {
  const waybillNo = normalize(formData.get("waybillNo"));
  const containerNo = normalize(formData.get("containerNo"));
  const dateStart = formData.get("dispatchDateStart");
  const dateEnd = formData.get("dispatchDateEnd");
  const customerName = normalize(formData.get("customerName"));
  const projectName = normalize(formData.get("projectName"));
  const routeId = formData.get("routeId");
  const driverName = formData.get("driverName");
  const plateNo = formData.get("plateNo");
  const status = formData.get("dispatchStatus");
  const mode = formData.get("dispatchMode");
  const capacityOwnership = formData.get("capacityOwnership");
  const vehicleType = formData.get("vehicleType");
  const taskType = formData.get("taskType");
  return dispatches.filter((dispatch) => {
    const waybill = (typeof waybills === "undefined" ? [] : waybills).find((item) => item.waybillNo === dispatch.waybillNo);
    const dispatchDate = String(dispatch.dispatchDate || dispatch.dispatchTime || "").slice(0, 10);
    const customer = dispatch.customerName || waybill?.customerName || "";
    const project = dispatch.projectName || waybill?.projectName || "";
    const actualTaskType = dispatch.taskType || waybill?.taskType || "";
    const containerNumbers = [
      dispatch.boxNo1,
      dispatch.boxNo2,
      waybill?.boxNo1,
      waybill?.boxNo2,
      ...(Array.isArray(dispatch.containers) ? dispatch.containers.map((item) => item?.boxNo) : []),
      ...(Array.isArray(waybill?.containers) ? waybill.containers.map((item) => item?.boxNo) : []),
    ].filter((value) => value && value !== "-").map(normalize);
    return normalize(dispatch.waybillNo).includes(waybillNo) &&
    (!containerNo || containerNumbers.some((value) => value.includes(containerNo))) &&
    (!dateStart || dispatchDate >= dateStart) &&
    (!dateEnd || dispatchDate <= dateEnd) &&
    normalize(customer).includes(customerName) &&
    normalize(project).includes(projectName) &&
    (!routeId || dispatch.routeId === routeId) &&
    (!driverName || dispatch.driverName === driverName) &&
    (!plateNo || dispatch.vehicleId === plateNo) &&
    (!status || dispatch.status === status) &&
    (!vehicleType || dispatch.vehicleType === vehicleType) &&
    (!taskType || actualTaskType === taskType) &&
    (!mode || getDispatchMode(dispatch) === mode) &&
    CapacityOwnership.matchesFilter(dispatch.capacityOwnershipSnapshot, capacityOwnership)
  });
}

function getFilteredDispatches() {
  const rows = filterDispatches(new FormData(dispatchQueryForm));
  if (!window.UserAccess?.filterRecords) return rows;
  const scoped = window.UserAccess.filterRecords(rows.map((dispatch) => {
    const waybill = waybills.find((item) => item.waybillNo === dispatch.waybillNo) || {};
    return { ...waybill, ...dispatch, customerId: dispatch.customerId || waybill.customerId, projectId: dispatch.projectId || waybill.projectId, routeId: dispatch.routeId || waybill.routeId };
  }));
  const allowedIds = new Set(scoped.map((item) => item.id));
  return rows.filter((item) => allowedIds.has(item.id));
}

function updateDispatchSelection() {
  const selectedOnPage = renderedDispatchIds.filter((id) => selectedDispatchIds.has(id)).length;
  dispatchSelectAll.checked = renderedDispatchIds.length > 0 && selectedOnPage === renderedDispatchIds.length;
  dispatchSelectAll.indeterminate = selectedOnPage > 0 && selectedOnPage < renderedDispatchIds.length;
  document.querySelector("#dispatchSelectedText").textContent = `已选择 ${selectedDispatchIds.size} 条派单`;
}

function renderDispatchCapacityProgress(dispatch) {
  if (dispatch.status === "取消") {
    return '<div class="dispatch-capacity-progress cancelled"><div class="dispatch-capacity-progress-head"><strong>已取消</strong><small>不计入进度</small></div><span class="dispatch-capacity-cancelled">任务已终止</span></div>';
  }
  const meta = getDashboardTaskMeta(dispatch);
  const completed = meta.progress >= 100;
  const blocks = meta.nodes.map((node, index) => {
    const state = completed || index < meta.currentIndex ? "completed" : index === meta.currentIndex ? "current" : "pending";
    return `<i class="capacity-node-block ${state}" title="${dashboardEscape(node)}" aria-label="${dashboardEscape(node)}"></i>`;
  }).join("");
  const stateClass = meta.exceptionReason ? "exception" : meta.nearComplete ? "near-complete" : completed ? "completed" : "";
  const progressNote = completed ? "已完成" : meta.nearComplete ? "快完成" : meta.progress ? `${meta.progress}%` : "待开始";
  return `<div class="dispatch-capacity-progress ${stateClass}">
    <div class="dispatch-capacity-progress-head"><strong>${dashboardEscape(meta.stage)}</strong><small>${meta.progress}% · ${progressNote}</small></div>
    <span class="capacity-node-track" role="list" aria-label="${dashboardEscape(`${meta.taskType}运力节点进度`)}">${blocks}</span>
    <span class="dispatch-capacity-progress-foot">${meta.completedCount} / ${meta.nodes.length} 节点</span>
  </div>`;
}

function renderDispatchRows(rows) {
  renderedDispatchIds = rows.map((dispatch) => dispatch.id);
  if (!rows.length) {
    dispatchBody.innerHTML = '<tr><td class="no-data-cell" colspan="12">暂无符合条件的派单记录</td></tr>';
    updateDispatchSelection();
    return;
  }

  dispatchBody.innerHTML = rows.map((dispatch) => {
    const waybill = waybills.find((item) => item.waybillNo === dispatch.waybillNo);
    const route = fixedRoutes.find((item) => item.id === (dispatch.routeId || waybill?.routeId));
    const taskType = window.DispatchTaskNodes?.resolve?.(dispatch.taskType || waybill?.taskType) || dispatch.taskType || waybill?.taskType || "";
    const locations = getDispatchJobLocationDefaults(taskType, route || {}, dispatch.jobLocations?.length ? dispatch.jobLocations : waybill?.jobLocations || []);
    const locationsMarkup = locations.length
      ? `<div class="dispatch-list-job-locations">${locations.map((location) => `<div><span>${dashboardEscape(location.name)}：</span><strong title="${dashboardEscape(location.address || "待维护")}">${dashboardEscape(location.address || "待维护")}</strong></div>`).join("")}</div>`
      : '<span class="route-node-empty">作业地点待维护</span>';
    const customer = dispatch.customerName || waybill?.customerName || route?.customerName || "-";
    const project = dispatch.projectName || waybill?.projectName || route?.projectName || "-";
    const routeName = dispatch.routeName || route?.routeName || waybill?.routeName || "未指定线路";
    return `
    <tr>
      <td><input class="dispatch-row-check" data-dispatch-id="${dispatch.id}" type="checkbox" ${selectedDispatchIds.has(dispatch.id) ? "checked" : ""} /></td>
      <td>${dashboardEscape(formatPlannedBerthingTime(dispatch))}</td><td><strong>${dashboardEscape(dispatch.taskType || "-")}</strong><small>${dashboardEscape(getRecordOwner(dispatch))}</small></td><td><span class="dispatch-status ${getDispatchStatusClass(dispatch.status)}">${dashboardEscape(dispatch.status || "-")}</span><small>${dashboardEscape(getDispatchAcceptanceStatus(dispatch))}</small></td><td><strong>${dashboardEscape(getDispatchTransportStatus(dispatch))}</strong><small class="dispatch-node">${dashboardEscape(getDispatchCurrentTransportNode(dispatch))}</small></td>
      <td><div class="dispatch-customer-route"><strong>${dashboardEscape(customer)} / ${dashboardEscape(project)}</strong><span>${dashboardEscape(routeName)}</span></div></td><td>${locationsMarkup}</td><td>${dispatch.dispatchTime || "-"}</td><td>${dashboardEscape(getActualBerthingTime(dispatch) || "-")}</td>
      <td><div class="dispatch-customer-route"><strong>${dashboardEscape(dispatch.driverName || "待分配")}</strong><span>${dashboardEscape(getDispatchAcceptanceStatus(dispatch))}</span><span>${dashboardEscape(dispatch.phone || "-")}</span></div></td><td><div class="dispatch-customer-route"><strong>${dashboardEscape(dispatch.vehicleId || "待分配")}</strong><span>${CapacityOwnership.badgeMarkup(dispatch.capacityOwnershipSnapshot || CapacityOwnership.TYPES.PENDING, dispatch.capacityOwnershipTooltipSnapshot)} ${dashboardEscape(organizationDisplayName(dispatch.vehicleOrganizationSnapshot, "待确定"))}</span></div></td>
      <td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn" data-view-dispatch="${dispatch.id}" type="button">查看</button><button class="link-btn dispatch-operation-link" data-operation-log-dispatch="${dispatch.id}" type="button">操作记录</button>${["待派单", "已派单", "运输中"].includes(dispatch.status) ? `<button class="link-btn" data-edit-dispatch="${dispatch.id}" type="button">编辑派单</button>` : ""}${["待派单", "已派单"].includes(dispatch.status) ? `<button class="link-btn delete-btn revoke-btn" data-revoke-dispatch="${dispatch.id}" type="button">撤销</button>` : ""}</div></td>
    </tr>`;
  }).join("");
  updateDispatchSelection();
}

function formatPlannedBerthingTime(dispatch) {
  const waybill = waybills.find((item) => item.waybillNo === dispatch?.waybillNo);
  const value = dispatch?.plannedBerthingTime || dispatch?.executionTime || waybill?.plannedBerthingTime || waybill?.executionTime || "";
  return value ? String(value).replace("T", " ").slice(0, 16) : "-";
}

function getDispatchCurrentTransportNode(dispatch) {
  if (dispatch?.status !== "运输中") return "-";
  const currentNode = String(dispatch.currentNode || "").trim();
  if (currentNode && currentNode !== "待派单") return currentNode;
  const timelineNode = [...(Array.isArray(dispatch.timeline) ? dispatch.timeline : [])]
    .reverse()
    .find((item) => item?.node && !["已派单", "取消", "已取消", "已拒绝", "派单调整"].includes(item.node));
  return timelineNode?.node || "-";
}

function getActualBerthingTime(dispatch) {
  if (dispatch?.actualBerthingTime) return dispatch.actualBerthingTime;
  const berthingEntry = (Array.isArray(dispatch?.timeline) ? dispatch.timeline : [])
    .find((entry) => String(entry?.node || "").includes("进站"));
  return berthingEntry?.time || "";
}

function renderDispatchPagination(total) {
  const totalPages = Math.max(1, Math.ceil(total / dispatchPageSize));
  dispatchCurrentPage = Math.min(Math.max(1, dispatchCurrentPage), totalPages);
  dispatchCurrentPageButton.textContent = dispatchCurrentPage;
  dispatchPrevPage.disabled = dispatchCurrentPage <= 1;
  dispatchNextPage.disabled = dispatchCurrentPage >= totalPages;
  dispatchPageJump.max = totalPages;
  dispatchPageJump.value = dispatchCurrentPage;
  document.querySelector("#dispatchTotalText").textContent = `共 ${total} 条记录`;
}

function renderDispatchPage(rows = dispatches) {
  publishAdminDataSnapshot();
  dispatchPageSize = Number(dispatchPageSizeSelect.value) || 10;
  const modePriority = { auto: 0, manual: 1, pending: 2 };
  const displayRows = [...rows].sort((left, right) => modePriority[getDispatchMode(left)] - modePriority[getDispatchMode(right)]);
  populateDispatchFilters();
  renderDispatchStats();
  renderDispatchPagination(displayRows.length);
  const start = (dispatchCurrentPage - 1) * dispatchPageSize;
  renderDispatchRows(displayRows.slice(start, start + dispatchPageSize));
  document.querySelector("#dispatchResultText").textContent = `共 ${rows.length} 条派单，当前第 ${dispatchCurrentPage} / ${Math.max(1, Math.ceil(rows.length / dispatchPageSize))} 页`;
  document.querySelector("#dispatchActiveBadge").textContent = `运输中 ${dispatches.filter((dispatch) => dispatch.status === "运输中").length}`;
  if (capacityBody) renderCapacityPage(getFilteredCapacityRecords());
}

function getCapacityStatusClass(status) {
  return {
    运输中: "moving",
    空闲中: "available",
    已停用: "disabled",
    维修中: "maintenance",
    休假中: "leave",
    未绑定: "unbound",
  }[status] || "idle";
}

function getLatestActiveDispatchForResource(resource = {}) {
  const activeStatuses = new Set(["待派单", "已派单", "运输中"]);
  return dispatches
    .filter((item) => activeStatuses.has(item.status))
    .filter((item) => (resource.driverId && item.driverId === resource.driverId) || (resource.vehicleId && item.vehicleId === resource.vehicleId))
    .sort((left, right) => String(right.dispatchTime || "").localeCompare(String(left.dispatchTime || "")))[0] || null;
}

function getCapacityDriverStatus(driver, activeDispatch) {
  if (!driver) return "未绑定";
  if (driver.driverState === "停用") return "已停用";
  if (driver.driverState === "休假中") return "休假中";
  if (activeDispatch?.status === "运输中" || driver.driverState === "运输中") return "运输中";
  return "空闲中";
}

function getCapacityVehicleStatus(vehicle, activeDispatch) {
  if (!vehicle) return "未绑定";
  if (vehicle.vehicleState === "停用") return "已停用";
  if (vehicle.vehicleState === "维修中") return "维修中";
  if (["已派单", "运输中"].includes(activeDispatch?.status)) return "运输中";
  return "空闲中";
}

function getCapacityRecords() {
  const linkedDriverIds = new Set();
  const vehicleRecords = vehicles.map((vehicle) => {
    const driverName = String(vehicle.driver || "").split("/")[0].trim();
    const driver = drivers.find((item) => item.name === driverName);
    if (driver) linkedDriverIds.add(driver.id);
    const vehicleDispatch = getLatestActiveDispatchForResource({ vehicleId: vehicle.plateNo });
    const driverDispatch = driver ? getLatestActiveDispatchForResource({ driverId: driver.id }) : null;
    const trailer = getTrailerById(vehicle.trailerId);
    const ownership = CapacityOwnership.groupSnapshot([
      driver && { ...driver, role: "司机", name: driver.name },
      { ...vehicle, role: "车辆", name: vehicle.plateNo },
      trailer && { ...trailer, role: "挂车", name: trailer.plateNo },
    ], { missingRequired: !driver });
    return {
      id: `vehicle-${vehicle.plateNo}`,
      resourceType: "车辆",
      driverId: driver?.id || "",
      driverName: driver?.name || "未绑定司机",
      driverPhone: driver?.phone || "",
      vehiclePlate: vehicle.plateNo,
      vehicleType: vehicle.vehicleType || "牵引车",
      trailerLabel: getTrailerLabel(vehicle.trailerId),
      currentTask: vehicleDispatch ? `${vehicleDispatch.waybillNo} / ${vehicleDispatch.routeName || "未指定线路"}` : "暂无进行中任务",
      driverStatus: getCapacityDriverStatus(driver, driverDispatch),
      vehicleStatus: getCapacityVehicleStatus(vehicle, vehicleDispatch),
      updatedAt: vehicleDispatch?.dispatchTime || driverDispatch?.dispatchTime || "最近同步",
      dispatchId: vehicleDispatch?.id || "",
      capacityOwnership: ownership.type,
      capacityOwnershipTooltip: ownership.tooltip,
    };
  });

  const unboundDriverRecords = drivers
    .filter((driver) => !linkedDriverIds.has(driver.id))
    .map((driver) => {
      const activeDispatch = getLatestActiveDispatchForResource({ driverId: driver.id });
      const ownership = CapacityOwnership.groupSnapshot([{ ...driver, role: "司机", name: driver.name }]);
      return {
        id: `driver-${driver.id}`,
        resourceType: "司机",
        driverId: driver.id,
        driverName: driver.name,
        driverPhone: driver.phone,
        vehiclePlate: "未绑定",
        vehicleType: "未绑定",
        trailerLabel: "未绑定",
        currentTask: activeDispatch ? `${activeDispatch.waybillNo} / ${activeDispatch.routeName || "未指定线路"}` : "暂无进行中任务",
        driverStatus: getCapacityDriverStatus(driver, activeDispatch),
        vehicleStatus: "未绑定",
        updatedAt: activeDispatch?.dispatchTime || "最近同步",
        dispatchId: activeDispatch?.id || "",
        capacityOwnership: ownership.type,
        capacityOwnershipTooltip: ownership.tooltip,
      };
    });

  const priority = { 运输中: 0, 空闲中: 1, 维修中: 2, 休假中: 3, 已停用: 4, 未绑定: 5 };
  return [...vehicleRecords, ...unboundDriverRecords].sort((left, right) => {
    const leftPriority = Math.min(priority[left.driverStatus] ?? 6, priority[left.vehicleStatus] ?? 6);
    const rightPriority = Math.min(priority[right.driverStatus] ?? 6, priority[right.vehicleStatus] ?? 6);
    return leftPriority - rightPriority || left.resourceType.localeCompare(right.resourceType) || left.driverName.localeCompare(right.driverName, "zh-CN");
  });
}

function filterCapacityRecords(rows, formData) {
  const keyword = normalize(formData.get("keyword"));
  const resourceType = formData.get("resourceType");
  const status = formData.get("status");
  const capacityOwnership = formData.get("capacityOwnership");
  return rows.filter((row) => {
    const matchedKeyword = !keyword || [row.driverName, row.driverPhone, row.vehiclePlate, row.trailerLabel, row.currentTask].some((value) => normalize(value).includes(keyword));
    const matchedType = !resourceType || row.resourceType === resourceType;
    const matchedStatus = !status || (status === "需关注" ? [row.driverStatus, row.vehicleStatus].some((value) => ["维修中", "休假中"].includes(value)) : row.driverStatus === status || row.vehicleStatus === status);
    return matchedKeyword && matchedType && matchedStatus && CapacityOwnership.matchesFilter(row.capacityOwnership, capacityOwnership);
  });
}

function getFilteredCapacityRecords() {
  return filterCapacityRecords(getCapacityRecords(), new FormData(capacityQueryForm));
}

function renderCapacitySummary(records = getCapacityRecords()) {
  const summary = document.querySelector("#capacityManagementSummary");
  if (!summary) return;
  const items = [
    { key: "", label: "全部运力", note: "司机与车辆", className: "total" },
    { key: "运输中", label: "运输中", note: "有进行中派单", className: "moving" },
    { key: "空闲中", label: "空闲中", note: "可安排任务", className: "available" },
    { key: "已停用", label: "已停用", note: "暂不可调度", className: "disabled" },
    { key: "需关注", label: "维修中 / 休假中", note: "需要关注", className: "attention" },
  ];
  summary.innerHTML = items.map((item) => {
    const value = item.key === "" ? records.length : item.key === "需关注" ? records.filter((row) => [row.driverStatus, row.vehicleStatus].some((status) => ["维修中", "休假中"].includes(status))).length : records.filter((row) => row.driverStatus === item.key || row.vehicleStatus === item.key).length;
    return `<button class="capacity-management-card ${item.className}" data-capacity-status="${item.key}" type="button"><span>${item.label}</span><strong>${value}</strong><small>${item.note}</small></button>`;
  }).join("");
}

function renderCapacityRows(rows) {
  if (!rows.length) {
    capacityBody.innerHTML = '<tr><td class="no-data-cell" colspan="10">暂无符合条件的运力记录</td></tr>';
    return;
  }
  capacityBody.innerHTML = rows.map((row) => `
    <tr>
      <td><span class="capacity-resource-badge ${row.resourceType === "车辆" ? "vehicle" : "driver"}">${row.resourceType}</span></td>
      <td>${CapacityOwnership.badgeMarkup(row.capacityOwnership, row.capacityOwnershipTooltip)}</td>
      <td><strong class="capacity-primary-text">${dashboardEscape(row.driverName)}</strong><small class="capacity-secondary-text">${dashboardEscape(row.driverPhone || "未绑定电话")}</small></td>
      <td><strong class="capacity-primary-text">${dashboardEscape(row.vehiclePlate)}</strong><small class="capacity-secondary-text">${dashboardEscape(row.vehicleType)}</small></td>
      <td>${dashboardEscape(row.trailerLabel)}</td>
      <td><strong class="capacity-task-text" title="${dashboardEscape(row.currentTask)}">${dashboardEscape(row.currentTask)}</strong></td>
      <td><span class="capacity-management-status ${getCapacityStatusClass(row.driverStatus)}">${row.driverStatus}</span></td>
      <td><span class="capacity-management-status ${getCapacityStatusClass(row.vehicleStatus)}">${row.vehicleStatus}</span></td>
      <td class="capacity-updated-text">${dashboardEscape(row.updatedAt)}</td>
      <td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn" data-capacity-dispatch="${dashboardEscape(row.dispatchId)}" data-capacity-driver="${dashboardEscape(row.driverId)}" data-capacity-vehicle="${dashboardEscape(row.vehiclePlate === "未绑定" ? "" : row.vehiclePlate)}" type="button">${row.dispatchId ? "查看派单" : "查看档案"}</button></div></td>
    </tr>`).join("");
}

function renderCapacityPagination(total) {
  const totalPages = Math.max(1, Math.ceil(total / capacityPageSize));
  capacityCurrentPage = Math.min(Math.max(1, capacityCurrentPage), totalPages);
  capacityCurrentPageButton.textContent = capacityCurrentPage;
  capacityPrevPage.disabled = capacityCurrentPage <= 1;
  capacityNextPage.disabled = capacityCurrentPage >= totalPages;
  capacityPageJump.max = totalPages;
  capacityPageJump.value = capacityCurrentPage;
  document.querySelector("#capacityTotalText").textContent = `共 ${total} 条记录`;
}

function renderCapacityPage(rows = getFilteredCapacityRecords()) {
  capacityPageSize = Number(capacityPageSizeSelect.value) || 10;
  const allRecords = getCapacityRecords();
  renderCapacitySummary(allRecords);
  renderCapacityPagination(rows.length);
  const start = (capacityCurrentPage - 1) * capacityPageSize;
  renderCapacityRows(rows.slice(start, start + capacityPageSize));
  document.querySelector("#capacityResultText").textContent = `共 ${rows.length} 条运力记录，当前第 ${capacityCurrentPage} / ${Math.max(1, Math.ceil(rows.length / capacityPageSize))} 页`;
  document.querySelector("#capacityActiveBadge").textContent = `运输中 ${allRecords.filter((row) => row.driverStatus === "运输中" || row.vehicleStatus === "运输中").length}`;
  window.lucide?.createIcons();
}

const DISPATCH_CUSTOM_SELECT_IDS = [
  "dispatchWaybillSelect",
  "dispatchDriverSelect",
  "dispatchVehicleSelect",
  "dispatchTrailerSelect",
  "dispatchVehicleTypeSelect",
  "dispatchProjectSelect",
  "dispatchRouteSelect",
  "dispatchBoxTypeSelect",
];

function refreshDispatchCustomSelect(select) {
  const wrapper = select?.closest(".dispatch-custom-select");
  if (!wrapper) return;
  const trigger = wrapper.querySelector(".dispatch-custom-select-trigger");
  const menu = wrapper.querySelector(".dispatch-custom-select-menu");
  if (!trigger || !menu) return;
  const options = Array.from(select.options || []);
  const selected = options.find((option) => option.value === select.value) || options[0];
  trigger.textContent = selected?.textContent || "请选择";
  trigger.disabled = Boolean(select.disabled);
  trigger.setAttribute("aria-expanded", String(wrapper.classList.contains("open")));
  menu.innerHTML = options.map((option) => `<button class="dispatch-custom-select-option${option.value === select.value ? " selected" : ""}" type="button" role="option" aria-selected="${option.value === select.value}" data-value="${option.value}">${option.textContent}</button>`).join("");
}

function refreshDispatchCustomSelects() {
  DISPATCH_CUSTOM_SELECT_IDS.forEach((id) => refreshDispatchCustomSelect(document.querySelector(`#${id}`)));
}

function enhanceDispatchSelect(select) {
  if (!select || select.dataset.dispatchCustomSelect === "true") return;
  const wrapper = document.createElement("div");
  wrapper.className = "dispatch-custom-select";
  const trigger = document.createElement("button");
  trigger.className = "dispatch-custom-select-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "listbox");
  const menu = document.createElement("div");
  menu.className = "dispatch-custom-select-menu";
  menu.setAttribute("role", "listbox");
  select.parentNode.insertBefore(wrapper, select);
  wrapper.append(select, trigger, menu);
  select.dataset.dispatchCustomSelect = "true";
  select.classList.add("dispatch-native-select");
  select.addEventListener("change", () => refreshDispatchCustomSelect(select));
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(() => refreshDispatchCustomSelect(select));
    observer.observe(select, { childList: true, subtree: true, attributes: true });
  }
  refreshDispatchCustomSelect(select);
}

function initializeDispatchCustomSelects() {
  DISPATCH_CUSTOM_SELECT_IDS.forEach((id) => enhanceDispatchSelect(document.querySelector(`#${id}`)));
  if (typeof refreshDispatchCustomSelects === "function") refreshDispatchCustomSelects();
}

document.addEventListener("click", (event) => {
  const option = event.target.closest(".dispatch-custom-select-option");
  const trigger = event.target.closest(".dispatch-custom-select-trigger");
  document.querySelectorAll(".dispatch-custom-select.open").forEach((wrapper) => {
    if (!wrapper.contains(event.target) || option) wrapper.classList.remove("open");
  });
  if (option) {
    const wrapper = option.closest(".dispatch-custom-select");
    const select = wrapper?.querySelector("select");
    if (select && !select.disabled) {
      select.value = option.dataset.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      refreshDispatchCustomSelect(select);
    }
    return;
  }
  if (trigger && !trigger.disabled) {
    const wrapper = trigger.closest(".dispatch-custom-select");
    wrapper.classList.toggle("open");
    refreshDispatchCustomSelect(wrapper.querySelector("select"));
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".dispatch-custom-select.open").forEach((wrapper) => wrapper.classList.remove("open"));
});

function populateDispatchFormOptions() {
  const editingDispatch = arguments[0] || null;
  const waybillSelect = document.querySelector("#dispatchWaybillSelect");
  const driverSelect = document.querySelector("#dispatchDriverSelect");
  const vehicleSelect = document.querySelector("#dispatchVehicleSelect");
  const vehicleTypeSelect = document.querySelector("#dispatchVehicleTypeSelect");
  if (editingDispatch) {
    const waybill = waybills.find((item) => item.waybillNo === editingDispatch.waybillNo);
    waybillSelect.innerHTML = `<option value="${editingDispatch.waybillNo}">${editingDispatch.waybillNo} / ${waybill?.customerName || "当前运单"}</option>`;
    waybillSelect.value = editingDispatch.waybillNo;
    waybillSelect.disabled = true;
  } else {
    waybillSelect.innerHTML = '<option value="">请选择已有运单</option>' + waybills.filter((waybill) =>
      !dispatches.some((dispatch) => dispatch.waybillNo === waybill.waybillNo && ["已派单", "运输中", "已完成"].includes(dispatch.status))
    ).map((waybill) => `<option value="${waybill.waybillNo}">${waybill.waybillNo} / ${waybill.customerName}</option>`).join("");
    waybillSelect.disabled = false;
  }
  const selectedDriverId = driverSelect.value || editingDispatch?.driverId || "";
  const selectedDriver = typeof drivers !== "undefined" ? drivers.find((driver) => driver.id === selectedDriverId) : null;
  const selectedOwnership = selectedDriver ? getDispatchResourceOwnership(selectedDriver) : "";
  const currentVehicleId = vehicleSelect.value || editingDispatch?.vehicleId || "";
  const availableVehicles = CapacityOwnership.sortSelfFirst(vehicles.filter((vehicle) => vehicle.vehicleState === "在用" && (!selectedOwnership || getDispatchResourceOwnership(vehicle) === selectedOwnership)));
  const currentVehicle = editingDispatch && vehicles.find((vehicle) => vehicle.plateNo === editingDispatch.vehicleId && vehicle.vehicleState === "在用" && (!selectedOwnership || getDispatchResourceOwnership(vehicle) === selectedOwnership));
  const availableDrivers = availableOwnDrivers();
  const currentDriver = editingDispatch && typeof drivers !== "undefined" ? drivers.find((driver) => driver.id === editingDispatch.driverId) : null;
  const vehicleDriverName = String(currentVehicle?.driver || "").split("/")[0].trim();
  const vehicleDriver = typeof drivers !== "undefined" ? drivers.find((driver) => driver.name === vehicleDriverName) : null;
  const driverCandidates = [currentDriver, vehicleDriver].filter(Boolean);
  const driverOptions = [...availableDrivers, ...driverCandidates.filter((driver, index) =>
    !availableDrivers.some((item) => item.id === driver.id) && driverCandidates.findIndex((item) => item.id === driver.id) === index
  )];
  driverSelect.innerHTML = '<option value="">请选择司机</option>' + CapacityOwnership.sortSelfFirst(driverOptions).map((driver) => `<option value="${driver.id}">${driver.capacityOwnership === "自营" ? "【自营】" : "【三方】"}${driver.name} / ${driver.phone}${driver.capacityOwnership === "三方" ? ` / ${CapacityOwnership.organizationName(driver)}` : ""}${driver.id === editingDispatch?.driverId ? "（当前）" : ""}</option>`).join("");
  driverSelect.value = selectedDriverId;
  const vehicleOptions = [...availableVehicles, ...(currentVehicle && !availableVehicles.some((vehicle) => vehicle.plateNo === currentVehicle.plateNo) ? [currentVehicle] : [])];
  vehicleSelect.innerHTML = '<option value="">请选择车辆</option>' + CapacityOwnership.sortSelfFirst(vehicleOptions).map((vehicle) => `<option value="${vehicle.plateNo}">${vehicle.capacityOwnership === "自营" ? "【自营】" : "【三方】"}${vehicle.plateNo} / ${vehicle.vehicleType}${vehicle.capacityOwnership === "三方" ? ` / ${CapacityOwnership.organizationName(vehicle)}` : ""}${vehicle.plateNo === editingDispatch?.vehicleId ? "（当前）" : ""}</option>`).join("");
  vehicleSelect.value = vehicleOptions.some((vehicle) => vehicle.plateNo === currentVehicleId) ? currentVehicleId : "";
  populateDispatchTrailerOptions(editingDispatch, vehicles.find((vehicle) => vehicle.plateNo === vehicleSelect.value) || null);
  if (vehicleTypeSelect) {
    vehicleTypeSelect.disabled = false;
    vehicleTypeSelect.value = typeof getDispatchVehicleType === "function" ? getDispatchVehicleType(editingDispatch || {}) : (editingDispatch?.vehicleType || "燃油车");
  }
}

function getDispatchResourceOwnership(resource = {}) {
  const source = resource.capacityOwnership || resource.ownership || resource.driverType || (resource.supplierId || resource.supplierName ? "三方" : "自营");
  return CapacityOwnership.normalizeType(source);
}

function populateDispatchTrailerOptions(editingDispatch = null, vehicle = null) {
  const trailerSelect = document.querySelector("#dispatchTrailerSelect");
  if (!trailerSelect) return;
  const trailerList = typeof trailers !== "undefined" ? trailers : [];
  const trailerId = vehicle ? (vehicle.trailerId || "") : (editingDispatch?.trailerId || "");
  const currentTrailer = trailerId && trailerList.find((trailer) => trailer.id === trailerId);
  const selectedDriver = typeof drivers !== "undefined" ? drivers.find((driver) => driver.id === (dispatchForm.elements.driverId?.value || editingDispatch?.driverId)) : null;
  const ownerType = vehicle ? getDispatchResourceOwnership(vehicle) : (selectedDriver ? getDispatchResourceOwnership(selectedDriver) : "");
  const options = CapacityOwnership.sortSelfFirst(trailerList.filter((trailer) => !ownerType || getDispatchResourceOwnership(trailer) === ownerType));
  if (trailerId && !currentTrailer && !ownerType) options.unshift({ id: trailerId, plateNo: trailerId, trailerType: "当前挂车" });
  trailerSelect.innerHTML = '<option value="">未绑定挂车</option>' + options.map((trailer) => `<option value="${trailer.id}">${trailer.capacityOwnership === "自营" ? "【自营】" : "【三方】"}${trailer.plateNo} / ${trailer.trailerType}${trailer.capacityOwnership === "三方" ? ` / ${CapacityOwnership.organizationName(trailer)}` : ""}${trailer.id === trailerId ? "（当前）" : ""}</option>`).join("");
  trailerSelect.value = trailerId;
  trailerSelect.disabled = !vehicle && !editingDispatch;
}

function ensureDispatchDriverOption(driver) {
  const driverSelect = document.querySelector("#dispatchDriverSelect");
  if (!driverSelect || !driver) return;
  const hasOption = Array.from(driverSelect.options || []).some((option) => option.value === driver.id);
  if (!hasOption && typeof document.createElement === "function") {
    const option = document.createElement("option");
    option.value = driver.id;
    option.textContent = `${driver.name} / ${driver.phone}`;
    driverSelect.appendChild(option);
  }
  driverSelect.value = driver.id;
  if (typeof refreshDispatchCustomSelect === "function") refreshDispatchCustomSelect(driverSelect);
}

function syncDispatchVehicleAssignment() {
  const vehicleId = dispatchForm.elements.vehicleId?.value;
  const vehicle = typeof vehicles !== "undefined" ? vehicles.find((item) => item.plateNo === vehicleId) : null;
  const editingDispatch = dispatchForm.dispatchMode === "edit" && typeof dispatches !== "undefined" ? dispatches.find((item) => item.id === dispatchForm.editingDispatchId) : null;
  const driverSelect = document.querySelector("#dispatchDriverSelect");
  const driverName = String(vehicle?.driver || "").split("/")[0].trim();
  const vehicleDriver = typeof drivers !== "undefined" ? drivers.find((driver) => driver.name === driverName) : null;
  if (driverSelect) {
    if (vehicleDriver) ensureDispatchDriverOption(vehicleDriver);
    else driverSelect.value = "";
  }
  populateDispatchTrailerOptions(editingDispatch, vehicle);
}

const dispatchDriverSelect = document.querySelector("#dispatchDriverSelect");
if (typeof dispatchDriverSelect?.addEventListener === "function") dispatchDriverSelect.addEventListener("change", () => {
  const editingDispatch = dispatchForm.dispatchMode === "edit" && typeof dispatches !== "undefined" ? dispatches.find((item) => item.id === dispatchForm.editingDispatchId) : null;
  populateDispatchFormOptions(editingDispatch);
  if (typeof refreshDispatchCustomSelects === "function") refreshDispatchCustomSelects();
});

function populateDispatchEditableOptions(waybill, dispatch = null) {
  const projectSelect = document.querySelector("#dispatchProjectSelect");
  const routeSelect = document.querySelector("#dispatchRouteSelect");
  if (!projectSelect || !routeSelect) return;
  const projects = typeof routeAccountCatalog !== "undefined" ? routeAccountCatalog : [];
  const routes = typeof fixedRoutes !== "undefined" ? fixedRoutes : [];
  projectSelect.innerHTML = '<option value="">请选择项目</option>' + projects.map((item) => `<option value="${item.projectId}">${item.projectName}</option>`).join("");
  routeSelect.innerHTML = '<option value="">请选择线路</option>' + routes.map((item) => `<option value="${item.id}">${item.routeName}</option>`).join("");
  const routeId = dispatch?.routeId || waybill?.routeId || "";
  const projectId = dispatch?.projectId || waybill?.projectId || "";
  projectSelect.value = projectId;
  routeSelect.value = routeId;
}

function setDispatchEditableVisibility(isEditing) {
  const section = document.querySelector("#dispatchEditableSection");
  if (section) section.hidden = !isEditing;
  ["projectId", "routeId", "boxType", "boxNo1", "tempSealNo1", "railSealNo1", "seaSealNo1", "boxNo2", "tempSealNo2", "railSealNo2", "seaSealNo2"].forEach((name) => {
    const field = dispatchForm.elements[name];
    if (field) field.disabled = !isEditing;
  });
}

function getDispatchJobLocationDefaults(taskType, route = {}, currentLocations = []) {
  const profile = typeof window !== "undefined" ? window.DispatchTaskNodes?.profile?.(taskType) : null;
  const definitions = profile?.jobLocations || [];
  return definitions.map((location, index) => {
    const saved = currentLocations.find((item) => item.id === location.id || item.name === location.name);
    const label = location.name;
    const normalizedLabel = String(label).replace(/\s/g, "");
    let address = "";
    const routeLocation = (route.jobLocations || []).find((item) => item.id === location.id || item.name === location.name);
    if (routeLocation) address = routeLocation.address || "";
    else if (/提空/.test(normalizedLabel)) address = route.pickupPoint || route.origin || "";
    else if (/提重/.test(normalizedLabel)) address = route.origin || route.pickupPoint || "";
    else if (/装货/.test(normalizedLabel)) address = route.loadingPoint || route.destination || "";
    else if (/卸货/.test(normalizedLabel)) address = route.unloadingPoint || route.destination || "";
    else if (/落重|还空|还重|还箱|落箱/.test(normalizedLabel)) address = route.dropoffPoint || route.destination || "";
    else if (index === 0) address = route.pickupPoint || route.origin || "";
    else if (index === definitions.length - 1) address = route.dropoffPoint || route.destination || "";
    else address = route.loadingPoint || route.unloadingPoint || route.destination || "";
    return { id: location.id, name: label, address: saved?.address ?? address };
  });
}

function renderDispatchJobLocations(taskType, route, waybill, dispatch = null) {
  const container = typeof document !== "undefined" ? document.querySelector("#dispatchJobLocationFields") : null;
  if (!container) return [];
  const currentLocations = dispatch?.jobLocations || waybill?.jobLocations || [];
  const locations = getDispatchJobLocationDefaults(taskType, route || {}, currentLocations);
  container.innerHTML = locations.map((location, index) => `<label class="field"><span class="field-label">${dashboardEscape(location.name)}</span><input data-dispatch-job-location data-location-id="${dashboardEscape(location.id)}" data-location-name="${dashboardEscape(location.name)}" value="${dashboardEscape(location.address)}" maxlength="200" placeholder="请输入${dashboardEscape(location.name)}地址" aria-label="${dashboardEscape(location.name)}" /></label>`).join("");
  return locations;
}

function readDispatchJobLocations() {
  return [...(typeof document !== "undefined" ? document.querySelector("#dispatchJobLocationFields")?.querySelectorAll("[data-dispatch-job-location]") || [] : [])].map((field) => ({
    id: field.dataset.locationId,
    name: field.dataset.locationName,
    address: field.value.trim(),
  }));
}

function updateDispatchEditableFields(waybill, route, dispatch = null) {
  const projectSelect = document.querySelector("#dispatchProjectSelect");
  const routeSelect = document.querySelector("#dispatchRouteSelect");
  const boxTypeSelect = document.querySelector("#dispatchBoxTypeSelect");
  const values = {
    projectId: waybill?.projectId || route?.projectId || "",
    routeId: waybill?.routeId || route?.id || "",
    boxType: String(dispatch?.boxType || waybill?.boxType || "40HQ").replace(/\*\d+$/, ""),
    boxNo1: dispatch?.boxNo1 || waybill?.boxNo1 || "",
    tempSealNo1: dispatch?.tempSealNo1 ?? dispatch?.sealNo1 ?? waybill?.tempSealNo1 ?? waybill?.sealNo1 ?? "",
    railSealNo1: dispatch?.railSealNo1 || waybill?.railSealNo1 || "",
    seaSealNo1: dispatch?.seaSealNo1 || waybill?.seaSealNo1 || "",
    boxNo2: dispatch?.boxNo2 || waybill?.boxNo2 || "",
    tempSealNo2: dispatch?.tempSealNo2 ?? dispatch?.sealNo2 ?? waybill?.tempSealNo2 ?? waybill?.sealNo2 ?? "",
    railSealNo2: dispatch?.railSealNo2 || waybill?.railSealNo2 || "",
    seaSealNo2: dispatch?.seaSealNo2 || waybill?.seaSealNo2 || "",
  };
  const taskType = (typeof window !== "undefined" ? window.DispatchTaskNodes?.resolve?.(dispatch?.taskType || waybill?.taskType) : "") || dispatch?.taskType || waybill?.taskType || "";
  renderDispatchJobLocations(taskType, route, waybill, dispatch);
  if (projectSelect && !projectSelect.value) projectSelect.value = values.projectId;
  if (routeSelect && !routeSelect.value) routeSelect.value = values.routeId;
  if (boxTypeSelect) boxTypeSelect.value = values.boxType;
  ["boxNo1", "tempSealNo1", "railSealNo1", "seaSealNo1", "boxNo2", "tempSealNo2", "railSealNo2", "seaSealNo2"].forEach((name) => {
    const field = document.querySelector(`#dispatch${name[0].toUpperCase()}${name.slice(1)}`);
    if (field) field.value = values[name] === "-" ? "" : values[name];
  });
}

function updateDispatchRoutePreview(waybill, route) {
  document.querySelector("#dispatchRouteName").value = route ? `${route.routeCode} / ${route.routeName}` : "";
  document.querySelector("#dispatchOrigin").value = route?.pickupPoint || route?.origin || waybill?.loadAddress || "";
  document.querySelector("#dispatchDestination").value = route?.unloadingPoint || route?.loadingPoint || route?.destination || "";
  document.querySelector("#dispatchLoadAddress").value = route?.dropoffPoint || waybill?.returnPoint || route?.destination || "";
  document.querySelector("#dispatchBoxes").value = waybill ? formatWaybillBoxes(waybill) : "";
  document.querySelector("#dispatchPlannedBerthingTime").value = waybill ? String(waybill.plannedBerthingTime || waybill.executionTime || "").replace("T", " ").slice(0, 16) : "";
  document.querySelector("#dispatchRevenue").value = route ? formatMoney(route.estimatedRevenue) : "";
  document.querySelector("#dispatchCommission").value = route ? formatMoney(calculateRouteCommission(route)) : "";
}

function updateDispatchFormFromWaybill() {
  const waybill = waybills.find((item) => item.waybillNo === dispatchForm.elements.waybillId.value);
  const route = waybill ? getRouteForWaybill(waybill.waybillNo) : null;
  dispatchForm.elements.driverId.value = "";
  dispatchForm.elements.vehicleId.value = "";
  dispatchForm.elements.driverId.disabled = !waybill;
  dispatchForm.elements.vehicleId.disabled = !waybill;
  const trailerSelect = document.querySelector("#dispatchTrailerSelect");
  if (trailerSelect) trailerSelect.disabled = !waybill || !dispatchForm.elements.vehicleId.value;
  const vehicleTypeSelect = document.querySelector("#dispatchVehicleTypeSelect");
  if (vehicleTypeSelect) {
    vehicleTypeSelect.disabled = !waybill;
    if (waybill && !vehicleTypeSelect.value) vehicleTypeSelect.value = "燃油车";
  }
  updateDispatchRoutePreview(waybill, route);
  updateDispatchEditableFields(waybill, route);
  if (typeof refreshDispatchCustomSelects === "function") refreshDispatchCustomSelects();
}

function openDispatchForm() {
  dispatchDialog.dataset.presentation = "page";
  dispatchDialog.dataset.breadcrumb = "计划与派单 / 派单列表 / 新建派单";
  dispatchForm.dispatchMode = "create";
  dispatchForm.editingDispatchId = "";
  dispatchForm.reset();
  populateDispatchFormOptions();
  setDispatchEditableVisibility(false);
  dispatchForm.elements.waybillId.value = "";
  document.querySelector("#dispatchFormTitle").textContent = "新建派单";
  document.querySelector("#dispatchFormDescription").textContent = "选择已有运单，维护项目、线路、箱封号、运力及到达信息，提交后推送至司机微信小程序";
  document.querySelector("#dispatchPushTitle").textContent = "提交派单后自动推送";
  document.querySelector("#dispatchPushDescription").textContent = "司机将在微信小程序收到运单、线路、箱信息和节点上报任务。";
  document.querySelector("#dispatchSubmitBtn").textContent = "派单并推送";
  updateDispatchFormFromWaybill();
  if (typeof refreshDispatchCustomSelects === "function") refreshDispatchCustomSelects();
  dispatchDialog.showModal();
}

function openDispatchEdit(dispatchId) {
  const dispatch = dispatches.find((item) => item.id === dispatchId);
  if (!dispatch || !["待派单", "已派单", "运输中"].includes(dispatch.status)) return;
  dispatchDialog.dataset.presentation = "drawer";
  dispatchDialog.dataset.breadcrumb = "";
  dispatchForm.dispatchMode = "edit";
  dispatchForm.editingDispatchId = dispatch.id;
  dispatchForm.reset();
  populateDispatchFormOptions(dispatch);
  setDispatchEditableVisibility(true);
  dispatchForm.elements.waybillId.value = dispatch.waybillNo;
  dispatchForm.elements.driverId.disabled = false;
  dispatchForm.elements.vehicleId.disabled = false;
  updateDispatchFormFromWaybill();
  dispatchForm.elements.driverId.value = dispatch.driverId || "";
  dispatchForm.elements.vehicleId.value = dispatch.vehicleId || "";
  syncDispatchVehicleAssignment();
  const waybill = waybills.find((item) => item.waybillNo === dispatch.waybillNo);
  populateDispatchEditableOptions(waybill, dispatch);
  updateDispatchEditableFields(waybill, fixedRoutes.find((item) => item.id === (dispatch.routeId || waybill?.routeId)), dispatch);
  const vehicleTypeSelect = document.querySelector("#dispatchVehicleTypeSelect");
  if (vehicleTypeSelect) vehicleTypeSelect.value = getDispatchVehicleType(dispatch);
  if (typeof refreshDispatchCustomSelects === "function") refreshDispatchCustomSelects();
  if (dispatchForm.elements.consignee) dispatchForm.elements.consignee.value = dispatch.consignee || "";
  if (dispatchForm.elements.arrivalTime) dispatchForm.elements.arrivalTime.value = String(dispatch.arrivalTime || "").replace(" ", "T").slice(0, 16);
  if (dispatchForm.elements.arrivalLocation) dispatchForm.elements.arrivalLocation.value = dispatch.arrivalLocation || "";
  if (dispatchForm.elements.note) dispatchForm.elements.note.value = dispatch.note || "";
  document.querySelector("#dispatchFormTitle").textContent = "编辑派单";
  document.querySelector("#dispatchFormDescription").textContent = "修改项目、线路、箱封号、运力及到达信息，保存后同步司机微信小程序";
  document.querySelector("#dispatchPushTitle").textContent = "保存后同步派单变更";
  document.querySelector("#dispatchPushDescription").textContent = dispatch.status === "运输中" ? "运输中的派单也可调整运力，变更记录会写入运输节点时间线。" : "司机将在微信小程序收到最新的司机、车辆和任务安排。";
  document.querySelector("#dispatchSubmitBtn").textContent = "保存更改并推送";
  dispatchDialog.showModal();
}

function closeDispatchForm() {
  if (dispatchDialog.open) dispatchDialog.close();
  dispatchDialog.dataset.presentation = "page";
  dispatchDialog.dataset.breadcrumb = "计划与派单 / 派单列表 / 新建派单";
  dispatchForm.dispatchMode = "create";
  dispatchForm.editingDispatchId = "";
  dispatchForm.reset();
  dispatchForm.elements.waybillId.value = "";
  dispatchForm.elements.waybillId.disabled = false;
  setDispatchEditableVisibility(false);
  document.querySelector("#dispatchFormTitle").textContent = "新建派单";
  document.querySelector("#dispatchFormDescription").textContent = "选择已有运单，维护项目、线路、箱封号、运力及到达信息，提交后推送至司机微信小程序";
  document.querySelector("#dispatchPushTitle").textContent = "提交派单后自动推送";
  document.querySelector("#dispatchPushDescription").textContent = "司机将在微信小程序收到运单、线路、箱信息和节点上报任务。";
  document.querySelector("#dispatchSubmitBtn").textContent = "派单并推送";
  updateDispatchFormFromWaybill();
  if (typeof refreshDispatchCustomSelects === "function") refreshDispatchCustomSelects();
}

function dispatchPhotoMeta(photo, fallbackCapturedAt = "") {
  if (photo && typeof photo === "object") {
    return {
      id: photo.id || photo.photoId || photo.key || "",
      name: photo.name || photo.fileName || photo.label || "现场图片",
      src: photo.src || photo.url || photo.dataUrl || photo.preview || "",
      note: photo.note || "节点上传图片",
      capturedAt: [photo.capturedAt, photo.takenAt, photo.uploadedAt, photo.createdAt].find((value) => formatDispatchPhotoTime(value) !== "-") || fallbackCapturedAt,
    };
  }
  const value = String(photo || "现场图片");
  return { name: value, src: /^(data:image\/|https?:\/\/|blob:)/i.test(value) ? value : "", note: "节点上传图片", capturedAt: fallbackCapturedAt };
}

function formatDispatchPhotoTime(value) {
  const match = String(value || "").replace("T", " ").match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
  return match ? match[1] : "-";
}

function dispatchPhotoWatermark(dispatch, capturedAt) {
  return {
    dispatchId: dispatch.id || "派单样例",
    driver: dispatch.driverName && dispatch.driverName !== "待分配" ? dispatch.driverName : "司机样例",
    vehicle: dispatch.vehicleId && dispatch.vehicleId !== "待分配" ? dispatch.vehicleId : "",
    time: formatDispatchPhotoTime(capturedAt),
  };
}

function renderDispatchPhotoGallery(item, dispatch) {
  const photos = Array.isArray(item.photoAttachments) && item.photoAttachments.length
    ? item.photoAttachments
    : Array.isArray(item.photos) ? item.photos : [];
  if (!photos.length) return '<div class="dispatch-node-empty"><i data-lucide="image-off" aria-hidden="true"></i><span>该节点未上传图片</span></div>';
  const cards = photos.map((photo) => {
    const meta = dispatchPhotoMeta(photo, item.time);
    meta.watermark = dispatchPhotoWatermark(dispatch, meta.capturedAt);
    const index = dispatchDetailPhotoTargets.push(meta) - 1;
    const hasImage = Boolean(meta.src || meta.id);
    return `<button class="dispatch-photo-card ${hasImage ? "has-preview" : "file-only"}" data-dispatch-photo-index="${index}" type="button"><span class="dispatch-photo-thumb">${meta.src ? `<img src="${dashboardEscape(meta.src)}" alt="${dashboardEscape(meta.name)}" />` : '<i data-lucide="image" aria-hidden="true"></i>'}<em>水印</em></span><span class="dispatch-photo-copy"><strong>${dashboardEscape(meta.name)}</strong><small>拍照时间 ${dashboardEscape(formatDispatchPhotoTime(meta.capturedAt))}</small></span></button>`;
  }).join("");
  return `<div class="dispatch-photo-gallery">${cards}</div>`;
}

function dispatchPhotoRequirements(dispatch, taskType = window.DispatchTaskNodes.resolve(dispatch.taskType)) {
  if (Array.isArray(dispatch.taskConfigSnapshot?.nodes)) {
    return dispatch.taskConfigSnapshot.nodes.flatMap((node) => node.photoRequirements || []);
  }
  return Array.isArray(dispatch.photoRequirements)
    ? dispatch.photoRequirements
    : window.PhotoRequirementConfig?.forTaskType?.(taskType) || [];
}

function renderDispatchPhotoRequirementList(dispatch, taskType) {
  const requirements = dispatchPhotoRequirements(dispatch, taskType);
  if (!requirements.length) {
    return `<section class="dispatch-detail-panel dispatch-photo-requirements-panel"><div class="dispatch-detail-panel-title"><i data-lucide="camera" aria-hidden="true"></i><div><h3>拍照要求与照片</h3><span>${dashboardEscape(taskType)} · 暂无配置要求</span></div></div><div class="dispatch-photo-requirements-empty">该任务类型暂无拍照要求。</div></section>`;
  }
  const attachments = (dispatch.timeline || []).flatMap((item) => (item.photoAttachments || []).map((photo) => ({ ...photo, nodeTime: item.time })));
  const legacyPhotos = (dispatch.timeline || []).filter((item) => !(item.photoAttachments || []).length).flatMap((item) => item.photos || []).filter((item) => typeof item === "string");
  const totalRequired = requirements.reduce((total, requirement) => total + Number(requirement.quantity || 0), 0);
  const totalUploaded = requirements.reduce((total, requirement) => total + attachments.filter((photo) => photo.requirementId === requirement.id || (!photo.requirementId && (photo.requirementName || photo.label) === requirement.name)).length + legacyPhotos.filter((photo) => photo.startsWith(`${requirement.name}：`) || photo === requirement.name).length, 0);
  const rows = requirements.map((requirement) => {
    const matched = attachments.filter((photo) => photo.requirementId === requirement.id || (!photo.requirementId && (photo.requirementName || photo.label) === requirement.name));
    const oldNames = legacyPhotos.filter((photo) => photo.startsWith(`${requirement.name}：`) || photo === requirement.name);
    const uploaded = matched.length + oldNames.length;
    const photoCells = matched.map((photo) => {
      const capturedAt = [photo.capturedAt, photo.takenAt, photo.uploadedAt, photo.nodeTime].find((value) => formatDispatchPhotoTime(value) !== "-") || "";
      const index = dispatchDetailPhotoTargets.push({ id: photo.id, name: photo.name || photo.requirementName || photo.label || requirement.name, note: requirement.name, capturedAt, watermark: dispatchPhotoWatermark(dispatch, capturedAt) }) - 1;
      return `<button class="dispatch-requirement-photo" data-dispatch-photo-index="${index}" type="button"><i data-lucide="image" aria-hidden="true"></i><span>${dashboardEscape(photo.name || photo.requirementName || photo.label || requirement.name)}</span></button>`;
    }).join("");
    const legacyCells = oldNames.map((name) => `<span class="dispatch-requirement-photo file-only"><i data-lucide="file-image" aria-hidden="true"></i><span>${dashboardEscape(name.replace(`${requirement.name}：`, "") || requirement.name)}</span></span>`).join("");
    const state = uploaded >= requirement.quantity ? `<em class="dispatch-requirement-state complete">${uploaded}/${requirement.quantity} 张</em>` : `<em class="dispatch-requirement-state pending">${uploaded}/${requirement.quantity} 张</em>`;
    return `<tr><td><strong>${dashboardEscape(requirement.name)}</strong></td><td><span class="dispatch-requirement-description">${dashboardEscape(requirement.description || "-")}</span></td><td>${state}</td><td><div class="dispatch-requirement-photos">${photoCells || legacyCells || `<span class="dispatch-requirement-photo-empty">尚未上传</span>`}</div></td></tr>`;
  }).join("");
  return `<section class="dispatch-detail-panel dispatch-photo-requirements-panel"><div class="dispatch-detail-panel-title"><i data-lucide="camera" aria-hidden="true"></i><div><h3>拍照要求与照片</h3><span>${dashboardEscape(taskType)} · 已上传 ${totalUploaded}/${totalRequired} 张</span></div></div><div class="dispatch-photo-requirement-table-wrap"><table class="dispatch-photo-requirement-table"><thead><tr><th>拍照要求</th><th>拍摄说明</th><th>数量 / 状态</th><th>对应照片</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function getDispatchDetailSampleNodes(dispatch, taskType) {
  const nodes = dispatch.taskConfigSnapshot?.nodes?.map((node) => node.name) || window.DispatchTaskNodes.get(taskType);
  const currentIndex = dispatch.status === "已完成"
    ? nodes.length - 1
    : dispatch.status === "运输中"
      ? Math.min(3, nodes.length - 1)
      : ["已派单", "已接单"].includes(dispatch.status)
        ? 0
        : -1;
  const photoSamples = [
    { name: "集装箱现场样例.jpg", src: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=960&q=80", note: "后台展示样例图片 · 非真实派单资料" },
    { name: "运输现场样例.jpg", src: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=960&q=80", note: "后台展示样例图片 · 非真实派单资料" },
  ];

  return nodes.map((node, index) => {
    const state = dispatch.status === "取消" ? "cancelled" : index < currentIndex ? "completed" : index === currentIndex ? "current" : "upcoming";
    const hasSampleContent = state === "completed" || state === "current";
    const photo = hasSampleContent && (index === 0 || index === currentIndex) ? photoSamples[index % photoSamples.length] : null;
    return {
      node,
      state,
      time: hasSampleContent ? `2026-04-12 ${String(8 + index).padStart(2, "0")}:${index % 2 ? "20" : "05"}` : "待执行",
      desc: hasSampleContent ? `测试内容：${node}节点已完成，现场情况正常，作业记录已留存。` : "等待运输任务推进至此节点。",
      photos: photo ? [photo] : [],
    };
  });
}

function renderDispatchDetailPage(dispatchId) {
  const dispatch = dispatches.find((item) => item.id === dispatchId);
  if (!dispatch || !dispatchDetailPageContent) return;
  const waybill = waybills.find((item) => item.waybillNo === dispatch.waybillNo);
  const taskType = window.DispatchTaskNodes.resolve(dispatch.taskType || waybill?.taskType);
  const route = fixedRoutes.find((item) => item.id === (dispatch.routeId || waybill?.routeId));
  const jobLocations = dispatch.jobLocations?.length ? dispatch.jobLocations : waybill?.jobLocations?.length ? waybill.jobLocations : getDispatchJobLocationDefaults(taskType, route || {}, []);
  const modeLabel = { auto: "自动派单", manual: "手动派单", pending: "待分配" }[getDispatchMode(dispatch)] || "待分配";
  const timeline = getDispatchDetailSampleNodes(dispatch, taskType);
  const currentNode = timeline.find((item) => item.state === "current")?.node || (dispatch.status === "已完成" ? timeline.at(-1)?.node : "待执行");
  dispatchDetailPhotoTargets = [];
  dispatchDetailPageSubtitle.textContent = `${dispatch.waybillNo || "-"} · ${dispatch.routeName || "未指定线路"}`;
  if (dispatchDetailEditBtn) dispatchDetailEditBtn.hidden = !["待派单", "已派单", "运输中"].includes(dispatch.status);
  dispatchDetailPageContent.innerHTML = `
    <section class="dispatch-detail-hero">
      <div class="dispatch-detail-hero-main"><span class="dispatch-detail-kicker">派单编号 ${dashboardEscape(dispatch.id || "-")}</span><div><h3>${dashboardEscape(dispatch.waybillNo || "-")}</h3><span class="dispatch-status ${getDispatchStatusClass(dispatch.status)}">${dashboardEscape(dispatch.status || "待派单")}</span></div><p>${dashboardEscape(dispatch.routeName || "未指定线路")} · ${dashboardEscape(taskType)}</p></div>
      <div class="dispatch-detail-hero-metrics"><div><span>当前节点</span><strong>${dashboardEscape(currentNode)}</strong></div><div><span>派单时间</span><strong>${dashboardEscape(dispatch.dispatchTime || "-")}</strong></div><div><span>消息推送</span><strong class="push-success">${dispatch.pushed ? "已推送小程序" : "待推送"}</strong></div></div>
    </section>
    <div class="dispatch-detail-page-grid">
      <div class="dispatch-detail-page-main">
        <section class="dispatch-detail-panel"><div class="dispatch-detail-panel-title"><i data-lucide="file-text" aria-hidden="true"></i><div><h3>运单信息</h3><span>任务与线路基础资料</span></div></div><div class="dispatch-detail-field-grid"><div><span>运单号</span><strong>${dashboardEscape(dispatch.waybillNo || "-")}</strong></div><div><span>计划任务编号</span><strong>${dashboardEscape(dispatch.planTaskNo || waybill?.planTaskNo || "-")}</strong></div><div><span>客户 / 项目</span><strong>${dashboardEscape([dispatch.customerName, dispatch.projectName].filter(Boolean).join(" / ") || "-")}</strong></div><div><span>任务类型</span><strong>${dashboardEscape(taskType)}</strong></div><div><span>派单方式</span><strong>${modeLabel}</strong></div><div><span>箱信息</span><strong>${dashboardEscape(dispatch.boxes || formatWaybillBoxes(waybill || {}) || "-")}</strong></div><div><span>收货人</span><strong>${dashboardEscape(dispatch.consignee || "-")}</strong></div><div><span>到达时间</span><strong>${dashboardEscape(dispatch.arrivalTime || "-")}</strong></div><div><span>到达地点</span><strong>${dashboardEscape(dispatch.arrivalLocation || "-")}</strong></div><div class="wide"><span>备注</span><strong>${dashboardEscape(dispatch.note || "-")}</strong></div></div></section>
        <section class="dispatch-detail-panel"><div class="dispatch-detail-panel-title"><i data-lucide="truck" aria-hidden="true"></i><div><h3>运力与结算</h3><span>司机、车辆及本次派单金额</span></div></div><div class="dispatch-detail-field-grid"><div><span>运力归属</span><strong>${CapacityOwnership.badgeMarkup(dispatch.capacityOwnershipSnapshot, dispatch.capacityOwnershipTooltipSnapshot)}</strong></div><div><span>承运单位</span><strong>${dashboardEscape(organizationDisplayName(dispatch.carrierUnitSnapshot, "待确定"))}</strong></div><div><span>司机</span><strong>${dashboardEscape(dispatch.driverName || "待分配")}</strong></div><div><span>司机归属 / 所属单位</span><strong>${CapacityOwnership.badgeMarkup(dispatch.capacityOwnershipDetailSnapshot?.find((item) => item.role === "司机")?.type || dispatch.capacityOwnershipSnapshot, dispatch.capacityOwnershipTooltipSnapshot)} ${dashboardEscape(organizationDisplayName(dispatch.driverOrganizationSnapshot, "待确定"))}</strong></div><div><span>联系电话</span><strong>${dashboardEscape(dispatch.phone || "-")}</strong></div><div><span>车牌</span><strong>${dashboardEscape(dispatch.vehicleId || "待分配")}</strong></div><div><span>车辆归属 / 所属单位</span><strong>${CapacityOwnership.badgeMarkup(dispatch.capacityOwnershipDetailSnapshot?.find((item) => item.role === "车辆")?.type || dispatch.capacityOwnershipSnapshot, dispatch.capacityOwnershipTooltipSnapshot)} ${dashboardEscape(organizationDisplayName(dispatch.vehicleOrganizationSnapshot, "待确定"))}</strong></div><div><span>车型 / 挂车</span><strong>${dashboardEscape([getDispatchVehicleType(dispatch), dispatch.trailerId].filter(Boolean).join(" / ") || "-")}</strong></div><div><span>挂车归属 / 所属单位</span><strong>${CapacityOwnership.badgeMarkup(dispatch.capacityOwnershipDetailSnapshot?.find((item) => item.role === "挂车")?.type || dispatch.capacityOwnershipSnapshot, dispatch.capacityOwnershipTooltipSnapshot)} ${dashboardEscape(organizationDisplayName(dispatch.trailerOrganizationSnapshot, "未绑定"))}</strong></div><div><span>预估收入</span><strong class="money-value">${formatMoney(dispatch.estimatedRevenue || 0)}</strong></div><div><span>司机提成</span><strong>${formatMoney(dispatch.commission || 0)}</strong></div></div></section>
        <section class="dispatch-detail-panel dispatch-route-panel"><div class="dispatch-detail-panel-title"><i data-lucide="route" aria-hidden="true"></i><div><h3>作业地点</h3><span>${dashboardEscape(taskType)} · ${jobLocations.length} 个地点</span></div></div><div class="dispatch-job-location-detail">${jobLocations.map((location) => `<div><span>${dashboardEscape(location.name)}：</span><strong>${dashboardEscape(location.address || "待填写")}</strong></div>`).join("")}</div></section>
      </div>
      <aside class="dispatch-detail-page-side"><section class="dispatch-detail-panel dispatch-timeline-panel"><div class="dispatch-detail-panel-title"><i data-lucide="history" aria-hidden="true"></i><div><h3>运输节点</h3><span>${timeline.length} 个任务节点 · 后台测试数据</span></div></div><div class="dispatch-detail-timeline">${timeline.map((item) => `<article class="dispatch-node-card ${item.state}"><span class="dispatch-node-dot" aria-hidden="true"></span><div class="dispatch-node-card-head"><div><strong>${dashboardEscape(item.node)}</strong><span>${dashboardEscape(item.time)}</span></div><em>${item.state === "current" ? "进行中" : item.state === "completed" ? "已完成" : item.state === "cancelled" ? "已取消" : "待执行"}</em></div><p>${dashboardEscape(item.desc)}</p>${item.photos.length ? renderDispatchPhotoGallery(item, dispatch) : ""}</article>`).join("")}</div></section></aside>
    </div>
    ${renderDispatchPhotoRequirementList(dispatch, taskType)}`;
  window.lucide?.createIcons();
}

function openDispatchDetail(dispatchId) {
  if (!dispatches.some((item) => item.id === dispatchId)) return;
  currentDispatchDetailId = dispatchId;
  switchPage("dispatch-detail");
  window.scrollTo?.({ top: 0, behavior: "smooth" });
}

async function openDispatchPhotoPreview(index) {
  const target = dispatchDetailPhotoTargets[Number(index)];
  if (!target || !dispatchPhotoPreviewDialog) return;
  let previewSrc = target.src;
  if (dispatchPhotoPreviewObjectUrl) {
    URL.revokeObjectURL(dispatchPhotoPreviewObjectUrl);
    dispatchPhotoPreviewObjectUrl = "";
  }
  if (!previewSrc && target.id && window.DispatchStore?.getPhoto) {
    try {
      const blob = await window.DispatchStore.getPhoto(target.id);
      if (blob) {
        dispatchPhotoPreviewObjectUrl = URL.createObjectURL(blob);
        previewSrc = dispatchPhotoPreviewObjectUrl;
      }
    } catch (error) {
      console.warn("派单图片读取失败。", error);
    }
  }
  dispatchPhotoPreviewTitle.textContent = target.name;
  const photoTime = formatDispatchPhotoTime(target.capturedAt);
  const watermark = target.watermark || { dispatchId: currentDispatchDetailId, driver: "司机", vehicle: "", time: photoTime };
  dispatchPhotoPreviewMeta.textContent = `${target.note || "节点上传图片"} · 拍照时间 ${photoTime}`;
  dispatchPhotoPreviewBody.innerHTML = previewSrc
    ? `<div class="dispatch-photo-preview-frame"><img src="${dashboardEscape(previewSrc)}" alt="${dashboardEscape(target.name)}" /><div class="dispatch-photo-watermark"><strong>${dashboardEscape(watermark.dispatchId)}</strong><span>${dashboardEscape([watermark.driver, watermark.vehicle, watermark.time].filter(Boolean).join(" · "))}</span></div></div>`
    : `<div class="dispatch-photo-preview-empty"><i data-lucide="image-off" aria-hidden="true"></i><strong>暂无可预览的图片内容</strong><span>系统当前仅收到文件名：${dashboardEscape(target.name)}</span></div>`;
  window.lucide?.createIcons();
  dispatchPhotoPreviewDialog.showModal();
}

function requestRevokeDispatch(dispatchId) {
  const dispatch = dispatches.find((item) => item.id === dispatchId);
  if (!dispatch || !["待派单", "已派单"].includes(dispatch.status)) return;
  deletingDispatchId = dispatchId;
  document.querySelector("#revokeDispatchText").textContent = `确认撤销 ${dispatch.waybillNo} 的派单吗？司机小程序单据将同步回收。`;
  document.querySelector("#revokeDispatchReason").value = "";
  document.querySelector("#revokeDispatchReasonError").textContent = "";
  revokeDispatchDialog.showModal();
  setTimeout(() => document.querySelector("#revokeDispatchReason")?.focus(), 0);
}

function closeRevokeDispatchDialog() {
  if (revokeDispatchDialog.open) revokeDispatchDialog.close();
  document.querySelector("#revokeDispatchReason").value = "";
  document.querySelector("#revokeDispatchReasonError").textContent = "";
  deletingDispatchId = "";
}

function openDispatchOperationLog(dispatchId, trigger) {
  globalThis.DispatchOperationLogManager?.open(dispatches, dispatchId, trigger);
}

function revokeDispatch(dispatchId) {
  const dispatch = dispatches.find((item) => item.id === dispatchId);
  if (!dispatch) return;
  const reason = document.querySelector("#revokeDispatchReason").value.trim();
  if (!reason) {
    document.querySelector("#revokeDispatchReasonError").textContent = "请填写撤销原因。";
    document.querySelector("#revokeDispatchReason").focus();
    return;
  }
  const previousStatus = dispatch.status;
  const previousNode = dispatch.currentNode;
  const operationTime = window.DispatchStore.nowText();
  dispatch.status = "取消";
  dispatch.currentNode = "待派单";
  dispatch.timeline.push({ node: "取消", time: operationTime, desc: `调度员撤销派单并回收小程序单据，原因：${reason}`, photos: [] });
  const timelineIndex = dispatch.timeline.length - 1;
  globalThis.DispatchOperationLog?.record(dispatch, {
    signature: `timeline:${timelineIndex}:${operationTime}:取消`,
    time: operationTime,
    category: "dispatch",
    action: "撤销派单",
    summary: `撤销运单 ${dispatch.waybillNo} 的派单，原因：${reason}`,
    operatorName: "张调度",
    operatorAccount: "zhangdd",
    operatorRole: "调度员",
    source: "运营后台",
    reason,
    changes: [
      { field: "status", label: "派单状态", before: previousStatus, after: "取消" },
      { field: "node", label: "运输节点", before: previousNode, after: "待派单" },
    ],
  });
  syncDriverOperationalStates();
  saveDispatches();
  closeRevokeDispatchDialog();
  renderDispatchPage(getFilteredDispatches());
  renderDriverPage(getFilteredDrivers());
}

function switchModule(moduleName) {
  const target = moduleName || "archives";
  const vehiclePage = document.querySelector("#vehiclePage");
  vehiclePage.querySelectorAll(".detail-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.module === target);
  });
  vehiclePage.querySelectorAll(".vehicle-module").forEach((module) => {
    module.classList.toggle("active", module.id === `${target}Module`);
  });
}

function openVehicleDetail(plateNo, moduleName = "detailBase") {
  const vehicle = vehicles.find((item) => item.plateNo === plateNo) || vehicles[0];
  selectedVehicle = vehicle;
  renderVehiclePage(filterVehicles(new FormData(document.querySelector("#vehicleQueryForm"))), getWarningDays());
  document.querySelector("#vehiclePage").classList.add("detail-mode");
  document.querySelector("#vehicleDetailPanel").classList.add("open");
  closeVehicleForm();
  switchModule(moduleName);
  document.querySelector("#vehicleDetailPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeVehicleDetail() {
  document.querySelector("#vehiclePage").classList.remove("detail-mode");
  document.querySelector("#vehicleDetailPanel").classList.remove("open");
  switchModule("archives");
}

function formatDashboardDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function shiftDashboardDate(dateText, days) {
  const date = new Date(`${dateText}T12:00:00`);
  date.setDate(date.getDate() + days);
  return formatDashboardDate(date);
}

function dashboardDateDifference(dateText, baseDateText) {
  const date = new Date(`${dateText}T12:00:00`);
  const baseDate = new Date(`${baseDateText}T12:00:00`);
  return Math.round((date - baseDate) / 86400000);
}

const dashboardToday = formatDashboardDate(new Date());
const dashboardDataDate = "2026-09-16";
const dashboardDateRanges = {
  yesterday: { label: "昨日", days: 1, endOffset: -1 },
  today: { label: "今日", days: 1, endOffset: 0 },
  last7: { label: "近7天", days: 7, endOffset: 0 },
  month: { label: "近一月", days: 30, endOffset: 0 },
};
const dashboardPlanRecords = [
  { customerId: "KH-HM", customerName: "华贸", projectId: "PR-HM-BYD", projectName: "比亚迪", routeId: "XL-001", planned: 2, completed: 0, monthAmount: 78650, totalAmount: 962400 },
  { customerId: "KH-LG", customerName: "陆港多联", projectId: "PR-LG-TH", projectName: "提箱装货", routeId: "XL-002", planned: 1, completed: 0, monthAmount: 96480, totalAmount: 1285600 },
  { customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X387", projectName: "X387", routeId: "XL-003", planned: 1, completed: 1, monthAmount: 61200, totalAmount: 884700 },
  { customerId: "KH-ZT", customerName: "中铁联集项目", projectId: "PR-ZT-X8588", projectName: "X8588", routeId: "XL-004", planned: 1, completed: 0, monthAmount: 50160, totalAmount: 710000 },
];
const dashboardTaskNodeSequences = Object.freeze({
  "提空装货": ["已提空", "空箱在途", "到达仓库", "完成装货", "重箱在途", "重箱进站", "完成落重"],
  "提重送货": ["已提重", "重箱在途", "到达仓库", "完成卸货", "空箱在途", "空箱进站", "完成落空"],
  "排空箱（A→B）": ["已提空", "空箱在途", "完成落空"],
  "排重箱（A→B）": ["已提重", "重箱在途", "箱进站", "完成落重"],
});
const dashboardTaskStages = ["待开始", ...new Set(Object.values(dashboardTaskNodeSequences).flat())];
let dashboardAmountDimension = "customer";
let dashboardCapacityFilter = null;

function getDashboardDateRange() {
  const key = document.querySelector("#dashboardDateRange")?.value || "today";
  const profile = dashboardDateRanges[key] || dashboardDateRanges.today;
  const end = shiftDashboardDate(dashboardToday, profile.endOffset);
  return { key, ...profile, start: shiftDashboardDate(end, 1 - profile.days), end };
}

function getDashboardDateLabel(range = getDashboardDateRange()) {
  return range.start === range.end ? range.end.slice(5) : `${range.start.slice(5)} 至 ${range.end.slice(5)}`;
}

function dashboardEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function dashboardSetOptions(select, options, placeholder) {
  if (!select) return;
  const current = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>` + options.map((item) => `<option value="${dashboardEscape(item.value)}">${dashboardEscape(item.label)}</option>`).join("");
  select.value = options.some((item) => item.value === current) ? current : "";
}

function populateDashboardFilters() {
  const customerSelect = document.querySelector("#dashboardCustomerFilter");
  const projectSelect = document.querySelector("#dashboardProjectFilter");
  const routeSelect = document.querySelector("#dashboardRouteFilter");
  const thresholdSelect = document.querySelector("#dashboardNearCompleteThreshold");
  if (thresholdSelect && !thresholdSelect.dataset.ready) {
    const savedThreshold = localStorage.getItem("container-logistics-dashboard-near-complete") || "70";
    if ([...thresholdSelect.options].some((option) => option.value === savedThreshold)) thresholdSelect.value = savedThreshold;
    thresholdSelect.dataset.ready = "true";
  }
  const customers = [...new Map(dashboardPlanRecords.map((item) => [item.customerId, { value: item.customerId, label: item.customerName }])).values()];
  dashboardSetOptions(customerSelect, customers, "全部客户");
  const projectRows = dashboardPlanRecords.filter((item) => !customerSelect.value || item.customerId === customerSelect.value);
  const projects = [...new Map(projectRows.map((item) => [item.projectId, { value: item.projectId, label: item.projectName }])).values()];
  dashboardSetOptions(projectSelect, projects, "全部项目");
  const routeRows = projectRows.filter((item) => !projectSelect.value || item.projectId === projectSelect.value);
  const routes = routeRows.map((item) => {
    const route = fixedRoutes.find((candidate) => candidate.id === item.routeId);
    return { value: item.routeId, label: route?.routeName || item.routeId };
  });
  dashboardSetOptions(routeSelect, routes, "全部线路");
}

function getDashboardFilters() {
  return {
    dateRange: getDashboardDateRange(),
    customerId: document.querySelector("#dashboardCustomerFilter")?.value || "",
    projectId: document.querySelector("#dashboardProjectFilter")?.value || "",
    routeId: document.querySelector("#dashboardRouteFilter")?.value || "",
  };
}

function getDashboardPlanRows(filters = getDashboardFilters()) {
  const periodDays = filters.dateRange?.days || 1;
  return dashboardPlanRecords.filter((item) =>
    (!filters.customerId || item.customerId === filters.customerId) &&
    (!filters.projectId || item.projectId === filters.projectId) &&
    (!filters.routeId || item.routeId === filters.routeId)
  ).map((item) => ({ ...item, planned: item.planned * periodDays, completed: item.completed * periodDays }));
}

function getDashboardTaskContext(dispatch) {
  const waybill = waybills.find((item) => item.waybillNo === dispatch.waybillNo);
  const plan = dashboardPlanRecords.find((item) => item.routeId === dispatch.routeId && (!waybill?.customerId || item.customerId === waybill.customerId))
    || dashboardPlanRecords.find((item) => item.routeId === dispatch.routeId);
  return { waybill, plan };
}

function getDashboardDispatchDate(dispatch) {
  const sourceDate = dispatch.orderDate
    || String(dispatch.dispatchTime || "").slice(0, 10)
    || String(dispatch.timeline?.[0]?.time || "").slice(0, 10);
  if (!sourceDate) return "";
  if (dispatchSeed.some((item) => item.id === dispatch.id)) {
    return shiftDashboardDate(dashboardToday, dashboardDateDifference(sourceDate, dashboardDataDate));
  }
  return sourceDate;
}

function isDashboardToday(dispatch) {
  const dispatchDate = getDashboardDispatchDate(dispatch);
  const range = getDashboardDateRange();
  return Boolean(dispatchDate && dispatchDate >= range.start && dispatchDate <= range.end);
}

function getDashboardTasks(filters = getDashboardFilters()) {
  return dispatches.filter((dispatch) => {
    if (!isDashboardToday(dispatch) || dispatch.status === "取消") return false;
    const { plan } = getDashboardTaskContext(dispatch);
    return (!filters.customerId || plan?.customerId === filters.customerId) &&
      (!filters.projectId || plan?.projectId === filters.projectId) &&
      (!filters.routeId || dispatch.routeId === filters.routeId);
  });
}

function getDashboardVehicleState(vehicle) {
  if (vehicle.vehicleState === "维修中") return "maintenance";
  if (vehicle.vehicleState !== "在用") return /复检|维修/.test(vehicle.remark || "") ? "maintenance" : "disabled";
  const vehicleTasks = dispatches.filter((dispatch) => dispatch.vehicleId === vehicle.plateNo && isDashboardToday(dispatch));
  if (vehicleTasks.some((dispatch) => ["已派单", "运输中"].includes(dispatch.status))) return "moving";
  return "idle";
}

function getDashboardVehicleData() {
  return {
    vehicles,
    groups: {
      idle: vehicles.filter((vehicle) => getDashboardVehicleState(vehicle) === "idle"),
      moving: vehicles.filter((vehicle) => getDashboardVehicleState(vehicle) === "moving"),
      maintenance: vehicles.filter((vehicle) => getDashboardVehicleState(vehicle) === "maintenance"),
      disabled: vehicles.filter((vehicle) => getDashboardVehicleState(vehicle) === "disabled"),
    },
  };
}

function getDashboardDriverState(driver) {
  if (driver.driverState === "停用") return "leave";
  const activeInRange = dispatches.some((dispatch) => dispatch.driverId === driver.id && isDashboardToday(dispatch) && ["已派单", "运输中"].includes(dispatch.status));
  if (activeInRange) return "moving";
  if (driver.driverState === "空闲") return "idle";
  return "attendance";
}

function getDashboardDriverData() {
  return {
    drivers,
    groups: {
      attendance: drivers.filter((driver) => getDashboardDriverState(driver) === "attendance"),
      leave: drivers.filter((driver) => getDashboardDriverState(driver) === "leave"),
      moving: drivers.filter((driver) => getDashboardDriverState(driver) === "moving"),
      idle: drivers.filter((driver) => getDashboardDriverState(driver) === "idle"),
    },
  };
}

function getDashboardTaskType(dispatch) {
  const waybill = waybills.find((item) => item.waybillNo === dispatch.waybillNo);
  const value = dispatch.taskConfigSnapshot?.name || dispatch.taskType || waybill?.taskType;
  const taskNodesApi = typeof window !== "undefined" ? window.DispatchTaskNodes : null;
  return taskNodesApi?.resolve?.(value) || (Object.prototype.hasOwnProperty.call(dashboardTaskNodeSequences, value) ? value : "提空装货");
}

function getDashboardTaskNodes(dispatch) {
  return dispatch.taskConfigSnapshot?.nodes?.map((node) => node.name)
    || (typeof window !== "undefined" ? window.DispatchTaskNodes?.get?.(getDashboardTaskType(dispatch)) : null)
    || dashboardTaskNodeSequences[getDashboardTaskType(dispatch)]
    || dashboardTaskNodeSequences["提空装货"];
}

function getDashboardTaskNodeIndex(dispatch, nodes) {
  const currentNode = String(dispatch.currentNode || "").trim();
  if (dispatch.status === "已完成" || ["已送达", "完成", "完成落重", "完成落空"].includes(currentNode)) return nodes.length - 1;
  const exactIndex = nodes.indexOf(currentNode);
  if (exactIndex >= 0) return exactIndex;

  const latestExactIndex = [...(dispatch.timeline || [])].reverse()
    .map((item) => nodes.indexOf(String(item.node || "").trim()))
    .find((index) => index >= 0);
  if (["在途", "进站", "落箱"].includes(currentNode) && latestExactIndex >= 0) {
    const latestExactNode = nodes[latestExactIndex];
    const samePhase = currentNode === "在途" ? latestExactNode.includes("在途") : currentNode === "进站" ? latestExactNode.includes("进站") : latestExactNode.includes("落") || latestExactNode.includes("完成");
    if (samePhase) return latestExactIndex;
    const nextIndex = latestExactIndex + 1;
    if (nextIndex < nodes.length) return nextIndex;
  }

  const taskType = getDashboardTaskType(dispatch);
  const legacyNodeIndex = {
    待派单: -1,
    待提货: -1,
    已提货: 0,
    已提箱: 0,
    在途: Math.min(1, nodes.length - 1),
    装卸: taskType === "提重送货" ? 3 : taskType === "提空装货" ? 3 : Math.min(1, nodes.length - 1),
    进站: taskType === "提空装货" ? 5 : taskType === "提重送货" ? 5 : taskType === "排重箱（A→B）" ? 2 : Math.min(2, nodes.length - 1),
    落箱: nodes.length - 1,
  };
  return Object.prototype.hasOwnProperty.call(legacyNodeIndex, currentNode) ? legacyNodeIndex[currentNode] : -1;
}

function getDashboardTaskMeta(dispatch) {
  const taskType = getDashboardTaskType(dispatch);
  const nodes = getDashboardTaskNodes(dispatch);
  const currentIndex = getDashboardTaskNodeIndex(dispatch, nodes);
  const completedCount = Math.max(0, Math.min(nodes.length, currentIndex + 1));
  const stage = currentIndex >= 0 ? nodes[currentIndex] : "待开始";
  const progress = Math.round(completedCount / nodes.length * 100);
  const exceptionReason = dispatch.status === "已派单" && dispatch.currentNode === "待提货" ? "提箱超时" : "";
  const threshold = Number(document.querySelector("#dashboardNearCompleteThreshold")?.value) || 70;
  return { taskType, nodes, currentIndex, completedCount, stage, progress, exceptionReason, nearComplete: progress >= threshold && progress < 100 };
}

function taskMatchesCapacityFilter(dispatch) {
  if (!dashboardCapacityFilter) return true;
  if (dashboardCapacityFilter.scope === "vehicle") {
    const vehicle = vehicles.find((item) => item.plateNo === dispatch.vehicleId);
    return vehicle && getDashboardVehicleState(vehicle) === dashboardCapacityFilter.status;
  }
  const driver = drivers.find((item) => item.id === dispatch.driverId);
  return driver && getDashboardDriverState(driver) === dashboardCapacityFilter.status;
}

function renderDashboardStatusGroup(target, donutTarget, items, groups, scope) {
  const total = items.reduce((sum, item) => sum + groups[item.key].length, 0);
  const colors = { available: "#2aa56f", moving: "#397fd0", maintenance: "#e29a42", disabled: "#97a3b2", attendance: "#24a0b5", leave: "#97a3b2" };
  let cursor = 0;
  const segments = items.map((item) => {
    const start = cursor;
    cursor += total ? groups[item.key].length / total * 100 : 0;
    return `${colors[item.className]} ${start}% ${cursor}%`;
  });
  document.querySelector(donutTarget).style.background = total ? `conic-gradient(${segments.join(", ")})` : "#edf1f5";
  document.querySelector(target).innerHTML = items.map((item) => {
    const active = dashboardCapacityFilter?.scope === scope && dashboardCapacityFilter.status === item.key;
    return `<button class="capacity-status-item ${item.className} ${active ? "active" : ""}" data-dashboard-capacity-scope="${scope}" data-dashboard-capacity-status="${item.key}" type="button"><span><i></i>${item.label}</span><strong>${groups[item.key].length}</strong><small>${item.note}</small></button>`;
  }).join("");
}

function renderDashboardTaskList(taskList) {
  const visibleTasks = taskList.filter(taskMatchesCapacityFilter).map((dispatch) => ({ dispatch, meta: getDashboardTaskMeta(dispatch) }))
    .sort((a, b) => Number(b.meta.nearComplete) - Number(a.meta.nearComplete) || b.meta.progress - a.meta.progress || Number(Boolean(b.meta.exceptionReason)) - Number(Boolean(a.meta.exceptionReason)));
  document.querySelector("#dashboardCapacityTasks").innerHTML = visibleTasks.length ? visibleTasks.map(({ dispatch, meta }) => {
    const { plan } = getDashboardTaskContext(dispatch);
    const nodeBlocks = meta.nodes.map((node, index) => {
      const state = index < meta.currentIndex ? "completed" : index === meta.currentIndex ? "current" : "pending";
      return `<i class="capacity-node-block ${state}" title="${dashboardEscape(node)}" aria-label="${dashboardEscape(node)}"></i>`;
    }).join("");
    const taskTitle = `${plan?.projectName || dispatch.routeName} · ${meta.taskType}`;
    return `<div class="capacity-task-row ${meta.exceptionReason ? "exception" : meta.nearComplete ? "near-complete" : ""}">
      <button class="capacity-task-main" data-dashboard-dispatch="${dashboardEscape(dispatch.id)}" type="button" title="查看任务单与节点照片">
        <span class="capacity-person"><strong>${dashboardEscape(dispatch.driverName)}</strong><small>${dashboardEscape(dispatch.vehicleId || "车辆待分配")}</small></span>
        <span class="capacity-order"><strong>${dashboardEscape(dispatch.waybillNo)}</strong><small title="${dashboardEscape(taskTitle)}">${dashboardEscape(taskTitle)}</small></span>
        <span class="stage-cell"><b>${dashboardEscape(meta.stage)}</b><small>${meta.completedCount} / ${meta.nodes.length} 节点</small></span>
        <span class="capacity-progress"><span class="capacity-progress-head"><b>${dashboardEscape(meta.stage)}</b><small>${meta.progress}%${meta.nearComplete ? " · 快完成" : ""}</small></span><span class="capacity-node-track" role="list" aria-label="${dashboardEscape(`${meta.taskType}节点进度`)}">${nodeBlocks}</span><small>${dashboardEscape(meta.nodes.join(" → "))}</small></span>
      </button>
      <span class="capacity-task-action">${meta.exceptionReason ? `<button data-dashboard-action="exception-list" type="button"><i data-lucide="triangle-alert" class="dashboard-icon" aria-hidden="true"></i>${meta.exceptionReason}</button>` : `<i data-lucide="chevron-right" class="dashboard-icon" aria-hidden="true"></i>`}</span>
    </div>`;
  }).join("") : '<div class="dashboard-empty-state"><i data-lucide="circle-check" class="dashboard-icon" aria-hidden="true"></i><strong>当前筛选下无执行中任务</strong><span>切换运力状态或顶部筛选条件查看其他任务</span></div>';
}

function renderDashboardPlanRows(planRows) {
  document.querySelector("#dashboardPlanCompletion").innerHTML = planRows.length ? planRows.map((item) => {
    const route = fixedRoutes.find((candidate) => candidate.id === item.routeId);
    const rate = item.planned ? Math.round(item.completed / item.planned * 100) : 0;
    return `<div class="plan-completion-row"><span class="plan-owner"><strong>${dashboardEscape(item.customerName)}</strong><small>${dashboardEscape(item.projectName)}</small></span><span class="plan-route" title="${dashboardEscape(route?.routeName || item.routeId)}">${dashboardEscape(route?.routeName || item.routeId)}</span><span class="plan-result"><strong>${item.completed}/${item.planned}</strong><i><b style="width:${rate}%"></b></i><small>${rate}%</small></span></div>`;
  }).join("") : '<div class="dashboard-empty-state compact"><strong>暂无计划数据</strong><span>请调整客户、项目或线路筛选</span></div>';
}

function renderDashboardAmounts(planRows) {
  const range = getDashboardDateRange();
  const amountRows = planRows.map((item) => {
    const route = fixedRoutes.find((candidate) => candidate.id === item.routeId);
    return { ...item, routeName: route?.routeName || item.routeId, periodAmount: item.planned * Number(route?.estimatedRevenue || 0) };
  });
  const periodAmount = amountRows.reduce((sum, item) => sum + item.periodAmount, 0);
  const monthAmount = amountRows.reduce((sum, item) => sum + item.monthAmount, 0);
  const totalAmount = amountRows.reduce((sum, item) => sum + item.totalAmount, 0);
  document.querySelector("#dashboardAmountTotals").innerHTML = [
    [`${range.label}预估`, periodAmount, "calendar-days", "today"],
    ["本月金额", monthAmount, "calendar-range", "month"],
    ["累计金额", totalAmount, "landmark", "total"],
  ].map(([label, value, icon, className]) => `<div class="amount-total ${className}"><span><i data-lucide="${icon}" class="dashboard-icon" aria-hidden="true"></i>${label}</span><strong>${formatMoney(value)}</strong></div>`).join("");
  const groups = new Map();
  amountRows.forEach((item) => {
    const name = dashboardAmountDimension === "customer" ? item.customerName : item.routeName;
    groups.set(name, (groups.get(name) || 0) + item.periodAmount);
  });
  const entries = [...groups.entries()].sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map((item) => item[1]), 1);
  document.querySelector("#dashboardAmountDistribution").innerHTML = entries.length ? entries.map(([name, value]) => `<div class="amount-distribution-row"><span title="${dashboardEscape(name)}">${dashboardEscape(name)}</span><i><b style="width:${Math.round(value / max * 100)}%"></b></i><strong>${formatMoney(value)}</strong></div>`).join("") : '<div class="dashboard-empty-state compact"><strong>暂无金额数据</strong><span>请调整筛选条件</span></div>';
}

function renderDashboard() {
  populateDashboardFilters();
  const filters = getDashboardFilters();
  const range = filters.dateRange;
  const taskList = getDashboardTasks(filters);
  const planRows = getDashboardPlanRows(filters);
  const vehicleData = getDashboardVehicleData();
  const driverData = getDashboardDriverData();
  const completedTasks = taskList.filter((dispatch) => dispatch.status === "已完成").length;
  const pendingTasks = taskList.filter((dispatch) => ["待派单", "已派单"].includes(dispatch.status));
  const inProgressTasks = taskList.filter((dispatch) => dispatch.status === "运输中").length;
  const assignedTasks = taskList.filter((dispatch) => dispatch.status !== "待派单");
  const exceptionTasks = taskList.filter((dispatch) => getDashboardTaskMeta(dispatch).exceptionReason).length;
  const plannedTasks = planRows.reduce((sum, item) => sum + item.planned, 0);
  const completedPlans = planRows.reduce((sum, item) => sum + item.completed, 0);
  const completionRate = plannedTasks ? Math.round((completedPlans / plannedTasks) * 100) : 0;
  const autoAssigned = assignedTasks.filter((dispatch) => getDispatchMode(dispatch) === "auto").length;
  const manualAssigned = assignedTasks.filter((dispatch) => getDispatchMode(dispatch) === "manual").length;

  document.querySelector("#dashboardUpdatedAt").textContent = `更新于 ${new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date())} · 15 秒自动刷新`;
  document.querySelector("#dashboardScopeTitle").textContent = `${range.label}运营全局`;
  document.querySelector("#dashboardTaskTitle").textContent = `${range.label}任务`;
  document.querySelector("#dashboardOperatingDate").textContent = getDashboardDateLabel(range);
  document.querySelector("#dashboardVehicleTotal").textContent = vehicleData.vehicles.length;
  document.querySelector("#dashboardDriverTotal").textContent = driverData.drivers.length;
  renderDashboardStatusGroup("#dashboardVehicleStatus", "#dashboardVehicleDonut", [
    { key: "idle", label: "空闲", note: "可派", className: "available" },
    { key: "moving", label: "在途", note: "执行中", className: "moving" },
    { key: "maintenance", label: "维修", note: "待恢复", className: "maintenance" },
    { key: "disabled", label: "停用", note: "不可派", className: "disabled" },
  ], vehicleData.groups, "vehicle");
  renderDashboardStatusGroup("#dashboardDriverStatus", "#dashboardDriverDonut", [
    { key: "attendance", label: "出勤", note: "已签到", className: "attendance" },
    { key: "leave", label: "休假", note: "不排班", className: "leave" },
    { key: "moving", label: "在途", note: "有任务", className: "moving" },
    { key: "idle", label: "空闲", note: "可派", className: "available" },
  ], driverData.groups, "driver");

  document.querySelector("#dashboardCompletionRate").textContent = `${completionRate}%`;
  document.querySelector("#dashboardCompletionGauge").style.background = `conic-gradient(#397fd0 0 ${completionRate}%, #edf1f6 ${completionRate}% 100%)`;
  document.querySelector("#dashboardCompletionNote").textContent = `已完成 ${completedPlans} / ${plannedTasks}`;
  document.querySelector("#dashboardTaskSummary").textContent = `${getDashboardDateLabel(range)} · ${taskList.length} 条任务进入调度`;
  document.querySelector("#dashboardTaskMetrics").innerHTML = [
    { label: "计划数", value: plannedTasks, note: range.label, className: "planned" },
    { label: "已派单", value: assignedTasks.length, note: `自动 ${autoAssigned} / 手动 ${manualAssigned}`, className: "assigned" },
    { label: "进行中", value: inProgressTasks, note: "节点执行中", className: "active" },
    { label: "待派发", value: pendingTasks.filter((item) => item.status === "待派单").length, note: "等待运力", className: "pending" },
    { label: "异常任务", value: exceptionTasks, note: "需要处理", className: "exception", action: "exception-list" },
    { label: "已完成", value: completedTasks, note: `${range.label}完成`, className: "done" },
  ].map((item) => `<button class="dashboard-task-metric ${item.className}" ${item.action ? `data-dashboard-action="${item.action}"` : 'data-dashboard-action="dispatch-list"'} type="button"><span>${item.label}</span><strong>${item.value}</strong><small>${item.note}</small></button>`).join("");

  renderDashboardTaskList(taskList);
  renderDashboardPlanRows(planRows);
  renderDashboardAmounts(planRows);

  window.lucide?.createIcons();
}

function openDashboardTarget(action) {
  if (action === "vehicle-list") {
    switchPage("vehicle-archives");
    return;
  }
  if (action === "route-list") {
    switchPage("fixed-routes");
    return;
  }
  if (action === "exception-list") {
    switchPage("auto-dispatch");
    window.setTimeout(() => document.querySelector('[data-auto-tab="exception"]')?.click(), 0);
    return;
  }
  switchPage("dispatch-list");
  if (action === "pending-list") {
    const status = document.querySelector('#dispatchQueryForm select[name="dispatchStatus"]');
    if (status) status.value = "待派单";
    renderDispatchPage(getFilteredDispatches());
  }
}

function getReminderTemplateFiltered() {
  const form = document.querySelector("#reminderTemplateQueryForm");
  if (!form) return reminderTemplates;
  const data = new FormData(form);
  const keyword = String(data.get("keyword") || "").trim().toLowerCase();
  const eventType = String(data.get("eventType") || "");
  const status = String(data.get("status") || "");
  const forceLogic = String(data.get("forceLogic") || "");
  return reminderTemplates.filter((template) => {
    const keywordMatch = !keyword || [template.name, template.code, template.title, template.content].some((value) => String(value || "").toLowerCase().includes(keyword));
    return keywordMatch && (!eventType || template.eventType === eventType) && (!status || (template.enabled ? "启用" : "停用") === status) && (!forceLogic || template.forceLogic === forceLogic);
  });
}

function reminderTemplateTriggerText(template) {
  if (template.triggerTiming === "before") return `提前 ${template.offsetMinutes || 0} 天${template.sendTime ? ` · ${template.sendTime}` : ""}`;
  if (template.triggerTiming === "after") return `事件后 ${template.offsetMinutes || 0} 分钟`;
  if (template.triggerTiming === "schedule") return `每日 ${template.sendTime || "09:00"} 汇总`;
  return "事件发生时立即";
}

function reminderTemplatePills(items, className = "") {
  return (items || []).map((item) => `<span class="reminder-template-pill ${className}">${dashboardEscape(item)}</span>`).join("");
}

function renderReminderTemplateSummary(rows) {
  const total = reminderTemplates.length;
  const enabled = reminderTemplates.filter((item) => item.enabled).length;
  const forced = reminderTemplates.filter((item) => item.forceLogic !== "普通提醒").length;
  const eventCount = new Set(reminderTemplates.map((item) => item.eventType)).size;
  document.querySelector("#reminderTemplateSummary").innerHTML = [
    ["模板总数", total, "已建立业务提醒规则"],
    ["启用中", enabled, "当前会参与事件触发"],
    ["强制规则", forced, "必须处理或阻断业务"],
    ["覆盖事件", eventCount, "车辆、证照与作业事件"],
  ].map(([label, value, note], index) => `<div class="reminder-template-stat stat-${index}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join("");
  document.querySelector("#reminderTemplateActiveBadge").textContent = `启用 ${enabled}`;
  document.querySelector("#reminderTemplateQuerySummary").textContent = `筛选结果 ${rows.length} 条`;
}

function renderReminderTemplatePage(rows = getReminderTemplateFiltered()) {
  const body = document.querySelector("#reminderTemplateBody");
  if (!body) return;
  const pageSize = Number(document.querySelector("#reminderTemplatePageSize")?.value) || 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  reminderTemplateCurrentPage = Math.min(Math.max(1, reminderTemplateCurrentPage), pageCount);
  const start = (reminderTemplateCurrentPage - 1) * pageSize;
  const visible = rows.slice(start, start + pageSize);
  body.innerHTML = visible.length ? visible.map((template) => `<tr>
    <td><div class="reminder-template-name"><strong>${dashboardEscape(template.name)}</strong><small>${dashboardEscape(template.code)}</small></div></td>
    <td><span class="reminder-event-badge event-${dashboardEscape(template.eventType)}">${dashboardEscape(template.eventType)}</span><small class="reminder-template-scope">${dashboardEscape(template.scope || "全部车队")}</small></td>
    <td><span class="reminder-trigger-text">${dashboardEscape(reminderTemplateTriggerText(template))}</span></td>
    <td><div class="reminder-template-pills">${reminderTemplatePills(template.recipients)}</div></td>
    <td><div class="reminder-template-pills channels">${reminderTemplatePills(template.channels)}</div></td>
    <td><span class="reminder-force-badge force-${dashboardEscape(template.forceLogic)}">${dashboardEscape(template.forceLogic)}</span>${template.repeatInterval !== "不重复" ? `<small class="reminder-template-scope">${dashboardEscape(template.repeatInterval)}</small>` : ""}</td>
    <td><span class="state-pill ${template.enabled ? "active-state" : "muted-state"}">${template.enabled ? "启用" : "停用"}</span></td>
    <td><span class="reminder-template-updated">${dashboardEscape(template.updatedAt || "未记录")}</span></td>
    <td class="fixed-action-column"><div class="table-actions"><button class="link-btn" data-reminder-action="preview" data-reminder-id="${dashboardEscape(template.id)}" type="button">预览</button><button class="link-btn" data-reminder-action="edit" data-reminder-id="${dashboardEscape(template.id)}" type="button">编辑</button><button class="link-btn ${template.enabled ? "danger-link" : "success-link"}" data-reminder-action="toggle" data-reminder-id="${dashboardEscape(template.id)}" type="button">${template.enabled ? "停用" : "启用"}</button></div></td>
  </tr>`).join("") : `<tr><td colspan="9"><div class="reminder-template-empty"><strong>暂无匹配的提醒模板</strong><span>调整筛选条件，或新增一条业务提醒规则。</span></div></td></tr>`;
  document.querySelector("#reminderTemplateResultText").textContent = `共 ${rows.length} 条模板，事件触发后按配置生成提醒记录`;
  document.querySelector("#reminderTemplateCurrentPage").textContent = String(reminderTemplateCurrentPage);
  document.querySelector("#reminderTemplateTotalText").textContent = `共 ${rows.length} 条记录`;
  document.querySelector("#reminderTemplatePrevPage").disabled = reminderTemplateCurrentPage <= 1;
  document.querySelector("#reminderTemplateNextPage").disabled = reminderTemplateCurrentPage >= pageCount;
  document.querySelector("#reminderTemplatePageJump").value = String(reminderTemplateCurrentPage);
  renderReminderTemplateSummary(rows);
  window.lucide?.createIcons();
}

function setReminderTemplateForm(template) {
  const form = document.querySelector("#reminderTemplateForm");
  form.reset();
  form.elements.name.value = template?.name || "";
  form.elements.code.value = template?.code || `NOTICE_${Date.now().toString().slice(-6)}`;
  form.elements.eventType.value = template?.eventType || "";
  form.elements.scope.value = template?.scope || "全部车队";
  form.elements.triggerTiming.value = template?.triggerTiming || "immediate";
  form.elements.offsetMinutes.value = template?.offsetMinutes ?? 0;
  form.elements.sendTime.value = template?.sendTime || "09:00";
  form.elements.forceLogic.value = template?.forceLogic || "普通提醒";
  form.elements.repeatInterval.value = template?.repeatInterval || "不重复";
  form.elements.maxRepeats.value = template?.maxRepeats ?? 3;
  form.elements.enabled.checked = template?.enabled ?? true;
  form.elements.title.value = template?.title || "";
  form.elements.content.value = template?.content || "";
  form.querySelectorAll("input[name='recipients']").forEach((input) => { input.checked = Boolean(template?.recipients?.includes(input.value)); });
  form.querySelectorAll("input[name='channels']").forEach((input) => { input.checked = Boolean(template?.channels?.includes(input.value)); });
  document.querySelector("#reminderTemplateFormTitle").textContent = template ? "编辑消息提醒模板" : "新增消息提醒模板";
  updateReminderTemplateTriggerFields();
  updateReminderTemplatePreview();
}

function openReminderTemplateDialog(id = "") {
  reminderTemplateEditingId = id;
  const template = reminderTemplates.find((item) => item.id === id);
  setReminderTemplateForm(template);
  document.querySelector("#reminderTemplateDialog").showModal();
}

function closeReminderTemplateDialog() {
  const dialog = document.querySelector("#reminderTemplateDialog");
  if (dialog?.open) dialog.close();
  reminderTemplateEditingId = "";
}

function updateReminderTemplateTriggerFields() {
  const form = document.querySelector("#reminderTemplateForm");
  if (!form) return;
  const timing = form.elements.triggerTiming.value;
  const offsetField = document.querySelector("#reminderTemplateOffsetField");
  const timeField = document.querySelector("#reminderTemplateTimeField");
  const offsetLabel = document.querySelector("#reminderTemplateOffsetLabel");
  const offsetHint = document.querySelector("#reminderTemplateOffsetHint");
  offsetField.classList.toggle("hidden-field", timing === "schedule");
  timeField.classList.toggle("hidden-field", timing !== "schedule");
  if (timing === "before") { offsetLabel.textContent = "提前时间（天）"; form.elements.offsetMinutes.max = "365"; offsetHint.textContent = "证照到期前按天数生成提醒。"; }
  else if (timing === "after") { offsetLabel.textContent = "延迟时间（分钟）"; form.elements.offsetMinutes.max = "43200"; offsetHint.textContent = "事件发生后超过该时长才生成提醒。"; }
  else { offsetLabel.textContent = "提前/延迟时间（分钟）"; form.elements.offsetMinutes.max = "43200"; offsetHint.textContent = timing === "immediate" ? "事件发生后立即生成提醒。" : "每日按业务日期生成一条汇总提醒。"; }
}

function updateReminderTemplatePreview() {
  const form = document.querySelector("#reminderTemplateForm");
  if (!form) return;
  const values = { "{{车牌号}}": "浙B·K7812", "{{司机姓名}}": "王海", "{{运单号}}": "WB20260916001", "{{当前节点}}": "到达仓库", "{{到期日期}}": "2026-10-18" };
  const replace = (text) => String(text || "").replace(/{{[^}]+}}/g, (token) => values[token] || token);
  document.querySelector("#reminderTemplatePreviewTitle").textContent = replace(form.elements.title.value) || "消息提醒标题";
  document.querySelector("#reminderTemplatePreviewContent").textContent = replace(form.elements.content.value) || "消息正文预览将在这里显示。";
}

function getAnnouncementFiltered() {
  const form = document.querySelector("#announcementQueryForm");
  if (!form) return announcements;
  const data = new FormData(form);
  const keyword = String(data.get("keyword") || "").trim().toLowerCase();
  const type = String(data.get("type") || "");
  const status = String(data.get("status") || "");
  return announcements.filter((item) => {
    const keywordMatch = !keyword || [item.title, item.content, item.type].some((value) => String(value || "").toLowerCase().includes(keyword));
    return keywordMatch && (!type || item.type === type) && (!status || item.status === status);
  });
}

function announcementScopeText(item) {
  if (item.scope === "全部司机") return "全部司机";
  const count = Array.isArray(item.targetDriverIds) ? item.targetDriverIds.length : 0;
  return item.scope || `部分司机 · ${count} 人`;
}

function renderAnnouncementSummary(rows) {
  const published = announcements.filter((item) => item.status === "已发布").length;
  const targeted = announcements.filter((item) => item.scope !== "全部司机").length;
  const attachmentCount = announcements.filter((item) => item.attachment).length;
  document.querySelector("#announcementSummary").innerHTML = [
    ["公告总数", announcements.length, "已保存的公告记录"],
    ["已发布", published, "司机端可见"],
    ["定向公告", targeted, "仅发送给部分司机"],
    ["含附件", attachmentCount, "已上传附件的公告"],
  ].map(([label, value, note], index) => `<div class="reminder-template-stat stat-${index}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join("");
  document.querySelector("#announcementPublishedBadge").textContent = `已发布 ${published}`;
  document.querySelector("#announcementQuerySummary").textContent = `筛选结果 ${rows.length} 条`;
}

function renderAnnouncementPage(rows = getAnnouncementFiltered()) {
  const body = document.querySelector("#announcementBody");
  if (!body) return;
  const pageSize = Number(document.querySelector("#announcementPageSize")?.value) || 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  announcementCurrentPage = Math.min(Math.max(1, announcementCurrentPage), pageCount);
  const visible = rows.slice((announcementCurrentPage - 1) * pageSize, announcementCurrentPage * pageSize);
  body.innerHTML = visible.length ? visible.map((item) => `<tr>
    <td><div class="reminder-template-name"><strong>${dashboardEscape(item.title)}</strong><small>${dashboardEscape(item.content).slice(0, 48)}${String(item.content || "").length > 48 ? "…" : ""}</small></div></td>
    <td><span class="reminder-event-badge announcement-type-${dashboardEscape(item.type)}">${dashboardEscape(item.type)}</span></td>
    <td><span class="reminder-template-scope">${dashboardEscape(announcementScopeText(item))}</span></td>
    <td>${item.attachment ? `<span class="announcement-attachment">${dashboardEscape(item.attachment)}</span>` : `<span class="reminder-template-scope">无附件</span>`}</td>
    <td><span class="reminder-template-updated">${dashboardEscape(item.publishedAt || "未发布")}</span></td>
    <td><span class="state-pill ${item.status === "已发布" ? "active-state" : "muted-state"}">${dashboardEscape(item.status || "草稿")}</span></td>
    <td class="fixed-action-column"><div class="table-actions"><button class="link-btn" data-announcement-action="preview" data-announcement-id="${dashboardEscape(item.id)}" type="button">查看</button></div></td>
  </tr>`).join("") : `<tr><td colspan="7"><div class="reminder-template-empty"><strong>暂无匹配的公告</strong><span>调整筛选条件，或点击“发布公告”创建一条公告。</span></div></td></tr>`;
  document.querySelector("#announcementResultText").textContent = `共 ${rows.length} 条公告，发布后目标司机将在消息通知中收到`;
  document.querySelector("#announcementCurrentPage").textContent = String(announcementCurrentPage);
  document.querySelector("#announcementTotalText").textContent = `共 ${rows.length} 条记录`;
  document.querySelector("#announcementPrevPage").disabled = announcementCurrentPage <= 1;
  document.querySelector("#announcementNextPage").disabled = announcementCurrentPage >= pageCount;
  document.querySelector("#announcementPageJump").value = String(announcementCurrentPage);
  renderAnnouncementSummary(rows);
  window.lucide?.createIcons();
}

function getAnnouncementVisibleDrivers() {
  const ownership = document.querySelector("#announcementDriverOwnership")?.value || "";
  return CapacityOwnership.sortSelfFirst(drivers.filter((driver) => CapacityOwnership.matchesFilter(driver.capacityOwnership, ownership, true)));
}

function renderAnnouncementDriverPicker() {
  const list = document.querySelector("#announcementDriverList");
  if (!list) return;
  const visible = getAnnouncementVisibleDrivers();
  list.innerHTML = visible.length ? visible.map((driver) => `<label class="announcement-driver-option"><input type="checkbox" data-announcement-driver="${dashboardEscape(driver.id)}" ${announcementSelectedDriverIds.has(driver.id) ? "checked" : ""} /><span><strong>${dashboardEscape(driver.name)}</strong><small>${CapacityOwnership.badgeMarkup(driver.capacityOwnership)} ${dashboardEscape(CapacityOwnership.organizationName(driver))} · ${dashboardEscape(driver.fleet || "未分配车队")}</small></span><em>${dashboardEscape(driver.driverState || "")}</em></label>`).join("") : `<div class="announcement-driver-empty">暂无符合条件的司机</div>`;
  document.querySelector("#announcementDriverResultText").textContent = `当前结果 ${visible.length} 名司机`;
  document.querySelector("#announcementSelectedDriverText").textContent = `已选 ${announcementSelectedDriverIds.size} 名司机`;
}

function setAnnouncementScope(scope) {
  const picker = document.querySelector("#announcementDriverPicker");
  if (!picker) return;
  picker.hidden = scope !== "partial";
  if (scope === "partial") renderAnnouncementDriverPicker();
}

function setAnnouncementForm(item = null) {
  const form = document.querySelector("#announcementForm");
  form.reset();
  form.elements.title.value = item?.title || "";
  form.elements.type.value = item?.type || "";
  form.elements.content.value = item?.content || "";
  form.elements.scope.value = item?.scope === "全部司机" ? "all" : "partial";
  announcementSelectedDriverIds = new Set(item?.targetDriverIds || []);
  window.AttachmentPicker?.setExisting(form.elements.attachment, item?.attachment || "");
  document.querySelector("#announcementFormTitle").textContent = item ? "公告详情" : "发布公告";
  form.querySelector("button[type='submit']").hidden = Boolean(item);
  form.querySelectorAll("input, select, textarea").forEach((input) => { input.disabled = Boolean(item); });
  document.querySelector("#announcementPreviewTitle").textContent = item?.title || "公告标题";
  document.querySelector("#announcementPreviewContent").textContent = item?.content || "公告内容将在这里显示。";
  document.querySelectorAll("#announcementForm input[name='scope']").forEach((input) => { input.checked = input.value === (item?.scope === "全部司机" ? "all" : item ? "partial" : "all"); });
  document.querySelector("#announcementDriverOwnership").value = "";
  setAnnouncementScope(item?.scope === "全部司机" || !item ? "all" : "partial");
  renderAnnouncementDriverPicker();
}

function openAnnouncementDialog(id = "") {
  const item = announcements.find((record) => record.id === id) || null;
  setAnnouncementForm(item);
  document.querySelector("#announcementDialog")?.showModal();
}

function closeAnnouncementDialog() {
  const dialog = document.querySelector("#announcementDialog");
  if (dialog?.open) dialog.close();
}

const FINANCE_EXPENSE_STORAGE_KEY = "container-logistics-finance-expenses-v1";
const financeExpenseRecords = (() => {
  try {
    const stored = JSON.parse(localStorage.getItem(FINANCE_EXPENSE_STORAGE_KEY) || "{}");
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch (error) {
    return {};
  }
})();
const financeExpenseFields = ["fuel", "electricity", "gas", "toll", "parking", "vehicleOther", "taskShare", "subsidy", "insurance", "labor", "service"];
let financeCurrentPage = 1;
let financePageSize = 10;
let financeEditingWaybillNo = "";

function saveFinanceExpenseRecords() {
  try { localStorage.setItem(FINANCE_EXPENSE_STORAGE_KEY, JSON.stringify(financeExpenseRecords)); } catch (error) { console.warn("财务费用保存失败。", error); }
}

function financeNumber(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function financeMoney(value) {
  return `¥${financeNumber(value).toFixed(2)}`;
}

function financeFormatCell(value, empty = "—") {
  const text = String(value ?? "").trim();
  return text ? dashboardEscape(text) : `<span class="finance-empty-value">${empty}</span>`;
}

function financeContainerList(waybill) {
  const containers = getWaybillContainers(waybill);
  return containers.length ? containers : [{ boxNo: "", sealNo: "", boxType: waybill.boxType || "" }];
}

function financeReadList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function financeSettlementTrace(waybill, dispatch, route, isThirdParty) {
  const waybillNo = waybill.waybillNo;
  const settlementOrders = financeReadList("container-logistics-settlement-orders-v1").filter((order) => (order.lines || []).some((line) => line.waybillNo === waybillNo));
  const payrollOrders = financeReadList("container-logistics-payroll-orders-v1").filter((order) => (order.lines || []).some((line) => line.waybillNo === waybillNo));
  const abnormal = financeReadList("container-logistics-abnormal-fees-v1").filter((item) => item.waybillNo === waybillNo);
  const energy = financeReadList("container-logistics-energy-ledger-v1").flatMap((item) => (item.allocations || []).filter((allocation) => allocation.waybillNo === waybillNo));
  const sumFees = (key, target) => (Array.isArray(waybill[key]) ? waybill[key] : []).filter((fee) => !target || fee.target === target).reduce((sum, fee) => sum + financeNumber(fee.amount), 0);
  const baseReceivable = sumFees("receivableFees") || financeNumber(waybill.receivable) || financeNumber(dispatch.estimatedRevenue) || financeNumber(route.estimatedRevenue);
  const payableFees = sumFees("payableFees", "供应商") || sumFees("payableFees");
  const basePayable = isThirdParty ? financeNumber(dispatch.thirdPartySettlementPriceSnapshot) || payableFees || financeNumber(waybill.payable) || financeNumber(route.thirdPartySettlementPrice) || financeNumber(route.baseFreight) : 0;
  const abnormalReceivableAmount = abnormal.reduce((sum, item) => sum + financeNumber(item.receivableAmount), 0);
  const abnormalPayableAmount = abnormal.reduce((sum, item) => sum + financeNumber(item.payableAmount), 0);
  const statuses = [...new Set([...settlementOrders.map((item) => item.documentStatus === "confirmed" ? "结算已确认" : "结算已锁定"), ...payrollOrders.map((item) => item.status === "paid" ? "工资已发放" : item.status === "confirmed" ? "工资已确认" : "工资已锁定")])];
  return {
    baseReceivableAmount: baseReceivable,
    basePayableAmount: basePayable,
    receivableAmount: baseReceivable + abnormalReceivableAmount,
    payableAmount: basePayable + (isThirdParty ? abnormalPayableAmount : 0),
    abnormalReceivableAmount,
    abnormalPayableAmount,
    energyAmount: energy.reduce((sum, item) => sum + financeNumber(item.amount), 0),
    payrollAmount: payrollOrders.flatMap((order) => order.costAllocations || []).filter((item) => item.waybillNo === waybillNo).reduce((sum, item) => sum + financeNumber(item.amount), 0),
    documentIds: [...settlementOrders.map((item) => item.id), ...payrollOrders.map((item) => item.id)],
    settlementStatus: statuses.join(" / ") || "待结算",
  };
}

function financeTimelineTime(dispatch, nodes) {
  const timeline = Array.isArray(dispatch?.timeline) ? dispatch.timeline : [];
  const matched = timeline.find((entry) => nodes.includes(entry.node));
  return matched?.time || "";
}

function getFinanceDispatch(waybillNo) {
  return dispatches
    .filter((item) => item.waybillNo === waybillNo && item.status !== "待派单")
    .sort((left, right) => String(right.dispatchTime || "").localeCompare(String(left.dispatchTime || "")))[0] || null;
}

function getFinanceExpense(waybillNo) {
  const stored = financeExpenseRecords[waybillNo] || {};
  return financeExpenseFields.reduce((result, field) => {
    result[field] = financeNumber(stored[field]);
    return result;
  }, { remark: String(stored.remark || "") });
}

function getFinanceRow(waybill, dispatch = getFinanceDispatch(waybill.waybillNo)) {
  if (!waybill || !dispatch) return null;
  const route = fixedRoutes.find((item) => item.id === (dispatch.routeId || waybill.routeId)) || getRouteForWaybill(waybill.waybillNo) || {};
  const vehicle = vehicles.find((item) => item.plateNo === dispatch.vehicleId || item.plateNo === waybill.plateNo);
  const containers = financeContainerList(waybill);
  const pickupTime = financeTimelineTime(dispatch, ["已提货", "提箱", "已取箱"]);
  const completedTime = financeTimelineTime(dispatch, ["已送达", "已完成", "完成"]);
  const vehicleCosts = ["fuel", "electricity", "gas", "toll", "parking", "vehicleOther"];
  const laborCosts = ["taskShare", "subsidy", "insurance", "labor", "service"];
  const expense = getFinanceExpense(waybill.waybillNo);
  const vehicleTotal = vehicleCosts.reduce((sum, field) => sum + financeNumber(expense[field]), 0);
  const laborTotal = laborCosts.reduce((sum, field) => sum + financeNumber(expense[field]), 0);
  const capacityOwnership = dispatch.capacityOwnershipSnapshot || CapacityOwnership.TYPES.PENDING;
  const carrierType = dispatch.carrierTypeSnapshot || vehicle?.capacityOwnership || CapacityOwnership.TYPES.PENDING;
  const isThirdParty = carrierType === CapacityOwnership.TYPES.THIRD;
  const settlementTrace = financeSettlementTrace(waybill, dispatch, route, isThirdParty);
  const pricingMethodLabels = { perTrip: "按趟固定价", perContainer: "按箱计价", perMileage: "按里程计价", negotiated: "临时议价" };
  const routeStops = typeof getRouteStops === "function" ? getRouteStops(route) : [];
  const pickupPoint = containers.map((item) => item.pickupPoint || route.pickupPoint || routeStops[0]?.value || route.origin || "").filter(Boolean);
  const dropoffPoint = containers.map((item) => item.returnPoint || route.dropoffPoint || waybill.returnPoint || routeStops[3]?.value || route.destination || "").filter(Boolean);
  return {
    waybill,
    dispatch,
    route,
    vehicle,
    waybillNo: waybill.waybillNo,
    orderDate: waybill.orderDate || dispatch.orderDate || dispatch.dispatchTime || "",
    customerId: waybill.customerId || dispatch.customerId || route.customerId || "",
    customerName: waybill.customerName || dispatch.customerName || route.customerName || "",
    projectId: waybill.projectId || dispatch.projectId || route.projectId || "",
    projectName: waybill.projectName || dispatch.projectName || route.projectName || "未分配项目",
    routeId: dispatch.routeId || waybill.routeId || route.id || "",
    routeName: dispatch.routeName || route.routeName || "未指定线路",
    taskType: waybill.taskType || dispatch.taskType || "-",
    boxes: containers.map((item) => item.boxNo && item.boxNo !== "-" ? item.boxNo : "待补录").join(" / "),
    boxTypes: containers.map((item) => item.boxType || waybill.boxType || "").filter(Boolean).join(" / "),
    seals: containers.map((item) => item.sealNo && item.sealNo !== "-" ? item.sealNo : "待补录").join(" / "),
    dockingTime: waybill.dockingTime || dispatch.dockingTime || "",
    pickupPoint: [...new Set(pickupPoint)].join(" / "),
    loadingAddress: waybill.loadingPoint || route.loadingPoint || String(waybill.loadAddress || dispatch.loadAddress || "").split(" / ")[0],
    unloadingAddress: waybill.unloadingPoint || route.unloadingPoint || String(waybill.loadAddress || dispatch.loadAddress || "").split(" / ")[1] || route.destination || "",
    dropoffPoint: [...new Set(dropoffPoint)].join(" / "),
    mileage: Object.prototype.hasOwnProperty.call(dispatch, "routeMileageSnapshot")
      ? dispatch.routeMileageSnapshot
      : (Object.prototype.hasOwnProperty.call(waybill, "routeMileageSnapshot") ? waybill.routeMileageSnapshot : getRouteMileageSnapshot(route)),
    transportMode: waybill.transportMode || dispatch.transportMode || "公路运输",
    capacityOwnership,
    capacityOwnershipTooltip: dispatch.capacityOwnershipTooltipSnapshot || "",
    carrierType,
    carrier: organizationDisplayName(dispatch.carrierUnitSnapshot || (isThirdParty ? (dispatch.thirdPartyCarrierSnapshot || route.thirdPartyCarrier || vehicle?.fleetName || vehicle?.fleet || waybill.carrier || "外协承运商") : CapacityOwnership.SELF_ORGANIZATION)),
    driverOrganization: organizationDisplayName(dispatch.driverOrganizationSnapshot, "待确定"),
    vehicleOrganization: organizationDisplayName(dispatch.vehicleOrganizationSnapshot || (vehicle ? CapacityOwnership.organizationName(vehicle) : "待确定")),
    vehicleNo: dispatch.vehicleId || waybill.plateNo || "",
    vehicleType: dispatch.vehicleType || vehicle?.vehicleType || "",
    driverName: dispatch.driverName || waybill.driverName || "",
    driverPhone: dispatch.phone || "",
    pickupTime,
    completedTime,
    settlementMethod: isThirdParty ? `${pricingMethodLabels[dispatch.thirdPartyPricingMethodSnapshot || route.thirdPartyPricingMethod] || "按趟固定价"} / ${dispatch.thirdPartySettlementCycleSnapshot || route.thirdPartySettlementCycle || "月结30天"}` : "内部成本归集",
    ...settlementTrace,
    expense,
    vehicleTotal,
    laborTotal,
    totalExpense: vehicleTotal + laborTotal,
    status: dispatch.status || "已派单",
  };
}

function getFinanceRows() {
  const waybillMap = new Map(waybills.map((item) => [item.waybillNo, item]));
  const latestDispatchByWaybill = new Map();
  dispatches.filter((dispatch) => dispatch.status !== "待派单").forEach((dispatch) => {
    const current = latestDispatchByWaybill.get(dispatch.waybillNo);
    if (!current || String(dispatch.dispatchTime || "") >= String(current.dispatchTime || "")) latestDispatchByWaybill.set(dispatch.waybillNo, dispatch);
  });
  return [...latestDispatchByWaybill.entries()]
    .map(([waybillNo, dispatch]) => getFinanceRow(waybillMap.get(waybillNo), dispatch))
    .filter(Boolean)
    .sort((left, right) => String(right.orderDate || "").localeCompare(String(left.orderDate || "")));
}

function getFilteredFinanceRows() {
  const form = document.querySelector("#financeQueryForm");
  if (!form) return getFinanceRows();
  const data = new FormData(form);
  const startDate = String(data.get("startDate") || "");
  const endDate = String(data.get("endDate") || "");
  const customerId = String(data.get("customerId") || "");
  const projectId = String(data.get("projectId") || "");
  const routeId = String(data.get("routeId") || "");
  const taskType = String(data.get("taskType") || "");
  const keyword = String(data.get("keyword") || "").trim().toLowerCase();
  const resourceKeyword = String(data.get("resourceKeyword") || "").trim().toLowerCase();
  const status = String(data.get("status") || "");
  const capacityOwnership = String(data.get("capacityOwnership") || "");
  return getFinanceRows().filter((row) => {
    const text = [row.waybillNo, row.boxes, row.seals].join(" ").toLowerCase();
    const resourceText = [row.driverName, row.vehicleNo].join(" ").toLowerCase();
    const rowDate = String(row.orderDate || "").slice(0, 10);
    return (!startDate || rowDate >= startDate) &&
      (!endDate || rowDate <= endDate) &&
      (!customerId || row.customerId === customerId) &&
      (!projectId || row.projectId === projectId) &&
      (!routeId || row.routeId === routeId) &&
      (!taskType || row.taskType === taskType) &&
      (!keyword || text.includes(keyword)) &&
      (!resourceKeyword || resourceText.includes(resourceKeyword)) &&
      (!status || row.status === status) &&
      CapacityOwnership.matchesFilter(row.capacityOwnership, capacityOwnership);
  });
}

function financeSetFilterOptions(select, options, placeholder) {
  if (!select) return;
  const current = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>${options.map((item) => `<option value="${dashboardEscape(item.value)}">${dashboardEscape(item.label)}</option>`).join("")}`;
  select.value = options.some((item) => item.value === current) ? current : "";
}

function populateFinanceFilters(rows) {
  financeSetFilterOptions(document.querySelector("#financeCustomerFilter"), [...new Map(rows.map((row) => [row.customerId, { value: row.customerId, label: row.customerName }]).filter(([value]) => value)).values()], "全部客户");
  financeSetFilterOptions(document.querySelector("#financeProjectFilter"), [...new Map(rows.map((row) => [row.projectId, { value: row.projectId, label: row.projectName }]).filter(([value]) => value)).values()], "全部项目");
  financeSetFilterOptions(document.querySelector("#financeRouteFilter"), [...new Map(rows.map((row) => [row.routeId, { value: row.routeId, label: row.routeName }]).filter(([value]) => value)).values()], "全部路线");
  financeSetFilterOptions(document.querySelector("#financeTaskTypeFilter"), [...new Map(rows.map((row) => [row.taskType, { value: row.taskType, label: row.taskType }]).filter(([value]) => value)).values()], "全部任务类型");
}

function renderFinanceSummary(rows) {
  const completed = rows.filter((row) => row.status === "已完成").length;
  const pendingExpense = rows.filter((row) => row.totalExpense <= 0).length;
  const totalExpense = rows.reduce((sum, row) => sum + row.totalExpense, 0);
  const totalLabor = rows.reduce((sum, row) => sum + row.laborTotal, 0);
  const summary = document.querySelector("#financeSummary");
  if (!summary) return;
  summary.innerHTML = [
    ["运输单据", rows.length, "派单后进入财务台账", "records"],
    ["已完成", completed, "已补齐完成节点", "completed"],
    ["待补费用", pendingExpense, "尚未录入费用的运单", "pending"],
    ["司机劳务费", financeMoney(totalLabor), "当前筛选范围合计", "labor"],
    ["总费用", financeMoney(totalExpense), "车辆 + 司机劳务", "total"],
  ].map(([label, value, note, className]) => `<div class="finance-summary-card ${className}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join("");
}

function financeStatusClass(status) {
  return { 已派单: "assigned", 运输中: "moving", 已完成: "completed", 取消: "cancelled" }[status] || "pending";
}

function renderFinanceRows(rows) {
  const body = document.querySelector("#financeReportBody");
  if (!body) return;
  const start = (financeCurrentPage - 1) * financePageSize;
  const visible = rows.slice(start, start + financePageSize);
  body.innerHTML = visible.length ? visible.map((row) => `<tr>
    <td>${financeFormatCell(row.orderDate)}</td><td><strong>${financeFormatCell(row.customerName)}</strong></td><td>${financeFormatCell(row.projectName)}</td><td>${financeFormatCell(row.routeName)}</td><td><strong class="primary-text">${financeFormatCell(row.waybillNo)}</strong></td>
    <td><span class="finance-multiline">${row.boxes.split(" / ").map((item) => financeFormatCell(item)).join("<br />")}</span></td><td>${financeFormatCell(row.boxTypes)}</td><td><span class="finance-multiline">${row.seals.split(" / ").map((item) => financeFormatCell(item)).join("<br />")}</span></td>
    <td>${financeFormatCell(row.dockingTime, "待补录")}</td><td>${financeFormatCell(row.pickupPoint)}</td><td>${financeFormatCell(row.loadingAddress)}<br /><span class="finance-subcell">${financeFormatCell(row.unloadingAddress)}</span></td><td>${financeFormatCell(row.dropoffPoint)}</td><td>${financeFormatCell(row.mileage, "待补录")}</td><td>${financeFormatCell(row.transportMode)}</td><td>${CapacityOwnership.badgeMarkup(row.capacityOwnership, row.capacityOwnershipTooltip)}</td><td>${CapacityOwnership.badgeMarkup(row.carrierType)}<span class="capacity-organization">${financeFormatCell(row.carrier)}</span></td><td>${financeFormatCell(row.driverOrganization)}</td><td>${financeFormatCell(row.vehicleOrganization)}</td>
    <td>${financeFormatCell(row.vehicleNo)}</td><td>${financeFormatCell(row.vehicleType)}</td><td>${financeFormatCell(row.driverName)}</td><td>${financeFormatCell(row.driverPhone)}</td><td>${financeFormatCell(row.pickupTime, "待完成")}</td><td>${financeFormatCell(row.completedTime, "待完成")}</td><td>${financeFormatCell(row.settlementMethod)}</td>
    <td class="finance-money-cell">${financeMoney(row.receivableAmount)}</td><td class="finance-money-cell">${financeMoney(row.payableAmount)}</td><td class="finance-money-cell">${financeMoney(row.abnormalReceivableAmount)}</td><td class="finance-money-cell">${financeMoney(row.abnormalPayableAmount)}</td><td class="finance-money-cell">${financeMoney(row.energyAmount)}</td><td class="finance-money-cell">${financeMoney(row.payrollAmount)}</td><td>${row.documentIds.length ? row.documentIds.map((id) => financeFormatCell(id)).join("<br />") : '<span class="finance-empty-value">待生成</span>'}</td><td>${financeFormatCell(row.settlementStatus)}</td>
    <td class="finance-money-cell">${financeMoney(row.vehicleTotal)}</td><td class="finance-money-cell">${financeMoney(row.laborTotal)}</td><td class="finance-money-cell total">${financeMoney(row.totalExpense)}</td><td><span class="dispatch-status ${financeStatusClass(row.status)}">${financeFormatCell(row.status)}</span></td>
    <td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn" data-finance-expense="${dashboardEscape(row.waybillNo)}" type="button">${row.totalExpense > 0 ? "编辑费用" : "费用补录"}</button></div></td>
  </tr>`).join("") : `<tr><td colspan="38" class="no-data-cell">暂无符合条件的报表明细</td></tr>`;
}

function renderFinancePagination(total) {
  const pageCount = Math.max(1, Math.ceil(total / financePageSize));
  financeCurrentPage = Math.min(Math.max(1, financeCurrentPage), pageCount);
  document.querySelector("#financeCurrentPage").textContent = String(financeCurrentPage);
  document.querySelector("#financePrevPage").disabled = financeCurrentPage <= 1;
  document.querySelector("#financeNextPage").disabled = financeCurrentPage >= pageCount;
  document.querySelector("#financePageJump").max = String(pageCount);
  document.querySelector("#financePageJump").value = String(financeCurrentPage);
  document.querySelector("#financeTotalText").textContent = `共 ${total} 条记录`;
}

function renderFinancePage(rows = getFilteredFinanceRows()) {
  const allRows = getFinanceRows();
  populateFinanceFilters(allRows);
  financePageSize = Number(document.querySelector("#financePageSize")?.value) || 10;
  renderFinanceSummary(rows);
  renderFinancePagination(rows.length);
  renderFinanceRows(rows);
  const pendingExpense = rows.filter((row) => row.totalExpense <= 0).length;
  document.querySelector("#financeActiveBadge").textContent = `待补费用 ${pendingExpense}`;
  document.querySelector("#financeQuerySummary").textContent = `筛选结果 ${rows.length} 条运输明细`;
  document.querySelector("#financeResultText").textContent = `共 ${rows.length} 条明细，按运单展示，多个集装箱在同一条记录内汇总`;
  window.lucide?.createIcons();
}

function updateFinanceExpenseTotal() {
  const form = document.querySelector("#financeExpenseForm");
  if (!form) return;
  const vehicleTotal = ["fuel", "electricity", "gas", "toll", "parking", "vehicleOther"].reduce((sum, field) => sum + financeNumber(form.elements[field]?.value), 0);
  const laborTotal = ["taskShare", "subsidy", "insurance", "labor", "service"].reduce((sum, field) => sum + financeNumber(form.elements[field]?.value), 0);
  document.querySelector("#financeExpenseTotal").textContent = `车辆费用 ${financeMoney(vehicleTotal)} · 司机劳务费 ${financeMoney(laborTotal)}`;
}

function openFinanceExpenseDialog(waybillNo) {
  const row = getFinanceRows().find((item) => item.waybillNo === waybillNo);
  const dialog = document.querySelector("#financeExpenseDialog");
  const form = document.querySelector("#financeExpenseForm");
  if (!row || !dialog || !form) return;
  financeEditingWaybillNo = waybillNo;
  const expense = getFinanceExpense(waybillNo);
  form.reset();
  financeExpenseFields.forEach((field) => { if (form.elements[field]) form.elements[field].value = expense[field] || ""; });
  form.elements.remark.value = expense.remark || "";
  document.querySelector("#financeExpenseSubtitle").textContent = `${row.waybillNo} · ${row.customerName || "未填写客户"} · ${row.routeName}`;
  document.querySelector("#financeExpenseContext").innerHTML = `<div><span>司机 / 车号</span><strong>${financeFormatCell(row.driverName)} / ${financeFormatCell(row.vehicleNo)}</strong></div><div><span>运输状态</span><strong><span class="dispatch-status ${financeStatusClass(row.status)}">${financeFormatCell(row.status)}</span></strong></div><div><span>结算方式</span><strong>${financeFormatCell(row.settlementMethod)}</strong></div><div><span>箱信息</span><strong>${financeFormatCell(row.boxes)} · ${financeFormatCell(row.boxTypes)}</strong></div>`;
  updateFinanceExpenseTotal();
  dialog.showModal();
}

function closeFinanceExpenseDialog() {
  const dialog = document.querySelector("#financeExpenseDialog");
  if (dialog?.open) dialog.close();
  financeEditingWaybillNo = "";
}

const DRIVER_EXPENSE_STORAGE_KEY = "container-logistics-driver-expenses-v1";
const driverExpenseSeed = [
  { id: "EXP-20261012001", driverId: "SJ-1002", type: "fuel", typeLabel: "加油", amount: "680.00", date: "2026-10-12", receiptName: "加油电子发票-1011.pdf", remark: "外高桥港区加油", dispatchId: "PD-1011", waybillNo: "WB20261012011", vehicleId: "沪D·A9021", status: "pending", createdAt: "2026-10-12T12:05:00" },
  { id: "EXP-20261012002", driverId: "SJ-1002", type: "parking", typeLabel: "停车费", amount: "60.00", date: "2026-10-12", receiptName: "临港停车凭证.jpg", remark: "临港堆场停车", dispatchId: "PD-1012", waybillNo: "WB20261012012", vehicleId: "沪D·A9021", status: "pending", createdAt: "2026-10-12T13:18:00" },
  { id: "EXP-20261012003", driverId: "SJ-1002", type: "container", typeLabel: "提箱费", amount: "320.00", date: "2026-10-12", receiptName: "提箱缴费单-1014.pdf", remark: "洋山港提重箱", dispatchId: "PD-1014", waybillNo: "WB20261012014", vehicleId: "沪D·A9021", status: "pending", createdAt: "2026-10-12T11:02:00" },
  { id: "EXP-20260920001", driverId: "SJ-1002", type: "toll", typeLabel: "路桥费", amount: "186.00", date: "2026-09-20", receiptName: "高速通行凭证.pdf", remark: "芦潮港至嘉兴高速费", dispatchId: "PD-1008", waybillNo: "WB20260920008", vehicleId: "沪D·A9021", status: "approved", reviewedBy: "系统管理员", reviewedAt: "2026-09-20 18:30", rejectionReason: "", createdAt: "2026-09-20T16:12:00" },
  { id: "EXP-20260919001", driverId: "SJ-1002", type: "other", typeLabel: "装卸等待费", customType: "装卸等待费", amount: "150.00", date: "2026-09-19", receiptName: "", remark: "等待时间不足计费标准", dispatchId: "PD-1009", waybillNo: "WB20260919009", vehicleId: "沪D·A9021", status: "rejected", reviewedBy: "系统管理员", reviewedAt: "2026-09-19 16:05", rejectionReason: "请补充现场等待证明后重新上报", createdAt: "2026-09-19T12:20:00" },
  { id: "EXP-20260916001", driverId: "SJ-1001", type: "repair", typeLabel: "维修", amount: "480.00", date: "2026-09-16", receiptName: "轮胎维修收据.jpg", remark: "运输途中补胎", dispatchId: "PD-1001", waybillNo: "WB20260916001", vehicleId: "浙B·K7812", status: "approved", reviewedBy: "系统管理员", reviewedAt: "2026-09-16 17:40", rejectionReason: "", createdAt: "2026-09-16T14:26:00" },
];
const driverExpenseTypeLabels = {
  fuel: "加油",
  electricity: "充电",
  gas: "燃气费",
  toll: "路桥费",
  parking: "停车费",
  repair: "维修",
  container: "提箱费",
  other: "其他",
};
let driverExpenseRecords = loadDriverExpenseRecords();
let driverExpenseCurrentPage = 1;
let driverExpensePageSize = 10;
let driverExpenseVisiblePendingIds = [];
let reviewingDriverExpenseId = "";
let driverExpenseClientWindow = null;
const selectedDriverExpenseIds = new Set();

function normalizeDriverExpenseRecord(item, index = 0) {
  const status = ["pending", "approved", "rejected"].includes(item?.status) ? item.status : "pending";
  return {
    ...item,
    id: String(item?.id || `EXP-${Date.now()}-${index + 1}`),
    driverId: String(item?.driverId || ""),
    type: String(item?.type || "other"),
    typeLabel: String(item?.typeLabel || driverExpenseTypeLabels[item?.type] || "其他"),
    amount: Math.max(0, financeNumber(item?.amount)).toFixed(2),
    date: String(item?.date || ""),
    status,
    receiptName: String(item?.receiptName || ""),
    remark: String(item?.remark || ""),
    reviewedBy: String(item?.reviewedBy || ""),
    reviewedAt: String(item?.reviewedAt || ""),
    rejectionReason: String(item?.rejectionReason || ""),
    createdAt: String(item?.createdAt || ""),
  };
}

function loadDriverExpenseRecords() {
  try {
    const stored = JSON.parse(localStorage.getItem(DRIVER_EXPENSE_STORAGE_KEY) || "null");
    const source = Array.isArray(stored) && stored.length ? stored : driverExpenseSeed;
    return source.map(normalizeDriverExpenseRecord);
  } catch (error) {
    console.warn("司机费用数据读取失败，使用初始数据。", error);
    return driverExpenseSeed.map(normalizeDriverExpenseRecord);
  }
}

function saveDriverExpenseRecords() {
  try { localStorage.setItem(DRIVER_EXPENSE_STORAGE_KEY, JSON.stringify(driverExpenseRecords)); } catch (error) { console.warn("司机费用数据保存失败。", error); }
}

function postApprovedDriverExpensesToFinance(recordIds = null) {
  const allowedIds = recordIds ? new Set(recordIds) : null;
  const fieldByType = { fuel: "fuel", electricity: "electricity", gas: "gas", toll: "toll", parking: "parking" };
  let changed = false;
  driverExpenseRecords.forEach((record) => {
    if (record.status !== "approved" || !record.waybillNo || (allowedIds && !allowedIds.has(record.id))) return;
    const current = financeExpenseRecords[record.waybillNo] || {};
    const postedIds = Array.isArray(current.driverExpenseIds) ? current.driverExpenseIds : [];
    if (postedIds.includes(record.id)) return;
    const field = fieldByType[record.type] || "vehicleOther";
    current[field] = financeNumber(current[field]) + financeNumber(record.amount);
    current.driverExpenseIds = [...postedIds, record.id];
    current.driverExpenseAmount = financeNumber(current.driverExpenseAmount) + financeNumber(record.amount);
    financeExpenseRecords[record.waybillNo] = current;
    record.costPostedAt = record.costPostedAt || window.DispatchStore.nowText();
    changed = true;
  });
  if (changed) {
    saveFinanceExpenseRecords();
    saveDriverExpenseRecords();
  }
  return changed;
}

postApprovedDriverExpensesToFinance();

function mergeDriverExpenseRecords(incoming) {
  const merged = new Map(driverExpenseRecords.map((item) => [item.id, item]));
  incoming.map(normalizeDriverExpenseRecord).forEach((item) => {
    const current = merged.get(item.id);
    if (current && current.status !== "pending" && item.status === "pending") {
      merged.set(item.id, { ...item, status: current.status, reviewedBy: current.reviewedBy, reviewedAt: current.reviewedAt, rejectionReason: current.rejectionReason });
      return;
    }
    merged.set(item.id, item);
  });
  driverExpenseRecords = [...merged.values()];
}

function notifyDriverExpenseClient() {
  if (driverExpenseClientWindow && !driverExpenseClientWindow.closed) {
    driverExpenseClientWindow.postMessage({ type: "driver-expense-sync-data", expenses: driverExpenseRecords }, "*");
  }
}

function getDriverExpenseRows() {
  return driverExpenseRecords
    .map((item) => {
      const driver = drivers.find((record) => record.id === item.driverId);
      const vehicle = vehicles.find((record) => record.plateNo === item.vehicleId);
      const dispatch = dispatches.find((record) => record.waybillNo === item.waybillNo && record.driverId === item.driverId) || dispatches.find((record) => record.waybillNo === item.waybillNo);
      const snapshot = dispatch || getCapacityOwnershipSnapshot(item.driverId, item.vehicleId, "");
      return {
        ...item,
        driverName: driver?.name || item.driverName || "未知司机",
        capacityOwnership: item.capacityOwnershipSnapshot || snapshot.capacityOwnershipSnapshot || snapshot.type || CapacityOwnership.groupSnapshot([driver, vehicle].filter(Boolean)).type,
        capacityOwnershipTooltip: item.capacityOwnershipTooltipSnapshot || dispatch?.capacityOwnershipTooltipSnapshot || "",
        driverOrganization: organizationDisplayName(item.driverOrganizationSnapshot || dispatch?.driverOrganizationSnapshot || (driver ? CapacityOwnership.organizationName(driver) : "待确定")),
        vehicleOrganization: organizationDisplayName(item.vehicleOrganizationSnapshot || dispatch?.vehicleOrganizationSnapshot || (vehicle ? CapacityOwnership.organizationName(vehicle) : "待确定")),
      };
    })
    .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")));
}

function getFilteredDriverExpenseRows(rows = getDriverExpenseRows()) {
  const form = document.querySelector("#driverExpenseQueryForm");
  if (!form) return rows;
  const data = new FormData(form);
  const filtered = window.ExpenseReport.filterRecords(rows, {
    driverId: String(data.get("driverId") || ""),
    keyword: String(data.get("keyword") || ""),
    type: String(data.get("type") || ""),
    status: String(data.get("status") || ""),
    startDate: String(data.get("startDate") || ""),
    endDate: String(data.get("endDate") || ""),
  });
  return filtered.filter((item) => CapacityOwnership.matchesFilter(item.capacityOwnership, String(data.get("capacityOwnership") || "")));
}

function driverExpenseStatusMeta(status) {
  return {
    pending: { label: "待审核", className: "pending" },
    approved: { label: "已通过", className: "approved" },
    rejected: { label: "已驳回", className: "rejected" },
  }[status] || { label: "待审核", className: "pending" };
}

function driverExpenseDateTime(value) {
  const text = String(value || "").trim();
  return text ? text.replace("T", " ").slice(0, 16) : "";
}

function populateDriverExpenseFilters(rows) {
  const driverSelect = document.querySelector("#driverExpenseDriverFilter");
  const typeSelect = document.querySelector("#driverExpenseTypeFilter");
  if (driverSelect) {
    const current = driverSelect.value;
    const options = [...new Map(rows.map((item) => [item.driverId, item.driverName]).filter(([id]) => id)).entries()];
    driverSelect.innerHTML = `<option value="">全部司机</option>${options.map(([id, name]) => `<option value="${dashboardEscape(id)}">${dashboardEscape(name)}</option>`).join("")}`;
    driverSelect.value = options.some(([id]) => id === current) ? current : "";
  }
  if (typeSelect) {
    const current = typeSelect.value;
    const types = [...new Set(rows.map((item) => item.type).filter(Boolean))];
    typeSelect.innerHTML = `<option value="">全部类型</option>${types.map((type) => `<option value="${dashboardEscape(type)}">${dashboardEscape(driverExpenseTypeLabels[type] || "其他")}</option>`).join("")}`;
    typeSelect.value = types.includes(current) ? current : "";
  }
}

function renderDriverExpenseSummary(rows) {
  const pending = rows.filter((item) => item.status === "pending");
  const approved = rows.filter((item) => item.status === "approved");
  const rejected = rows.filter((item) => item.status === "rejected");
  const amount = rows.reduce((sum, item) => sum + financeNumber(item.amount), 0);
  document.querySelector("#driverExpenseSummary").innerHTML = [
    ["待审核", pending.length, financeMoney(pending.reduce((sum, item) => sum + financeNumber(item.amount), 0)), "pending"],
    ["已通过", approved.length, financeMoney(approved.reduce((sum, item) => sum + financeNumber(item.amount), 0)), "completed"],
    ["已驳回", rejected.length, "需司机补充后重新上报", "rejected"],
    ["筛选费用合计", financeMoney(amount), `${rows.length} 条费用明细`, "total"],
  ].map(([label, value, note, className]) => `<div class="finance-summary-card ${className}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join("");
}

function renderDriverExpenseRows(rows) {
  const body = document.querySelector("#driverExpenseBody");
  const start = (driverExpenseCurrentPage - 1) * driverExpensePageSize;
  const visible = rows.slice(start, start + driverExpensePageSize);
  driverExpenseVisiblePendingIds = visible.filter((item) => item.status === "pending").map((item) => item.id);
  body.innerHTML = visible.length ? visible.map((item) => {
    const status = driverExpenseStatusMeta(item.status);
    const reviewInfo = item.status === "pending"
      ? '<span class="finance-empty-value">等待审核</span>'
      : `<span class="driver-expense-review-meta">${financeFormatCell(item.reviewedBy)}<small>${financeFormatCell(item.reviewedAt)}</small>${item.rejectionReason ? `<small class="rejection">${dashboardEscape(item.rejectionReason)}</small>` : ""}</span>`;
    const actions = item.status === "pending"
      ? `<button class="link-btn success-link" data-driver-expense-action="approve" data-driver-expense-id="${dashboardEscape(item.id)}" type="button">通过</button><button class="link-btn danger-link" data-driver-expense-action="reject" data-driver-expense-id="${dashboardEscape(item.id)}" type="button">驳回</button>`
      : `<button class="link-btn" data-driver-expense-action="view" data-driver-expense-id="${dashboardEscape(item.id)}" type="button">查看</button>`;
    return `<tr data-driver-expense-row="${dashboardEscape(item.id)}">
      <td class="check-col"><input class="driver-expense-checkbox" type="checkbox" value="${dashboardEscape(item.id)}" aria-label="选择费用 ${dashboardEscape(item.id)}" ${item.status === "pending" ? "" : "disabled"} ${selectedDriverExpenseIds.has(item.id) ? "checked" : ""} /></td>
      <td><strong class="primary-text">${dashboardEscape(item.id)}</strong></td><td>${financeFormatCell(item.driverName)}</td><td>${financeFormatCell(item.waybillNo)}</td><td>${financeFormatCell(item.vehicleId)}</td><td>${CapacityOwnership.badgeMarkup(item.capacityOwnership, item.capacityOwnershipTooltip)}</td><td>${financeFormatCell(item.driverOrganization)}</td><td>${financeFormatCell(item.vehicleOrganization)}</td><td>${financeFormatCell(item.typeLabel)}</td><td class="finance-money-cell">${financeMoney(item.amount)}</td><td>${financeFormatCell(item.date)}</td><td class="driver-expense-receipt">${financeFormatCell(item.receiptName, "未上传")}</td><td class="driver-expense-remark">${financeFormatCell(item.remark, "无")}</td><td>${financeFormatCell(driverExpenseDateTime(item.createdAt))}</td><td><span class="driver-expense-status ${status.className}">${status.label}</span></td><td>${reviewInfo}</td><td class="fixed-action-column"><div class="vehicle-action-group">${actions}</div></td>
    </tr>`;
  }).join("") : '<tr><td colspan="17" class="empty-table-cell">暂无符合条件的费用上报记录</td></tr>';
}

function renderDriverExpenseSelectionState(rows) {
  const validPendingIds = new Set(getDriverExpenseRows().filter((item) => item.status === "pending").map((item) => item.id));
  [...selectedDriverExpenseIds].forEach((id) => { if (!validPendingIds.has(id)) selectedDriverExpenseIds.delete(id); });
  const selectedVisible = driverExpenseVisiblePendingIds.filter((id) => selectedDriverExpenseIds.has(id)).length;
  const selectAll = document.querySelector("#driverExpenseSelectAll");
  selectAll.checked = driverExpenseVisiblePendingIds.length > 0 && selectedVisible === driverExpenseVisiblePendingIds.length;
  selectAll.indeterminate = selectedVisible > 0 && selectedVisible < driverExpenseVisiblePendingIds.length;
  selectAll.disabled = !driverExpenseVisiblePendingIds.length;
  const selectedPending = [...selectedDriverExpenseIds].filter((id) => validPendingIds.has(id));
  const filteredPending = rows.filter((item) => item.status === "pending");
  document.querySelector("#driverExpenseApproveSelectedBtn").disabled = !selectedPending.length;
  document.querySelector("#driverExpenseApproveAllBtn").disabled = !filteredPending.length;
  document.querySelector("#driverExpenseResultText").textContent = `共 ${rows.length} 条明细，已选择 ${selectedPending.length} 条`;
  document.querySelector("#driverExpensePendingBadge").textContent = `待审核 ${filteredPending.length}`;
}

function renderDriverExpensePagination(total) {
  const pageCount = Math.max(1, Math.ceil(total / driverExpensePageSize));
  driverExpenseCurrentPage = Math.min(Math.max(1, driverExpenseCurrentPage), pageCount);
  document.querySelector("#driverExpenseCurrentPage").textContent = String(driverExpenseCurrentPage);
  document.querySelector("#driverExpensePrevPage").disabled = driverExpenseCurrentPage <= 1;
  document.querySelector("#driverExpenseNextPage").disabled = driverExpenseCurrentPage >= pageCount;
  document.querySelector("#driverExpensePageJump").max = String(pageCount);
  document.querySelector("#driverExpensePageJump").value = String(driverExpenseCurrentPage);
  document.querySelector("#driverExpenseTotalText").textContent = `共 ${total} 条记录`;
}

function renderDriverExpensePage() {
  const allRows = getDriverExpenseRows();
  populateDriverExpenseFilters(allRows);
  const rows = getFilteredDriverExpenseRows(allRows);
  driverExpensePageSize = Number(document.querySelector("#driverExpensePageSize")?.value) || 10;
  renderDriverExpenseSummary(rows);
  renderDriverExpensePagination(rows.length);
  renderDriverExpenseRows(rows);
  renderDriverExpenseSelectionState(rows);
  document.querySelector("#driverExpenseQuerySummary").textContent = `筛选结果 ${rows.length} 条费用明细`;
  window.lucide?.createIcons();
}

function openDriverExpenseReview(recordId, mode = "view") {
  const item = getDriverExpenseRows().find((record) => record.id === recordId);
  if (!item) return;
  reviewingDriverExpenseId = item.id;
  const status = driverExpenseStatusMeta(item.status);
  const canReview = item.status === "pending";
  document.querySelector("#driverExpenseReviewTitle").textContent = mode === "reject" ? "驳回费用上报" : canReview ? "费用审核" : "费用审核详情";
  document.querySelector("#driverExpenseReviewSubtitle").textContent = `${item.id} · ${item.driverName} · ${item.waybillNo || "未关联运单"}`;
  document.querySelector("#driverExpenseReviewContent").innerHTML = `
    <div class="certification-review-summary driver-expense-review-summary">
      <div><span>司机</span><strong>${financeFormatCell(item.driverName)}</strong></div><div><span>关联运单</span><strong>${financeFormatCell(item.waybillNo)}</strong></div><div><span>车辆</span><strong>${financeFormatCell(item.vehicleId)}</strong></div>
      <div><span>费用类型</span><strong>${financeFormatCell(item.typeLabel)}</strong></div><div><span>费用金额</span><strong>${financeMoney(item.amount)}</strong></div><div><span>发生日期</span><strong>${financeFormatCell(item.date)}</strong></div>
      <div><span>费用凭证</span><strong>${financeFormatCell(item.receiptName, "未上传")}</strong></div><div><span>上报时间</span><strong>${financeFormatCell(driverExpenseDateTime(item.createdAt))}</strong></div><div><span>审核状态</span><strong><em class="driver-expense-status ${status.className}">${status.label}</em></strong></div>
    </div>
    <div class="driver-expense-review-note"><span>备注说明</span><p>${financeFormatCell(item.remark, "无")}</p>${item.rejectionReason ? `<span>驳回原因</span><p class="rejection">${dashboardEscape(item.rejectionReason)}</p>` : ""}</div>`;
  const reasonField = document.querySelector("#driverExpenseRejectReasonField");
  const reasonInput = document.querySelector("#driverExpenseRejectReason");
  const correctionFields = document.querySelector("#driverExpenseCorrectionFields");
  correctionFields.hidden = !canReview;
  const waybillSelect = document.querySelector("#driverExpenseCorrectedWaybill");
  const selectableDispatches = dispatches.filter((dispatch) => dispatch.status !== "待派单");
  waybillSelect.innerHTML = selectableDispatches.map((dispatch) => `<option value="${dashboardEscape(dispatch.waybillNo)}">${dashboardEscape(dispatch.waybillNo)} · ${dashboardEscape(dispatch.driverName || "待分配")}</option>`).join("");
  waybillSelect.value = item.waybillNo;
  const vehicleSelect = document.querySelector("#driverExpenseCorrectedVehicle");
  vehicleSelect.innerHTML = vehicles.map((vehicle) => `<option value="${dashboardEscape(vehicle.plateNo)}">${dashboardEscape(vehicle.plateNo)}</option>`).join("");
  vehicleSelect.value = item.vehicleId;
  document.querySelector("#driverExpenseCorrectedType").value = item.type;
  document.querySelector("#driverExpenseCorrectedAmount").value = item.amount;
  document.querySelector("#driverExpenseCorrectedDate").value = item.date;
  document.querySelector("#driverExpenseCorrectedReceipt").value = item.receiptName || "";
  document.querySelector("#driverExpenseCorrectedOriginalRemark").value = item.remark || "";
  document.querySelector("#driverExpenseCorrectedRemark").value = item.reviewRemark || "";
  reasonField.hidden = !canReview;
  reasonInput.value = "";
  reasonInput.setCustomValidity("");
  document.querySelector("#cancelDriverExpenseReviewBtn").textContent = canReview ? "取消" : "关闭";
  document.querySelector("#rejectDriverExpenseBtn").hidden = !canReview;
  document.querySelector("#approveDriverExpenseBtn").hidden = !canReview;
  document.querySelector("#driverExpenseReviewDialog").showModal();
  if (mode === "reject" && canReview) setTimeout(() => reasonInput.focus(), 0);
}

function closeDriverExpenseReview() {
  const dialog = document.querySelector("#driverExpenseReviewDialog");
  if (dialog?.open) dialog.close();
  reviewingDriverExpenseId = "";
  document.querySelector("#driverExpenseRejectReason").value = "";
}

function applyDriverExpenseReview(recordIds, result, rejectionReason = "") {
  const pendingIds = new Set(driverExpenseRecords.filter((item) => item.status === "pending").map((item) => item.id));
  const ids = recordIds.filter((id) => pendingIds.has(id));
  if (!ids.length) return 0;
  driverExpenseRecords = window.ExpenseReport.applyReview(driverExpenseRecords, ids, result, {
    reviewedAt: window.DispatchStore.nowText(),
    reviewedBy: "系统管理员",
    rejectionReason,
  });
  if (result === "approved") {
    postApprovedDriverExpensesToFinance(ids);
  }
  ids.forEach((id) => selectedDriverExpenseIds.delete(id));
  saveDriverExpenseRecords();
  notifyDriverExpenseClient();
  renderDriverExpensePage();
  window.SettlementManager?.render();
  return ids.length;
}

function reviewCurrentDriverExpense(result) {
  if (!reviewingDriverExpenseId) return;
  const reasonInput = document.querySelector("#driverExpenseRejectReason");
  const reason = reasonInput.value.trim();
  if (result === "rejected" && !reason) {
    reasonInput.setCustomValidity("驳回费用时请填写具体原因");
    reasonInput.reportValidity();
    return;
  }
  reasonInput.setCustomValidity("");
  if (result === "approved") {
    const item = driverExpenseRecords.find((record) => record.id === reviewingDriverExpenseId);
    const amountInput = document.querySelector("#driverExpenseCorrectedAmount");
    const dateInput = document.querySelector("#driverExpenseCorrectedDate");
    if (!financeNumber(amountInput.value) || !dateInput.value) {
      amountInput.setCustomValidity(!financeNumber(amountInput.value) ? "审核金额必须大于 0" : "");
      if (!financeNumber(amountInput.value)) amountInput.reportValidity(); else dateInput.reportValidity();
      return;
    }
    const correctedType = document.querySelector("#driverExpenseCorrectedType").value;
    item.originalSubmission ||= { waybillNo: item.waybillNo, dispatchId: item.dispatchId, vehicleId: item.vehicleId, type: item.type, typeLabel: item.typeLabel, amount: item.amount, date: item.date, receiptName: item.receiptName, remark: item.remark };
    const correctedWaybillNo = document.querySelector("#driverExpenseCorrectedWaybill").value;
    const correctedDispatch = dispatches.find((dispatch) => dispatch.waybillNo === correctedWaybillNo);
    item.waybillNo = correctedWaybillNo;
    item.dispatchId = correctedDispatch?.id || item.dispatchId;
    item.vehicleId = document.querySelector("#driverExpenseCorrectedVehicle").value;
    item.type = correctedType;
    item.typeLabel = driverExpenseTypeLabels[correctedType] || "其他";
    item.amount = financeNumber(amountInput.value).toFixed(2);
    item.date = dateInput.value;
    item.receiptName = document.querySelector("#driverExpenseCorrectedReceipt").value.trim();
    item.remark = document.querySelector("#driverExpenseCorrectedOriginalRemark").value.trim();
    item.reviewRemark = document.querySelector("#driverExpenseCorrectedRemark").value.trim();
    item.correctedAt = window.DispatchStore.nowText();
    item.correctedBy = "系统管理员";
  }
  const count = applyDriverExpenseReview([reviewingDriverExpenseId], result, reason);
  closeDriverExpenseReview();
  document.querySelector("#driverExpenseResultText").textContent = result === "approved" ? `已通过 ${count} 条费用上报` : `已驳回 ${count} 条费用上报`;
}

const vehicleRepairQueryForm = document.querySelector("#vehicleRepairQueryForm");
const vehicleRepairRecordQueryForm = document.querySelector("#vehicleRepairRecordQueryForm");
const vehicleRepairForm = document.querySelector("#vehicleRepairForm");
const vehicleRepairItemForm = document.querySelector("#vehicleRepairItemForm");
const maintenanceFeeQueryForm = document.querySelector("#maintenanceFeeQueryForm");
const maintenanceFeeForm = document.querySelector("#maintenanceFeeForm");
let editingVehicleRepairId = "";
let editingVehicleRepairItemId = "";
let editingMaintenanceFeeId = "";
let vehicleRepairDraftItems = [];
let repairShopActiveIndex = -1;

function getFilteredVehicleRepairs() {
  if (!vehicleRepairQueryForm) return vehicleRepairRecords.slice();
  const query = new FormData(vehicleRepairQueryForm);
  const plate = normalize(query.get("plateNo"));
  const status = query.get("status");
  const source = query.get("source");
  const category = query.get("category");
  const reporterName = normalize(query.get("reporterName"));
  const fromDate = query.get("fromDate");
  const toDate = query.get("toDate");
  const capacityOwnership = query.get("capacityOwnership");
  return vehicleRepairRecords.filter((record) => {
    const date = String(record.createdAt || record.reportedAt || "").slice(0, 10);
    return normalize(record.plateNo).includes(plate)
      && (!status || record.status === status)
      && (!source || record.source === source)
      && (!category || record.category === category)
      && normalize(record.reporterName || record.createdBy).includes(reporterName)
      && (!fromDate || date >= fromDate)
      && (!toDate || date <= toDate)
      && CapacityOwnership.matchesFilter(record.capacityOwnershipSnapshot || vehicles.find((item) => item.plateNo === record.plateNo)?.capacityOwnership, capacityOwnership, true);
  }).sort((left, right) => String(right.reportedAt).localeCompare(String(left.reportedAt)));
}

function renderVehicleRepairPage() {
  const rows = getFilteredVehicleRepairs();
  const openCount = vehicleRepairRecords.filter((record) => window.VehicleRepair.OPEN_STATUSES.has(record.status)).length;
  const doneCount = vehicleRepairRecords.filter((record) => record.status === "已完成").length;
  const actualTotal = vehicleRepairRecords.filter((record) => record.status === "已完成").reduce((sum, record) => sum + Number(record.actualCost || 0), 0);
  const summary = document.querySelector("#vehicleRepairSummary");
  const body = document.querySelector("#vehicleRepairBody");
  if (!summary || !body) return;
  summary.innerHTML = `
    <article class="repair-summary-item"><span>全部工单</span><strong>${vehicleRepairRecords.length}</strong><small>维修、保养及维护费用</small></article>
    <article class="repair-summary-item in-progress"><span>待处理 / 维修中</span><strong>${openCount}</strong><small>车辆暂不可派单</small></article>
    <article class="repair-summary-item completed"><span>已完成工单</span><strong>${doneCount}</strong><small>累计费用 ¥${actualTotal.toFixed(2)}</small></article>`;
  body.innerHTML = rows.length ? rows.map((record) => `<tr>
    <td><strong>${dashboardEscape(record.repairNo)}</strong></td>
    <td><strong>${dashboardEscape(record.plateNo)}</strong><small>${dashboardEscape(record.vehicleType || "")}</small></td>
    <td><strong>${dashboardEscape(record.category || "维修")}</strong><small class="repair-cell-description">${dashboardEscape(record.description)}</small></td>
    <td><strong>${record.items?.length || 0} 项</strong><small>${dashboardEscape((record.items || []).map((item) => item.feeName).slice(0, 2).join("、") || "历史费用")}</small></td>
    <td><strong>${dashboardEscape(record.repairVendor || record.items?.find((item) => item.serviceProvider)?.serviceProvider || "-")}</strong><small>${dashboardEscape(record.repairLocation || "")}</small></td>
    <td><strong>${dashboardEscape(String(record.createdAt || record.reportedAt || "-").replace("T", " ").slice(0, 16))}</strong><small>${dashboardEscape(record.reporterName || record.createdBy || "-")}</small></td>
    <td>${dashboardEscape(String(record.repairedAt || "-").replace("T", " ").slice(0, 16))}</td>
    <td><span class="repair-status-pill ${record.status === "已完成" ? "done" : record.status === "已取消" ? "cancelled" : record.status === "维修中" ? "working" : "pending"}">${dashboardEscape(record.status)}</span></td>
    <td class="money"><strong>¥${Number(record.actualCost || 0).toFixed(2)}</strong></td>
    <td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn" data-edit-repair="${dashboardEscape(record.id)}" type="button">处理</button></div></td>
  </tr>`).join("") : '<tr><td class="no-data-cell" colspan="10">暂无符合条件的维修保养工单</td></tr>';
  document.querySelector("#vehicleRepairResultText").textContent = `共 ${rows.length} 条维修保养工单`;
  fillVehicleRepairRecordFeeOptions();
  renderVehicleRepairRecords();
  window.lucide?.createIcons();
}

function fillVehicleRepairVehicleOptions(selectedPlate = "") {
  const select = vehicleRepairForm?.elements.plateNo;
  if (!select) return;
  select.innerHTML = '<option value="">请选择车辆</option>' + vehicles.map((vehicle) => {
    const hasActive = window.VehicleRepair.hasOpenRepair(vehicleRepairRecords, vehicle.plateNo, editingVehicleRepairId);
    return `<option value="${dashboardEscape(vehicle.plateNo)}" ${vehicle.plateNo === selectedPlate ? "selected" : ""}>${dashboardEscape(vehicle.plateNo)} · ${dashboardEscape(vehicle.vehicleType)}${hasActive ? " · 有进行中维修工单" : ""}</option>`;
  }).join("");
}

function getRepairShopPickerElements() {
  return {
    root: vehicleRepairForm?.querySelector?.("[data-repair-shop-combobox]"),
    search: document.querySelector("#repairVendorSearch"),
    value: vehicleRepairForm?.elements.repairVendorCustomerNo,
    options: document.querySelector("#repairVendorOptions"),
    hint: document.querySelector("#repairVendorHint"),
  };
}

function closeRepairShopOptions() {
  const { root, search, options } = getRepairShopPickerElements();
  root?.classList.remove("open");
  if (search) search.setAttribute("aria-expanded", "false");
  if (options) options.hidden = true;
  repairShopActiveIndex = -1;
}

function renderRepairShopOptions(query = "") {
  const { root, search, options } = getRepairShopPickerElements();
  if (!root || !search || !options) return;
  const source = window.CustomerManager?.getRepairShops?.() || [];
  const shops = window.VehicleRepair.searchRepairShops(source, query);
  repairShopActiveIndex = shops.length ? 0 : -1;
  if (shops.length) {
    options.innerHTML = shops.map((shop, index) => {
      const phone = shop.mobile || shop.phone || "未维护电话";
      return `<button class="repair-shop-option${index === 0 ? " active" : ""}" type="button" role="option" aria-selected="${index === 0}" data-repair-shop-option="${dashboardEscape(shop.customerNo)}"><strong>${dashboardEscape(shop.customerName)}</strong><span>${dashboardEscape(shop.customerNo)}</span><small>${dashboardEscape(shop.contactName || "未维护联系人")} · ${dashboardEscape(phone)}</small></button>`;
    }).join("");
  } else {
    const hasRepairShops = source.length > 0;
    options.innerHTML = `<div class="repair-shop-empty"><strong>${hasRepairShops ? "未找到匹配的维修厂" : "暂无可用维修厂"}</strong><span>${hasRepairShops ? "可换维修厂名称、联系人或电话再次检索。" : "请先在客户管理中新增“维修厂”类型并设为启用。"}</span><button type="button" data-create-repair-shop>前往客户管理新增</button></div>`;
  }
  root.classList.add("open");
  search.setAttribute("aria-expanded", "true");
  options.hidden = false;
}

function selectRepairShop(shop, autofill = true) {
  const { search, value, hint } = getRepairShopPickerElements();
  if (!search || !value || !shop) return;
  search.value = shop.customerName || "";
  search.dataset.selectedLabel = shop.customerName || "";
  search.dataset.selectionMode = "directory";
  value.value = shop.customerNo || "";
  if (hint) {
    hint.textContent = `${shop.customerNo} · ${shop.contactName || "未维护联系人"} · ${shop.mobile || shop.phone || "未维护电话"}`;
    hint.classList.remove("warning");
    hint.classList.add("selected");
  }
  if (autofill) {
    if (vehicleRepairForm.elements.vendorContact) vehicleRepairForm.elements.vendorContact.value = shop.contactName || "";
    if (vehicleRepairForm.elements.vendorPhone) vehicleRepairForm.elements.vendorPhone.value = shop.mobile || shop.phone || "";
  }
  closeRepairShopOptions();
}

function fillVehicleRepairShopOptions(selectedCustomerNo = "", legacyName = "") {
  const { search, value, hint } = getRepairShopPickerElements();
  if (!search || !value) return null;
  const shops = window.CustomerManager?.getRepairShops?.() || [];
  const matchingShop = shops.find((item) => item.customerNo === selectedCustomerNo || item.customerName === legacyName);
  search.value = "";
  search.dataset.selectedLabel = "";
  search.dataset.selectionMode = "";
  value.value = "";
  if (matchingShop) selectRepairShop(matchingShop, false);
  else if (legacyName) {
    search.value = legacyName;
    search.dataset.selectedLabel = legacyName;
    search.dataset.selectionMode = "history";
    value.value = selectedCustomerNo || "";
    if (hint) {
      hint.textContent = "历史维修厂快照；该档案当前已停用或未关联，可保留历史记录或重新选择。";
      hint.classList.remove("selected");
      hint.classList.add("warning");
    }
  } else if (hint) {
    hint.textContent = "数据来自“客户管理”中已启用的维修厂";
    hint.classList.remove("selected", "warning");
  }
  closeRepairShopOptions();
  return matchingShop || null;
}

function setRepairShopRequired(required) {
  const { search, value } = getRepairShopPickerElements();
  if (search) search.required = required;
  if (value) value.required = required;
  search?.closest(".repair-shop-field")?.classList.toggle("required-field", required);
}

function repairRecordAffectsDispatch(record) {
  return record.items?.length ? record.items.some((item) => item.affectsDispatch) : ["维修", "保养", "发动机", "轮胎", "制动系统", "电气系统", "底盘与悬挂"].includes(record.category);
}

function formatRepairDateTime(value) {
  return value ? String(value).replace("T", " ").slice(0, 16) : "-";
}

function currentLocalDateTimeValue() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function renderVehicleRepairDraftItems() {
  const body = document.querySelector("#vehicleRepairItemBody");
  if (!body) return;
  body.innerHTML = vehicleRepairDraftItems.length ? vehicleRepairDraftItems.map((item, index) => `<tr>
    <td>${String(index + 1).padStart(2, "0")}</td>
    <td><strong>${dashboardEscape(item.feeName)}</strong><small>${dashboardEscape(item.feeCategory)}</small></td>
    <td><strong>${dashboardEscape(item.content)}</strong><small>${dashboardEscape(item.serviceProvider || "")}</small></td>
    <td class="money">¥${Number(item.partsCost).toFixed(2)}</td><td class="money">¥${Number(item.laborCost).toFixed(2)}</td><td class="money">¥${Number(item.otherCost).toFixed(2)}</td>
    <td class="money"><strong>¥${Number(item.subtotal).toFixed(2)}</strong></td>
    <td><div class="vehicle-action-group"><button class="link-btn" data-edit-repair-item="${dashboardEscape(item.id)}" type="button">编辑</button><button class="link-btn delete-btn" data-delete-repair-item="${dashboardEscape(item.id)}" type="button">删除</button></div></td>
  </tr>`).join("") : '<tr><td class="no-data-cell" colspan="8">暂未添加费用子目</td></tr>';
  document.querySelector("#vehicleRepairTotal").textContent = `¥${window.VehicleRepair.calculateTotal(vehicleRepairDraftItems).toFixed(2)}`;
}

function fillRepairItemFeeOptions(selectedId = "") {
  const select = vehicleRepairItemForm?.elements.feeItemId;
  if (!select) return;
  const items = vehicleMaintenanceFeeItems.filter((item) => item.enabled || item.id === selectedId);
  select.innerHTML = '<option value="">请选择费用项目</option>' + items.map((item) => `<option value="${dashboardEscape(item.id)}">${dashboardEscape(item.category)} · ${dashboardEscape(item.name)}</option>`).join("");
  select.value = selectedId;
}

function refreshRepairItemFields() {
  const feeItem = vehicleMaintenanceFeeItems.find((item) => item.id === vehicleRepairItemForm?.elements.feeItemId.value);
  if (!feeItem) {
    document.querySelectorAll(".repair-item-period").forEach((field) => { field.hidden = true; });
    document.querySelector(".repair-item-policy").hidden = true;
    document.querySelector(".repair-item-provider").hidden = false;
    ["serviceProvider", "periodStart", "periodEnd", "partsCost", "laborCost", "otherCost"].forEach((name) => { vehicleRepairItemForm.elements[name].required = false; });
    updateRepairItemSubtotal();
    return;
  }
  const direct = feeItem.costMode === "direct";
  document.querySelectorAll(".repair-item-parts, .repair-item-labor").forEach((field) => { field.hidden = direct; });
  document.querySelectorAll(".repair-item-period").forEach((field) => { field.hidden = !feeItem.periodRequired; });
  document.querySelector(".repair-item-provider").hidden = !feeItem.serviceProviderRequired;
  document.querySelector(".repair-item-policy").hidden = feeItem.category !== "保险费用";
  vehicleRepairItemForm.elements.serviceProvider.required = feeItem.serviceProviderRequired;
  vehicleRepairItemForm.elements.periodStart.required = feeItem.periodRequired;
  vehicleRepairItemForm.elements.periodEnd.required = feeItem.periodRequired;
  vehicleRepairItemForm.elements.partsCost.required = !direct;
  vehicleRepairItemForm.elements.laborCost.required = !direct;
  vehicleRepairItemForm.elements.otherCost.required = direct;
  updateRepairItemSubtotal();
}

function updateRepairItemSubtotal() {
  if (!vehicleRepairItemForm) return;
  const subtotal = ["partsCost", "laborCost", "otherCost"].reduce((sum, name) => sum + Math.max(0, Number(vehicleRepairItemForm.elements[name].value) || 0), 0);
  document.querySelector("#vehicleRepairItemSubtotal").textContent = `¥${subtotal.toFixed(2)}`;
}

function openVehicleRepairItemDialog(itemId = "") {
  editingVehicleRepairItemId = itemId;
  vehicleRepairItemForm.reset();
  const item = vehicleRepairDraftItems.find((current) => current.id === itemId);
  fillRepairItemFeeOptions(item?.feeItemId || "");
  ["content", "serviceProvider", "periodStart", "periodEnd", "policyNo", "partsCost", "laborCost", "otherCost", "remark"].forEach((name) => {
    vehicleRepairItemForm.elements[name].value = item?.[name] ?? (["partsCost", "laborCost", "otherCost"].includes(name) ? 0 : "");
  });
  document.querySelector("#vehicleRepairItemTitle").textContent = item ? "编辑费用子目" : "添加费用子目";
  document.querySelector("#vehicleRepairItemDialog").showModal();
  refreshRepairItemFields();
}

function openVehicleRepairDialog(plateNo = "", repairId = "") {
  if (!vehicleRepairForm) return;
  editingVehicleRepairId = repairId;
  vehicleRepairForm.reset();
  vehicleRepairForm.dataset.repairId = repairId;
  const record = repairId ? vehicleRepairRecords.find((item) => item.id === repairId) : null;
  document.querySelector("#vehicleRepairFormTitle").textContent = record ? `处理工单 ${record.repairNo}` : "新增维修保养工单";
  const selectedPlate = record?.plateNo || plateNo;
  fillVehicleRepairVehicleOptions(selectedPlate);
  if (selectedPlate) vehicleRepairForm.elements.plateNo.value = selectedPlate;
  const values = record || {};
  const selectedShop = fillVehicleRepairShopOptions(values.repairVendorCustomerNo, values.repairVendor);
  ["category", "description", "repairLocation", "vendorContact", "status", "result"].forEach((name) => {
    if (vehicleRepairForm.elements[name]) vehicleRepairForm.elements[name].value = values[name] ?? (name === "status" ? "待维修" : "");
  });
  vehicleRepairForm.elements.vendorContact.value = values.vendorContact || selectedShop?.contactName || "";
  vehicleRepairForm.elements.vendorPhone.value = values.vendorPhone || selectedShop?.mobile || selectedShop?.phone || "";
  const now = currentLocalDateTimeValue();
  vehicleRepairForm.elements.createdAt.value = String(values.createdAt || values.reportedAt || now).replace(" ", "T").slice(0, 16);
  vehicleRepairForm.elements.repairedAt.value = String(values.repairedAt || "").replace(" ", "T").slice(0, 16);
  setRepairShopRequired(!["保险", "审验", "北斗", "其他"].includes(values.category));
  vehicleRepairDraftItems = (values.items || []).map(window.VehicleRepair.normalizeItem);
  renderVehicleRepairDraftItems();
  vehicleRepairForm.dataset.evidence = JSON.stringify(values.evidence || []);
  const evidenceList = document.querySelector("#vehicleRepairExistingEvidence");
  evidenceList.hidden = !(values.evidence || []).length;
  evidenceList.innerHTML = (values.evidence || []).length ? `<span class="field-label">已归档凭证</span><div class="repair-evidence-links">${values.evidence.map((file) => {
    const item = typeof file === "string" ? { name: file } : file;
    return item.id ? `<button class="link-btn" data-repair-evidence="${dashboardEscape(item.id)}" type="button">${dashboardEscape(item.name)}</button>` : `<span>${dashboardEscape(item.name)}</span>`;
  }).join("")}</div>` : "";
  if (vehicleRepairForm.elements.evidenceFiles?._renderAttachmentPicker) vehicleRepairForm.elements.evidenceFiles._renderAttachmentPicker();
  document.querySelector("#vehicleRepairDialog").showModal();
  window.lucide?.createIcons();
}

function saveRepairVehicleState(plateNo, state) {
  const vehicle = vehicles.find((item) => item.plateNo === plateNo);
  if (!vehicle) return;
  vehicle.vehicleState = state;
  publishAdminDataSnapshot();
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
  renderCapacityPage(getFilteredCapacityRecords());
  window.DispatchManagement?.render();
  window.AutoDispatchManager?.refresh();
}

function persistVehicleRepairRecords() {
  vehicleRepairRecords = window.VehicleRepair.save(vehicleRepairRecords);
  publishAdminDataSnapshot();
  renderVehicleRepairPage();
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
  renderDashboard();
  renderCapacityPage(getFilteredCapacityRecords());
  renderDispatchPage(getFilteredDispatches());
  window.DispatchManagement?.render();
  window.AutoDispatchManager?.refresh();
}

async function saveVehicleRepairEvidence(recordId, files) {
  const uploadedAt = window.DispatchStore.nowText();
  const evidence = files.map((file, index) => ({
    id: `repair-${recordId}-${Date.now()}-${index}`,
    name: file.name,
    type: file.type || "application/octet-stream",
    uploadedAt,
  }));
  if (files.length) await window.DispatchStore.savePhotos(evidence.map((item, index) => ({ id: item.id, blob: files[index] })));
  return evidence;
}

function submitVehicleRepairItemForm(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const feeItem = vehicleMaintenanceFeeItems.find((item) => item.id === data.feeItemId);
  if (!feeItem) { showApplicationAlert("请选择已启用的费用项目。"); return; }
  if (feeItem.periodRequired && data.periodEnd < data.periodStart) { showApplicationAlert("结束日期不能早于开始日期。"); return; }
  const normalized = window.VehicleRepair.normalizeItem({
    ...data,
    id: editingVehicleRepairItemId || `ITEM-${Date.now()}`,
    feeItemId: feeItem.id,
    feeCode: feeItem.code,
    feeName: feeItem.name,
    feeCategory: feeItem.category,
    costMode: feeItem.costMode,
    affectsDispatch: feeItem.affectsDispatch,
    reminderEnabled: feeItem.reminderEnabled,
    reminderDays: feeItem.reminderDays,
    partsCost: feeItem.costMode === "direct" ? 0 : data.partsCost,
    laborCost: feeItem.costMode === "direct" ? 0 : data.laborCost,
    otherCost: feeItem.costMode === "direct" ? data.otherCost : data.otherCost,
  }, vehicleRepairDraftItems.length);
  if (normalized.subtotal <= 0) { showApplicationAlert("子目费用必须大于 0 元。"); return; }
  const index = vehicleRepairDraftItems.findIndex((item) => item.id === editingVehicleRepairItemId);
  if (index >= 0) vehicleRepairDraftItems.splice(index, 1, normalized);
  else vehicleRepairDraftItems.push(normalized);
  vehicleRepairDraftItems = vehicleRepairDraftItems.map((item, itemIndex) => ({ ...item, itemNo: String(itemIndex + 1).padStart(2, "0") }));
  renderVehicleRepairDraftItems();
  document.querySelector("#vehicleRepairItemDialog").close();
  editingVehicleRepairItemId = "";
}

function syncVehicleRepairCompliance(record) {
  if (!record || record.complianceSyncedAt || record.status !== "已完成") return;
  (record.items || []).forEach((item) => {
    if (item.feeCategory === "保险费用" && item.periodStart && item.periodEnd) {
      addInsurancePolicy({
        plateNo: record.plateNo,
        insuranceType: item.feeName,
        insuranceCompany: item.serviceProvider,
        policyNo: item.policyNo || `${record.repairNo}-${item.itemNo}`,
        insuredAmount: 0,
        policyStart: item.periodStart,
        policyExpiry: item.periodEnd,
        premium: item.subtotal,
        attachment: (record.evidence || [])[0]?.name || "维修保养工单",
        remark: `${record.repairNo} 自动同步`,
      });
    }
    if (item.feeCategory === "审验费用" && item.periodStart && item.periodEnd) {
      addInspectionRecord({
        plateNo: record.plateNo,
        inspectionType: item.feeName,
        inspectionDate: item.periodStart,
        nextInspectionDue: item.periodEnd,
        inspectionAgency: item.serviceProvider,
        inspectionFee: item.subtotal,
        inspectionResult: "通过",
        remark: `${record.repairNo} 自动同步`,
      });
    }
  });
  record.complianceSyncedAt = new Date().toISOString();
}

async function submitVehicleRepairForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const vehicle = vehicles.find((item) => item.plateNo === data.plateNo);
  if (!vehicle) return;
  const currentRepair = editingVehicleRepairId ? vehicleRepairRecords.find((item) => item.id === editingVehicleRepairId) : null;
  const repairShopSearch = document.querySelector("#repairVendorSearch");
  const selectedShop = data.repairVendorCustomerNo
    ? (window.CustomerManager?.getRepairShops?.() || []).find((item) => item.customerNo === data.repairVendorCustomerNo)
    : null;
  const preservesHistoricalShop = Boolean(currentRepair
    && data.repairVendorCustomerNo === currentRepair.repairVendorCustomerNo
    && repairShopSearch?.dataset.selectionMode === "history"
    && repairShopSearch.value === currentRepair.repairVendor);
  const repairShopRequired = !["保险", "审验", "北斗", "其他"].includes(data.category);
  if (repairShopRequired && !selectedShop && !preservesHistoricalShop) {
    showApplicationAlert("请从下拉列表选择客户管理中已启用的维修厂。");
    repairShopSearch?.focus();
    renderRepairShopOptions(repairShopSearch?.value || "");
    return;
  }
  if (!vehicleRepairDraftItems.length) { showApplicationAlert("请至少添加一个费用子目。"); return; }
  const existingEvidence = JSON.parse(form.dataset.evidence || "[]");
  const selectedFiles = Array.from(form.elements.evidenceFiles.files || []);
  if (selectedFiles.some((file) => file.size > 10 * 1024 * 1024)) { showApplicationAlert("单个维修凭证不能超过 10 MB。"); return; }
  const patch = {
    ...data,
    repairVendor: selectedShop?.customerName || (preservesHistoricalShop ? currentRepair?.repairVendor : "") || vehicleRepairDraftItems.find((item) => item.serviceProvider)?.serviceProvider || "",
    repairVendorCustomerNo: selectedShop?.customerNo || (preservesHistoricalShop ? currentRepair?.repairVendorCustomerNo : "") || "",
    vendorContact: data.vendorContact || selectedShop?.contactName || (preservesHistoricalShop ? currentRepair?.vendorContact : "") || "",
    vendorPhone: data.vendorPhone || selectedShop?.mobile || selectedShop?.phone || (preservesHistoricalShop ? currentRepair?.vendorPhone : "") || "",
    vehicleType: vehicle.vehicleType,
    fleet: vehicle.fleetName || vehicle.fleet,
    items: vehicleRepairDraftItems.map(window.VehicleRepair.normalizeItem),
    actualCost: window.VehicleRepair.calculateTotal(vehicleRepairDraftItems),
    createdAt: currentRepair?.createdAt || currentRepair?.reportedAt || currentLocalDateTimeValue(),
    repairedAt: data.repairedAt,
    evidence: existingEvidence,
    capacityOwnershipSnapshot: vehicle.capacityOwnership,
    vehicleOrganizationSnapshot: CapacityOwnership.organizationName(vehicle),
  };
  delete patch.evidenceFiles;
  let nextVehicleState = null;
  if (editingVehicleRepairId) {
    const current = currentRepair;
    if (!current) return;
    patch.capacityOwnershipSnapshot = current.capacityOwnershipSnapshot || patch.capacityOwnershipSnapshot;
    patch.vehicleOrganizationSnapshot = current.vehicleOrganizationSnapshot || patch.vehicleOrganizationSnapshot;
    if (current.plateNo !== patch.plateNo) {
      showApplicationAlert("维修单关联车辆不能修改，请取消后为其他车辆新建维修单。");
      return;
    }
    const targetStatus = patch.status;
    if (targetStatus !== current.status && !window.VehicleRepair.STATUS_TRANSITIONS[current.status]?.has(targetStatus)) {
      showApplicationAlert(`不能将“${current.status}”变更为“${targetStatus}”。`);
      return;
    }
    let addedEvidence = [];
    try { addedEvidence = await saveVehicleRepairEvidence(current.id, selectedFiles); }
    catch (error) { showApplicationAlert("凭证保存失败，请重试。"); return; }
    patch.evidence = [...(current.evidence || []), ...addedEvidence];
    delete patch.status;
    let next = vehicleRepairRecords.map((item) => item.id === current.id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item);
    if (targetStatus !== current.status) {
      const transitioned = window.VehicleRepair.transition(next, current.id, targetStatus, { patch });
      if (transitioned.error) { showApplicationAlert(transitioned.error); return; }
      next = transitioned.records;
      nextVehicleState = transitioned.vehicleState;
    } else if (window.VehicleRepair.OPEN_STATUSES.has(current.status) && vehicleRepairDraftItems.some((item) => item.affectsDispatch)) {
      nextVehicleState = "维修中";
    }
    vehicleRepairRecords = next;
  } else {
    const targetStatus = patch.status || "待维修";
    delete patch.status;
    const operatorName = document.querySelector("#userAccountButton .user-account-copy strong")?.textContent.trim() || "后台用户";
    const created = window.VehicleRepair.createRecord(vehicleRepairRecords, {
      ...patch,
      status: "待维修",
      source: "后台新增",
      createdBy: operatorName,
      reporterName: operatorName,
    }, { vehicleState: vehicle.vehicleState });
    if (created.error) { showApplicationAlert(created.error); return; }
    let addedEvidence = [];
    try { addedEvidence = await saveVehicleRepairEvidence(created.record.id, selectedFiles); }
    catch (error) { showApplicationAlert("凭证保存失败，请重试。"); return; }
    created.record.evidence = [...(created.record.evidence || []), ...addedEvidence];
    patch.evidence = created.record.evidence;
    vehicleRepairRecords.unshift(created.record);
    nextVehicleState = vehicleRepairDraftItems.some((item) => item.affectsDispatch) ? "维修中" : null;
    if (targetStatus !== "待维修") {
      const transitioned = window.VehicleRepair.transition(vehicleRepairRecords, created.record.id, targetStatus, { patch });
      if (transitioned.error) { showApplicationAlert(transitioned.error); return; }
      vehicleRepairRecords = transitioned.records;
      nextVehicleState = transitioned.vehicleState;
    }
  }
  const savedRecord = vehicleRepairRecords.find((item) => item.id === editingVehicleRepairId) || vehicleRepairRecords[0];
  syncVehicleRepairCompliance(savedRecord);
  if (nextVehicleState) vehicle.vehicleState = nextVehicleState;
  persistVehicleRepairRecords();
  document.querySelector("#vehicleRepairDialog").close();
  editingVehicleRepairId = "";
  vehicleRepairDraftItems = [];
}

function fillVehicleRepairRecordFeeOptions() {
  const select = vehicleRepairRecordQueryForm?.elements.feeItemId;
  if (!select) return;
  const current = select.value;
  select.innerHTML = '<option value="">全部项目</option>' + vehicleMaintenanceFeeItems.map((item) => `<option value="${dashboardEscape(item.id)}">${dashboardEscape(item.name)}</option>`).join("");
  select.value = current;
}

function getVehicleRepairRecordRows() {
  const query = vehicleRepairRecordQueryForm ? Object.fromEntries(new FormData(vehicleRepairRecordQueryForm).entries()) : {};
  const result = [];
  vehicleRepairRecords.forEach((record) => {
    const items = record.items?.length ? record.items : [window.VehicleRepair.normalizeItem({ feeName: record.category || "历史维修费用", feeCategory: "维修费用", content: record.description, serviceProvider: record.repairVendor, otherCost: record.actualCost, affectsDispatch: true })];
    items.forEach((item) => {
      const selectedDate = query.dateType === "period" ? item.periodStart : record[query.dateType || "repairedAt"];
      const date = String(selectedDate || "").slice(0, 10);
      const matchesDate = query.dateType === "period"
        ? (!query.fromDate || String(item.periodEnd || item.periodStart) >= query.fromDate) && (!query.toDate || String(item.periodStart || item.periodEnd) <= query.toDate)
        : (!query.fromDate || date >= query.fromDate) && (!query.toDate || date <= query.toDate);
      if (normalize(record.plateNo).includes(normalize(query.plateNo))
        && (!query.status || record.status === query.status)
        && (!query.feeCategory || item.feeCategory === query.feeCategory)
        && (!query.feeItemId || item.feeItemId === query.feeItemId)
        && (!query.serviceProvider || normalize(item.serviceProvider || record.repairVendor).includes(normalize(query.serviceProvider)))
        && matchesDate) result.push({ record, item });
    });
  });
  return result.sort((a, b) => String(b.record.repairedAt || b.record.createdAt).localeCompare(String(a.record.repairedAt || a.record.createdAt)));
}

function renderVehicleRepairRecords() {
  const body = document.querySelector("#vehicleRepairRecordBody");
  if (!body) return;
  const rows = getVehicleRepairRecordRows();
  const totals = rows.reduce((sum, { item }) => ({ parts: sum.parts + item.partsCost, labor: sum.labor + item.laborCost, other: sum.other + item.otherCost, total: sum.total + item.subtotal }), { parts: 0, labor: 0, other: 0, total: 0 });
  const vehiclesCount = new Set(rows.map(({ record }) => record.plateNo)).size;
  document.querySelector("#vehicleRepairRecordSummary").innerHTML = `<article><span>费用子目</span><strong>${rows.length}</strong></article><article><span>涉及车辆</span><strong>${vehiclesCount}</strong></article><article><span>配件费</span><strong>¥${totals.parts.toFixed(2)}</strong></article><article><span>工时费</span><strong>¥${totals.labor.toFixed(2)}</strong></article><article><span>其他费用</span><strong>¥${totals.other.toFixed(2)}</strong></article><article class="total"><span>费用合计</span><strong>¥${totals.total.toFixed(2)}</strong></article>`;
  body.innerHTML = rows.length ? rows.map(({ record, item }) => `<tr><td>${dashboardEscape(formatRepairDateTime(record.repairedAt))}</td><td><strong>${dashboardEscape(record.repairNo)}</strong></td><td>${dashboardEscape(record.plateNo)}</td><td><strong>${dashboardEscape(item.feeName)}</strong><small>${dashboardEscape(item.feeCategory)}</small></td><td>${dashboardEscape(item.content || record.description)}</td><td>${dashboardEscape(item.serviceProvider || record.repairVendor || "-")}</td><td>${dashboardEscape(item.periodStart && item.periodEnd ? `${item.periodStart} 至 ${item.periodEnd}` : "-")}</td><td class="money">¥${item.partsCost.toFixed(2)}</td><td class="money">¥${item.laborCost.toFixed(2)}</td><td class="money">¥${item.otherCost.toFixed(2)}</td><td class="money"><strong>¥${item.subtotal.toFixed(2)}</strong></td><td><span class="repair-status-pill ${record.status === "已完成" ? "done" : record.status === "已取消" ? "cancelled" : record.status === "维修中" ? "working" : "pending"}">${dashboardEscape(record.status)}</span></td></tr>`).join("") : '<tr><td class="no-data-cell" colspan="12">暂无符合条件的维修保养记录</td></tr>';
  document.querySelector("#vehicleRepairRecordResultText").textContent = `共 ${rows.length} 条费用明细，合计 ¥${totals.total.toFixed(2)}`;
}

function getFilteredMaintenanceFees() {
  const query = maintenanceFeeQueryForm ? Object.fromEntries(new FormData(maintenanceFeeQueryForm).entries()) : {};
  return vehicleMaintenanceFeeItems.filter((item) => (!query.keyword || normalize(`${item.code} ${item.name}`).includes(normalize(query.keyword))) && (!query.category || item.category === query.category) && (!query.status || (query.status === "enabled") === item.enabled));
}

function renderMaintenanceFeeConfig() {
  const body = document.querySelector("#maintenanceFeeBody");
  if (!body) return;
  const items = getFilteredMaintenanceFees();
  body.innerHTML = items.length ? items.map((item) => {
    const rules = [item.serviceProviderRequired ? "服务单位必填" : "服务单位选填", item.periodRequired ? "起止时间必填" : "无需起止时间", item.reminderEnabled ? `提前 ${item.reminderDays} 天提醒` : "不提醒"].join(" · ");
    return `<tr><td><strong>${dashboardEscape(item.code)}</strong><small>${dashboardEscape(item.name)}</small></td><td>${dashboardEscape(item.category)}</td><td>${item.costMode === "parts_labor" ? "配件费 + 工时费" : "直接录入金额"}</td><td><small>${dashboardEscape(rules)}</small></td><td>${item.affectsDispatch ? '<span class="repair-status-pill working">暂停派单</span>' : '<span class="repair-status-pill done">不影响</span>'}</td><td><span class="repair-status-pill ${item.enabled ? "done" : "cancelled"}">${item.enabled ? "启用" : "停用"}</span></td><td>${item.sort}</td><td>${dashboardEscape(formatRepairDateTime(item.updatedAt))}</td><td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn" data-edit-maintenance-fee="${dashboardEscape(item.id)}" type="button">编辑</button><button class="link-btn" data-toggle-maintenance-fee="${dashboardEscape(item.id)}" type="button">${item.enabled ? "停用" : "启用"}</button></div></td></tr>`;
  }).join("") : '<tr><td class="no-data-cell" colspan="9">暂无符合条件的费用项目</td></tr>';
  document.querySelector("#maintenanceFeeResultText").textContent = `共 ${items.length} 个费用项目`;
  document.querySelector("#maintenanceFeeEnabledCount").textContent = `启用 ${vehicleMaintenanceFeeItems.filter((item) => item.enabled).length}`;
}

function openMaintenanceFeeDialog(itemId = "") {
  editingMaintenanceFeeId = itemId;
  maintenanceFeeForm.reset();
  const item = vehicleMaintenanceFeeItems.find((current) => current.id === itemId);
  const values = item || { category: "维修费用", costMode: "parts_labor", sort: 100, reminderDays: 30, enabled: true };
  ["code", "name", "category", "costMode", "sort", "reminderDays", "remark"].forEach((name) => { maintenanceFeeForm.elements[name].value = values[name] ?? ""; });
  ["serviceProviderRequired", "periodRequired", "reminderEnabled", "affectsDispatch", "enabled"].forEach((name) => { maintenanceFeeForm.elements[name].checked = Boolean(values[name]); });
  document.querySelector("#maintenanceFeeDialogTitle").textContent = item ? "编辑费用项目" : "新增费用项目";
  document.querySelector("#maintenanceFeeDialog").showModal();
}

function submitMaintenanceFeeForm(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget).entries());
  ["serviceProviderRequired", "periodRequired", "reminderEnabled", "affectsDispatch", "enabled"].forEach((name) => { values[name] = event.currentTarget.elements[name].checked; });
  const error = window.VehicleMaintenanceFeeConfig.validate(vehicleMaintenanceFeeItems, values, editingMaintenanceFeeId);
  if (error) { showApplicationAlert(error); return; }
  const item = window.VehicleMaintenanceFeeConfig.normalize({ ...values, id: editingMaintenanceFeeId || undefined, updatedAt: new Date().toISOString() });
  const index = vehicleMaintenanceFeeItems.findIndex((current) => current.id === editingMaintenanceFeeId);
  if (index >= 0) vehicleMaintenanceFeeItems.splice(index, 1, item); else vehicleMaintenanceFeeItems.push(item);
  vehicleMaintenanceFeeItems = window.VehicleMaintenanceFeeConfig.save(vehicleMaintenanceFeeItems);
  renderMaintenanceFeeConfig();
  fillVehicleRepairRecordFeeOptions();
  document.querySelector("#maintenanceFeeDialog").close();
}

function exportVehicleRepairRecordReport() {
  const rows = getVehicleRepairRecordRows().map(({ record, item }) => [record.repairedAt, record.repairNo, record.plateNo, item.feeCategory, item.feeName, item.content, item.serviceProvider, item.periodStart, item.periodEnd, item.partsCost, item.laborCost, item.otherCost, item.subtotal, record.status]);
  downloadCapacityArchive("车辆维修保养记录", ["维修时间", "工单编号", "车牌号", "费用分类", "费用项目", "维修维护内容", "服务单位", "开始日期", "结束日期", "配件费", "工时费", "其他费用", "小计", "状态"], rows);
}

function exportVehicleRepairReport() {
  const headers = ["工单编号", "车牌号", "车辆类型", "运力归属", "车辆所属单位", "所属车队", "工单类型", "维修维护说明", "维修地点", "提交方式", "提交人", "创建时间", "维修时间", "状态", "维修厂", "工单合计", "完工时间", "维修结果", "费用子目", "凭证", "备注"];
  const escapeCsv = (value) => {
    const text = String(value ?? "").replace(/^([=+\-@])/, "'$1");
    return `"${text.replaceAll('"', '""')}"`;
  };
  const rows = getFilteredVehicleRepairs().map((record) => [record.repairNo, record.plateNo, record.vehicleType, record.capacityOwnershipSnapshot, organizationDisplayName(record.vehicleOrganizationSnapshot), record.fleet, record.category, record.description, record.repairLocation, record.source, record.reporterName || record.createdBy, record.createdAt || record.reportedAt, record.repairedAt, record.status, record.repairVendor, record.actualCost, record.completedAt, record.result, (record.items || []).map((item) => `${item.feeName}:${item.subtotal}`).join("；"), (record.evidence || []).map((file) => typeof file === "string" ? file : file.name).join("、"), record.remark]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
  link.download = `车辆维修保养工单-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadCapacityArchive(fileName, headers, rows) {
  const escapeCsv = (value) => `"${String(value ?? "").replace(/^([=+\-@])/, "'$1").replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
  link.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportVehicleArchive() {
  const rows = getFilteredVehicles().map((item) => [item.plateNo, item.vehicleType, item.capacityOwnership, CapacityOwnership.organizationName(item), item.supplierId, item.driver, getTrailerLabel(item.trailerId), item.fleet, item.vehicleState, item.vin, item.permitNo, item.inspectionDue, item.insuranceDue]);
  downloadCapacityArchive("车辆档案", ["车牌号", "车辆类型", "运力归属", "所属单位", "单位编号", "驾驶员", "默认挂车", "所属车队", "车辆状态", "车架号", "营运证号", "审验到期", "保险到期"], rows);
}

function exportTrailerArchive() {
  const rows = getFilteredTrailers().map((item) => [item.plateNo, item.assetType, CapacityOwnership.organizationName(item), item.vin, item.engineNo, item.mandatoryInsuranceCompany, item.mandatoryInsuranceNo, item.mandatoryInsuranceExpiry || item.insuranceDue, item.commercialInsuranceCompany, item.commercialInsuranceNo, item.commercialInsuranceExpiry || item.insuranceDue, item.inspectionDue, item.permitNo]);
  downloadCapacityArchive("车辆档案", ["车牌号", "车辆类型", "所属单位", "车架号", "发动机号", "交强险承保单位", "交强险保单号", "交强险到期", "商业险承保单位", "商业险保单号", "商业险到期", "审验到期", "营运证号"], rows);
}

function exportDriverArchive() {
  const rows = getFilteredDrivers().map((item) => [item.id, item.name, item.phone, item.capacityOwnership, CapacityOwnership.organizationName(item), item.supplierId, item.driverState, item.fleet, item.idCard, item.licenseClass, item.licenseExpiry, item.qualificationExpiry]);
  downloadCapacityArchive("司机档案", ["司机编号", "姓名", "联系电话", "运力归属", "所属单位", "单位编号", "司机状态", "所属车队", "身份证号", "准驾车型", "驾驶证到期", "从业资格证到期"], rows);
}

function applyAccessNavigation() {
  const access = window.UserAccess;
  if (!access) return;
  document.querySelectorAll(".nav-child[data-page], .nav-item[data-page]").forEach((item) => {
    const allowed = access.canPage(item.dataset.page);
    item.hidden = !allowed;
    item.style.display = allowed ? "" : "none";
    item.setAttribute("aria-hidden", String(!allowed));
  });
  document.querySelectorAll(".nav-section").forEach((section) => {
    const hasVisibleItem = [...section.querySelectorAll(".nav-child[data-page]")].some((item) => !item.hidden);
    section.hidden = !hasVisibleItem;
    section.style.display = hasVisibleItem ? "" : "none";
    if (!hasVisibleItem) section.classList.remove("active");
  });
}

function renderCurrentUserIdentity() {
  const user = window.UserAccess?.currentUser?.();
  const role = window.UserAccess?.currentRole?.();
  if (!user) return;
  const name = user.name || user.account || "后台用户";
  const roleName = role?.name || "未分配角色";
  const nameNode = document.querySelector("#currentUserDisplayName");
  const menuNameNode = document.querySelector("#currentMenuUserDisplayName");
  const roleNode = document.querySelector("#currentUserRoleDisplay");
  if (nameNode) nameNode.textContent = name;
  if (menuNameNode) menuNameNode.textContent = name;
  if (roleNode) roleNode.textContent = `当前身份：${roleName}`;
  userAccountButton?.setAttribute("aria-label", `当前用户：${name}，已登录`);
}

function inferAccessAction(label) {
  if (/导出/.test(label)) return "export";
  if (/新增|新建|创建/.test(label)) return "create";
  if (/编辑|修改/.test(label)) return "edit";
  if (/删除|移除/.test(label)) return "delete";
  if (/审核|审批|通过|驳回|发布|派单|调整运力|重置匹配|立即执行/.test(label)) return "special";
  return null;
}

function applyAccessControls(viewName) {
  const access = window.UserAccess;
  const view = pageViews[viewName];
  if (!access || !view) return;
  view.querySelectorAll("button, [role='button']").forEach((button) => {
    const action = inferAccessAction(button.getAttribute("aria-label") || button.textContent || "");
    if (!action) return;
    if (button.dataset.accessOriginalHidden === undefined) button.dataset.accessOriginalHidden = String(button.hidden);
    if (button.dataset.accessOriginalDisplay === undefined) button.dataset.accessOriginalDisplay = button.style.display;
    const allowed = access.can(access.pageModule(activePageName), action);
    button.hidden = !allowed || button.dataset.accessOriginalHidden === "true";
    button.style.display = allowed ? button.dataset.accessOriginalDisplay : "none";
  });
}

function switchPage(pageName, navigationTarget = null) {
  const meta = pageMeta[pageName] || pageMeta.waybill;
  if (window.UserAccess && !window.UserAccess.canPage(pageName)) {
    showApplicationAlert("当前账号没有访问此页面的权限。");
    return false;
  }
  activePageName = pageName;
  document.body.classList.toggle("analysis-page-active", ["operationsOverview", "waybillProfit", "operationsReport", "selfOwnedVehicleAnalysis"].includes(meta.view));
  const activeNavPage = meta.navPage || pageName;
  pageTitle.textContent = meta.title;
  pageKicker.textContent = meta.kicker;
  const publishedPlatformConfig = window.PlatformConfigManager?.getPublished?.();
  document.title = `${meta.title} - ${publishedPlatformConfig?.browserTitleSuffix || publishedPlatformConfig?.platformName || "集卡物流系统"}`;

  Object.entries(pageViews).forEach(([key, view]) => {
    view.classList.toggle("active", key === meta.view);
  });

  if (meta.view === "waybill") {
    const planTaskTableWrap = tableBody?.closest(".table-wrap");
    if (planTaskTableWrap) planTaskTableWrap.scrollLeft = 0;
  }

  const navigationLinks = [...document.querySelectorAll(".nav-child[data-page], .nav-item[data-page]")];
  const preferredNavigation = navigationTarget?.matches?.(".nav-child[data-page], .nav-item[data-page]")
    ? navigationTarget
    : navigationLinks.find((item) => item.dataset.page === activeNavPage && !item.dataset.settlementTarget);
  document.querySelectorAll("[data-page]").forEach((item) => {
    const isVehicleTab =
      item.classList.contains("tab") && item.dataset.page === "vehicle" && meta.view === "vehicle" && pageName !== "home";
    item.classList.toggle("active", item.classList.contains("tab") && (item.dataset.page === pageName || isVehicleTab));
    const isNavLink = item.classList.contains("nav-child") || item.classList.contains("nav-item");
    item.classList.toggle("selected", isNavLink && item === preferredNavigation);
  });

  document.querySelectorAll(".nav-section").forEach((section) => {
    section.classList.toggle("active", Boolean(section.querySelector(".nav-child.selected")));
  });

  if (meta.view === "vehicle") {
    renderVehiclePage(filterVehicles(new FormData(document.querySelector("#vehicleQueryForm"))), getWarningDays());
    closeVehicleDetail();
  }
  if (meta.view === "trailer") {
    renderTrailerPage(getFilteredTrailers());
  }
  if (meta.view === "dashboard") {
    renderDashboard();
  }
  if (meta.view === "operationsOverview") {
    window.OperationsAnalysis?.renderOverview?.();
  }
  if (meta.view === "waybillProfit") {
    window.OperationsAnalysis?.renderProfit?.();
  }
  if (meta.view === "operationsReport") {
    window.OperationsAnalysis?.renderOperationsReport?.();
  }
  if (meta.view === "selfOwnedVehicleAnalysis") {
    window.OperationsAnalysis?.renderVehicleAnalysis?.();
  }
  if (meta.view === "driver") {
    closeDriverDetail();
    renderDriverPage(getFilteredDrivers());
  }
  if (meta.view === "route") {
    renderRoutePage(getFilteredRoutes());
  }
  if (meta.view === "dispatch") {
    renderDispatchPage(getFilteredDispatches());
  }
  if (meta.view === "dispatchDetail") {
    renderDispatchDetailPage(currentDispatchDetailId);
  }
  if (meta.view === "planTaskDetail") {
    renderPlanTaskDetailPage(currentPlanTaskDetailId);
  }
  if (meta.view === "dispatchManagement") {
    window.DispatchManagement?.render();
  }
  if (meta.view === "capacity") {
    renderCapacityPage(getFilteredCapacityRecords());
  }
  if (meta.view === "autoDispatch") {
    window.AutoDispatchManager?.refresh();
  }
  if (meta.view === "autoDispatchConfig") {
    window.AutoDispatchManager?.renderConfig();
    window.lucide?.createIcons();
  }
  if (meta.view === "userAccess") {
    window.UserAccessManager?.render();
  }
  if (meta.view === "operationLogs") {
    window.OperationLogManager?.render();
  }
  if (meta.view === "platformConfig") {
    window.PlatformConfigManager?.render();
  }
  if (meta.view === "transportTaskConfig") window.TransportTaskConfigManager?.render();
  if (meta.view === "vehicleMaintenanceFees") renderMaintenanceFeeConfig();
  if (meta.view === "finance") {
    renderFinancePage(getFilteredFinanceRows());
  }
  if (meta.view === "driverExpenses") {
    renderDriverExpensePage();
  }
  if (meta.view === "settlement") window.SettlementManager?.openModule?.(meta.settlementModule || "overview");
  if (meta.view === "vehicleRepairs") renderVehicleRepairPage();
  if (meta.view === "customer") {
    window.CustomerManager?.render();
  }
  if (meta.view === "reminderTemplates") {
    renderReminderTemplatePage(getReminderTemplateFiltered());
  }
  if (meta.view === "announcements") {
    renderAnnouncementPage(getAnnouncementFiltered());
  }
  if (meta.view === "feedbackManagement") {
    document.querySelector("#feedbackManagementPage")?.dispatchEvent(new CustomEvent("feedback-page-open"));
  }
  applyAccessControls(meta.view);
  return true;
}

window.addEventListener("user-access-changed", () => {
  renderCurrentUserIdentity();
  applyAccessNavigation();
  applyAccessControls(pageMeta[activePageName]?.view);
  if (window.UserAccess && !window.UserAccess.canPage(activePageName)) {
    const firstAllowed = [...document.querySelectorAll(".nav-child[data-page], .nav-item[data-page]")]
      .find((item) => window.UserAccess.canPage(item.dataset.page));
    if (firstAllowed) switchPage(firstAllowed.dataset.page, firstAllowed);
  } else if (window.UserAccess) switchPage(activePageName);
});

document.addEventListener("click", (event) => {
  const access = window.UserAccess;
  if (!access) return;
  const button = event.target.closest("button, [role='button']");
  if (!button) return;
  const moduleId = access.pageModule(activePageName);
  const label = button.getAttribute("aria-label") || button.textContent || "";
  let action = inferAccessAction(label);
  if (button.matches("[data-dispatch-permission], #autoRunBtn, [data-auto-run]")) action = "special";
  else if (button.id === "confirmPlatformPublish") action = "special";
  const guardedPermission = moduleId && action ? [moduleId, action] : null;
  if (!guardedPermission || access.can(guardedPermission[0], guardedPermission[1])) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  showApplicationAlert("当前角色没有执行此操作的权限。");
}, true);

document.addEventListener("submit", (event) => {
  const access = window.UserAccess;
  if (!access) return;
  const form = event.target;
  const submitter = event.submitter || form.querySelector("button[type='submit'], input[type='submit']");
  const label = submitter?.getAttribute("aria-label") || submitter?.textContent || submitter?.value || "";
  if (!/保存|新增|新建|创建|提交|确认/.test(label)) return;
  const moduleId = access.pageModule(activePageName);
  const title = form.querySelector("[id$='Title'], header strong, h2")?.textContent || "";
  const specificAction = /新增|新建|创建/.test(title) ? "create" : /编辑|修改/.test(title) ? "edit" : null;
  const allowed = specificAction ? access.can(moduleId, specificAction) : access.can(moduleId, "create") || access.can(moduleId, "edit");
  if (allowed) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  showApplicationAlert("当前角色没有新增或编辑此类数据的权限。");
}, true);

renderRows(waybills);
renderVehiclePage();
renderVehicleRepairPage();
renderMaintenanceFeeConfig();
renderTrailerPage();
renderDriverPage();
refreshThirdPartyCustomerDatalist();
renderRoutePage();
renderDispatchPage();
renderCapacityPage();
renderFinancePage();
renderDriverExpensePage();
renderReminderTemplatePage();
renderAnnouncementPage();
renderDashboard();

moreBtn.addEventListener("click", () => {
  moreMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".action-bar")) {
    moreMenu.classList.remove("open");
  }
});

function getCurrentOrderDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getNextWaybillNo(orderDate) {
  const datePart = orderDate.replaceAll("-", "");
  const prefix = `WB${datePart}`;
  const maxNumber = waybills.reduce((max, item) => {
    const number = item.waybillNo?.startsWith(prefix) ? item.waybillNo.slice(prefix.length) : "";
    return /^\d{3,}$/.test(number) ? Math.max(max, Number(number)) : max;
  }, 0);
  return `${prefix}${String(maxNumber + 1).padStart(3, "0")}`;
}

function setGeneratedWaybillFields(orderDate) {
  const waybillNo = getNextWaybillNo(orderDate);
  waybillForm.elements.waybillNo.value = waybillNo;
  waybillForm.elements.orderDate.value = orderDate;
  document.querySelector("#generatedWaybillNo").textContent = waybillNo;
  document.querySelector("#generatedOrderDate").textContent = orderDate;
  return waybillNo;
}

function updateContainerCount() {
  document.querySelector("#waybillContainerCount").textContent = waybillContainerBody.querySelectorAll("tr").length;
}

function createContainerRow(values = {}) {
  const route = fixedRoutes.find((item) => item.id === waybillForm.elements.routeId.value);
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input class="container-box-no" placeholder="请输入箱号" required /></td>
    <td><input class="container-seal-no" placeholder="请输入封号" required /></td>
    <td><select class="container-box-type"><option>40HQ</option><option>40GP</option><option>20GP</option><option>45HQ</option></select></td>
    <td><input class="container-pickup-point" placeholder="请输入提箱点" required /></td>
    <td><input class="container-return-point" placeholder="请输入还箱点" required /></td>
    <td><button class="fee-delete container-delete" type="button">删除</button></td>`;
  waybillContainerBody.appendChild(row);
  row.querySelector(".container-box-no").value = values.boxNo || "";
  row.querySelector(".container-seal-no").value = values.sealNo || "";
  row.querySelector(".container-box-type").value = values.boxType || "40HQ";
  row.querySelector(".container-pickup-point").value = values.pickupPoint || "";
  const returnPoint = values.returnPoint || route?.destination || "";
  const returnInput = row.querySelector(".container-return-point");
  returnInput.value = returnPoint;
  returnInput.dataset.routeValue = values.returnPoint ? "" : returnPoint;
  updateContainerCount();
  return row;
}

function getContainerRows() {
  return [...waybillContainerBody.querySelectorAll("tr")].map((row) => ({
    boxNo: row.querySelector(".container-box-no").value.trim(),
    sealNo: row.querySelector(".container-seal-no").value.trim(),
    boxType: row.querySelector(".container-box-type").value,
    pickupPoint: row.querySelector(".container-pickup-point").value.trim(),
    returnPoint: row.querySelector(".container-return-point").value.trim(),
  }));
}

function createFeeRow(type, values = {}) {
  const isReceivable = type === "receivable";
  const body = isReceivable ? receivableFeeBody : payableFeeBody;
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><select class="fee-target"><option>${isReceivable ? "客户" : "供应商"}</option><option>${isReceivable ? "供应商" : "司机"}</option><option>其他</option></select></td>
    <td><input class="fee-unit" placeholder="单位名称" required /></td>
    <td><select class="fee-kind" required><option>运费</option><option>装卸费</option><option>压夜费</option><option>过路费</option><option>油费</option><option>司机提成</option><option>其他</option></select></td>
    <td><input class="fee-quantity" type="number" min="0" step="0.01" value="1" required /></td>
    <td><input class="fee-price" type="number" min="0" step="0.01" value="0" required /></td>
    <td><input class="fee-amount" value="0.00" readonly /></td>
    <td><input class="fee-settled" type="number" min="0" step="0.01" value="0" /></td>
    <td><input class="fee-outstanding" value="0.00" readonly /></td>
    <td class="fee-check-cell"><input class="fee-check" type="checkbox" /></td>
    <td><button class="fee-delete" type="button">删除</button></td>`;
  body.appendChild(row);
  row.querySelector(".fee-target").value = values.target || (isReceivable ? "客户" : "供应商");
  row.querySelector(".fee-unit").value = values.unit || "";
  row.querySelector(".fee-kind").value = values.kind || "运费";
  row.querySelector(".fee-quantity").value = values.quantity ?? 1;
  row.querySelector(".fee-price").value = values.price ?? 0;
  row.querySelector(".fee-settled").value = values.settled ?? 0;
  row.querySelector(".fee-check").checked = Boolean(values.invoice);
  updateFeeRow(row);
}

function updateFeeRow(row) {
  const quantity = Number(row.querySelector(".fee-quantity").value) || 0;
  const price = Number(row.querySelector(".fee-price").value) || 0;
  const settled = Number(row.querySelector(".fee-settled").value) || 0;
  const amount = quantity * price;
  row.querySelector(".fee-amount").value = amount.toFixed(2);
  row.querySelector(".fee-outstanding").value = Math.max(0, amount - settled).toFixed(2);
  updateWaybillTotals();
}

function getFeeRows(type) {
  const body = type === "receivable" ? receivableFeeBody : payableFeeBody;
  return [...body.querySelectorAll("tr")].map((row) => ({
    target: row.querySelector(".fee-target").value,
    unit: row.querySelector(".fee-unit").value.trim(),
    kind: row.querySelector(".fee-kind").value,
    quantity: Number(row.querySelector(".fee-quantity").value) || 0,
    price: Number(row.querySelector(".fee-price").value) || 0,
    amount: Number(row.querySelector(".fee-amount").value) || 0,
    settled: Number(row.querySelector(".fee-settled").value) || 0,
    invoice: row.querySelector(".fee-check").checked,
  }));
}

function updateWaybillTotals() {
  if (!receivableFeeBody || !payableFeeBody) return;
  const receivable = getFeeRows("receivable").reduce((sum, item) => sum + item.amount, 0);
  const payable = getFeeRows("payable").reduce((sum, item) => sum + item.amount, 0);
  document.querySelector("#waybillReceivableTotal").textContent = formatMoney(receivable);
  document.querySelector("#waybillPayableTotal").textContent = formatMoney(payable);
  document.querySelector("#waybillProfitTotal").textContent = formatMoney(receivable - payable);
}

let selectedWaybillCustomer = "";
let lastCustomerAddress = "";
let lastRouteAddress = "";

function fillWaybillFromCustomer() {
  const customer = window.CustomerManager?.getActiveCustomerByName(waybillForm.elements.customerName.value);
  const addressField = waybillForm.elements.loadAddress;
  if (!customer) {
    if (selectedWaybillCustomer && addressField.value === lastCustomerAddress) addressField.value = "";
    selectedWaybillCustomer = "";
    lastCustomerAddress = "";
    return;
  }
  if (selectedWaybillCustomer === customer.customerName) return;
  const address = [customer.loadAddress, customer.unloadAddress].filter(Boolean).join(" / ");
  addressField.value = address;
  selectedWaybillCustomer = customer.customerName;
  lastCustomerAddress = address;
  lastRouteAddress = "";
}

function fillWaybillFromRoute() {
  const route = fixedRoutes.find((item) => item.id === waybillForm.elements.routeId.value);
  if (!route) return;
  const addressField = waybillForm.elements.loadAddress;
  const customer = window.CustomerManager?.getActiveCustomerByName(waybillForm.elements.customerName.value);
  if (!customer && (!addressField.value.trim() || addressField.value === lastRouteAddress)) {
    lastRouteAddress = `${route.origin} / ${route.destination}`;
    addressField.value = lastRouteAddress;
  }
  waybillContainerBody.querySelectorAll(".container-return-point").forEach((input) => {
    if (!input.value.trim() || input.value === input.dataset.routeValue) {
      input.value = route.destination;
      input.dataset.routeValue = route.destination;
    }
  });
}

function loadRouteFee(type) {
  const route = fixedRoutes.find((item) => item.id === waybillForm.elements.routeId.value);
  if (!route) {
    showApplicationAlert("请先选择固定线路。");
    return;
  }
  const body = type === "receivable" ? receivableFeeBody : payableFeeBody;
  body.innerHTML = "";
  if (type === "receivable") {
    createFeeRow(type, { target: "客户", unit: waybillForm.elements.customerName.value, kind: "运费", price: route.estimatedRevenue });
  } else {
    createFeeRow(type, { target: "供应商", unit: "", kind: "运费", price: route.baseFreight });
    createFeeRow(type, { target: "司机", unit: route.defaultDriver || "", kind: "司机提成", price: calculateRouteCommission(route) });
  }
}

function openWaybillForm() {
  waybillForm.reset();
  selectedWaybillCustomer = "";
  lastCustomerAddress = "";
  lastRouteAddress = "";
  refreshWaybillRouteOptions();
  setGeneratedWaybillFields(getCurrentOrderDate());
  waybillForm.elements.auditState.value = "草拟";
  waybillContainerBody.innerHTML = "";
  receivableFeeBody.innerHTML = "";
  payableFeeBody.innerHTML = "";
  createContainerRow();
  createFeeRow("receivable");
  createFeeRow("payable");
  addDialog.showModal();
}

function closeWaybillForm() {
  if (addDialog.open) addDialog.close();
  waybillForm.reset();
}

const PLAN_TASK_TYPES = ["提空装货", "提重送货", "排空箱（A→B）", "排重箱（A→B）"];
function getPlanTaskTypeProfiles() {
  const configured = window.DispatchTaskNodes?.taskTypes?.() || [];
  return configured.length ? configured : PLAN_TASK_TYPES.map((name) => ({ name, nodes: [], jobLocations: [] }));
}
function renderPlanTaskTypeCards(container, selectedType = "", disabled = false) {
  if (!container) return;
  const types = getPlanTaskTypeProfiles();
  const selected = types.some((item) => item.name === selectedType) ? selectedType : (types[0]?.name || "");
  container.innerHTML = types.map((item, index) => {
    const checked = item.name === selected;
    const id = `${container.id}-${index}`;
    return `<label class="plan-task-type-card${checked ? " selected" : ""}" for="${id}"><input id="${id}" type="radio" name="taskType" value="${dashboardEscape(item.name)}"${checked ? " checked" : ""}${disabled ? " disabled" : ""}${index === 0 ? " required" : ""} /><span class="plan-task-type-card-heading"><strong>${dashboardEscape(item.name)}</strong><span class="plan-task-type-check" aria-hidden="true">${checked ? '<i data-lucide="check"></i>' : ""}</span></span><small>运输节点 ${Array.isArray(item.nodes) ? item.nodes.length : 0} 个 · 作业地址 ${Array.isArray(item.jobLocations) ? item.jobLocations.length : 0} 个</small></label>`;
  }).join("");
  window.lucide?.createIcons();
}
function getSelectedPlanTaskType(containerSelector) {
  return document.querySelector(`${containerSelector} input[name="taskType"]:checked`)?.value || "";
}
function refreshPlanTaskTypeCards(types = null) {
  if (Array.isArray(types)) PLAN_TASK_TYPES.splice(0, PLAN_TASK_TYPES.length, ...types.filter((item) => item.enabled !== false).map((item) => item.name));
  renderPlanTaskTypeCards(document.querySelector("#planTaskTypeCards"), getSelectedPlanTaskType("#planTaskTypeCards"), planTaskForm?.dataset.mode === "edit");
  renderPlanTaskTypeCards(document.querySelector("#planTaskTemplateTypeCards"), getSelectedPlanTaskType("#planTaskTemplateTypeCards"));
}
if (typeof window !== "undefined") window.addEventListener("task-types-refreshed", (event) => refreshPlanTaskTypeCards(event.detail));
if (typeof document !== "undefined") refreshPlanTaskTypeCards();
const PLAN_TASK_BOX_TYPES = ["40HQ", "40GP", "20GP", "45HQ"];
const PLAN_TASK_TEMPLATE_STORAGE_KEY = "container-logistics-plan-task-templates-v1";
function normalizePlanTaskTemplate(template = {}, index = 0) {
  const quantity = Math.min(100, Math.max(1, Number(template.quantity) || 1));
  const taskItems = Array.isArray(template.taskItems) ? template.taskItems.slice(0, 100) : [];
  return {
    id: String(template.id || `PTT-${Date.now()}-${index}`),
    name: String(template.name || "").trim(),
    taskType: PLAN_TASK_TYPES.includes(template.taskType) ? template.taskType : (PLAN_TASK_TYPES[0] || "提空装货"),
    customerId: String(template.customerId || ""), customerName: String(template.customerName || ""),
    projectId: String(template.projectId || ""), projectName: String(template.projectName || ""),
    routeId: String(template.routeId || ""),
    boxType: PLAN_TASK_BOX_TYPES.includes(template.boxType) ? template.boxType : "40HQ",
    quantity,
    taskItems: Array.from({ length: quantity }, (_, itemIndex) => {
      const item = taskItems[itemIndex] || {};
      return {
        routeId: String(item.routeId ?? template.routeId ?? ""),
        boxType: PLAN_TASK_BOX_TYPES.includes(item.boxType) ? item.boxType : PLAN_TASK_BOX_TYPES.includes(template.boxType) ? template.boxType : "40HQ",
      };
    }),
  };
}

function loadPlanTaskTemplates() {
  try {
    const stored = JSON.parse(localStorage.getItem(PLAN_TASK_TEMPLATE_STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored.map(normalizePlanTaskTemplate).filter((item) => item.name) : [];
  } catch (error) {
    console.warn("计划任务模板读取失败。", error);
    return [];
  }
}

function savePlanTaskTemplates(templates) {
  try {
    localStorage.setItem(PLAN_TASK_TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
    return true;
  } catch (error) {
    console.warn("计划任务模板保存失败。", error);
    return false;
  }
}

let planTaskTemplates = loadPlanTaskTemplates();
let planTaskListItems = [];
let planTaskListCollapsed = false;
let editingPlanTaskId = "";
let editingPlanTaskTemplateId = "";
let planTaskTemplateItems = [];
let returnToPlanTaskTemplateManager = false;
let planTaskTemplateDefaultBoxType = "40HQ";

function getPlanTaskDefaultTime() {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  date.setHours(Math.max(8, date.getHours() + 1));
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00`;
}

function getPlanTaskRouteOptions(selectedRouteId = "") {
  return '<option value="">不指定固定线路</option>' + fixedRoutes
    .filter((route) => route.routeState === "启用")
    .map((route) => `<option value="${route.id}"${route.id === selectedRouteId ? " selected" : ""}>${route.routeName}</option>`)
    .join("");
}

function getPlanTaskBoxOptions(selectedBoxType = "40HQ") {
  return PLAN_TASK_BOX_TYPES.map((boxType) => `<option value="${boxType}"${boxType === selectedBoxType ? " selected" : ""}>${boxType}</option>`).join("");
}

function getPlanTaskTemplateRouteOptions(selectedRouteId = "") {
  return '<option value="">不指定固定线路</option>' + fixedRoutes
    .filter((route) => route.routeState === "启用")
    .map((route) => `<option value="${dashboardEscape(route.id)}"${route.id === selectedRouteId ? " selected" : ""}>${dashboardEscape(route.routeName)}</option>`)
    .join("");
}

function renderPlanTaskTemplateItems() {
  planTaskTemplateItemsBody.innerHTML = planTaskTemplateItems.map((item, index) => `<div class="plan-template-task-row" data-template-task-row="${index}">
    <strong>任务 ${index + 1}</strong>
    <label class="field"><span class="field-label">固定线路</span><select data-template-task-route aria-label="任务 ${index + 1} 固定线路">${getPlanTaskTemplateRouteOptions(item.routeId)}</select></label>
    <label class="field"><span class="field-label">柜型</span><select data-template-task-box aria-label="任务 ${index + 1} 柜型">${getPlanTaskBoxOptions(item.boxType)}</select></label>
    <button class="icon-btn plan-task-row-delete" data-template-task-delete type="button" aria-label="删除任务 ${index + 1}" title="删除任务"${planTaskTemplateItems.length <= 1 ? " disabled" : ""}><i data-lucide="trash-2" aria-hidden="true"></i></button>
  </div>`).join("");
  if (!planTaskTemplateItems.length) planTaskTemplateItemsBody.innerHTML = '<div class="plan-task-list-empty">生成默认子任务配置</div>';
  window.lucide?.createIcons();
}

function resizePlanTaskTemplateItems(value) {
  const quantity = Math.min(100, Math.max(1, Number(value) || 1));
  const defaultRouteId = document.querySelector("#planTaskTemplateRoute").value;
  const defaultBoxType = document.querySelector("#planTaskTemplateBoxType").value || "40HQ";
  planTaskTemplateItems = Array.from({ length: quantity }, (_, index) => planTaskTemplateItems[index] || { routeId: defaultRouteId, boxType: defaultBoxType });
  document.querySelector("#planTaskTemplateQuantity").value = String(quantity);
  renderPlanTaskTemplateItems();
}

function refreshPlanTaskTemplateProjects(customerId = "", selectedProjectId = "") {
  const projectSelect = document.querySelector("#planTaskTemplateProject");
  const routeSelect = document.querySelector("#planTaskTemplateRoute");
  const projects = routeAccountCatalog.filter((item) => !customerId || item.customerId === customerId);
  projectSelect.innerHTML = '<option value="">请选择项目</option>' + projects.map((item) => `<option value="${dashboardEscape(item.projectId)}">${dashboardEscape(item.projectName)}</option>`).join("");
  projectSelect.value = selectedProjectId;
  refreshPlanTaskTemplateRoutes(customerId, selectedProjectId, routeSelect.value);
}

function refreshPlanTaskTemplateRoutes(customerId = "", projectId = "", selectedRouteId = "") {
  const routeSelect = document.querySelector("#planTaskTemplateRoute");
  routeSelect.innerHTML = '<option value="">不指定固定线路</option>' + fixedRoutes
    .filter((route) => route.routeState === "启用" && (!customerId || route.customerId === customerId) && (!projectId || route.projectId === projectId))
    .map((route) => `<option value="${dashboardEscape(route.id)}">${dashboardEscape(route.routeName)}</option>`).join("");
  routeSelect.value = selectedRouteId;
}

function renderPlanTaskTemplateManager() {
  const search = document.querySelector("#planTaskTemplateSearch").value.trim().toLowerCase();
  const taskType = document.querySelector("#planTaskTemplateTypeFilter").value;
  const templates = planTaskTemplates.filter((item) => {
    const searchable = [item.name, item.customerName, item.projectName].join(" ").toLowerCase();
    return (!search || searchable.includes(search)) && (!taskType || item.taskType === taskType);
  }).sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  planTaskTemplateBody.innerHTML = templates.length ? templates.map((item) => {
    const route = fixedRoutes.find((entry) => entry.id === item.routeId);
    return `<tr>
      <td><strong>${dashboardEscape(item.name)}</strong><small>${dashboardEscape(item.taskType)}</small></td>
      <td>${dashboardEscape(item.customerName)}<small>${dashboardEscape(item.projectName)}</small></td>
      <td>${dashboardEscape(route?.routeName || "不指定线路")}</td>
      <td>${dashboardEscape(item.boxType)}<small>${item.quantity} 条子任务</small></td>
      <td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn primary-text" data-plan-template-action="use" data-plan-template-id="${dashboardEscape(item.id)}" type="button">使用该模板开始创建</button><button class="link-btn" data-plan-template-action="edit" data-plan-template-id="${dashboardEscape(item.id)}" type="button">编辑</button><button class="link-btn danger-link" data-plan-template-action="delete" data-plan-template-id="${dashboardEscape(item.id)}" type="button">删除</button></div></td>
    </tr>`;
  }).join("") : `<tr><td class="no-data-cell" colspan="5">${planTaskTemplates.length ? "没有符合条件的模板" : "还没有计划任务模板"}</td></tr>`;
}

function openPlanTaskTemplateManager() {
  renderPlanTaskTemplateManager();
  planTaskTemplateManagerDialog.showModal();
  window.lucide?.createIcons();
}

function openPlanTaskTemplateEditor(template = null, sourceGroup = null) {
  returnToPlanTaskTemplateManager = planTaskTemplateManagerDialog.open;
  editingPlanTaskTemplateId = template?.id || "";
  const customerSelect = document.querySelector("#planTaskTemplateCustomer");
  customerSelect.innerHTML = '<option value="">请选择客户</option>' + getRouteCustomers().map((item) => `<option value="${dashboardEscape(item.customerId)}">${dashboardEscape(item.customerName)}</option>`).join("");
  document.querySelector("#planTaskTemplateForm").reset();
  renderPlanTaskTypeCards(document.querySelector("#planTaskTemplateTypeCards"), PLAN_TASK_TYPES[0] || "提空装货");
  document.querySelector("#planTaskTemplateBoxType").value = "40HQ";
  planTaskTemplateDefaultBoxType = "40HQ";
  document.querySelector("#planTaskTemplateQuantity").value = "1";
  refreshPlanTaskTemplateProjects();
  const source = template || (sourceGroup ? {
    name: "", taskType: sourceGroup.first.taskType, customerName: sourceGroup.first.customerName,
    customerId: fixedRoutes.find((item) => item.id === sourceGroup.first.routeId)?.customerId || routeAccountCatalog.find((item) => item.customerName === sourceGroup.first.customerName)?.customerId || "",
    projectId: sourceGroup.first.projectId, projectName: sourceGroup.first.projectName,
    routeId: sourceGroup.first.routeId || waybillRouteMap[sourceGroup.first.waybillNo] || "",
    boxType: sourceGroup.first.boxType, quantity: sourceGroup.waybills.length,
    taskItems: sourceGroup.waybills.map((waybill) => ({ routeId: waybill.routeId || waybillRouteMap[waybill.waybillNo] || "", boxType: waybill.boxType || sourceGroup.first.boxType || "40HQ" })),
  } : null);
  if (source) {
    document.querySelector("#planTaskTemplateName").value = source.name || "";
    renderPlanTaskTypeCards(document.querySelector("#planTaskTemplateTypeCards"), source.taskType || PLAN_TASK_TYPES[0] || "提空装货");
    customerSelect.value = source.customerId || "";
    refreshPlanTaskTemplateProjects(source.customerId || "", source.projectId || "");
    document.querySelector("#planTaskTemplateProject").value = source.projectId || "";
    refreshPlanTaskTemplateRoutes(source.customerId || "", source.projectId || "", source.routeId || "");
    document.querySelector("#planTaskTemplateBoxType").value = source.boxType || "40HQ";
    planTaskTemplateDefaultBoxType = document.querySelector("#planTaskTemplateBoxType").value;
    document.querySelector("#planTaskTemplateQuantity").value = String(source.quantity || 1);
    planTaskTemplateItems = (source.taskItems || []).map((item) => ({ routeId: item.routeId || "", boxType: item.boxType || source.boxType || "40HQ" }));
  } else {
    planTaskTemplateItems = [{ routeId: "", boxType: "40HQ" }];
  }
  if (planTaskTemplateItems.length !== Number(document.querySelector("#planTaskTemplateQuantity").value)) resizePlanTaskTemplateItems(document.querySelector("#planTaskTemplateQuantity").value);
  else renderPlanTaskTemplateItems();
  document.querySelector("#planTaskTemplateEditorTitle").textContent = editingPlanTaskTemplateId ? "编辑计划任务模板" : "新建计划任务模板";
  if (planTaskTemplateManagerDialog.open) planTaskTemplateManagerDialog.close();
  planTaskTemplateEditorDialog.showModal();
  window.lucide?.createIcons();
}

function closePlanTaskTemplateEditor() {
  if (planTaskTemplateEditorDialog.open) planTaskTemplateEditorDialog.close();
  planTaskTemplateForm.reset();
  editingPlanTaskTemplateId = "";
  planTaskTemplateItems = [];
  if (returnToPlanTaskTemplateManager) openPlanTaskTemplateManager();
  returnToPlanTaskTemplateManager = false;
}

function usePlanTaskTemplate(templateId) {
  const template = planTaskTemplates.find((item) => item.id === templateId);
  if (!template) return;
  if (planTaskTemplateManagerDialog.open) planTaskTemplateManagerDialog.close();
  openPlanTaskDialog("single");
  const customerSelect = document.querySelector("#planCustomerSelect");
  customerSelect.value = template.customerId;
  refreshPlanTaskProjectOptions(template.customerId);
  document.querySelector("#planProjectSelect").value = template.projectId;
  refreshPlanTaskRouteByProject(template.customerId, template.projectId);
  document.querySelector("#planRouteSelect").value = template.routeId;
  document.querySelector("#planCustomerName").value = template.customerName;
  document.querySelector("#planProjectName").value = template.projectName;
  document.querySelector("#planBoxType").value = template.boxType;
  document.querySelector("#planTaskQuantity").value = String(template.quantity);
  renderPlanTaskTypeCards(document.querySelector("#planTaskTypeCards"), template.taskType);
  const planDate = document.querySelector("#planExecutionDate").value;
  planTaskListItems = template.taskItems.map((item) => ({ routeId: item.routeId, boxType: item.boxType, plannedBerthingTime: planDate ? `${planDate}T08:00` : "", boxNo1: "", tempSealNo1: "", railSealNo1: "", seaSealNo1: "", boxNo2: "", tempSealNo2: "", railSealNo2: "", seaSealNo2: "" }));
  renderPlanTaskList();
  document.querySelector("#planTaskFormTip").textContent = `已套用模板「${template.name}」；请填写计划执行日期、各子任务靠台时间和箱号/铅封号`;
  window.lucide?.createIcons();
}

function renderPlanTaskList() {
  const section = document.querySelector("#planTaskListSection");
  const body = document.querySelector("#planTaskListBody");
  const list = document.querySelector("#planTaskList");
  const count = document.querySelector("#planTaskListCount");
  const toggle = document.querySelector("#planTaskListToggleBtn");
  if (!section || !body || !list || !count || !toggle) return;
  count.textContent = `${planTaskListItems.length} 项`;
  list.innerHTML = planTaskListItems.length
    ? planTaskListItems.map((item, index) => `<div class="plan-task-row" data-plan-task-row="${index}">
        <div class="plan-task-row-header">
          <div class="plan-task-row-index"><strong>任务 ${index + 1}</strong><small>计划子任务</small></div>
          <button class="icon-btn plan-task-row-delete" data-plan-task-delete type="button" aria-label="删除任务 ${index + 1}" title="删除任务"${planTaskListItems.length <= 1 ? " disabled" : ""}><i data-lucide="trash-2" aria-hidden="true"></i></button>
        </div>
        <div class="plan-task-row-groups">
          <fieldset class="plan-task-row-group plan-task-row-main">
            <legend>任务信息</legend>
            <div class="plan-task-row-fields">
              <label class="field"><span class="field-label">计划靠台时间</span><input type="datetime-local" data-plan-task-row-berthing-time value="${dashboardEscape(item.plannedBerthingTime || "")}" required aria-label="任务 ${index + 1} 计划靠台时间" /></label>
              <label class="field"><span class="field-label">固定线路</span><select data-plan-task-row-route aria-label="任务 ${index + 1} 固定线路">${getPlanTaskRouteOptions(item.routeId)}</select></label>
              <label class="field"><span class="field-label">柜型</span><select data-plan-task-row-box aria-label="任务 ${index + 1} 柜型">${getPlanTaskBoxOptions(item.boxType)}</select></label>
            </div>
          </fieldset>
          <fieldset class="plan-task-row-group plan-task-row-container-group">
            <legend>箱号 1</legend>
            <div class="plan-task-row-fields">
              <label class="field"><span class="field-label">箱号</span><input data-plan-task-box-no-1 value="${dashboardEscape(item.boxNo1 || "")}" aria-label="任务 ${index + 1} 箱号 1" /></label>
              <label class="field"><span class="field-label">临时封</span><input data-plan-task-temp-seal-no-1 value="${dashboardEscape(item.tempSealNo1 ?? item.sealNo1 ?? "")}" aria-label="任务 ${index + 1} 临时封 1" /></label>
              <label class="field"><span class="field-label">铁路封</span><input data-plan-task-rail-seal-no-1 value="${dashboardEscape(item.railSealNo1 || "")}" aria-label="任务 ${index + 1} 铁路封 1" /></label>
              <label class="field"><span class="field-label">海运封</span><input data-plan-task-sea-seal-no-1 value="${dashboardEscape(item.seaSealNo1 || "")}" aria-label="任务 ${index + 1} 海运封 1" /></label>
            </div>
          </fieldset>
          <fieldset class="plan-task-row-group plan-task-row-container-group">
            <legend>箱号 2</legend>
            <div class="plan-task-row-fields">
              <label class="field"><span class="field-label">箱号</span><input data-plan-task-box-no-2 value="${dashboardEscape(item.boxNo2 || "")}" aria-label="任务 ${index + 1} 箱号 2" /></label>
              <label class="field"><span class="field-label">临时封</span><input data-plan-task-temp-seal-no-2 value="${dashboardEscape(item.tempSealNo2 ?? item.sealNo2 ?? "")}" aria-label="任务 ${index + 1} 临时封 2" /></label>
              <label class="field"><span class="field-label">铁路封</span><input data-plan-task-rail-seal-no-2 value="${dashboardEscape(item.railSealNo2 || "")}" aria-label="任务 ${index + 1} 铁路封 2" /></label>
              <label class="field"><span class="field-label">海运封</span><input data-plan-task-sea-seal-no-2 value="${dashboardEscape(item.seaSealNo2 || "")}" aria-label="任务 ${index + 1} 海运封 2" /></label>
            </div>
          </fieldset>
        </div>
      </div>`).join("")
    : '<div class="plan-task-list-empty">输入任务数量后生成任务清单</div>';
  body.hidden = planTaskListCollapsed;
  toggle.setAttribute("aria-expanded", String(!planTaskListCollapsed));
  toggle.title = planTaskListCollapsed ? "展开任务清单" : "收起任务清单";
  toggle.innerHTML = `<i data-lucide="${planTaskListCollapsed ? "chevron-down" : "chevron-up"}" aria-hidden="true"></i>`;
  window.lucide?.createIcons();
}

function resizePlanTaskList(value) {
  const quantity = Math.min(100, Math.max(0, Number(value) || 0));
  const defaultRouteId = document.querySelector("#planRouteSelect")?.value || "";
  const defaultBoxType = document.querySelector("#planBoxType")?.value || "40HQ";
  const planDate = document.querySelector("#planExecutionDate")?.value || "";
  planTaskListItems = Array.from({ length: quantity }, (_, index) => planTaskListItems[index] || { routeId: defaultRouteId, boxType: defaultBoxType, plannedBerthingTime: planDate ? `${planDate}T08:00` : "" });
  renderPlanTaskList();
}

function refreshPlanTaskRouteOptions() {
  const customerSelect = document.querySelector("#planCustomerSelect");
  const projectSelect = document.querySelector("#planProjectSelect");
  const routeSelect = document.querySelector("#planRouteSelect");
  if (!routeSelect) return;
  if (customerSelect) customerSelect.innerHTML = '<option value="">请选择客户</option>' + getRouteCustomers().map((item) => `<option value="${item.customerId}">${item.customerName}</option>`).join("");
  if (projectSelect) projectSelect.innerHTML = '<option value="">请选择项目</option>';
  routeSelect.innerHTML = '<option value="">不指定固定线路</option>';
}

function refreshPlanTaskProjectOptions(customerId = "") {
  const projectSelect = document.querySelector("#planProjectSelect");
  const routeSelect = document.querySelector("#planRouteSelect");
  if (!projectSelect || !routeSelect) return;
  const projects = routeAccountCatalog.filter((item) => !customerId || item.customerId === customerId);
  projectSelect.innerHTML = '<option value="">请选择项目</option>' + projects.map((item) => `<option value="${item.projectId}">${item.projectName}</option>`).join("");
  routeSelect.innerHTML = '<option value="">不指定固定线路</option>' + fixedRoutes.filter((route) => route.routeState === "启用" && (!customerId || route.customerId === customerId)).map((route) => `<option value="${route.id}" data-customer-id="${route.customerId}" data-project-id="${route.projectId}">${route.routeName}</option>`).join("");
}

function refreshPlanTaskRouteByProject(customerId = "", projectId = "") {
  const routeSelect = document.querySelector("#planRouteSelect");
  if (!routeSelect) return;
  routeSelect.innerHTML = '<option value="">不指定固定线路</option>' + fixedRoutes.filter((route) => route.routeState === "启用" && (!customerId || route.customerId === customerId) && (!projectId || route.projectId === projectId)).map((route) => `<option value="${route.id}">${route.routeName}</option>`).join("");
}

function setPlanTaskMode(mode) {
  const isBatch = mode === "batch";
  const isEdit = mode === "edit";
  planTaskForm.dataset.mode = mode;
  document.querySelectorAll("[data-plan-mode]").forEach((button) => button.classList.toggle("active", button.dataset.planMode === mode));
  document.querySelectorAll("[data-plan-mode]").forEach((button) => { button.hidden = isEdit; });
  planTaskSingleMode.hidden = isBatch;
  planTaskBatchMode.hidden = !isBatch;
  document.querySelector("#submitPlanTaskBtn").textContent = isBatch ? "导入并创建任务" : isEdit ? "保存计划修改" : "创建计划任务";
  document.querySelectorAll('#planTaskTypeCards input[name="taskType"]').forEach((input) => { input.disabled = isEdit; });
  document.querySelector("#planTaskFormTip").textContent = isBatch ? "导入成功后，每行任务都会进入待派发池" : isEdit ? "仅待派发计划可编辑" : "创建后自动生成计划编号并进入待派发池";
  planTaskDialog.dataset.breadcrumb = `计划与派单 / 计划与任务 / ${isEdit ? "编辑计划任务" : isBatch ? "批量导入计划任务" : "新建计划任务"}`;
  planTaskDialog.querySelector(".vehicle-dialog-header strong").textContent = isEdit ? "编辑计划任务" : "新建计划任务";
}

function openPlanTaskDialog(mode = "single") {
  editingPlanTaskId = "";
  planTaskForm.reset();
  planTaskListItems = [];
  planTaskListCollapsed = false;
  refreshPlanTaskRouteOptions();
  document.querySelector("#planOrderDate").value = getPlanTaskToday();
  document.querySelector("#planExecutionDate").value = getPlanTaskDefaultTime().slice(0, 10);
  document.querySelector("#planBoxType").value = "40HQ";
  renderPlanTaskTypeCards(document.querySelector("#planTaskTypeCards"), window.DispatchTaskNodes?.defaultType || "提空装货");
  planTaskBatchInput.value = "";
  renderPlanTaskList();
  setPlanTaskMode(mode);
  window.PlanTaskArchive?.beginForm?.("", "");
  window.lucide?.createIcons();
  planTaskDialog.showModal();
}

function openEditPlanTaskDialog(planTaskId) {
  const group = getPlanTaskGroups(waybills).find((item) => item.id === planTaskId);
  if (!group?.canEdit) return;
  editingPlanTaskId = group.id;
  planTaskForm.reset();
  planTaskListCollapsed = false;
  refreshPlanTaskRouteOptions();
  const first = group.first;
  const firstRoute = fixedRoutes.find((item) => item.id === (first.routeId || waybillRouteMap[first.waybillNo]));
  const customerId = firstRoute?.customerId || routeAccountCatalog.find((item) => item.customerName === first.customerName)?.customerId || "";
  document.querySelector("#planCustomerSelect").value = customerId;
  refreshPlanTaskProjectOptions(customerId);
  document.querySelector("#planProjectSelect").value = first.projectId || "";
  refreshPlanTaskRouteByProject(customerId, first.projectId || "");
  const routeId = first.routeId || waybillRouteMap[first.waybillNo] || "";
  document.querySelector("#planRouteSelect").value = routeId;
  document.querySelector("#planCustomerName").value = first.customerName || "";
  document.querySelector("#planProjectName").value = first.projectName || "";
  document.querySelector("#planOrderDate").value = first.orderDate || first.planExecutionDate || String(first.executionTime || "").slice(0, 10);
  document.querySelector("#planExecutionDate").value = first.planExecutionDate || String(first.executionTime || first.orderDate || "").slice(0, 10);
  renderPlanTaskTypeCards(document.querySelector("#planTaskTypeCards"), first.taskType || "提空装货", true);
  document.querySelector("#planTaskQuantity").value = String(group.waybills.length);
  planTaskListItems = group.waybills.map((waybill) => ({
    routeId: waybill.routeId || waybillRouteMap[waybill.waybillNo] || "", boxType: waybill.boxType || "40HQ",
    plannedBerthingTime: String(waybill.plannedBerthingTime || waybill.executionTime || `${waybill.planExecutionDate || waybill.orderDate}T08:00`).replace(" ", "T").slice(0, 16),
    boxNo1: waybill.boxNo1 === "-" ? "" : waybill.boxNo1 || "", tempSealNo1: waybill.tempSealNo1 ?? (waybill.sealNo1 === "-" ? "" : waybill.sealNo1 || ""), railSealNo1: waybill.railSealNo1 || "", seaSealNo1: waybill.seaSealNo1 || "",
    boxNo2: waybill.boxNo2 === "-" ? "" : waybill.boxNo2 || "", tempSealNo2: waybill.tempSealNo2 ?? (waybill.sealNo2 === "-" ? "" : waybill.sealNo2 || ""), railSealNo2: waybill.railSealNo2 || "", seaSealNo2: waybill.seaSealNo2 || "",
  }));
  planTaskBatchInput.value = "";
  renderPlanTaskList();
  setPlanTaskMode("edit");
  window.PlanTaskArchive?.beginForm?.(group.id, group.taskNo);
  planTaskDialog.showModal();
}

function closePlanTaskDialog() {
  if (planTaskDialog.open) planTaskDialog.close();
  window.PlanTaskArchive?.discardForm?.();
  planTaskForm.reset();
  planTaskBatchInput.value = "";
  planTaskListItems = [];
  editingPlanTaskId = "";
  planTaskForm.dataset.mode = "single";
  document.querySelectorAll("[data-plan-mode]").forEach((button) => { button.hidden = false; });
  planTaskDialog.querySelector(".vehicle-dialog-header strong").textContent = "新建计划任务";
  planTaskDialog.dataset.breadcrumb = "计划与派单 / 计划与任务 / 新建计划任务";
}

function parsePlanTaskCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += character;
    }
  }
  values.push(value.trim());
  return values;
}

function parsePlanTaskCsv(text) {
  const lines = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];
  const first = parsePlanTaskCsvLine(lines[0]);
  const hasHeader = first.some((value) => ["下单日期", "计划执行日期", "计划靠台时间", "执行日期", "执行时间", "线路", "柜型", "客户名称", "项目名称", "任务类型", "自动派发", "派单方式", "提前量", "运单数量", "箱号1", "铅封号1", "临时封1", "铁路封1", "海运封1", "箱号2", "铅封号2", "临时封2", "铁路封2", "海运封2"].includes(value));
  const headers = hasHeader ? first : [];
  const rows = hasHeader ? lines.slice(1) : lines;
  return rows.map((line) => {
    const values = parsePlanTaskCsvLine(line);
    const getValue = (names, fallbackIndex) => {
      const headerIndex = headers.findIndex((header) => names.includes(header));
      return values[headerIndex >= 0 ? headerIndex : fallbackIndex] || "";
    };
    const legacyDispatchColumns = !hasHeader && values.length >= 9;
    return {
      orderDate: getValue(["下单日期", "收令日期"], 12),
      planExecutionDate: getValue(["计划执行日期", "执行日期", "执行时间"], 0),
      plannedBerthingTime: getValue(["计划靠台时间", "靠台时间", "执行时间"], 1) || getValue(["执行时间"], 0),
      routeValue: getValue(["线路"], 1),
      boxType: getValue(["柜型"], 2) || "40HQ",
      customerName: getValue(["客户名称"], 3),
      projectName: getValue(["项目名称"], 4),
      taskType: getValue(["任务类型"], 5) || "提空装货",
      quantity: getValue(["运单数量", "任务数量"], legacyDispatchColumns ? 8 : 6) || "1",
      boxNo1: getValue(["箱号1", "箱号 1"], 7),
      tempSealNo1: getValue(["临时封1", "临时封 1", "铅封号1", "铅封号 1"], 8),
      sealNo1: getValue(["临时封1", "临时封 1", "铅封号1", "铅封号 1"], 8),
      railSealNo1: getValue(["铁路封1", "铁路封 1"], 9),
      seaSealNo1: getValue(["海运封1", "海运封 1"], 10),
      boxNo2: getValue(["箱号2", "箱号 2"], 9),
      tempSealNo2: getValue(["临时封2", "临时封 2", "铅封号2", "铅封号 2"], 10),
      sealNo2: getValue(["临时封2", "临时封 2", "铅封号2", "铅封号 2"], 10),
      railSealNo2: getValue(["铁路封2", "铁路封 2"], 11),
      seaSealNo2: getValue(["海运封2", "海运封 2"], 12),
    };
  });
}

function resolvePlanTaskRoute(value) {
  const target = normalize(value);
  return fixedRoutes.find((route) => [route.id, route.routeCode, route.routeName].some((candidate) => normalize(candidate) === target)) ||
    fixedRoutes.find((route) => normalize(route.routeName).includes(target) && target) || null;
}

function normalizePlanTaskDate(value) {
  return String(value || "").trim().replace("T", " ").slice(0, 10);
}

function normalizePlanTaskExecutionTime(value, planDate = "") {
  const text = String(value || "").trim().replace(" ", "T");
  if (!text) return planDate ? `${planDate}T08:00` : "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return `${text}T08:00`;
  return text.slice(0, 16);
}

function normalizePlanTaskContainerPairs(item = {}) {
  const pairs = [
    { boxNo: String(item.boxNo1 || "").trim(), tempSealNo: String(item.tempSealNo1 ?? item.sealNo1 ?? "").trim(), sealNo: String(item.tempSealNo1 ?? item.sealNo1 ?? "").trim(), railSealNo: String(item.railSealNo1 || "").trim(), seaSealNo: String(item.seaSealNo1 || "").trim() },
    { boxNo: String(item.boxNo2 || "").trim(), tempSealNo: String(item.tempSealNo2 ?? item.sealNo2 ?? "").trim(), sealNo: String(item.tempSealNo2 ?? item.sealNo2 ?? "").trim(), railSealNo: String(item.railSealNo2 || "").trim(), seaSealNo: String(item.seaSealNo2 || "").trim() },
  ].filter((pair) => pair.boxNo || pair.tempSealNo || pair.railSealNo || pair.seaSealNo);
  return {
    boxNo1: pairs[0]?.boxNo || "", tempSealNo1: pairs[0]?.tempSealNo || "", sealNo1: pairs[0]?.tempSealNo || "", railSealNo1: pairs[0]?.railSealNo || "", seaSealNo1: pairs[0]?.seaSealNo || "",
    boxNo2: pairs[1]?.boxNo || "", tempSealNo2: pairs[1]?.tempSealNo || "", sealNo2: pairs[1]?.tempSealNo || "", railSealNo2: pairs[1]?.railSealNo || "", seaSealNo2: pairs[1]?.seaSealNo || "", pairs,
  };
}

function createPlanTaskRecords(rows) {
  const created = [];
  const errors = [];
  const supportedBoxTypes = ["40HQ", "40GP", "20GP", "45HQ"];
  rows.forEach((row, index) => {
    const planExecutionDate = normalizePlanTaskDate(row.planExecutionDate || row.executionTime || row.orderDate);
    const orderDate = normalizePlanTaskDate(row.orderDate || planExecutionDate);
    const defaultBerthingTime = normalizePlanTaskExecutionTime(row.plannedBerthingTime || row.executionTime, planExecutionDate);
    const customerName = String(row.customerName || "").trim();
    const taskType = PLAN_TASK_TYPES.includes(row.taskType) ? row.taskType : (PLAN_TASK_TYPES[0] || "提空装货");
    const quantity = Math.min(100, Math.max(1, Number(row.quantity) || 1));
    const taskItems = Array.isArray(row.taskItems) && row.taskItems.length
      ? row.taskItems.slice(0, 100).map((item) => ({
        routeValue: item.routeValue ?? item.routeId ?? row.routeValue ?? row.routeId ?? "",
        boxType: supportedBoxTypes.includes(item.boxType) ? item.boxType : (supportedBoxTypes.includes(row.boxType) ? row.boxType : "40HQ"),
        boxNo1: String(item.boxNo1 ?? row.boxNo1 ?? "").trim(), tempSealNo1: String(item.tempSealNo1 ?? item.sealNo1 ?? row.tempSealNo1 ?? row.sealNo1 ?? "").trim(), railSealNo1: String(item.railSealNo1 ?? row.railSealNo1 ?? "").trim(), seaSealNo1: String(item.seaSealNo1 ?? row.seaSealNo1 ?? "").trim(),
        boxNo2: String(item.boxNo2 ?? row.boxNo2 ?? "").trim(), tempSealNo2: String(item.tempSealNo2 ?? item.sealNo2 ?? row.tempSealNo2 ?? row.sealNo2 ?? "").trim(), railSealNo2: String(item.railSealNo2 ?? row.railSealNo2 ?? "").trim(), seaSealNo2: String(item.seaSealNo2 ?? row.seaSealNo2 ?? "").trim(),
        plannedBerthingTime: normalizePlanTaskExecutionTime(item.plannedBerthingTime || defaultBerthingTime, planExecutionDate),
      }))
      : Array.from({ length: quantity }, () => ({ routeValue: row.routeValue || row.routeId || "", boxType: supportedBoxTypes.includes(row.boxType) ? row.boxType : "40HQ", boxNo1: String(row.boxNo1 || "").trim(), tempSealNo1: String(row.tempSealNo1 ?? row.sealNo1 ?? "").trim(), railSealNo1: String(row.railSealNo1 || "").trim(), seaSealNo1: String(row.seaSealNo1 || "").trim(), boxNo2: String(row.boxNo2 || "").trim(), tempSealNo2: String(row.tempSealNo2 ?? row.sealNo2 ?? "").trim(), railSealNo2: String(row.railSealNo2 || "").trim(), seaSealNo2: String(row.seaSealNo2 || "").trim(), plannedBerthingTime: defaultBerthingTime }));
    const resolvedItems = taskItems.map((item) => ({ ...item, route: resolvePlanTaskRoute(item.routeValue) }));
    if (!planExecutionDate || !customerName || !resolvedItems.length || resolvedItems.some((item) => !item.plannedBerthingTime || item.routeValue && !item.route)) {
      errors.push(`第 ${index + 1} 行缺少计划执行日期、计划靠台时间或客户名称，或固定线路无法匹配`);
      return;
    }
    const planTaskId = `PT-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`;
    const planTaskNo = `JH-${orderDate.replaceAll("-", "")}-${String(index + 1).padStart(3, "0")}`;
    const planQuantity = resolvedItems.length;
    resolvedItems.forEach((item, childIndex) => {
      const { route, boxType, boxNo1, boxNo2, plannedBerthingTime } = item;
      const waybillNo = getNextWaybillNo(orderDate);
      const itemCustomerName = String(route?.customerName || customerName).trim();
      const customer = window.CustomerManager?.getActiveCustomerByName(itemCustomerName);
      const account = typeof routeAccountCatalog !== "undefined"
        ? (route ? getRouteAccount(route.customerId, route.projectId) : null) || routeAccountCatalog.find((item) => item.customerId === customer?.customerNo || item.customerName === itemCustomerName)
        : null;
      const projectName = String(route?.projectName || row.projectName || account?.projectName || "未分配项目").trim();
      const projectId = route?.projectId || row.projectId || account?.projectId || "";
      const routeStops = typeof getRouteStops === "function" ? getRouteStops(route || {}) : [
        { value: route?.origin || "待维护" },
        { value: route?.origin || "待维护" },
        { value: route?.destination || "待维护" },
        { value: route?.destination || "待维护" },
      ];
      const compacted = normalizePlanTaskContainerPairs(item);
      const containers = compacted.pairs.map((container) => ({ ...container, sealNo: container.tempSealNo, boxType, pickupPoint: routeStops[0].value, returnPoint: routeStops[3].value }));
      const newWaybill = {
        waybillNo, planTaskId, planTaskNo, planQuantity, childSequence: childIndex + 1, orderDate, planExecutionDate, plannedBerthingTime, executionTime: plannedBerthingTime, taskType, projectId, projectName,
        taskConfigSnapshot: window.DispatchTaskNodes?.snapshot?.(taskType) || null,
        orderOperatorName: typeof currentOrderOperatorName === "function" ? currentOrderOperatorName() : "后台用户",
        autoDispatch: false, dispatchAdvanceMinutes: 0,
        routeId: route?.id || "", customerId: customer?.customerNo || route?.customerId || account?.customerId || row.customerId || "-", customerName: itemCustomerName,
        billNo: "-", loadAddress: route ? `${routeStops[1].value} / ${routeStops[2].value}` : "", dispatchNo: `PC-${waybillNo.slice(-8)}`,
        dispatchDate: "-", containers, boxNo1: compacted.boxNo1, sealNo1: compacted.tempSealNo1, tempSealNo1: compacted.tempSealNo1, railSealNo1: compacted.railSealNo1, seaSealNo1: compacted.seaSealNo1, boxNo2: compacted.boxNo2, sealNo2: compacted.tempSealNo2, tempSealNo2: compacted.tempSealNo2, railSealNo2: compacted.railSealNo2, seaSealNo2: compacted.seaSealNo2, boxType,
        boxQuantity: Math.max(1, compacted.pairs.length), auditState: "草拟", needReceipt: "否", receivedReceipt: "否", receiptDate: "",
        remark: `${taskType}计划任务 · ${childIndex + 1}/${planQuantity}`, freight: Number(route?.baseFreight) || 0, receivable: Number(route?.estimatedRevenue) || 0, entryDate: orderDate,
        profit: (Number(route?.estimatedRevenue) || 0) - (Number(route?.baseFreight) || 0), payable: Number(route?.baseFreight) || 0, carrier: "-",
        returnPoint: routeStops[3].value, pickupPoint1: routeStops[0].value, pickupPoint2: "",
        plateNo: "", driverId: "", driverName: "", arrived: false, arrivalDate: [], receivableFees: [], payableFees: [],
      };
      waybills.unshift(newWaybill);
      if (route) waybillRouteMap[waybillNo] = route.id;
      createPendingDispatch(newWaybill, route);
      created.push(newWaybill);
    });
  });
  if (created.length) saveWaybills();
  return { created, errors };
}

function updatePlanTaskRecords(planTaskId, values, taskItems) {
  const group = getPlanTaskGroups(waybills).find((item) => item.id === planTaskId);
  if (!group?.canEdit || taskItems.length !== group.waybills.length) return false;
  const planExecutionDate = normalizePlanTaskDate(values.planExecutionDate || values.executionTime);
  const orderDate = normalizePlanTaskDate(values.orderDate || planExecutionDate);
  if (!planExecutionDate || !orderDate || !String(values.customerName || "").trim() || taskItems.some((item) => !item.plannedBerthingTime)) return false;
  group.waybills.forEach((waybill, index) => {
    const item = taskItems[index];
    const route = resolvePlanTaskRoute(item.routeValue);
    const previousRouteId = waybill.routeId || waybillRouteMap[waybill.waybillNo] || "";
    const customerName = route?.customerName || String(values.customerName).trim();
    const customer = window.CustomerManager?.getActiveCustomerByName(customerName);
    const account = route ? getRouteAccount(route.customerId, route.projectId) : routeAccountCatalog.find((entry) => entry.customerId === values.customerId);
    const projectName = route?.projectName || String(values.projectName || account?.projectName || "未分配项目").trim();
    const slots = normalizePlanTaskContainerPairs(item);
    const routeStops = getRouteStops(route || {});
    const baseFreight = Number(route?.baseFreight) || 0;
    const estimatedRevenue = Number(route?.estimatedRevenue) || 0;
    Object.assign(waybill, {
      planExecutionDate, plannedBerthingTime: normalizePlanTaskExecutionTime(item.plannedBerthingTime, planExecutionDate), executionTime: normalizePlanTaskExecutionTime(item.plannedBerthingTime, planExecutionDate), orderDate, taskType: values.taskType, customerId: customer?.customerNo || route?.customerId || values.customerId || "-",
      taskConfigSnapshot: waybill.taskConfigSnapshot || window.DispatchTaskNodes?.snapshot?.(values.taskType) || null,
      customerName, projectId: route?.projectId || values.projectId || account?.projectId || "",
      projectName, routeId: route?.id || "",
      loadAddress: route ? `${routeStops[1].value} / ${routeStops[2].value}` : "",
      boxType: item.boxType, boxNo1: slots.boxNo1, sealNo1: slots.tempSealNo1, tempSealNo1: slots.tempSealNo1, railSealNo1: slots.railSealNo1, seaSealNo1: slots.seaSealNo1, boxNo2: slots.boxNo2, sealNo2: slots.tempSealNo2, tempSealNo2: slots.tempSealNo2, railSealNo2: slots.railSealNo2, seaSealNo2: slots.seaSealNo2,
      containers: slots.pairs.map((pair) => ({ ...pair, sealNo: pair.tempSealNo, boxType: item.boxType, pickupPoint: routeStops[0].value, returnPoint: routeStops[3].value })),
      boxQuantity: Math.max(1, slots.pairs.length), freight: route ? baseFreight : waybill.freight,
      receivable: route ? estimatedRevenue : waybill.receivable, payable: route ? baseFreight : waybill.payable,
      profit: route ? estimatedRevenue - baseFreight : waybill.profit,
    });
    if (route) waybillRouteMap[waybill.waybillNo] = route.id;
    else delete waybillRouteMap[waybill.waybillNo];
    const dispatch = dispatches.find((entry) => entry.waybillNo === waybill.waybillNo);
    if (dispatch) Object.assign(dispatch, {
      orderDate, planExecutionDate, plannedBerthingTime: waybill.plannedBerthingTime, executionTime: waybill.plannedBerthingTime, taskType: values.taskType, customerId: waybill.customerId,
      customerName: waybill.customerName, projectId: waybill.projectId, projectName: waybill.projectName,
      boxNo1: slots.boxNo1, sealNo1: slots.tempSealNo1, tempSealNo1: slots.tempSealNo1, railSealNo1: slots.railSealNo1, seaSealNo1: slots.seaSealNo1, boxNo2: slots.boxNo2, sealNo2: slots.tempSealNo2, tempSealNo2: slots.tempSealNo2, railSealNo2: slots.railSealNo2, seaSealNo2: slots.seaSealNo2,
      routeId: waybill.routeId, routeName: route?.routeName || "未指定线路", origin: route?.origin || "",
      destination: route?.destination || "-", loadAddress: waybill.loadAddress,
      boxes: formatWaybillBoxes(waybill), estimatedRevenue: route ? estimatedRevenue : waybill.receivable,
      routeMileageSnapshot: route ? getRouteMileageSnapshot(route) : null,
    });
    if (previousRouteId !== waybill.routeId && !route) delete waybillRouteMap[waybill.waybillNo];
  });
  saveWaybills();
  saveDispatches();
  return true;
}

function refreshAfterPlanTaskCreate(created) {
  if (!created.length) return;
  dispatchQueryForm.reset();
  dispatchCurrentPage = 1;
  renderDispatchPage(getFilteredDispatches());
  window.AutoDispatchManager?.refresh();
  renderRows(waybills);
  resultText.textContent = `共 ${waybills.length} 条计划任务，已新增 ${created.length} 条并进入待派发池`;
  renderDashboard();
}

function renderPlanTaskDetailPage(planTaskId) {
  const group = getPlanTaskGroups(waybills).find((item) => item.id === planTaskId);
  if (!group || !planTaskDetailPageContent || !planTaskDetailPageSubtitle) return;
  const first = group.first;
  let route = getRouteForWaybill(first.waybillNo);
  if (route && first.taskType) route = { ...route, taskType: first.taskType };
  const dispatchByWaybill = new Map(group.dispatchList.map((dispatch) => [dispatch.waybillNo, dispatch]));
  const assignedCount = group.waybills.filter((waybill) => {
    const dispatch = dispatchByWaybill.get(waybill.waybillNo);
    return dispatch && dispatch.status !== "待派单";
  }).length;
  const modeLabel = (dispatch) => !dispatch || dispatch.status === "待派单" ? "待分配" : getDispatchMode(dispatch) === "auto" ? "自动派单" : "手动派单";
  const safe = dashboardEscape;
  const assignedProgress = group.waybills.length ? Math.round(assignedCount / group.waybills.length * 100) : 0;
  planTaskDetailPageSubtitle.textContent = `${group.taskNo} / ${first.customerName || "-"} / ${first.projectName || "-"}`;
  const boxTypes = [...new Set(group.waybills.map((waybill) => waybill.boxType).filter(Boolean))].join("、") || "-";
  const containerSealCells = (waybill, slot) => {
    const legacyTempSeal = waybill[`sealNo${slot}`];
    return [waybill[`boxNo${slot}`], waybill[`tempSealNo${slot}`] ?? legacyTempSeal, waybill[`railSealNo${slot}`], waybill[`seaSealNo${slot}`]].map((value) => `<td>${safe(value && value !== "-" ? value : "-")}</td>`).join("");
  };
  planTaskDetailPageContent.innerHTML = `<section class="plan-detail-section"><div class="plan-detail-section-heading"><strong>计划信息</strong><span>${safe(group.status)}</span><button class="btn quiet" data-save-plan-template="${safe(group.id)}" type="button"><i data-lucide="layout-template" aria-hidden="true"></i>另存为模板</button>${group.canEdit ? `<button class="btn quiet" data-edit-plan="${safe(group.id)}" type="button"><i data-lucide="pencil" aria-hidden="true"></i>编辑计划</button>` : ""}</div><div class="plan-detail-info-grid"><div><span>计划编号</span><strong>${safe(group.taskNo)}</strong></div><div><span>客户</span><strong>${safe(first.customerName || route?.customerName || "-")}</strong></div><div><span>项目</span><strong>${safe(first.projectName || route?.projectName || "-")}</strong></div><div><span>任务类型</span><strong>${safe(first.taskType || "-")}</strong></div><div><span>下单日期</span><strong>${safe(first.orderDate || "-")}</strong></div><div><span>计划执行日期</span><strong>${safe(first.planExecutionDate || String(first.executionTime || first.orderDate || "-").slice(0, 10))}</strong></div><div><span>运输线路</span><strong>${safe(route?.routeName || first.routeId || "未指定线路")}</strong></div><div><span>计划数量</span><strong>${group.waybills.length} 项任务</strong></div><div><span>柜型</span><strong>${safe(boxTypes)}</strong></div></div>${route ? `<div class="plan-detail-route"><span>线路节点</span>${renderRouteStops(route, "plan-route-stops")}</div>` : ""}<div class="detail-list-table"><table><thead><tr><th rowspan="2">子任务</th><th rowspan="2">计划靠台时间</th><th rowspan="2">固定线路</th><th colspan="4">箱号 1</th><th colspan="4">箱号 2</th></tr><tr><th>箱号</th><th>临时封</th><th>铁路封</th><th>海运封</th><th>箱号</th><th>临时封</th><th>铁路封</th><th>海运封</th></tr></thead><tbody>${group.waybills.map((waybill, index) => `<tr><td>任务 ${index + 1}</td><td>${safe(String(waybill.plannedBerthingTime || waybill.executionTime || "-").replace("T", " ").slice(0, 16))}</td><td>${safe(fixedRoutes.find((item) => item.id === waybill.routeId)?.routeName || "未指定线路")}</td>${containerSealCells(waybill, 1)}${containerSealCells(waybill, 2)}</tr>`).join("")}</tbody></table></div></section><section class="plan-detail-section plan-detail-dispatches"><div class="plan-detail-section-heading"><div><strong>派单情况</strong><small>${assignedCount} / ${group.waybills.length} 项已派单</small></div><div class="plan-detail-progress"><span><i style="width:${assignedProgress}%"></i></span><b>${assignedProgress}%</b></div></div><div class="detail-list-table"><table><thead><tr><th>任务编号</th><th>计划靠台时间</th><th>派单方式</th><th>司机 / 车辆</th><th>派单状态</th><th>当前节点</th><th>派单时间</th></tr></thead><tbody>${group.waybills.map((waybill, index) => { const dispatch = dispatchByWaybill.get(waybill.waybillNo); const taskLabel = group.waybills.length > 1 ? `${group.taskNo}-${String(index + 1).padStart(2, "0")}` : waybill.waybillNo; return `<tr><td><strong>${safe(taskLabel)}</strong></td><td>${safe(String(waybill.plannedBerthingTime || dispatch?.plannedBerthingTime || waybill.executionTime || "-").replace("T", " ").slice(0, 16))}</td><td>${safe(modeLabel(dispatch))}</td><td>${safe(dispatch?.driverName || "待分配")} / ${safe(dispatch?.vehicleId || "-")}</td><td><span class="dispatch-status ${getDispatchStatusClass(dispatch?.status || "待派单")}">${safe(dispatch?.status || "待派单")}</span></td><td>${safe(dispatch?.currentNode || "待派单")}</td><td>${safe(dispatch?.dispatchTime || "-")}</td></tr>`; }).join("")}</tbody></table></div></section>`;
  window.PlanTaskArchive?.mount?.(group.id, group.taskNo, planTaskDetailPageContent);
  window.lucide?.createIcons();
}

function openPlanDispatchDetail(planTaskId) {
  currentPlanTaskDetailId = planTaskId;
  if (!getPlanTaskGroups(waybills).some((item) => item.id === planTaskId)) return;
  switchPage("plan-task-detail");
}

function requestCancelPlan(planTaskId) {
  const group = getPlanTaskGroups(waybills).find((item) => item.id === planTaskId);
  if (!group?.canCancel || !cancelPlanDialog) return;
  cancellingPlanTaskId = group.id;
  cancelPlanText.textContent = `确认取消计划 ${group.taskNo} 吗？该计划下尚未开始的派单将一并取消。`;
  cancelPlanDialog.showModal();
}

function cancelPlan(planTaskId) {
  const group = getPlanTaskGroups(waybills).find((item) => item.id === planTaskId);
  if (!group?.canCancel) return;
  group.waybills.forEach((waybill) => { waybill.planStatus = "已取消"; });
  group.dispatchList.forEach((dispatch) => {
    if (dispatch.status === "取消") {
      dispatch.planStatus = "已取消";
      return;
    }
    dispatch.status = "取消";
    dispatch.planStatus = "已取消";
    dispatch.currentNode = "已取消";
    dispatch.timeline = Array.isArray(dispatch.timeline) ? dispatch.timeline : [];
    dispatch.timeline.push({ node: "已取消", time: new Date().toLocaleString("zh-CN", { hour12: false }), desc: `计划 ${group.taskNo} 已取消`, photos: [] });
  });
  saveWaybills();
  saveDispatches();
  syncDriverOperationalStates();
  cancelPlanDialog.close();
  cancellingPlanTaskId = "";
  renderRows(filterRows(new FormData(queryForm)));
  renderDispatchPage(getFilteredDispatches());
  renderDriverPage(getFilteredDrivers());
  renderDashboard();
}

addBtn.addEventListener("click", () => openPlanTaskDialog("single"));
batchPlanTaskBtn.addEventListener("click", () => openPlanTaskDialog("batch"));
document.querySelector("#planTaskTemplatesBtn")?.addEventListener("click", openPlanTaskTemplateManager);
document.querySelector("#closePlanTaskTemplateManagerBtn")?.addEventListener("click", () => planTaskTemplateManagerDialog.close());
document.querySelector("#createPlanTaskTemplateBtn")?.addEventListener("click", () => openPlanTaskTemplateEditor());
document.querySelector("#planTaskTemplateSearch")?.addEventListener("input", renderPlanTaskTemplateManager);
document.querySelector("#planTaskTemplateTypeFilter")?.addEventListener("change", renderPlanTaskTemplateManager);
document.querySelector("#closePlanTaskTemplateEditorBtn")?.addEventListener("click", closePlanTaskTemplateEditor);
document.querySelector("#cancelPlanTaskTemplateEditorBtn")?.addEventListener("click", closePlanTaskTemplateEditor);
planTaskTemplateEditorDialog?.addEventListener("cancel", (event) => { event.preventDefault(); closePlanTaskTemplateEditor(); });
document.querySelector("#planTaskTemplateCustomer")?.addEventListener("change", (event) => refreshPlanTaskTemplateProjects(event.target.value));
document.querySelector("#planTaskTemplateProject")?.addEventListener("change", (event) => refreshPlanTaskTemplateRoutes(document.querySelector("#planTaskTemplateCustomer").value, event.target.value));
document.querySelector("#planTaskTemplateRoute")?.addEventListener("change", () => {
  const routeId = document.querySelector("#planTaskTemplateRoute").value;
  planTaskTemplateItems = planTaskTemplateItems.map((item) => item.routeId ? item : { ...item, routeId });
  renderPlanTaskTemplateItems();
});
document.querySelector("#planTaskTemplateBoxType")?.addEventListener("change", (event) => {
  planTaskTemplateItems = planTaskTemplateItems.map((item) => item.boxType === planTaskTemplateDefaultBoxType ? { ...item, boxType: event.target.value } : item);
  planTaskTemplateDefaultBoxType = event.target.value;
  renderPlanTaskTemplateItems();
});
document.querySelector("#generatePlanTaskTemplateItemsBtn")?.addEventListener("click", () => resizePlanTaskTemplateItems(document.querySelector("#planTaskTemplateQuantity").value));
document.querySelector("#planTaskTemplateQuantity")?.addEventListener("change", (event) => resizePlanTaskTemplateItems(event.target.value));
planTaskTemplateItemsBody?.addEventListener("change", (event) => {
  const row = event.target.closest("[data-template-task-row]");
  if (!row) return;
  const item = planTaskTemplateItems[Number(row.dataset.templateTaskRow)];
  if (!item) return;
  if (event.target.matches("[data-template-task-route]")) item.routeId = event.target.value;
  if (event.target.matches("[data-template-task-box]")) item.boxType = event.target.value;
});
planTaskTemplateItemsBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-template-task-delete]");
  if (!button || planTaskTemplateItems.length <= 1) return;
  planTaskTemplateItems.splice(Number(button.closest("[data-template-task-row]").dataset.templateTaskRow), 1);
  resizePlanTaskTemplateItems(planTaskTemplateItems.length);
});
planTaskTemplateBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-plan-template-action]");
  if (!button) return;
  const template = planTaskTemplates.find((item) => item.id === button.dataset.planTemplateId);
  if (!template) return;
  if (button.dataset.planTemplateAction === "use") usePlanTaskTemplate(template.id);
  if (button.dataset.planTemplateAction === "edit") openPlanTaskTemplateEditor(template);
  if (button.dataset.planTemplateAction === "delete") {
    askApplicationConfirm(`确定删除模板“${template.name}”吗？已创建的计划任务不会受到影响。`, { label: "确认删除模板", danger: true }, () => {
      planTaskTemplates = planTaskTemplates.filter((item) => item.id !== template.id);
      if (!savePlanTaskTemplates(planTaskTemplates)) {
        planTaskTemplates.push(template);
        showApplicationAlert("模板删除失败，请检查浏览器存储空间后重试。");
      }
      renderPlanTaskTemplateManager();
    });
  }
});
planTaskTemplateForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (planTaskTemplateItems.length !== Number(document.querySelector("#planTaskTemplateQuantity").value)) {
    showApplicationAlert("请先生成对应数量的子任务配置。");
    return;
  }
  const customerId = document.querySelector("#planTaskTemplateCustomer").value;
  const projectId = document.querySelector("#planTaskTemplateProject").value;
  const account = routeAccountCatalog.find((item) => item.customerId === customerId && item.projectId === projectId);
  if (!account) {
    showApplicationAlert("请选择有效的客户和项目。");
    return;
  }
  const id = editingPlanTaskTemplateId || (window.crypto?.randomUUID?.() || `PTT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const template = normalizePlanTaskTemplate({
    id,
    name: document.querySelector("#planTaskTemplateName").value,
    taskType: getSelectedPlanTaskType("#planTaskTemplateTypeCards"),
    customerId,
    customerName: account.customerName,
    projectId,
    projectName: account.projectName,
    routeId: document.querySelector("#planTaskTemplateRoute").value,
    boxType: document.querySelector("#planTaskTemplateBoxType").value,
    quantity: document.querySelector("#planTaskTemplateQuantity").value,
    taskItems: planTaskTemplateItems,
  });
  const previousTemplates = planTaskTemplates;
  planTaskTemplates = editingPlanTaskTemplateId
    ? planTaskTemplates.map((item) => item.id === id ? template : item)
    : [...planTaskTemplates, template];
  if (!savePlanTaskTemplates(planTaskTemplates)) {
    planTaskTemplates = previousTemplates;
    showApplicationAlert("模板保存失败，请检查浏览器存储空间后重试。");
    return;
  }
  closePlanTaskTemplateEditor();
});
document.querySelectorAll("[data-plan-mode]").forEach((button) => button.addEventListener("click", () => setPlanTaskMode(button.dataset.planMode)));
document.querySelector("#planCustomerSelect")?.addEventListener("change", (event) => {
  refreshPlanTaskProjectOptions(event.target.value);
  document.querySelector("#planCustomerName").value = routeAccountCatalog.find((item) => item.customerId === event.target.value)?.customerName || "";
  document.querySelector("#planProjectName").value = "";
});
document.querySelector("#planProjectSelect")?.addEventListener("change", (event) => {
  const customerId = document.querySelector("#planCustomerSelect")?.value || "";
  refreshPlanTaskRouteByProject(customerId, event.target.value);
  document.querySelector("#planProjectName").value = routeAccountCatalog.find((item) => item.projectId === event.target.value)?.projectName || "";
});
document.querySelector("#planRouteSelect")?.addEventListener("change", (event) => {
  const route = fixedRoutes.find((item) => item.id === event.target.value);
  if (!route) {
    return;
  }
  document.querySelector("#planCustomerSelect").value = route.customerId || "";
  refreshPlanTaskProjectOptions(route.customerId || "");
  document.querySelector("#planProjectSelect").value = route.projectId || "";
  refreshPlanTaskRouteByProject(route.customerId || "", route.projectId || "");
  document.querySelector("#planRouteSelect").value = route.id;
  document.querySelector("#planCustomerName").value = route.customerName || "";
  document.querySelector("#planProjectName").value = route.projectName || "";
});
document.querySelector("#generatePlanTaskBtn")?.addEventListener("click", () => {
  const quantityInput = document.querySelector("#planTaskQuantity");
  const quantity = Math.min(100, Math.max(1, Number(quantityInput?.value) || 1));
  if (quantityInput) quantityInput.value = String(quantity);
  planTaskListCollapsed = false;
  resizePlanTaskList(quantity);
});
document.querySelector("#planTaskList")?.addEventListener("change", (event) => {
  const row = event.target.closest("[data-plan-task-row]");
  if (!row) return;
  const index = Number(row.dataset.planTaskRow);
  if (!planTaskListItems[index]) return;
  if (event.target.matches("[data-plan-task-row-berthing-time]")) planTaskListItems[index].plannedBerthingTime = event.target.value;
  if (event.target.matches("[data-plan-task-row-route]")) planTaskListItems[index].routeId = event.target.value;
  if (event.target.matches("[data-plan-task-row-box]")) planTaskListItems[index].boxType = event.target.value;
  if (event.target.matches("[data-plan-task-box-no-1]")) planTaskListItems[index].boxNo1 = event.target.value.trim();
  if (event.target.matches("[data-plan-task-temp-seal-no-1]")) planTaskListItems[index].tempSealNo1 = event.target.value.trim();
  if (event.target.matches("[data-plan-task-rail-seal-no-1]")) planTaskListItems[index].railSealNo1 = event.target.value.trim();
  if (event.target.matches("[data-plan-task-sea-seal-no-1]")) planTaskListItems[index].seaSealNo1 = event.target.value.trim();
  if (event.target.matches("[data-plan-task-box-no-2]")) planTaskListItems[index].boxNo2 = event.target.value.trim();
  if (event.target.matches("[data-plan-task-temp-seal-no-2]")) planTaskListItems[index].tempSealNo2 = event.target.value.trim();
  if (event.target.matches("[data-plan-task-rail-seal-no-2]")) planTaskListItems[index].railSealNo2 = event.target.value.trim();
  if (event.target.matches("[data-plan-task-sea-seal-no-2]")) planTaskListItems[index].seaSealNo2 = event.target.value.trim();
});
document.querySelector("#planTaskList")?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-plan-task-delete]");
  if (!deleteButton || planTaskListItems.length <= 1) return;
  const row = deleteButton.closest("[data-plan-task-row]");
  const index = Number(row?.dataset.planTaskRow);
  if (!Number.isInteger(index)) return;
  planTaskListItems.splice(index, 1);
  const quantityInput = document.querySelector("#planTaskQuantity");
  if (quantityInput) quantityInput.value = String(planTaskListItems.length);
  renderPlanTaskList();
});
document.querySelector("#planTaskListToggleBtn")?.addEventListener("click", () => {
  planTaskListCollapsed = !planTaskListCollapsed;
  renderPlanTaskList();
});
document.querySelectorAll(".plan-task-type-grid").forEach((grid) => grid.addEventListener("change", (event) => {
  if (!event.target.matches('input[name="taskType"]')) return;
  grid.querySelectorAll(".plan-task-type-card").forEach((card) => card.classList.toggle("selected", card.querySelector("input").checked));
  grid.querySelectorAll(".plan-task-type-check").forEach((indicator) => { indicator.innerHTML = indicator.closest("label")?.querySelector("input")?.checked ? '<i data-lucide="check"></i>' : ""; });
  window.lucide?.createIcons();
}));
document.querySelector("#planTaskCsvFile").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => { planTaskBatchInput.value = String(reader.result || ""); });
  reader.readAsText(file, "UTF-8");
});
document.querySelector("#downloadPlanTaskTemplateBtn").addEventListener("click", () => {
  const csv = "下单日期,计划执行日期,计划靠台时间,线路,柜型,客户名称,项目名称,任务类型,运单数量,箱号1,临时封1,铁路封1,海运封1,箱号2,临时封2,铁路封2,海运封2\n2026-09-27,2026-09-28,2026-09-28 08:00,,40HQ,华贸,比亚迪,提空装货,3,,,,,,,,\n";
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
  link.download = "计划任务导入模板.csv";
  link.click();
  URL.revokeObjectURL(link.href);
});
planTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(planTaskForm);
  let rows;
  if (planTaskForm.dataset.mode === "batch") {
    rows = parsePlanTaskCsv(formData.get("batchInput"));
  } else {
    const isEdit = planTaskForm.dataset.mode === "edit";
    const quantity = isEdit ? planTaskListItems.length : Math.min(100, Math.max(1, Number(formData.get("quantity")) || 1));
    if (!isEdit && planTaskListItems.length !== quantity) {
      showApplicationAlert("请先点击“生成派单任务”生成任务清单");
      return;
    }
    const taskItems = planTaskListItems.length === quantity
      ? planTaskListItems.map((item) => ({ routeId: item.routeId, boxType: item.boxType || formData.get("boxType"), plannedBerthingTime: item.plannedBerthingTime, boxNo1: item.boxNo1, tempSealNo1: item.tempSealNo1, railSealNo1: item.railSealNo1, seaSealNo1: item.seaSealNo1, boxNo2: item.boxNo2, tempSealNo2: item.tempSealNo2, railSealNo2: item.railSealNo2, seaSealNo2: item.seaSealNo2 }))
      : Array.from({ length: quantity }, () => ({ routeId: formData.get("routeId"), boxType: formData.get("boxType"), plannedBerthingTime: `${formData.get("planExecutionDate")}T08:00` }));
    const values = { orderDate: formData.get("orderDate"), planExecutionDate: formData.get("planExecutionDate"), routeId: formData.get("routeId"), projectId: formData.get("projectId"), customerId: formData.get("customerId"), boxType: formData.get("boxType"), customerName: formData.get("customerName"), projectName: formData.get("projectName"), taskType: getSelectedPlanTaskType("#planTaskTypeCards"), quantity, taskItems };
    if (isEdit) {
      if (!updatePlanTaskRecords(editingPlanTaskId, values, taskItems)) {
        showApplicationAlert("计划已无法编辑，请刷新后重试");
        return;
      }
      const planTaskId = editingPlanTaskId;
      const group = getPlanTaskGroups(waybills).find((item) => item.id === planTaskId);
      try {
        await window.PlanTaskArchive?.commitForm?.(planTaskId, group?.taskNo || group?.first?.planTaskNo || planTaskId);
      } catch (error) {
        console.error(error);
        showApplicationAlert("计划信息已保存，但档案附件保存失败，请保留当前页面后重试。");
        return;
      }
      closePlanTaskDialog();
      renderRows(filterRows(new FormData(queryForm)));
      renderDispatchPage(getFilteredDispatches());
      renderDashboard();
      renderPlanTaskDetailPage(planTaskId);
      return;
    }
    rows = [{ ...values, taskItems }];
  }
  const result = createPlanTaskRecords(rows);
  if (!result.created.length) {
    showApplicationAlert(result.errors.join("\n") || "请先填写计划任务信息");
    return;
  }
  if (planTaskForm.dataset.mode !== "batch") {
    const createdPlanTask = result.created[0];
    try {
      await window.PlanTaskArchive?.commitForm?.(createdPlanTask.planTaskId, createdPlanTask.planTaskNo);
    } catch (error) {
      console.error(error);
      const createdWaybillNos = new Set(result.created.map((item) => item.waybillNo));
      for (let index = waybills.length - 1; index >= 0; index -= 1) if (createdWaybillNos.has(waybills[index].waybillNo)) waybills.splice(index, 1);
      for (let index = dispatches.length - 1; index >= 0; index -= 1) if (createdWaybillNos.has(dispatches[index].waybillNo)) dispatches.splice(index, 1);
      createdWaybillNos.forEach((waybillNo) => delete waybillRouteMap[waybillNo]);
      saveWaybills();
      saveDispatches();
      showApplicationAlert("档案附件保存失败，本次计划任务未创建，请检查浏览器存储空间后重试。");
      return;
    }
  }
  closePlanTaskDialog();
  refreshAfterPlanTaskCreate(result.created);
  if (result.errors.length) showApplicationAlert(`已创建 ${result.created.length} 条任务，另有 ${result.errors.length} 行未导入：\n${result.errors.join("\n")}`);
});
document.querySelector("#closePlanTaskBtn").addEventListener("click", closePlanTaskDialog);
document.querySelector("#cancelPlanTaskBtn").addEventListener("click", closePlanTaskDialog);
planTaskDialog.addEventListener("cancel", (event) => { event.preventDefault(); closePlanTaskDialog(); });
document.querySelector("#closeWaybillFormBtn").addEventListener("click", closeWaybillForm);
document.querySelector("#cancelWaybillFormBtn").addEventListener("click", closeWaybillForm);

document.querySelectorAll(".add-fee-row").forEach((button) => {
  button.addEventListener("click", () => createFeeRow(button.dataset.feeType));
});

document.querySelector("#addContainerRowBtn").addEventListener("click", () => createContainerRow());
waybillContainerBody.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".container-delete");
  if (!deleteButton) return;
  deleteButton.closest("tr").remove();
  if (!waybillContainerBody.querySelector("tr")) createContainerRow();
  updateContainerCount();
});

document.querySelectorAll(".default-fee").forEach((button) => {
  button.addEventListener("click", () => loadRouteFee(button.dataset.feeType));
});

[receivableFeeBody, payableFeeBody].forEach((body) => {
  body.addEventListener("input", (event) => {
    if (event.target.matches(".fee-quantity, .fee-price, .fee-settled")) updateFeeRow(event.target.closest("tr"));
  });
  body.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".fee-delete");
    if (!deleteButton) return;
    deleteButton.closest("tr").remove();
    updateWaybillTotals();
  });
});

waybillForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const orderDate = getCurrentOrderDate();
  const waybillNo = setGeneratedWaybillFields(orderDate);
  const formData = new FormData(waybillForm);
  const receivableFees = getFeeRows("receivable");
  const payableFees = getFeeRows("payable");
  const containers = getContainerRows();
  const boxTypes = [...new Set(containers.map((item) => item.boxType).filter(Boolean))];
  const returnPoints = [...new Set(containers.map((item) => item.returnPoint).filter(Boolean))];
  const receivable = receivableFees.reduce((sum, item) => sum + item.amount, 0);
  const payable = payableFees.reduce((sum, item) => sum + item.amount, 0);
  const customer = window.CustomerManager?.getActiveCustomerByName(formData.get("customerName"));
  const route = fixedRoutes.find((item) => item.id === formData.get("routeId"));
  const routeAccount = getRouteAccount(route?.customerId || "", route?.projectId || "") || routeAccountCatalog.find((item) => item.customerName === String(formData.get("customerName") || "").trim());
  const manualPlanTaskId = `PT-MANUAL-${Date.now()}`;
  const newWaybill = {
    waybillNo,
    taskType: window.DispatchTaskNodes.defaultType,
    taskConfigSnapshot: window.DispatchTaskNodes.snapshot(window.DispatchTaskNodes.defaultType),
    orderOperatorName: typeof currentOrderOperatorName === "function" ? currentOrderOperatorName() : "后台用户",
    planTaskId: manualPlanTaskId,
    planTaskNo: `JH-${orderDate.replaceAll("-", "")}-MANUAL`,
    planQuantity: 1,
    childSequence: 1,
    orderDate,
    planExecutionDate: orderDate,
    plannedBerthingTime: `${orderDate}T08:00`,
    executionTime: `${orderDate}T08:00`,
    routeId: formData.get("routeId") || "",
    customerId: customer?.customerNo || "-",
    customerName: String(formData.get("customerName") || "").trim(),
    projectId: routeAccount?.projectId || route?.projectId || "",
    projectName: routeAccount?.projectName || route?.projectName || "未分配项目",
    billNo: String(formData.get("billNo") || "").trim() || "-",
    loadAddress: String(formData.get("loadAddress") || "").trim(),
    dispatchNo: `PC-${waybillNo.slice(-8)}`,
    dispatchDate: "-",
    containers,
    boxNo1: containers[0]?.boxNo || "-",
    sealNo1: containers[0]?.sealNo || "-",
    boxNo2: containers[1]?.boxNo || "-",
    sealNo2: containers[1]?.sealNo || "-",
    boxType: boxTypes.join(" / ") || "-",
    boxQuantity: containers.length,
    auditState: "草拟",
    needReceipt: formData.get("needReceipt") ? "是" : "否",
    receivedReceipt: formData.get("receivedReceipt") ? "是" : "否",
    receiptDate: formData.get("receiptDate"),
    remark: String(formData.get("remark") || "").trim() || "-",
    freight: payable,
    receivable,
    entryDate: orderDate,
    profit: receivable - payable,
    payable,
    carrier: "-",
    returnPoint: returnPoints.join(" / ") || "-",
    pickupPoint1: containers[0]?.pickupPoint || "",
    pickupPoint2: containers[1]?.pickupPoint || "",
    plateNo: "",
    driverId: "",
    driverName: "",
    arrived: false,
    arrivalDate: "",
    receivableFees,
    payableFees,
  };
  waybills.unshift(newWaybill);
  if (formData.get("routeId")) waybillRouteMap[waybillNo] = formData.get("routeId");
  saveWaybills();
  createPendingDispatch(newWaybill, route);
  dispatchQueryForm.reset();
  dispatchCurrentPage = 1;
  renderDispatchPage(getFilteredDispatches());
  window.AutoDispatchManager?.refresh();
  closeWaybillForm();
  renderRows(waybills);
  resultText.textContent = `共 ${waybills.length} 条记录，已新增运单 ${waybillNo}`;
});

addDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeWaybillForm();
});

queryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  planTaskQuickFilter = "";
  const rows = filterRows(new FormData(queryForm));
  renderRows(rows);
});

planTaskQuickStats?.addEventListener("click", (event) => {
  const stat = event.target.closest("[data-plan-task-filter]");
  if (!stat) return;
  planTaskQuickFilter = planTaskQuickFilter === stat.dataset.planTaskFilter ? "" : stat.dataset.planTaskFilter;
  renderRows(filterRows(new FormData(queryForm)));
});

tableBody.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-plan]");
  if (editButton) {
    openEditPlanTaskDialog(editButton.dataset.editPlan);
    return;
  }
  const cancelButton = event.target.closest("[data-cancel-plan]");
  if (cancelButton) {
    requestCancelPlan(cancelButton.dataset.cancelPlan);
    return;
  }
  const dispatchButton = event.target.closest("[data-view-plan-dispatch]");
  if (dispatchButton) openPlanDispatchDetail(dispatchButton.dataset.viewPlanDispatch);
});

planTaskDetailPageContent?.addEventListener("click", (event) => {
  const templateButton = event.target.closest("[data-save-plan-template]");
  if (templateButton) {
    const group = getPlanTaskGroups(waybills).find((item) => item.id === templateButton.dataset.savePlanTemplate);
    if (group) openPlanTaskTemplateEditor(null, group);
    return;
  }
  const editButton = event.target.closest("[data-edit-plan]");
  if (editButton) openEditPlanTaskDialog(editButton.dataset.editPlan);
});

planTaskDetailBackBtn?.addEventListener("click", () => switchPage("waybill"));
document.querySelector("#cancelPlanDialogCloseBtn")?.addEventListener("click", () => {
  if (cancelPlanDialog?.open) cancelPlanDialog.close();
  cancellingPlanTaskId = "";
});
confirmCancelPlanBtn?.addEventListener("click", () => {
  if (cancellingPlanTaskId) cancelPlan(cancellingPlanTaskId);
});
cancelPlanDialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  cancelPlanDialog.close();
  cancellingPlanTaskId = "";
});

document.querySelectorAll("[data-page]").forEach((item) => {
  item.addEventListener("click", () => switchPage(item.dataset.page, item));
});

const requestedInitialPage = new URLSearchParams(window.location.search).get("page");
if (requestedInitialPage && pageMeta[requestedInitialPage]) switchPage(requestedInitialPage);

const financeQueryForm = document.querySelector("#financeQueryForm");
const financeReportBody = document.querySelector("#financeReportBody");
const financeExpenseForm = document.querySelector("#financeExpenseForm");
financeQueryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  financeCurrentPage = 1;
  renderFinancePage(getFilteredFinanceRows());
});
financeQueryForm?.addEventListener("change", (event) => {
  if (["customerId", "projectId", "routeId", "taskType", "status", "startDate", "endDate"].includes(event.target.name)) {
    financeCurrentPage = 1;
    renderFinancePage(getFilteredFinanceRows());
  }
});
document.querySelector("#financeExportBtn")?.addEventListener("click", () => {
  const headers = ["接单时间", "客户", "项目", "路线", "运单号", "集装箱号", "箱型", "铅封号", "里程(KM)", "运输方式", "运力归属", "承运类型", "承运单位", "司机所属单位", "车辆所属单位", "车号", "车型", "司机", "司机电话", "结算方式", "应收金额", "三方应付", "异常应收", "异常应付", "能源分摊", "工资成本", "结算单/工资单", "结算状态", "车辆费用", "司机劳务费", "费用合计", "状态"];
  const rows = getFilteredFinanceRows().map((row) => [row.orderDate, row.customerName, row.projectName, row.routeName, row.waybillNo, row.boxes, row.boxTypes, row.seals, row.mileage, row.transportMode, row.capacityOwnership, row.carrierType, row.carrier, row.driverOrganization, row.vehicleOrganization, row.vehicleNo, row.vehicleType, row.driverName, row.driverPhone, row.settlementMethod, row.receivableAmount, row.payableAmount, row.abnormalReceivableAmount, row.abnormalPayableAmount, row.energyAmount, row.payrollAmount, row.documentIds.join(" / "), row.settlementStatus, row.vehicleTotal, row.laborTotal, row.totalExpense, row.status]);
  const escapeCsv = (value) => `"${String(value ?? "").replace(/^([=+\-@])/, "'$1").replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
  link.download = `运输管理台账-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  const result = document.querySelector("#financeResultText");
  if (result) result.textContent = `已导出 ${rows.length} 条运输管理台账`;
});
financeReportBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-finance-expense]");
  if (button) openFinanceExpenseDialog(button.dataset.financeExpense);
});
financeExpenseForm?.addEventListener("input", updateFinanceExpenseTotal);
financeExpenseForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!financeEditingWaybillNo) return;
  const savedWaybillNo = financeEditingWaybillNo;
  const data = new FormData(financeExpenseForm);
  financeExpenseRecords[savedWaybillNo] = financeExpenseFields.reduce((result, field) => {
    result[field] = Math.max(0, financeNumber(data.get(field)));
    return result;
  }, { remark: String(data.get("remark") || "").trim() });
  saveFinanceExpenseRecords();
  closeFinanceExpenseDialog();
  renderFinancePage(getFilteredFinanceRows());
  document.querySelector("#financeResultText").textContent = `${savedWaybillNo} 的费用已保存`;
});
document.querySelector("#closeFinanceExpenseBtn")?.addEventListener("click", closeFinanceExpenseDialog);
document.querySelector("#cancelFinanceExpenseBtn")?.addEventListener("click", closeFinanceExpenseDialog);
document.querySelector("#financePage")?.addEventListener("click", (event) => {
  const dialog = document.querySelector("#financeExpenseDialog");
  if (event.target === dialog) closeFinanceExpenseDialog();
});
document.querySelector("#financePageSize")?.addEventListener("change", () => {
  financeCurrentPage = 1;
  renderFinancePage(getFilteredFinanceRows());
});
document.querySelector("#financePrevPage")?.addEventListener("click", () => {
  financeCurrentPage -= 1;
  renderFinancePage(getFilteredFinanceRows());
});
document.querySelector("#financeNextPage")?.addEventListener("click", () => {
  financeCurrentPage += 1;
  renderFinancePage(getFilteredFinanceRows());
});
document.querySelector("#financePageJump")?.addEventListener("change", (event) => {
  financeCurrentPage = Number(event.target.value) || 1;
  renderFinancePage(getFilteredFinanceRows());
});

const driverExpenseQueryForm = document.querySelector("#driverExpenseQueryForm");
const driverExpenseBody = document.querySelector("#driverExpenseBody");
driverExpenseQueryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  driverExpenseCurrentPage = 1;
  renderDriverExpensePage();
});
driverExpenseQueryForm?.addEventListener("change", (event) => {
  if (["driverId", "type", "status", "startDate", "endDate"].includes(event.target.name)) {
    driverExpenseCurrentPage = 1;
    renderDriverExpensePage();
  }
});
document.querySelector("#driverExpenseSelectAll")?.addEventListener("change", (event) => {
  driverExpenseVisiblePendingIds.forEach((id) => event.target.checked ? selectedDriverExpenseIds.add(id) : selectedDriverExpenseIds.delete(id));
  renderDriverExpensePage();
});
document.querySelector("#driverExpenseSelectPageBtn")?.addEventListener("click", () => {
  driverExpenseVisiblePendingIds.forEach((id) => selectedDriverExpenseIds.add(id));
  renderDriverExpensePage();
});
document.querySelector("#driverExpenseInvertPageBtn")?.addEventListener("click", () => {
  driverExpenseVisiblePendingIds.forEach((id) => {
    if (selectedDriverExpenseIds.has(id)) selectedDriverExpenseIds.delete(id);
    else selectedDriverExpenseIds.add(id);
  });
  renderDriverExpensePage();
});
document.querySelector("#driverExpenseApproveSelectedBtn")?.addEventListener("click", () => {
  const ids = [...selectedDriverExpenseIds];
  if (!ids.length) return;
  askApplicationConfirm(`确认通过已选择的 ${ids.length} 条费用上报吗？`, { label: `通过 ${ids.length} 条费用`, danger: false }, () => {
    const count = applyDriverExpenseReview(ids, "approved");
    document.querySelector("#driverExpenseResultText").textContent = `已批量通过 ${count} 条费用上报`;
  });
});
document.querySelector("#driverExpenseApproveAllBtn")?.addEventListener("click", () => {
  const ids = getFilteredDriverExpenseRows().filter((item) => item.status === "pending").map((item) => item.id);
  if (!ids.length) return;
  askApplicationConfirm(`确认通过当前筛选结果中的全部 ${ids.length} 条待审核费用吗？`, { label: `通过全部 ${ids.length} 条`, danger: false }, () => {
    const count = applyDriverExpenseReview(ids, "approved");
    document.querySelector("#driverExpenseResultText").textContent = `当前筛选结果已全部通过，共处理 ${count} 条`;
  });
});
driverExpenseBody?.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".driver-expense-checkbox");
  if (!checkbox) return;
  if (checkbox.checked) selectedDriverExpenseIds.add(checkbox.value);
  else selectedDriverExpenseIds.delete(checkbox.value);
  renderDriverExpenseSelectionState(getFilteredDriverExpenseRows());
});
driverExpenseBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-driver-expense-action]");
  if (!button) return;
  const id = button.dataset.driverExpenseId;
  if (button.dataset.driverExpenseAction === "approve") {
    askApplicationConfirm(`确认通过费用上报 ${id} 吗？`, { label: "确认通过", danger: false }, () => {
      const count = applyDriverExpenseReview([id], "approved");
      document.querySelector("#driverExpenseResultText").textContent = `已通过 ${count} 条费用上报`;
    });
    return;
  }
  openDriverExpenseReview(id, button.dataset.driverExpenseAction);
});
document.querySelector("#driverExpensePageSize")?.addEventListener("change", () => {
  driverExpenseCurrentPage = 1;
  renderDriverExpensePage();
});
document.querySelector("#driverExpensePrevPage")?.addEventListener("click", () => {
  driverExpenseCurrentPage -= 1;
  renderDriverExpensePage();
});
document.querySelector("#driverExpenseNextPage")?.addEventListener("click", () => {
  driverExpenseCurrentPage += 1;
  renderDriverExpensePage();
});
document.querySelector("#driverExpensePageJump")?.addEventListener("change", (event) => {
  driverExpenseCurrentPage = Number(event.target.value) || 1;
  renderDriverExpensePage();
});
document.querySelector("#closeDriverExpenseReviewBtn")?.addEventListener("click", closeDriverExpenseReview);
document.querySelector("#cancelDriverExpenseReviewBtn")?.addEventListener("click", closeDriverExpenseReview);
document.querySelector("#approveDriverExpenseBtn")?.addEventListener("click", () => reviewCurrentDriverExpense("approved"));
document.querySelector("#rejectDriverExpenseBtn")?.addEventListener("click", () => reviewCurrentDriverExpense("rejected"));
document.querySelector("#driverExpenseRejectReason")?.addEventListener("input", (event) => event.target.setCustomValidity(""));
document.querySelector("#driverExpenseReviewDialog")?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDriverExpenseReview();
});
document.querySelector("#driverExpenseReviewDialog")?.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeDriverExpenseReview();
});

document.querySelector("#refreshDashboardBtn").addEventListener("click", () => {
  renderDashboard();
});

document.querySelector("#dashboardPage").addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-dashboard-action]");
  const statusButton = event.target.closest("[data-dashboard-capacity-scope]");
  const dispatchButton = event.target.closest("[data-dashboard-dispatch]");
  const amountButton = event.target.closest("[data-amount-dimension]");

  if (actionButton) {
    openDashboardTarget(actionButton.dataset.dashboardAction);
    return;
  }
  if (statusButton) {
    const next = { scope: statusButton.dataset.dashboardCapacityScope, status: statusButton.dataset.dashboardCapacityStatus };
    dashboardCapacityFilter = dashboardCapacityFilter?.scope === next.scope && dashboardCapacityFilter.status === next.status ? null : next;
    renderDashboard();
    return;
  }
  if (dispatchButton) {
    switchPage("dispatch-list");
    openDispatchDetail(dispatchButton.dataset.dashboardDispatch);
    return;
  }
  if (amountButton) {
    dashboardAmountDimension = amountButton.dataset.amountDimension;
    document.querySelectorAll("[data-amount-dimension]").forEach((button) => button.classList.toggle("active", button === amountButton));
    renderDashboardAmounts(getDashboardPlanRows());
    window.lucide?.createIcons();
  }
});

document.querySelector("#dashboardFilters").addEventListener("change", (event) => {
  if (event.target.id === "dashboardNearCompleteThreshold") {
    localStorage.setItem("container-logistics-dashboard-near-complete", event.target.value);
  }
  dashboardCapacityFilter = null;
  renderDashboard();
});

window.setInterval(() => {
  if (document.querySelector("#dashboardPage").classList.contains("active")) renderDashboard();
}, 15000);

document.querySelectorAll(".detail-tab").forEach((tab) => {
  tab.addEventListener("click", () => switchModule(tab.dataset.module));
});

vehicleQueryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const warningDays = Number(formData.get("warningDays")) || 30;
  vehicleCurrentPage = 1;
  renderVehiclePage(filterVehicles(formData), warningDays);
});

document.querySelector("#vehicleReminderCards").addEventListener("click", (event) => {
  const card = event.target.closest("[data-vehicle-due-status]");
  if (card) applyVehicleDueStatusFilter(card.dataset.vehicleDueStatus);
});

document.querySelector("#addVehicleBtn").addEventListener("click", () => {
  openVehicleForm("create");
});

document.querySelector("#addVehicleRepairBtn")?.addEventListener("click", () => openVehicleRepairDialog());
document.querySelector("#closeVehicleRepairBtn")?.addEventListener("click", () => document.querySelector("#vehicleRepairDialog")?.close());
document.querySelector("#cancelVehicleRepairBtn")?.addEventListener("click", () => document.querySelector("#vehicleRepairDialog")?.close());
document.querySelector("#addVehicleRepairItemBtn")?.addEventListener("click", () => openVehicleRepairItemDialog());
document.querySelector("#closeVehicleRepairItemBtn")?.addEventListener("click", () => document.querySelector("#vehicleRepairItemDialog")?.close());
document.querySelector("#cancelVehicleRepairItemBtn")?.addEventListener("click", () => document.querySelector("#vehicleRepairItemDialog")?.close());
vehicleRepairItemForm?.addEventListener("submit", submitVehicleRepairItemForm);
vehicleRepairItemForm?.elements.feeItemId?.addEventListener("change", refreshRepairItemFields);
vehicleRepairItemForm?.addEventListener("input", updateRepairItemSubtotal);
vehicleRepairForm?.addEventListener("submit", submitVehicleRepairForm);
vehicleRepairForm?.elements.category?.addEventListener("change", (event) => {
  const required = !["保险", "审验", "北斗", "其他"].includes(event.target.value);
  setRepairShopRequired(required);
});
vehicleRepairQueryForm?.addEventListener("submit", (event) => { event.preventDefault(); renderVehicleRepairPage(); });
vehicleRepairQueryForm?.addEventListener("reset", () => setTimeout(renderVehicleRepairPage));
vehicleRepairRecordQueryForm?.addEventListener("submit", (event) => { event.preventDefault(); renderVehicleRepairRecords(); });
vehicleRepairRecordQueryForm?.addEventListener("reset", () => setTimeout(renderVehicleRepairRecords));
document.querySelector("#exportVehicleRepairsBtn")?.addEventListener("click", exportVehicleRepairReport);
document.querySelector("#exportVehicleRepairRecordsBtn")?.addEventListener("click", exportVehicleRepairRecordReport);
document.querySelectorAll("[data-repair-tab]").forEach((tab) => tab.addEventListener("click", () => {
  document.querySelectorAll("[data-repair-tab]").forEach((button) => { const active = button === tab; button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active)); });
  document.querySelectorAll("[data-repair-panel]").forEach((panel) => { panel.hidden = panel.dataset.repairPanel !== tab.dataset.repairTab; });
  if (tab.dataset.repairTab === "records") renderVehicleRepairRecords();
}));
document.querySelector("#vehicleRepairItemBody")?.addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit-repair-item]");
  const remove = event.target.closest("[data-delete-repair-item]");
  if (edit) openVehicleRepairItemDialog(edit.dataset.editRepairItem);
  if (remove) { vehicleRepairDraftItems = vehicleRepairDraftItems.filter((item) => item.id !== remove.dataset.deleteRepairItem).map((item, index) => ({ ...item, itemNo: String(index + 1).padStart(2, "0") })); renderVehicleRepairDraftItems(); }
});
maintenanceFeeQueryForm?.addEventListener("submit", (event) => { event.preventDefault(); renderMaintenanceFeeConfig(); });
maintenanceFeeQueryForm?.addEventListener("reset", () => setTimeout(renderMaintenanceFeeConfig));
document.querySelector("#addMaintenanceFeeBtn")?.addEventListener("click", () => openMaintenanceFeeDialog());
document.querySelector("#closeMaintenanceFeeBtn")?.addEventListener("click", () => document.querySelector("#maintenanceFeeDialog")?.close());
document.querySelector("#cancelMaintenanceFeeBtn")?.addEventListener("click", () => document.querySelector("#maintenanceFeeDialog")?.close());
maintenanceFeeForm?.addEventListener("submit", submitMaintenanceFeeForm);
document.querySelector("#vehicleMaintenanceFeeConfigPage")?.addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit-maintenance-fee]");
  const toggle = event.target.closest("[data-toggle-maintenance-fee]");
  if (edit) openMaintenanceFeeDialog(edit.dataset.editMaintenanceFee);
  if (toggle) {
    vehicleMaintenanceFeeItems = window.VehicleMaintenanceFeeConfig.save(vehicleMaintenanceFeeItems.map((item) => item.id === toggle.dataset.toggleMaintenanceFee ? { ...item, enabled: !item.enabled, updatedAt: new Date().toISOString() } : item));
    renderMaintenanceFeeConfig();
  }
});
document.querySelector("#repairVendorSearch")?.addEventListener("focus", (event) => renderRepairShopOptions(event.target.value));
document.querySelector("#repairVendorSearch")?.addEventListener("input", (event) => {
  const { value, hint } = getRepairShopPickerElements();
  if (event.target.value !== event.target.dataset.selectedLabel) {
    value.value = "";
    event.target.dataset.selectionMode = "";
    if (hint) {
      hint.textContent = event.target.value ? "请从下拉结果中选择维修厂，不能仅录入自由文本。" : "数据来自“客户管理”中已启用的维修厂";
      hint.classList.remove("selected");
      hint.classList.toggle("warning", Boolean(event.target.value));
    }
  }
  renderRepairShopOptions(event.target.value);
});
document.querySelector("#repairVendorSearch")?.addEventListener("keydown", (event) => {
  const { options } = getRepairShopPickerElements();
  const choices = [...(options?.querySelectorAll("[data-repair-shop-option]") || [])];
  if (event.key === "Escape") { closeRepairShopOptions(); return; }
  if (!choices.length || !["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) return;
  event.preventDefault();
  if (event.key === "ArrowDown") repairShopActiveIndex = Math.min(choices.length - 1, repairShopActiveIndex + 1);
  if (event.key === "ArrowUp") repairShopActiveIndex = Math.max(0, repairShopActiveIndex - 1);
  choices.forEach((choice, index) => {
    const active = index === repairShopActiveIndex;
    choice.classList.toggle("active", active);
    choice.setAttribute("aria-selected", String(active));
    if (active) choice.scrollIntoView({ block: "nearest" });
  });
  if (event.key === "Enter") choices[Math.max(0, repairShopActiveIndex)]?.click();
});
document.querySelector(".repair-shop-toggle")?.addEventListener("click", () => {
  const { root, search, options } = getRepairShopPickerElements();
  if (root?.classList.contains("open") && !options?.hidden) closeRepairShopOptions();
  else { search?.focus(); renderRepairShopOptions(search?.value || ""); }
});
document.querySelector("#repairVendorOptions")?.addEventListener("click", (event) => {
  const option = event.target.closest("[data-repair-shop-option]");
  if (option) {
    const shop = (window.CustomerManager?.getRepairShops?.() || []).find((item) => item.customerNo === option.dataset.repairShopOption);
    if (shop) selectRepairShop(shop);
    return;
  }
  if (event.target.closest("[data-create-repair-shop]")) {
    document.querySelector("#vehicleRepairDialog")?.close();
    closeRepairShopOptions();
    switchPage("customer-archives");
    window.CustomerManager?.openCreateRepairShop?.();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest("[data-repair-shop-combobox]")) closeRepairShopOptions();
});
window.addEventListener("counterpartieschange", () => {
  if (!vehicleRepairForm?.elements.repairVendorCustomerNo) return;
  const selectedCustomerNo = vehicleRepairForm.elements.repairVendorCustomerNo.value;
  const current = vehicleRepairRecords.find((item) => item.id === editingVehicleRepairId);
  fillVehicleRepairShopOptions(selectedCustomerNo || current?.repairVendorCustomerNo || "", current?.repairVendor || "");
});
document.querySelector("#vehicleRepairPage")?.addEventListener("click", (event) => {
  const evidence = event.target.closest("[data-repair-evidence]");
  if (evidence) {
    window.DispatchStore.getPhoto(evidence.dataset.repairEvidence).then((blob) => {
      if (!blob) { showApplicationAlert("凭证文件不存在。"); return; }
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener");
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    }).catch(() => showApplicationAlert("凭证读取失败。"));
    return;
  }
  const edit = event.target.closest("[data-edit-repair]");
  if (edit) openVehicleRepairDialog("", edit.dataset.editRepair);
});

document.querySelector("#closeVehicleFormBtn").addEventListener("click", () => {
  closeVehicleForm();
});

document.querySelector("#cancelVehicleFormBtn").addEventListener("click", () => {
  closeVehicleForm();
});

vehicleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateCapacityOwnershipForm(vehicleForm)) return;
  const data = getVehicleFormData();
  const existingVehicle = vehicles.find((item) => item.plateNo === editingVehiclePlate);
  if (existingVehicle && window.VehicleRepair.hasOpenRepair(vehicleRepairRecords, existingVehicle.plateNo)) data.vehicleState = "维修中";
  const duplicateVehicle = vehicles.find((item) => item.plateNo === data.plateNo && item !== existingVehicle);
  const duplicateTrailer = trailers.find((item) => item.plateNo === data.plateNo);
  const duplicateVehicleVin = trailers.find((item) => item.vin === data.vin && item.vin);

  if (duplicateVehicle || duplicateTrailer || duplicateVehicleVin) {
    const field = duplicateVehicleVin ? vehicleForm.elements.vin : vehicleForm.elements.plateNo;
    field.setCustomValidity(duplicateVehicleVin ? "该车架号已被挂车档案使用。" : "车牌号码已存在，请确认后再保存。");
    field.reportValidity();
    return;
  }
  vehicleForm.elements.plateNo.setCustomValidity("");
  vehicleForm.elements.vin.setCustomValidity("");

  if (vehicleFormMode === "edit" && existingVehicle) {
    const oldPlateNo = existingVehicle.plateNo;
    Object.assign(existingVehicle, data);
    if (oldPlateNo !== data.plateNo) {
      [inspectionRecords, insurancePolicies].forEach((records) => {
        records.forEach((record) => {
          if (complianceRecordValue(record, records === inspectionRecords ? inspectionRecordFields : insurancePolicyFields, "plateNo") !== oldPlateNo) return;
          if (Array.isArray(record)) record[0] = data.plateNo;
          else record.plateNo = data.plateNo;
        });
      });
      saveVehicleComplianceRecords();
    }
    selectedVehicle = existingVehicle;
  } else {
    vehicles.unshift(data);
    selectedVehicle = data;
  }

  vehicleCurrentPage = 1;
  closeVehicleForm();
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
  renderTrailerPage(getFilteredTrailers());
});

document.querySelector("#vehiclePage")?.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-detail-plate]");
  const editButton = event.target.closest("[data-edit-plate]");
  const deleteButton = event.target.closest("[data-delete-plate]");
  const repairButton = event.target.closest("[data-repair-plate]");
  const viewRepairButton = event.target.closest("[data-view-vehicle-repair]");
  if (repairButton) {
    try {
      openVehicleRepairDialog(repairButton.dataset.repairPlate);
    } catch (error) {
      console.error("打开车辆维修窗口失败", error);
      showApplicationAlert("维修登记窗口暂时无法打开，请刷新页面后重试。");
    }
    return;
  }
  if (viewRepairButton) {
    switchPage("vehicle-repairs");
    vehicleRepairQueryForm.elements.plateNo.value = viewRepairButton.dataset.viewVehicleRepair;
    renderVehicleRepairPage();
    return;
  }
  if (detailButton) openVehicleDetail(detailButton.dataset.detailPlate);
  if (editButton) openVehicleForm("edit", editButton.dataset.editPlate);
  if (deleteButton) requestDeleteVehicle(deleteButton.dataset.deletePlate);
});

document.querySelector("#addInspectionRecordBtn").addEventListener("click", openInspectionRecordDialog);
document.querySelector("#addInsurancePolicyBtn").addEventListener("click", openInsurancePolicyDialog);

inspectionRecordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addInspectionRecord(Object.fromEntries(new FormData(inspectionRecordForm).entries()));
  closeVehicleRecordDialog(inspectionRecordDialog, inspectionRecordForm);
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
});

insurancePolicyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(insurancePolicyForm).entries());
  const expiryField = insurancePolicyForm.elements.policyExpiry;
  expiryField.setCustomValidity(values.policyExpiry < values.policyStart ? "保险到期日期不能早于生效日期。" : "");
  if (!insurancePolicyForm.reportValidity()) return;
  values.attachment = window.AttachmentPicker?.getValue(insurancePolicyForm.elements.attachment) || "";
  addInsurancePolicy(values);
  closeVehicleRecordDialog(insurancePolicyDialog, insurancePolicyForm);
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
});

insurancePolicyForm.elements.policyStart.addEventListener("change", () => {
  const { policyStart, policyExpiry } = insurancePolicyForm.elements;
  policyExpiry.setCustomValidity(policyExpiry.value && policyExpiry.value < policyStart.value ? "保险到期日期不能早于生效日期。" : "");
});
insurancePolicyForm.elements.policyExpiry.addEventListener("change", () => {
  const { policyStart, policyExpiry } = insurancePolicyForm.elements;
  policyExpiry.setCustomValidity(policyExpiry.value && policyExpiry.value < policyStart.value ? "保险到期日期不能早于生效日期。" : "");
});

document.querySelectorAll("[data-close-record-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = button.closest(".vehicle-record-dialog");
    closeVehicleRecordDialog(dialog, dialog === inspectionRecordDialog ? inspectionRecordForm : insurancePolicyForm);
  });
});

[inspectionRecordDialog, insurancePolicyDialog].forEach((dialog) => {
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeVehicleRecordDialog(dialog, dialog === inspectionRecordDialog ? inspectionRecordForm : insurancePolicyForm);
  });
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      closeVehicleRecordDialog(dialog, dialog === inspectionRecordDialog ? inspectionRecordForm : insurancePolicyForm);
    }
  });
});

document.querySelector("#cancelDeleteVehicleBtn").addEventListener("click", () => {
  closeDeleteVehicleDialog();
});

document.querySelector("#confirmDeleteVehicleBtn").addEventListener("click", () => {
  if (deletingVehiclePlate) deleteVehicle(deletingVehiclePlate);
});

vehicleDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeVehicleForm();
});

deleteVehicleDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDeleteVehicleDialog();
});

vehicleForm.elements.plateNo.addEventListener("input", () => {
  vehicleForm.elements.plateNo.setCustomValidity("");
});

vehicleDialog.addEventListener("click", (event) => {
  const bounds = vehicleDialog.getBoundingClientRect();
  const isBackdrop =
    event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (isBackdrop) closeVehicleForm();
});

deleteVehicleDialog.addEventListener("click", (event) => {
  const bounds = deleteVehicleDialog.getBoundingClientRect();
  const isBackdrop =
    event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (isBackdrop) closeDeleteVehicleDialog();
});

vehiclePageSizeSelect.addEventListener("change", () => {
  vehicleCurrentPage = 1;
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
});

vehiclePrevPage.addEventListener("click", () => {
  vehicleCurrentPage -= 1;
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
});

vehicleNextPage.addEventListener("click", () => {
  vehicleCurrentPage += 1;
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
});

vehiclePageJump.addEventListener("change", () => {
  vehicleCurrentPage = Number(vehiclePageJump.value) || 1;
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
});

document.querySelector("#backToVehicleListBtn").addEventListener("click", () => {
  closeVehicleDetail();
});

document.querySelector("#messageAlertBtn").addEventListener("click", () => {
  const warningDays = getWarningDays();
  const pending = vehicles
    .map((vehicle) => ({ vehicle, dueInfo: getDueInfo(vehicle, warningDays) }))
    .filter((item) => item.dueInfo.key !== "normal")
    .map((item) => `${item.vehicle.plateNo}：${item.dueInfo.label}`);

  showApplicationAlert(`车辆到期提醒\n${pending.join("\n") || "暂无待提醒车辆"}`);
});
document.querySelector("#exportVehicleBtn")?.addEventListener("click", exportVehicleArchive);

trailerQueryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  trailerCurrentPage = 1;
  renderTrailerPage(filterTrailers(new FormData(event.currentTarget)));
});
document.querySelector("#addVehicleArchiveBtn").addEventListener("click", () => openVehicleForm("create"));
document.querySelector("#addTrailerBtn").addEventListener("click", () => openTrailerForm("create"));
document.querySelector("#exportTrailerBtn")?.addEventListener("click", exportTrailerArchive);
document.querySelector("#closeTrailerFormBtn").addEventListener("click", closeTrailerForm);
document.querySelector("#cancelTrailerFormBtn").addEventListener("click", closeTrailerForm);
trailerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateCapacityOwnershipForm(trailerForm)) return;
  const data = getTrailerFormData();
  const existingTrailer = trailers.find((item) => item.id === editingTrailerId);
  const duplicatePlate = [...trailers, ...vehicles].find((item) => item.plateNo === data.plateNo && item !== existingTrailer);
  const duplicateVin = [...trailers, ...vehicles].find((item) => item.vin === data.vin && item.vin && item !== existingTrailer);
  if (duplicatePlate || duplicateVin) {
    const field = duplicatePlate ? trailerForm.elements.plateNo : trailerForm.elements.vin;
    field.setCustomValidity(duplicatePlate ? "挂车车牌号码已存在，请确认后再保存。" : "挂车车架号已存在，请确认后再保存。");
    field.reportValidity();
    return;
  }
  const existingVehicleWithPlate = vehicles.find((item) => item.plateNo === data.plateNo);
  const existingVehicleWithVin = vehicles.find((item) => item.vin === data.vin && item.vin);
  if (existingVehicleWithPlate || existingVehicleWithVin) {
    const field = existingVehicleWithPlate ? trailerForm.elements.plateNo : trailerForm.elements.vin;
    field.setCustomValidity(existingVehicleWithPlate ? "该车牌号已被牵引车档案使用。" : "该车架号已被车辆档案使用。");
    field.reportValidity();
    return;
  }
  trailerForm.elements.plateNo.setCustomValidity("");
  trailerForm.elements.vin.setCustomValidity("");
  if (trailerFormMode === "edit" && existingTrailer) Object.assign(existingTrailer, data);
  else trailers.unshift(data);
  trailerCurrentPage = 1;
  closeTrailerForm();
  renderTrailerPage(getFilteredTrailers());
  renderVehiclePage(getFilteredVehicles(), getWarningDays());
});
trailerBody.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-trailer]");
  const deleteButton = event.target.closest("[data-delete-trailer]");
  const editVehicleButton = event.target.closest("[data-edit-plate]");
  const deleteVehicleButton = event.target.closest("[data-delete-plate]");
  if (editVehicleButton) openVehicleForm("edit", editVehicleButton.dataset.editPlate);
  if (deleteVehicleButton) requestDeleteVehicle(deleteVehicleButton.dataset.deletePlate);
  if (editButton) openTrailerForm("edit", editButton.dataset.editTrailer);
  if (deleteButton) requestDeleteTrailer(deleteButton.dataset.deleteTrailer);
});
document.querySelector("#cancelDeleteTrailerBtn").addEventListener("click", closeDeleteTrailerDialog);
document.querySelector("#confirmDeleteTrailerBtn").addEventListener("click", () => {
  if (deletingTrailerId) deleteTrailer(deletingTrailerId);
});
trailerDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeTrailerForm();
});
deleteTrailerDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDeleteTrailerDialog();
});
trailerForm.elements.plateNo.addEventListener("input", () => trailerForm.elements.plateNo.setCustomValidity(""));
trailerForm.elements.vin.addEventListener("input", () => trailerForm.elements.vin.setCustomValidity(""));
trailerDialog.addEventListener("click", (event) => {
  const bounds = trailerDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeTrailerForm();
});
deleteTrailerDialog.addEventListener("click", (event) => {
  const bounds = deleteTrailerDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDeleteTrailerDialog();
});
trailerPageSizeSelect.addEventListener("change", () => {
  trailerCurrentPage = 1;
  renderTrailerPage(getFilteredTrailers());
});
trailerPrevPage.addEventListener("click", () => {
  trailerCurrentPage -= 1;
  renderTrailerPage(getFilteredTrailers());
});
trailerNextPage.addEventListener("click", () => {
  trailerCurrentPage += 1;
  renderTrailerPage(getFilteredTrailers());
});
trailerPageJump.addEventListener("change", () => {
  trailerCurrentPage = Number(trailerPageJump.value) || 1;
  renderTrailerPage(getFilteredTrailers());
});

driverQueryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  driverCurrentPage = 1;
  renderDriverPage(filterDrivers(new FormData(event.currentTarget)));
});

document.querySelector("#addDriverBtn").addEventListener("click", () => openDriverForm("create"));
document.querySelector("#closeDriverFormBtn").addEventListener("click", closeDriverForm);
document.querySelector("#cancelDriverFormBtn").addEventListener("click", closeDriverForm);
document.querySelector("#backToDriverListBtn").addEventListener("click", closeDriverDetail);

driverForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateCapacityOwnershipForm(driverForm)) return;
  const data = getDriverFormData();
  const existingDriver = drivers.find((driver) => driver.id === editingDriverId);
  const duplicateIdCard = drivers.find((driver) => driver.idCard === data.idCard && driver !== existingDriver);
  if (duplicateIdCard) {
    driverForm.elements.idCard.setCustomValidity("该身份证号码已存在，请确认后再保存。");
    driverForm.elements.idCard.reportValidity();
    return;
  }
  driverForm.elements.idCard.setCustomValidity("");

  if (driverFormMode === "edit" && existingDriver) {
    if (existingDriver.certificationStatus !== "verified") data.driverState = "停用";
    else if (driverHasActiveDispatch(existingDriver.id) && data.driverState !== "停用") data.driverState = "运输中";
    Object.assign(existingDriver, data);
  } else {
    const nextDriverNumber = Math.max(1000, ...drivers.map((driver) => Number(driver.id.replace(/\D/g, "")) || 0)) + 1;
    data.id = `SJ-${nextDriverNumber}`;
    data.certificationStatus = "unverified";
    data.driverState = "停用";
    drivers.unshift(data);
    saveDriverCertification(data);
  }
  driverCurrentPage = 1;
  closeDriverForm();
  renderDriverPage(getFilteredDrivers());
});

driverBody.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".driver-row-check");
  if (!checkbox) return;
  if (checkbox.checked) selectedDriverIds.add(checkbox.dataset.driverId);
  else selectedDriverIds.delete(checkbox.dataset.driverId);
  updateDriverSelection();
});

[vehicleForm, trailerForm, driverForm].forEach((form) => {
  form?.elements.capacityOwnership?.addEventListener("change", () => syncCapacityOwnershipForm(form));
  form?.elements.supplierName?.addEventListener("input", () => form.elements.supplierName.setCustomValidity(""));
});

driverBody.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-detail-driver]");
  const editButton = event.target.closest("[data-edit-driver]");
  const deleteButton = event.target.closest("[data-delete-driver]");
  const reviewButton = event.target.closest("[data-review-driver]");
  const viewCertificationButton = event.target.closest("[data-view-certification]");
  if (detailButton) openDriverDetail(detailButton.dataset.detailDriver);
  if (reviewButton) openCertificationReview(reviewButton.dataset.reviewDriver);
  if (viewCertificationButton) openCertificationReview(viewCertificationButton.dataset.viewCertification);
  if (editButton) openDriverForm("edit", editButton.dataset.editDriver);
  if (deleteButton) requestDeleteDriver(deleteButton.dataset.deleteDriver);
});

driverSelectAll.addEventListener("change", () => {
  renderedDriverIds.forEach((id) => {
    if (driverSelectAll.checked) selectedDriverIds.add(id);
    else selectedDriverIds.delete(id);
  });
  renderDriverPage(getFilteredDrivers());
});

driverPageSizeSelect.addEventListener("change", () => {
  driverCurrentPage = 1;
  renderDriverPage(getFilteredDrivers());
});

driverPrevPage.addEventListener("click", () => {
  driverCurrentPage -= 1;
  renderDriverPage(getFilteredDrivers());
});

driverNextPage.addEventListener("click", () => {
  driverCurrentPage += 1;
  renderDriverPage(getFilteredDrivers());
});

driverPageJump.addEventListener("change", () => {
  driverCurrentPage = Number(driverPageJump.value) || 1;
  renderDriverPage(getFilteredDrivers());
});

driverMoreBtn.addEventListener("click", () => driverMoreMenu.classList.toggle("open"));
document.querySelector("#exportDriverBtn").addEventListener("click", () => {
  driverMoreMenu.classList.remove("open");
  exportDriverArchive();
});
document.querySelector("#batchDriverStatusBtn").addEventListener("click", () => {
  driverMoreMenu.classList.remove("open");
  showApplicationAlert(selectedDriverIds.size ? `已选择 ${selectedDriverIds.size} 名司机。` : "请先勾选司机档案。");
});

document.querySelector("#cancelDeleteDriverBtn").addEventListener("click", closeDeleteDriverDialog);
document.querySelector("#confirmDeleteDriverBtn").addEventListener("click", () => {
  if (deletingDriverId) deleteDriver(deletingDriverId);
});
document.querySelector("#closeCertificationReviewBtn").addEventListener("click", closeCertificationReview);
document.querySelector("#cancelCertificationReviewBtn").addEventListener("click", closeCertificationReview);
document.querySelector("#approveCertificationBtn").addEventListener("click", () => reviewDriverCertification("verified"));
document.querySelector("#rejectCertificationBtn").addEventListener("click", () => reviewDriverCertification("rejected"));
certificationReviewNote.addEventListener("input", () => certificationReviewNote.setCustomValidity(""));

driverForm.elements.idCard.addEventListener("input", () => driverForm.elements.idCard.setCustomValidity(""));
driverDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDriverForm();
});
deleteDriverDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDeleteDriverDialog();
});
driverCertificationDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeCertificationReview();
});

driverDialog.addEventListener("click", (event) => {
  const bounds = driverDialog.getBoundingClientRect();
  const isBackdrop =
    event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (isBackdrop) closeDriverForm();
});

deleteDriverDialog.addEventListener("click", (event) => {
  const bounds = deleteDriverDialog.getBoundingClientRect();
  const isBackdrop =
    event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (isBackdrop) closeDeleteDriverDialog();
});
driverCertificationDialog.addEventListener("click", (event) => {
  const bounds = driverCertificationDialog.getBoundingClientRect();
  const isBackdrop =
    event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (isBackdrop) closeCertificationReview();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#driverMoreBtn") && !event.target.closest("#driverMoreMenu")) {
    driverMoreMenu.classList.remove("open");
  }
});

routeQueryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  routeHierarchyScope = { type: "all", id: "" };
  routeCurrentPage = 1;
  renderRoutePage(filterRoutes(new FormData(event.currentTarget)));
});
document.querySelector("#routeTaskTypeFilter")?.addEventListener("change", () => {
  routeHierarchyScope = { type: "all", id: "" };
  routeCurrentPage = 1;
  renderRoutePage(getFilteredRoutes());
});

document.querySelector("#addRouteBtn").addEventListener("click", () => openRouteForm("create"));
document.querySelector("#closeRouteFormBtn").addEventListener("click", closeRouteForm);
document.querySelector("#cancelRouteFormBtn").addEventListener("click", closeRouteForm);
document.querySelector("#addProjectBtn")?.addEventListener("click", () => openProjectForm());
document.querySelector("#closeProjectFormBtn")?.addEventListener("click", closeProjectForm);
document.querySelector("#cancelProjectFormBtn")?.addEventListener("click", closeProjectForm);
projectCustomerSelect?.addEventListener("change", (event) => {
  if (projectForm?.elements.projectId) projectForm.elements.projectId.value = getNextProjectId(event.target.value);
});
projectForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  saveProjectFromForm();
});

routeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const supplierInput = routeForm.elements.thirdPartyCarrier;
  const thirdPartyEnabled = routeForm.elements.thirdPartyEnabled.value === "true";
  const supplier = CapacityOwnership.findSupplier(supplierInput.value);
  supplierInput.setCustomValidity(thirdPartyEnabled && (!supplier || supplier.status !== "启用") ? "启用三方运力时，请从客户管理选择已启用的三方供应商。" : "");
  if (!routeForm.reportValidity()) return;
  if (supplier) supplierInput.value = supplier.name;
  const data = getRouteFormData();
  const existingRoute = fixedRoutes.find((route) => route.id === editingRouteId);
  if (routeFormMode === "edit" && existingRoute) Object.assign(existingRoute, data);
  else fixedRoutes.unshift({ id: `XL-${Date.now()}`, routeCode: getNextRouteCode(), ...data });
  saveFixedRoutes();
  routeCurrentPage = 1;
  closeRouteForm();
  renderRoutePage(getFilteredRoutes());
});

routeForm.elements.commissionType.addEventListener("change", updateRouteCommissionPreview);
routeForm.elements.estimatedRevenue.addEventListener("input", updateRouteCommissionPreview);
routeForm.elements.commissionValue.addEventListener("input", updateRouteCommissionPreview);
document.querySelector("#routeCapacityOwnershipFilter")?.addEventListener("change", populateRouteAssociations);

routeBody.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".route-row-check");
  if (!checkbox) return;
  if (checkbox.checked) selectedRouteIds.add(checkbox.dataset.routeId);
  else selectedRouteIds.delete(checkbox.dataset.routeId);
  updateRouteSelection();
});

routeBody.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-route]");
  const deleteButton = event.target.closest("[data-delete-route]");
  if (editButton) openRouteForm("edit", editButton.dataset.editRoute);
  if (deleteButton) requestDeleteRoute(deleteButton.dataset.deleteRoute);
});

document.querySelector("#routeTreeContent")?.addEventListener("click", (event) => {
  const collapse = event.target.closest("[data-route-tree-collapse]");
  const customerButton = event.target.closest("[data-route-customer-id]");
  const projectButton = event.target.closest("[data-route-project-id]");
  if (collapse) {
    const node = collapse.closest(".route-tree-customer");
    node?.classList.toggle("collapsed");
    collapse.setAttribute("aria-expanded", String(!node?.classList.contains("collapsed")));
    return;
  }
  if (customerButton) {
    const customerId = customerButton.dataset.routeCustomerId;
    routeHierarchyScope = { type: "customer", id: customerId };
    routeCurrentPage = 1;
    renderRoutePage(getFilteredRoutes());
    return;
  }
  if (projectButton) {
    routeHierarchyScope = { type: "project", id: projectButton.dataset.routeProjectId };
    routeCurrentPage = 1;
    renderRoutePage(getFilteredRoutes());
  }
});
document.querySelector("[data-route-tree-all]")?.addEventListener("click", () => {
  routeHierarchyScope = { type: "all", id: "" };
  routeCurrentPage = 1;
  renderRoutePage(getFilteredRoutes());
});
document.querySelector("#routeCustomerSelect")?.addEventListener("change", (event) => {
  const projectSelect = document.querySelector("#routeProjectSelect");
  if (!projectSelect) return;
  const projects = routeAccountCatalog.filter((item) => item.customerId === event.target.value);
  projectSelect.innerHTML = '<option value="">请选择项目</option>' + projects.map((item) => `<option value="${item.projectId}">${item.projectName}</option>`).join("");
});

routeSelectAll.addEventListener("change", () => {
  renderedRouteIds.forEach((id) => {
    if (routeSelectAll.checked) selectedRouteIds.add(id);
    else selectedRouteIds.delete(id);
  });
  renderRoutePage(getFilteredRoutes());
});

routePageSizeSelect.addEventListener("change", () => {
  routeCurrentPage = 1;
  renderRoutePage(getFilteredRoutes());
});
routePrevPage.addEventListener("click", () => {
  routeCurrentPage -= 1;
  renderRoutePage(getFilteredRoutes());
});
routeNextPage.addEventListener("click", () => {
  routeCurrentPage += 1;
  renderRoutePage(getFilteredRoutes());
});
routePageJump.addEventListener("change", () => {
  routeCurrentPage = Number(routePageJump.value) || 1;
  renderRoutePage(getFilteredRoutes());
});

routeMoreBtn.addEventListener("click", () => routeMoreMenu.classList.toggle("open"));
document.querySelector("#exportRouteBtn").addEventListener("click", () => {
  routeMoreMenu.classList.remove("open");
  showApplicationAlert(`已准备导出 ${getFilteredRoutes().length} 条固定线路。`);
});
document.querySelector("#batchRouteStateBtn").addEventListener("click", () => {
  routeMoreMenu.classList.remove("open");
  showApplicationAlert(selectedRouteIds.size ? `已选择 ${selectedRouteIds.size} 条线路。` : "请先勾选线路档案。");
});

document.querySelector("#cancelDeleteRouteBtn").addEventListener("click", closeDeleteRouteDialog);
document.querySelector("#confirmDeleteRouteBtn").addEventListener("click", () => {
  if (deletingRouteId) deleteRoute(deletingRouteId);
});
routeDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeRouteForm();
});
deleteRouteDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDeleteRouteDialog();
});
routeDialog.addEventListener("click", (event) => {
  const bounds = routeDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeRouteForm();
});
deleteRouteDialog.addEventListener("click", (event) => {
  const bounds = deleteRouteDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDeleteRouteDialog();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#routeMoreBtn") && !event.target.closest("#routeMoreMenu")) routeMoreMenu.classList.remove("open");
});

document.querySelector("#waybillRouteSelect").addEventListener("change", (event) => {
  fillWaybillFromRoute(event.target.value);
});
waybillForm.elements.customerName.addEventListener("input", fillWaybillFromCustomer);
waybillForm.elements.customerName.addEventListener("change", fillWaybillFromCustomer);

dispatchQueryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  dispatchCurrentPage = 1;
  renderDispatchPage(filterDispatches(new FormData(event.currentTarget)));
});

document.querySelector("#dispatchStats").addEventListener("click", (event) => {
  const button = event.target.closest("[data-dispatch-mode]");
  if (!button) return;
  dispatchQueryForm.reset();
  dispatchQueryForm.elements.dispatchMode.value = button.dataset.dispatchMode;
  dispatchCurrentPage = 1;
  renderDispatchPage(getFilteredDispatches());
});

dispatchQueryForm.elements.dispatchMode.addEventListener("change", () => {
  dispatchCurrentPage = 1;
  renderDispatchPage(getFilteredDispatches());
});

document.querySelector("#addDispatchBtn").addEventListener("click", openDispatchForm);
document.querySelector("#closeDispatchFormBtn").addEventListener("click", closeDispatchForm);
document.querySelector("#cancelDispatchFormBtn").addEventListener("click", closeDispatchForm);
document.querySelector("#dispatchWaybillSelect").addEventListener("change", updateDispatchFormFromWaybill);
document.querySelector("#dispatchRouteSelect")?.addEventListener("change", (event) => {
  const route = fixedRoutes.find((item) => item.id === event.target.value);
  const waybill = waybills.find((item) => item.waybillNo === dispatchForm.elements.waybillId.value);
  if (!route) return;
  const projectSelect = document.querySelector("#dispatchProjectSelect");
  if (projectSelect) projectSelect.value = route.projectId || projectSelect.value;
  updateDispatchRoutePreview(waybill, route);
  const taskType = window.DispatchTaskNodes?.resolve?.(waybill?.taskType) || waybill?.taskType || "";
  renderDispatchJobLocations(taskType, route, { ...waybill, jobLocations: [] });
});
document.querySelector("#dispatchVehicleSelect")?.addEventListener("change", () => {
  syncDispatchVehicleAssignment();
  const vehicleTypeSelect = document.querySelector("#dispatchVehicleTypeSelect");
  if (vehicleTypeSelect && !vehicleTypeSelect.value) vehicleTypeSelect.value = "燃油车";
});

function getDispatchFormValue(name, fallback = "") {
  return dispatchForm.elements[name]?.value ?? fallback;
}

function updateWaybillFromDispatchForm(waybill, route, project) {
  const boxType = getDispatchFormValue("boxType", waybill.boxType || "40HQ");
  const boxNo1 = getDispatchFormValue("boxNo1", waybill.boxNo1 || "-").trim() || "-";
  const tempSealNo1 = getDispatchFormValue("tempSealNo1", waybill.tempSealNo1 || waybill.sealNo1 || "-").trim() || "-";
  const railSealNo1 = getDispatchFormValue("railSealNo1", waybill.railSealNo1 || "-").trim() || "-";
  const seaSealNo1 = getDispatchFormValue("seaSealNo1", waybill.seaSealNo1 || "-").trim() || "-";
  const boxNo2 = getDispatchFormValue("boxNo2", waybill.boxNo2 || "-").trim() || "-";
  const tempSealNo2 = getDispatchFormValue("tempSealNo2", waybill.tempSealNo2 || waybill.sealNo2 || "-").trim() || "-";
  const railSealNo2 = getDispatchFormValue("railSealNo2", waybill.railSealNo2 || "-").trim() || "-";
  const seaSealNo2 = getDispatchFormValue("seaSealNo2", waybill.seaSealNo2 || "-").trim() || "-";
  waybill.routeId = route?.id || waybill.routeId || "";
  waybill.projectId = project?.projectId || waybill.projectId || route?.projectId || "";
  waybill.projectName = project?.projectName || waybill.projectName || route?.projectName || "未分配项目";
  waybill.customerId = project?.customerId || waybill.customerId || route?.customerId || "";
  waybill.customerName = project?.customerName || waybill.customerName || route?.customerName || "";
  waybill.boxType = boxType;
  waybill.boxNo1 = boxNo1;
  waybill.sealNo1 = tempSealNo1;
  waybill.tempSealNo1 = tempSealNo1;
  waybill.railSealNo1 = railSealNo1;
  waybill.seaSealNo1 = seaSealNo1;
  waybill.boxNo2 = boxNo2;
  waybill.sealNo2 = tempSealNo2;
  waybill.tempSealNo2 = tempSealNo2;
  waybill.railSealNo2 = railSealNo2;
  waybill.seaSealNo2 = seaSealNo2;
  waybill.containers = [
    { boxNo: boxNo1, sealNo: tempSealNo1, tempSealNo: tempSealNo1, railSealNo: railSealNo1, seaSealNo: seaSealNo1, boxType, pickupPoint: waybill.pickupPoint1, returnPoint: waybill.returnPoint },
    ...(boxNo2 !== "-" || tempSealNo2 !== "-" || railSealNo2 !== "-" || seaSealNo2 !== "-" ? [{ boxNo: boxNo2, sealNo: tempSealNo2, tempSealNo: tempSealNo2, railSealNo: railSealNo2, seaSealNo: seaSealNo2, boxType, pickupPoint: waybill.pickupPoint2, returnPoint: waybill.returnPoint }] : []),
  ];
  if (route) waybill.loadAddress = route.loadingPoint || route.origin || waybill.loadAddress;
}

dispatchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const readField = (name, fallback = "") => dispatchForm.elements[name]?.value ?? fallback;
  const waybill = waybills.find((item) => item.waybillNo === readField("waybillId"));
  const driver = drivers.find((item) => item.id === readField("driverId"));
  const vehicle = vehicles.find((item) => item.plateNo === readField("vehicleId"));
  const editingDispatch = dispatchForm.dispatchMode === "edit" ? dispatches.find((item) => item.id === dispatchForm.editingDispatchId) : null;
  const selectedRouteId = readField("routeId", editingDispatch?.routeId || waybill?.routeId || "");
  const selectedRoute = typeof fixedRoutes !== "undefined" ? fixedRoutes.find((item) => item.id === selectedRouteId) : null;
  const route = selectedRoute || (waybill ? getRouteForWaybill(waybill.waybillNo) : null);
  const selectedProjectId = readField("projectId", editingDispatch?.projectId || waybill?.projectId || route?.projectId || "");
  const project = typeof routeAccountCatalog !== "undefined" ? routeAccountCatalog.find((item) => item.projectId === selectedProjectId) : null;
  const routeMileageSnapshot = typeof getRouteMileageSnapshot === "function"
    ? getRouteMileageSnapshot(route)
    : (() => {
      const mileage = Number(route?.mileage);
      return route && route.mileage !== "" && Number.isFinite(mileage) && mileage >= 0 ? mileage : null;
    })();
  const driverIsAvailable = driver && (editingDispatch?.driverId === driver.id || availableOwnDrivers().some((item) => item.id === driver.id));
  const vehicleIsAvailable = vehicle && (!vehicle.vehicleState || vehicle.vehicleState === "在用");
  const assignedTrailerId = readField("trailerId", vehicle?.trailerId || "");
  const assignedTrailer = assignedTrailerId && trailers.find((item) => item.id === assignedTrailerId);
  if (driver && vehicle && (Boolean(assignedTrailerId && !assignedTrailer) || !CapacityOwnership.isCompatible([driver, vehicle, assignedTrailer].filter(Boolean)))) {
    showApplicationAlert("司机、车辆和挂车必须属于同一运力归属，请重新选择。");
    return;
  }
  if (vehicle && vehicle.vehicleState === "维修中") {
    showApplicationAlert(`车辆 ${vehicle.plateNo} 维修中，暂不可派单，请选择其他车辆。`);
    return;
  }
  if (!waybill || !driver || !vehicle || !route || !driverIsAvailable || !vehicleIsAvailable) return;
  const dispatchTime = window.DispatchStore.nowText();

  if (typeof updateWaybillFromDispatchForm === "function") updateWaybillFromDispatchForm(waybill, route, project);
  const vehicleTypes = typeof DISPATCH_VEHICLE_TYPES !== "undefined" ? DISPATCH_VEHICLE_TYPES : ["LNG", "燃油车", "新能源车"];
  const currentVehicleType = typeof getDispatchVehicleType === "function" ? getDispatchVehicleType(editingDispatch || {}) : (editingDispatch?.vehicleType || "燃油车");
  const dispatchVehicleType = vehicleTypes.includes(readField("vehicleType")) ? readField("vehicleType") : currentVehicleType;
  const routeChanges = [];

  if (editingDispatch) {
    const wasPendingDispatch = editingDispatch.status === "待派单";
    const previousDriver = editingDispatch.driverName || "待分配";
    const previousVehicle = editingDispatch.vehicleId || "待分配";
    const previousRoute = editingDispatch.routeName || "未指定线路";
    const previousProject = editingDispatch.projectName || "未分配项目";
    const previousBoxes = editingDispatch.boxes || "待装箱";
    const previousTrailer = editingDispatch.trailerId || "未绑定";
    const previousStatus = editingDispatch.status || "待派单";
    const previousNode = editingDispatch.currentNode || "待派单";
    const previousDispatchMode = editingDispatch.status === "待派单" ? "pending" : (editingDispatch.dispatchMode || "manual");
    const previousVehicleType = editingDispatch.vehicleType || "燃油车";
    const previousConsignee = editingDispatch.consignee || "-";
    const previousArrivalTime = editingDispatch.arrivalTime || "-";
    const previousArrivalLocation = editingDispatch.arrivalLocation || "-";
    const previousNote = editingDispatch.note || "-";
    const previousJobLocations = JSON.stringify(editingDispatch.jobLocations || []);
    editingDispatch.dispatchMode = "manual";
    editingDispatch.planTaskId = waybill.planTaskId || editingDispatch.planTaskId;
    editingDispatch.planTaskNo = waybill.planTaskNo || waybill.planTaskId || editingDispatch.planTaskNo;
    editingDispatch.taskType = waybill.taskType || editingDispatch.taskType || "提空装货";
    editingDispatch.taskConfigSnapshot = editingDispatch.taskConfigSnapshot || waybill.taskConfigSnapshot || window.DispatchTaskNodes?.snapshot?.(editingDispatch.taskType);
    if (wasPendingDispatch || !Array.isArray(editingDispatch.photoRequirements)) {
      editingDispatch.photoRequirements = editingDispatch.taskConfigSnapshot?.nodes?.flatMap((node) => node.photoRequirements || []) || [];
    }
    editingDispatch.projectId = project?.projectId || waybill.projectId || "";
    editingDispatch.projectName = project?.projectName || waybill.projectName || "未分配项目";
    editingDispatch.routeId = route.id;
    editingDispatch.routeName = route.routeName;
    editingDispatch.origin = route.pickupPoint || route.origin || waybill.loadAddress || "-";
    editingDispatch.destination = route.unloadingPoint || route.loadingPoint || route.destination || "-";
    editingDispatch.loadAddress = route.dropoffPoint || waybill.returnPoint || route.destination || "";
    editingDispatch.jobLocations = readDispatchJobLocations();
    waybill.jobLocations = JSON.parse(JSON.stringify(editingDispatch.jobLocations));
    editingDispatch.boxes = formatWaybillBoxes(waybill);
    const dispatchBoxValue = (name, fallback = "") => dispatchForm.elements[name]?.value?.trim() || fallback;
    editingDispatch.boxType = dispatchBoxValue("boxType", waybill.boxType || "40HQ");
    editingDispatch.boxNo1 = dispatchBoxValue("boxNo1", waybill.boxNo1 || "-") || "-";
    editingDispatch.sealNo1 = dispatchBoxValue("tempSealNo1", waybill.tempSealNo1 || waybill.sealNo1 || "-") || "-";
    editingDispatch.tempSealNo1 = editingDispatch.sealNo1;
    editingDispatch.railSealNo1 = dispatchBoxValue("railSealNo1", waybill.railSealNo1 || "-") || "-";
    editingDispatch.seaSealNo1 = dispatchBoxValue("seaSealNo1", waybill.seaSealNo1 || "-") || "-";
    editingDispatch.boxNo2 = dispatchBoxValue("boxNo2", waybill.boxNo2 || "-") || "-";
    editingDispatch.sealNo2 = dispatchBoxValue("tempSealNo2", waybill.tempSealNo2 || waybill.sealNo2 || "-") || "-";
    editingDispatch.tempSealNo2 = editingDispatch.sealNo2;
    editingDispatch.railSealNo2 = dispatchBoxValue("railSealNo2", waybill.railSealNo2 || "-") || "-";
    editingDispatch.seaSealNo2 = dispatchBoxValue("seaSealNo2", waybill.seaSealNo2 || "-") || "-";
    waybill.boxType = editingDispatch.boxType;
    waybill.boxNo1 = editingDispatch.boxNo1;
    waybill.sealNo1 = editingDispatch.sealNo1;
    waybill.tempSealNo1 = editingDispatch.tempSealNo1;
    waybill.railSealNo1 = editingDispatch.railSealNo1;
    waybill.seaSealNo1 = editingDispatch.seaSealNo1;
    waybill.boxNo2 = editingDispatch.boxNo2;
    waybill.sealNo2 = editingDispatch.sealNo2;
    waybill.tempSealNo2 = editingDispatch.tempSealNo2;
    waybill.railSealNo2 = editingDispatch.railSealNo2;
    waybill.seaSealNo2 = editingDispatch.seaSealNo2;
    waybill.containers = [
      { boxNo: editingDispatch.boxNo1, sealNo: editingDispatch.sealNo1, tempSealNo: editingDispatch.tempSealNo1, railSealNo: editingDispatch.railSealNo1, seaSealNo: editingDispatch.seaSealNo1, boxType: editingDispatch.boxType, pickupPoint: waybill.pickupPoint1, returnPoint: waybill.returnPoint },
      ...(editingDispatch.boxNo2 !== "-" || editingDispatch.sealNo2 !== "-" || editingDispatch.railSealNo2 !== "-" || editingDispatch.seaSealNo2 !== "-" ? [{ boxNo: editingDispatch.boxNo2, sealNo: editingDispatch.sealNo2, tempSealNo: editingDispatch.tempSealNo2, railSealNo: editingDispatch.railSealNo2, seaSealNo: editingDispatch.seaSealNo2, boxType: editingDispatch.boxType, pickupPoint: waybill.pickupPoint2, returnPoint: waybill.returnPoint }] : []),
    ];
    editingDispatch.boxes = formatWaybillBoxes({ ...waybill, boxType: editingDispatch.boxType, boxNo1: editingDispatch.boxNo1, sealNo1: editingDispatch.sealNo1, boxNo2: editingDispatch.boxNo2, sealNo2: editingDispatch.sealNo2 });
    editingDispatch.estimatedRevenue = Number(route.estimatedRevenue) || 0;
    editingDispatch.commission = calculateRouteCommission(route);
    editingDispatch.thirdPartyCarrierSnapshot = vehicle.ownership === "外协" ? (vehicle.fleetName || vehicle.fleet || route.thirdPartyCarrier || "") : "";
    editingDispatch.thirdPartyPricingMethodSnapshot = route.thirdPartyPricingMethod || "perTrip";
    editingDispatch.thirdPartySettlementPriceSnapshot = vehicle.ownership === "外协" ? Number(route.thirdPartySettlementPrice || route.baseFreight) || 0 : 0;
    editingDispatch.thirdPartySettlementCycleSnapshot = route.thirdPartySettlementCycle || "月结30天";
    editingDispatch.thirdPartyInvoiceRequiredSnapshot = route.thirdPartyInvoiceRequired !== false;
    editingDispatch.vehicleType = dispatchVehicleType;
    editingDispatch.trailerId = readField("trailerId", vehicle.trailerId || editingDispatch.trailerId || "");
    editingDispatch.driverId = driver.id;
    editingDispatch.driverName = driver.name;
    editingDispatch.phone = driver.phone;
    editingDispatch.vehicleId = vehicle.plateNo;
    editingDispatch.consignee = readField("consignee").trim();
    editingDispatch.arrivalTime = readField("arrivalTime").trim();
    editingDispatch.arrivalLocation = readField("arrivalLocation").trim();
    editingDispatch.note = readField("note").trim();
    editingDispatch.pushed = true;
    if (typeof window.applyCapacitySnapshot === "function") window.applyCapacitySnapshot(editingDispatch, true);
    editingDispatch.timeline = Array.isArray(editingDispatch.timeline) ? editingDispatch.timeline : [];
    if (wasPendingDispatch) {
      editingDispatch.status = "已派单";
      editingDispatch.currentNode = "待提货";
      editingDispatch.dispatchTime = dispatchTime;
      editingDispatch.routeMileageSnapshot = routeMileageSnapshot;
      editingDispatch.timeline.push({ node: "已派单", time: dispatchTime, desc: "调度员手动分配司机和车辆，派单已同步至司机微信小程序", photos: [] });
    } else {
      if (previousRoute !== editingDispatch.routeName) routeChanges.push(`线路由 ${previousRoute} 调整为 ${editingDispatch.routeName}`);
      if (previousProject !== editingDispatch.projectName) routeChanges.push(`项目由 ${previousProject} 调整为 ${editingDispatch.projectName}`);
      if (previousBoxes !== editingDispatch.boxes) routeChanges.push(`箱信息调整为 ${editingDispatch.boxes}`);
      editingDispatch.timeline.push({ node: "派单调整", time: dispatchTime, desc: `调度员将运力由 ${previousDriver} / ${previousVehicle} 调整为 ${driver.name} / ${vehicle.plateNo}${routeChanges.length ? `，${routeChanges.join("，")}` : ""}，变更已同步司机微信小程序`, photos: [] });
    }
    const operationTimelineIndex = editingDispatch.timeline.length - 1;
    const operationNode = editingDispatch.timeline[operationTimelineIndex]?.node || (wasPendingDispatch ? "已派单" : "派单调整");
    const operationChanges = [
      { field: "driver", label: "司机", before: previousDriver, after: editingDispatch.driverName },
      { field: "vehicle", label: "车辆", before: previousVehicle, after: editingDispatch.vehicleId },
      { field: "trailer", label: "挂车", before: previousTrailer, after: editingDispatch.trailerId || "未绑定" },
      { field: "vehicleType", label: "车型", before: previousVehicleType, after: editingDispatch.vehicleType },
      { field: "project", label: "项目", before: previousProject, after: editingDispatch.projectName },
      { field: "route", label: "线路", before: previousRoute, after: editingDispatch.routeName },
      { field: "boxes", label: "箱封信息", before: previousBoxes, after: editingDispatch.boxes },
      { field: "jobLocations", label: "作业地点", before: previousJobLocations, after: JSON.stringify(editingDispatch.jobLocations) },
      { field: "consignee", label: "收货人", before: previousConsignee, after: editingDispatch.consignee || "-" },
      { field: "arrivalTime", label: "到达时间", before: previousArrivalTime, after: editingDispatch.arrivalTime || "-" },
      { field: "arrivalLocation", label: "到达地点", before: previousArrivalLocation, after: editingDispatch.arrivalLocation || "-" },
      { field: "note", label: "备注", before: previousNote, after: editingDispatch.note || "-" },
      { field: "dispatchMode", label: "派单方式", before: previousDispatchMode === "auto" ? "自动派单" : previousDispatchMode === "manual" ? "手动派单" : "待分配", after: "手动派单" },
      { field: "status", label: "派单状态", before: previousStatus, after: editingDispatch.status },
      { field: "node", label: "运输节点", before: previousNode, after: editingDispatch.currentNode },
    ].filter((change) => String(change.before) !== String(change.after));
    globalThis.DispatchOperationLog?.record(editingDispatch, {
      signature: `timeline:${operationTimelineIndex}:${dispatchTime}:${operationNode}`,
      time: dispatchTime,
      category: "dispatch",
      action: wasPendingDispatch ? "分配并推送派单" : "编辑派单",
      summary: wasPendingDispatch
        ? `为运单 ${editingDispatch.waybillNo} 分配司机 ${editingDispatch.driverName} 和车辆 ${editingDispatch.vehicleId}，并推送至司机移动端`
        : `编辑运单 ${editingDispatch.waybillNo} 的派单信息${operationChanges.length ? `，共修改 ${operationChanges.length} 个字段` : "，未产生字段变化"}`,
      operatorName: "张调度",
      operatorAccount: "zhangdd",
      operatorRole: "调度员",
      source: "运营后台",
      changes: operationChanges,
    });
    waybill.dispatchDate = (editingDispatch.dispatchTime || dispatchTime).slice(0, 10);
    waybill.plateNo = vehicle.plateNo;
    waybill.driverId = driver.id;
    waybill.driverName = driver.name;
    waybill.trailerId = editingDispatch.trailerId;
    if (wasPendingDispatch) waybill.routeMileageSnapshot = routeMileageSnapshot;
    if (typeof waybillRouteMap !== "undefined") waybillRouteMap[waybill.waybillNo] = route.id;
    syncDriverOperationalStates();
    saveWaybills();
    saveDispatches();
    window.AutoDispatchManager?.refresh();
    renderRows(filterRows(new FormData(queryForm)));
    closeDispatchForm();
    renderDispatchPage(getFilteredDispatches());
    if (typeof activePageName !== "undefined" && activePageName === "dispatch-detail" && typeof renderDispatchDetailPage === "function") renderDispatchDetailPage(currentDispatchDetailId);
    renderDriverPage(getFilteredDrivers());
    renderDashboard();
    return;
  }

  const assigned = {
    dispatchMode: "manual",
    waybillNo: waybill.waybillNo,
    planTaskId: waybill.planTaskId,
    planTaskNo: waybill.planTaskNo || waybill.planTaskId || waybill.waybillNo,
    planExecutionDate: waybill.planExecutionDate || String(waybill.orderDate || "").slice(0, 10),
    plannedBerthingTime: waybill.plannedBerthingTime || waybill.executionTime || `${waybill.orderDate}T08:00`,
    taskType: waybill.taskType || "提空装货",
    taskConfigSnapshot: waybill.taskConfigSnapshot || window.DispatchTaskNodes?.snapshot?.(waybill.taskType || "提空装货") || null,
    photoRequirements: waybill.taskConfigSnapshot?.nodes?.flatMap((node) => node.photoRequirements || []) || [],
    projectId: project?.projectId || waybill.projectId || route.projectId || "",
    projectName: project?.projectName || waybill.projectName || route.projectName || "未分配项目",
    orderDate: waybill.orderDate,
    routeId: route.id,
    routeName: route.routeName,
    origin: route.pickupPoint || route.origin,
    destination: route.unloadingPoint || route.loadingPoint || route.destination,
    loadAddress: route.dropoffPoint || waybill.returnPoint || route.destination,
    dispatchTime,
    driverId: driver.id,
    driverName: driver.name,
    phone: driver.phone,
    vehicleId: vehicle.plateNo,
    vehicleType: dispatchVehicleType,
    trailerId: readField("trailerId", vehicle.trailerId || ""),
    status: "已派单",
    currentNode: "待提货",
    boxes: formatWaybillBoxes(waybill),
    boxType: readField("boxType", waybill.boxType || "40HQ").trim(),
    boxNo1: readField("boxNo1", waybill.boxNo1 || "-").trim() || "-",
    sealNo1: readField("tempSealNo1", waybill.tempSealNo1 || waybill.sealNo1 || "-").trim() || "-",
    tempSealNo1: readField("tempSealNo1", waybill.tempSealNo1 || waybill.sealNo1 || "-").trim() || "-",
    railSealNo1: readField("railSealNo1", waybill.railSealNo1 || "-").trim() || "-",
    seaSealNo1: readField("seaSealNo1", waybill.seaSealNo1 || "-").trim() || "-",
    boxNo2: readField("boxNo2", waybill.boxNo2 || "-").trim() || "-",
    sealNo2: readField("tempSealNo2", waybill.tempSealNo2 || waybill.sealNo2 || "-").trim() || "-",
    tempSealNo2: readField("tempSealNo2", waybill.tempSealNo2 || waybill.sealNo2 || "-").trim() || "-",
    railSealNo2: readField("railSealNo2", waybill.railSealNo2 || "-").trim() || "-",
    seaSealNo2: readField("seaSealNo2", waybill.seaSealNo2 || "-").trim() || "-",
    estimatedRevenue: route.estimatedRevenue,
    commission: calculateRouteCommission(route),
    thirdPartyCarrierSnapshot: vehicle.ownership === "外协" ? (vehicle.fleetName || vehicle.fleet || route.thirdPartyCarrier || "") : "",
    thirdPartyPricingMethodSnapshot: route.thirdPartyPricingMethod || "perTrip",
    thirdPartySettlementPriceSnapshot: vehicle.ownership === "外协" ? Number(route.thirdPartySettlementPrice || route.baseFreight) || 0 : 0,
    thirdPartySettlementCycleSnapshot: route.thirdPartySettlementCycle || "月结30天",
    thirdPartyInvoiceRequiredSnapshot: route.thirdPartyInvoiceRequired !== false,
    consignee: readField("consignee").trim(),
    arrivalTime: readField("arrivalTime").trim(),
    arrivalLocation: readField("arrivalLocation").trim(),
    note: readField("note").trim(),
    routeMileageSnapshot,
    pushed: true,
    timeline: [{ node: "已派单", time: dispatchTime, desc: "派单已推送至司机微信小程序", photos: [] }],
  };
  if (typeof window.applyCapacitySnapshot === "function") window.applyCapacitySnapshot(assigned, true);
  const pending = dispatches.find((item) => item.waybillNo === waybill.waybillNo && item.status === "待派单");
  const savedDispatch = pending || { id: `PD-${Date.now()}`, ...assigned };
  if (pending) Object.assign(pending, assigned);
  else dispatches.unshift(savedDispatch);
  globalThis.DispatchOperationLog?.record(savedDispatch, {
    signature: `timeline:0:${dispatchTime}:已派单`,
    time: dispatchTime,
    category: "dispatch",
    action: "创建并推送派单",
    summary: `为运单 ${waybill.waybillNo} 创建派单，分配司机 ${driver.name} 和车辆 ${vehicle.plateNo}，并推送至司机移动端`,
    operatorName: "张调度",
    operatorAccount: "zhangdd",
    operatorRole: "调度员",
    source: "运营后台",
    changes: [
      { field: "driver", label: "司机", before: "待分配", after: driver.name },
      { field: "vehicle", label: "车辆", before: "待分配", after: vehicle.plateNo },
      { field: "trailer", label: "挂车", before: "未绑定", after: assigned.trailerId || "未绑定" },
      { field: "project", label: "项目", before: "未分配项目", after: assigned.projectName },
      { field: "route", label: "线路", before: "未指定线路", after: assigned.routeName },
      { field: "dispatchMode", label: "派单方式", before: "待分配", after: "手动派单" },
      { field: "status", label: "派单状态", before: "待派单", after: "已派单" },
    ],
  });
  driver.driverState = "运输中";
  waybill.dispatchDate = dispatchTime.slice(0, 10);
  waybill.plateNo = vehicle.plateNo;
  waybill.driverId = driver.id;
  waybill.driverName = driver.name;
  waybill.trailerId = assigned.trailerId;
  waybill.routeMileageSnapshot = routeMileageSnapshot;
  saveWaybills();
  saveDispatches();
  window.AutoDispatchManager?.refresh();
  renderRows(filterRows(new FormData(queryForm)));
  dispatchCurrentPage = 1;
  closeDispatchForm();
  dispatchQueryForm.reset();
  dispatchQueryForm.elements.dispatchMode.value = "manual";
  renderDispatchPage(getFilteredDispatches());
});

dispatchBody.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".dispatch-row-check");
  if (!checkbox) return;
  if (checkbox.checked) selectedDispatchIds.add(checkbox.dataset.dispatchId);
  else selectedDispatchIds.delete(checkbox.dataset.dispatchId);
  updateDispatchSelection();
});

dispatchBody.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view-dispatch]");
  const operationLogButton = event.target.closest("[data-operation-log-dispatch]");
  const editButton = event.target.closest("[data-edit-dispatch]");
  const revokeButton = event.target.closest("[data-revoke-dispatch]");
  if (viewButton) openDispatchDetail(viewButton.dataset.viewDispatch);
  if (operationLogButton) openDispatchOperationLog(operationLogButton.dataset.operationLogDispatch, operationLogButton);
  if (editButton) openDispatchEdit(editButton.dataset.editDispatch);
  if (revokeButton) requestRevokeDispatch(revokeButton.dataset.revokeDispatch);
});

dispatchSelectAll.addEventListener("change", () => {
  renderedDispatchIds.forEach((id) => {
    if (dispatchSelectAll.checked) selectedDispatchIds.add(id);
    else selectedDispatchIds.delete(id);
  });
  renderDispatchPage(getFilteredDispatches());
});

dispatchPageSizeSelect.addEventListener("change", () => {
  dispatchCurrentPage = 1;
  renderDispatchPage(getFilteredDispatches());
});
dispatchPrevPage.addEventListener("click", () => {
  dispatchCurrentPage -= 1;
  renderDispatchPage(getFilteredDispatches());
});
dispatchNextPage.addEventListener("click", () => {
  dispatchCurrentPage += 1;
  renderDispatchPage(getFilteredDispatches());
});
dispatchPageJump.addEventListener("change", () => {
  dispatchCurrentPage = Number(dispatchPageJump.value) || 1;
  renderDispatchPage(getFilteredDispatches());
});

capacityQueryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  capacityCurrentPage = 1;
  renderCapacityPage(getFilteredCapacityRecords());
});
capacityPageSizeSelect.addEventListener("change", () => {
  capacityCurrentPage = 1;
  renderCapacityPage(getFilteredCapacityRecords());
});
capacityPrevPage.addEventListener("click", () => {
  capacityCurrentPage -= 1;
  renderCapacityPage(getFilteredCapacityRecords());
});
capacityNextPage.addEventListener("click", () => {
  capacityCurrentPage += 1;
  renderCapacityPage(getFilteredCapacityRecords());
});
capacityPageJump.addEventListener("change", () => {
  capacityCurrentPage = Number(capacityPageJump.value) || 1;
  renderCapacityPage(getFilteredCapacityRecords());
});
document.querySelector("#capacityManagementSummary").addEventListener("click", (event) => {
  const card = event.target.closest("[data-capacity-status]");
  if (!card) return;
  capacityQueryForm.elements.status.value = card.dataset.capacityStatus;
  capacityCurrentPage = 1;
  renderCapacityPage(getFilteredCapacityRecords());
});
capacityBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-capacity-dispatch]");
  if (!button) return;
  if (button.dataset.capacityDispatch) {
    openDispatchDetail(button.dataset.capacityDispatch);
    return;
  }
  if (button.dataset.capacityVehicle) {
    switchPage("vehicle-archives");
    openVehicleDetail(button.dataset.capacityVehicle);
    return;
  }
  if (button.dataset.capacityDriver) {
    switchPage("driver-archives");
    openDriverDetail(button.dataset.capacityDriver);
  }
});

dispatchMoreBtn.addEventListener("click", () => dispatchMoreMenu.classList.toggle("open"));
function dispatchZipCrc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function buildDispatchZip(files) {
  const encoder = new TextEncoder();
  const chunks = [];
  const entries = [];
  let offset = 0;
  const u16 = (view, index, value) => view.setUint16(index, value, true);
  const u32 = (view, index, value) => view.setUint32(index, value, true);
  files.forEach(({ name, bytes }) => {
    const nameBytes = encoder.encode(name);
    const crc = dispatchZipCrc32(bytes);
    const local = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(local.buffer);
    u32(localView, 0, 0x04034b50); u16(localView, 4, 20); u16(localView, 6, 0x800); u16(localView, 8, 0);
    u32(localView, 14, crc); u32(localView, 18, bytes.length); u32(localView, 22, bytes.length); u16(localView, 26, nameBytes.length);
    local.set(nameBytes, 30);
    chunks.push(local, bytes);
    entries.push({ nameBytes, crc, size: bytes.length, offset });
    offset += local.length + bytes.length;
  });
  const centralOffset = offset;
  entries.forEach(({ nameBytes, crc, size, offset: localOffset }) => {
    const central = new Uint8Array(46 + nameBytes.length);
    const view = new DataView(central.buffer);
    u32(view, 0, 0x02014b50); u16(view, 4, 20); u16(view, 6, 20); u16(view, 8, 0x800); u16(view, 10, 0);
    u32(view, 16, crc); u32(view, 20, size); u32(view, 24, size); u16(view, 28, nameBytes.length); u32(view, 42, localOffset);
    central.set(nameBytes, 46);
    chunks.push(central);
    offset += central.length;
  });
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  u32(endView, 0, 0x06054b50); u16(endView, 8, entries.length); u16(endView, 10, entries.length);
  u32(endView, 12, offset - centralOffset); u32(endView, 16, centralOffset);
  chunks.push(end);
  return new Blob(chunks, { type: "application/zip" });
}

function safeDispatchZipPart(value, fallback) {
  return String(value || "").replace(/[\\/:*?"<>|]/g, "_").trim() || fallback;
}

async function getDispatchPhotoBlob(photo) {
  const meta = dispatchPhotoMeta(photo);
  if (meta.id && window.DispatchStore?.getPhoto) {
    const stored = await window.DispatchStore.getPhoto(meta.id);
    if (stored) return { blob: stored, name: meta.name };
  }
  if (meta.src) {
    const response = await fetch(meta.src);
    if (response.ok) return { blob: await response.blob(), name: meta.name };
  }
  return null;
}

async function exportSelectedDispatchPhotos() {
  const selected = dispatches.filter((dispatch) => selectedDispatchIds.has(dispatch.id));
  if (!selected.length) {
    showApplicationAlert("请先勾选要导出作业照片的派单。");
    return;
  }
  const files = [];
  const missing = [];
  const usedNames = new Map();
  for (const dispatch of selected) {
    const timeline = Array.isArray(dispatch.timeline) ? dispatch.timeline : [];
    const photos = timeline.flatMap((item) => (item.photoAttachments || []).map((photo) => ({ photo, time: item.time })));
    const available = [];
    for (const entry of photos) {
      try {
        const image = await getDispatchPhotoBlob(entry.photo);
        if (image) available.push(image);
      } catch (error) {
        console.warn("作业照片读取失败", dispatch.id, error);
      }
    }
    if (!available.length) {
      missing.push(dispatch.id || dispatch.waybillNo || "未知派单");
      continue;
    }
    const waybill = waybills.find((item) => item.waybillNo === dispatch.waybillNo);
    const boxNo = [dispatch.boxNo1, dispatch.boxNo2, waybill?.boxNo1, waybill?.boxNo2].find((value) => value && value !== "-");
    const folder = [
      safeDispatchZipPart(dispatch.customerName || waybill?.customerName, "无客户名称"),
      safeDispatchZipPart(dispatch.projectName || waybill?.projectName, "无项目名称"),
      safeDispatchZipPart(dispatch.orderDate || waybill?.orderDate, "无下单日期"),
      safeDispatchZipPart(boxNo, "无集装箱箱号"),
    ].join("/");
    for (const { blob, name } of available) {
      const base = safeDispatchZipPart(name, "现场图片");
      const key = `${folder}/${base}`;
      const count = (usedNames.get(key) || 0) + 1;
      usedNames.set(key, count);
      const dot = base.lastIndexOf(".");
      const fileName = count === 1 ? base : dot > 0 ? `${base.slice(0, dot)}(${count - 1})${base.slice(dot)}` : `${base}(${count - 1})`;
      files.push({ name: `${folder}/${fileName}`, bytes: new Uint8Array(await blob.arrayBuffer()) });
    }
  }
  if (files.length) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(buildDispatchZip(files));
    link.download = `派单作业照片_${new Date().toISOString().slice(0, 10)}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  const notice = [files.length ? `已导出 ${files.length} 张作业照片。` : "所选派单均未找到可导出的作业照片。", missing.length ? `无照片派单：${missing.join("、")}` : ""].filter(Boolean).join("\n");
  showApplicationAlert(notice);
}

document.querySelector("#exportDispatchPhotosBtn").addEventListener("click", async () => {
  dispatchMoreMenu.classList.remove("open");
  await exportSelectedDispatchPhotos();
});
document.querySelector("#exportDispatchBtn").addEventListener("click", () => {
  dispatchMoreMenu.classList.remove("open");
  const rows = getFilteredDispatches().map((item) => [item.id, item.waybillNo, item.routeName, item.capacityOwnershipSnapshot, item.driverName, organizationDisplayName(item.driverOrganizationSnapshot), item.vehicleId, organizationDisplayName(item.vehicleOrganizationSnapshot), item.trailerId, organizationDisplayName(item.trailerOrganizationSnapshot), item.carrierTypeSnapshot, organizationDisplayName(item.carrierUnitSnapshot), item.dispatchTime, item.status]);
  downloadCapacityArchive("派单台账", ["派单编号", "运单号", "线路", "运力归属", "司机", "司机所属单位", "车辆", "车辆所属单位", "挂车", "挂车所属单位", "承运类型", "承运单位", "派单时间", "状态"], rows);
});
document.querySelector("#batchDispatchStatusBtn").addEventListener("click", () => {
  dispatchMoreMenu.classList.remove("open");
  showApplicationAlert(selectedDispatchIds.size ? `已选择 ${selectedDispatchIds.size} 条派单。` : "请先勾选派单记录。");
});

document.querySelector("#closeDispatchDetailBtn").addEventListener("click", () => {
  if (dispatchDetailDialog.open) dispatchDetailDialog.close();
});
dispatchDetailBackBtn?.addEventListener("click", () => switchPage("dispatch-list"));
dispatchDetailEditBtn?.addEventListener("click", () => {
  if (currentDispatchDetailId) openDispatchEdit(currentDispatchDetailId);
});
dispatchDetailOperationLogBtn?.addEventListener("click", (event) => {
  if (currentDispatchDetailId) openDispatchOperationLog(currentDispatchDetailId, event.currentTarget);
});
dispatchDetailPageContent?.addEventListener("click", (event) => {
  const photo = event.target.closest("[data-dispatch-photo-index]");
  if (photo) openDispatchPhotoPreview(photo.dataset.dispatchPhotoIndex);
});
document.querySelector("#closeDispatchPhotoPreviewBtn")?.addEventListener("click", () => {
  if (dispatchPhotoPreviewDialog?.open) dispatchPhotoPreviewDialog.close();
});
document.querySelector("#cancelRevokeDispatchBtn").addEventListener("click", closeRevokeDispatchDialog);
document.querySelector("#confirmRevokeDispatchBtn").addEventListener("click", () => {
  if (deletingDispatchId) revokeDispatch(deletingDispatchId);
});

dispatchDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDispatchForm();
});
dispatchDetailDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  dispatchDetailDialog.close();
});
dispatchPhotoPreviewDialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  dispatchPhotoPreviewDialog.close();
});
dispatchPhotoPreviewDialog?.addEventListener("close", () => {
  if (dispatchPhotoPreviewObjectUrl) URL.revokeObjectURL(dispatchPhotoPreviewObjectUrl);
  dispatchPhotoPreviewObjectUrl = "";
});
revokeDispatchDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeRevokeDispatchDialog();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#dispatchMoreBtn") && !event.target.closest("#dispatchMoreMenu")) dispatchMoreMenu.classList.remove("open");
});

window.addEventListener("counterpartieschange", refreshThirdPartyCustomerDatalist);
window.addEventListener("storage", (event) => {
  if (event.key === window.AdminDataBridge?.STORAGE_KEY) {
    const snapshot = window.AdminDataBridge.read();
    if (snapshot) {
      if (Array.isArray(snapshot.waybills)) { waybills.splice(0, waybills.length, ...snapshot.waybills); }
      if (Array.isArray(snapshot.dispatches)) { dispatches.splice(0, dispatches.length, ...snapshot.dispatches); }
      if (Array.isArray(snapshot.fixedRoutes)) { fixedRoutes.splice(0, fixedRoutes.length, ...snapshot.fixedRoutes); }
      if (Array.isArray(snapshot.vehicles)) { vehicles.splice(0, vehicles.length, ...snapshot.vehicles); }
      if (Array.isArray(snapshot.vehicleRepairs)) vehicleRepairRecords = snapshot.vehicleRepairs.map(window.VehicleRepair.normalizeRecord);
      vehicleRepairRecords.filter((record) => window.VehicleRepair.OPEN_STATUSES.has(record.status) && repairRecordAffectsDispatch(record)).forEach((record) => {
        const vehicle = vehicles.find((item) => item.plateNo === record.plateNo);
        if (vehicle) vehicle.vehicleState = "维修中";
      });
      if (Array.isArray(snapshot.trailers)) { trailers.splice(0, trailers.length, ...snapshot.trailers); }
      if (Array.isArray(snapshot.drivers)) {
        const defaultsById = new Map(drivers.map((driver) => [driver.id, driver]));
        const normalizedDrivers = snapshot.drivers.map((driver, index) => normalizeDriverRecord(driver, defaultsById.get(driver?.id) || {}, index));
        const syncedIds = new Set(normalizedDrivers.map((driver) => driver.id));
        const untouchedDrivers = drivers.filter((driver) => !syncedIds.has(driver.id));
        drivers.splice(0, drivers.length, ...normalizedDrivers, ...untouchedDrivers);
      }
      vehicles.forEach((item) => CapacityOwnership.normalizeResource(item, "vehicle"));
      trailers.forEach((item) => CapacityOwnership.normalizeResource(item, "trailer"));
      drivers.forEach((item) => CapacityOwnership.normalizeResource(item, "driver"));
      dispatches.forEach(normalizeDispatchRecord);
      refreshThirdPartyCustomerDatalist();
      syncDriverOperationalStates();
      renderRows(waybills);
      renderVehiclePage(getFilteredVehicles(), getWarningDays());
      renderTrailerPage(getFilteredTrailers());
      renderDriverPage(getFilteredDrivers());
      renderRoutePage(getFilteredRoutes());
      renderDispatchPage(getFilteredDispatches());
      if (activePageName === "dispatch-detail") renderDispatchDetailPage(currentDispatchDetailId);
      renderCapacityPage(getFilteredCapacityRecords());
      renderDriverExpensePage();
      renderVehicleRepairPage();
      renderDashboard();
      publishAdminDataSnapshot();
    }
    return;
  }
  if (event.key === window.VehicleRepair?.STORAGE_KEY) {
    vehicleRepairRecords = window.VehicleRepair.load();
    vehicleRepairRecords.filter((record) => window.VehicleRepair.OPEN_STATUSES.has(record.status) && repairRecordAffectsDispatch(record)).forEach((record) => {
      const vehicle = vehicles.find((item) => item.plateNo === record.plateNo);
      if (vehicle) vehicle.vehicleState = "维修中";
    });
    renderVehicleRepairPage();
    renderVehiclePage(getFilteredVehicles(), getWarningDays());
    renderCapacityPage(getFilteredCapacityRecords());
    window.DispatchManagement?.render();
    window.AutoDispatchManager?.refresh();
  }
  if (event.key === DRIVER_CERTIFICATION_STORAGE_KEY) {
    loadDriverCertifications();
    syncDriverOperationalStates();
    renderDriverPage(getFilteredDrivers());
    if (driverCertificationDialog.open && reviewingDriverId) {
      const driverId = reviewingDriverId;
      closeCertificationReview();
      openCertificationReview(driverId);
    }
    return;
  }
  if (event.key === DRIVER_EXPENSE_STORAGE_KEY) {
    driverExpenseRecords = loadDriverExpenseRecords();
    selectedDriverExpenseIds.clear();
    renderDriverExpensePage();
    if (reviewingDriverExpenseId) closeDriverExpenseReview();
    return;
  }
  if (event.key !== window.DispatchStore.STORAGE_KEY) return;
  window.DispatchStore.replace(dispatches, window.DispatchStore.load(dispatchSeed));
  syncDriverOperationalStates();
  renderDispatchPage(getFilteredDispatches());
  if (activePageName === "dispatch-detail") renderDispatchDetailPage(currentDispatchDetailId);
  renderDriverPage(getFilteredDrivers());
  renderDashboard();
  window.AutoDispatchManager?.refresh();
  if (dispatchDetailDialog.open) dispatchDetailDialog.close();
});

window.addEventListener("message", (event) => {
  const message = event.data;
  if (!message || typeof message !== "object") return;
  if (message.type === "dispatch-sync-request") {
    driverExpenseClientWindow = event.source || driverExpenseClientWindow;
    if (Array.isArray(message.expenses)) {
      mergeDriverExpenseRecords(message.expenses);
      saveDriverExpenseRecords();
      renderDriverExpensePage();
    }
    event.source?.postMessage({ type: "dispatch-sync-data", dispatches, expenses: driverExpenseRecords }, "*");
  }
  if (message.type === "driver-expense-update" && Array.isArray(message.expenses)) {
    driverExpenseClientWindow = event.source || driverExpenseClientWindow;
    mergeDriverExpenseRecords(message.expenses);
    saveDriverExpenseRecords();
    renderDriverExpensePage();
    event.source?.postMessage({ type: "driver-expense-sync-data", expenses: driverExpenseRecords }, "*");
  }
  if (message.type === "dispatch-update" && Array.isArray(message.dispatches)) {
    window.DispatchStore.replace(dispatches, message.dispatches);
    syncDriverOperationalStates();
    saveDispatches();
    renderDispatchPage(getFilteredDispatches());
    if (activePageName === "dispatch-detail") renderDispatchDetailPage(currentDispatchDetailId);
    renderDriverPage(getFilteredDrivers());
    renderDashboard();
    window.AutoDispatchManager?.refresh();
    event.source?.postMessage({ type: "dispatch-sync-data", dispatches, expenses: driverExpenseRecords }, "*");
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  window.DispatchStore.replace(dispatches, window.DispatchStore.load(dispatchSeed));
  syncDriverOperationalStates();
  renderDispatchPage(getFilteredDispatches());
  renderDriverPage(getFilteredDrivers());
  renderDashboard();
  window.AutoDispatchManager?.refresh();
});

const reminderTemplateQueryForm = document.querySelector("#reminderTemplateQueryForm");
const reminderTemplateForm = document.querySelector("#reminderTemplateForm");
const reminderTemplateDialog = document.querySelector("#reminderTemplateDialog");
const reminderTemplateBody = document.querySelector("#reminderTemplateBody");
if (reminderTemplateQueryForm && reminderTemplateForm && reminderTemplateDialog && reminderTemplateBody) {
  reminderTemplateQueryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    reminderTemplateCurrentPage = 1;
    renderReminderTemplatePage(getReminderTemplateFiltered());
  });
  document.querySelector("#reminderTemplateClearBtn").addEventListener("click", () => {
    reminderTemplateQueryForm.reset();
    reminderTemplateCurrentPage = 1;
    renderReminderTemplatePage(getReminderTemplateFiltered());
  });
  document.querySelector("#addReminderTemplateBtn").addEventListener("click", () => openReminderTemplateDialog());
  document.querySelector("#closeReminderTemplateBtn").addEventListener("click", closeReminderTemplateDialog);
  document.querySelector("#cancelReminderTemplateBtn").addEventListener("click", closeReminderTemplateDialog);
  document.querySelector("#reminderTemplateTriggerTiming").addEventListener("change", updateReminderTemplateTriggerFields);
  reminderTemplateForm.addEventListener("input", updateReminderTemplatePreview);
  reminderTemplateForm.addEventListener("change", updateReminderTemplatePreview);
  reminderTemplateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (reminderTemplateForm.dataset.preview === "true") { closeReminderTemplateDialog(); return; }
    const formData = new FormData(reminderTemplateForm);
    const recipients = [...reminderTemplateForm.querySelectorAll("input[name='recipients']:checked")].map((input) => input.value);
    const channels = [...reminderTemplateForm.querySelectorAll("input[name='channels']:checked")].map((input) => input.value);
    if (!recipients.length || !channels.length) {
      showApplicationAlert("请至少选择一名接收对象和一种消息渠道。");
      return;
    }
    const existing = reminderTemplates.find((item) => item.id === reminderTemplateEditingId);
    const now = new Date();
    const updatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const record = {
      id: existing?.id || `NT-${String(Date.now()).slice(-6)}`,
      code: String(formData.get("code") || "").trim(), name: String(formData.get("name") || "").trim(), eventType: String(formData.get("eventType") || ""), scope: String(formData.get("scope") || "全部车队"),
      triggerTiming: String(formData.get("triggerTiming") || "immediate"), offsetMinutes: Number(formData.get("offsetMinutes")) || 0, sendTime: String(formData.get("sendTime") || "09:00"), recipients, channels,
      forceLogic: String(formData.get("forceLogic") || "普通提醒"), repeatInterval: String(formData.get("repeatInterval") || "不重复"), maxRepeats: Number(formData.get("maxRepeats")) || 0, enabled: formData.get("enabled") === "on",
      title: String(formData.get("title") || "").trim(), content: String(formData.get("content") || "").trim(), updatedAt,
    };
    if (existing) Object.assign(existing, record); else reminderTemplates.unshift(record);
    saveReminderTemplates();
    closeReminderTemplateDialog();
    reminderTemplateCurrentPage = 1;
    renderReminderTemplatePage(getReminderTemplateFiltered());
  });
  reminderTemplateBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-reminder-action]");
    if (!button) return;
    const template = reminderTemplates.find((item) => item.id === button.dataset.reminderId);
    if (!template) return;
    const action = button.dataset.reminderAction;
    if (action === "edit") { reminderTemplateForm.dataset.preview = "false"; openReminderTemplateDialog(template.id); return; }
    if (action === "preview") {
      openReminderTemplateDialog(template.id);
      reminderTemplateForm.dataset.preview = "true";
      reminderTemplateForm.querySelectorAll("input, select, textarea").forEach((input) => { input.disabled = true; });
      document.querySelector("#reminderTemplateFormTitle").textContent = "预览消息提醒模板";
      document.querySelector("#reminderTemplateForm").querySelector("button[type='submit']").textContent = "关闭预览";
      return;
    }
    if (action === "toggle") {
      template.enabled = !template.enabled;
      template.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-").slice(0, 16);
      saveReminderTemplates();
      renderReminderTemplatePage(getReminderTemplateFiltered());
    }
  });
  document.querySelector("#reminderTemplatePageSize").addEventListener("change", () => { reminderTemplateCurrentPage = 1; renderReminderTemplatePage(getReminderTemplateFiltered()); });
  document.querySelector("#reminderTemplatePrevPage").addEventListener("click", () => { reminderTemplateCurrentPage -= 1; renderReminderTemplatePage(getReminderTemplateFiltered()); });
  document.querySelector("#reminderTemplateNextPage").addEventListener("click", () => { reminderTemplateCurrentPage += 1; renderReminderTemplatePage(getReminderTemplateFiltered()); });
  document.querySelector("#reminderTemplatePageJump").addEventListener("change", () => { reminderTemplateCurrentPage = Number(document.querySelector("#reminderTemplatePageJump").value) || 1; renderReminderTemplatePage(getReminderTemplateFiltered()); });
  reminderTemplateDialog.addEventListener("close", () => {
    reminderTemplateForm.dataset.preview = "false";
    reminderTemplateForm.querySelectorAll("input, select, textarea").forEach((input) => { input.disabled = false; });
    reminderTemplateForm.querySelector("button[type='submit']").textContent = "保存模板";
  });
}

const announcementQueryForm = document.querySelector("#announcementQueryForm");
const announcementForm = document.querySelector("#announcementForm");
const announcementDialog = document.querySelector("#announcementDialog");
const announcementBody = document.querySelector("#announcementBody");
if (announcementQueryForm && announcementForm && announcementDialog && announcementBody) {
  announcementQueryForm.addEventListener("submit", (event) => { event.preventDefault(); announcementCurrentPage = 1; renderAnnouncementPage(getAnnouncementFiltered()); });
  document.querySelector("#announcementClearBtn").addEventListener("click", () => { announcementQueryForm.reset(); announcementCurrentPage = 1; renderAnnouncementPage(getAnnouncementFiltered()); });
  document.querySelector("#addAnnouncementBtn").addEventListener("click", () => openAnnouncementDialog());
  document.querySelector("#closeAnnouncementBtn").addEventListener("click", closeAnnouncementDialog);
  document.querySelector("#cancelAnnouncementBtn").addEventListener("click", closeAnnouncementDialog);
  announcementForm.addEventListener("input", () => {
    document.querySelector("#announcementPreviewTitle").textContent = announcementForm.elements.title.value.trim() || "公告标题";
    document.querySelector("#announcementPreviewContent").textContent = announcementForm.elements.content.value.trim() || "公告内容将在这里显示。";
  });
  announcementForm.querySelectorAll("input[name='scope']").forEach((input) => input.addEventListener("change", () => setAnnouncementScope(input.value)));
  document.querySelector("#announcementDriverOwnership").addEventListener("change", renderAnnouncementDriverPicker);
  document.querySelector("#announcementDriverList").addEventListener("change", (event) => {
    const input = event.target.closest("input[data-announcement-driver]");
    if (!input) return;
    if (input.checked) announcementSelectedDriverIds.add(input.dataset.announcementDriver);
    else announcementSelectedDriverIds.delete(input.dataset.announcementDriver);
    document.querySelector("#announcementSelectedDriverText").textContent = `已选 ${announcementSelectedDriverIds.size} 名司机`;
  });
  document.querySelector("#announcementSelectVisibleDrivers").addEventListener("click", () => {
    getAnnouncementVisibleDrivers().forEach((driver) => announcementSelectedDriverIds.add(driver.id));
    renderAnnouncementDriverPicker();
  });
  announcementForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(announcementForm);
    const scope = String(formData.get("scope") || "all");
    const targetDriverIds = scope === "all" ? drivers.map((driver) => driver.id) : [...announcementSelectedDriverIds];
    if (scope === "partial" && !targetDriverIds.length) { showApplicationAlert("请选择至少一名接收公告的司机。"); return; }
    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();
    if (!title || !content) { showApplicationAlert("请填写公告标题和消息内容。"); return; }
    const now = new Date();
    const publishedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const attachment = window.AttachmentPicker?.getValue(announcementForm.elements.attachment) || "";
    announcements.unshift({ id: `AN-${String(Date.now()).slice(-6)}`, title, type: String(formData.get("type") || "其他"), content, scope: scope === "all" ? "全部司机" : `部分司机 · ${targetDriverIds.length} 人`, targetDriverIds, attachment, status: "已发布", publishedAt, published: true });
    saveAnnouncements();
    closeAnnouncementDialog();
    announcementCurrentPage = 1;
    renderAnnouncementPage(getAnnouncementFiltered());
    showApplicationAlert(`公告已发布，已向 ${scope === "all" ? `全部 ${targetDriverIds.length}` : targetDriverIds.length} 名司机发送消息。`);
  });
  announcementBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-announcement-action='preview']");
    if (button) openAnnouncementDialog(button.dataset.announcementId);
  });
  document.querySelector("#announcementPageSize").addEventListener("change", () => { announcementCurrentPage = 1; renderAnnouncementPage(getAnnouncementFiltered()); });
  document.querySelector("#announcementPrevPage").addEventListener("click", () => { announcementCurrentPage -= 1; renderAnnouncementPage(getAnnouncementFiltered()); });
  document.querySelector("#announcementNextPage").addEventListener("click", () => { announcementCurrentPage += 1; renderAnnouncementPage(getAnnouncementFiltered()); });
  document.querySelector("#announcementPageJump").addEventListener("change", () => { announcementCurrentPage = Number(document.querySelector("#announcementPageJump").value) || 1; renderAnnouncementPage(getAnnouncementFiltered()); });
  announcementDialog.addEventListener("close", () => {
    announcementForm.querySelectorAll("input, select, textarea").forEach((input) => { input.disabled = false; });
    announcementForm.querySelector("button[type='submit']").hidden = false;
    announcementForm.reset();
  });
}

initializeDispatchCustomSelects();
