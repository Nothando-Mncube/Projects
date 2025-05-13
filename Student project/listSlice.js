import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import { mutate } from 'swr';

const listSlice = createSlice({
  name: "listSlice",
  initialState: {
    list: [],
  },
  reducers: {
    setLists: (state, action) => {
      state.list = action.payload;
    },
    addList: (state, action) => {
      const newList = {
        id: uuidv4(),  
        title: action.payload.title,
        cards: [],  // Initialize with an empty array of cards
      };
      state.list.push(newList);

      // Optimistically update the cache
      mutate('https://hoopoe-server.onrender.com/fetch-task', async (tasks) => {
        await fetch('https://hoopoe-server.onrender.com/add-task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newList),
        });
        return [...tasks, newList]; 
      }, false);
    },
    addCard: (state, action) => {
      const list = state.list.find(item => item.id === action.payload.parentId);
      if (list) {
        const newCard = {
          id: uuidv4(),  
          title: action.payload.title,
          description: action.payload.description,
          dueDate: action.payload.dueDate,
          parentId: list.id,
        };
        list.cards.push(newCard);

        // Optimistically update the cache
        mutate('https://hoopoe-server.onrender.com/fetch-task', async (tasks) => {
          await fetch('https://hoopoe-server.onrender.com/add-task', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...newCard,
              parentId: list.id,
            }),
          });
          return tasks.map(task => 
            task.id === list.id ? { ...task, cards: [...task.cards, newCard] } : task
          );
        }, false);
      }
    },
    updateList: (state, action) => {
      const list = state.list.find(item => item.id === action.payload.id);
      if (list) {
        list.title = action.payload.title;

        // Optimistically update the cache
        mutate('https://hoopoe-server.onrender.com/fetch-task', async (tasks) => {
          await fetch('https://hoopoe-server.onrender.com/update-task', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(list),
          });
          return tasks.map(task => task.id === list.id ? list : task);
        }, false);
      }
    },
    updateCard: (state, action) => {
      const list = state.list.find(item => item.id === action.payload.parentId);
      const card = list.cards.find(child => child.id === action.payload.id);
      if (card) {
        card.title = action.payload.title;
        card.description = action.payload.description;
        card.dueDate = action.payload.dueDate;

        // Optimistically update the cache
        mutate('https://hoopoe-server.onrender.com/fetch-task', async (tasks) => {
          await fetch('https://hoopoe-server.onrender.com/update-task', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(card),
          });
          return tasks.map(task => {
            if (task.id === list.id) {
              return {
                ...task,
                cards: task.cards.map(c => c.id === card.id ? card : c),
              };
            }
            return task;
          });
        }, false);
      }
    },
    deleteList: (state, action) => {
      state.list = state.list.filter(item => item.id !== action.payload.id);

      // Optimistically update the cache
      mutate('https://hoopoe-server.onrender.com/fetch-task', async (tasks) => {
        await fetch(`https://hoopoe-server.onrender.com/delete-task/${action.payload.id}`, {
          method: 'DELETE',
        });
        return tasks.filter(task => task.id !== action.payload.id);
      }, false);
    },
    deleteChildList: (state, action) => {
      const list = state.list.find(item => item.id === action.payload.parentId);
      if (list) {
        list.cards = list.cards.filter(child => child.id !== action.payload.id);

        // Optimistically update the cache
        mutate('https://hoopoe-server.onrender.com/fetch-task', async (tasks) => {
          await fetch(`https://hoopoe-server.onrender.com/delete-task/${action.payload.id}`, {
            method: 'DELETE',
          });
          return tasks.map(task => {
            if (task.id === list.id) {
              return {
                ...task,
                cards: task.cards.filter(c => c.id !== action.payload.id),
              };
            }
            return task;
          });
        }, false);
      }
    },
    reorderLists: (state, action) => {
      const [removed] = state.list.splice(action.payload.startIndex, 1);
      state.list.splice(action.payload.endIndex, 0, removed);
    },
    moveCard: (state, action) => {
      const { sourceListId, destinationListId, sourceIndex, destinationIndex } = action.payload;
    
      const sourceList = state.list.find(list => list.id === sourceListId);
      const destinationList = state.list.find(list => list.id === destinationListId);
    
      if (!sourceList || !destinationList) return;
    
      const [movedCard] = sourceList.cards.splice(sourceIndex, 1);
      movedCard.parentId = destinationListId; // Update the parentId for the moved card
    
      destinationList.cards.splice(destinationIndex, 0, movedCard);

      // Optimistically update the cache
      mutate('https://hoopoe-server.onrender.com/fetch-task', async () => {
        await fetch('https://hoopoe-server.onrender.com/update-task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movedCard),
        });
        return state.list;
      }, false);
    }
  },
});

export const { addList, addCard, setLists, updateList, updateCard, deleteList, deleteChildList, reorderLists, moveCard } = listSlice.actions;
export default listSlice.reducer;
