import {
  ChangeEvent,
  ReactNode,
  createElement,
  useState,
} from 'react';
import {
  LoaderFunction,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import StatefulStyledInput from '../../components/inputs/StatefulStyledInput';
import { Modal } from '../../components/modals/Modal';
import { Toaster } from '../../components/toaster/Toaster';
import TransactionFactoryFactory from '../../db/TransactionFactoryFactory';
import { Form } from '../../model/Form';
import { FormElement } from '../../model/FormElement';
import Unicode from '../../utils/Unicode';
import { FormUtils } from '../../utils/forms/FormUtils';
import FormElementAdder from './FormElementAdder';
import FormsService from './FormsService';
import './formEditor.css';

export default function FormEditor() {
  const original = (useLoaderData() as Form) ?? FormUtils.create();
  const [form, setForm] = useState<Form>(original);
  const [categorySelection, setCategorySelection] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<ReactNode>(null);

  const navigate = useNavigate();

  const readWriteTransactionFactory = TransactionFactoryFactory.createFactory(
    'ReadWrite|FormEditor',
    'forms',
    'readwrite'
  );

  const addFormElementModal = Modal({
    content: ({ closeModal }): ReactNode => (
      <>
        <div className="modal-header">
          <h4>Add Field</h4>
          <button type="button" onClick={closeModal}>
            &#10006;
          </button>
        </div>
        <div className="modal-body">
          <FormElementAdder
            form={form}
            addFormElement={addFormElement}
          ></FormElementAdder>
        </div>
      </>
    ),
    closeModal: () => closeModals(),
  });

  function setFormName(name: string): void {
    setForm({ ...form, name });
  }

  function addFormElement(element: FormElement): void {
    setForm({ ...form, fields: [...form.fields, element] });
    closeModals();
  }

  function deleteFormElement(element: FormElement): void {
    setForm({
      ...form,
      fields: [...form.fields.filter((el: FormElement) => el !== element)],
    });
  }

  function addCategoryOption(category: string): void {
    if (form.fieldCategories.some((i) => i.name === category)) return;
    setForm({
      ...form,
      fieldCategories: [
        ...form.fieldCategories,
        {
          name: category,
        },
      ],
    });
  }

  function openAddFormItemModal(): void {
    setActiveModal(addFormElementModal);
  }

  function closeModals(): void {
    setActiveModal(null);
  }

  function onCategorySelectionOptionsChange(
    e: ChangeEvent<HTMLSelectElement>
  ): void {
    const options = e.target.options;
    const values = [];

    for (const i in options) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setCategorySelection(values);
  }

  function deleteCategorySelectionOption(): void {
    setForm({
      ...form,
      fieldCategories: (form?.fieldCategories ?? []).filter(
        (i) => !categorySelection.includes(i.name)
      ),
    });
  }

  function isFormValid(): boolean {
    const isValid =
      typeof form.name === 'string' && form.name.trim().length > 0;
    return isValid;
  }

  async function saveForm(close?: boolean): Promise<void> {
    if (!isFormValid()) return;
    const tx = readWriteTransactionFactory.transaction();
    const os = tx.objectStore('forms');
    const request = original.id ? os.put(form) : os.add(form);
    request.onsuccess = () => {
      Toaster.makeToast({
        header: 'Success',
        message: `Form ${original.id ? 'updated' : 'saved'}`,
        type: 'ok',
        timeout: 8000,
      });
      if (close) navigate('/');
      return;
    };
    request.onerror = () => {
      Toaster.makeToast({
        header: 'Error',
        message: `Form ${original.id ? 'update' : 'save'} failed: ${
          request.error ?? 'Unknown Error'
        }`,
        type: 'error',
      });
      return request.error;
    };
  }

  return (
    <>
      <div className="form-editor">
        <StatefulStyledInput
          name="name"
          id="name"
          value={form.name}
          placeholder="Form Name"
          setValue={setFormName}
        />
        <div className="flex row">
          <button type="button" onClick={(_) => saveForm()}>
            Save
          </button>
          <button type="button" onClick={(_) => saveForm(true)}>
            Save and Close
          </button>
        </div>
        <div className="form-options">
          <div className="">Form Options</div>
          <div className="form-options-row">
            <div className="form-group">
              <fieldset>
                <legend>Field Categories</legend>
                <label htmlFor="category" className="form-label"></label>
                <select
                  name="category"
                  id="category"
                  className="form-control"
                  style={{ width: '100%' }}
                  onChange={onCategorySelectionOptionsChange}
                  value={categorySelection}
                  multiple
                  size={4}
                >
                  <option key={'category-opt--1'}>Uncategorized</option>
                  {form?.fieldCategories?.map((category, i) => (
                    <option key={`category-opt-${i}`}>{category.name}</option>
                  ))}
                </select>
                <div className="flex">
                  {createElement(() => {
                    const [category, setCategory] = useState('');
                    return (
                      <>
                        <input
                          type="text"
                          className="form-control"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => addCategoryOption(category)}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={deleteCategorySelectionOption}
                          disabled={
                            categorySelection.length === 0 ||
                            !categorySelection ||
                            (categorySelection[0] === 'Uncategorized' &&
                              !(categorySelection.length > 1))
                          }
                        >
                          Delete
                        </button>
                      </>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <hr />

        <div>
          <button type="button" onClick={openAddFormItemModal}>
            Add Field
          </button>
        </div>

        <div id="form-editor" className="form-editor">
          {
            <>
              <table className="form-editor-table">
                <thead>
                  <tr>
                    <th scope="col">Field Name</th>
                    <th scope="col">Label</th>
                    <th scope="col">Category</th>
                    <th scope="col">Type</th>
                    <th scope="col">Field Options</th>
                    <th scope="col">Options Values</th>
                    <th scope="col">Default Value</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {form?.fields?.length > 0 ? (
                    form?.fields?.sort()?.map((f, i) => (
                      <tr key={i}>
                        <td>{f.name}</td>
                        <td>{f.label}</td>
                        <td>{f.category || 'Uncategorized'}</td>
                        <td>{f.type}</td>
                        <td>
                          {createElement(() => {
                            const options = [];
                            if (f.required) {
                              options.push({
                                key: 'Required',
                                value: Unicode.checkmark,
                              });
                            }
                            options.push({
                              key: 'Copy',
                              value: f.copyBehaviour
                                ? f.copyBehaviour
                                  ? 'Standalone'
                                  : 'Included'
                                : 'Omitted',
                            });
                            switch (f.type) {
                              case 'select':
                                options.push({
                                  key: 'Multi Select',
                                  value: f.multi ? 'Yes' : 'No',
                                });
                                break;
                              default:
                                break;
                            }
                            return (
                              <>
                                {options.map((o) => (
                                  <div key={o.key}>
                                    {o.key}: {o.value}
                                  </div>
                                ))}
                              </>
                            );
                          })}
                        </td>
                        <td>
                          {f.type === 'radio' || f.type === 'select' ? (
                            f.optionValues?.length &&
                            f.optionValues?.length > 0 && (
                              <ul className="inside-list-style">
                                {f.optionValues.map((v) => (
                                  <li>{v}</li>
                                ))}
                              </ul>
                            )
                          ) : (
                            <span>Not Applicable</span>
                          )}
                        </td>
                        <td>{f.defaultValue}</td>
                        <td>
                          <div>
                            <button type="button">Edit</button>
                            <button type="button">Copy</button>
                            <button
                              type="button"
                              onClick={() => deleteFormElement(f)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center' }}>
                        <span>No Form Elements Added</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          }
        </div>
      </div>
      {activeModal}
    </>
  );
}

FormEditor.ErrorBoundary = function () {
  const error = useRouteError();
  const navigate = useNavigate();

  let el;

  if (isRouteErrorResponse(error)) {
    const { data } = error;
    el = (
      <>
        <pre>{data.message || JSON.stringify(data, null, 2)}</pre>
      </>
    );
  }
  return (
    <>
      {el}
      <button type="button" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </>
  );
};

FormEditor.loader = (async ({ params }) => {
  const id = Number(params['id']);
  const form = await FormsService.getForm(id);
  if (!form) {
    throw json({
      message: 'Form not found',
    });
  }

  return form;
}) as LoaderFunction;
