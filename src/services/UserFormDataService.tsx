import { useContext } from 'react';
import { Context } from '../providers/UserFormServiceProvider';

export const UserFormDataService = () => {
  const contextState = useContext(Context);
  if (contextState === null) {
    throw new Error(
      'UserFormDataService must be used within a UserFormDataServiceProvider'
    );
  }

  return contextState;
};
