import FormBuilder from '../views/form/FormBuilder';
import { FormList } from '../views/form/FormList';

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
