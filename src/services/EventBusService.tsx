import { useContext } from 'react';
import { Context } from '../providers/EventBusServiceProvider';

export const EventBusService = () => {
  const contextState = useContext(Context);
  if (contextState === null) {
    throw new Error(
      'EventBusService must be used within a EventBusServiceProvider'
    );
  }
  return contextState;
};
