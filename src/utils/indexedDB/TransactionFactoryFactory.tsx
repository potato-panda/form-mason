import LoggerFactory from '../logger/LoggerFactory';
import initDb from './initDb';

type TransactionFactoryFactoryParameters = [
  name: string,
  ...Parameters<IDBDatabase['transaction']>,
];

type TransactionFactory = {
  create: () => IDBTransaction;
};

export default class TransactionFactoryFactory {
  static async createFactory(
    ...[name, storeNames, mode, options]: TransactionFactoryFactoryParameters
  ): Promise<TransactionFactory> {
    const logger = LoggerFactory.create(name);
    const db = initDb;
    return {
      create: () => {
        const tx = db.transaction(storeNames, mode, options);
        tx.onabort = (_event) => {
          logger.info(`Transaction aborted`);
        };
        tx.onerror = (_event) => {
          logger.error(`Transaction errored: ${tx.error}`);
        };
        tx.oncomplete = (_event) => {
          logger.ok(`Transaction completed`);
        };
        return tx;
      },
    };
  }
}
