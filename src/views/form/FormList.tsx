import { useEffect, useState } from 'react';
import { Form } from '../../model/Form';
import FormsService from './FormsService';
import { useNavigate } from 'react-router-dom';

export function FormList() {
  const formsService = FormsService;

  const navigate = useNavigate();

  const [list, setList] = useState<Form[]>([]);

  async function loadForms() {
    formsService.getForms().then((forms) => {
      setList(forms);
    });
  }

  useEffect(() => {
    loadForms();
    return () => {};
  }, []);

  const formsComponentList = list?.map((form) => (
    <tr key={form.id}>
      <td scope="row">{form.id}</td>
      <td>{form.name}</td>
      <td>{form.description}</td>
      <td>
        <button type="button" onClick={() => navigate(`/form/${form.id}/edit`)}>
          Edit
        </button>
        <button type="button" onClick={() => navigate(`/form/${form.id}/live`)}>
          Use
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <div className="form-list">
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>{formsComponentList}</tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </>
  );
}
