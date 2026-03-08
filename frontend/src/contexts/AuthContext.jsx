import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@ToDoApp:token');
    const storedUser = localStorage.getItem('@ToDoApp:user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  async function signIn({ username, password }) {
    try {
      const response = await api.post('/auth/login/', { username, password });
      const { access } = response.data;

      localStorage.setItem('@ToDoApp:token', access);

      const userResponse = await api.get('/users/me/');
      
      localStorage.setItem('@ToDoApp:user', JSON.stringify(userResponse.data));
      setUser(userResponse.data);
      
    } catch (error) {
      console.error("Erro na autenticação:", error);
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem('@ToDoApp:token');
    localStorage.removeItem('@ToDoApp:user');
    setUser(null);
  }

  function updateUser(updatedUserData) {
    const newUser = { ...user, ...updatedUserData };
    
    setUser(newUser);
    
    localStorage.setItem('@ToDoApp:user', JSON.stringify(newUser)); 
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}