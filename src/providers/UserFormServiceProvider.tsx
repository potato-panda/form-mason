import { createContext, FC, ReactNode, useState } from 'react';
import { TransactionFactory } from '../utils/indexedDB/TransactionFactory';
import { Form } from '../model/Form';
import { LoggerFactory } from '../utils/logger/LoggerFactory';

type ContextState = {
  addForm: (form: Form) => Promise<IDBValidKey>;
  getForm: (id: string) => Promise<Form>;
  getForms: (options?: { page?: number; pageSize?: number }) => Promise<Form[]>;
  putForm: (form: Form) => Promise<IDBValidKey>;
  deleteForm: (id: string) => Promise<boolean>;
};

export const Context = createContext<ContextState | null>(null);

export const UserFormServiceProvider: FC<{ children: ReactNode }> = (props) => {
  const [logger] = useState(LoggerFactory.create('UserFormServiceProvider'));
  const rTx = () => TransactionFactory.create('rTx', 'forms', 'readonly');
  const rwTx = () => TransactionFactory.create('rwTx', 'forms', 'readwrite');

  const addForm: ContextState['addForm'] = async (form: Form) => {
    return new Promise(async (resolve, reject) => {
      const tx = await rwTx();
      const request = tx.objectStore('forms').add(form);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getForm: ContextState['getForm'] = async (id: string) => {
    return new Promise<Form>(async (resolve, reject) => {
      const tx = await rTx();
      const request = tx.objectStore('forms').get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getForms: ContextState['getForms'] = async (
    { page = 1, pageSize = 10 } = {
      page: 1,
      pageSize: 10,
    }
  ) => {
    return new Promise(async (resolve, reject) => {
      const tx = await rTx();
      const request = tx.objectStore('forms').openCursor();
      const pages: Form[] = [];
      request.onsuccess = () => {
        const { result: cursor } = request;
        if (page > 1) cursor?.advance((page - 1) * pageSize);
        while (cursor) {
          pages.push(cursor.value);
          if (pages.length >= pageSize) break;
        }
        resolve(pages);
      };
      request.onerror = () => {
        logger.error(request.error);
        reject(request.error);
      };
    });
  };

  const putForm: ContextState['putForm'] = async (form: Form) => {
    return new Promise(async (resolve, reject) => {
      const tx = await rwTx();
      const request = tx.objectStore('forms').put(form, form.id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        logger.error(request.error);
        reject(request.error);
      };
    });
  };

  const deleteForm: ContextState['deleteForm'] = async (id: string) => {
    return new Promise(async (resolve, reject) => {
      const tx = await rwTx();
      const request = tx.objectStore('forms').delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        logger.error(request.error);
        reject(request.error);
      };
    });
  };

  return (
    <Context.Provider
      value={{
        addForm,
        getForm,
        getForms,
        putForm,
        deleteForm,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
