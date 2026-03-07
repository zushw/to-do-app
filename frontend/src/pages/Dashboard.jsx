import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setIsLoading(true);
    try {
      const response = await api.get('/tasks/');
      
      setTasks(response.data.results);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      alert("Error loading tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await api.post('/tasks/', {
        title: newTaskTitle,
        description: newTaskDescription,
        is_completed: false
      });

      setTasks([response.data, ...tasks]);
      
      setNewTaskTitle('');
      setNewTaskDescription('');
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
      const newStatus = !task.is_completed;
      
      const response = await api.put(`/tasks/${task.id}/change_status/`, {
        is_completed: newStatus
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
    setIsEditModalOpen(true);
  }

  async function handleUpdateTask(e) {
    e.preventDefault();
    if (!taskToEdit) return;
    
    setIsEditing(true);

    try {
      const response = await api.patch(`/tasks/${taskToEdit.id}/`, {
        title: editTaskTitle,
        description: editTaskDescription
      });

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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            + New Task
          </button>
        </div>

        <div className="rounded-lg bg-white shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading tasks...</div>
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
                      <h3 className={`text-base font-medium ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                      )}
                        
                        {task.is_completed && task.external_quote && (
                          <blockquote className="mt-2 border-l-2 border-blue-300 pl-3 text-sm italic text-blue-600 bg-blue-50 py-1 pr-2 rounded-r">
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
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Create New Task</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  rows="3"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Add some details..."
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTaskTitle.trim()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isCreating ? 'Saving...' : 'Save Task'}
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

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Edit Task</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  rows="3"
                  value={editTaskDescription}
                  onChange={(e) => setEditTaskDescription(e.target.value)}
                />
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
    </div>
  );
}