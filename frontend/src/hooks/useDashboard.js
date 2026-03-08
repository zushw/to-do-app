import { useState, useEffect, useCallback } from 'react';import api from '../services/api';
import { getApiErrorMessage } from '../utils';

export function useDashboard() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [pendingTasks, setPendingTasks] = useState([]);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingHasNext, setPendingHasNext] = useState(false);
  const [pendingHasPrev, setPendingHasPrev] = useState(false);

  const [completedTasks, setCompletedTasks] = useState([]);
  const [completedPage, setCompletedPage] = useState(1);
  const [completedHasNext, setCompletedHasNext] = useState(false);
  const [completedHasPrev, setCompletedHasPrev] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [taskToShare, setTaskToShare] = useState(null);

  const [usersList, setUsersList] = useState([]);

  const fetchPending = useCallback(async (page, search, cat) => {
    try {
      const res = await api.get('/tasks/', { params: { is_completed: 'false', page, search: search || undefined, category: cat || undefined } });
      setPendingTasks(res.data.results);
      setPendingHasNext(!!res.data.next);
      setPendingHasPrev(!!res.data.previous);
      setPendingPage(page);
    } catch (error) { console.error(error); }
  }, []);

  const fetchCompleted = useCallback(async (page, search, cat) => {
    try {
      const res = await api.get('/tasks/', { params: { is_completed: 'true', page, search: search || undefined, category: cat || undefined } });
      setCompletedTasks(res.data.results);
      setCompletedHasNext(!!res.data.next);
      setCompletedHasPrev(!!res.data.previous);
      setCompletedPage(page);
    } catch (error) { console.error(error); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesRes = await api.get('/categories/');
      setCategories(categoriesRes.data.results);
    } catch (error) { console.error(error); }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const usersRes = await api.get('/users/');
      setUsersList(usersRes.data.results || usersRes.data);
    } catch (error) { console.error(error); }
  }, []);

  useEffect(() => {
    let isMounted = true; 

    const loadAllTasks = async () => {
      await Promise.all([ 
        fetchPending(pendingPage, searchQuery, filterCategory), 
        fetchCompleted(completedPage, searchQuery, filterCategory) 
      ]);
    };

    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([loadAllTasks(), fetchCategories(), fetchUsers()]);
      if (isMounted) setIsLoading(false);
    };

    loadInitialData();

    const intervalId = setInterval(() => {
      if (isMounted) {
        loadAllTasks();
        fetchCategories(); 
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchPending, fetchCompleted, fetchCategories, fetchUsers, pendingPage, completedPage, searchQuery, filterCategory]);

  const fetchFilteredTasks = async () => {
    setIsLoading(true);
    await Promise.all([ 
      fetchPending(1, searchQuery, filterCategory), 
      fetchCompleted(1, searchQuery, filterCategory) 
    ]);
    setIsLoading(false);
  };

  const nextPendingPage = () => { if(pendingHasNext) fetchPending(pendingPage + 1); };
  const prevPendingPage = () => { if(pendingHasPrev) fetchPending(pendingPage - 1); };
  const nextCompletedPage = () => { if(completedHasNext) fetchCompleted(completedPage + 1); };
  const prevCompletedPage = () => { if(completedHasPrev) fetchCompleted(completedPage - 1); };

  async function handleToggleComplete(task) {
    const isNowCompleted = !task.is_completed;
    const originalPending = [...pendingTasks];
    const originalCompleted = [...completedTasks];

    if (isNowCompleted) {
      setPendingTasks(pendingTasks.filter(t => t.id !== task.id));
      setCompletedTasks([{ ...task, is_completed: true }, ...completedTasks]);
    } else {
      setCompletedTasks(completedTasks.filter(t => t.id !== task.id));
      setPendingTasks([{ ...task, is_completed: false }, ...pendingTasks]);
    }

    try {
      await api.put(`/tasks/${task.id}/change_status/`, { is_completed: isNowCompleted });
      
      fetchPending(pendingPage, searchQuery, filterCategory);
      fetchCompleted(completedPage, searchQuery, filterCategory);

    } catch (error) {
      setPendingTasks(originalPending);
      setCompletedTasks(originalCompleted);
      alert("Error syncing with server. Reverting changes.");
    }
  }

  async function handleSaveTask(taskData) {
    setIsProcessing(true);
    try {
      if (taskToEdit) {
        await api.patch(`/tasks/${taskToEdit.id}/`, taskData);
        if (taskToEdit.is_completed) fetchCompleted(completedPage, searchQuery, filterCategory);
        else fetchPending(pendingPage, searchQuery, filterCategory);
      } else {
        await api.post('/tasks/', { ...taskData, is_completed: false });
        fetchPending(1, searchQuery, filterCategory);
      }
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
    } catch (error) { 
      alert("Error saving task."); 
    } finally { 
      setIsProcessing(false); 
    }
  }

  async function handleDeleteTask() {
    if (!taskToDelete) return;
    setIsProcessing(true);
    try {
      await api.delete(`/tasks/${taskToDelete.id}/`);
      
      if (taskToDelete.is_completed) setCompletedTasks(completedTasks.filter(t => t.id !== taskToDelete.id));
      else setPendingTasks(pendingTasks.filter(t => t.id !== taskToDelete.id));
      
      if (taskToDelete.is_completed) fetchCompleted(completedPage, searchQuery, filterCategory);
      else fetchPending(pendingPage, searchQuery, filterCategory);
      
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) { 
      console.error(error);
    } finally { 
      setIsProcessing(false); 
    }
  }

  async function handleCreateCategory(name) {
    setIsProcessing(true);
    try {
      const res = await api.post('/categories/', { name });
      setCategories([res.data, ...categories]);
    } catch (e) {} finally { setIsProcessing(false); }
  }

  async function handleUpdateCategory(id, name) {
    try {
      const res = await api.put(`/categories/${id}/`, { name });
      setCategories(categories.map(c => c.id === id ? res.data : c));
    } catch (e) {}
  }

  async function handleDeleteCategory(id) {
    try {
      await api.delete(`/categories/${id}/`);
      setCategories(categories.filter(c => c.id !== id));
      fetchFilteredTasks();
    } catch (e) { alert("Cannot delete category."); }
  }

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : null;
  };

  async function handleShareTask(username) {
    setIsProcessing(true);
    try {
      const response = await api.post(`/tasks/${taskToShare.id}/share/`, { username });
      
      const updatedTask = {
        ...taskToShare,
        shared_with_usernames: [...(taskToShare.shared_with_usernames || []), username]
      };

      setTaskToShare(updatedTask);

      if (updatedTask.is_completed) {
        setCompletedTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      } else {
        setPendingTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      }

      return response.data.detail || "Task shared successfully!";
    } catch (error) {
      throw getApiErrorMessage(error);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleUnshareTask(username) {
    setIsProcessing(true);
    try {
      const response = await api.post(`/tasks/${taskToShare.id}/unshare/`, { username });
      
      const updatedTask = {
        ...taskToShare,
        shared_with_usernames: taskToShare.shared_with_usernames.filter(u => u !== username)
      };

      setTaskToShare(updatedTask);

      if (updatedTask.is_completed) {
        setCompletedTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      } else {
        setPendingTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      }

      return response.data.detail || "Access revoked successfully!";
    } catch (error) {
      throw getApiErrorMessage(error);
    } finally {
      setIsProcessing(false);
    }
  }
  return {
    pendingTasks, pendingPage, pendingHasNext, pendingHasPrev, nextPendingPage, prevPendingPage,
    completedTasks, completedPage, completedHasNext, completedHasPrev, nextCompletedPage, prevCompletedPage,
    categories, isLoading, isProcessing, fetchCategories, fetchUsers,
    searchQuery, setSearchQuery, filterCategory, setFilterCategory, fetchFilteredTasks,
    isTaskModalOpen, setIsTaskModalOpen, taskToEdit, setTaskToEdit,
    isDeleteModalOpen, setIsDeleteModalOpen, taskToDelete, setTaskToDelete,
    isCategoryModalOpen, setIsCategoryModalOpen,
    handleSaveTask, handleToggleComplete, handleDeleteTask,
    handleCreateCategory, handleUpdateCategory, handleDeleteCategory, getCategoryName,
    isShareModalOpen, setIsShareModalOpen, taskToShare, setTaskToShare, 
    handleShareTask, handleUnshareTask, usersList
  }
};