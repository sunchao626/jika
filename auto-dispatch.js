(() => {
  const page = document.querySelector("#autoDispatchPage");
  const configPage = document.querySelector("#autoDispatchConfigPage");
  const configRoot = configPage && typeof configPage.querySelector === "function" ? configPage : page;
  const body = page.querySelector("#autoTaskBody");
  const inspector = page.querySelector("#autoInspector");
  const autoWorkspace = page.querySelector("#autoWorkspace");
  const simulator = page.querySelector("#autoSimulator");
  const simulatorTaskSelect = page.querySelector("#autoSimulatorTaskSelect");
  const simulatorCandidateSelect = page.querySelector("#autoSimulatorCandidateSelect");
  const simulatorResult = page.querySelector("#autoSimulatorResult");
  const simulatorFleetBody = page.querySelector("#autoSimulatorFleetBody");
  const simulatorCapacitySummary = page.querySelector("#autoSimulatorCapacitySummary");
  const autoHeadingTitle = page.querySelector(".auto-heading h2");
  const autoHeadingActions = page.querySelector(".auto-heading-actions");
  const rulesDialog = configRoot?.querySelector("#autoRulesDialog");
  const rulesForm = configRoot?.querySelector("#autoRulesForm");
  const SETTINGS_KEY = window.DispatchRuleRegistry?.SETTINGS_KEY || "container-logistics-auto-dispatch-settings-v1";
  const routeMileageSnapshotFor = (route) => {
    if (typeof getRouteMileageSnapshot === "function") return getRouteMileageSnapshot(route);
    const mileage = Number(route?.mileage);
    return route && route.mileage !== "" && Number.isFinite(mileage) && mileage >= 0 ? mileage : null;
  };
  const defaultRuleConfig = window.DispatchRuleRegistry?.defaultRuleConfig || {
    filters: { filterVehicleStatus: true, filterDriverStatus: true, filterDailyTrips: true, filterCapacity: true, filterTimeWindow: true, filterCrossRoute: true },
    scores: { scoreIdle: true, scoreIdleValue: 100, scoreInTransit: true, scoreInTransitValue: 20, scoreRouteMatch: true, scoreRouteMatchValue: 30, scoreDriverLoad: true, scoreDriverLoadValue: 20, scoreDistance: true, scoreDistanceValue: 20, scoreDelay: true, scoreDelayValue: -15, scoreTimeTight: true, scoreTimeTightValue: -10 },
  };
  const defaultSettings = { enabled: true, triggerMode: "realtime", intervalMinutes: 5, retryEnabled: true, maxTrips: 1, warningDays: 30, ruleConfig: defaultRuleConfig };
  const loadSettings = () => {
    try {
      const saved = JSON.parse(window.localStorage?.getItem(SETTINGS_KEY) || "{}");
      return { ...defaultSettings, ...saved, ruleConfig: { filters: { ...defaultRuleConfig.filters, ...(saved.ruleConfig?.filters || {}) }, scores: { ...defaultRuleConfig.scores, ...(saved.ruleConfig?.scores || {}) } } };
    } catch (error) {
      return { ...defaultSettings };
    }
  };
  const settings = loadSettings();
  const saveSettings = () => {
    try { window.localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (error) { /* Storage can be unavailable in private contexts. */ }
    window.DispatchManagement?.render?.();
  };
  const syncRuleControls = () => {
    const filters = settings.ruleConfig.filters;
    const scores = settings.ruleConfig.scores;
    Object.entries(filters).forEach(([name, value]) => { if (rulesForm.elements[name]) rulesForm.elements[name].checked = Boolean(value); });
    Object.entries(scores).forEach(([name, value]) => {
      const control = rulesForm.elements[name];
      if (!control) return;
      if (name.endsWith("Value")) control.value = value;
      else control.checked = Boolean(value);
    });
    rulesForm.elements.maxTrips.value = String(settings.maxTrips);
    rulesForm.elements.warningDays.value = String(settings.warningDays);
  };
  const collectRuleControls = () => {
    const filters = Object.fromEntries(Object.keys(defaultRuleConfig.filters).map((name) => {
      const control = rulesForm.elements[name];
      return [name, control ? control.checked : Boolean(settings.ruleConfig.filters[name])];
    }));
    const scores = Object.fromEntries(Object.keys(defaultRuleConfig.scores).map((name) => [name, name.endsWith("Value") ? Number(rulesForm.elements[name].value) || 0 : rulesForm.elements[name].checked]));
    settings.ruleConfig = { filters, scores };
  };
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const dateAfter = (days) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };
  const dateCode = dateAfter(0).replace(/-/g, "");
  const autoDemoResourceSeeds = {
    drivers: [
      { id: "SJ-AUTO-001", name: "孙凯", phone: "13800010001", driverType: "自有司机", driverState: "运输中", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "宁波演示车队" },
      { id: "SJ-AUTO-002", name: "周宁", phone: "13800010002", driverType: "自有司机", driverState: "运输中", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "上海演示车队" },
      { id: "SJ-AUTO-003", name: "何军", phone: "13800010003", driverType: "自有司机", driverState: "运输中", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "杭州演示车队" },
      { id: "SJ-AUTO-004", name: "冯杰", phone: "13800010004", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "宁波演示车队" },
      { id: "SJ-AUTO-005", name: "许涛", phone: "13800010005", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "上海演示车队" },
      { id: "SJ-AUTO-006", name: "罗成", phone: "13800010006", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "杭州演示车队" },
      { id: "SJ-AUTO-007", name: "郑凯", phone: "13800010007", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "宁波演示车队" },
      { id: "SJ-AUTO-008", name: "蒋磊", phone: "13800010008", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "宁波港区车队" },
      { id: "SJ-AUTO-009", name: "吴斌", phone: "13800010009", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "宁波港区车队" },
      { id: "SJ-AUTO-010", name: "宋杰", phone: "13800010010", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "绍兴协作车队" },
      { id: "SJ-AUTO-011", name: "唐峰", phone: "13800010011", driverType: "自有司机", driverState: "空闲", certificationStatus: "verified", licenseExpiry: "2099-12-31", qualificationExpiry: "2099-12-31", fleet: "杭州协作车队" },
    ],
    vehicles: [
      { plateNo: "浙C·L3210", driverId: "SJ-AUTO-001", driver: "孙凯 / 13800010001", vehicleState: "在用", dispatchState: "运输中", vehicleType: "集装箱牵引车", ratedLoad: 31.6, cargoVolume: 78, energyType: "燃油", currentLocation: "宁波北仑", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "自动派单演示在途运力" },
      { plateNo: "沪C·M8821", driverId: "SJ-AUTO-002", driver: "周宁 / 13800010002", vehicleState: "在用", dispatchState: "运输中", vehicleType: "重型半挂牵引车", ratedLoad: 32, cargoVolume: 82, energyType: "天然气", currentLocation: "上海临港", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "自动派单演示作业运力" },
      { plateNo: "浙C·N4412", driverId: "SJ-AUTO-003", driver: "何军 / 13800010003", vehicleState: "在用", dispatchState: "运输中", vehicleType: "集装箱牵引车", ratedLoad: 31.2, cargoVolume: 76, energyType: "新能源", currentLocation: "杭州萧山", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "自动派单演示在途运力" },
      { plateNo: "甬C·P7730", driverId: "SJ-AUTO-004", driver: "冯杰 / 13800010004", vehicleState: "在用", dispatchState: "即将完成", vehicleType: "集装箱牵引车", ratedLoad: 31.5, cargoVolume: 78, energyType: "燃油", currentLocation: "宁波港区", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "自动派单演示备用运力" },
      { plateNo: "浙C·Q1188", driverId: "SJ-AUTO-005", driver: "许涛 / 13800010005", vehicleState: "在用", dispatchState: "即将完成", vehicleType: "集装箱牵引车", ratedLoad: 31.8, cargoVolume: 78, energyType: "新能源", currentLocation: "上海临港", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "自动派单演示即将完成运力" },
      { plateNo: "沪C·R2209", driverId: "SJ-AUTO-006", driver: "罗成 / 13800010006", vehicleState: "在用", dispatchState: "即将完成", vehicleType: "集装箱牵引车", ratedLoad: 31.3, cargoVolume: 76, energyType: "天然气", currentLocation: "杭州萧山", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "自动派单演示即将完成运力" },
      { plateNo: "浙B·U7021", driverId: "SJ-AUTO-007", driver: "郑凯 / 13800010007", vehicleState: "在用", vehicleType: "集装箱牵引车", ratedLoad: 31.6, cargoVolume: 78, energyType: "新能源", currentLocation: "宁波北仑", drivingLicenseNo: "浙BU7021", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "港区空闲运力" },
      { plateNo: "浙B·V8156", driverId: "SJ-AUTO-008", driver: "蒋磊 / 13800010008", vehicleState: "在用", vehicleType: "重型半挂牵引车", ratedLoad: 32, cargoVolume: 82, energyType: "天然气", currentLocation: "宁波北仑", drivingLicenseNo: "浙BV8156", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "港区空闲运力" },
      { plateNo: "浙B·W3928", driverId: "SJ-AUTO-009", driver: "吴斌 / 13800010009", vehicleState: "在用", vehicleType: "集装箱牵引车", ratedLoad: 31.4, cargoVolume: 76, energyType: "燃油", currentLocation: "宁波梅山", drivingLicenseNo: "浙BW3928", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "港区空闲运力" },
      { plateNo: "浙D·X2669", driverId: "SJ-AUTO-010", driver: "宋杰 / 13800010010", vehicleState: "在用", vehicleType: "集装箱牵引车", ratedLoad: 31.2, cargoVolume: 76, energyType: "新能源", currentLocation: "绍兴柯桥", drivingLicenseNo: "浙DX2669", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "区域空闲运力" },
      { plateNo: "浙A·Y6105", driverId: "SJ-AUTO-011", driver: "唐峰 / 13800010011", vehicleState: "在用", vehicleType: "重型半挂牵引车", ratedLoad: 32, cargoVolume: 82, energyType: "天然气", currentLocation: "杭州萧山", drivingLicenseNo: "浙AY6105", inspectionDue: "2099-12-31", insuranceDue: "2099-12-31", operatingPermitExpiry: "2099-12-31", remark: "区域空闲运力" },
    ],
  };
  function ensureAutoDemoResources() {
    autoDemoResourceSeeds.drivers.forEach((seed) => { if (!drivers.some((driver) => driver.id === seed.id)) drivers.push({ ...seed }); });
    autoDemoResourceSeeds.vehicles.forEach((seed) => { if (!vehicles.some((vehicle) => vehicle.plateNo === seed.plateNo)) vehicles.push({ ...seed }); });
  }
  ensureAutoDemoResources();
  const autoDemoDispatches = [
    { id: "AUTO-DEMO-001", waybillNo: "WB-AUTO-001", routeId: "XL-001", vehicleId: "浙C·L3210", driverId: "SJ-AUTO-001", status: "运输中", currentNode: "重箱进站", taskType: "提空装货", executionMode: "自动执行" },
    { id: "AUTO-DEMO-002", waybillNo: "WB-AUTO-002", routeId: "XL-002", vehicleId: "沪C·M8821", driverId: "SJ-AUTO-002", status: "已派单", currentNode: "待提货", taskType: "提重送货", executionMode: "自动执行" },
    { id: "AUTO-DEMO-003", waybillNo: "WB-AUTO-003", routeId: "XL-002", vehicleId: "浙C·N4412", driverId: "SJ-AUTO-003", status: "运输中", currentNode: "空箱进站", taskType: "提重送货", executionMode: "自动执行" },
    { id: "AUTO-DEMO-004", waybillNo: "WB-AUTO-004", routeId: "XL-001", vehicleId: "甬C·P7730", driverId: "SJ-AUTO-004", status: "运输中", currentNode: "重箱进站", taskType: "提空装货", executionMode: "自动执行" },
    { id: "AUTO-DEMO-005", waybillNo: "WB-AUTO-005", routeId: "XL-003", vehicleId: "浙A·F2190", driverId: "SJ-1004", status: "已完成", currentNode: "已送达", taskType: "排重箱（A→B）", executionMode: "自动执行" },
    { id: "AUTO-DEMO-006", waybillNo: "WB-AUTO-006", routeId: "XL-003", vehicleId: "浙C·Q1188", driverId: "SJ-AUTO-005", status: "运输中", currentNode: "箱进站", taskType: "排重箱（A→B）", executionMode: "自动执行" },
    { id: "AUTO-DEMO-007", waybillNo: "WB-AUTO-007", routeId: "XL-002", vehicleId: "沪C·R2209", driverId: "SJ-AUTO-006", status: "运输中", currentNode: "空箱进站", taskType: "提重送货", executionMode: "自动执行" },
  ].map((item, index) => ({ ...item, planDate: dateAfter(1), dispatchTime: `${dateAfter(0)} 0${8 + index}:2${index}`, source: "自动执行记录" }));
  function toAutoDemoTask(dispatch) {
    const driver = drivers.find((item) => item.id === dispatch.driverId);
    const vehicle = vehicles.find((item) => item.plateNo === dispatch.vehicleId);
    return {
      id: `auto-demo-task-${dispatch.id}`,
      waybillNo: dispatch.waybillNo,
      routeId: dispatch.routeId,
      planDate: dispatch.planDate,
      source: dispatch.source,
      taskType: dispatch.taskType,
      status: "confirmed",
      match: { driver, vehicle, load: 0, dedicated: false, soon: false, score: 100 },
      confirmedAt: dispatch.dispatchTime,
      executionMode: dispatch.executionMode,
    };
  }
  const autoDemoConfirmedTasks = autoDemoDispatches.map(toAutoDemoTask).filter((task) => task.match.driver && task.match.vehicle);
  const initialTasks = () => [
    ...autoDemoConfirmedTasks.map((task) => ({ ...task, match: { ...task.match } })),
    ...dispatches.filter((item) => item.status === "待派单").map((item) => ({
      id: `pending-${item.id}`, waybillNo: item.waybillNo, routeId: item.routeId,
      planDate: dateAfter(1), source: "待派单运单", status: "queue",
    })),
    { id: "order-201", waybillNo: `WB${dateCode}006`, routeId: "XL-002", planDate: dateAfter(2), source: "待调度订单", status: "queue" },
    { id: "order-202", waybillNo: `WB${dateCode}007`, routeId: "XL-003", planDate: dateAfter(1), source: "待调度订单", status: "queue" },
    { id: "order-203", waybillNo: `WB${dateCode}008`, routeId: "XL-004", planDate: dateAfter(1), source: "待调度订单", status: "queue" },
    { id: "order-204", waybillNo: dispatches.find((item) => item.status === "运输中")?.waybillNo || "WB20260916001", routeId: "XL-001", planDate: dateAfter(2), source: "待调度订单", status: "queue" },
  ];
  let tasks = initialTasks();
  let activeTab = "queue";
  let selectedId = tasks[0]?.id;
  let selectedPlate = vehicles[0]?.plateNo;
  let lastRun = "";
  let nextRun = settings.enabled && settings.triggerMode === "realtime" ? "新任务进入时" : "";
  let lastSummary = "等待任务";
  let runState = settings.enabled ? "waiting" : "paused";
  let autoTimer = null;
  let activeView = "dispatch";
  let simulatorTaskId = tasks.find((task) => task.status !== "confirmed")?.id || tasks[0]?.id;
  let simulatorCandidateIndex = 0;
  let simulatorSnapshot = null;
  const simulatedAssignments = new Map();

  function syncPendingTasks() {
    tasks = tasks.filter((task) => !task.id.startsWith("pending-") || task.status === "confirmed" || dispatches.some((item) => `pending-${item.id}` === task.id && item.status === "待派单"));
    dispatches.filter((item) => item.status === "待派单").forEach((item) => {
      if (tasks.some((task) => task.id === `pending-${item.id}`)) return;
      tasks.unshift({ id: `pending-${item.id}`, waybillNo: item.waybillNo, routeId: item.routeId,
        planDate: item.orderDate || dateAfter(1), executionTime: item.executionTime || "", taskType: item.taskType || "提空装货",
        autoDispatch: item.autoDispatch === undefined ? true : Boolean(item.autoDispatch), dispatchAdvanceMinutes: Number(item.dispatchAdvanceMinutes) || 0,
        source: "待派单运单", status: "queue" });
    });
  }

  function routeFor(task) { return fixedRoutes.find((route) => route.id === task.routeId); }
  function vehicleOperation(vehicle) {
    if (vehicle.vehicleState !== "在用") return { state: vehicle.vehicleState || "停用", dispatch: null };
    const dispatch = dispatches.find((item) => item.vehicleId === vehicle.plateNo && ["运输中", "已派单"].includes(item.status))
      || autoDemoDispatches.find((item) => item.vehicleId === vehicle.plateNo && ["运输中", "已派单"].includes(item.status));
    if (!dispatch) return { state: "闲置", dispatch: null };
    return { state: dispatch.status === "运输中" ? "在途" : "作业中", dispatch };
  }
  const autoTaskNodeSequences = {
    "提空装货": ["已提空", "空箱在途", "到达仓库", "完成装货", "重箱在途", "重箱进站", "完成落重"],
    "提重送货": ["已提重", "重箱在途", "到达仓库", "完成卸货", "空箱在途", "空箱进站", "完成落空"],
    "排空箱（A→B）": ["已提空", "空箱在途", "完成落空"],
    "排重箱（A→B）": ["已提重", "重箱在途", "箱进站", "完成落重"],
  };
  function getAutoTaskProgress(dispatch) {
    if (!dispatch) return null;
    if (typeof getDashboardTaskMeta === "function") return getDashboardTaskMeta(dispatch);
    const nodes = autoTaskNodeSequences[dispatch.taskType] || autoTaskNodeSequences["提空装货"];
    const currentNode = String(dispatch.currentNode || "").trim();
    let currentIndex = nodes.indexOf(currentNode);
    if (dispatch.status === "已完成" || ["已送达", "完成落重", "完成落空"].includes(currentNode)) currentIndex = nodes.length - 1;
    const completedCount = Math.max(0, Math.min(nodes.length, currentIndex + 1));
    return {
      taskType: dispatch.taskType || "提空装货",
      nodes,
      currentIndex,
      completedCount,
      stage: currentIndex >= 0 ? nodes[currentIndex] : "待开始",
      progress: Math.round(completedCount / nodes.length * 100),
      exceptionReason: dispatch.status === "已派单" && currentNode === "待提货" ? "提箱超时" : "",
      nearComplete: completedCount > 0 && completedCount < nodes.length && completedCount / nodes.length >= 0.7,
    };
  }
  function renderAutoNodeProgress(dispatch) {
    if (!dispatch) return '<span class="auto-progress-empty">暂无执行任务</span>';
    const meta = getAutoTaskProgress(dispatch);
    const nodeBlocks = meta.nodes.map((node, index) => {
      const state = index < meta.currentIndex ? "completed" : index === meta.currentIndex ? "current" : "pending";
      return `<i class="auto-node-block ${state}" title="${escapeHtml(node)}" aria-label="${escapeHtml(node)}"></i>`;
    }).join("");
    const stateClass = meta.exceptionReason ? "exception" : meta.nearComplete ? "near-complete" : "";
    return `<div class="auto-node-progress ${stateClass}">
      <div class="auto-node-progress-head"><strong>${escapeHtml(meta.stage)}</strong><span>${meta.progress}%</span></div>
      <span class="auto-node-track" role="list" aria-label="${escapeHtml(`${meta.taskType}节点进度`)}">${nodeBlocks}</span>
      <small>${meta.completedCount} / ${meta.nodes.length} 节点 · ${escapeHtml(meta.nodes.join(" → "))}</small>
    </div>`;
  }
  function reservations(date, planned = []) {
    const existing = dispatches.filter((item) => item.dispatchTime?.slice(0, 10) === date && ["已派单", "运输中", "已完成"].includes(item.status));
    const sameDay = planned.filter((task) => task.planDate === date && task.match);
    return {
      drivers: [...existing.map((item) => item.driverId), ...sameDay.filter((task) => task.match?.driver).map((task) => task.match.driver.id)],
      vehicles: sameDay.filter((task) => task.match?.vehicle).map((task) => task.match.vehicle.plateNo),
    };
  }
  function qualifiedDriver(driver, date) {
    return driver.driverType === "自有司机" && driver.driverState === "空闲" &&
      driver.certificationStatus === "verified" && driver.licenseExpiry >= date && driver.qualificationExpiry >= date;
  }
  function qualifiedVehicle(vehicle, date) {
    return vehicleOperation(vehicle).state === "闲置" && vehicle.inspectionDue >= date &&
      vehicle.insuranceDue >= date && vehicle.operatingPermitExpiry >= date;
  }
  function candidatesFor(task, planned) {
    const route = routeFor(task);
    if (!route) return { candidates: [], reason: "线路档案不存在" };
    if (route.routeState !== "启用") return { candidates: [], reason: "线路已停用" };
    if (dispatches.some((item) => item.waybillNo === task.waybillNo && !["待派单", "取消"].includes(item.status))) {
      return { candidates: [], reason: "运单已有有效派单" };
    }
    const used = reservations(task.planDate, planned);
    const eligibleDrivers = drivers.filter((driver) => qualifiedDriver(driver, task.planDate));
    if (!eligibleDrivers.length) return { candidates: [], reason: "无空闲、已认证且证件有效的自有司机" };
    const availableDrivers = eligibleDrivers.filter((driver) => used.drivers.filter((id) => id === driver.id).length < settings.maxTrips);
    if (!availableDrivers.length) return { candidates: [], reason: "司机当日任务已达上限" };
    const idleVehicles = vehicles.filter((vehicle) => vehicleOperation(vehicle).state === "闲置");
    if (!idleVehicles.length) return { candidates: [], reason: "暂无闲置车辆，在途及作业中车辆不可分配" };
    const eligibleVehicles = idleVehicles.filter((vehicle) => qualifiedVehicle(vehicle, task.planDate));
    if (!eligibleVehicles.length) return { candidates: [], reason: "闲置车辆的年检、营运证或保险已到期" };
    const availableVehicles = eligibleVehicles.filter((vehicle) => !used.vehicles.includes(vehicle.plateNo));
    if (!availableVehicles.length) return { candidates: [], reason: "闲置车辆在该日期已安排任务" };

    const candidates = availableDrivers.flatMap((driver) => availableVehicles.map((vehicle) => {
      const load = used.drivers.filter((id) => id === driver.id).length;
      const dedicated = vehicle.plateNo === route.defaultVehicle;
      const familiar = driver.name === route.defaultDriver;
      const soon = [driver.licenseExpiry, driver.qualificationExpiry, vehicle.insuranceDue, vehicle.inspectionDue]
        .some((end) => (new Date(`${end}T12:00:00`) - new Date(`${task.planDate}T12:00:00`)) / 86400000 <= settings.warningDays);
      const vehicleLocation = String(vehicle.currentLocation || vehicle.fleetName || "");
      const locationTokens = ["北仑", "宁波", "上海", "杭州", "苏州", "绍兴", "嘉兴", "金华", "舟山"];
      const originToken = locationTokens.find((token) => String(route.origin || "").includes(token));
      const closeToPickup = Boolean(originToken && vehicleLocation.includes(originToken));
      const recentDelay = dispatches.some((dispatch) => dispatch.driverId === driver.id && (dispatch.timeline || []).some((entry) => /延误/.test(`${entry.node || ""}${entry.desc || ""}`)));
      const sharedMatch = window.DispatchRuleRegistry?.scoreMatch?.({
        idle: true,
        routeVehicle: dedicated,
        familiarDriver: familiar,
        lowDriverLoad: load < settings.maxTrips,
        closeToPickup,
        recentDelay,
        timeTight: false,
        unavailable: false,
      }, settings.ruleConfig);
      return {
        driver, vehicle, load, dedicated, familiar, soon,
        score: sharedMatch?.score ?? 76 + (dedicated ? 15 : 0) + (familiar ? 4 : 0) + Math.max(0, 5 - load * 3),
        ruleTags: sharedMatch?.tags || [],
      };
    })).sort((a, b) => b.score - a.score || Number(b.dedicated) - Number(a.dedicated) || a.load - b.load ||
      a.driver.id.localeCompare(b.driver.id) || a.vehicle.plateNo.localeCompare(b.vehicle.plateNo, "zh-CN"));
    return { candidates: candidates.slice(0, 4), reason: "" };
  }
  function taskPriority(task) {
    const route = routeFor(task);
    const vehicle = vehicles.find((item) => item.plateNo === route?.defaultVehicle);
    return route?.routeState === "启用" && vehicle && qualifiedVehicle(vehicle, task.planDate) ? 1 : 0;
  }

  function nowText() {
    if (window.DispatchStore?.nowText) return window.DispatchStore.nowText();
    return new Date().toLocaleString("zh-CN", { hour12: false });
  }

  function updateNextRun() {
    if (!settings.enabled) {
      nextRun = "已暂停";
      return;
    }
    if (settings.triggerMode === "realtime") {
      nextRun = settings.retryEnabled ? "新任务进入时 / 异常自动重试" : "新任务进入时";
      return;
    }
    const date = new Date(Date.now() + settings.intervalMinutes * 60000);
    nextRun = date.toLocaleString("zh-CN", { hour12: false });
  }

  function isAutoDispatchDue(task) {
    if (task.autoDispatch === false) return false;
    if (!task.executionTime) return true;
    const executionAt = new Date(String(task.executionTime).replace(" ", "T")).getTime();
    if (!Number.isFinite(executionAt)) return true;
    return Date.now() >= executionAt - (Number(task.dispatchAdvanceMinutes) || 0) * 60000;
  }

  function persistAssignments() {
    window.DispatchStore?.save?.(dispatches);
    if (typeof saveWaybills === "function") saveWaybills();
  }

  function confirmTask(task, match, automatic = false) {
    const route = routeFor(task);
    if (!route || !match) return false;
    const dispatchTime = nowText();
    const pending = dispatches.find((item) => item.waybillNo === task.waybillNo && item.status === "待派单");
    const assignment = {
      dispatchMode: automatic ? "auto" : "manual",
      waybillNo: task.waybillNo,
      orderDate: pending?.orderDate || task.planDate,
      routeId: route.id,
      routeName: route.routeName,
      origin: route.origin,
      destination: route.destination,
      loadAddress: pending?.loadAddress || `${route.origin} / ${route.destination}`,
      dispatchTime,
      driverId: match.driver.id,
      driverName: match.driver.name,
      phone: match.driver.phone || "-",
      vehicleId: match.vehicle.plateNo,
      routeMileageSnapshot: routeMileageSnapshotFor(route),
      status: "已派单",
      currentNode: "待提货",
      boxes: pending?.boxes || "待装箱",
      estimatedRevenue: Number(route.estimatedRevenue) || 0,
      commission: calculateRouteCommission(route),
      note: automatic ? "系统自动派单" : "调度确认派单",
      pushed: true,
      timeline: [{ node: "已派单", time: dispatchTime, desc: automatic ? "系统完成自动派单并推送至司机微信小程序" : "调度确认后推送至司机微信小程序", photos: [] }],
    };
    if (pending) Object.assign(pending, assignment);
    else dispatches.unshift({ id: `PD-${Date.now()}-${task.id}`, ...assignment });
    match.driver.driverState = "运输中";
    if (typeof waybills !== "undefined") {
      const waybill = waybills.find((item) => item.waybillNo === task.waybillNo);
      if (waybill) {
        waybill.dispatchDate = dispatchTime.slice(0, 10);
        waybill.plateNo = match.vehicle.plateNo;
        waybill.driverId = match.driver.id;
        waybill.driverName = match.driver.name;
        waybill.routeMileageSnapshot = routeMileageSnapshotFor(route);
      }
    }
    task.match = match;
    task.status = "confirmed";
    task.confirmedAt = dispatchTime;
    task.executionMode = automatic ? "自动执行" : "人工确认";
    return true;
  }

  function runMatching({ automatic = false, trigger = "立即执行" } = {}) {
    runState = "running";
    syncPendingTasks();
    const reserved = tasks.filter((task) => task.status === "confirmed");
    tasks.map((task, index) => ({ task, index })).filter(({ task }) => task.status !== "confirmed" && (!automatic || isAutoDispatchDue(task)))
      .sort((a, b) => taskPriority(b.task) - taskPriority(a.task) || a.index - b.index)
      .forEach(({ task }) => {
        const result = candidatesFor(task, reserved);
        task.candidates = result.candidates;
        task.reason = result.reason;
        task.matchIndex = 0;
        task.status = result.candidates.length ? "ready" : "exception";
        if (task.status === "ready") reserved.push({ ...task, match: task.candidates[0] });
      });
    let assignedCount = 0;
    if (automatic) {
      tasks.filter((task) => task.status === "ready").forEach((task) => {
        if (confirmTask(task, task.candidates[task.matchIndex || 0], true)) assignedCount += 1;
      });
      if (assignedCount) persistAssignments();
    }
    const exceptionCount = tasks.filter((task) => task.status === "exception").length;
    lastRun = nowText();
    lastSummary = automatic ? `成功 ${assignedCount} · 异常 ${exceptionCount}` : `已生成 ${tasks.filter((task) => task.status === "ready").length} 个方案`;
    runState = settings.enabled ? "waiting" : "paused";
    updateNextRun();
    activeTab = automatic
      ? (exceptionCount ? "exception" : "result")
      : (tasks.some((task) => task.status === "ready") ? "queue" : tasks.some((task) => task.status === "exception") ? "exception" : "result");
    selectedId = tasks.find((task) => activeTab === "queue" ? task.status === "ready" : activeTab === "exception" ? task.status === "exception" : task.status === "confirmed")?.id;
    page.dataset.lastTrigger = trigger;
    render();
  }

  function runAutomatic(trigger = "自动执行", force = false) {
    if (!settings.enabled && !force) return;
    runMatching({ automatic: true, trigger });
  }

  function scheduleAutomaticExecution() {
    if (autoTimer && window.clearInterval) window.clearInterval(autoTimer);
    autoTimer = null;
    updateNextRun();
    if (!settings.enabled || !window.setInterval || (settings.triggerMode !== "interval" && !settings.retryEnabled)) return;
    autoTimer = window.setInterval(() => {
      const hasExceptions = tasks.some((task) => task.status === "exception");
      if (settings.triggerMode === "interval" || (settings.retryEnabled && hasExceptions)) {
        runAutomatic(settings.triggerMode === "interval" ? "定时执行" : "异常自动重试");
      }
    }, settings.intervalMinutes * 60000);
  }
  function renderFleetDetail(vehicle) {
    if (!vehicle) { inspector.innerHTML = ""; return; }
    const operation = vehicleOperation(vehicle);
    const routes = fixedRoutes.filter((route) => route.defaultVehicle === vehicle.plateNo && route.routeState === "启用");
    const confirmed = tasks.filter((task) => task.status === "confirmed" && task.match.vehicle.plateNo === vehicle.plateNo);
    inspector.innerHTML = `<div class="auto-inspector-head"><div><span>车辆信息</span><h3>${escapeHtml(vehicle.plateNo)}</h3></div><span class="auto-state ${operation.state === "闲置" ? "ready" : operation.state === "停用" ? "disabled" : "busy"}">${operation.state}</span></div>
      <div class="auto-detail-grid"><div><span>车辆状态</span><strong>${escapeHtml(vehicle.vehicleState)}</strong></div><div><span>当前任务</span><strong>${escapeHtml(operation.dispatch?.waybillNo || "无")}</strong></div><div><span>绑定线路</span><strong>${escapeHtml(routes.map((route) => route.routeName).join("、") || "未绑定")}</strong></div><div><span>已确认排程</span><strong>${confirmed.length} 趟</strong></div><div><span>年检到期</span><strong>${escapeHtml(vehicle.inspectionDue)}</strong></div><div><span>保险到期</span><strong>${escapeHtml(vehicle.insuranceDue)}</strong></div></div>
      <section class="auto-fleet-progress"><div class="auto-fleet-progress-heading"><strong>当前任务节点进度</strong><span>${escapeHtml(operation.dispatch?.currentNode || "暂无执行任务")}</span></div>${renderAutoNodeProgress(operation.dispatch)}</section>
      <button class="btn quiet auto-confirm" type="button" data-auto-nav="vehicle-archives">查看车辆档案</button>`;
  }
  function renderInspector(task) {
    if (!task) { inspector.innerHTML = '<div class="auto-inspector-empty"><strong>暂无记录</strong></div>'; return; }
    const route = routeFor(task);
    const match = task.status === "confirmed" ? task.match : task.candidates?.[task.matchIndex || 0];
    const dedicated = vehicles.find((vehicle) => vehicle.plateNo === route?.defaultVehicle);
    const dedicatedState = dedicated ? vehicleOperation(dedicated).state : "未绑定";
    const summary = route ? `<div class="auto-detail-grid"><div><span>固定线路</span><strong>${escapeHtml(route.routeName)}</strong></div><div><span>计划日期</span><strong>${escapeHtml(task.planDate)}</strong></div><div><span>起运地</span><strong>${escapeHtml(route.origin)}</strong></div><div><span>目的地</span><strong>${escapeHtml(route.destination)}</strong></div><div><span>线路专属车辆</span><strong>${escapeHtml(route.defaultVehicle || "未绑定")} · ${escapeHtml(dedicatedState)}</strong></div><div><span>预估收入 / 司机提成</span><strong>${formatMoney(Number(route.estimatedRevenue) || 0)} / ${formatMoney(calculateRouteCommission(route))}</strong></div></div>` : "";
    const others = task.status === "ready" && task.candidates.length > 1 ? `<div class="auto-candidate-list"><strong>其他候选运力</strong>${task.candidates.map((candidate, index) => `<button class="auto-candidate ${index === task.matchIndex ? "chosen" : ""}" type="button" data-auto-candidate="${index}"><span>${escapeHtml(candidate.driver.name)} · ${escapeHtml(candidate.vehicle.plateNo)}${candidate.dedicated ? " · 专属车辆" : ""} · 当日 ${candidate.load} 趟</span><b>${candidate.score} 分</b></button>`).join("")}</div>` : "";
    const destination = task.reason?.includes("线路") ? ["fixed-routes", "查看线路档案"] : task.reason?.includes("运单") ? ["dispatch-list", "查看派单列表"] : task.reason?.includes("司机") ? ["driver-archives", "查看司机档案"] : task.reason?.includes("车辆") ? ["vehicle-archives", "查看车辆档案"] : ["", ""];
    inspector.innerHTML = `<div class="auto-inspector-head"><div><span>任务详情</span><h3>${escapeHtml(task.waybillNo)}</h3></div><span class="auto-state ${task.status}">${{ queue: "待匹配", ready: "待确认", exception: "需处理", confirmed: "已派单" }[task.status]}</span></div>${summary}
      ${match ? `<div class="auto-match-result"><div class="auto-match-title"><strong>${task.status === "confirmed" ? "已分配运力" : "匹配建议"}</strong><span>${match.score} 分</span></div><div class="auto-match-person"><div><span>司机</span><strong>${escapeHtml(match.driver.name)}</strong><small>当日已安排 ${match.load} 趟 · 负载优先</small></div><div><span>车辆</span><strong>${escapeHtml(match.vehicle.plateNo)}</strong><small>闲置${match.dedicated ? " · 线路专属" : " · 可用运力"}</small></div></div>${dedicated && dedicatedState !== "闲置" && !match.dedicated ? `<p class="auto-warning">专属车辆${escapeHtml(dedicatedState)}，已匹配其他闲置车辆。</p>` : ""}${match.soon ? `<p class="auto-warning">有证件或保险将在 ${settings.warningDays} 天内到期。</p>` : ""}</div>${others}${task.status === "confirmed" ? `<div class="auto-trace"><strong>派单记录</strong><span>${escapeHtml(task.confirmedAt)} · ${escapeHtml(task.executionMode || "人工确认")} · 已推送司机端</span></div>` : `<button class="btn primary auto-confirm" id="autoConfirmBtn" type="button">确认并派单</button>`}` : task.status === "exception" ? `<div class="auto-exception-detail"><strong>待处理原因</strong><p>${escapeHtml(task.reason)}</p></div>${destination[0] ? `<button class="btn quiet auto-confirm" data-auto-nav="${destination[0]}" type="button">${destination[1]}</button>` : ""}<button class="auto-retry" id="autoRetryBtn" type="button">重新匹配</button>` : `<div class="auto-waiting"><strong>待匹配</strong></div><button class="btn primary auto-confirm" id="autoSingleRunBtn" type="button">运行匹配</button>`}`;
  }

  function simulatorCandidates(task) {
    if (!task) return { candidates: [], reason: "暂无可模拟订单" };
    const simulated = simulatedAssignments.get(task.id);
    if (simulated) return { candidates: [simulated.match], reason: "" };
    const result = task.candidates?.length ? { candidates: task.candidates, reason: "" } : task.match ? { candidates: [task.match], reason: "" } : candidatesFor(task, []);
    const reserved = new Set([...simulatedAssignments.values()].map((item) => `${item.match.driver.id}|${item.match.vehicle.plateNo}`));
    return { ...result, candidates: result.candidates.filter((candidate) => !reserved.has(`${candidate.driver.id}|${candidate.vehicle.plateNo}`)) };
  }

  function renderSimulatorCapacity() {
    const assignedByDriver = new Map([...simulatedAssignments.values()].map((item) => [item.match.driver.id, item]));
    const assignedByVehicle = new Map([...simulatedAssignments.values()].map((item) => [item.match.vehicle.plateNo, item]));
    simulatorCapacitySummary.textContent = `${assignedByVehicle.size} 台车辆受模拟影响 · ${assignedByDriver.size} 名司机受模拟影响`;
    simulatorFleetBody.innerHTML = vehicles.map((vehicle) => {
      const assignment = assignedByVehicle.get(vehicle.plateNo);
      const driver = assignment?.match.driver || drivers.find((item) => item.id === assignment?.match.driver.id);
      const operation = vehicleOperation(vehicle);
      const taskLabel = assignment?.task.waybillNo || operation.dispatch?.waybillNo || "无";
      return `<tr><td>${escapeHtml(driver?.name || "未绑定")}</td><td><strong>${escapeHtml(vehicle.plateNo)}</strong></td><td><span class="auto-state ${assignment ? "busy" : "ready"}">${assignment ? "运输中" : escapeHtml(driver?.driverState || "空闲")}</span></td><td><span class="auto-state ${assignment ? "busy" : operation.state === "闲置" ? "ready" : "disabled"}">${assignment ? "作业中" : escapeHtml(operation.state)}</span></td><td>${escapeHtml(taskLabel)}</td></tr>`;
    }).join("");
  }

  function renderSimulator() {
    const options = tasks.filter((task) => routeFor(task));
    if (!options.some((task) => task.id === simulatorTaskId)) simulatorTaskId = options[0]?.id;
    const task = options.find((item) => item.id === simulatorTaskId);
    simulatorTaskSelect.innerHTML = options.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.waybillNo)} · ${escapeHtml(routeFor(item)?.routeName || "线路未找到")}</option>`).join("");
    simulatorTaskSelect.value = simulatorTaskId || "";
    const result = simulatorCandidates(task);
    if (simulatorCandidateIndex >= result.candidates.length) simulatorCandidateIndex = 0;
    simulatorCandidateSelect.innerHTML = result.candidates.length
      ? result.candidates.map((candidate, index) => `<option value="${index}">${escapeHtml(candidate.driver.name)} · ${escapeHtml(candidate.vehicle.plateNo)} · ${candidate.score} 分</option>`).join("")
      : `<option value="">${escapeHtml(result.reason || "暂无可用候选运力")}</option>`;
    simulatorCandidateSelect.value = result.candidates.length ? String(simulatorCandidateIndex) : "";
    if (!simulatorSnapshot || simulatorSnapshot.taskId !== task?.id) {
      simulatorSnapshot = null;
      simulatorResult.innerHTML = `<div class="auto-simulator-empty"><strong>选择订单和候选运力后开始模拟</strong><span>模拟结果仅在此页面展示，不会写入正式派单数据。</span></div>`;
    } else {
      const snapshot = simulatorSnapshot;
      simulatorResult.innerHTML = `<div class="auto-simulator-summary"><strong>模拟派单结果</strong><span>${escapeHtml(snapshot.taskLabel)}</span></div><div class="auto-simulator-state-grid"><div><span>司机状态</span><strong>${escapeHtml(snapshot.driverName)}</strong><small>${escapeHtml(snapshot.driverBefore)} <b>→</b> ${escapeHtml(snapshot.driverAfter)}</small></div><div><span>车辆状态</span><strong>${escapeHtml(snapshot.vehiclePlate)}</strong><small>${escapeHtml(snapshot.vehicleBefore)} <b>→</b> ${escapeHtml(snapshot.vehicleAfter)}</small></div><div><span>当前任务</span><strong>${escapeHtml(snapshot.vehicleBeforeTask)}</strong><small>模拟后关联 ${escapeHtml(snapshot.taskLabel)}</small></div></div>`;
    }
  }

  function runSimulator() {
    const task = tasks.find((item) => item.id === simulatorTaskId);
    const matches = simulatorCandidates(task).candidates;
    const match = matches[simulatorCandidateIndex];
    if (!task || !match) { simulatorSnapshot = null; renderSimulator(); return; }
    const operation = vehicleOperation(match.vehicle);
    simulatorSnapshot = {
      taskId: task.id, taskLabel: task.waybillNo, driverName: match.driver.name, vehiclePlate: match.vehicle.plateNo,
      driverBefore: match.driver.driverState || "空闲", driverAfter: "运输中", vehicleBefore: operation.state,
      vehicleAfter: "作业中", vehicleBeforeTask: operation.dispatch?.waybillNo || "无",
    };
    simulatedAssignments.set(task.id, { task, match });
    renderSimulator();
  }

  function renderExecutionState() {
    const enabled = settings.enabled;
    configRoot.querySelector("#autoExecutionToggle").checked = enabled;
    configRoot.querySelector("#autoTriggerMode").value = settings.triggerMode;
    configRoot.querySelector("#autoIntervalMinutes").value = String(settings.intervalMinutes);
    configRoot.querySelector("#autoRetryToggle").checked = settings.retryEnabled;
    configRoot.querySelector("#autoIntervalField").classList.toggle("disabled", settings.triggerMode !== "interval");
    page.querySelector("#autoExecutionBadge").textContent = enabled ? "自动执行中" : "已暂停";
    page.querySelector("#autoExecutionBadge").dataset.state = enabled ? "active" : "paused";
    configRoot.querySelector("#autoExecutionTitle").textContent = enabled ? "自动执行已开启" : "自动执行已暂停";
    configRoot.querySelector("#autoExecutionDescription").textContent = enabled
      ? (settings.triggerMode === "realtime" ? "新任务进入后自动匹配并派单" : `每 ${settings.intervalMinutes} 分钟批量匹配并派单`)
      : "待派单任务将保留，仍可手动立即执行";
    configRoot.querySelector("#autoLastRun").textContent = lastRun || "等待首次执行";
    configRoot.querySelector("#autoNextRun").textContent = nextRun || "等待设置";
    configRoot.querySelector("#autoRunSummary").textContent = lastSummary;
    configRoot.querySelector("#autoRunDot").dataset.state = runState;
  }

  function render() {
    renderExecutionState();
    const queue = tasks.filter((task) => ["queue", "ready"].includes(task.status));
    const exceptions = tasks.filter((task) => task.status === "exception");
    const results = tasks.filter((task) => task.status === "confirmed");
    const idle = vehicles.filter((vehicle) => vehicleOperation(vehicle).state === "闲置");
    const busy = vehicles.filter((vehicle) => ["在途", "作业中"].includes(vehicleOperation(vehicle).state));
    page.querySelector("#autoMetrics").innerHTML = [
      ["待匹配任务", queue.length, "待处理运单", "total"], ["当前闲置车辆", idle.length, "按计划日期校验排程", "ready"],
      ["在途 / 作业中", busy.length, "当前不参与分配", "exception"], ["已完成派单", results.length, "已推送司机端", "result"],
    ].map(([label, value, hint, type]) => `<div class="auto-metric ${type}"><span>${label}</span><strong>${value}</strong><small>${hint}</small></div>`).join("");
    page.querySelector("#autoQueueCount").textContent = queue.length;
    page.querySelector("#autoExceptionCount").textContent = exceptions.length;
    page.querySelector("#autoResultCount").textContent = results.length;
    page.querySelector("#autoFleetCount").textContent = vehicles.length;
    page.querySelectorAll(".auto-stage span").forEach((stage, index) => stage.classList.toggle("reached", index === 0 || (lastRun && index < 3) || (results.length && index === 3)));
    page.querySelectorAll("[data-auto-tab]").forEach((tab) => {
      const active = tab.dataset.autoTab === activeTab;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    page.querySelectorAll("[data-auto-view]").forEach((tab) => {
      const active = tab.dataset.autoView === activeView;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    autoHeadingTitle.textContent = activeView === "simulator" ? "派单模拟器" : "自动派单";
    autoHeadingActions.hidden = activeView === "simulator";
    [page.querySelector(".auto-runner"), page.querySelector(".auto-stage"), page.querySelector("#autoMetrics"), page.querySelector(".auto-toolbar"), autoWorkspace].forEach((element) => { if (element) element.hidden = activeView === "simulator"; });
    simulator.hidden = activeView !== "simulator";
    if (activeView === "simulator") { renderSimulator(); renderSimulatorCapacity(); return; }
    if (activeTab === "fleet") {
      page.querySelector("#autoListTitle").textContent = "车辆运力状态";
      page.querySelector("#autoListSubtitle").textContent = `闲置 ${idle.length} · 在途 / 作业中 ${busy.length}`;
      page.querySelector("#autoTableHead").innerHTML = '<tr><th>车牌</th><th>绑定线路</th><th>当前状态</th><th>关联任务</th><th>节点进度</th><th class="fixed-action-column">操作</th></tr>';
      if (!vehicles.some((vehicle) => vehicle.plateNo === selectedPlate)) selectedPlate = vehicles[0]?.plateNo;
      const fleetRows = vehicles.map((vehicle, index) => {
        const operation = vehicleOperation(vehicle);
        const progress = getAutoTaskProgress(operation.dispatch);
        return { vehicle, operation, progress, index };
      }).sort((a, b) => Number(Boolean(b.progress?.nearComplete)) - Number(Boolean(a.progress?.nearComplete)) ||
        Number(b.progress?.progress || 0) - Number(a.progress?.progress || 0) || a.index - b.index);
      body.innerHTML = fleetRows.map(({ vehicle, operation }) => {
        const route = fixedRoutes.find((item) => item.routeState === "启用" && item.defaultVehicle === vehicle.plateNo);
        const booked = tasks.filter((task) => task.status === "confirmed" && task.match.vehicle.plateNo === vehicle.plateNo);
        const jobs = operation.dispatch?.waybillNo || booked.map((task) => `${task.planDate} ${task.waybillNo}`).join("、") || "-";
        return `<tr class="${selectedPlate === vehicle.plateNo ? "selected" : ""}" data-auto-plate="${escapeHtml(vehicle.plateNo)}"><td><strong>${escapeHtml(vehicle.plateNo)}</strong></td><td>${escapeHtml(route?.routeName || "未绑定")}</td><td><span class="auto-state ${operation.state === "闲置" ? "ready" : operation.state === "停用" ? "disabled" : "busy"}">${operation.state}</span></td><td>${escapeHtml(jobs)}</td><td class="auto-fleet-progress-cell">${renderAutoNodeProgress(operation.dispatch)}</td><td class="fixed-action-column"><button class="link-btn" type="button">查看</button></td></tr>`;
      }).join("");
      renderFleetDetail(vehicles.find((vehicle) => vehicle.plateNo === selectedPlate));
      return;
    }
    const groups = { queue, exception: exceptions, result: results };
    const visible = groups[activeTab];
    if (!visible.some((task) => task.id === selectedId)) selectedId = visible[0]?.id;
    page.querySelector("#autoListTitle").textContent = { queue: "待处理任务", exception: "异常任务", result: "已完成派单" }[activeTab];
    page.querySelector("#autoListSubtitle").textContent = lastRun ? `最近执行：${lastRun}` : `待处理 ${queue.length} 条`;
    page.querySelector("#autoTableHead").innerHTML = '<tr><th>任务 / 来源</th><th>运输线路</th><th>计划日期</th><th>匹配状态</th><th class="fixed-action-column">操作</th></tr>';
    body.innerHTML = visible.length ? visible.map((task) => {
      const status = { queue: "待匹配", ready: "待确认", exception: "需处理", confirmed: "已派单" }[task.status];
      return `<tr class="${task.id === selectedId ? "selected" : ""}" data-auto-id="${escapeHtml(task.id)}"><td><strong>${escapeHtml(task.waybillNo)}</strong><small>${escapeHtml(task.source)}</small></td><td>${escapeHtml(routeFor(task)?.routeName || "线路未找到")}</td><td>${escapeHtml(task.planDate)}</td><td><span class="auto-state ${task.status}">${status}</span></td><td class="fixed-action-column"><button class="link-btn" type="button">查看</button></td></tr>`;
    }).join("") : `<tr><td class="no-data-cell" colspan="5">${{ queue: "暂无待处理任务", exception: "暂无异常任务", result: "暂无已完成派单" }[activeTab]}</td></tr>`;
    renderInspector(tasks.find((task) => task.id === selectedId));
  }

  page.querySelector("#autoRunBtn").addEventListener("click", () => runAutomatic("手动立即执行", true));
  page.querySelector("#autoResetBtn").addEventListener("click", () => {
    tasks = initialTasks();
    simulatedAssignments.clear();
    simulatorSnapshot = null;
    simulatorTaskId = tasks.find((task) => task.status !== "confirmed")?.id || tasks[0]?.id;
    simulatorCandidateIndex = 0;
    activeTab = "queue";
    selectedId = tasks[0]?.id;
    lastRun = "";
    lastSummary = "等待任务";
    runState = settings.enabled ? "waiting" : "paused";
    updateNextRun();
    render();
  });
  configRoot.querySelector("#autoExecutionToggle").addEventListener("change", (event) => {
    settings.enabled = event.target.checked;
    runState = settings.enabled ? "waiting" : "paused";
    saveSettings();
    scheduleAutomaticExecution();
    if (settings.enabled && settings.triggerMode === "realtime") runAutomatic("启用自动执行");
    else render();
  });
  configRoot.querySelector("#autoTriggerMode").addEventListener("change", (event) => {
    settings.triggerMode = event.target.value;
    saveSettings();
    scheduleAutomaticExecution();
    if (settings.enabled && settings.triggerMode === "realtime") runAutomatic("切换为即时执行");
    else render();
  });
  configRoot.querySelector("#autoIntervalMinutes").addEventListener("change", (event) => {
    settings.intervalMinutes = Number(event.target.value) || 5;
    saveSettings();
    scheduleAutomaticExecution();
    render();
  });
  configRoot.querySelector("#autoRetryToggle").addEventListener("change", (event) => {
    settings.retryEnabled = event.target.checked;
    saveSettings();
    scheduleAutomaticExecution();
    render();
  });
  simulatorTaskSelect.addEventListener("change", (event) => { simulatorTaskId = event.target.value; simulatorCandidateIndex = 0; simulatorSnapshot = null; render(); });
  simulatorCandidateSelect.addEventListener("change", (event) => { simulatorCandidateIndex = Number(event.target.value) || 0; simulatorSnapshot = null; renderSimulator(); });
  page.querySelector("#autoSimulatorRunBtn").addEventListener("click", runSimulator);
  page.querySelector("#autoSimulatorResetBtn").addEventListener("click", () => { simulatedAssignments.clear(); simulatorSnapshot = null; simulatorCandidateIndex = 0; renderSimulator(); renderSimulatorCapacity(); });
  page.querySelectorAll("[data-auto-view]").forEach((tab) => tab.addEventListener("click", () => { activeView = tab.dataset.autoView; render(); }));
  page.querySelector("#autoRulesBtn")?.addEventListener("click", () => { syncRuleControls(); window.lucide?.createIcons(); rulesDialog?.showModal(); });
  configRoot.querySelector("#autoRulesClose")?.addEventListener("click", () => rulesDialog?.close());
  configRoot.querySelector("#autoRulesCancel")?.addEventListener("click", () => rulesDialog?.close());
  rulesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    collectRuleControls();
    settings.maxTrips = Number(rulesForm.elements.maxTrips.value);
    settings.warningDays = Number(rulesForm.elements.warningDays.value);
    saveSettings();
    rulesDialog?.close();
    if (lastRun && settings.enabled) runAutomatic("规则更新"); else render();
  });
  page.querySelectorAll("[data-auto-tab]").forEach((tab) => tab.addEventListener("click", () => { activeTab = tab.dataset.autoTab; render(); }));
  body.addEventListener("click", (event) => {
    const vehicleRow = event.target.closest("[data-auto-plate]");
    const taskRow = event.target.closest("[data-auto-id]");
    if (vehicleRow) selectedPlate = vehicleRow.dataset.autoPlate;
    if (taskRow) selectedId = taskRow.dataset.autoId;
    if (vehicleRow || taskRow) render();
  });
  inspector.addEventListener("click", (event) => {
    const destination = event.target.closest("[data-auto-nav]");
    if (destination) { switchPage(destination.dataset.autoNav); return; }
    const task = tasks.find((item) => item.id === selectedId);
    if (activeTab === "fleet" || !task) return;
    const candidate = event.target.closest("[data-auto-candidate]");
    if (candidate) { task.matchIndex = Number(candidate.dataset.autoCandidate); render(); return; }
    if (event.target.closest("#autoRetryBtn")) {
      if (settings.retryEnabled || settings.enabled) runAutomatic("异常重试", true);
      else runMatching();
      return;
    }
    if (event.target.closest("#autoSingleRunBtn")) { runMatching(); return; }
    if (!event.target.closest("#autoConfirmBtn") || task.status !== "ready") return;
    const match = task.candidates[task.matchIndex];
    const current = candidatesFor(task, tasks.filter((item) => item.status === "confirmed"));
    if (!current.candidates.some((item) => item.driver.id === match.driver.id && item.vehicle.plateNo === match.vehicle.plateNo)) {
      task.status = "exception";
      task.reason = current.reason || "候选运力已被其他任务占用，请重新匹配";
      activeTab = "exception";
      render();
      return;
    }
    task.match = match;
    confirmTask(task, match, false);
    persistAssignments();
    runMatching();
    activeTab = "result";
    selectedId = task.id;
    render();
  });
  function refresh() {
    syncPendingTasks();
    const hasQueuedTasks = tasks.some((task) => task.status === "queue");
    if (settings.enabled && settings.triggerMode === "realtime" && hasQueuedTasks) {
      runAutomatic("新任务接入");
      return;
    }
    const tab = activeTab;
    const taskId = selectedId;
    activeTab = tab;
    selectedId = taskId;
    render();
  }
  window.AutoDispatchManager = {
    render,
    refresh,
    renderConfig: () => { syncRuleControls(); renderExecutionState(); window.lucide?.createIcons(); },
    run: () => runAutomatic("外部触发", true),
  };
  scheduleAutomaticExecution();
  if (settings.enabled && settings.triggerMode === "realtime") runAutomatic("系统启动");
  else render();
})();
