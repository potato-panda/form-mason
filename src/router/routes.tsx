import FormBuilder from '../views/formBuilder';
import { FormList } from '../views/formList';

type Route = {
  [path: string]: {
    component: (...args: any) => React.JSX.Element;
    children?: Route[];
  };
};

export type RoutePath = keyof Route;

export const Routes: Route = {
  '/': { component: FormList },
  '/formbuilder': { component: FormBuilder },
};
