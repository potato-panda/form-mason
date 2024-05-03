import { Form } from '../../model/Form';

export class FormUtils {
  static create(): Form {
    return {
      name: '',
      fields: [],
      fieldCategories: [],
      tags: [],
    };
  }

  static from(o: any): Form {
    const form: Form = FormUtils.create();
    for (const key in Object.entries(form)) {
      (form as any)[key] = o[key];
    }
    return form;
  }
}
