import { ChangeEvent, createElement, useState } from 'react';
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
import TransactionFactoryFactory from '../../db/TransactionFactoryFactory';
import { Form } from '../../model/Form';
import { FormElement } from '../../model/FormElement';
import Unicode from '../../utils/Unicode';
import { FormUtils } from '../../utils/forms/FormUtils';
import FormElementAdder from './FormElementAdder';
import FormsService from './FormsService';

export default function FormEditor() {
  const original = (useLoaderData() as Form) ?? FormUtils.create();
  const [form, setForm] = useState<Form>(original ?? FormUtils.create());
  const [categorySelection, setCategorySelection] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<React.ReactNode>(null);

  const readWriteTransactionFactory = TransactionFactoryFactory.createFactory(
    'ReadWrite|FormEditor',
    'forms',
    'readwrite'
  );

  const addFormElementModal = Modal({
    content: ({ closeModal }) => (
      <>
        <div className="modal-header">
          <h4>Add Form Element</h4>
          <button type="button" onClick={closeModal}>
            &#10006;
          </button>
        </div>
        <div className="modal-body">
          <FormElementAdder
            formElement={form}
            addItem={addFormElement}
          ></FormElementAdder>
        </div>
      </>
    ),
    closeModal: () => closeModals(),
  });

  const addCategoryModal = Modal({
    content: ({ closeModal }) =>
      createElement(() => {
        const [category, setCategory] = useState('');
        return (
          <>
            <div className="modal-header">
              <h4>Add Category</h4>
              <button type="button" onClick={closeModal}>
                &#10006;
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => addCategoryOption(category)}
                >
                  Add
                </button>
              </form>
            </div>
          </>
        );
      }),
    closeModal: () => closeModals(),
  });

  function setFormName(name: string) {
    setForm({ ...form, name });
  }

  function addFormElement(item: FormElement) {
    setForm({ ...form, fields: [...form.fields, item as any] });
  }

  function removeFormElement(item: FormElement) {
    setForm({
      ...form,
      fields: [...form.fields.filter((el: FormElement) => el !== item)],
    });
  }

  function openAddCategoryModal() {
    setActiveModal(addCategoryModal);
  }

  function addCategoryOption(category: string) {
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

  function openAddFormItemModal() {
    setActiveModal(addFormElementModal);
  }

  function closeModals() {
    setActiveModal(null);
  }

  function onCategorySelectionOptionsChange(e: ChangeEvent<HTMLSelectElement>) {
    const options = e.target.options;
    const values = [];

    for (const i in options) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setCategorySelection(values);
  }

  function removeCategorySelectionOptions() {
    if (form && setForm)
      setForm({
        ...form,
        fieldCategories: (form?.fieldCategories ?? []).filter(
          (i) => !categorySelection.includes(i.name)
        ),
      });
  }

  function isFormValid() {
    const isValid =
      typeof form.name === 'string' && form.name.trim().length > 0;
    return isValid;
  }

  const saveForm = async () => {
    if (!isFormValid()) return;
    const tx = readWriteTransactionFactory.transaction();
    const os = tx.objectStore('forms');
    const request = os.add(form);
    request.onsuccess = () => {
      return;
    };
    request.onerror = () => {
      return request.error;
    };
  };

  return (
    <>
      <div className="form-builder">
        <StatefulStyledInput
          name="name"
          id="name"
          value={form.name}
          placeholder="Form Name"
          setValue={setFormName}
        />
        <div className="flex row">
          <button type="button" onClick={saveForm}>
            Save
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
                <div>
                  <button type="button" onClick={openAddCategoryModal}>
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={removeCategorySelectionOptions}
                    disabled={
                      categorySelection.length === 0 ||
                      !categorySelection ||
                      (categorySelection[0] === 'Uncategorized' &&
                        !(categorySelection.length > 1))
                    }
                  >
                    Remove
                  </button>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <button type="button" onClick={openAddFormItemModal}>
          Add Form Element
        </button>
        <hr />
        <div id="form-builder" className="form-builder">
          {
            <>
              <table className="form-builder-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Label</th>
                    <th scope="col">Category</th>
                    <th scope="col">Type</th>
                    <th scope="col">Field Options</th>
                    <th scope="col">Value</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {form?.fields?.length > 0 ? (
                    form?.fields?.sort()?.map((f, i) => (
                      <tr key={i}>
                        <td>{f.name}</td>
                        <td>{f.label}</td>
                        <td>{f.category}</td>
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
                                  value: f.multi ? 'Enabled' : 'Disabled',
                                });
                                break;
                              default:
                                break;
                            }
                            return <></>;
                          })}
                        </td>
                        <td>
                          {f.type}
                          {(f.type === 'radio' || f.type === 'select') &&
                            f.optionValues?.length &&
                            f.optionValues?.length > 0 && (
                              <>
                                <hr />
                                <div>Options</div>
                                <ul>
                                  {f.optionValues.map((v) => (
                                    <li>{v}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                        </td>
                        <td>{f.defaultValue}</td>
                        <td>
                          <div>
                            <button type="button">Edit</button>
                            <button type="button">Copy</button>
                            <button
                              type="button"
                              onClick={() => removeFormElement(f)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center' }}>
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
  if (!form)
    throw json({
      message: 'Form not found',
    });
  return form;
}) as LoaderFunction;
