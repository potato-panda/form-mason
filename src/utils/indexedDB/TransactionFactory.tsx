import { LoggerFactory } from '../logger/LoggerFactory';
import { initDb } from './initDb';

type TransactionFactoryParameters = [
  name: string,
  ...Parameters<IDBDatabase['transaction']>,
];

export class TransactionFactory {
  static async create(
    ...[name, storeNames, mode, options]: TransactionFactoryParameters
  ): Promise<IDBTransaction> {
    const logger = LoggerFactory.create(name);
    const db = await initDb;
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
  }
}
