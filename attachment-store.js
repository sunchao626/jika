(function initAttachmentStore(root) {
  const DATABASE_NAME = "container-logistics-attachments-v1";
  const STORE_NAME = "files";

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!root.indexedDB) return reject(new Error("当前浏览器不支持附件持久化。"));
      const request = root.indexedDB.open(DATABASE_NAME, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) database.createObjectStore(STORE_NAME, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("附件数据库打开失败。"));
    });
  }

  async function save(file, id) {
    if (!file) return null;
    const database = await openDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put({ id, name: file.name, type: file.type, size: file.size, blob: file, createdAt: new Date().toISOString() });
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("附件保存失败。"));
    });
    database.close();
    return { id, name: file.name, type: file.type, size: file.size };
  }

  async function get(id) {
    const database = await openDatabase();
    const record = await new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("附件读取失败。"));
    });
    database.close();
    return record;
  }

  async function open(id) {
    const record = await get(id);
    if (!record?.blob) throw new Error("附件不存在或已被清理。");
    const url = URL.createObjectURL(record.blob);
    root.open(url, "_blank", "noopener,noreferrer");
    root.setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  root.AttachmentStore = { save, get, open };
})(typeof window !== "undefined" ? window : globalThis);
