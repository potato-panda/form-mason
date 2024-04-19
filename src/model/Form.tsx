import { FormElement } from './FormElement';

export interface Form {
  name?: string;
  id?: string;
  description?: string;
  fields: FormElement[];
  categories?: { order?: number; name: string }[];
}

export class FormUtils {
  static create() {
    return {
      fields: [],
      categories: [],
    } as Form;
  }

  static from(o: any): Form {
    const form: Form = FormUtils.create();
    for (const key in Object.entries(form)) {
      (form as any)[key] = o[key];
    }
    return form;
  }
}
