import { useContext } from 'react';
import { Context } from '../providers/RoutingServiceProvider';

export const Router = () => {
  const contextState = useContext(Context);
  if (contextState === null) {
    throw new Error(
      'NavigationService must be used within a NavigationServiceProvider'
    );
  }
  return contextState;
};

export default Router;
