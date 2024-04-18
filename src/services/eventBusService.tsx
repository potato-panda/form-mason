import { useContext } from 'react';
import { Context } from '../providers/eventBusServiceProvider';

export const EventBusService = () => {
  const contextState = useContext(Context);
  if (contextState === null) {
    throw new Error(
      'EventBusService must be used within a EventBusServiceProvider'
    );
  }
  return contextState;
};
