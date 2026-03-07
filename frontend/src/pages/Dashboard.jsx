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
    tasks, pendingTasks, completedTasks, categories, isLoading, isProcessing,
    searchQuery, setSearchQuery, filterCategory, setFilterCategory, fetchFilteredTasks,
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
            <button onClick={() => setIsCategoryModalOpen(true)} className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              Manage Categories
            </button>
            <button onClick={() => { setTaskToEdit(null); setIsTaskModalOpen(true); }} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
              + New Task
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search tasks by title..."
              className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchFilteredTasks()}
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="w-full sm:w-64">
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                fetchFilteredTasks(searchQuery, e.target.value); 
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => fetchFilteredTasks()}
            className="rounded-md bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300"
          >
            Search
          </button>
        </div>

        <div className="rounded-lg bg-white shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading your data...</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">You don't have any tasks yet. Create one above!</div>
          ) : (
            <div className="divide-y divide-gray-200">
              
              {pendingTasks.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {pendingTasks.map((task) => (
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
              ) : (
                <div className="p-8 text-center text-gray-500 italic">
                  No pending tasks. Great job!
                </div>
              )}

              {completedTasks.length > 0 && (
                <div>
                  <div className="bg-gray-50 px-4 py-2 border-y border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Completed ({completedTasks.length})
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200 opacity-75 bg-gray-50/50">
                    {completedTasks.map((task) => (
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
                </div>
              )}
              
            </div>
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