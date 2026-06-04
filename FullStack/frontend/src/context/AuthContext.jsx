import { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, data } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const register = async (formData) => {
    await api.post('/auth/register', {
      fullname:  formData.fullname,
      email:     formData.email,
      password:  formData.password,
      sex:       Number(formData.sex),
      education: Number(formData.education),
      marriage:  Number(formData.marriage),
      age:       Number(formData.age),
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
