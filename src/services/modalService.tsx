import { useContext } from 'react';
import { Context } from '../providers/modalServiceProvider';

export const ModalService = () => {
  const contextState = useContext(Context);
  if (contextState === null) {
    throw new Error('ModalService must be used within a ModalServiceProvider');
  }

  return contextState;
};
