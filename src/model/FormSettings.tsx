export interface FormSettings {
  textArea?: { defaultRichText?: boolean }; // default richtext option if 'textarea' type
  copy?: { standalone?: boolean }; // default standalone copy option for new items
  select?: {
    multi?: boolean; // default multi select option if 'select' type
    size?: number; // default size option if 'select' type
  };
}
