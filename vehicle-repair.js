(() => {
  const STORAGE_KEY = "container-logistics-vehicle-repairs-v1";
  const OPEN_STATUSES = new Set(["待维修", "维修中"]);
  const STATUS_TRANSITIONS = {
    "待维修": new Set(["维修中", "已完成", "已取消"]),
    "维修中": new Set(["已完成", "已取消"]),
    "已完成": new Set(),
    "已取消": new Set(),
  };

  function normalizeItem(item = {}, index = 0) {
    const partsCost = Math.max(0, Number(item.partsCost) || 0);
    const laborCost = Math.max(0, Number(item.laborCost) || 0);
    const otherCost = Math.max(0, Number(item.otherCost) || 0);
    return {
      id: String(item.id || `ITEM-${index + 1}`),
      itemNo: String(item.itemNo || String(index + 1).padStart(2, "0")),
      feeItemId: String(item.feeItemId || ""),
      feeCode: String(item.feeCode || ""),
      feeName: String(item.feeName || "其他维护费用"),
      feeCategory: String(item.feeCategory || "其他费用"),
      costMode: item.costMode === "parts_labor" ? "parts_labor" : "direct",
      content: String(item.content || "").trim(),
      serviceProvider: String(item.serviceProvider || "").trim(),
      periodStart: String(item.periodStart || ""),
      periodEnd: String(item.periodEnd || ""),
      policyNo: String(item.policyNo || "").trim(),
      partsCost,
      laborCost,
      otherCost,
      subtotal: Number((partsCost + laborCost + otherCost).toFixed(2)),
      affectsDispatch: Boolean(item.affectsDispatch),
      reminderEnabled: Boolean(item.reminderEnabled),
      reminderDays: Math.max(0, Number(item.reminderDays) || 0),
      remark: String(item.remark || "").trim(),
    };
  }

  function calculateTotal(items = []) {
    return Number(items.reduce((sum, item, index) => sum + normalizeItem(item, index).subtotal, 0).toFixed(2));
  }

  function normalizeRecord(item = {}) {
    const source = item.source === "司机报修" ? "司机报修" : "后台新增";
    const status = STATUS_TRANSITIONS[item.status] ? item.status : "待维修";
    const legacyRepairCategories = new Set(["发动机", "轮胎", "制动系统", "电气系统", "底盘与悬挂"]);
    const items = Array.isArray(item.items) ? item.items.map(normalizeItem) : [];
    const createdAt = String(item.createdAt || item.reportedAt || "");
    return {
      ...item,
      id: String(item.id || ""),
      repairNo: String(item.repairNo || item.id || ""),
      plateNo: String(item.plateNo || "").trim(),
      vehicleType: String(item.vehicleType || ""),
      fleet: String(item.fleet || ""),
      source,
      status,
      reporterId: String(item.reporterId || ""),
      reporterName: String(item.reporterName || item.createdBy || ""),
      createdBy: String(item.createdBy || item.reporterName || ""),
      createdAt,
      reportedAt: createdAt,
      repairedAt: String(item.repairedAt || item.startedAt || ""),
      category: legacyRepairCategories.has(item.category) ? "维修" : String(item.category || "其他"),
      description: String(item.description || ""),
      repairLocation: String(item.repairLocation || ""),
      repairVendor: String(item.repairVendor || ""),
      repairVendorCustomerNo: String(item.repairVendorCustomerNo || ""),
      vendorContact: String(item.vendorContact || ""),
      vendorPhone: String(item.vendorPhone || ""),
      expectedCost: Math.max(0, Number(item.expectedCost) || 0),
      items,
      actualCost: items.length ? calculateTotal(items) : Math.max(0, Number(item.actualCost) || 0),
      startedAt: String(item.startedAt || ""),
      completedAt: String(item.completedAt || ""),
      result: String(item.result || ""),
      cancelReason: String(item.cancelReason || ""),
      remark: String(item.remark || ""),
      evidence: Array.isArray(item.evidence) ? item.evidence.map((file) => typeof file === "string" ? file : {
        id: String(file?.id || ""), name: String(file?.name || ""), type: String(file?.type || ""), uploadedAt: String(file?.uploadedAt || ""),
      }).filter((file) => typeof file === "string" ? Boolean(file) : Boolean(file.id && file.name)) : [],
      previousVehicleState: String(item.previousVehicleState || "在用"),
      updatedAt: String(item.updatedAt || createdAt || ""),
    };
  }

  function load(storage = globalThis.localStorage) {
    try {
      const saved = storage?.getItem(STORAGE_KEY);
      if (saved == null) return [normalizeRecord({
        id: "WX-DEMO-001", repairNo: "WX-DEMO-001", plateNo: "苏E·T5568", vehicleType: "集装箱骨架车", fleet: "苏州园区集卡车队",
        capacityOwnershipSnapshot: "自营", vehicleOrganizationSnapshot: "万物时空", source: "后台新增", createdBy: "张调度",
        reporterName: "张调度", createdAt: "2026-10-12T10:20", repairedAt: "2026-10-12T11:00", category: "维修", description: "制动间隙偏大，已完成检修和路试。",
        repairLocation: "苏州工业园区维修点", repairVendor: "宁波安达汽车维修有限公司", repairVendorCustomerNo: "KH-1201", vendorContact: "周师傅", vendorPhone: "13800001201",
        items: [{ id: "ITEM-DEMO-01", itemNo: "01", feeItemId: "MF-REPAIR-BRAKE", feeCode: "WX-ZD", feeName: "制动系统维修", feeCategory: "维修费用", costMode: "parts_labor", content: "更换制动分泵并完成路试", serviceProvider: "宁波安达汽车维修有限公司", partsCost: 1200, laborCost: 450, otherCost: 0, affectsDispatch: true }], expectedCost: 1800, actualCost: 1650, status: "已完成", startedAt: "2026-10-12T11:00", completedAt: "2026-10-12T16:30",
        result: "更换制动分泵并完成路试。", previousVehicleState: "停用",
      })];
      const value = JSON.parse(saved);
      return Array.isArray(value) ? value.map(normalizeRecord).filter((item) => item.id && item.plateNo) : [];
    } catch {
      return [];
    }
  }

  function save(records, storage = globalThis.localStorage) {
    const normalized = records.map(normalizeRecord);
    storage?.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  }

  function hasOpenRepair(records, plateNo, exceptId = "") {
    return records.some((item) => item.plateNo === plateNo && item.id !== exceptId && OPEN_STATUSES.has(item.status)
      && (!item.items?.length || item.items.some((detail) => detail.affectsDispatch)));
  }

  function createRecord(records, input, options = {}) {
    const plateNo = String(input.plateNo || "").trim();
    if (!plateNo) return { error: "请选择维修车辆。" };
    const affectsDispatch = !Array.isArray(input.items) || !input.items.length || input.items.some((detail) => detail.affectsDispatch);
    if (affectsDispatch && hasOpenRepair(records, plateNo)) return { error: `车辆 ${plateNo} 已有未完成维修单（该工单影响派单）。` };
    if (!String(input.description || "").trim()) return { error: "请填写故障描述。" };
    const now = options.now || new Date().toISOString();
    const id = options.id || `WX-${now.replace(/\D/g, "").slice(0, 14)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const record = normalizeRecord({
      ...input,
      id,
      repairNo: input.repairNo || id,
      plateNo,
      status: input.status || "待维修",
      source: input.source,
      createdAt: input.createdAt || now,
      reportedAt: input.createdAt || now,
      previousVehicleState: input.previousVehicleState || options.vehicleState || "在用",
      createdBy: input.createdBy || input.reporterName || "",
      updatedAt: now,
    });
    return { record };
  }

  function transition(records, id, status, options = {}) {
    const current = records.find((item) => item.id === id);
    if (!current) return { error: "未找到维修记录。" };
    if (!STATUS_TRANSITIONS[current.status]?.has(status)) return { error: `不能将“${current.status}”变更为“${status}”。` };
    const now = options.now || new Date().toISOString();
    const record = normalizeRecord({
      ...current,
      ...options.patch,
      status,
      startedAt: status === "维修中" ? current.repairedAt || current.startedAt || now : current.startedAt,
      completedAt: ["已完成", "已取消"].includes(status) ? now : current.completedAt,
      updatedAt: now,
    });
    const nextRecords = records.map((item) => item.id === id ? record : item);
    const recordAffectsDispatch = !record.items?.length || record.items.some((detail) => detail.affectsDispatch);
    const vehicleState = OPEN_STATUSES.has(status) && recordAffectsDispatch
      ? "维修中"
      : hasOpenRepair(nextRecords, record.plateNo)
        ? "维修中"
        : record.previousVehicleState === "在用" ? "在用" : "停用";
    return { record, records: nextRecords, vehicleState };
  }

  function activeForVehicle(records, plateNo) {
    return records.filter((item) => item.plateNo === plateNo && OPEN_STATUSES.has(item.status));
  }

  function searchRepairShops(customers, query = "") {
    const keyword = String(query || "").trim().toLocaleLowerCase("zh-CN");
    return (Array.isArray(customers) ? customers : [])
      .filter((item) => item?.customerType === "维修厂" && item?.customerStatus === "启用")
      .filter((item) => !keyword || [item.customerName, item.shortName, item.customerNo, item.contactName, item.mobile, item.phone]
        .some((value) => String(value || "").toLocaleLowerCase("zh-CN").includes(keyword)))
      .sort((left, right) => String(left.customerName || "").localeCompare(String(right.customerName || ""), "zh-CN"));
  }

  const api = { STORAGE_KEY, OPEN_STATUSES, STATUS_TRANSITIONS, normalizeItem, calculateTotal, normalizeRecord, load, save, hasOpenRepair, createRecord, transition, activeForVehicle, searchRepairShops };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.VehicleRepair = api;
})();
