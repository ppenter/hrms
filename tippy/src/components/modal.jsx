import React, { useState } from 'react';
import Button from './button';

const Modal = ({ isOpen, onClose, children,title, className, ...rest }) => {
  const modalOverlayStyle = isOpen ? 'overflow-auto flex flex-col fixed inset-0 flex items-center justify-start bg-black bg-opacity-50' : 'hidden';
  const modalContainerStyle = isOpen ? 'mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8' : 'hidden';

  return (
    <div className={modalOverlayStyle}>
      <div className={modalContainerStyle + ` ${className}`} {...rest}>
        <div className="flex justify-between items-center gap-4">
            <h4>{title}</h4>
          <Button onClick={onClose} variant='danger' type='clear'>X</Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
