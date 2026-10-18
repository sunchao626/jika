const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const api = require("./plan-task-archive.js");

test("plan task detail exposes a general archive attachment workspace", () => {
  assert.match(html, /id="planArchiveUploadDialog"/);
  assert.match(html, /id="planArchiveFiles"[^>]*multiple/);
  assert.match(html, /id="planArchivePreviewDialog"/);
  assert.match(html, /src="plan-task-archive\.js"/);
  assert.match(app, /PlanTaskArchive\?\.mount\?\.\(group\.id, group\.taskNo, planTaskDetailPageContent\)/);
  assert.match(styles, /\.plan-archive-section/);
  assert.match(styles, /\.plan-archive-preview-body/);
});

test("create and edit forms share transactional archive attachments", () => {
  const source = fs.readFileSync("plan-task-archive.js", "utf8");
  assert.match(html, /id="planTaskFormArchiveSection"/);
  assert.match(html, /id="planTaskFormArchiveFiles"[^>]*multiple/);
  assert.match(html, /id="planTaskFormArchiveCategory"/);
  assert.match(html, /id="planTaskFormArchiveList"/);
  assert.match(app, /PlanTaskArchive\?\.beginForm\?\.\("", ""\)/);
  assert.match(app, /PlanTaskArchive\?\.beginForm\?\.\(group\.id, group\.taskNo\)/);
  assert.match(app, /await window\.PlanTaskArchive\?\.commitForm\?\.\(createdPlanTask\.planTaskId, createdPlanTask\.planTaskNo\)/);
  assert.match(app, /PlanTaskArchive\?\.discardForm\?\.\(\)/);
  assert.match(source, /function beginForm\(/);
  assert.match(source, /function commitForm\(/);
  assert.match(source, /function discardForm\(/);
  assert.match(source, /function applyRecordChanges\(/);
  assert.match(styles, /\.plan-task-form-archive/);
});

test("archive categories cover general business files rather than contracts only", () => {
  for (const category of ["合同资料", "委托资料", "箱货资料", "报关资料", "签收回单", "结算票据", "现场凭证", "其他"]) {
    assert.ok(api.CATEGORIES.includes(category));
  }
  assert.equal(api.previewKind({ name: "运输合同.pdf", type: "application/pdf" }), "pdf");
  assert.equal(api.previewKind({ name: "签收照片.jpg", type: "image/jpeg" }), "image");
  assert.equal(api.previewKind({ name: "委托清单.csv", type: "text/csv" }), "text");
  assert.equal(api.previewKind({ name: "报关资料.zip", type: "application/zip" }), "download");
});

test("archive filtering searches name, category, and uploader", () => {
  const records = [
    { id: "A", name: "运输合同.pdf", category: "合同资料", uploadedBy: "张调度", uploadedAt: "2026-10-18 10:00" },
    { id: "B", name: "签收回单.jpg", category: "签收回单", uploadedBy: "王客服", uploadedAt: "2026-10-18 11:00" },
  ];
  assert.deepEqual(api.filterRecords(records, { category: "合同资料" }).map((item) => item.id), ["A"]);
  assert.deepEqual(api.filterRecords(records, { keyword: "王客服" }).map((item) => item.id), ["B"]);
  assert.equal(api.formatFileSize(2 * 1024 * 1024), "2.0 MB");
});
