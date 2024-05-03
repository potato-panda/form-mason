type SingleValueInputs = 'text' | 'textarea' | 'richtext';
type MultipleValueInputs = 'select' | 'radio';
export type InputType = SingleValueInputs | MultipleValueInputs;

export interface FormElement<T extends InputType = InputType> {
  type: InputType;
  order: number;
  name: string;
  label: string;
  category?: string;
  value: T extends 'select' ? string[] : string;
  defaultValue?: T extends 'select' ? string[] : string;
  required?: boolean;
  copyLabel?: boolean;
  copyBehaviour?: 'exclusive' | boolean;
  clearBehaviour?: 'exclusive' | 'inclusive';
  multi?: T extends 'select' ? boolean : undefined;
  optionValues?: T extends MultipleValueInputs ? string[] : undefined;
}
