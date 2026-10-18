(function () {
  const STORAGE_KEY = "container-logistics-dispatches-v1";
  const PHOTO_DATABASE = `${STORAGE_KEY}-photos`;
  const PHOTO_STORE = "photos";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load(seed = []) {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(stored)) return stored;
    } catch (error) {
      console.warn("派单数据读取失败，将使用演示数据。", error);
    }
    const initial = clone(seed);
    if (initial.length) save(initial);
    return initial;
  }

  function save(dispatches) {
    const data = clone(dispatches);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("dispatches-updated", { detail: data }));
  }

  function openPhotoDatabase() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("当前浏览器不支持本地图片存储"));
        return;
      }
      const request = window.indexedDB.open(PHOTO_DATABASE, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(PHOTO_STORE, { keyPath: "id" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("图片存储初始化失败"));
    });
  }

  async function savePhotos(photos) {
    if (!photos.length) return;
    const database = await openPhotoDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(PHOTO_STORE, "readwrite");
      const store = transaction.objectStore(PHOTO_STORE);
      photos.forEach(({ id, blob }) => store.put({ id, blob }));
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("图片保存失败"));
      transaction.onabort = () => reject(transaction.error || new Error("图片保存已取消"));
    }).finally(() => database.close());
  }

  async function getPhoto(id) {
    const database = await openPhotoDatabase();
    try {
      return await new Promise((resolve, reject) => {
        const request = database.transaction(PHOTO_STORE, "readonly").objectStore(PHOTO_STORE).get(id);
        request.onsuccess = () => resolve(request.result?.blob || null);
        request.onerror = () => reject(request.error || new Error("图片读取失败"));
      });
    } finally {
      database.close();
    }
  }

  async function deletePhotos(ids) {
    const normalizedIds = [...new Set((ids || []).filter(Boolean))];
    if (!normalizedIds.length) return;
    const database = await openPhotoDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(PHOTO_STORE, "readwrite");
      const store = transaction.objectStore(PHOTO_STORE);
      normalizedIds.forEach((id) => store.delete(id));
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("图片删除失败"));
      transaction.onabort = () => reject(transaction.error || new Error("图片删除已取消"));
    }).finally(() => database.close());
  }

  function replace(target, source) {
    target.splice(0, target.length, ...clone(source));
    return target;
  }

  function nowText() {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  window.DispatchStore = { STORAGE_KEY, load, save, replace, nowText, savePhotos, getPhoto, deletePhotos };
})();
