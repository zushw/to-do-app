import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editTaskCategory, setEditTaskCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [tasksRes, categoriesRes] = await Promise.all([
        api.get('/tasks/'),
        api.get('/categories/')
      ]);
      setTasks(tasksRes.data.results);
      setCategories(categoriesRes.data.results);
    } catch (error) {
      console.error("Failed to fetch data:", error);

    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    setIsCreating(true);

    try {
      const payload = {
        title: newTaskTitle,
        description: newTaskDescription,
        is_completed: false,
        category: newTaskCategory ? parseInt(newTaskCategory) : null 
      };
      const response = await api.post('/tasks/', payload);
      setTasks([response.data, ...tasks]);

      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskCategory('');
      setIsModalOpen(false);

    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Error creating task. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleComplete(task) {
    try {
      const response = await api.put(`/tasks/${task.id}/change_status/`, {
        is_completed: !task.is_completed
      });

      setTasks(tasks.map((t) => (t.id === task.id ? response.data.task : t)));

    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Error updating task status. Please try again.");
    }
  }

  function handleDeleteClick(task) {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  }

  async function confirmDeleteTask() {
    if (!taskToDelete) return;
    setIsDeleting(true);

    try {
      await api.delete(`/tasks/${taskToDelete.id}/`);

      setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
      
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Error deleting task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEditClick(task) {
    setTaskToEdit(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || '');
    setEditTaskCategory(task.category || ''); 
    setIsEditModalOpen(true);
  }

  async function handleUpdateTask(e) {
    e.preventDefault();
    if (!taskToEdit) return;

    setIsEditing(true);

    try {
      const payload = {
        title: editTaskTitle,
        description: editTaskDescription,
        category: editTaskCategory ? parseInt(editTaskCategory) : null
      };
      const response = await api.put(`/tasks/${taskToEdit.id}/`, payload);
      setTasks(tasks.map((t) => (t.id === taskToEdit.id ? response.data : t)));

      setIsEditModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Error updating task. Please try again.");
    } finally {
      setIsEditing(false);
    }
  }

  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsCategoryLoading(true);
    try {
      const response = await api.post('/categories/', { name: newCategoryName });
      setCategories([response.data, ...categories]);
      setNewCategoryName('');
    } catch (error) {
      console.error("Failed to create category", error);
    } finally {
      setIsCategoryLoading(false);
    }
  }

  async function handleDeleteCategory(id) {
    try {
      await api.delete(`/categories/${id}/`);
      setCategories(categories.filter(c => c.id !== id));
      setTasks(tasks.map(t => t.category === id ? { ...t, category: null } : t));
    } catch (error) {
      alert("Cannot delete this category. It might be linked to existing tasks.");
    }
  }

  const getCategoryName = (categoryId) => {
    if (!categoryId) return null;
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : null;
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">To-Do App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <strong className="text-gray-900">{user?.username}</strong>!
              </span>
              <button
                onClick={signOut}
                className="rounded bg-red-50 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Manage Categories
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              + New Task
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading your data...</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              You don't have any tasks yet. Create one above!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">

                      <div className="mt-1">
                        <input
                          type="checkbox"
                          checked={task.is_completed}
                          onChange={() => handleToggleComplete(task)}
                          className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className={`text-base font-medium ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          {task.category && (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {getCategoryName(task.category)}
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                        )}

                        {task.is_completed && task.external_quote && (
                          <blockquote className="mt-2 border-l-2 border-blue-300 bg-blue-50 pl-3 pr-2 py-1 text-sm italic text-blue-600 rounded-r">
                            "{task.external_quote}"
                          </blockquote>
                        )}
                      </div>

                    </div>

                    <div className="flex space-x-2">
                        <button 
                            onClick={() => handleEditClick(task)}
                            className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                        >
                        Edit
                        </button>
                        <button 
                            onClick={() => handleDeleteClick(task)}
                            className="text-sm text-gray-400 hover:text-red-600 transition-colors"
                        >
                        Delete
                        </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" required autoFocus className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea rows="3" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category (Optional)</label>
                <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 bg-white" value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)}>
                  <option value="">No Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={isCreating || !newTaskTitle.trim()} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Task</h3>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" required autoFocus className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" value={editTaskTitle} onChange={(e) => setEditTaskTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea rows="3" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" value={editTaskDescription} onChange={(e) => setEditTaskDescription(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category (Optional)</label>
                <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 bg-white" value={editTaskCategory} onChange={(e) => setEditTaskCategory(e.target.value)}>
                  <option value="">No Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
            <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing || !editTaskTitle.trim()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isEditing ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Delete Task</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete <strong className="text-gray-700">"{taskToDelete?.title}"</strong>? This action cannot be undone.
            </p>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                disabled={isDeleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-400"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Manage Categories</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateCategory} className="mb-6 flex space-x-2">
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
                disabled={isCategoryLoading || !newCategoryName.trim()}
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
                      <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700"
                        title="Delete category"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}