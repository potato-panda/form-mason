import { createContext, FC, ReactNode, useReducer } from 'react';
import { Form } from '../model/form';

type ContextState = {
  forms: Form[];
  setForms: (dispatch: {
    type: 'add' | 'update' | 'delete';
    form: Form;
  }) => void;
  findForm: (name: string) => Form | null;
};

export const Context = createContext<ContextState | null>(null);

export const UserFormServiceProvider: FC<{ children: ReactNode }> = (
  props
) => {

  // TODO: persist forms locally and offline with IndexedDB

  const [forms, setForms] = useReducer(
    (
      _state: Form[],
      {
        type,
        form,
      }: {
        type: 'add' | 'update' | 'delete';
        form: Form;
      }
    ) => {
      const state = structuredClone(_state);
      switch (type) {
        case 'add':
          return [...state, form];
        case 'update':
          return [...state.map((f) => (f.name === form.name ? form : f))];
        case 'delete':
          return [...state.filter((f) => f.name !== form.name)];
        default:
          return state;
      }
    },
    []
  );

  const findForm = (name: string) => {
    return structuredClone(forms.find((form) => form.name === name)) || null;
  };

  return (
    <Context.Provider value={{ forms, setForms, findForm }}>
      {props.children}
    </Context.Provider>
  );
};
