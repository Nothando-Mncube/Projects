import React from "react";

const CardDetailsDialog = ({ cardInfo, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">{cardInfo.title}</h2>
        <p className="mb-2"><strong>Description:</strong> {cardInfo.description}</p>
        <p className="mb-4"><strong>Due Date:</strong> {cardInfo.dueDate}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-orange-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CardDetailsDialog;
