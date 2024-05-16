import { ChangeEvent, Fragment, useState } from 'react';
import {
  LoaderFunction,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import { Form } from '../../model/Form';
import FormsService from './FormsService';
import { Toaster } from '../../components/toaster/Toaster';

export function LiveForm() {
  const form = useLoaderData() as Form;
  const [live, setLive] = useState(structuredClone(form));

  function clearForm() {
    setLive(structuredClone(form));
  }

  function copyToClipboard() {
    const copy = {
      name: live.name,
      fields: live.fields.reduce<[string, string][]>((arr, field) => {
        arr.push([field.label, field.value.toString()]);
        return arr;
      }, []),
    };

    const type = 'text/plain';
    const blob = new Blob(
      [
        copy.name +
          '\n' +
          copy.fields.map(([label, value]) => `${label}:\t${value}`).join('\n'),
      ],
      { type }
    );
    const data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data).then(() => {
      Toaster.makeToast({
        header: 'Success',
        type: 'ok',
        message: 'Copied to clipboard',
        timeout: 5000,
      });
    });
  }

  function onChange(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
  ) {
    function getValue(
      e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
    ): string | string[] {
      switch (e.target.type) {
        case 'text':
        case 'textarea':
        case 'radio':
          return e.target.value;
        case 'checkbox':
          return (e.target as HTMLInputElement).checked.toString();
        case 'select-multiple':
        case 'select-one':
          return Array.from(
            (e.target as HTMLSelectElement).selectedOptions
          ).map((option) => option.value);
        default:
          return e.target.value;
      }
    }

    live.fields.find((field) => field.name === e.target.name)!.value =
      getValue(e);

    setLive({
      ...live,
    });
  }

  return (
    <>
      <div>
        <h2>{live.name}</h2>
        <p>{live.description}</p>
        <div>
          {live.fields.map((field, i) => (
            <div key={'field' + i + field.name}>
              <p>{field.label}</p>
              {(() => {
                switch (field.type) {
                  case 'text':
                    return (
                      <>
                        <input type="text" name={field.name} id={field.name} />
                      </>
                    );
                  case 'textarea':
                    return (
                      <>
                        <textarea
                          name={field.name}
                          id={field.name}
                          cols={120}
                          rows={4}
                          onChange={onChange}
                        ></textarea>
                      </>
                    );
                  case 'select':
                    return (
                      <>
                        <select
                          name={field.name}
                          id={field.name}
                          size={4}
                          multiple={field.multi}
                          onChange={onChange}
                        >
                          {field.optionValues?.map((optionValue) => (
                            <option
                              value={optionValue}
                              key={'select' + optionValue}
                            >
                              {optionValue}
                            </option>
                          ))}
                        </select>
                      </>
                    );
                  case 'radio':
                    return (
                      <>
                        <fieldset>
                          <legend>{field.label}</legend>
                          <div>
                            {field.optionValues?.map((optionValue) => (
                              <Fragment key={'radio' + optionValue}>
                                <label htmlFor={field.name}>
                                  {optionValue}
                                </label>
                                <input
                                  type="radio"
                                  name={field.name}
                                  id={field.name}
                                  value={optionValue}
                                  onChange={onChange}
                                />
                              </Fragment>
                            ))}
                          </div>
                        </fieldset>
                      </>
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          ))}
        </div>
        <div>
          <button type="button" onClick={clearForm}>
            Clear
          </button>
          <button type="button" onClick={copyToClipboard}>
            Copy
          </button>
        </div>
      </div>
    </>
  );
}

LiveForm.ErrorBoundary = function () {
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

LiveForm.loader = (async ({ params }) => {
  const id = Number(params['id']);
  const form = await FormsService.getForm(id);
  if (!form) {
    throw json({
      message: 'Form not found',
    });
  }
  return form;
}) as LoaderFunction;
