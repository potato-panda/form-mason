export type SingleValueInputs = 'text' | 'textarea';
export type MultipleChoiceInputs = 'select' | 'radio';
export type InputType = SingleValueInputs | MultipleChoiceInputs;

export interface FormElement<T extends InputType = InputType> {
  order?: number;
  type: InputType;
  label: string;
  name: string;
  category?: string;
  value: T extends 'select' ? string[] : string;
  defaultValue?: T extends 'select' ? string[] : string;
  options?: {
    select?: {
      // if 'select' type
      multi?: boolean;
      size?: number;
    };
    textarea?: {
      // if 'textarea' type
      richText?: boolean;
    };
    copy?: {
      type: 'standalone' | boolean;
    };
    clearBehaviour?: 'exclusive' | 'inclusive';
    required?: boolean;
  };
  optionValues?: T extends MultipleChoiceInputs ? string[] : never;
}
