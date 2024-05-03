import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './modal.css';

export function Modal({
  content,
  closeModal,
}: {
  content: (args: { closeModal: () => void }) => ReactNode;
  closeModal: () => void;
}) {
  useEffect(() => {
    // close modal on escape key
    const escKeyListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      }
    };

    document.addEventListener('keydown', escKeyListener);

    return () => document.removeEventListener('keydown', escKeyListener);
  }, []);

  return createPortal(
    <>
      <div className="modal-container">{content({ closeModal })}</div>
      <div className="modal-backdrop"></div>
    </>,
    document.body
  );
}
