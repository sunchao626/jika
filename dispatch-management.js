(() => {
  const page = document.querySelector("#dispatchManagementPage");
  if (!page) return;

  const elements = {
    autoButton: page.querySelector("#dispatchManagementAutoBtn"),
    manualButton: page.querySelector("#dispatchManagementManualBtn"),
    confirmDialog: page.querySelector("#dispatchManagementConfirmDialog"),
    confirmTitle: page.querySelector("#dispatchManagementConfirmTitle"),
    confirmMessage: page.querySelector("#dispatchManagementConfirmMessage"),
    confirmSummary: page.querySelector("#dispatchManagementConfirmSummary"),
    confirmMatches: page.querySelector("#dispatchManagementConfirmMatches"),
    vehicleDialog: page.querySelector("#dispatchManagementVehicleDialog"),
    vehicleFilter: page.querySelector("#dispatchManagementVehicleFilter"),
    vehicleDriverSearch: page.querySelector("#dispatchManagementVehicleDriverSearch"),
    vehicleList: page.querySelector("#dispatchManagementVehicleList"),
    vehicleCancel: page.querySelector("#dispatchManagementVehicleCancel"),
    confirmUnassigned: page.querySelector("#dispatchManagementConfirmUnassigned"),
    confirmClose: page.querySelector("#dispatchManagementConfirmClose"),
    confirmCancel: page.querySelector("#dispatchManagementConfirmCancel"),
    confirmSubmit: page.querySelector("#dispatchManagementConfirmSubmit"),
    resultDialog: page.querySelector("#dispatchManagementResultDialog"),
    resultClose: page.querySelector("#dispatchManagementResultClose"),
    resultIcon: page.querySelector("#dispatchManagementResultIcon"),
    resultTitle: page.querySelector("#dispatchManagementResultTitle"),
    resultMessage: page.querySelector("#dispatchManagementResultMessage"),
    resultMetrics: page.querySelector("#dispatchManagementResultMetrics"),
    resultTotal: page.querySelector("#dispatchManagementResultTotal"),
    resultSuccess: page.querySelector("#dispatchManagementResultSuccess"),
    resultUnassigned: page.querySelector("#dispatchManagementResultUnassigned"),
    resultDestination: page.querySelector("#dispatchManagementResultDestination"),
    resultStay: page.querySelector("#dispatchManagementResultStay"),
    resultView: page.querySelector("#dispatchManagementResultView"),
    taskStats: page.querySelector("#dispatchManagementTaskStats"),
    capacityStats: page.querySelector("#dispatchManagementCapacityStats"),
    taskBody: page.querySelector("#dispatchManagementTaskBody"),
    capacityList: page.querySelector("#dispatchManagementCapacityList"),
    taskCount: page.querySelector("#dispatchManagementTaskCount"),
    capacityCount: page.querySelector("#dispatchManagementCapacityCount"),
    manualLabel: page.querySelector("#dispatchManagementManualLabel"),
    taskSelectAll: page.querySelector("#dispatchManagementTaskSelectAll"),
    capacitySelectAll: page.querySelector("#dispatchManagementCapacitySelectAll"),
    taskPageSize: page.querySelector("#dispatchManagementTaskPageSize"),
    taskCustomerSearch: page.querySelector("#dispatchManagementTaskCustomerSearch"),
    taskTypeFilter: page.querySelector("#dispatchManagementTaskTypeFilter"),
    taskDateFilter: page.querySelector("#dispatchManagementTaskDateFilter"),
    taskNumberSearch: page.querySelector("#dispatchManagementTaskNumberSearch"),
    capacityFilter: page.querySelector("#dispatchManagementCapacityFilter"),
    capacityDriverSearch: page.querySelector("#dispatchManagementCapacityDriverSearch"),
    taskPageText: page.querySelector("#dispatchManagementTaskPageText"),
    capacityPageText: page.querySelector("#dispatchManagementCapacityPageText"),
    taskPrev: page.querySelector("#dispatchManagementTaskPrev"),
    taskNext: page.querySelector("#dispatchManagementTaskNext"),
    capacityPrev: page.querySelector("#dispatchManagementCapacityPrev"),
    capacityNext: page.querySelector("#dispatchManagementCapacityNext"),
    updatedAt: page.querySelector("#dispatchManagementUpdatedAt"),
  };

  const selectedTaskIds = new Set();
  const selectedPlates = new Set();
  let visibleTaskIds = [];
  let visibleCapacityPlates = [];
  let taskPage = 1;
  let capacityPage = 1;
  const capacityPageSize = 10;
  let permissionOverrides = null;
  let focusedCapacityPlate = "";
  let pendingDispatchPlan = null;

  const capacityNodeSequences = {
    "提空装货": ["已提空", "空箱在途", "到达仓库", "完成装货", "重箱在途", "重箱进站", "完成落重"],
    "提重送货": ["已提重", "重箱在途", "到达仓库", "完成卸货", "空箱在途", "空箱进站", "完成落空"],
    "排空箱（A→B）": ["已提空", "空箱在途", "完成落空"],
    "排重箱（A→B）": ["已提重", "重箱在途", "箱进站", "完成落重"],
  };
  const capacityDemoTaskTypes = ["提空装货", "提重送货", "提空装货", "排重箱（A→B）"];
  const demoTaskSeeds = [
    { id: "DM-001", waybillNo: "WB20261010021", planTaskNo: "JH2026101001", customerName: "东方港联", projectName: "进口箱配送", taskType: "提空装货", routeId: "XL-001", routeName: "北仑港—滨海仓", origin: "宁波北仑港", executionTime: "2026-10-10 16:00", boxType: "40HQ", requiredLoad: 26, requiredVolume: 68 },
    { id: "DM-002", waybillNo: "WB20261010022", planTaskNo: "JH2026101002", customerName: "海晟供应链", projectName: "出口装箱", taskType: "提重送货", routeId: "XL-002", routeName: "梅山堆场—北仑港", origin: "宁波梅山", executionTime: "2026-10-10 16:20", boxType: "40GP", requiredLoad: 25, requiredVolume: 64 },
    { id: "DM-003", waybillNo: "WB20261010023", planTaskNo: "JH2026101003", customerName: "甬盛制造", projectName: "零部件出口", taskType: "提空装货", routeId: "XL-001", routeName: "北仑港—春晓园区", origin: "宁波北仑港", executionTime: "2026-10-10 16:40", boxType: "20GP", requiredLoad: 20, requiredVolume: 36 },
    { id: "DM-004", waybillNo: "WB20261010024", planTaskNo: "JH2026101004", customerName: "陆港多联", projectName: "港区短驳", taskType: "排重箱（A→B）", routeId: "XL-003", routeName: "北仑港—霞浦堆场", origin: "宁波北仑港", executionTime: "2026-10-10 17:00", boxType: "40HQ", requiredLoad: 28, requiredVolume: 70 },
    { id: "DM-005", waybillNo: "WB20261010025", planTaskNo: "JH2026101005", customerName: "华贸物流", projectName: "新能源配件", taskType: "提重送货", routeId: "XL-004", routeName: "杭州湾工厂—北仑港", origin: "宁波杭州湾", executionTime: "2026-10-10 17:20", boxType: "40GP", requiredLoad: 24, requiredVolume: 62 },
    { id: "DM-006", waybillNo: "WB20261010026", planTaskNo: "JH2026101006", customerName: "中铁联集", projectName: "海铁联运", taskType: "排空箱（A→B）", routeId: "XL-005", routeName: "宁波站—北仑堆场", origin: "宁波铁路站", executionTime: "2026-10-10 17:40", boxType: "20GP", requiredLoad: 18, requiredVolume: 34 },
    { id: "DM-007", waybillNo: "WB20261010027", planTaskNo: "JH2026101007", customerName: "远航国际", projectName: "家电出口", taskType: "提空装货", routeId: "XL-006", routeName: "北仑港—慈溪仓", origin: "宁波北仑港", executionTime: "2026-10-10 18:00", boxType: "40HQ", requiredLoad: 26, requiredVolume: 68 },
    { id: "DM-008", waybillNo: "WB20261010028", planTaskNo: "JH2026101008", customerName: "宁港供应链", projectName: "跨境电商", taskType: "提重送货", routeId: "XL-007", routeName: "保税区—梅山港", origin: "宁波保税区", executionTime: "2026-10-10 18:20", boxType: "40GP", requiredLoad: 23, requiredVolume: 60 },
    { id: "DM-009", waybillNo: "WB20261010029", planTaskNo: "JH2026101009", customerName: "东海冷链", projectName: "冷柜运输", taskType: "提重送货", routeId: "XL-008", routeName: "北仑冷库—穿山港", origin: "宁波北仑", executionTime: "2026-10-10 18:40", boxType: "40RF", requiredLoad: 27, requiredVolume: 66 },
    { id: "DM-010", waybillNo: "WB20261010030", planTaskNo: "JH2026101010", customerName: "浙商仓储", projectName: "仓间调拨", taskType: "排空箱（A→B）", routeId: "XL-009", routeName: "霞浦仓—春晓仓", origin: "宁波霞浦", executionTime: "2026-10-10 19:00", boxType: "20GP", requiredLoad: 18, requiredVolume: 34 },
    { id: "DM-011", waybillNo: "WB20261010031", planTaskNo: "JH2026101011", customerName: "海天食品", projectName: "出口备货", taskType: "提空装货", routeId: "XL-010", routeName: "北仑港—鄞州工厂", origin: "宁波北仑港", executionTime: "2026-10-10 19:20", boxType: "40HQ", requiredLoad: 25, requiredVolume: 67 },
    { id: "DM-012", waybillNo: "WB20261010032", planTaskNo: "JH2026101012", customerName: "金甬化工", projectName: "原料进口", taskType: "提重送货", routeId: "XL-011", routeName: "镇海港—园区仓", origin: "宁波镇海港", executionTime: "2026-10-10 19:40", boxType: "20GP", requiredLoad: 22, requiredVolume: 35 },
    { id: "DM-013", waybillNo: "WB20261010033", planTaskNo: "JH2026101013", customerName: "临港装备", projectName: "大型设备出口", taskType: "提空装货", routeId: "XL-012", routeName: "上海港—临港工厂", origin: "上海临港", executionTime: "2026-10-10 20:00", boxType: "40HQ", requiredLoad: 29, requiredVolume: 72 },
    { id: "DM-014", waybillNo: "WB20261010034", planTaskNo: "JH2026101014", customerName: "杭湾汽配", projectName: "汽配循环箱", taskType: "排重箱（A→B）", routeId: "XL-013", routeName: "杭州湾—慈溪堆场", origin: "宁波杭州湾", executionTime: "2026-10-10 20:20", boxType: "40GP", requiredLoad: 24, requiredVolume: 62 },
    { id: "DM-015", waybillNo: "WB20261010035", planTaskNo: "JH2026101015", customerName: "甬舟物流", projectName: "舟山港联运", taskType: "提重送货", routeId: "XL-014", routeName: "舟山港—北仑仓", origin: "舟山港", executionTime: "2026-10-10 20:40", boxType: "40HQ", requiredLoad: 27, requiredVolume: 68 },
  ];
  let demoTasks = [];
  const demoAssignments = new Map();

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);

  function resetDemoState() {
    const today = new Date();
    demoTasks = demoTaskSeeds.map((task, index) => {
      const taskDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (index < 5 ? 0 : index < 10 ? 1 : -1));
      const dateText = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, "0")}-${String(taskDate.getDate()).padStart(2, "0")}`;
      const time = String(task.executionTime || "08:00").slice(10) || " 08:00";
      return { ...task, status: "待派单", orderDate: dateText, executionTime: `${dateText}${time}`, timeline: [] };
    });
    demoAssignments.clear();
    selectedTaskIds.clear();
    selectedPlates.clear();
    visibleTaskIds = [];
    visibleCapacityPlates = [];
    taskPage = 1;
    capacityPage = 1;
    focusedCapacityPlate = "";
  }

  resetDemoState();

  function getWaybill(task) {
    return waybills.find((item) => item.waybillNo === task.waybillNo) || {};
  }

  function getDriverForVehicle(vehicle) {
    const driverName = String(vehicle.driver || "").split("/")[0].trim();
    return drivers.find((driver) => driver.id === vehicle.driverId || driver.name === driverName) || null;
  }

  function getActiveDispatch(vehicle) {
    return demoAssignments.get(vehicle.plateNo) || null;
  }

  function getProgress(dispatch) {
    if (!dispatch) return { progress: 0, stage: "待命" };
    try {
      const meta = typeof getDashboardTaskMeta === "function" ? getDashboardTaskMeta(dispatch) : null;
      if (meta) return { progress: Number(meta.progress) || 0, stage: meta.stage || dispatch.currentNode || "运输中" };
    } catch (error) {
      // Fall through to the dispatch state when a legacy task has no progress metadata.
    }
    return { progress: dispatch.status === "运输中" ? 50 : 10, stage: dispatch.currentNode || dispatch.status };
  }

  function getEnergyType(vehicle, index) {
    if (["新能源", "天然气", "燃油"].includes(vehicle.energyType)) return vehicle.energyType;
    return ["燃油", "新能源", "天然气", "燃油"][index % 4];
  }

  function getCapacityState(vehicle, driver, trailer, activeDispatch) {
    if (vehicle.vehicleState === "维修中") return "维修中";
    if (vehicle.vehicleState !== "在用" || trailer?.trailerState === "停用") return "停用";
    if (!driver || driver.certificationStatus !== "verified" || ["停用", "休假中"].includes(driver.driverState)) return "停用";
    if (!activeDispatch && ["运输中", "即将完成"].includes(vehicle.dispatchState)) return vehicle.dispatchState;
    if (!activeDispatch) return "空闲";
    const progress = getProgress(activeDispatch).progress;
    return progress >= 70 && progress < 100 ? "即将完成" : "运输中";
  }

  function getCapacityDisplayProgress(resource, index) {
    const taskType = capacityNodeSequences[resource.activeDispatch?.taskType]
      ? resource.activeDispatch.taskType
      : capacityDemoTaskTypes[index % capacityDemoTaskTypes.length];
    const nodes = capacityNodeSequences[taskType];
    let currentIndex = -1;
    let stage = "待开始";
    if (resource.state === "运输中") {
      currentIndex = Math.min(nodes.length - 2, 1 + (index % Math.max(1, nodes.length - 2)));
      stage = nodes[currentIndex];
    } else if (resource.state === "即将完成") {
      currentIndex = Math.max(0, nodes.length - 2);
      stage = nodes[currentIndex];
    } else if (resource.state === "维修中") {
      stage = "维修中";
    } else if (resource.state === "停用") {
      stage = "已停用";
    }
    const completedCount = Math.max(0, currentIndex + 1);
    return {
      taskType,
      nodes,
      currentIndex,
      completedCount,
      stage,
      progress: Math.round(completedCount / nodes.length * 100),
      nearComplete: resource.state === "即将完成",
      disabled: resource.state === "停用" || resource.state === "维修中",
    };
  }

  function renderCapacityNodeProgress(meta) {
    const nodeBlocks = meta.nodes.map((node, index) => {
      const nodeState = index < meta.currentIndex ? "completed" : index === meta.currentIndex ? "current" : "pending";
      return `<i class="auto-node-block ${nodeState}" title="${escapeHtml(node)}" aria-label="${escapeHtml(node)}"></i>`;
    }).join("");
    const stateClass = meta.nearComplete ? "near-complete" : meta.disabled ? "disabled" : "";
    return `<div class="dispatch-capacity-node-progress auto-node-progress ${stateClass}">
      <div class="auto-node-progress-head"><strong>${escapeHtml(meta.stage)}</strong><span>${meta.progress}%</span></div>
      <span class="auto-node-track" role="list" aria-label="${escapeHtml(`${meta.taskType}节点进度`)}">${nodeBlocks}</span>
      <small>${meta.completedCount} / ${meta.nodes.length} 节点 · ${escapeHtml(meta.nodes.join(" → "))}</small>
    </div>`;
  }

  function getCapacityResources() {
    const stateOrder = { 空闲: 0, 即将完成: 1, 运输中: 2, 维修中: 3, 停用: 4 };
    return vehicles.map((vehicle, index) => {
      const driver = getDriverForVehicle(vehicle);
      const trailer = trailers.find((item) => item.id === vehicle.trailerId) || null;
      const activeDispatch = getActiveDispatch(vehicle);
      const progress = getProgress(activeDispatch);
      const resource = {
        vehicle,
        driver,
        trailer,
        activeDispatch,
        progress,
        energyType: getEnergyType(vehicle, index),
        state: getCapacityState(vehicle, driver, trailer, activeDispatch),
        volume: Number(vehicle.cargoVolume) || (String(vehicle.vehicleType || "").includes("半挂") ? 82 : 76),
      };
      resource.displayProgress = getCapacityDisplayProgress(resource, index);
      return resource;
    }).sort((left, right) => (stateOrder[left.state] ?? 9) - (stateOrder[right.state] ?? 9));
  }

  function getPendingTasks() {
    return demoTasks.filter((task) => task.status === "待派单");
  }

  function statusCount(status) {
    return demoTasks.filter((task) => task.status === status).length;
  }

  function renderStats(resources) {
    const today = new Date();
    const dateText = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const todayText = dateText(today);
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const tomorrowText = dateText(tomorrow);
    const taskDate = (task) => String(task.executionTime || task.orderDate || getWaybill(task).executionTime || getWaybill(task).orderDate || "").slice(0, 10);
    const pendingTasks = getPendingTasks();
    const taskStats = [
      ["待派单总计", pendingTasks.length, "pending", "clock-3", ""],
      ["今日待派单", pendingTasks.filter((task) => taskDate(task) === todayText).length, "today", "calendar-days", todayText],
      ["明日待派单", pendingTasks.filter((task) => taskDate(task) === tomorrowText).length, "tomorrow", "calendar-plus", tomorrowText],
    ];
    const capacityStats = [
      ["空闲", resources.filter((item) => item.state === "空闲").length, "idle", "circle-dot", "空闲"],
      ["运输中", resources.filter((item) => item.state === "运输中").length, "moving", "navigation", "运输中"],
      ["即将完成", resources.filter((item) => item.state === "即将完成").length, "near", "timer", "即将完成"],
    ];
    const renderCards = (items, type = "") => items.map(([label, value, className, icon, filterValue]) => {
      const interactive = Boolean(type);
      const active = type === "task"
        ? (filterValue ? elements.taskDateFilter.value === filterValue : !elements.taskDateFilter.value)
        : type === "capacity" && elements.capacityFilter.value === filterValue;
      const filterAttributes = type === "task"
        ? `data-dispatch-stat-range="${filterValue ? "date" : "all"}" ${filterValue ? `data-dispatch-stat-date="${filterValue}"` : ""}`
        : type === "capacity" ? `data-capacity-stat-state="${filterValue}"` : "";
      return `
      ${interactive ? `<button class="dispatch-management-stat metric-card ${className} ${active ? "active" : ""}" ${filterAttributes} type="button" aria-pressed="${active}" aria-label="筛选${label}${type === "task" ? "任务" : "运力"}">` : `<div class="dispatch-management-stat metric-card ${className}">`}
        <span class="dispatch-management-stat-icon"><i data-lucide="${icon}" aria-hidden="true"></i></span>
        <div><span class="metric-label">${label}</span><strong class="metric-value">${value}</strong></div>
      ${interactive ? "</button>" : "</div>"}`;
    }).join("");
    elements.taskStats.innerHTML = renderCards(taskStats, "task");
    elements.capacityStats.innerHTML = renderCards(capacityStats, "capacity");
  }

  function getTaskContext(task) {
    const waybill = getWaybill(task);
    return {
      source: task.planTaskNo || waybill.planTaskNo || "临时任务",
      customer: task.customerName || waybill.customerName || "未关联客户",
      project: task.projectName || waybill.projectName || "未分配项目",
      taskType: task.taskType || waybill.taskType || "提空装货",
      route: task.routeName || fixedRoutes.find((route) => route.id === task.routeId)?.routeName || "未指定线路",
      planDate: String(task.executionTime || task.orderDate || "-").replace("T", " ").slice(0, 16),
    };
  }

  function renderTasks(tasks) {
    const customerSearch = elements.taskCustomerSearch.value.trim().toLocaleLowerCase();
    const taskType = elements.taskTypeFilter.value;
    const taskDate = elements.taskDateFilter.value;
    const taskNumberSearch = elements.taskNumberSearch.value.trim().toLocaleLowerCase();
    const filteredTasks = tasks.filter((task) => {
      const context = getTaskContext(task);
      const waybill = getWaybill(task);
      const identifiers = [task.id, task.waybillNo, task.planTaskNo, task.dispatchNo, waybill.waybillNo, waybill.planTaskNo, waybill.dispatchNo]
        .filter(Boolean).join(" ").toLocaleLowerCase();
      const date = String(task.executionTime || task.orderDate || waybill.executionTime || waybill.orderDate || "").slice(0, 10);
      return (!customerSearch || `${context.customer} ${context.project}`.toLocaleLowerCase().includes(customerSearch))
        && (!taskType || context.taskType === taskType)
        && (!taskDate || date === taskDate)
        && (!taskNumberSearch || identifiers.includes(taskNumberSearch));
    });
    const pageSize = Number(elements.taskPageSize.value) || 10;
    const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
    taskPage = Math.min(Math.max(1, taskPage), totalPages);
    const visibleTasks = filteredTasks.slice((taskPage - 1) * pageSize, taskPage * pageSize);
    visibleTaskIds = visibleTasks.map((task) => task.id);
    elements.taskBody.innerHTML = visibleTasks.length ? visibleTasks.map((task) => {
      const context = getTaskContext(task);
      const selected = selectedTaskIds.has(task.id);
      return `<tr class="${selected ? "selected" : ""}" data-dispatch-management-task="${escapeHtml(task.id)}" tabindex="0" aria-selected="${selected}">
        <td><input type="checkbox" name="dispatchManagementTask" value="${escapeHtml(task.id)}" ${selected ? "checked" : ""} aria-label="选择任务 ${escapeHtml(task.waybillNo)}" /></td>
        <td><strong title="${escapeHtml(task.waybillNo)}">${escapeHtml(task.waybillNo)}</strong><small title="${escapeHtml(context.source)}">${escapeHtml(context.source)}</small></td>
        <td><strong title="${escapeHtml(context.customer)}">${escapeHtml(context.customer)}</strong><small title="${escapeHtml(context.project)}">${escapeHtml(context.project)}</small></td>
        <td><span class="dispatch-task-route" title="${escapeHtml(context.route)}">${escapeHtml(context.route)}</span></td>
        <td><span class="dispatch-task-type" title="${escapeHtml(context.taskType)}">${escapeHtml(context.taskType)}</span></td>
        <td><span class="dispatch-task-date" title="${escapeHtml(context.planDate)}">${escapeHtml(context.planDate)}</span></td>
      </tr>`;
    }).join("") : `<tr><td colspan="6"><div class="dispatch-management-empty"><i data-lucide="${tasks.length ? "search-x" : "circle-check-big"}" aria-hidden="true"></i><strong>${tasks.length ? "没有符合条件的任务" : "暂无待派单任务"}</strong></div></td></tr>`;
    elements.taskCount.textContent = `${filteredTasks.length} 条待匹配`;
    elements.taskPageText.textContent = `第 ${taskPage} / ${totalPages} 页 · 共 ${filteredTasks.length} 条`;
    elements.taskPrev.disabled = taskPage <= 1;
    elements.taskNext.disabled = taskPage >= totalPages;
    elements.taskSelectAll.disabled = visibleTaskIds.length === 0;
    elements.taskSelectAll.checked = visibleTaskIds.length > 0 && visibleTaskIds.every((id) => selectedTaskIds.has(id));
    elements.taskSelectAll.indeterminate = visibleTaskIds.some((id) => selectedTaskIds.has(id)) && !elements.taskSelectAll.checked;
  }

  function getCapacityMatch(resource, pendingTasks = []) {
    const registry = window.DispatchRuleRegistry;
    const ruleConfig = registry?.loadRuleConfig?.();
    const tasksToScore = pendingTasks.length ? pendingTasks : [null];
    const results = tasksToScore.map((task) => {
      const route = task ? fixedRoutes.find((item) => item.id === task.routeId) : null;
      const distance = task ? estimatePickupDistance(task, resource) : Number.POSITIVE_INFINITY;
      const monthlyAccepted = getDriverMonthlyAcceptedCount(resource.driver?.id);
      const signals = {
        idle: resource.state === "空闲",
        inTransit: ["运输中", "即将完成"].includes(resource.state),
        routeVehicle: Boolean(route?.defaultVehicle && route.defaultVehicle === resource.vehicle.plateNo),
        familiarDriver: Boolean(route?.defaultDriver && route.defaultDriver === resource.driver?.name),
        lowDriverLoad: monthlyAccepted <= 1,
        closeToPickup: Number.isFinite(distance) && distance <= 30,
        recentDelay: dispatches.some((dispatch) => dispatch.driverId === resource.driver?.id && (dispatch.timeline || []).some((entry) => /延误/.test(`${entry.node || ""}${entry.desc || ""}`))),
        timeTight: resource.state === "运输中" && resource.displayProgress.progress < 70,
        unavailable: ["停用", "维修中"].includes(resource.state),
      };
      if (registry?.scoreMatch) return { ...registry.scoreMatch(signals, ruleConfig), task };
      const fallbackTags = [signals.idle ? { label: "空闲优先" } : null, signals.routeVehicle ? { label: "线路专属车辆" } : null, signals.familiarDriver ? { label: "司机熟悉线路" } : null].filter(Boolean);
      return { score: signals.unavailable ? 0 : signals.idle ? 92 : resource.state === "即将完成" ? 74 : 60, tags: fallbackTags, task };
    });
    return results.sort((left, right) => right.score - left.score)[0];
  }

  function getDriverMonthlyAcceptedCount(driverId) {
    if (!driverId) return 0;
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return dispatches.filter((dispatch) => {
      if (dispatch.driverId !== driverId) return false;
      const acceptedAt = dispatch.acceptedAt || (dispatch.timeline || []).find((entry) => entry.node === "已接单")?.time;
      return String(acceptedAt || "").startsWith(monthPrefix);
    }).length;
  }

  function renderCapacity(resources, pendingTasks = []) {
    const filter = elements.capacityFilter.value;
    const driverSearch = elements.capacityDriverSearch.value.trim().toLocaleLowerCase();
    const filtered = resources.filter((resource) => {
      const driverText = `${resource.driver?.name || ""} ${resource.driver?.phone || ""}`.toLocaleLowerCase();
      return (!filter || resource.state === filter) && (!driverSearch || driverText.includes(driverSearch));
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / capacityPageSize));
    capacityPage = Math.min(Math.max(1, capacityPage), totalPages);
    const visibleResources = filtered.slice((capacityPage - 1) * capacityPageSize, capacityPage * capacityPageSize);
    visibleCapacityPlates = visibleResources.filter((resource) => resource.state === "空闲").map((resource) => resource.vehicle.plateNo);
    elements.capacityList.innerHTML = visibleResources.length ? `<div class="dispatch-capacity-list-head" aria-hidden="true"><span>选择</span><span>匹配值</span><span>司机 / 电话</span><span>车辆 / 挂车</span><span>当前进度</span></div>${visibleResources.map((resource, resourceIndex) => {
      const { vehicle, driver, trailer, state, activeDispatch, displayProgress } = resource;
      const selectable = state === "空闲";
      const selected = selectedPlates.has(vehicle.plateNo);
      const focused = focusedCapacityPlate === vehicle.plateNo;
      const match = getCapacityMatch(resource, pendingTasks);
      const progressLabel = state === "空闲" ? "空闲待命" : state === "维修中" ? "维修中" : state === "停用" ? "暂不可用" : displayProgress.stage;
      const taskLabel = activeDispatch ? `任务 ${activeDispatch.waybillNo || activeDispatch.id}` : state === "空闲" ? "当前无运输任务" : state === "维修中" ? "维修完成后恢复派单" : state === "停用" ? "请先恢复资源" : "当前任务执行中";
      const monthlyAccepted = getDriverMonthlyAcceptedCount(driver?.id);
      const tooltipId = `dispatch-match-tooltip-${resourceIndex}`;
      const matchTags = match.tags.length ? match.tags : [{ label: "未命中启用规则", detail: "当前没有可展示的匹配依据" }];
      return `<div class="dispatch-capacity-item dispatch-capacity-row state-${state} ${selected ? "selected" : ""} ${focused ? "focused" : ""} ${selectable ? "available" : "unavailable"}" data-capacity-plate="${escapeHtml(vehicle.plateNo)}" tabindex="0" role="button" aria-pressed="${selected}">
        <span class="dispatch-capacity-select"><input type="checkbox" name="dispatchManagementCapacity" value="${escapeHtml(vehicle.plateNo)}" ${selected ? "checked" : ""} ${selectable ? "" : "disabled"} aria-label="选择运力 ${escapeHtml(vehicle.plateNo)}" /></span>
        <span class="dispatch-capacity-match" tabindex="0" aria-describedby="${tooltipId}" aria-label="匹配值 ${match.score}，查看匹配依据"><strong>${match.score}</strong><span class="dispatch-match-tooltip" id="${tooltipId}" role="tooltip"><b>匹配依据</b><span class="dispatch-match-tags">${matchTags.map((tag) => `<em title="${escapeHtml(tag.detail || tag.label)}">${escapeHtml(tag.label)}</em>`).join("")}</span><small>依据“派单配置”当前启用规则计算</small></span></span>
        <span class="dispatch-capacity-driver"><span><strong title="${escapeHtml(driver?.name || "未绑定司机")}">${escapeHtml(driver?.name || "未绑定司机")}${driver ? `<em class="driver-monthly-accepted">本月 ${monthlyAccepted}</em>` : ""}</strong><small title="${escapeHtml(driver?.phone || "暂无联系电话")}">${escapeHtml(driver?.phone || "暂无联系电话")}</small></span></span>
        <span class="dispatch-capacity-vehicle"><strong title="${escapeHtml(vehicle.plateNo || "未绑定车辆")}">${escapeHtml(vehicle.plateNo || "未绑定车辆")}</strong><small title="${escapeHtml(trailer ? `${trailer.plateNo} · ${trailer.trailerType || "挂车"}` : "未绑定挂车")}">${escapeHtml(trailer ? `${trailer.plateNo} · ${trailer.trailerType || "挂车"}` : "未绑定挂车")}</small></span>
        <span class="dispatch-capacity-progress" title="${escapeHtml(taskLabel)}"><strong title="${escapeHtml(progressLabel)}">${escapeHtml(progressLabel)}</strong><span class="dispatch-capacity-progress-track" role="progressbar" aria-label="${escapeHtml(`${progressLabel} ${displayProgress.progress}%`)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${displayProgress.progress}"><i style="width:${displayProgress.progress}%"></i></span><b>${displayProgress.progress}%</b></span>
      </div>`;
    }).join("")}` : '<div class="dispatch-management-empty capacity-empty"><i data-lucide="truck" aria-hidden="true"></i><strong>当前筛选下暂无运力</strong></div>';
    elements.capacityCount.textContent = `${filtered.length} 组运力`;
    elements.capacityPageText.textContent = `第 ${capacityPage} / ${totalPages} 页 · 共 ${filtered.length} 组`;
    elements.capacityPrev.disabled = capacityPage <= 1;
    elements.capacityNext.disabled = capacityPage >= totalPages;
    elements.capacitySelectAll.disabled = visibleCapacityPlates.length === 0;
    elements.capacitySelectAll.checked = visibleCapacityPlates.length > 0 && visibleCapacityPlates.every((plate) => selectedPlates.has(plate));
    elements.capacitySelectAll.indeterminate = visibleCapacityPlates.some((plate) => selectedPlates.has(plate)) && !elements.capacitySelectAll.checked;
  }

  function getPermissions() {
    if (permissionOverrides) return permissionOverrides;
    const configured = window.DispatchManagementPermissions;
    if (configured && typeof configured === "object") return { auto: configured.auto !== false, manual: configured.manual !== false };
    if (Array.isArray(window.currentUserPermissions)) {
      return {
        auto: window.currentUserPermissions.includes("dispatch:auto"),
        manual: window.currentUserPermissions.includes("dispatch:manual"),
      };
    }
    return { auto: true, manual: true };
  }

  function applyPermissions() {
    const permissions = getPermissions();
    elements.autoButton.hidden = !permissions.auto;
    elements.manualButton.hidden = !permissions.manual;
  }

  function updateSelectionState(tasks, resources) {
    const taskMap = new Map(tasks.map((task) => [task.id, task]));
    const resourceMap = new Map(resources.filter((resource) => resource.state === "空闲").map((resource) => [resource.vehicle.plateNo, resource]));
    [...selectedTaskIds].forEach((id) => { if (!taskMap.has(id)) selectedTaskIds.delete(id); });
    [...selectedPlates].forEach((plate) => { if (!resourceMap.has(plate)) selectedPlates.delete(plate); });
    const selectedTasks = [...selectedTaskIds].map((id) => taskMap.get(id)).filter(Boolean);
    const selectedResources = [...selectedPlates].map((plate) => resourceMap.get(plate)).filter(Boolean);
    elements.manualButton.disabled = selectedTasks.length === 0 || selectedResources.length < selectedTasks.length;
    elements.manualLabel.textContent = selectedTasks.length > 1 ? `批量派单 (${selectedTasks.length})` : "手动派单";
    elements.autoButton.disabled = tasks.length === 0 || resources.every((item) => item.state !== "空闲");
  }

  function render() {
    const tasks = getPendingTasks();
    const resources = getCapacityResources();
    updateSelectionState(tasks, resources);
    renderStats(resources);
    renderTasks(tasks);
    renderCapacity(resources, tasks);
    applyPermissions();
    elements.updatedAt.textContent = `更新于 ${new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date())}`;
    window.lucide?.createIcons();
  }

  function showFeedback(message, type = "success", options = {}) {
    const config = typeof message === "object" ? message : { message, type, ...options };
    const icon = config.type === "success"
      ? "circle-check"
      : config.type === "warning"
        ? "triangle-alert"
        : config.type === "error"
          ? "circle-x"
          : "info";
    const defaultTitle = config.type === "error" ? "派单失败" : config.type === "warning" ? "暂时无法派单" : "操作提示";
    elements.resultDialog.dataset.resultType = config.type || "success";
    elements.resultIcon.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
    elements.resultTitle.textContent = config.title || defaultTitle;
    elements.resultMessage.textContent = config.message || "";
    elements.resultMetrics.hidden = !config.metrics;
    if (config.metrics) {
      elements.resultTotal.textContent = String(config.metrics.total);
      elements.resultSuccess.textContent = String(config.metrics.succeeded);
      elements.resultUnassigned.textContent = String(config.metrics.unassigned);
    }
    elements.resultDestination.hidden = !config.actionTarget;
    elements.resultView.hidden = !config.actionTarget;
    elements.resultView.dataset.dispatchResultTarget = config.actionTarget || "";
    window.lucide?.createIcons();
    if (!elements.resultDialog.open) elements.resultDialog.showModal();
  }

  function showDispatchResult(mode, requested, succeeded) {
    const unassigned = Math.max(0, requested - succeeded);
    const operation = mode === "auto" ? "自动派单" : requested > 1 ? "批量派单" : "手动派单";
    const type = succeeded === 0 ? "error" : unassigned > 0 ? "warning" : "success";
    const result = succeeded === 0 ? "失败" : unassigned > 0 ? "部分完成" : "成功";
    const shortageReason = mode === "auto" && unassigned > 0 ? "，未派任务将继续保留在当前列表" : "";
    showFeedback({
      title: `${operation}${result}`,
      message: succeeded > 0
        ? `派单操作已完成${shortageReason}。`
        : "当前没有任务完成派单，请调整任务或运力后重试。",
      type,
      actionTarget: succeeded > 0 ? "dispatch-list" : "",
      metrics: { total: requested, succeeded, unassigned },
    });
  }

  function getTaskDemand(task) {
    const waybill = getWaybill(task);
    const boxType = String(task.boxType || waybill.boxType || task.boxes || "");
    const explicitLoad = Number(task.requiredLoad ?? task.cargoWeight ?? waybill.requiredLoad ?? waybill.cargoWeight);
    const explicitVolume = Number(task.requiredVolume ?? waybill.requiredVolume);
    const inferredLoad = /\*2|双/.test(boxType) ? 30 : /40/.test(boxType) ? 26 : 20;
    return {
      load: Number.isFinite(explicitLoad) && explicitLoad > 0 ? explicitLoad : inferredLoad,
      volume: Number.isFinite(explicitVolume) && explicitVolume > 0 ? explicitVolume : (/\*2|双/.test(boxType) ? 72 : 58),
      vehicleType: String(task.requiredVehicleType || waybill.requiredVehicleType || ""),
      taskType: String(task.taskType || waybill.taskType || ""),
      origin: String(task.origin || fixedRoutes.find((route) => route.id === task.routeId)?.origin || ""),
    };
  }

  function estimatePickupDistance(task, resource) {
    const directDistance = Number(resource.vehicle.distanceToPickupKm ?? resource.vehicle.pickupDistanceKm);
    if (Number.isFinite(directDistance) && directDistance >= 0) return directDistance;
    const demand = getTaskDemand(task);
    const vehicleLocation = String(resource.vehicle.currentLocation || resource.vehicle.fleetName || resource.vehicle.fleet || "");
    const locationTokens = ["北仑", "宁波", "上海", "杭州", "苏州", "绍兴", "嘉兴", "金华", "舟山"];
    const originToken = locationTokens.find((token) => demand.origin.includes(token));
    return originToken && vehicleLocation.includes(originToken) ? 8 : 80;
  }

  function vehicleCompatibilityScore(task, resource) {
    const demand = getTaskDemand(task);
    const vehicleType = String(resource.vehicle.vehicleType || "");
    const trailerType = String(resource.trailer?.trailerType || "");
    let score = 0;
    if (demand.vehicleType) score += vehicleType.includes(demand.vehicleType) ? 35 : -45;
    if (/危/.test(demand.taskType)) score += /危|罐/.test(`${vehicleType}${trailerType}`) ? 45 : -80;
    if (/重|\*2|双/.test(`${demand.taskType}${getWaybill(task).boxType || ""}`)) score += /牵引|半挂|骨架/.test(`${vehicleType}${trailerType}`) ? 18 : -25;
    return score;
  }

  function scoreResource(task, resource) {
    const route = fixedRoutes.find((item) => item.id === task.routeId);
    const demand = getTaskDemand(task);
    const ratedLoad = Number(resource.vehicle.ratedLoad) || 0;
    const loadSurplus = ratedLoad - demand.load;
    const volumeSurplus = resource.volume - demand.volume;
    const distanceKm = estimatePickupDistance(task, resource);
    let score = 100;
    score += resource.state === "空闲" ? 30 : -100;
    if (route?.defaultVehicle === resource.vehicle.plateNo) score += 80;
    if (route?.defaultDriver === resource.driver?.name) score += 40;
    score += loadSurplus >= 0 ? Math.max(8, 30 - loadSurplus) : -80 - Math.abs(loadSurplus) * 4;
    score += volumeSurplus >= 0 ? Math.max(4, 18 - volumeSurplus / 4) : -50 - Math.abs(volumeSurplus);
    score += Math.max(-15, 32 - distanceKm * .4);
    score += vehicleCompatibilityScore(task, resource);
    if (resource.energyType === "新能源") score += 8;
    if (resource.trailer?.trailerState === "在用") score += 10;
    return score;
  }

  function assignTask(task, resource, mode, note = task.note || "") {
    const now = window.DispatchStore?.nowText?.() || new Date().toLocaleString("zh-CN", { hour12: false });
    const energyValue = { 新能源: "新能源车", 天然气: "LNG", 燃油: "燃油车" }[resource.energyType] || "燃油车";
    Object.assign(task, {
      dispatchMode: mode,
      dispatchTime: now,
      driverId: resource.driver?.id || "",
      driverName: resource.driver?.name || "未绑定司机",
      phone: resource.driver?.phone || "-",
      vehicleId: resource.vehicle.plateNo,
      trailerId: resource.trailer?.id || "",
      vehicleType: energyValue,
      photoRequirements: window.PhotoRequirementConfig?.forTaskType(window.DispatchTaskNodes?.resolve?.(getTaskContext(task).taskType) || getTaskContext(task).taskType) || [],
      note,
      status: "已派单",
      currentNode: "待提货",
      pushed: true,
    });
    task.timeline = Array.isArray(task.timeline) ? task.timeline : [];
    task.timeline.unshift({ node: "已派单", time: now, desc: mode === "auto" ? "系统完成自动匹配并下发派单" : "调度员完成手动选配并下发派单", photos: [] });
    demoAssignments.set(resource.vehicle.plateNo, task);
  }

  function buildDispatchPlan(mode) {
    const pending = getPendingTasks();
    const targetTasks = mode === "manual"
      ? pending.filter((task) => selectedTaskIds.has(task.id))
      : selectedTaskIds.size ? pending.filter((task) => selectedTaskIds.has(task.id)) : pending;
    const capacity = getCapacityResources().filter((resource) => resource.state === "空闲");
    const resources = mode === "manual"
      ? capacity.filter((resource) => selectedPlates.has(resource.vehicle.plateNo))
      : capacity;
    if (!targetTasks.length) return { error: mode === "manual" ? "请至少选择一条待派任务。" : "当前没有待派单任务。" };
    if (!resources.length) return { error: mode === "manual" ? "请至少选择一组空闲运力。" : "当前没有可用的空闲运力。" };
    if (mode === "manual" && resources.length < targetTasks.length) {
      return { error: `已选择 ${targetTasks.length} 条任务，但只有 ${resources.length} 组空闲运力，请继续选择。` };
    }
    const availableResources = [...resources];
    const assignments = [];
    targetTasks.forEach((task) => {
      if (!availableResources.length) return;
      availableResources.sort((left, right) => scoreResource(task, right) - scoreResource(task, left));
      const resource = availableResources.shift();
      assignments.push({ task, resource, score: getCapacityMatch(resource, targetTasks).score });
    });
    return { mode, tasks: targetTasks, assignments, unassigned: targetTasks.slice(assignments.length) };
  }

  function openDispatchConfirmation(mode) {
    const plan = buildDispatchPlan(mode);
    if (plan.error) {
      showFeedback(plan.error, "warning");
      return;
    }
    pendingDispatchPlan = plan;
    const isAuto = mode === "auto";
    elements.confirmTitle.textContent = isAuto ? "确认自动派单" : "确认批量派单";
    elements.confirmMessage.textContent = isAuto
      ? "以下为系统根据当前匹配规则生成的派单方案，确认后将立即执行。"
      : "以下为已选任务与空闲车辆的匹配方案，确认后将立即执行。";
    elements.confirmSummary.innerHTML = `<span>待处理任务 <strong>${plan.tasks.length}</strong></span><span>匹配车辆 <strong>${plan.assignments.length}</strong></span>${plan.unassigned.length ? `<span class="warning">未匹配 <strong>${plan.unassigned.length}</strong></span>` : ""}`;
    plan.assignments.forEach((assignment) => { assignment.note = assignment.task.note || ""; });
    renderConfirmMatches();
    elements.confirmUnassigned.hidden = plan.unassigned.length === 0;
    elements.confirmUnassigned.innerHTML = plan.unassigned.length
      ? `<strong>未匹配任务（${plan.unassigned.length}）</strong><span>${plan.unassigned.map((task) => escapeHtml(task.waybillNo)).join("、")}。可用空闲运力不足，确认后这些任务将保留为待派单。</span>`
      : "";
    window.lucide?.createIcons();
    if (!elements.confirmDialog.open) elements.confirmDialog.showModal();
  }

  function renderConfirmMatches() {
    const plan = pendingDispatchPlan;
    if (!plan) return;
    elements.confirmMatches.innerHTML = plan.assignments.map(({ task, resource, note }, index) => {
      const context = getTaskContext(task);
      const monthlyAccepted = getDriverMonthlyAcceptedCount(resource.driver?.id);
      return `<tr data-confirm-assignment="${index}">
        <td><strong>${escapeHtml(context.customer)}</strong><small>${escapeHtml(context.project)}</small></td>
        <td><span title="${escapeHtml(context.route)}">${escapeHtml(context.route)}</span><small>${escapeHtml(context.taskType)}</small></td>
        <td><strong>${escapeHtml(resource.driver?.name || "未绑定司机")}${resource.driver ? `<em class="driver-monthly-accepted">本月 ${monthlyAccepted}</em>` : ""}</strong><small>${escapeHtml(resource.driver?.phone || "-")}</small></td>
        <td><strong>${escapeHtml(resource.vehicle.plateNo)}</strong><small>${escapeHtml(resource.trailer?.plateNo || resource.trailer?.id || "无挂车")}</small><button class="link-btn dispatch-replace-vehicle" type="button" data-replace-vehicle="${index}">更换车辆</button></td>
        <td><input class="dispatch-confirm-note" type="text" maxlength="200" value="${escapeHtml(note || "")}" placeholder="添加派单备注" aria-label="${escapeHtml(context.customer)}派单备注" data-confirm-note="${index}" /></td>
      </tr>`;
    }).join("");
    window.lucide?.createIcons();
  }

  let vehiclePickerAssignmentIndex = -1;

  function renderVehiclePicker() {
    if (!pendingDispatchPlan || vehiclePickerAssignmentIndex < 0) return;
    const assignment = pendingDispatchPlan.assignments[vehiclePickerAssignmentIndex];
    if (!assignment) return;
    const status = elements.vehicleFilter.value;
    const search = elements.vehicleDriverSearch.value.trim().toLocaleLowerCase();
    const reservedPlates = new Set(pendingDispatchPlan.assignments
      .filter((item, index) => index !== vehiclePickerAssignmentIndex)
      .map((item) => item.resource.vehicle.plateNo));
    const resources = getCapacityResources().filter((resource) => {
      const driverText = `${resource.driver?.name || ""} ${resource.driver?.phone || ""}`.toLocaleLowerCase();
      return (!status || resource.state === status)
        && (!search || driverText.includes(search))
        && (!reservedPlates.has(resource.vehicle.plateNo) || resource.vehicle.plateNo === assignment.resource.vehicle.plateNo);
    });
    elements.vehicleList.innerHTML = resources.length ? resources.map((resource) => {
      const selectable = resource.state === "空闲";
      const selected = assignment.resource.vehicle.plateNo === resource.vehicle.plateNo;
      const trailer = resource.trailer ? `${resource.trailer.plateNo} · ${resource.trailer.trailerType || "挂车"}` : "未绑定挂车";
      return `<button class="dispatch-vehicle-option ${selected ? "selected" : ""}" type="button" data-picker-plate="${escapeHtml(resource.vehicle.plateNo)}" ${selectable ? "" : "disabled"}>
        <span><strong>${escapeHtml(resource.driver?.name || "未绑定司机")}</strong><small>${escapeHtml(resource.driver?.phone || "暂无联系电话")}</small></span>
        <span><strong>${escapeHtml(resource.vehicle.plateNo)}</strong><small>${escapeHtml(trailer)}</small></span>
        <em class="dispatch-resource-state state-${escapeHtml(resource.state)}">${escapeHtml(resource.state)}</em>
      </button>`;
    }).join("") : '<div class="dispatch-management-empty"><i data-lucide="search-x" aria-hidden="true"></i><strong>当前筛选下暂无运力</strong></div>';
    window.lucide?.createIcons();
  }

  function openVehiclePicker(index) {
    if (!pendingDispatchPlan?.assignments[index]) return;
    vehiclePickerAssignmentIndex = index;
    elements.vehicleFilter.value = "";
    elements.vehicleDriverSearch.value = "";
    renderVehiclePicker();
    if (!elements.vehicleDialog.open) elements.vehicleDialog.showModal();
  }

  function confirmDispatchPlan() {
    const plan = pendingDispatchPlan;
    if (!plan) return;
    const currentPending = new Map(getPendingTasks().map((task) => [task.id, task]));
    const currentIdle = new Map(getCapacityResources().filter((resource) => resource.state === "空闲").map((resource) => [resource.vehicle.plateNo, resource]));
    const validAssignments = plan.assignments.filter(({ task, resource }) => currentPending.has(task.id) && currentIdle.has(resource.vehicle.plateNo));
    if (validAssignments.length !== plan.assignments.length) {
      pendingDispatchPlan = null;
      elements.confirmDialog.close();
      showFeedback("任务或运力状态已变化，请重新核对派单匹配。", "warning");
      render();
      return;
    }
    validAssignments.forEach((assignment) => {
      const { task, resource, note } = assignment;
      assignTask(currentPending.get(task.id), currentIdle.get(resource.vehicle.plateNo), plan.mode, note);
    });
    elements.confirmDialog.close();
    pendingDispatchPlan = null;
    showDispatchResult(plan.mode, plan.tasks.length, validAssignments.length);
    selectedTaskIds.clear();
    selectedPlates.clear();
    render();
  }

  function runManualDispatch() {
    openDispatchConfirmation("manual");
  }

  function runAutomaticDispatch() {
    openDispatchConfirmation("auto");
  }

  function toggleTaskSelection(row) {
    if (!row) return;
    const id = row.dataset.dispatchManagementTask;
    if (selectedTaskIds.has(id)) selectedTaskIds.delete(id);
    else selectedTaskIds.add(id);
    render();
  }

  elements.taskBody.addEventListener("click", (event) => {
    const row = event.target.closest("[data-dispatch-management-task]");
    if (!row || event.target.closest('input[name="dispatchManagementTask"]')) return;
    toggleTaskSelection(row);
  });
  elements.taskBody.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key) || event.target.matches('input[name="dispatchManagementTask"]')) return;
    const row = event.target.closest("[data-dispatch-management-task]");
    if (!row) return;
    event.preventDefault();
    toggleTaskSelection(row);
  });
  elements.taskBody.addEventListener("change", (event) => {
    const input = event.target.closest('input[name="dispatchManagementTask"]');
    if (!input) return;
    if (input.checked) selectedTaskIds.add(input.value);
    else selectedTaskIds.delete(input.value);
    render();
  });
  elements.capacityList.addEventListener("change", (event) => {
    const input = event.target.closest('input[name="dispatchManagementCapacity"]');
    if (!input) return;
    if (input.checked) selectedPlates.add(input.value);
    else selectedPlates.delete(input.value);
    render();
  });
  elements.capacityList.addEventListener("click", (event) => {
    const card = event.target.closest("[data-capacity-plate]");
    if (!card || event.target.closest('input[name="dispatchManagementCapacity"]') || event.target.closest(".dispatch-capacity-match")) return;
    focusedCapacityPlate = card.dataset.capacityPlate;
    const checkbox = card.querySelector?.('input[name="dispatchManagementCapacity"]');
    if (checkbox && !checkbox.disabled) {
      if (selectedPlates.has(checkbox.value)) selectedPlates.delete(checkbox.value);
      else selectedPlates.add(checkbox.value);
    }
    render();
  });
  elements.capacityList.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key) || event.target.matches('input[name="dispatchManagementCapacity"]') || event.target.closest(".dispatch-capacity-match")) return;
    const card = event.target.closest("[data-capacity-plate]");
    if (!card) return;
    event.preventDefault();
    focusedCapacityPlate = card.dataset.capacityPlate;
    const checkbox = card.querySelector?.('input[name="dispatchManagementCapacity"]');
    if (checkbox && !checkbox.disabled) {
      if (selectedPlates.has(checkbox.value)) selectedPlates.delete(checkbox.value);
      else selectedPlates.add(checkbox.value);
    }
    render();
  });

  elements.taskSelectAll.addEventListener("change", (event) => {
    visibleTaskIds.forEach((id) => event.target.checked ? selectedTaskIds.add(id) : selectedTaskIds.delete(id));
    render();
  });
  elements.capacitySelectAll.addEventListener("change", (event) => {
    visibleCapacityPlates.forEach((plate) => event.target.checked ? selectedPlates.add(plate) : selectedPlates.delete(plate));
    render();
  });

  elements.autoButton.addEventListener("click", runAutomaticDispatch);
  elements.manualButton.addEventListener("click", runManualDispatch);
  elements.taskStats.addEventListener("click", (event) => {
    const card = event.target.closest("[data-dispatch-stat-range]");
    if (!card) return;
    elements.taskDateFilter.value = card.dataset.dispatchStatRange === "date" ? card.dataset.dispatchStatDate : "";
    taskPage = 1;
    render();
  });
  elements.capacityStats.addEventListener("click", (event) => {
    const card = event.target.closest("[data-capacity-stat-state]");
    if (!card) return;
    elements.capacityFilter.value = card.dataset.capacityStatState;
    capacityPage = 1;
    render();
  });
  elements.confirmMatches.addEventListener("click", (event) => {
    const button = event.target.closest("[data-replace-vehicle]");
    if (button) openVehiclePicker(Number(button.dataset.replaceVehicle));
  });
  elements.confirmMatches.addEventListener("input", (event) => {
    const input = event.target.closest("[data-confirm-note]");
    if (!input || !pendingDispatchPlan) return;
    const assignment = pendingDispatchPlan.assignments[Number(input.dataset.confirmNote)];
    if (assignment) assignment.note = input.value;
  });
  elements.vehicleFilter.addEventListener("change", renderVehiclePicker);
  elements.vehicleDriverSearch.addEventListener("input", renderVehiclePicker);
  elements.vehicleCancel.addEventListener("click", () => elements.vehicleDialog.close());
  elements.vehicleList.addEventListener("click", (event) => {
    const option = event.target.closest("[data-picker-plate]");
    if (!option || option.disabled || !pendingDispatchPlan) return;
    const resource = getCapacityResources().find((item) => item.vehicle.plateNo === option.dataset.pickerPlate);
    const assignment = pendingDispatchPlan.assignments[vehiclePickerAssignmentIndex];
    if (!resource || resource.state !== "空闲" || !assignment) return;
    const alreadyUsed = pendingDispatchPlan.assignments.some((item, index) => index !== vehiclePickerAssignmentIndex && item.resource.vehicle.plateNo === resource.vehicle.plateNo);
    if (alreadyUsed) return;
    assignment.resource = resource;
    elements.vehicleDialog.close();
    renderConfirmMatches();
  });
  elements.confirmClose.addEventListener("click", () => { pendingDispatchPlan = null; elements.confirmDialog.close(); });
  elements.confirmCancel.addEventListener("click", () => { pendingDispatchPlan = null; elements.confirmDialog.close(); });
  elements.confirmSubmit.addEventListener("click", confirmDispatchPlan);
  elements.resultClose.addEventListener("click", () => elements.resultDialog.close());
  elements.resultStay.addEventListener("click", () => elements.resultDialog.close());
  elements.resultView.addEventListener("click", () => {
    const target = elements.resultView.dataset.dispatchResultTarget;
    elements.resultDialog.close();
    if (target && typeof switchPage === "function") switchPage(target);
  });
  [elements.taskCustomerSearch, elements.taskNumberSearch].forEach((input) => input.addEventListener("input", () => { taskPage = 1; render(); }));
  [elements.taskTypeFilter, elements.taskDateFilter].forEach((input) => input.addEventListener("change", () => { taskPage = 1; render(); }));
  elements.capacityDriverSearch.addEventListener("input", () => { capacityPage = 1; render(); });
  elements.taskPageSize.addEventListener("change", () => { taskPage = 1; render(); });
  elements.capacityFilter.addEventListener("change", () => { capacityPage = 1; render(); });
  elements.taskPrev.addEventListener("click", () => { taskPage -= 1; render(); });
  elements.taskNext.addEventListener("click", () => { taskPage += 1; render(); });
  elements.capacityPrev.addEventListener("click", () => { capacityPage -= 1; render(); });
  elements.capacityNext.addEventListener("click", () => { capacityPage += 1; render(); });
  window.addEventListener("dispatches-updated", render);

  window.DispatchManagement = {
    render,
    reset: () => { resetDemoState(); render(); },
    getDemoState: () => ({ tasks: demoTasks.map((task) => ({ ...task })), assignmentCount: demoAssignments.size }),
    getPendingPlan: () => pendingDispatchPlan ? {
      mode: pendingDispatchPlan.mode,
      assignments: pendingDispatchPlan.assignments.map(({ task, resource }) => ({ taskId: task.id, plateNo: resource.vehicle.plateNo })),
      unassignedTaskIds: pendingDispatchPlan.unassigned.map((task) => task.id),
    } : null,
    setPermissions(permissions) {
      permissionOverrides = { auto: permissions?.auto !== false, manual: permissions?.manual !== false };
      render();
    },
  };
  render();
})();
