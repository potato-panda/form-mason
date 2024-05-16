import TransactionFactoryFactory from '../../db/TransactionFactoryFactory';
import LoggerFactory from '../../logger/LoggerFactory';
import { Form } from '../../model/Form';

type PaginatedSearchOptions = {
  query?: string;
  page?: number;
  pageSize?: number;
};

type SearchResult = {
  total: number;
  result: Form[];
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

  // TODO add query
  async getForms(
    { page = 1, pageSize = 10 }: PaginatedSearchOptions = {
      page: 1,
      pageSize: 10,
    }
  ): Promise<SearchResult> {
    return new Promise(async (resolve, reject) => {
      const txFactory = this.readOnlyTransactionFactory;
      const tx = txFactory.transaction();
      const os = tx.objectStore('forms');
      const total = await new Promise<number>((resolve) => {
        const countRequest = os.count();
        countRequest.onsuccess = () => {
          const count = countRequest.result;
          resolve(count);
        };
      });
      const keyRange = IDBKeyRange.bound(
        (page - 1) * pageSize,
        page * pageSize,
        true,
        false
      );
      const result = await new Promise<Form[]>((resolve) => {
        const request = os.openCursor(keyRange);
        const forms: Form[] = [];
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            forms.push(cursor.value);
            return cursor.continue();
          }
          resolve(forms);
        };
        request.onerror = () => {
          this.logger.error(request.error);
          reject(request.error);
        };
      });

      resolve({ result, total });
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
