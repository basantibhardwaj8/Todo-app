import React, { useState } from 'react';
import { Todo } from '../store/todoStore';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight } from 'react-icons/md';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

interface TodoProps {
  todo: Todo;
  onUpdate: (id: string, todo: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TodoComponent: React.FC<TodoProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [format, setFormat] = useState(todo.format || {
    bold: false,
    italic: false,
    underline: false
  });
  const [alignment, setAlignment] = useState(todo.alignment || 'left');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(todo._id, {
      title,
      description,
      format,
      alignment
    });
    setIsEditing(false);
  };

  const toggleFormat = (type: keyof typeof format) => {
    setFormat(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getTextStyle = () => {
    return {
      fontWeight: format?.bold ? 'bold' : 'normal',
      fontStyle: format?.italic ? 'italic' : 'normal',
      textDecoration: format?.underline ? 'underline' : 'none',
      textAlign: alignment || 'left'
    };
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="bg-white p-3 sm:p-4 rounded-lg shadow-md mb-4 w-full max-w-3xl mx-auto">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded text-sm sm:text-base"
          placeholder="Title"
        />
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
          <button
            type="button"
            onClick={() => toggleFormat('bold')}
            className={`p-1.5 sm:p-2 rounded text-sm sm:text-base ${format.bold ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <FaBold />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('italic')}
            className={`p-1.5 sm:p-2 rounded text-sm sm:text-base ${format.italic ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <FaItalic />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('underline')}
            className={`p-1.5 sm:p-2 rounded text-sm sm:text-base ${format.underline ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <FaUnderline />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('left')}
            className={`p-1.5 sm:p-2 rounded text-sm sm:text-base ${alignment === 'left' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <MdFormatAlignLeft />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('center')}
            className={`p-1.5 sm:p-2 rounded text-sm sm:text-base ${alignment === 'center' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <MdFormatAlignCenter />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('right')}
            className={`p-1.5 sm:p-2 rounded text-sm sm:text-base ${alignment === 'right' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <MdFormatAlignRight />
          </button>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 p-2 border rounded text-sm sm:text-base"
          placeholder="Description"
          rows={3}
          style={getTextStyle()}
        />
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className="bg-white p-3 sm:p-4 rounded-lg shadow-md mb-4 w-full max-w-3xl mx-auto cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base sm:text-xl font-semibold">{title}</h3>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-500"
          >
            <AiOutlineEdit className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(todo._id);
            }}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-red-500"
          >
            <AiOutlineDelete className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      <p style={getTextStyle()} className="text-sm sm:text-base text-gray-700">
        {description}
      </p>
      <div className="mt-2 text-xs sm:text-sm text-gray-500">
        Last updated: {new Date(todo.updatedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default TodoComponent;
