import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getApiErrorMessage } from '../utils'; 

export function useRegister() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log("URL do Backend:", import.meta.env.VITE_API_URL);
      await api.post('/auth/register/', { username, email, password });
      navigate('/login');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return { username, setUsername, email, setEmail, password, setPassword, error, isLoading, handleRegister };
}