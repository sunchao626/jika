(() => {
  const STORAGE_KEY = "container-logistics-vehicle-maintenance-fees-v1";
  const DEFAULT_ITEMS = [
    { id: "MF-REPAIR-ENGINE", code: "WX-FDJ", name: "发动机维修", category: "维修费用", costMode: "parts_labor", serviceProviderRequired: true, periodRequired: false, reminderEnabled: false, reminderDays: 0, affectsDispatch: true, enabled: true, sort: 10, remark: "发动机检修与配件更换" },
    { id: "MF-REPAIR-TIRE", code: "WX-LT", name: "轮胎维修", category: "维修费用", costMode: "parts_labor", serviceProviderRequired: true, periodRequired: false, reminderEnabled: false, reminderDays: 0, affectsDispatch: true, enabled: true, sort: 20, remark: "补胎、换胎与轮胎养护" },
    { id: "MF-REPAIR-BRAKE", code: "WX-ZD", name: "制动系统维修", category: "维修费用", costMode: "parts_labor", serviceProviderRequired: true, periodRequired: false, reminderEnabled: false, reminderDays: 0, affectsDispatch: true, enabled: true, sort: 30, remark: "制动系统检查与维修" },
    { id: "MF-MAINTAIN-ROUTINE", code: "BY-RC", name: "常规保养", category: "保养费用", costMode: "parts_labor", serviceProviderRequired: true, periodRequired: false, reminderEnabled: false, reminderDays: 0, affectsDispatch: true, enabled: true, sort: 40, remark: "机油、滤芯及常规保养" },
    { id: "MF-INSURANCE-MANDATORY", code: "BX-JQX", name: "交强险", category: "保险费用", costMode: "direct", serviceProviderRequired: true, periodRequired: true, reminderEnabled: true, reminderDays: 30, affectsDispatch: false, enabled: true, sort: 50, remark: "同步车辆档案交强险记录" },
    { id: "MF-INSURANCE-COMMERCIAL", code: "BX-SYX", name: "商业险", category: "保险费用", costMode: "direct", serviceProviderRequired: true, periodRequired: true, reminderEnabled: true, reminderDays: 30, affectsDispatch: false, enabled: true, sort: 60, remark: "同步车辆档案商业险记录" },
    { id: "MF-INSPECTION-ANNUAL", code: "SY-NJ", name: "车辆年检", category: "审验费用", costMode: "direct", serviceProviderRequired: true, periodRequired: true, reminderEnabled: true, reminderDays: 30, affectsDispatch: false, enabled: true, sort: 70, remark: "同步车辆审验记录" },
    { id: "MF-INSPECTION-PERMIT", code: "SY-YYZ", name: "营运证年审", category: "审验费用", costMode: "direct", serviceProviderRequired: true, periodRequired: true, reminderEnabled: true, reminderDays: 30, affectsDispatch: false, enabled: true, sort: 80, remark: "同步营运证审验记录" },
    { id: "MF-BEIDOU", code: "SB-BD", name: "北斗服务费", category: "设备费用", costMode: "direct", serviceProviderRequired: true, periodRequired: true, reminderEnabled: true, reminderDays: 30, affectsDispatch: false, enabled: true, sort: 90, remark: "北斗设备年度服务费用" },
    { id: "MF-OTHER", code: "QT-QT", name: "其他维护费用", category: "其他费用", costMode: "direct", serviceProviderRequired: false, periodRequired: false, reminderEnabled: false, reminderDays: 0, affectsDispatch: false, enabled: true, sort: 100, remark: "未归类的车辆维护费用" },
  ];

  function normalize(item = {}) {
    return {
      id: String(item.id || `MF-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`),
      code: String(item.code || "").trim().toUpperCase(),
      name: String(item.name || "").trim(),
      category: String(item.category || "其他费用"),
      costMode: item.costMode === "parts_labor" ? "parts_labor" : "direct",
      serviceProviderRequired: Boolean(item.serviceProviderRequired),
      periodRequired: Boolean(item.periodRequired),
      reminderEnabled: Boolean(item.reminderEnabled),
      reminderDays: Math.max(0, Number(item.reminderDays) || 0),
      affectsDispatch: Boolean(item.affectsDispatch),
      enabled: item.enabled !== false,
      sort: Math.max(0, Number(item.sort) || 0),
      remark: String(item.remark || "").trim(),
      updatedAt: String(item.updatedAt || ""),
    };
  }

  function load(storage = globalThis.localStorage) {
    try {
      const saved = storage?.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_ITEMS.map(normalize);
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalize).filter((item) => item.code && item.name) : DEFAULT_ITEMS.map(normalize);
    } catch {
      return DEFAULT_ITEMS.map(normalize);
    }
  }

  function save(items, storage = globalThis.localStorage) {
    const normalized = items.map(normalize).sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, "zh-CN"));
    storage?.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  }

  function validate(items, input, editingId = "") {
    const item = normalize(input);
    if (!item.code) return "请填写项目编码。";
    if (!item.name) return "请填写项目名称。";
    if (items.some((current) => current.id !== editingId && current.code === item.code)) return `项目编码 ${item.code} 已存在。`;
    if (item.reminderEnabled && !item.periodRequired) return "启用到期提醒时必须同时启用起止时间。";
    return "";
  }

  const api = { STORAGE_KEY, DEFAULT_ITEMS, normalize, load, save, validate };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.VehicleMaintenanceFeeConfig = api;
})();
