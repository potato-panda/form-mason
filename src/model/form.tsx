import { InputType, FormItem } from './formItem';

export interface IForm {
  name?: string;
  id?: string;
  description?: string;
  fields: FormItem<InputType>[];
  categories?: { order?: number; name: string }[];
  options: {
    textArea?: { defaultRichText?: boolean }; // default richtext option if 'textarea' type
    copy?: { standalone?: boolean }; // default standalone copy option for new items
    select: {
      multi?: boolean; // default multi select option if 'select' type
      size?: number; // default size option if 'select' type
    };
  };
}

export class Form implements IForm {
  id?: string;
  name?: string;
  description?: string;
  fields: FormItem<InputType>[] = [];
  categories: { order?: number; name: string }[] = [];
  options: {
    textArea: {
      defaultRichText?: boolean; // default richtext option if 'textarea' type
    };
    copy: {
      standalone?: boolean; // default standalone copy option for new items
    };
    select: {
      multi?: boolean; // default multi select option if 'select' type
      size?: number; // default size option if 'select' type
    };
  };

  constructor({
    id,
    name,
    description,
  }: {
    id?: string;
    name?: string;
    description?: string;
  } = {}) {
    this.name = name;
    this.id = id;
    this.description = description;
    this.fields = [];
    this.options = {
      textArea: {
        defaultRichText: false,
      },
      copy: {
        standalone: true,
      },
      select: {
        multi: false,
      },
    };
  }

  static from(o: any): Form {
    const form = new Form();
    for (const key in Object.entries(form)) {
      (form as any)[key] = o[key];
    }
    return form;
  }

  toJSONString(): string {
    return JSON.stringify(this, null, 2);
  }

  toPlainObject(): IForm {
    return JSON.parse(this.toString());
  }
}
