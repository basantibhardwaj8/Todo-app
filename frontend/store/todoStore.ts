import create from 'zustand';
import axios from 'axios';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  format: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  alignment: 'left' | 'center' | 'right';
  createdAt: string;
  updatedAt: string;
}

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  selectedTodo: Todo | null;
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTodo: (id: string, todo: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  setSelectedTodo: (todo: Todo | null) => void;
}

const API_URL = 'http://localhost:5003/api/todos';

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  isLoading: false,
  error: null,
  selectedTodo: null,
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ todos: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch todos', isLoading: false });
      console.error('Error fetching todos:', error);
    }
  },

  addTodo: async (todo) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(API_URL, todo);
      set((state) => ({
        todos: [...state.todos, response.data],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add todo', isLoading: false });
      console.error('Error adding todo:', error);
    }
  },

  updateTodo: async (id, todo) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, todo);
      set((state) => ({
        todos: state.todos.map((t) => (t._id === id ? response.data : t)),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update todo', isLoading: false });
      console.error('Error updating todo:', error);
    }
  },

  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo._id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete todo', isLoading: false });
      console.error('Error deleting todo:', error);
    }
  }
}));

export default useTodoStore; 