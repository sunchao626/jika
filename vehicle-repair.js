(() => {
  const STORAGE_KEY = "container-logistics-vehicle-repairs-v1";
  const OPEN_STATUSES = new Set(["待维修", "维修中"]);
  const STATUS_TRANSITIONS = {
    "待维修": new Set(["维修中", "已完成", "已取消"]),
    "维修中": new Set(["已完成", "已取消"]),
    "已完成": new Set(),
    "已取消": new Set(),
  };

  function normalizeRecord(item = {}) {
    const source = item.source === "司机报修" ? "司机报修" : "后台新增";
    const status = STATUS_TRANSITIONS[item.status] ? item.status : "待维修";
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
      reportedAt: String(item.reportedAt || ""),
      category: String(item.category || "其他"),
      description: String(item.description || ""),
      repairLocation: String(item.repairLocation || ""),
      repairVendor: String(item.repairVendor || ""),
      vendorContact: String(item.vendorContact || ""),
      expectedCost: Math.max(0, Number(item.expectedCost) || 0),
      actualCost: Math.max(0, Number(item.actualCost) || 0),
      startedAt: String(item.startedAt || ""),
      completedAt: String(item.completedAt || ""),
      result: String(item.result || ""),
      cancelReason: String(item.cancelReason || ""),
      remark: String(item.remark || ""),
      evidence: Array.isArray(item.evidence) ? item.evidence.map((file) => typeof file === "string" ? file : {
        id: String(file?.id || ""), name: String(file?.name || ""), type: String(file?.type || ""), uploadedAt: String(file?.uploadedAt || ""),
      }).filter((file) => typeof file === "string" ? Boolean(file) : Boolean(file.id && file.name)) : [],
      previousVehicleState: String(item.previousVehicleState || "在用"),
      updatedAt: String(item.updatedAt || item.reportedAt || ""),
    };
  }

  function load(storage = globalThis.localStorage) {
    try {
      const value = JSON.parse(storage?.getItem(STORAGE_KEY) || "[]");
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
    return records.some((item) => item.plateNo === plateNo && item.id !== exceptId && OPEN_STATUSES.has(item.status));
  }

  function createRecord(records, input, options = {}) {
    const plateNo = String(input.plateNo || "").trim();
    if (!plateNo) return { error: "请选择维修车辆。" };
    if (hasOpenRepair(records, plateNo)) return { error: `车辆 ${plateNo} 已有未完成维修单。` };
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
      reportedAt: input.reportedAt || now,
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
      startedAt: status === "维修中" ? current.startedAt || now : current.startedAt,
      completedAt: ["已完成", "已取消"].includes(status) ? now : current.completedAt,
      updatedAt: now,
    });
    const nextRecords = records.map((item) => item.id === id ? record : item);
    const vehicleState = OPEN_STATUSES.has(status)
      ? "维修中"
      : hasOpenRepair(nextRecords, record.plateNo)
        ? "维修中"
        : record.previousVehicleState === "在用" ? "在用" : "停用";
    return { record, records: nextRecords, vehicleState };
  }

  function activeForVehicle(records, plateNo) {
    return records.filter((item) => item.plateNo === plateNo && OPEN_STATUSES.has(item.status));
  }

  const api = { STORAGE_KEY, OPEN_STATUSES, STATUS_TRANSITIONS, normalizeRecord, load, save, hasOpenRepair, createRecord, transition, activeForVehicle };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.VehicleRepair = api;
})();
