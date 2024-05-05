const prod = process.env.NODE_ENV === 'production';

const initdb = new Promise<IDBDatabase>((resolve, reject) => {
  const request = window.indexedDB.open('form-mason', 1);

  request.onsuccess = () => {
    !prod && console.log(`IndexedDB opened`);
    resolve(request.result);
  };

  request.onupgradeneeded = (event) => {
    const db = request.result;

    switch (event.oldVersion) {
      case 0:
        const os = db.createObjectStore('forms', {
          keyPath: 'id',
          autoIncrement: true,
        });
        os.createIndex('name', 'name', { unique: true });
        os.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        os.createIndex('nameOrTags', ['name', 'tags'], {
          unique: false,
        });
        if (!prod) {
          db.createObjectStore('logs', { autoIncrement: true });
          console.log(`Object stores created`);
        }
        break;
      default:
        break;
    }
    !prod && console.log(`IndexedDB upgraded`);
    resolveDb(db);
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

  function resolveDb(db: IDBDatabase) {
    db.onabort = () => {
      !prod && console.log(`IndexedDB was aborted`);
      reject();
    };
    db.onclose = () => {
      !prod && console.log(`IndexedDB was closed`);
      resolve(initdb);
    };
    db.onversionchange = (event) => {
      db.close();
      !prod && console.log(`IndexedDB version changed to ${event.newVersion}`);
      resolve(initdb);
    };
  }
});

export default await initdb;
