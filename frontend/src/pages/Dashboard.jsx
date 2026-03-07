import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useDashboard } from '../hooks/useDashboard';

import { Navbar } from '../components/Navbar';
import { TaskItem } from '../components/TaskItem';
import { TaskModal } from '../components/TaskModal';
import { DeleteModal } from '../components/DeleteModal';
import { CategoryModal } from '../components/CategoryModal';

export function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  
  const {
    tasks, categories, isLoading, isProcessing,
    isTaskModalOpen, setIsTaskModalOpen, taskToEdit, setTaskToEdit,
    isDeleteModalOpen, setIsDeleteModalOpen, taskToDelete, setTaskToDelete,
    isCategoryModalOpen, setIsCategoryModalOpen,
    handleSaveTask, handleToggleComplete, handleDeleteTask,
    handleCreateCategory, handleUpdateCategory, handleDeleteCategory,
    getCategoryName
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      
      <Navbar user={user} onSignOut={signOut} />

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
              onClick={() => { setTaskToEdit(null); setIsTaskModalOpen(true); }}
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
            <div className="p-8 text-center text-gray-500">You don't have any tasks yet. Create one above!</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  categoryName={getCategoryName(task.category)}
                  onToggleComplete={handleToggleComplete}
                  onEdit={() => { setTaskToEdit(task); setIsTaskModalOpen(true); }}
                  onDelete={() => { setTaskToDelete(task); setIsDeleteModalOpen(true); }}
                />
              ))}
            </ul>
          )}
        </div>
      </main>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => { setIsTaskModalOpen(false); setTaskToEdit(null); }} 
        onSave={handleSaveTask} taskToEdit={taskToEdit} categories={categories} isSaving={isProcessing} 
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteTask} itemName={taskToDelete?.title} isDeleting={isProcessing} 
      />

      <CategoryModal 
        isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} 
        categories={categories} onCreate={handleCreateCategory} onUpdate={handleUpdateCategory} 
        onDelete={handleDeleteCategory} isLoading={isProcessing} 
      />
    </div>
  );
}