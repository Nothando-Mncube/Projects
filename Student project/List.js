// List.js
import React, { useState, useContext } from 'react';
import Card from './Card';
import AddNew from './AddNew';
import ListEditForm from './ListEditForm';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import StoreApi from '../store/StoreApi';

const List = ({ list, index }) => {
  const { updateListTitle,  } = useContext(StoreApi);
  const [editingList, setEditingList] = useState(false);

  

  const stopEditingList = () => {
    setEditingList(false);
  };

  const handleUpdateList = (title) => {
    updateListTitle(title, list.id);
    stopEditingList();
  };

  

  return (
    <Draggable draggableId={list.id} index={index} key={index}>
      {(provided) => (
        <div
          className="p-3 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 m-auto"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className={`p-3 bg-gray-200 rounded-lg`} {...provided.dragHandleProps}>
            {editingList ? (
              <ListEditForm
                list={list}
                onSave={handleUpdateList}
                onCancel={stopEditingList}
              />
            ) : (
              <div className="flex flex-row justify-between items-center mb-4">
                <p className="text-lg">{list.title}</p>
                <div className="flex flex-row gap-3">
                  {/* List title and controls */}
                </div>
              </div>
            )}
            <Droppable droppableId={String(list.id)} type="card">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {list.cards?.length > 0 &&
                    list.cards.map((card, index) => (
                      <Card key={card.id} card={card} index={index} listId={list.id} />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="mt-3">
              {list.id === 'to-do' && <AddNew type="card" parentId={list.id} />}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default List;
