const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");
const customerMarkup = html.slice(html.indexOf('id="customerPage"'), html.indexOf('id="vehiclePage"'));
assert.match(customerMarkup, /id="customerFormView" hidden/);
assert.doesNotMatch(customerMarkup, /id="customerFormDialog"/);
assert.match(customerMarkup, /建档提示/);
assert.match(customerMarkup, /name="businessRole"/);
assert.match(customerMarkup, /客户\+三方供应商/);
assert.doesNotMatch(html, /id="thirdPartySupplierPage"|data-page="third-party-suppliers"|id="thirdPartySupplierForm"/);
for (const name of ["customerName", "businessRole", "customerType", "creditCode", "customerStatus", "contactName", "mobile", "loadAddress", "unloadAddress", "settlementCycle"]) {
  assert.match(customerMarkup, new RegExp(`name="${name}"[^>]*required|required[^>]*name="${name}"`), `${name} should be required`);
  assert.match(customerMarkup, new RegExp(`data-error-for="${name}"`), `${name} should have inline feedback`);
}
assert.match(customerMarkup, /name="customerNo" readonly/);
assert.doesNotMatch(customerMarkup, /name="customerNo"[^>]*required/);
for (const type of ["国际货运代理（货代）", "船公司 \/ 船代", "第三方物流 \/ 供应链公司", "跨境电商物流商", "维修厂"]) assert.ok(customerMarkup.includes(type), `缺少客户类型 ${type}`);

function element() {
  return {
    innerHTML: "", textContent: "", value: "", disabled: false, open: false, hidden: false, listeners: {}, dataset: {}, attributes: {},
    addEventListener(type, handler) { this.listeners[type] = handler; },
    showModal() { this.open = true; }, close() { this.open = false; },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    focus() { this.focused = true; },
    scrollIntoView() { this.scrolled = true; },
    closest() { return { classList: { add() {}, remove() {}, toggle() {} } }; },
  };
}
const nodes = new Map();
const find = (selector) => {
  if (!nodes.has(selector)) nodes.set(selector, element());
  return nodes.get(selector);
};
const page = element();
page.querySelector = find;
const query = find("#customerQueryForm");
query.values = { customerNo: "", customerName: "", businessRole: "", customerType: "", customerStatus: "" };
query.reset = () => { Object.keys(query.values).forEach((key) => { query.values[key] = ""; }); };
const form = find("#customerForm");
const keys = ["customerNo", "customerName", "shortName", "businessRole", "customerType", "creditCode", "customerStatus", "contactName", "mobile", "phone", "email", "registeredAddress", "loadAddress", "unloadAddress", "settlementCycle", "invoiceTitle", "taxNo", "bankName", "bankAccount", "remark"];
form.elements = Object.fromEntries(keys.map((key) => [key, element()]));
form.elements.customerStatus.value = "启用";
form.elements.businessRole.value = "客户";
form.querySelector = (selector) => find(selector);
form.reset = () => keys.forEach((key) => { form.elements[key].value = key === "customerStatus" ? "启用" : key === "businessRole" ? "客户" : ""; });
find("#customerPageSize").value = "5";
const storage = new Map();
const context = vm.createContext({
  window: { addEventListener() {}, scrollTo() {} },
  document: { querySelector: (selector) => selector === "#customerPage" ? page : find(selector) },
  localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  FormData: class { constructor(target) { this.target = target; } get(key) { return this.target === form ? form.elements[key]?.value : query.values[key]; } },
  waybills: [{ customerName: "宁波远海供应链有限公司" }], console,
});
vm.runInContext(fs.readFileSync("customer.js", "utf8"), context);

assert.equal(context.window.CustomerManager.getActiveCustomerByName("宁波远海供应链有限公司").loadAddress, "宁波北仑港区二期");
assert.equal(context.window.CustomerManager.getActiveCustomerByName("上海港联贸易有限公司"), null);
assert.equal(context.window.CustomerManager.getActiveCustomerByName("未知客户"), null);
assert.match(find("#customerBody").innerHTML, /KH-1008/);
assert.match(find("#customerBody").innerHTML, /customer-type-badge/);
assert.match(find("#customerBody").innerHTML, /第三方物流 \/ 供应链公司/);
assert.doesNotMatch(find("#customerBody").innerHTML, /KH-1120/);
assert.match(find("#customerOptions").innerHTML, /宁波远海供应链有限公司/);
assert.doesNotMatch(find("#customerOptions").innerHTML, /上海港联贸易有限公司/);
assert.doesNotMatch(find("#customerOptions").innerHTML, /宁波安达汽车维修有限公司/);
assert.equal(context.window.CustomerManager.getRepairShops()[0].customerNo, "KH-1201");
assert.equal(context.window.CustomerManager.getRepairShops()[0].customerType, "维修厂");
find("#customerNextPage").listeners.click();
assert.match(find("#customerBody").innerHTML, /KH-1120/);
query.values.customerName = "海盛";
query.listeners.submit({ preventDefault() {} });
assert.match(find("#customerBody").innerHTML, /宁波海盛/);

