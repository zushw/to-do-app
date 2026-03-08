import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { getApiErrorMessage } from '../utils';

export function useProfile() {
  const { user, updateUser, signOut } = useContext(AuthContext);

  const [isDeleting, setIsDeleting] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const hasProfileChanges = username !== user?.username || email !== user?.email;

  async function handleUpdateProfile(e) {
    e.preventDefault();
    
    if (!hasProfileChanges) return;

    setIsProfileLoading(true);
    setProfileMessage({ type: '', text: '' });

    try {
      const response = await api.patch('/users/me/', { username, email });
      updateUser(response.data);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error(error);
      setProfileMessage({ type: 'error', text: 'Failed to update profile. Username or email might be taken.' });
    } finally {
      setIsProfileLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsPasswordLoading(true);

    try {
      await api.post('/users/change-password/', {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      setPasswordMessage({ type: 'error', text: getApiErrorMessage(error) });
    } finally {
      setIsPasswordLoading(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmDelete = window.confirm(
      "Are you absolutely sure? This action cannot be undone and will permanently delete your account and all your tasks."
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await api.delete('/users/me/'); 
      
      signOut(); 
    } catch (error) {
      console.error("Failed to delete account", error);
      alert("Failed to delete account. Please try again.");
      setIsDeleting(false); 
    }
  }

  return {
    username, setUsername, email, setEmail,
    isProfileLoading, profileMessage, handleUpdateProfile,
    currentPassword, setCurrentPassword, newPassword, setNewPassword,
    confirmPassword, setConfirmPassword, isPasswordLoading, passwordMessage,
    handleChangePassword, hasProfileChanges, handleDeleteAccount, isDeleting
  };
}