import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Form } from '../../model/Form';

export function LiveForm() {
  const form = useLoaderData() as Form;
  const [live, setLive] = useState(structuredClone(form));

  function clearForm() {
    setLive(structuredClone(form));
  }

  function copyToClipboard() {
    const copy = {
      name: live.name,
      fields: live.fields
        .sort((a, b) => a.order - b.order)
        .reduce<[string, string][]>(
          (arr, field) => {
            arr.push([field.label, field.value.toString()]);
            return arr;
          },
          [] as [string, string][]
        ),
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

    navigator.clipboard.write(data);
  }

  return (
    <>
      <div>
        <h2>{live.name}</h2>
        <p>{live.description}</p>
        <div>
          {live.fields.map((field) => (
            <div>
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
                        ></textarea>
                      </>
                    );
                  case 'select':
                    return (
                      <>
                        <select name={field.name} id={field.name} size={4}>
                          {field.optionValues?.map((optionValue) => (
                            <option value={optionValue}>{optionValue}</option>
                          ))}
                        </select>
                      </>
                    );
                  case 'radio':
                    return (
                      <>
                        {field.optionValues?.map((optionValue) => (
                          <input
                            type="radio"
                            name={field.name}
                            id={field.name}
                            value={optionValue}
                          />
                        ))}
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
