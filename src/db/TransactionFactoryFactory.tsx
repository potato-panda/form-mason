import LoggerFactory from '../logger/LoggerFactory';
import db from './db';

type TransactionFactoryFactoryParameters = [
  name: string,
  ...Parameters<IDBDatabase['transaction']>,
];

type TransactionFactory = {
  transaction: () => IDBTransaction;
};

export default class TransactionFactoryFactory {
  static createFactory(
    ...[name, storeNames, mode, options]: TransactionFactoryFactoryParameters
  ): TransactionFactory {
    const logger = LoggerFactory.create(name);
    return {
      transaction: () => {
        const tx = db.transaction(storeNames, mode, options);
        tx.onabort = (_event) => {
          logger.info(`Transaction aborted`);
        };
        tx.onerror = (_event) => {
          logger.error(`Transaction error: ${tx.error?.message}`);
        };
        tx.oncomplete = (_event) => {
          logger.ok(`Transaction completed`);
        };
        return tx;
      },
    };
  }
}
