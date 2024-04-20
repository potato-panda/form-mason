import { ChangeEvent, createElement } from 'react';
import { Form } from '../../model/Form';
import { FormSettings } from '../../model/FormSettings';

export function FormSettingsPanel({
  formSettings,
  setFormSettings,
}: {
  form?: Form;
  setForm?: (form: Form) => void;
  formSettings: FormSettings;
  setFormSettings: (formSettings: FormSettings) => void;
}) {
  return (
    <>
      {createElement(() => {
        function onDefaultRichTextOptionChange(
          e: ChangeEvent<HTMLInputElement>
        ) {
          const checked = e.target.checked;
          setFormSettings({
            ...formSettings,
            ...{
              textArea: {
                ...formSettings?.textArea,
                defaultRichText: checked,
              },
            },
          });
        }

        function onFormStanandaloneCopyOptionChange(
          e: ChangeEvent<HTMLInputElement>
        ) {
          const checked = e.target.checked;
          setFormSettings({
            ...formSettings,
            ...{
              copy: {
                ...formSettings?.copy,
                standalone: checked,
              },
            },
          });
        }

        function onMultiSelectOptionChange(e: ChangeEvent<HTMLInputElement>) {
          const checked = e.target.checked;
          setFormSettings({
            ...formSettings,
            select: {
              ...formSettings?.select,
              multi: checked,
            },
          });
        }

        function onSelectSizeOptionChange(e: ChangeEvent<HTMLInputElement>) {
          const size = parseInt(e.target.value);
          setFormSettings({
            ...formSettings,
            select: {
              ...formSettings?.select,
              size,
            },
          });
        }

        return (
          <>
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
                      checked={formSettings?.textArea?.defaultRichText}
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
                      checked={formSettings?.select?.multi}
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
                      value={formSettings?.select?.size}
                      min={0}
                      max={10}
                      onChange={onSelectSizeOptionChange}
                    />
                    <label htmlFor="selectSize">Default Select List Size</label>
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
                      checked={formSettings?.copy?.standalone}
                      onChange={onFormStanandaloneCopyOptionChange}
                    />
                    <label htmlFor="standaloneCopy">Standalone Copy</label>
                  </div>
                </fieldset>
              </div>
            </fieldset>
          </>
        );
      })}
    </>
  );
}
