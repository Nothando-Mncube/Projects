// AddNew.js
import React, { useState } from "react";
import Modal from "./Modal"; // Import the Modal component

const AddNew = ({ type, parentId }) => {
  const [inputVal, setInputVal] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!inputVal) return;

    // Add your logic to post the card data to the server
    // ...

    closeModal();
    setInputVal("");
    setDescription("");
    setDueDate("");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="add-new-button"> {/* Apply CSS class here */}
      <button onClick={openModal} className="bg-orange-600 text-white px-3 py-1 rounded">
        + Add {type === "card" ? "a card" : "a list"}
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={submitHandler} className="flex flex-col">
          <input
            autoFocus
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full h-10 p-2 mb-2 border rounded"
            placeholder={type === "card" ? "Enter card title..." : "Enter list title..."}
          />
          {type === "card" && (
            <>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-20 p-2 mb-2 border rounded"
                placeholder="Enter description..."
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 p-2 mb-2 border rounded"
              />
            </>
          )}
          <div className="mt-3">
            <button type="button" onClick={closeModal} className="mr-3 px-3 py-1 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-orange-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddNew;
