import { ChangeEvent, MouseEvent, useState } from 'react';
import Markdown from 'react-markdown';
import { Form } from '../../model/Form';
import { FormElement, InputType } from '../../model/FormElement';
import './elementForm.css';
import './form.css';

const fieldTypesLabelled = [
  ['text', 'Text'],
  ['textarea', 'Text Area'],
  ['select', 'Select'],
  ['radio', 'Radio'],
  ['markdown', 'Markdown'],
] as const;

export default function FormElementAdder({
  form: { fieldCategories },
  addFormElement,
}: {
  form: Form;
  addFormElement: (form: FormElement) => void;
}) {
  const newElement: FormElement = {
    type: 'text',
    name: '',
    label: '',
    multi: false,
    value: '',
    defaultValue: '',
  };

  const [element, setElement] = useState<FormElement>(newElement);
  const [errors, setErrors] = useState<Error[]>([]);

  function resetForm(): void {
    setElement(newElement);
  }

  function addToForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);

    (Object.entries(element) as [keyof FormElement, any][]).forEach(
      ([key, value]) => {
        // required fields
        if ([element.name, element.label, element.type].includes(key)) {
          if (!value || value.length === 0) {
            errors.push({
              name: key,
              message: `${key} is required`,
            });
          }
        }
        // required options if type is select or radio
        if (key === 'type' && (value === 'select' || value === 'radio')) {
          if (!element.optionValues || element.optionValues.length === 0) {
            errors.push({
              name: key,
              message: `${key} option(s) are required`,
            });
          }
        }
      }
    );

    setErrors(errors);

    if (errors.length === 0) {
      addFormElement(element);
      resetForm();
    }
  }

  return (
    <>
      <form
        className="element-form form-group flex column"
        onSubmit={addToForm}
      >
        <FieldNameForm element={element} setElement={setElement} />

        <FieldLabelForm element={element} setElement={setElement} />

        <FieldCategoryForm
          fieldCategories={fieldCategories}
          element={element}
          setElement={setElement}
        />

        <FieldTypeForm element={element} setElement={setElement} />

        <FieldOptionValuesForm element={element} setElement={setElement} />

        <FieldDefaultValueForm element={element} setElement={setElement} />

        <div>
          <ul>
            {errors.map((error, i) => (
              <li key={`error-${i}`}>{error.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <button type="submit">Add to Form</button>
        </div>
      </form>
    </>
  );
}
function FieldDefaultValueForm({
  element,
  setElement,
}: {
  element: FormElement<InputType>;
  setElement: React.Dispatch<React.SetStateAction<FormElement<InputType>>>;
}) {
  function onDefaultValueChange(event: ChangeEvent<HTMLInputElement>): void {
    setElement({ ...element, defaultValue: event.target.value });
  }

  function onDefaultTextAreaChange(
    event: ChangeEvent<HTMLTextAreaElement>
  ): void {
    setElement({ ...element, defaultValue: event.target.value });
  }

  function onDefaultSelectValueChange(
    event: ChangeEvent<HTMLSelectElement>
  ): void {
    setElement({
      ...element,
      defaultValue: Array.from(
        event.target.selectedOptions,
        (option) => option.value
      ),
    });
  }

  return (
    <div className="form-group">
      {element.type !== 'radio' && (
        <label htmlFor="defaultValue" className="form-label">
          Default Value
        </label>
      )}
      {element.type === 'text' && (
        <input
          type="text"
          name="defaultValue"
          className="form-control"
          id="defaultValue"
          placeholder=""
          value={element.defaultValue}
          onChange={onDefaultValueChange}
          title="Default value for the field. Leave empty for no default value."
        />
      )}
      {element.type === 'select' && (
        <select
          name="defaultValue"
          className="form-control"
          id="defaultValue"
          multiple={element.multi ? true : false}
          size={element.multi ? 4 : undefined}
          value={element.defaultValue}
          onChange={onDefaultSelectValueChange}
        >
          {!element.multi && (
            <option value={''} key={`default-option-value--0`}></option>
          )}
          {element.optionValues?.map((value, index) => (
            <option value={value} key={`default-option-value-${index}`}>
              {value}
            </option>
          ))}
        </select>
      )}
      {element.type === 'radio' && (
        <fieldset className="form-group">
          <legend>Default Values</legend>
          <ul>
            {element.optionValues?.map((value, index) => (
              <li>
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
                <label htmlFor={`radio-opt-${index}`} className="form-label">
                  {value}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
      {element.type === 'textarea' && (
        <textarea
          id="defaultValue"
          name="defaultValue"
          className="form-control"
          value={element.defaultValue}
          onChange={onDefaultTextAreaChange}
        />
      )}
      {element.type === 'markdown' && (
        <>
          <textarea
            id="defaultValue"
            name="defaultValue"
            className="form-control"
            value={element.defaultValue}
            onChange={onDefaultTextAreaChange}
          />
          <div>
            <label>Preview</label>
            <Markdown className="md-preview">
              {element.defaultValue?.toString()}
            </Markdown>
          </div>
        </>
      )}
    </div>
  );
}

function FieldOptionValuesForm({
  element,
  setElement,
}: {
  element: FormElement<InputType>;
  setElement: React.Dispatch<React.SetStateAction<FormElement<InputType>>>;
}) {
  const [optionValueSelection, setOptionValueSelection] = useState<
    string | string[] | undefined
  >(undefined);

  const [optionValueTextInput, setOptionValueTextInput] = useState<string>('');

  function addOptionValue(_event: MouseEvent<HTMLButtonElement>): void {
    const optionValue = optionValueTextInput;
    if (optionValue && !element.optionValues?.includes(optionValue)) {
      setElement({
        ...element,
        optionValues: [...(element.optionValues ?? []), optionValue],
      });
      setOptionValueTextInput('');
    }
  }

  function editOptionValue(_event: MouseEvent<HTMLButtonElement>): void {
    if (
      optionValueTextInput &&
      optionValueTextInput.length > 0 &&
      !element.optionValues?.includes(optionValueTextInput)
    ) {
      if (
        Array.isArray(optionValueSelection) &&
        optionValueSelection.length === 1
      ) {
        element.optionValues?.splice(
          element.optionValues?.indexOf(optionValueSelection[0]),
          1,
          optionValueTextInput
        );
      }
      setElement({
        ...element,
        optionValues: element.optionValues,
      });
      setOptionValueTextInput('');
    }
  }

  function onSelectionChange(event: ChangeEvent<HTMLSelectElement>): void {
    const values = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setOptionValueSelection(values);
  }

  function deleteOptionValue(): void {
    setElement({
      ...element,
      optionValues:
        typeof optionValueSelection === 'string'
          ? element.optionValues?.filter((i) => i !== optionValueSelection)
          : element.optionValues?.filter(
              (i) => !optionValueSelection?.includes(i)
            ) ?? [],
    });
  }

  return (
    ['select', 'radio'].includes(element.type) && (
      <fieldset className="form-group">
        <legend>
          Option Values
          {` (${element.optionValues?.length})`}
        </legend>
        <select
          name="optionValue"
          className="form-control"
          id="selectOptionValue"
          multiple={true}
          size={4}
          value={optionValueSelection}
          onChange={onSelectionChange}
          title="Click to select and unselect options to delete; Select (1) option to edit."
        >
          {element.optionValues?.map((value, index) => (
            <option key={`select-opt-${index}`} value={value}>
              {value}
            </option>
          ))}
        </select>
        <div>
          <label htmlFor="optionValue" className="form-label"></label>
          <input
            type="text"
            name="optionValue"
            className="form-control"
            id="optionValue"
            value={optionValueTextInput}
            onChange={(e) => setOptionValueTextInput(e.target.value)}
            title="Enter option value to add, or select (1) option above and apply edit."
            placeholder={
              optionValueSelection?.length === 1
                ? `Edit '${optionValueSelection[0]}'`
                : 'Enter option value to add'
            }
          />
          <button
            type="button"
            name="addOption"
            className=""
            id="addOption"
            onClick={addOptionValue}
            disabled={
              !optionValueTextInput &&
              (!optionValueSelection || optionValueSelection.length > 0)
            }
          >
            Add
          </button>
          <button
            type="button"
            name="editOption"
            className=""
            id="editOption"
            disabled={optionValueSelection?.length !== 1}
            onClick={editOptionValue}
          >
            Edit
          </button>
          <button
            type="button"
            name="deleteSelection"
            className="form-control"
            id="deleteSelection"
            onClick={deleteOptionValue}
            disabled={
              !optionValueSelection || optionValueSelection.length === 0
            }
            style={{ minWidth: '60px' }}
          >
            Del
            {optionValueSelection &&
              optionValueSelection.length > 0 &&
              `(${optionValueSelection.length})`}
          </button>
        </div>
      </fieldset>
    )
  );
}

function FieldTypeForm({
  element,
  setElement,
}: {
  element: FormElement<InputType>;
  setElement: React.Dispatch<React.SetStateAction<FormElement<InputType>>>;
}) {
  function onTypeChange(event: ChangeEvent<HTMLSelectElement>): void {
    event.preventDefault();
    const type = event.target.value as InputType;
    const wasChangedToSelect =
      element.type !== type && (type === 'select' || type === 'radio');
    const value = wasChangedToSelect && element.multi ? ([] as string[]) : '';
    setElement({
      ...element,
      type,
      value,
      defaultValue: value,
      optionValues: wasChangedToSelect ? [] : undefined,
    });
  }

  function multiSelectCheck(event: ChangeEvent<HTMLInputElement>): void {
    const multi = event.target.checked;
    setElement({
      ...element,
      multi,
      value: multi ? [] : '',
      defaultValue: multi ? [] : '',
    });
  }

  return (
    <div className="form-group">
      <label htmlFor="type" className="form-label">
        Type
      </label>
      <select
        name="type"
        required
        className="form-control"
        id="type"
        value={element.type}
        onChange={onTypeChange}
      >
        {fieldTypesLabelled.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {element.type === 'select' && (
        <div className="form-group">
          <input
            type="checkbox"
            name="multiSelect"
            className="form-control"
            id="multiSelect"
            checked={element.multi}
            onChange={multiSelectCheck}
          />
          <label
            htmlFor="multiSelect"
            className="form-label"
            title="If checked, multiple options can be selected"
          >
            Multi Option Select
          </label>
        </div>
      )}
    </div>
  );
}

function FieldCategoryForm({
  fieldCategories,
  element,
  setElement,
}: {
  fieldCategories: Form['fieldCategories'];
  element: FormElement<InputType>;
  setElement: React.Dispatch<React.SetStateAction<FormElement<InputType>>>;
}) {
  function onCategoryChange(event: ChangeEvent<HTMLSelectElement>): void {
    setElement({ ...element, category: event.target.value });
  }

  return (
    <div className="form-group">
      <label htmlFor="category" className="form-label">
        Category
      </label>
      <select
        name="category"
        className="form-control"
        id="category"
        value={element.category}
        onChange={onCategoryChange}
      >
        {fieldCategories.sort().map((category, i) => (
          <option key={`category-opt-${i}`}>{category.name}</option>
        ))}
        <option key="category-opt--1">Uncategorized</option>
      </select>
    </div>
  );
}

function FieldLabelForm({
  element,
  setElement,
}: {
  element: FormElement<InputType>;
  setElement: React.Dispatch<React.SetStateAction<FormElement<InputType>>>;
}) {
  function onLabelChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setElement({ ...element, label: event.target.value });
  }

  return (
    <div className="form-group">
      <label htmlFor="label" className="form-label">
        Label
      </label>
      <textarea
        name="label"
        required
        className="form-control no-resize"
        id="label"
        value={element.label}
        cols={30}
        rows={4}
        onChange={onLabelChange}
        title='Enter the field label here. For example: "Email Address" or "What is your favourite food?"'
        placeholder='Enter the field label here. For example: "Email Address" or "What is your favourite food?"'
      />
    </div>
  );
}

function FieldNameForm({
  element,
  setElement,
}: {
  element: FormElement<InputType>;
  setElement: React.Dispatch<React.SetStateAction<FormElement<InputType>>>;
}) {
  function onNameChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setElement({ ...element, name: event.target.value });
  }

  return (
    <div className="form-group">
      <label htmlFor="name" className="form-label">
        Field Name
      </label>
      <input
        type="text"
        name="name"
        required
        className="form-control"
        id="name"
        placeholder="Name the field"
        title='Enter the name of the field here. For example: "email" or "favouriteFood"'
        value={element.name}
        onChange={onNameChange}
      />
    </div>
  );
}
