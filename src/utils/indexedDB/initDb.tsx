const prod = process.env.NODE_ENV === 'production';

const initDb = new Promise<IDBDatabase>((resolve, reject) => {
  // There's a possible race condition where the database is not ready yet.

  const request = window.indexedDB.open('form-mason', 1);

  request.onsuccess = () => {
    !prod && console.log(`IndexedDB opened`);
    resolve(request.result);
  };

  request.onupgradeneeded = (event) => {
    const db = request.result;

    switch (event.oldVersion) {
      case 0:
        db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
        if (!prod) {
          db.createObjectStore('logs', { autoIncrement: true });
          console.log(`Object stores created`);
        }
        break;
      default:
        break;
    }
    !prod && console.log(`IndexedDB upgraded`);
    resolve(db);
  };

  request.onerror = () => {
    !prod &&
      console.log(
        `Error opening IndexedDB: ${request.error?.message || 'Unknown error'}`
      );
    reject(request.error);
  };

  request.onblocked = (event) => {
    !prod &&
      console.log(
        `IndexedDB was blocked. Old version: ${event.oldVersion}; New version: ${event.newVersion}`
      );
    reject();
  };
});

export default await initDb;