find("#customerBody").listeners.click({ target: { closest: (selector) => selector === "[data-customer-view]" ? { dataset: { customerView: "KH-1102" } } : null } });
assert.match(find("#customerDetailBody").innerHTML, /基础信息/);
assert.match(find("#customerDetailBody").innerHTML, /联系信息/);
assert.match(find("#customerDetailBody").innerHTML, /地址信息/);
assert.match(find("#customerDetailBody").innerHTML, /结算信息/);
find("#customerDetailEditBtn").listeners.click();
assert.equal(find("#customerFormView").hidden, false);
assert.equal(find("#customerListView").hidden, true);
form.elements.shortName.value = "海盛物流";
form.listeners.submit({ preventDefault() {} });
assert.match(find("#customerBody").innerHTML, /海盛物流/);
assert.equal(find("#customerFormView").hidden, true);
assert.equal(find("#customerListView").hidden, false);

find("#addCustomerBtn").listeners.click();
assert.equal(form.elements.customerNo.value, "KH-1202");
form.listeners.submit({ preventDefault() {} });
assert.equal(find('[data-error-for="customerName"]').textContent, "请输入单位全称");
assert.equal(form.elements.customerName.focused, true);
form.elements.customerNo.value = "KH-1008";
form.elements.customerName.value = "重复客户";
form.listeners.submit({ preventDefault() {} });
assert.equal(find('[data-error-for="customerNo"]').textContent, "客户编号已存在，请更换后重试");
form.elements.customerNo.value = "KH-1202";
form.elements.customerName.value = "新增客户有限公司";
form.elements.customerType.value = "第三方物流 / 供应链公司";
form.elements.creditCode.value = "91330206MA28T2001K";
form.elements.customerStatus.value = "启用";
form.elements.contactName.value = "张经理";
form.elements.mobile.value = "13800002001";
form.elements.loadAddress.value = "宁波港区";
form.elements.unloadAddress.value = "宁波物流园";
form.elements.settlementCycle.value = "月结30天";
form.listeners.submit({ preventDefault() {} });
assert.match(find("#customerBody").innerHTML, /KH-1202/);
assert.match(find("#customerOptions").innerHTML, /新增客户有限公司/);

find("#customerBody").listeners.click({ target: { closest: (selector) => selector === "[data-customer-delete]" ? { dataset: { customerDelete: "KH-1008" } } : null } });
assert.equal(find("#confirmDeleteCustomerBtn").disabled, true);
find("#confirmDeleteCustomerBtn").listeners.click();
assert.match(storage.get("container-logistics-customers-v1"), /宁波远海供应链有限公司/);
find("#cancelDeleteCustomerBtn").listeners.click();

find("#customerBody").listeners.click({ target: { closest: (selector) => selector === "[data-customer-delete]" ? { dataset: { customerDelete: "KH-1202" } } : null } });
assert.equal(find("#confirmDeleteCustomerBtn").disabled, false);
find("#confirmDeleteCustomerBtn").listeners.click();
assert.doesNotMatch(find("#customerOptions").innerHTML, /新增客户有限公司/);

find("#addCustomerBtn").listeners.click();
form.elements.businessRole.value = "三方供应商";
form.elements.customerName.value = "宁波统一外协车队";
form.elements.customerStatus.value = "启用";
form.listeners.submit({ preventDefault() {} });
assert.match(find("#customerBody").innerHTML, /宁波统一外协车队/);
assert.doesNotMatch(find("#customerOptions").innerHTML, /宁波统一外协车队/);
assert.match(storage.get("container-logistics-customers-v1"), /"businessRole":"三方供应商"/);
console.log("Customer management interaction test passed");
