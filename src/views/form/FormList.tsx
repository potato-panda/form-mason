import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paginator } from '../../components/paginator/Paginator';
import { Form } from '../../model/Form';
import FormsService from './FormsService';
import { Context } from '../../layouts/Tabs';

export function FormList() {
  const formsService = FormsService;

  const navigate = useNavigate();
  const tabs = useContext(Context);

  const [page, setPage] = useState<number>(1);
  const [pageSize, _setPageSize] = useState<number>(10);
  const [forms, setForms] = useState<Form[]>([]);
  const [paginator, setPaginator] = useState<{
    total: number;
  }>({
    total: 0,
  });

  async function loadForms({
    page,
    pageSize,
  }: {
    page?: number;
    pageSize?: number;
  } = {}) {
    formsService
      .getForms({
        page,
        pageSize,
      })
      .then((result) => {
        setForms(result.result);
        setPaginator({
          total: result.total,
        });
      });
  }

  useEffect(() => {
    loadForms();
    return () => {};
  }, []);

  function changePage(page: number) {
    setPage(page);
    loadForms({ page, pageSize });
  }

  const formsComponentList = forms?.map((form) => {
    const onClick = (path: string, prefix?: string) => {
      const tab = tabs.openTab(
        path,
        `${prefix ? prefix + ' .. ' : ''}${form.name}`
      );

      navigate(path, {
        state: {
          key: tab.key,
        },
      });
    };

    return (
      <tr key={form.id}>
        <th scope="row" style={{ minWidth: '40px' }}>{form.id}</th>
        <td>{form.name}</td>
        <td>{form.description}</td>
        <td>
          <button
            type="button"
            onClick={() => onClick(`/form/${form.id}/edit`, 'Edit')}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onClick(`/form/${form.id}/live`, 'Prod')}
          >
            Use
          </button>
        </td>
      </tr>
    );
  });

  return (
    <>
      <div className='padded'>
        <Paginator
          changePage={changePage}
          totalItems={paginator.total}
          page={page}
          pageSize={pageSize}
          totalPages={Math.ceil(paginator.total / pageSize)}
        >
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
        </Paginator>
      </div>
    </>
  );
}
