import { FormElement } from './FormElement';

export interface Form {
  name: string;
  id?: string;
  description?: string;
  fields: FormElement[];
  tags: string[];
  fieldCategories: { order?: number; name: string }[];
}
