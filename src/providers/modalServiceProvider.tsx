import React from 'react';
import { FC, ReactNode, createContext, useState } from 'react';
import { createPortal } from 'react-dom';
import '../components/modals/modal.css';

type ContextState = {
  createModal: ({
    content,
    header,
    footer,
  }: {
    content: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
  }) => {
    open: () => void;
    close: () => void;
  };
};

export const Context = createContext<ContextState | null>(null);

export const ModalServiceProvider: FC<{ children: React.ReactNode }> = (
  props
) => {
  const [state, setState] = useState<{
    show: boolean;
    modal?: React.ReactPortal | null;
  }>({
    show: false,
  });

  const createModal = ({
    content,
    header,
    footer,
  }: {
    content: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
  }) => {
    const modal = createPortal(
      <>
        <div className="modal">
          {header && <div className="modal-header">{header}</div>}
          {content}
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
        <div className="modal-backdrop"></div>
      </>,
      document.body
    );

    return {
      open: () => {
        setState({
          show: true,
          modal,
        });
      },
      close: () => {
        setState({
          show: false,
        });
      },
    };
  };

  return (
    <>
      <Context.Provider value={{ createModal }}>
        {props.children}
        {state.show && state.modal}
      </Context.Provider>
    </>
  );
};
