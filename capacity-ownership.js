(function initCapacityOwnership(global) {
  "use strict";

  const TYPES = Object.freeze({ SELF: "自营", THIRD: "三方", MIXED: "自营+三方", PENDING: "待确定" });
  const STORAGE_KEY = "container-logistics-third-party-suppliers-v1";
  const CUSTOMER_STORAGE_KEY = "container-logistics-customers-v1";
  const SUPPLIER_ROLE = "三方供应商";
  const SELF_ORGANIZATION = "万物时空";
  const LEGACY_SELF_ORGANIZATION = "本公司";
  const seedSuppliers = [
    { id: "SUP-001", name: "临港外协集卡车队", status: "启用", contact: "赵经理", phone: "021-68000021", remark: "上海临港集卡运力" },
    { id: "SUP-002", name: "杭州危险品运输车队", status: "启用", contact: "陈经理", phone: "0571-88002190", remark: "杭州危险品及普货运力" },
  ];

  function text(value) {
    return String(value ?? "").trim();
  }

  function normalizeOrganizationName(value) {
    const organization = text(value);
    return organization === LEGACY_SELF_ORGANIZATION ? SELF_ORGANIZATION : organization;
  }

  function normalizeOrganizationText(value) {
    return String(value ?? "").replaceAll(LEGACY_SELF_ORGANIZATION, SELF_ORGANIZATION);
  }

  function escapeHtml(value) {
    return text(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeType(value) {
    const source = text(value);
    if ([TYPES.SELF, "自有", "自有司机", "自营司机", "自有车辆"].includes(source)) return TYPES.SELF;
    if ([TYPES.THIRD, "外协", "外协司机", "三方司机", "外部", "外部司机"].includes(source)) return TYPES.THIRD;
    if ([TYPES.MIXED, "混合", "混合运力"].includes(source)) return TYPES.MIXED;
    return source || TYPES.PENDING;
  }

  function readLegacySuppliers() {
    try {
      const records = JSON.parse(global.localStorage?.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(records)) return records;
    } catch {}
    return seedSuppliers.map((item) => ({ ...item }));
  }

  function customerRoles(customer = {}) {
    if (Array.isArray(customer.businessRoles)) return customer.businessRoles.map(text);
    const role = text(customer.businessRole);
    if (role === "客户+三方供应商") return ["客户", SUPPLIER_ROLE];
    return role ? [role] : ["客户"];
  }

  function supplierFromCustomer(customer = {}) {
    return {
      id: text(customer.customerNo || customer.id),
      name: text(customer.customerName || customer.name),
      status: text(customer.customerStatus || customer.status) || "启用",
      contact: text(customer.contactName || customer.contact),
      phone: text(customer.mobile || customer.phone),
      remark: text(customer.remark),
      customerNo: text(customer.customerNo || customer.id),
      legacySupplierId: text(customer.legacySupplierId),
    };
  }

  function readCustomers() {
    try {
      const customers = JSON.parse(global.localStorage?.getItem(CUSTOMER_STORAGE_KEY) || "null");
      return Array.isArray(customers) ? customers : [];
    } catch {
      return [];
    }
  }

  function readSuppliers() {
    const customerRecords = readCustomers();
    const result = customerRecords.filter((item) => customerRoles(item).includes(SUPPLIER_ROLE)).map(supplierFromCustomer).filter((item) => item.id && item.name);
    if (!customerRecords.length) return readLegacySuppliers();
    readLegacySuppliers().forEach((legacy) => {
      const migrated = customerRecords.some((item) => text(item.legacySupplierId).toLowerCase() === text(legacy.id).toLowerCase() || text(item.customerName).toLowerCase() === text(legacy.name).toLowerCase());
      if (migrated) return;
      result.push({ ...legacy });
    });
    return result;
  }

  function findSupplier(value, records = readSuppliers()) {
    const target = text(value).toLowerCase();
    if (!target) return undefined;
    return records.find((item) => [item.id, item.customerNo, item.legacySupplierId, item.name].some((candidate) => text(candidate).toLowerCase() === target));
  }

  function organizationName(record = {}) {
    const type = normalizeType(record.capacityOwnership || record.ownership || record.driverType);
    if (type === TYPES.SELF) return SELF_ORGANIZATION;
    if (type === TYPES.THIRD) {
      const supplier = record.supplierId ? findSupplier(record.supplierId) : null;
      return text(supplier?.name || record.supplierName || record.thirdPartyName || record.organizationName || record.fleetName || record.fleet) || "未配置供应商";
    }
    return text(record.organizationName) || TYPES.PENDING;
  }

  function normalizeResource(record = {}, kind = "vehicle") {
    const capacityOwnership = normalizeType(record.capacityOwnership || record.ownership || record.driverType);
    let supplierName = capacityOwnership === TYPES.THIRD
      ? text(record.supplierName || record.thirdPartyName || record.organizationName || record.fleetName || record.fleet)
      : "";
    const legacyAliases = { "上海外协车队": "临港外协集卡车队", "杭州危运车队": "杭州危险品运输车队" };
    supplierName = legacyAliases[supplierName] || supplierName;
    let supplierId = capacityOwnership === TYPES.THIRD ? text(record.supplierId) : "";
    if (supplierName || supplierId) {
      const supplier = findSupplier(supplierId) || findSupplier(supplierName);
      supplierId = supplier?.id || supplierId;
      supplierName = supplier?.name || supplierName;
    }
    record.capacityOwnership = capacityOwnership;
    record.supplierId = supplierId;
    record.supplierName = supplierName;
    record.organizationName = capacityOwnership === TYPES.SELF ? SELF_ORGANIZATION : supplierName;
    if (kind === "driver") record.driverType = capacityOwnership === TYPES.SELF ? "自有司机" : capacityOwnership === TYPES.THIRD ? "三方司机" : record.driverType;
    else record.ownership = capacityOwnership === TYPES.SELF ? "自有" : capacityOwnership === TYPES.THIRD ? "外协" : record.ownership;
    return record;
  }

  function groupSnapshot(resources = [], options = {}) {
    const normalized = resources.filter(Boolean).map((item) => ({
      role: text(item.role), name: text(item.name),
      type: normalizeType(item.capacityOwnership || item.ownership || item.driverType),
      organizationName: organizationName(item), supplierId: text(item.supplierId), supplierName: text(item.supplierName) || (normalizeType(item.capacityOwnership || item.ownership || item.driverType) === TYPES.THIRD ? organizationName(item) : ""),
    }));
    const missingRequired = Boolean(options.missingRequired);
    const types = new Set(normalized.map((item) => item.type).filter((type) => type === TYPES.SELF || type === TYPES.THIRD));
    const type = missingRequired || !types.size ? TYPES.PENDING : types.size > 1 ? TYPES.MIXED : [...types][0];
    const supplierNames = [...new Set(normalized.filter((item) => item.type === TYPES.THIRD).map((item) => item.supplierName).filter(Boolean))];
    return { type, resources: normalized, supplierNames, tooltip: normalized.map((item) => `${item.role || "运力"}：${item.name || "未选择"} · ${item.organizationName || TYPES.PENDING}`).join("\n") };
  }

  function matchesFilter(value, filter, individualResource = false) {
    const target = text(filter);
    if (!target) return true;
    if (individualResource && normalizeType(target) === TYPES.MIXED) return [TYPES.SELF, TYPES.THIRD].includes(normalizeType(value));
    return normalizeType(value) === normalizeType(target);
  }

  function badgeMarkup(value, tooltip = "") {
    const type = normalizeType(value);
    const className = type === TYPES.SELF ? "self" : type === TYPES.THIRD ? "third" : type === TYPES.MIXED ? "mixed" : "pending";
    const title = tooltip ? ` title="${escapeHtml(normalizeOrganizationText(tooltip))}"` : "";
    return `<span class="capacity-ownership-badge ${className}"${title}>${escapeHtml(type)}</span>`;
  }

  function sortSelfFirst(records, typeGetter = (item) => item.capacityOwnership) {
    const priority = { [TYPES.SELF]: 0, [TYPES.MIXED]: 1, [TYPES.THIRD]: 2, [TYPES.PENDING]: 3 };
    return [...records].sort((left, right) => (priority[normalizeType(typeGetter(left))] ?? 9) - (priority[normalizeType(typeGetter(right))] ?? 9));
  }

  global.CapacityOwnership = Object.freeze({ TYPES, STORAGE_KEY, CUSTOMER_STORAGE_KEY, SUPPLIER_ROLE, SELF_ORGANIZATION, normalizeType, normalizeOrganizationName, normalizeOrganizationText, normalizeResource, organizationName, groupSnapshot, matchesFilter, badgeMarkup, sortSelfFirst, readSuppliers, findSupplier, escapeHtml });
})(typeof window !== "undefined" ? window : globalThis);

if (typeof module !== "undefined" && module.exports) module.exports = globalThis.CapacityOwnership;
