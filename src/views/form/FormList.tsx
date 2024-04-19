import { useEffect, useState } from 'react';
import { UserFormDataService } from '../../services/UserFormDataService';
import { Form } from '../../model/Form';

export const FormList = () => {
  const formsService = UserFormDataService();

  const [list, setList] = useState<Form[]>([]);

  async function loadForms() {
    formsService.getForms().then((forms) => {
      setList(forms);
    });
  }

  useEffect(() => {
    loadForms();
    return () => {
    };
  }, []);

  const formsComponentList = list?.map((form) => (
    <div key={form.id}>{form.name}</div>
  ));

  return (
    <>
      <div>FormList</div>
      <div>{formsComponentList}</div>
    </>
  );
};
