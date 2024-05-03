import TransactionFactoryFactory from '../../db/TransactionFactoryFactory';
import LoggerFactory from '../../logger/LoggerFactory';
import { Form } from '../../model/Form';

type PaginatedSearchOptions = {
  query?: string;
  page?: number;
  pageSize?: number;
};

class FormsService {
  name = 'FormsService';
  logger = LoggerFactory.create(this.name);
  readOnlyTransactionFactory = TransactionFactoryFactory.createFactory(
    `ReadOnly|${this.name}`,
    'forms',
    'readonly'
  );
  readWriteTransactionFactory = TransactionFactoryFactory.createFactory(
    `ReadWrite|${this.name}`,
    'forms',
    'readwrite'
  );

  async addForm(form: Form): Promise<IDBValidKey> {
    return new Promise(async (resolve, reject) => {
      const txFactory = this.readWriteTransactionFactory;
      const tx = txFactory.transaction();
      const request = tx.objectStore('forms').add(form);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getForm(id: number): Promise<Form> {
    return new Promise<Form>(async (resolve, reject) => {
      const txFactory = this.readOnlyTransactionFactory;
      const tx = txFactory.transaction();
      const request = tx.objectStore('forms').get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getForms(
    { query, page = 1, pageSize = 10 }: PaginatedSearchOptions = {
      page: 1,
      pageSize: 10,
    }
  ): Promise<Form[]> {
    return new Promise(async (resolve, reject) => {
      const txFactory = this.readOnlyTransactionFactory;
      const tx = txFactory.transaction();
      const os = tx.objectStore('forms');
      const request = os.openCursor(
        IDBKeyRange.bound((page - 1) * pageSize, page * pageSize, true, false)
      );
      const pages: Form[] = [];
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          pages.push(cursor.value);
          return cursor.continue();
        }
        resolve(pages);
      };
      request.onerror = () => {
        this.logger.error(request.error);
        reject(request.error);
      };
    });
  }

  async putForm(form: Form): Promise<IDBValidKey> {
    return new Promise(async (resolve, reject) => {
      const txFactory = this.readWriteTransactionFactory;
      const tx = txFactory.transaction();
      const request = tx.objectStore('forms').put(form, form.id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        this.logger.error(request.error);
        reject(request.error);
      };
    });
  }

  async deleteForm(id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const txFactory = this.readWriteTransactionFactory;
      const tx = txFactory.transaction();
      const request = tx.objectStore('forms').delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        this.logger.error(request.error);
        reject(request.error);
      };
    });
  }
}

export default new FormsService();
