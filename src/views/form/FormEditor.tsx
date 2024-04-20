import { ChangeEvent, createElement, useState } from 'react';
import FormElementAdder from './FormElementAdder';
import { FormUtils, Form } from '../../model/Form';
import { FormElement, InputType } from '../../model/FormElement';
import { ModalService } from '../../services/ModalService';
import Unicode from '../../utils/Unicode';
import StatefulStyledInput from '../../components/inputs/StatefulStyledInput';
import { FormSettings } from '../../model/FormSettings';
import TransactionFactoryFactory from '../../utils/indexedDB/TransactionFactoryFactory';

export default function FormEditor({ form: _form }: { form?: Form }) {
  const original = structuredClone(_form);
  const [form, setForm] = useState<Form>(original ?? FormUtils.create());
  const [formSettings, setFormSettings] = useState<FormSettings>({});
  const [categorySelection, setCategorySelection] = useState<string[]>([]);
  const rwTx = () =>
    TransactionFactoryFactory.createFactory('ReadWrite|FormEditor', 'forms', 'readwrite');

  const modalService = ModalService();

  const addFormElementModal = modalService.createModal({
    header: (
      <>
        <h4>Add Form Element</h4>
        <button type="button" onClick={closeModals}>
          &#10006;
        </button>
      </>
    ),
    content: (
      <FormElementAdder
        formElement={form}
        addItem={addFormElement}
      ></FormElementAdder>
    ),
  });

  const addCategoryModal = modalService.createModal({
    header: (
      <>
        <h4>Add Category</h4>
        <button type="button" onClick={closeModals}>
          &#10006;
        </button>
      </>
    ),
    content: createElement(() => {
      const [category, setCategory] = useState<string>('');
      return (
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
          <button type="button" onClick={() => addCategoryOption(category)}>
            Add
          </button>
        </form>
      );
    }),
  });

  function setFormName(name: string) {
    setForm({
      ...form,
      name: name,
    } as Form);
  }

  function addFormElement(item: FormElement<InputType>) {
    setForm({
      ...form,
      fields: [...(form?.fields ?? []), item as any],
    } as Form);
  }

  function removeFormElement(item: FormElement<InputType>) {
    setForm({
      ...form,
      fields: (form?.fields ?? []).filter(
        (el: FormElement<InputType>) => el !== item
      ),
    } as Form);
  }

  function openAddCategoryModal() {
    addCategoryModal.open();
  }

  function addCategoryOption(category: string) {
    setForm({
      ...form,
      categories: [
        ...(form?.categories ?? []),
        {
          name: category,
        },
      ],
    } as Form);
  }

  function openAddFormItemModal() {
    addFormElementModal.open();
  }

  function closeModals() {
    addCategoryModal.close();
    addFormElementModal.close();
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
        categories: (form?.categories ?? []).filter(
          (i) => !categorySelection.includes(i.name)
        ),
      });
  }

  function validateForm() {
    const isValid =
      typeof form?.name === 'string' && form.name.trim().length > 0;
    return isValid;
  }

  const saveForm = async () => {
    if (!validateForm()) return;
    const txFactory = await rwTx();
    const tx = txFactory.create();
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
    <div className="form-builder">
      <StatefulStyledInput
        name="name"
        id="name"
        value={form?.name}
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
                {form?.categories?.map((category, i) => (
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
                          if (f.options?.required) {
                            options.push({
                              key: 'Required',
                              value: Unicode.checkmark,
                            });
                          }
                          options.push({
                            key: 'Copy',
                            value: f.options?.copy?.type
                              ? f.options?.copy?.type
                                ? 'Standalone'
                                : 'Included'
                              : 'Omitted',
                          });
                          switch (f.type) {
                            case 'select':
                              options.push(
                                {
                                  key: 'Multi Select',
                                  value: f.options?.select?.multi
                                    ? 'Enabled'
                                    : 'Disabled',
                                },
                                {
                                  key: 'size',
                                  value: f.options?.select?.size ?? '',
                                }
                              );
                              if (f.options?.select?.size) {
                                options.push({
                                  key: 'size',
                                  value: f.options?.select?.size ?? '',
                                });
                              }
                              break;
                            case 'textarea':
                              options.push({
                                key: 'Rich Text',
                                value: f.options?.textarea?.richText,
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
  );
}
