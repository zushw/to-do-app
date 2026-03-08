import { useState, useEffect } from 'react';

export function TaskModal({ isOpen, onClose, onSave, taskToEdit, categories, isSaving, currentUser }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const isOwner = !taskToEdit || taskToEdit.owner_username === currentUser?.username;

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      category: category ? parseInt(category) : null
    });
  };

  const isEditing = !!taskToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" required autoFocus className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea rows="3" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={!isOwner}
            >
              <option value="">No category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}

              {!isOwner && taskToEdit?.category_name && (
                <option value={taskToEdit.category} className="italic text-gray-500">
                  {taskToEdit.category_name} (Owner's Category)
                </option>
              )}
            </select>
            {!isOwner && (
              <p className="mt-1 text-xs text-orange-600">
                Only the owner ({taskToEdit.owner_username}) can change the category.
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={isSaving || !title.trim()} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400">
              {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Save Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}