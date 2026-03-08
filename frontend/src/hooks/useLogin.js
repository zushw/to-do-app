import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export function useLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn({ username, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please check your username and password.');
    } finally {
      setIsLoading(false);
    }
  }

  return { username, setUsername, password, setPassword, error, isLoading, handleLogin };
}