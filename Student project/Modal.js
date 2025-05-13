// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-white p-5 rounded shadow-lg w-[600px]">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
