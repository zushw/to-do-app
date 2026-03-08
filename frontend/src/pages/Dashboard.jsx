import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { ShareModal } from '../components/ShareModal';

import { Navbar } from '../components/Navbar';
import { TaskItem } from '../components/TaskItem';
import { TaskModal } from '../components/TaskModal';
import { DeleteModal } from '../components/DeleteModal';
import { CategoryModal } from '../components/CategoryModal';
import { Pagination } from '../components/Pagination';

export function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  
  const {
    pendingTasks, pendingPage, pendingHasNext, pendingHasPrev, nextPendingPage, prevPendingPage,
    completedTasks, completedPage, completedHasNext, completedHasPrev, nextCompletedPage, prevCompletedPage,
    categories, isLoading, isProcessing,
    searchQuery, setSearchQuery, filterCategory, setFilterCategory, fetchFilteredTasks,
    isTaskModalOpen, setIsTaskModalOpen, taskToEdit, setTaskToEdit,
    isDeleteModalOpen, setIsDeleteModalOpen, taskToDelete, setTaskToDelete,
    isCategoryModalOpen, setIsCategoryModalOpen,
    handleSaveTask, handleToggleComplete, handleDeleteTask,
    handleCreateCategory, handleUpdateCategory, handleDeleteCategory,
    isShareModalOpen, setIsShareModalOpen, taskToShare, setTaskToShare,
    handleShareTask, handleUnshareTask, usersList
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col">
      <Navbar user={user} onSignOut={signOut} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
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
            <input type="text" placeholder="Search tasks..." className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchFilteredTasks()} />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="w-full sm:w-64">
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white" value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); fetchFilteredTasks(searchQuery, e.target.value); }}>
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <button onClick={() => fetchFilteredTasks()} className="rounded-md bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 border border-gray-300">Search</button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500 text-lg">Loading your tasks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            <div className="flex flex-col bg-white rounded-lg shadow border border-gray-200 min-h-[400px]">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 rounded-t-lg">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">To Do</h3>
              </div>
              
              <ul className="divide-y divide-gray-200 flex-1 overflow-y-auto max-h-[60vh]">
                {pendingTasks.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 italic">No pending tasks. You're all caught up!</div>
                ) : (
                  pendingTasks.map((task) => (
                    <TaskItem key={task.id} task={task} currentUser={user} categoryName={task.category_name} onToggleComplete={handleToggleComplete} onEdit={() => { setTaskToEdit(task); setIsTaskModalOpen(true); }} onDelete={() => { setTaskToDelete(task); setIsDeleteModalOpen(true); }} onShareClick={() => { setTaskToShare(task); setIsShareModalOpen(true); }} />
                  ))
                )}
              </ul>
              
              <Pagination page={pendingPage} hasNext={pendingHasNext} hasPrev={pendingHasPrev} onNext={nextPendingPage} onPrev={prevPendingPage} />
            </div>

            <div className="flex flex-col bg-white rounded-lg shadow border border-gray-200 min-h-[400px]">
              <div className="border-b border-gray-200 bg-blue-50 px-4 py-3 rounded-t-lg">
                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider">Completed</h3>
              </div>
              
              <ul className="divide-y divide-gray-200 flex-1 overflow-y-auto max-h-[60vh] opacity-80">
                {completedTasks.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 italic">No tasks completed yet. Let's get to work!</div>
                ) : (
                  completedTasks.map((task) => (
                    <TaskItem key={task.id} task={task} currentUser={user} categoryName={task.category_name} onToggleComplete={handleToggleComplete} onEdit={() => { setTaskToEdit(task); setIsTaskModalOpen(true); }} onDelete={() => { setTaskToDelete(task); setIsDeleteModalOpen(true); }} onShareClick={() => { setTaskToShare(task); setIsShareModalOpen(true); }} />
                  ))
                )}
              </ul>

              <Pagination page={completedPage} hasNext={completedHasNext} hasPrev={completedHasPrev} onNext={nextCompletedPage} onPrev={prevCompletedPage} />
            </div>

          </div>
        )}
      </main>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => { setIsTaskModalOpen(false); setTaskToEdit(null); }} 
        onSave={handleSaveTask} taskToEdit={taskToEdit} categories={categories} isSaving={isProcessing} currentUser={user} 
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

      <ShareModal 
        isOpen={isShareModalOpen} onClose={() => { setIsShareModalOpen(false); setTaskToShare(null); }} 
        task={taskToShare}
        onShare={handleShareTask} onUnshare={handleUnshareTask} isLoading={isProcessing} 
        usersList={usersList} 
      />
    </div>
  );
}