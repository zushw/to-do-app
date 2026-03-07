import { useState, useEffect } from 'react';
import api from '../services/api';

export function useDashboard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

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

  async function handleSaveTask(taskData) {
    setIsProcessing(true);
    try {
      if (taskToEdit) {
        const response = await api.patch(`/tasks/${taskToEdit.id}/`, taskData);
        setTasks(tasks.map((t) => (t.id === taskToEdit.id ? response.data : t)));
      } else {
        const response = await api.post('/tasks/', { ...taskData, is_completed: false });
        setTasks([response.data, ...tasks]);
      }
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error("Failed to save task:", error);
      alert("Error saving task.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleToggleComplete(task) {
    const newStatus = !task.is_completed;
    
    const originalTasks = [...tasks];

    setTasks(tasks.map((t) => 
      t.id === task.id ? { ...t, is_completed: newStatus } : t
    ));

    try {
      const response = await api.put(`/tasks/${task.id}/change_status/`, { 
        is_completed: newStatus 
      });

      setTasks((currentTasks) => currentTasks.map((t) => 
        t.id === task.id ? response.data.task : t
      ));

    } catch (error) {
      console.error("Failed to update task status:", error);
      setTasks(originalTasks);
      alert("Error syncing with server. Reverting changes.");
    }
  }

  async function handleDeleteTask() {
    if (!taskToDelete) return;
    setIsProcessing(true);
    try {
      await api.delete(`/tasks/${taskToDelete.id}/`);
      setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCreateCategory(name) {
    setIsProcessing(true);
    try {
      const response = await api.post('/categories/', { name });
      setCategories([response.data, ...categories]);
    } catch (error) {
      console.error("Failed to create category", error);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleUpdateCategory(id, name) {
    try {
      const response = await api.put(`/categories/${id}/`, { name });
      setCategories(categories.map(c => c.id === id ? response.data : c));
    } catch (error) {
      console.error("Failed to update category", error);
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
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : null;
  };

  const pendingTasks = tasks.filter(task => !task.is_completed);
  const completedTasks = tasks.filter(task => task.is_completed);

  return {
    tasks, pendingTasks, completedTasks, categories, isLoading, isProcessing,
    isTaskModalOpen, setIsTaskModalOpen, taskToEdit, setTaskToEdit,
    isDeleteModalOpen, setIsDeleteModalOpen, taskToDelete, setTaskToDelete,
    isCategoryModalOpen, setIsCategoryModalOpen,
    handleSaveTask, handleToggleComplete, handleDeleteTask,
    handleCreateCategory, handleUpdateCategory, handleDeleteCategory,
    getCategoryName
  };
}