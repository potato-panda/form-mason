import { ChangeEvent, createElement, useState } from 'react';
import FormElement from '../form/FormElement';
import { Form, IForm } from '../model/form';
import { FormItem, InputType } from '../model/formItem';
import { ModalService } from '../services/modalService';
import Unicode from '../utils/Unicode';
import StatefulStyledInput from '../components/inputs/statefulStyledInput';

export default function FormBuilder({ _form }: { _form?: IForm }) {
  const [form, setForm] = useState<IForm>(_form ?? new Form());

  const modalService = ModalService();

  const addFormItemModal = modalService.createModal({
    header: (
      <>
        <h4>Add Form Element</h4>
        <button type="button" onClick={closeModals}>
          &#10006;
        </button>
      </>
    ),
    content: (
      <FormElement formElement={form} addItem={addFormItem}></FormElement>
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
    } as IForm);
  }

  function addFormItem(item: FormItem<InputType>) {
    setForm({
      ...form,
      fields: [...(form?.fields ?? []), item as any],
    } as IForm);
  }

  function removeFormItem(item: FormItem<InputType>) {
    setForm({
      ...form,
      fields: (form?.fields ?? []).filter(
        (el: FormItem<InputType>) => el !== item
      ),
    } as IForm);
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
    } as IForm);
  }

  function openAddFormItemModal() {
    addFormItemModal.open();
  }

  function closeModals() {
    addCategoryModal.close();
    addFormItemModal.close();
  }

  function saveForm() {}

  const formOptions = (
    <div className="form-options">
      <div className="">Form Options</div>
      <div className="form-options-row">
        {createElement(() => {
          const [categorySelection, setCategorySelection] = useState<string[]>(
            []
          );

          function onCategorySelectionOptionsChange(
            e: ChangeEvent<HTMLSelectElement>
          ) {
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
            setForm({
              ...form,
              categories: (form?.categories ?? []).filter(
                (i) => !categorySelection.includes(i.name)
              ),
            });
          }

          function onDefaultRichTextOptionChange(
            e: ChangeEvent<HTMLInputElement>
          ) {
            const checked = e.target.checked;
            setForm({
              ...form,
              options: {
                ...form?.options,
                textArea: {
                  ...form?.options?.textArea,
                  defaultRichText: checked,
                },
              },
            });
          }

          function onFormStanandaloneCopyOptionChange(
            e: ChangeEvent<HTMLInputElement>
          ) {
            const checked = e.target.checked;
            setForm({
              ...form,
              options: {
                ...form?.options,
                copy: {
                  ...form?.options?.copy,
                  standalone: checked,
                },
              },
            });
          }

          function onMultiSelectOptionChange(e: ChangeEvent<HTMLInputElement>) {
            const checked = e.target.checked;
            setForm({
              ...form,
              options: {
                ...form?.options,
                select: {
                  ...form?.options?.select,
                  multi: checked,
                },
              },
            });
          }

          function onSelectSizeOptionChange(e: ChangeEvent<HTMLInputElement>) {
            const size = parseInt(e.target.value);
            setForm({
              ...form,
              options: {
                ...form?.options,
                select: {
                  ...form?.options?.select,
                  size,
                },
              },
            });
          }

          return (
            <>
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
              <div>
                <fieldset>
                  <legend>Field Options Defaults</legend>
                  <div className="options-table">
                    <fieldset>
                      <legend>Text Area Field Options</legend>
                      <div
                        className="options-table-item"
                        title='Sets default to use "Rich Text" Editor when creating a Text Area field'
                      >
                        <input
                          type="checkbox"
                          name="defaultRichText"
                          id="defaultRichText"
                          checked={form?.options?.textArea?.defaultRichText}
                          onChange={onDefaultRichTextOptionChange}
                        />
                        <label htmlFor="defaultRichText">
                          Default to Rich Text Editor
                        </label>
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend>Select Field Options</legend>
                      <div
                        className="options-table-item"
                        title="Sets default to enable multiple selections in a Select List when creating a Select field"
                      >
                        <input
                          type="checkbox"
                          name="multiSelect"
                          id="multiSelect"
                          checked={form?.options?.select?.multi}
                          onChange={onMultiSelectOptionChange}
                        />
                        <label htmlFor="multiSelect">
                          Default to use Select Lists
                        </label>
                      </div>
                      <div
                        className="options-table-item"
                        title="Set default size of a Select List when creating a Select field"
                      >
                        <input
                          type="number"
                          name="selectSize"
                          id="selectSize"
                          value={form?.options?.select?.size}
                          min={0}
                          max={10}
                          onChange={onSelectSizeOptionChange}
                        />
                        <label htmlFor="selectSize">
                          Default Select List Size
                        </label>
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend>Field Copy Options</legend>
                      <div
                        className="options-table-item"
                        title='Set default to use "Standalone" copy when creating a field. Standalone copy adds the copy action to the field.'
                      >
                        <input
                          type="checkbox"
                          name="standaloneCopy"
                          id="standaloneCopy"
                          checked={form?.options?.copy?.standalone}
                          onChange={onFormStanandaloneCopyOptionChange}
                        />
                        <label htmlFor="standaloneCopy">Standalone Copy</label>
                      </div>
                    </fieldset>
                  </div>
                </fieldset>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="form-builder">
      <StatefulStyledInput
        value={form?.name ?? 'New Form'}
        setValue={setFormName}
      />
      {formOptions}
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
                  form?.fields?.sort()?.map((f) => (
                    <tr>
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
                            onClick={() => removeFormItem(f)}
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
