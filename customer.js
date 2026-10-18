(() => {
  const STORAGE_KEY = "container-logistics-customers-v1";
  const ROLE_CUSTOMER = "客户";
  const ROLE_SUPPLIER = "三方供应商";
  const seed = [
    { customerNo: "KH-1008", customerName: "宁波远海供应链有限公司", shortName: "宁波远海", customerType: "直客", creditCode: "91330206MA28T1008K", customerStatus: "启用", contactName: "李经理", mobile: "13800001008", phone: "0574-86881008", email: "service@yuanhai.example", registeredAddress: "宁波市北仑区大碶街道物流园路18号", loadAddress: "宁波北仑港区二期", unloadAddress: "宁波江北物流园", settlementCycle: "月结30天", invoiceTitle: "宁波远海供应链有限公司", taxNo: "91330206MA28T1008K", bankName: "中国工商银行宁波北仑支行", bankAccount: "6222020200001008", remark: "港区集装箱短驳" },
    { customerNo: "KH-1022", customerName: "上海嘉航国际物流有限公司", shortName: "上海嘉航", customerType: "货代", creditCode: "91310115MA28T1022A", customerStatus: "启用", contactName: "陈主管", mobile: "13900001022", phone: "021-60951022", email: "ops@jiahang.example", registeredAddress: "上海市浦东新区临港大道220号", loadAddress: "上海洋山港", unloadAddress: "昆山综合保税区", settlementCycle: "月结15天", invoiceTitle: "上海嘉航国际物流有限公司", taxNo: "91310115MA28T1022A", bankName: "中国建设银行上海临港支行", bankAccount: "6217001200001022", remark: "双拖作业需提前确认箱量" },
    { customerNo: "KH-1035", customerName: "杭州联贸进出口有限公司", shortName: "杭州联贸", customerType: "贸易企业", creditCode: "91330109MA28T1035H", customerStatus: "启用", contactName: "周女士", mobile: "13600001035", phone: "0571-82811035", email: "logistics@lianmao.example", registeredAddress: "杭州市萧山区市心南路35号", loadAddress: "杭州萧山仓", unloadAddress: "宁波梅山码头", settlementCycle: "月结30天", invoiceTitle: "杭州联贸进出口有限公司", taxNo: "91330109MA28T1035H", bankName: "中国农业银行杭州萧山支行", bankAccount: "6228480400001035", remark: "出口柜运输" },
    { customerNo: "KH-1086", customerName: "苏州新程电子科技有限公司", shortName: "苏州新程", customerType: "直客", creditCode: "91320594MA28T1086C", customerStatus: "启用", contactName: "王工", mobile: "13700001086", phone: "0512-62861086", email: "shipping@xincheng.example", registeredAddress: "苏州工业园区星湖街86号", loadAddress: "苏州工业园区", unloadAddress: "上海外高桥", settlementCycle: "月结45天", invoiceTitle: "苏州新程电子科技有限公司", taxNo: "91320594MA28T1086C", bankName: "中国银行苏州工业园区支行", bankAccount: "6216610000001086", remark: "暂停发运时保留档案" },
    { customerNo: "KH-1102", customerName: "宁波海盛集装箱服务有限公司", shortName: "宁波海盛", customerType: "货代", creditCode: "91330212MA28T1102X", customerStatus: "启用", contactName: "吴先生", mobile: "13500001102", phone: "0574-87121102", email: "contact@haisheng.example", registeredAddress: "宁波市鄞州区宁穿路102号", loadAddress: "宁波穿山港区", unloadAddress: "宁波镇海堆场", settlementCycle: "现结", invoiceTitle: "宁波海盛集装箱服务有限公司", taxNo: "91330212MA28T1102X", bankName: "招商银行宁波分行", bankAccount: "6214830000001102", remark: "" },
    { customerNo: "KH-1120", customerName: "上海港联贸易有限公司", shortName: "上海港联", customerType: "贸易企业", creditCode: "91310109MA28T1120L", customerStatus: "停用", contactName: "何经理", mobile: "13100001120", phone: "021-65801120", email: "finance@ganglian.example", registeredAddress: "上海市虹口区东大名路120号", loadAddress: "上海外高桥", unloadAddress: "苏州工业园区", settlementCycle: "月结60天", invoiceTitle: "上海港联贸易有限公司", taxNo: "91310109MA28T1120L", bankName: "交通银行上海分行", bankAccount: "6222600000001120", remark: "合作暂停" },
  ];
  const fields = ["customerNo", "customerName", "shortName", "businessRole", "customerType", "creditCode", "customerStatus", "contactName", "mobile", "phone", "email", "registeredAddress", "loadAddress", "unloadAddress", "settlementCycle", "invoiceTitle", "taxNo", "bankName", "bankAccount", "remark"];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const page = document.querySelector("#customerPage");
  const query = page.querySelector("#customerQueryForm");
  const form = page.querySelector("#customerForm");
  const listView = page.querySelector("#customerListView");
  const formView = page.querySelector("#customerFormView");
  const detailDialog = page.querySelector("#customerDetailDialog");
  const deleteDialog = page.querySelector("#deleteCustomerDialog");
  const rows = page.querySelector("#customerBody");
  const sizeSelect = page.querySelector("#customerPageSize");
  const jump = page.querySelector("#customerPageJump");
  let currentPage = 1;
  let editingNo = "";
  let selectedNo = "";
  let deletingNo = "";

  function normalizeBusinessRole(value, roles = []) {
    const source = Array.isArray(roles) ? roles.map(String) : [];
    String(value || "").split(/[+,，、]/).map((item) => item.trim()).filter(Boolean).forEach((item) => source.push(item));
    const hasCustomer = source.includes(ROLE_CUSTOMER);
    const hasSupplier = source.includes(ROLE_SUPPLIER);
    if (hasCustomer && hasSupplier) return `${ROLE_CUSTOMER}+${ROLE_SUPPLIER}`;
    return hasSupplier ? ROLE_SUPPLIER : ROLE_CUSTOMER;
  }

  function hasBusinessRole(item, role) {
    return normalizeBusinessRole(item?.businessRole, item?.businessRoles).split("+").includes(role);
  }

  function normalizeCustomer(item) {
    const legacyTypes = {
      "直客": "第三方物流 / 供应链公司",
      "直营": "第三方物流 / 供应链公司",
      "货代": "国际货运代理（货代）",
      "贸易企业": "跨境电商物流商",
      "其他": "第三方物流 / 供应链公司",
    };
    const customerTypes = ["国际货运代理（货代）", "船公司 / 船代", "第三方物流 / 供应链公司", "跨境电商物流商"];
    const businessRole = normalizeBusinessRole(item.businessRole, item.businessRoles);
    const supplierOnly = businessRole === ROLE_SUPPLIER;
    const customerType = customerTypes.includes(item.customerType) ? item.customerType : legacyTypes[item.customerType] || (supplierOnly ? "" : "第三方物流 / 供应链公司");
    return { ...item, businessRole, customerType };
  }

  function nextCustomerNo(records) {
    const maxNumber = records.reduce((max, item) => {
      const match = /^KH-(\d+)$/i.exec(item.customerNo);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 1000);
    return `KH-${String(maxNumber + 1).padStart(4, "0")}`;
  }

  function migrateLegacySuppliers(records) {
    const suppliers = window.CapacityOwnership?.readSuppliers?.() || [];
    suppliers.forEach((supplier) => {
      const legacyId = String(supplier.legacySupplierId || supplier.id || "").trim();
      const name = String(supplier.name || "").trim();
      if (!name) return;
      const existing = records.find((item) => item.legacySupplierId === legacyId || item.customerName === name);
      if (existing) {
        existing.businessRole = normalizeBusinessRole(`${existing.businessRole || ROLE_CUSTOMER}+${ROLE_SUPPLIER}`);
        if (!existing.legacySupplierId && /^SUP-/i.test(legacyId)) existing.legacySupplierId = legacyId;
        if (!existing.contactName) existing.contactName = supplier.contact || "";
        if (!existing.phone) existing.phone = supplier.phone || "";
        return;
      }
      records.push(normalizeCustomer({
        customerNo: nextCustomerNo(records), customerName: name, shortName: name,
        businessRole: ROLE_SUPPLIER, customerType: "第三方物流 / 供应链公司", creditCode: "",
        customerStatus: supplier.status || "启用", contactName: supplier.contact || "", mobile: "", phone: supplier.phone || "",
        email: "", registeredAddress: "", loadAddress: "", unloadAddress: "", settlementCycle: "月结30天",
        invoiceTitle: name, taxNo: "", bankName: "", bankAccount: "", remark: supplier.remark || "历史三方供应商档案自动归集",
        legacySupplierId: /^SUP-/i.test(legacyId) ? legacyId : "",
      }));
    });
    return records;
  }

  function loadCustomers() {
    const sharedCustomers = window.AdminDataBridge?.read?.()?.customers;
    if (Array.isArray(sharedCustomers) && sharedCustomers.every((item) => item && typeof item.customerNo === "string" && typeof item.customerName === "string")) {
      const normalized = sharedCustomers.map(normalizeCustomer);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(saved) && saved.every((item) => item && typeof item.customerNo === "string" && typeof item.customerName === "string")) {
        const normalized = saved.map(normalizeCustomer);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    } catch (error) {
      console.warn("客户档案读取失败，使用初始数据。", error);
    }
    return seed.map(normalizeCustomer);
  }
  let customers = migrateLegacySuppliers(loadCustomers());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  if (window.CapacityOwnership?.STORAGE_KEY) localStorage.setItem(window.CapacityOwnership.STORAGE_KEY, "[]");
  if (window.AdminDataBridge) {
    const snapshot = window.AdminDataBridge.read() || {};
    window.AdminDataBridge.write({ ...snapshot, customers });
  }
  function saveCustomers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    if (window.AdminDataBridge) {
      const snapshot = window.AdminDataBridge.read() || {};
      window.AdminDataBridge.write({ ...snapshot, customers });
    }
    refreshWaybillOptions();
    if (typeof CustomEvent === "function") window.dispatchEvent?.(new CustomEvent("counterpartieschange"));
  }
  function refreshWaybillOptions() {
    const options = document.querySelector("#customerOptions");
    if (!options) return;
    options.innerHTML = customers.filter((item) => item.customerStatus === "启用" && hasBusinessRole(item, ROLE_CUSTOMER))
      .map((item) => `<option value="${escapeHtml(item.customerName)}"></option>`).join("");
  }
  function getActiveCustomerByName(name) {
    return customers.find((item) => item.customerStatus === "启用" && hasBusinessRole(item, ROLE_CUSTOMER) && item.customerName === String(name || "").trim()) || null;
  }
  function filteredCustomers() {
    const values = new FormData(query);
    const number = String(values.get("customerNo") || "").trim().toLowerCase();
    const name = String(values.get("customerName") || "").trim().toLowerCase();
    return customers.filter((item) => item.customerNo.toLowerCase().includes(number) &&
      `${item.customerName} ${item.shortName || ""}`.toLowerCase().includes(name) &&
      (!values.get("businessRole") || hasBusinessRole(item, values.get("businessRole"))) &&
      (!values.get("customerType") || item.customerType === values.get("customerType")) &&
      (!values.get("customerStatus") || item.customerStatus === values.get("customerStatus")));
  }
  function customerTypeClass(type) {
    return ({
      "国际货运代理（货代）": "forwarder",
      "船公司 / 船代": "shipping",
      "第三方物流 / 供应链公司": "supply-chain",
      "跨境电商物流商": "ecommerce",
    }[type] || "other");
  }
  function generateCustomerNo() {
    return nextCustomerNo(customers);
  }
  function render() {
    const result = filteredCustomers();
    const pageSize = Number(sizeSelect.value) || 5;
    const totalPages = Math.max(1, Math.ceil(result.length / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    const visible = result.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    rows.innerHTML = visible.length ? visible.map((customer) => `<tr>
      <td><button class="customer-name-link" type="button" data-customer-view="${escapeHtml(customer.customerNo)}">${escapeHtml(customer.customerNo)}</button></td>
      <td class="customer-name-cell" title="${escapeHtml(customer.customerName)}"><strong>${escapeHtml(customer.customerName)}</strong></td><td>${escapeHtml(customer.shortName || "-")}</td><td><span class="customer-role-badge">${escapeHtml(customer.businessRole)}</span></td><td><span class="customer-type-badge ${customerTypeClass(customer.customerType)}">${escapeHtml(customer.customerType || "-")}</span></td>
      <td>${escapeHtml(customer.contactName || "-")}</td><td>${escapeHtml(customer.mobile || "-")}</td><td class="customer-address-cell" title="${escapeHtml(customer.loadAddress || "")}">${escapeHtml(customer.loadAddress || "-")}</td>
      <td>${escapeHtml(customer.settlementCycle || "-")}</td><td><span class="customer-status ${customer.customerStatus === "启用" ? "enabled" : "disabled"}">${escapeHtml(customer.customerStatus)}</span></td>
      <td class="fixed-action-column"><div class="vehicle-action-group"><button class="link-btn" type="button" data-customer-view="${escapeHtml(customer.customerNo)}">查看</button><button class="link-btn" type="button" data-customer-edit="${escapeHtml(customer.customerNo)}">编辑</button><button class="link-btn delete-btn" type="button" data-customer-delete="${escapeHtml(customer.customerNo)}">删除</button></div></td></tr>`).join("") : '<tr><td class="no-data-cell" colspan="11">暂无符合条件的往来单位档案</td></tr>';
    page.querySelector("#customerResultText").textContent = `共 ${result.length} 条往来单位档案`;
    page.querySelector("#customerQuerySummary").textContent = `当前显示 ${result.length} 条 / 全部 ${customers.length} 条`;
    page.querySelector("#customerActiveBadge").textContent = `启用 ${customers.filter((item) => item.customerStatus === "启用").length}`;
    page.querySelector("#customerTotalText").textContent = `共 ${result.length} 条记录`;
    page.querySelector("#customerCurrentPage").textContent = currentPage;
    page.querySelector("#customerPrevPage").disabled = currentPage === 1;
    page.querySelector("#customerNextPage").disabled = currentPage === totalPages;
    jump.max = totalPages;
    jump.value = currentPage;
  }
  const requiredMessages = {
    customerName: "请输入单位全称",
    businessRole: "请选择单位角色",
    customerType: "请选择客户类型",
    creditCode: "请输入统一社会信用代码",
    customerStatus: "请选择客户状态",
    contactName: "请输入主要联系人",
    mobile: "请输入联系人手机号",
    loadAddress: "请输入默认装货地址",
    unloadAddress: "请输入默认卸货地址",
    settlementCycle: "请选择结算周期",
  };
  const customerBusinessRequiredFields = ["customerType", "creditCode", "contactName", "mobile", "loadAddress", "unloadAddress", "settlementCycle"];

  function syncBusinessRoleRequirements() {
    const needsCustomerFields = form.elements.businessRole?.value !== ROLE_SUPPLIER;
    customerBusinessRequiredFields.forEach((name) => {
      const input = form.elements[name];
      if (!input) return;
      input.required = needsCustomerFields;
      input.closest(".field")?.classList.toggle("required-field", needsCustomerFields);
      if (!needsCustomerFields) clearFieldError(name);
    });
  }

  function updatePageHeading(inForm = false) {
    const title = document.querySelector("#pageTitle");
    const kicker = document.querySelector("#pageKicker");
    if (title) title.textContent = inForm ? (editingNo ? "编辑单位" : "新增单位") : "客户管理";
    if (kicker) kicker.textContent = inForm ? "基础资料 / 往来单位建档" : "基础资料 / 往来单位档案";
  }

  function clearFieldError(name) {
    const input = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    input?.closest(".field")?.classList.remove("has-error");
    input?.removeAttribute("aria-invalid");
    if (error) error.textContent = "";
  }

  function setFieldError(name, message) {
    const input = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    input?.closest(".field")?.classList.add("has-error");
    input?.setAttribute("aria-invalid", "true");
    if (error) error.textContent = message;
  }

  function clearFormErrors() {
    Object.keys(requiredMessages).concat(["email"]).forEach(clearFieldError);
  }

  function validateCustomer(next) {
    clearFormErrors();
    const errors = {};
    const requiredNames = ["customerName", "businessRole", "customerStatus", ...(hasBusinessRole(next, ROLE_CUSTOMER) ? customerBusinessRequiredFields : [])];
    requiredNames.forEach((name) => {
      if (!next[name]) errors[name] = requiredMessages[name];
    });
    if (next.creditCode && !/^[0-9A-Z]{18}$/.test(next.creditCode)) errors.creditCode = "请输入 18 位数字或大写字母";
    if (next.mobile && !/^1\d{10}$/.test(next.mobile)) errors.mobile = "请输入正确的 11 位手机号";
    if (next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) errors.email = "请输入正确的邮箱地址";
    if (customers.some((item) => item.customerNo.toLowerCase() === next.customerNo.toLowerCase() && item.customerNo !== editingNo)) {
      errors.customerNo = "客户编号已存在，请更换后重试";
    }
    const current = customers.find((item) => item.customerNo === editingNo);
    if (current && hasBusinessRole(current, ROLE_SUPPLIER) && !hasBusinessRole(next, ROLE_SUPPLIER) && isCustomerLinked(current)) {
      errors.businessRole = "该单位已被三方运力引用，不能移除三方供应商角色";
    }
    Object.entries(errors).forEach(([name, message]) => setFieldError(name, message));
    const firstInvalid = form.elements[Object.keys(errors)[0]];
    firstInvalid?.focus();
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
    return Object.keys(errors).length === 0;
  }

  function closeForm() {
    editingNo = "";
    form.reset();
    clearFormErrors();
    formView.hidden = true;
    listView.hidden = false;
    updatePageHeading(false);
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  }
  function openForm(number = "") {
    const customer = customers.find((item) => item.customerNo === number);
    editingNo = customer?.customerNo || "";
    form.reset();
    clearFormErrors();
    if (customer) fields.forEach((key) => { form.elements[key].value = customer[key] || ""; });
    else {
      form.elements.customerNo.value = generateCustomerNo();
      form.elements.businessRole.value = ROLE_CUSTOMER;
    }
    syncBusinessRoleRequirements();
    page.querySelector("#customerFormTitle").textContent = customer ? "编辑单位" : "新增单位";
    listView.hidden = true;
    formView.hidden = false;
    updatePageHeading(true);
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  }
  function detailSection(title, items) {
    return `<section class="customer-detail-section"><h3>${title}</h3><div class="customer-detail-grid">${items.map(([label, value]) => `<div><span>${label}</span><strong>${escapeHtml(value || "-")}</strong></div>`).join("")}</div></section>`;
  }
  function openDetail(number) {
    const customer = customers.find((item) => item.customerNo === number);
    if (!customer) return;
    selectedNo = customer.customerNo;
    page.querySelector("#customerDetailTitle").textContent = customer.customerName;
    page.querySelector("#customerDetailSubtitle").textContent = `${customer.customerNo} / ${customer.customerStatus}`;
    page.querySelector("#customerDetailBody").innerHTML = [
      detailSection("基础信息", [["单位编号", customer.customerNo], ["单位全称", customer.customerName], ["简称", customer.shortName], ["单位角色", customer.businessRole], ["客户类型", customer.customerType], ["统一社会信用代码", customer.creditCode], ["状态", customer.customerStatus]]),
      detailSection("联系信息", [["主要联系人", customer.contactName], ["手机", customer.mobile], ["电话", customer.phone], ["邮箱", customer.email]]),
      detailSection("地址信息", [["注册地址", customer.registeredAddress], ["默认装货地址", customer.loadAddress], ["默认卸货地址", customer.unloadAddress]]),
      detailSection("结算信息", [["结算周期", customer.settlementCycle], ["开票抬头", customer.invoiceTitle], ["税号", customer.taxNo], ["开户银行", customer.bankName], ["银行账号", customer.bankAccount], ["备注", customer.remark]]),
    ].join("");
    detailDialog.showModal();
  }
  function isCustomerLinked(customer) {
    const capacityCollections = [typeof vehicles === "undefined" ? [] : vehicles, typeof trailers === "undefined" ? [] : trailers, typeof drivers === "undefined" ? [] : drivers];
    return waybills.some((item) => item.customerName === customer.customerName) || capacityCollections.some((collection) => collection.some((item) => item.supplierId === customer.customerNo || item.supplierId === customer.legacySupplierId || item.supplierName === customer.customerName));
  }
  function requestDelete(number) {
    const customer = customers.find((item) => item.customerNo === number);
    if (!customer) return;
    deletingNo = number;
    const linked = isCustomerLinked(customer);
    page.querySelector("#deleteCustomerText").textContent = linked
      ? `${customer.customerName} 已被业务单据或三方运力引用，不能删除。可将单位状态调整为停用。`
      : `确认删除 ${customer.customerName} 吗？删除后无法恢复。`;
    page.querySelector("#confirmDeleteCustomerBtn").disabled = linked;
    deleteDialog.showModal();
  }
  function closeDelete() { if (deleteDialog.open) deleteDialog.close(); deletingNo = ""; }

  query.addEventListener("submit", (event) => { event.preventDefault(); currentPage = 1; render(); });
  page.querySelector("#addCustomerBtn").addEventListener("click", () => openForm());
  rows.addEventListener("click", (event) => {
    const view = event.target.closest("[data-customer-view]");
    const edit = event.target.closest("[data-customer-edit]");
    const remove = event.target.closest("[data-customer-delete]");
    if (view) openDetail(view.dataset.customerView);
    else if (edit) openForm(edit.dataset.customerEdit);
    else if (remove) requestDelete(remove.dataset.customerDelete);
  });
  form.addEventListener("input", (event) => {
    if (event.target.name) clearFieldError(event.target.name);
    if (event.target.name === "creditCode") event.target.value = event.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "");
    if (event.target.name === "mobile") event.target.value = event.target.value.replace(/\D/g, "");
  });
  form.addEventListener("change", (event) => { if (event.target.name) clearFieldError(event.target.name); });
  form.elements.businessRole?.addEventListener("change", syncBusinessRoleRequirements);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const next = Object.fromEntries(fields.map((key) => [key, String(values.get(key) || "").trim()]));
    next.creditCode = next.creditCode.toUpperCase();
    if (!validateCustomer(next)) return;
    if (editingNo) {
      const index = customers.findIndex((item) => item.customerNo === editingNo);
      if (index < 0) return;
      customers[index] = normalizeCustomer({ ...customers[index], ...next });
    } else customers.unshift(normalizeCustomer(next));
    saveCustomers();
    currentPage = 1;
    closeForm();
    query.reset();
    render();
  });
  page.querySelector("#closeCustomerFormBtn").addEventListener("click", closeForm);
  page.querySelector("#cancelCustomerFormBtn").addEventListener("click", closeForm);
  page.querySelector("#closeCustomerDetailBtn").addEventListener("click", () => detailDialog.close());
  page.querySelector("#customerDetailCloseBtn").addEventListener("click", () => detailDialog.close());
  page.querySelector("#customerDetailEditBtn").addEventListener("click", () => { detailDialog.close(); openForm(selectedNo); });
  page.querySelector("#cancelDeleteCustomerBtn").addEventListener("click", closeDelete);
  page.querySelector("#confirmDeleteCustomerBtn").addEventListener("click", () => {
    const customer = customers.find((item) => item.customerNo === deletingNo);
    if (!customer || isCustomerLinked(customer)) return;
    customers = customers.filter((item) => item.customerNo !== deletingNo);
    saveCustomers();
    closeDelete();
    render();
  });
  deleteDialog.addEventListener("cancel", (event) => { event.preventDefault(); closeDelete(); });
  sizeSelect.addEventListener("change", () => { currentPage = 1; render(); });
  page.querySelector("#customerPrevPage").addEventListener("click", () => { currentPage -= 1; render(); });
  page.querySelector("#customerNextPage").addEventListener("click", () => { currentPage += 1; render(); });
  jump.addEventListener("change", () => { currentPage = Number(jump.value) || 1; render(); });
  window.addEventListener("storage", (event) => {
    if (event.key === window.AdminDataBridge?.STORAGE_KEY) {
      const snapshot = window.AdminDataBridge.read();
      if (Array.isArray(snapshot?.customers)) {
        customers = snapshot.customers.map(normalizeCustomer);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
      }
    } else if (event.key !== STORAGE_KEY) return;
    customers = loadCustomers();
    refreshWaybillOptions();
    render();
  });
  window.CustomerManager = { render, refreshWaybillOptions, getActiveCustomerByName, hasBusinessRole, getSuppliers: () => customers.filter((item) => item.customerStatus === "启用" && hasBusinessRole(item, ROLE_SUPPLIER)) };
  refreshWaybillOptions();
  render();
})();
