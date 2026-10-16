const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const CapacityOwnership = require("./capacity-ownership.js");

const source = fs.readFileSync("app.js", "utf8");
const start = source.indexOf("function renderDriverDetail(");
const end = source.indexOf("function renderDriverPagination(", start);
assert.ok(start >= 0 && end > start, "driver detail renderer must exist");

const nodes = new Map();
const node = (selector) => {
  if (!nodes.has(selector)) nodes.set(selector, { innerHTML: "", textContent: "", className: "" });
  return nodes.get(selector);
};
const context = vm.createContext({
  CapacityOwnership,
  document: { querySelector: node },
  getCertificationInfo: () => ({ label: "已认证", className: "verified" }),
  getDriverStateClass: () => "transporting-state",
  businessText: (value, fallback = "未维护") => {
    const text = String(value ?? "").trim();
    return text && !["undefined", "null", "nan"].includes(text.toLowerCase()) ? text : fallback;
  },
  businessCell: (value, fallback = "未维护") => {
    const text = String(value ?? "").trim();
    return text && !["undefined", "null", "nan"].includes(text.toLowerCase()) ? text : fallback;
  },
});
vm.runInContext(source.slice(start, end), context);

context.renderDriverDetail({
  name: "王海", gender: "男", idCard: "330206198805182418", phone: "13800008881", address: "宁波市北仑区",
  emergencyContact: "王静", emergencyPhone: "13700001126", entryDate: "2021-03-15", driverType: "自有司机",
  driverState: "运输中", fleet: "宁波一队", certificationStatus: "verified", licenseNo: "DL-1001", licenseClass: "A2",
  licenseIssueDate: "2014-05-18", licenseExpiry: "2027-05-18", licenseAttachment: "驾驶证扫描件",
  qualificationNo: "Q-1001", qualificationExpiry: "2026-10-08", qualificationAttachment: "资格证照片",
  bankCard: "6222020200008812", bankName: "中国工商银行", remark: "档案完整",
});

const detail = node("#driverDetailBase").innerHTML;
assert.equal((detail.match(/class="vehicle-info-section"/g) || []).length, 4);
assert.equal((detail.match(/class="driver-detail-column"/g) || []).length, 2);
assert.match(detail, /aria-label="个人资料与其他信息"[\s\S]*基础资料[\s\S]*其他信息/);
assert.match(detail, /aria-label="证件信息"[\s\S]*驾驶证[\s\S]*道路运输从业资格证/);
for (const text of ["基础资料", "身份证号码", "驾驶证号", "道路运输从业资格证", "资格证号", "开户银行", "档案完整"]) assert.match(detail, new RegExp(text));
assert.equal(node("#detailDriverTitle").textContent, "王海");
assert.equal(node("#detailDriverPhone").textContent, "13800008881");
context.renderDriverDetail({ name: "测试司机", certificationStatus: "unverified", phone: undefined, bankName: "undefined" });
assert.doesNotMatch(node("#driverDetailBase").innerHTML, /undefined/i);
assert.doesNotMatch(node("#detailDriverMeta").textContent, /undefined/i);
assert.doesNotMatch(node("#detailDriverPhone").textContent, /undefined/i);
assert.match(source, /driverDetailPanel\.classList\.add\("open"\);\s*renderDriverDetail\(driver\);\s*window\.scrollTo\(\{ top: 0/);
assert.doesNotMatch(source.slice(source.indexOf("function openDriverDetail("), source.indexOf("function closeDriverDetail(")), /scrollIntoView/);

console.log("Driver detail rendering test passed");
