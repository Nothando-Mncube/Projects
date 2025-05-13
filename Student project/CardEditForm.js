import React, { useState } from "react";

const CardEditForm = ({ cardInfo, onSave, onCancel }) => {
  const [title, setTitle] = useState(cardInfo.title);
  const [description, setDescription] = useState(cardInfo.description);
  const [dueDate, setDueDate] = useState(cardInfo.dueDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(title, description, dueDate);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 mt-2 shadow-md rounded-md">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full h-10 p-2 mb-2 border border-gray-300"
        placeholder="Enter card title..."
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-20 p-2 mb-2 border border-gray-300"
        placeholder="Enter description..."
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full h-10 p-2 mb-2 border border-gray-300"
      />
      <div className="mt-3">
        <button type="button" onClick={onCancel} className="mr-3">
          Cancel
        </button>
        <button type="submit" className="px-3 py-1 bg-orange-600 text-white">
          Save
        </button>
      </div>
    </form>
  );
};

export default CardEditForm;
