import { ChangeEvent, MouseEvent, createElement, useState } from 'react';
import { InputType, FormItem } from '../model/formItem';
import './form.css';
import { IForm } from '../model/form';

const defaultForm = () => {
  return structuredClone({
    type: 'text',
  }) as FormItem<InputType>;
};

export default function FormElement({
  formElement,
  addItem,
}: {
  formElement?: IForm;
  addItem?: (form: FormItem<InputType>) => void;
}) {
  const [form, setForm] = useState(defaultForm() as FormItem<InputType>);

  function resetForm() {
    setForm(defaultForm());
  }

  function addToForm() {
    addItem && addItem(form);
    resetForm();
  }

  function onTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    const type = e.target.value as InputType;
    const diffChangeToSelect =
      form.type !== type && (type === 'select' || type === 'radio');
    const value = diffChangeToSelect ? [] : '';
    setForm({
      ...form,
      type,
      value,
      defaultValue: value,
      optionValues: diffChangeToSelect ? [] : undefined,
    });
  }

  function onLabelChange(e: ChangeEvent<HTMLInputElement>) {
    const label = e.target.value;
    setForm({ ...form, label });
  }

  function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setForm({ ...form, name });
  }

  function onCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;
    setForm({ ...form, category });
  }

  function onDefaultValueChange(e: ChangeEvent<HTMLInputElement>) {
    const defaultValue = e.target.value;
    setForm({ ...form, defaultValue });
  }

  function onDefaultTextAreaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const defaultValue = e.target.value;
    setForm({ ...form, defaultValue });
  }

  function onDefaultSelectValueChange(e: ChangeEvent<HTMLSelectElement>) {
    const defaultValue = [];
    for (const opt of e.target.options) {
      if (opt.selected) {
        defaultValue.push(opt.value);
      }
    }
    setForm({ ...form, defaultValue });
  }

  function richTextCheck(event: ChangeEvent<HTMLInputElement>): void {
    const richText = event.target.checked;
    setForm({
      ...form,
      options: {
        ...form.options,
        textarea: { ...form.options?.textarea, richText },
      },
    });
  }

  function multiSelectCheck(event: ChangeEvent<HTMLInputElement>): void {
    const multi = event.target.checked;
    setForm({
      ...form,
      options: {
        ...form.options,
        select: {
          ...form.options?.select,
          multi,
        },
      },
    });
  }

  function onSelectSizeChange(event: ChangeEvent<HTMLInputElement>): void {
    const size = Number(event.target.value);
    setForm({
      ...form,
      options: {
        ...form.options,
        select: {
          ...form.options?.select,
          size,
        },
      },
    });
  }

  return (
    <>
      <form className="item-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            id="name"
            onChange={onNameChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="label" className="form-label">
            Label
          </label>
          <input
            type="text"
            name="label"
            className="form-control"
            id="label"
            onChange={onLabelChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            name="category"
            className="form-control"
            id="category"
            onChange={onCategoryChange}
            defaultValue={'Uncategorized'}
          >
            {formElement?.categories
              ?.sort()
              .map((category, i) => (
                <option key={`category-opt-${i}`}>{category.name}</option>
              ))}
            <option key="category-opt--1">Uncategorized</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="type" className="form-label">
            Type
          </label>
          <select
            name="type"
            className="form-control"
            id="type"
            onChange={onTypeChange}
            defaultValue={form.type}
          >
            <option value="text">Text</option>
            <option value="textarea">Text Area</option>
            <option value="select">Select</option>
            <option value="radio">Radio</option>
          </select>
        </div>

        {/* Options form */}
        {(form.type === 'select' || form.type === 'textarea') && (
          <fieldset>
            <legend>Options</legend>
            {form.type === 'select' && (
              <fieldset>
                <legend>Select Options</legend>
                <div className="form-group">
                  <label htmlFor="multiSelect" className="form-label">
                    Multi Option Select
                  </label>
                  <input
                    type="checkbox"
                    name="multiSelect"
                    className="form-control"
                    id="multiSelect"
                    onChange={multiSelectCheck}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="selectSize" className="form-label">
                    Select Size
                  </label>
                  <input
                    type="number"
                    name="selectSize"
                    className="form-control"
                    id="selectSize"
                    onChange={onSelectSizeChange}
                  />
                </div>
              </fieldset>
            )}
            {form.type === 'textarea' && (
              <fieldset>
                <legend>Text Area Options</legend>
                <div className="form-group">
                  <label htmlFor="value" className="form-label">
                    Rich Text Editor
                  </label>
                  <input
                    type="checkbox"
                    name="richText"
                    className="form-control"
                    id="richText"
                    onChange={richTextCheck}
                  />
                </div>
              </fieldset>
            )}
            {/* <label htmlFor="value">
              Omit from Copy
              <input type="checkbox" name="omitFromCopy" id="omitFromCopy" />
            </label> */}
          </fieldset>
        )}

        {/* Options Values form for forms with multiple choice */}
        {(form.type === 'select' || form.type === 'radio') &&
          createElement(() => {
            const [optionValueSelection, setOptionValueSelection] = useState<
              string[]
            >([]);

            const [optionValueInput, setOptionValueInput] =
              useState<string>('');

            function addOptionValue(
              _event: MouseEvent<HTMLButtonElement>
            ): void {
              const optionValue = optionValueInput;
              if (optionValue) {
                setForm({
                  ...form,
                  optionValues: [...(form?.optionValues ?? []), optionValue],
                });
                setOptionValueInput('');
              }
            }

            function onSelectionChange(e: ChangeEvent<HTMLSelectElement>) {
              const options = e.target.options;
              const values = [];
              for (const i in options) {
                if (options[i].selected) {
                  values.push(options[i].value);
                }
              }
              setOptionValueSelection(values);
            }
            function onFormOptionsChange() {
              setForm({
                ...form,
                optionValues: [
                  ...(form.optionValues?.filter(
                    (i) => !optionValueSelection.includes(i)
                  ) ?? []),
                ],
              });
            }

            return (
              <fieldset>
                <legend>Option Values</legend>
                <select
                  name="optionValue"
                  className="form-control"
                  multiple
                  size={4}
                  onChange={onSelectionChange}
                >
                  {form.optionValues?.map((value, index) => (
                    <option key={`select-opt-${index}`}>{value}</option>
                  ))}
                </select>
                <label htmlFor="optionValue" className="form-label"></label>
                <input
                  type="text"
                  name="optionValue"
                  className="form-control"
                  id="optionValue"
                  value={optionValueInput}
                  onChange={(e) => setOptionValueInput(e.target.value)}
                />
                <button
                  type="button"
                  name="addOption"
                  className=""
                  id="addOption"
                  onClick={addOptionValue}
                >
                  Add
                </button>
                <button
                  type="button"
                  name="deleteSelection"
                  className="form-control"
                  id="deleteSelection"
                  onClick={onFormOptionsChange}
                >
                  Remove
                </button>
              </fieldset>
            );
          })}

        {/* Default Value form for forms with multiple choice */}
        <div className="form-group">
          {form.type !== 'radio' && (
            <label htmlFor="defaultValue" className="form-label">
              Default Value
            </label>
          )}
          {form.type === 'text' && (
            <input
              type="text"
              name="defaultValue"
              className="form-control"
              id="defaultValue"
              placeholder=""
              onChange={onDefaultValueChange}
            />
          )}
          {form.type === 'select' && (
            <select
              name="defaultValue"
              className="form-control"
              id="defaultValue"
              onChange={onDefaultSelectValueChange}
            >
              {form.optionValues?.length && form.optionValues.length > 0 ? (
                <>
                  <option key={`default-option-value--1`}></option>
                  {form.optionValues.map((value, index) => (
                    <option value={value} key={`default-option-value-${index}`}>
                      {value}
                    </option>
                  ))}
                </>
              ) : (
                <option disabled selected>
                  Add an Option Value first
                </option>
              )}
            </select>
          )}
          {form.type === 'radio' && (
            <fieldset>
              <legend>Default Values</legend>
              <div>
                {form.optionValues?.map((value, index) => (
                  <>
                    <label
                      htmlFor={`radio-opt-${index}`}
                      className="form-label"
                    >
                      {value}
                    </label>
                    <input
                      type="radio"
                      id={`radio-opt-${index}`}
                      name={`radio-opt-${index}`}
                      className="form-control"
                      key={`default-option-value-${index}`}
                      radioGroup={`radio-opt-${index}`}
                      value={value}
                      onChange={onDefaultValueChange}
                    />
                  </>
                ))}
              </div>
            </fieldset>
          )}
          {form.type === 'textarea' && (
            <textarea
              id="defaultValue"
              name="defaultValue"
              className="form-control"
              onChange={onDefaultTextAreaChange}
            />
          )}
        </div>
        <div>
          <button type="button" onClick={addToForm}>
            Add
          </button>
        </div>
      </form>
    </>
  );
}
