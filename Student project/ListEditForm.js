import React, { useState } from "react";

const ListEditForm = ({ list, onSave, onCancel }) => {
  const [title, setTitle] = useState(list.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(title);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full h-10 p-2"
        placeholder="Enter list title..."
      />
      <div className="mt-3">
        <button type="button" onClick={onCancel} className="mr-3">
          Cancel
        </button>
        <button type="submit" className="px-3 py-1 bg-blue-500 text-white">
          Save
        </button>
      </div>
    </form>
  );
};

export default ListEditForm;
