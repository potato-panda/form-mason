import { LoggerFactory } from '../logger/LoggerFactory';

export const initDb = new Promise<IDBDatabase>((resolve, reject) => {
  const logger = LoggerFactory.create('indexedDB');

  const request = indexedDB.open('form-mason');

  request.onsuccess = () => {
    resolve(request.result);
  };

  request.onupgradeneeded = (event) => {
    const db = request.result;

    switch (event.oldVersion) {
      case 0:
        db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
        logger.info(`Database 'forms' created`);
        break;
      default:
        break;
    }

    resolve(db);
  };

  request.onerror = () => {
    logger.error(
      `Error opening IndexedDB: ${request.error?.message || 'Unknown error'}`
    );
    reject();
  };

  request.onblocked = (event) => {
    logger.info(
      `IndexedDB was blocked. Old version: ${event.oldVersion}; New version: ${event.newVersion}`
    );
    reject();
  };
});
