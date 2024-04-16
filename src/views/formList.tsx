import { UserFormDataService } from '../services/userFormDataService';

export const FormList = () => {
  const formsService = UserFormDataService();

  const formsComponentList = formsService.forms.map((form) => (
    <div key={form.name}>{form.name}</div>
  ));

  return (
    <>
      <div>FormList</div>
      <div>{formsComponentList}</div>
    </>
  );
};
