import React, { useState, useContext } from 'react';
import CardEditForm from "./CardEditForm";
import CardDetailsDialog from "./CardDetailsDialog";
import { Draggable } from "react-beautiful-dnd";
import StoreApi from "../store/StoreApi";
import { mutate } from 'swr';

const Card = ({ card, index, listId }) => {
  const [editingCard, setEditingCard] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { removeCard, updateCardTitle } = useContext(StoreApi);

  const removeChild = async () => {
    removeCard(index, listId, card.id);

    // Optimistically update the local cache
    mutate('https://hoopoe-server.onrender.com/fetch-task', async (tasks) => {
      await fetch(`https://hoopoe-server.onrender.com/delete-task/${card.id}`, {
        method: 'DELETE',
      });
      return tasks.filter(task => task._id !== card.id); // Filter out the deleted task
    }, false);
  };

  const startEditingCard = () => {
    setEditingCard(true);
  };

  const stopEditingCard = () => {
    setEditingCard(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleUpdateCard = async (title, description, dueDate) => {
    updateCardTitle(title, index, listId, card.id);
    stopEditingCard();

    // Optimistically update the local cache
    mutate('https://hoopoe-server.onrender.com/fetch-task', async (tasks) => {
      await fetch(`https://hoopoe-server.onrender.com/update-task/${card.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: card.id, title, description, dueDate }),
      });
      return tasks.map(task => 
        task._id === card.id ? { ...task, title, description, dueDate } : task
      ); // Update the modified task in the list
    }, false);
  };

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided) => (
        <div
          className='bg-white p-2 mt-2 shadow-md rounded-md cursor-pointer'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {editingCard ? (
            <CardEditForm
              cardInfo={card}
              onSave={handleUpdateCard}
              onCancel={stopEditingCard}
            />
          ) : (
            <div className="flex flex-row items-center">
              <div className="flex-1 gap-1" onClick={openDialog}>
                <p>{card.title}</p>
                <p className="text-gray-500">Due: {card.dueDate}</p>
              </div>
              <div className="flex flex-row items-center gap-3">
                <button
                  title="Edit Card"
                  onClick={startEditingCard}
                  className="text-back p-2 bg-gray-300 rounded-full font-bold ml-2"
                >
                  {/* Edit SVG icon */}
                </button>
                <button
                  title="Delete Card"
                  className="text-back p-2 bg-gray-300 rounded-full  font-bold"
                  onClick={removeChild}
                >
                  {/* Delete SVG icon */}
                </button>
              </div>
            </div>
          )}
          {isDialogOpen && <CardDetailsDialog cardInfo={card} onClose={closeDialog} />}
        </div>
      )}
    </Draggable>
  );
};

export default Card;
