// BodyComponents.js
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import List from './List';
import StoreApi from '../store/StoreApi';
import { v4 as uuid } from 'uuid';
import useSWR from 'swr';



export default function BodyComponents() {
  const [lists, setLists] = useState([
    { id: 'to-do', title: 'To-Do', cards: [] },
    { id: 'in-progress', title: 'In Progress', cards: [] },
    { id: 'done', title: 'Done', cards: [] },
  ]);

  // Fetch tasks using useSWR
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data, error, isLoading } = useSWR('https://hoopoe-server.onrender.com/fetch-tasks', fetcher);
  console.log(data)

  useEffect(() => {
    if (data) {
      // Assuming data is an array of tasks with a 'status' field
      const updatedLists = lists.map(list => {
        const listCards = data.filter(task => task.status === list.id).map(task => ({
          id: task._id,
          title: task.description,
          description: task.description,
          dueDate: task.date,
        }));
        return { ...list, cards: listCards };
      });

      setLists(updatedLists);
    }
  }, [data]);

  if (error) return <div>Error loading tasks</div>;
  if (isLoading) return <div>Loading...</div>;

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const sourceList = lists.find(list => list.id === source.droppableId);
    const destinationList = lists.find(list => list.id === destination.droppableId);

    if (!sourceList || !destinationList) return;

    const [movedCard] = sourceList.cards.splice(source.index, 1);
    destinationList.cards.splice(destination.index, 0, movedCard);

    setLists([...lists]);
  };

  const addMoreCard = (title, listId) => {
    if (!title) return;
    const newCard = {
      id: uuid(),
      title,
      description: '',
      date: ''
    };

    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        list.cards.push(newCard);
      }
      return list;
    });

    setLists(updatedLists);
  };

  const updateCardTitle = (title, index, listId) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        list.cards[index].title = title;
      }
      return list;
    });

    setLists(updatedLists);
  };

  const removeCard = (index, listId) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        list.cards.splice(index, 1);
      }
      return list;
    });

    setLists(updatedLists);
  };

  const updateListTitle = (title, listId) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        list.title = title;
      }
      return list;
    });

    setLists(updatedLists);
  };

  const deleteList = (listId) => {
    // Do nothing since list deletion is not allowed
    return;
  };

  return (
    <div>
       {/* Place the add button at the top */}
      <DragDropContext onDragEnd={onDragEnd}>
        <StoreApi.Provider value={{
          addMoreCard,
          removeCard,
          updateCardTitle,
          updateListTitle,
          deleteList
        }}>
          <Droppable droppableId="app" direction="horizontal" type="list">
            {(provided) => (
              <div
                className="flex w-full p-3 bg-light mt-10"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {lists.map((list, index) => (
                  <List key={list.id} list={list} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </StoreApi.Provider>
      </DragDropContext>
    </div>
  );
}
