import { useState } from 'react';

export function CategoryModal({ 
  isOpen, onClose, categories, onCreate, onDelete, onUpdate, isLoading 
}) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await onCreate(newCategoryName);
    setNewCategoryName('');
  };

  const startEditing = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleSaveEdit = async (categoryId) => {
    if (editingCategoryName.trim()) {
      await onUpdate(categoryId, editingCategoryName);
    }
    cancelEditing();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Manage Categories</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleCreate} className="mb-6 flex space-x-2">
          <input 
            type="text" 
            placeholder="New category name..." 
            required
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={isLoading || !newCategoryName.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            Add
          </button>
        </form>

        <div className="max-h-60 overflow-y-auto rounded-md border border-gray-200">
          {categories.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No categories created yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {categories.map(cat => (
                <li key={cat.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                  {editingCategoryId === cat.id ? (
                    <div className="flex w-full items-center space-x-2">
                      <input
                        type="text" autoFocus className="flex-1 rounded border border-blue-500 px-2 py-1 text-sm outline-none"
                        value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(cat.id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <button onClick={() => handleSaveEdit(cat.id)} className="text-xs font-bold text-green-600 hover:text-green-800">Save</button>
                      <button onClick={cancelEditing} className="text-xs font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      <div className="flex space-x-3">
                        <button onClick={() => startEditing(cat)} className="text-xs font-medium text-blue-500 hover:text-blue-700">Edit</button>
                        <button onClick={() => onDelete(cat.id)} className="text-xs font-medium text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}