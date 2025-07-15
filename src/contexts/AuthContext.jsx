import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('mentorship_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedUsers = localStorage.getItem('mentorship_all_users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        const initialUsers = [
          {
            id: 'admin1',
            email: 'admin@exemplo.com',
            name: 'Admin',
            role: 'admin',
            password: 'admin123',
            joinedDate: new Date().toISOString().split('T')[0],
            status: 'active'
          }
        ];
        localStorage.setItem('mentorship_all_users', JSON.stringify(initialUsers));
        setUsers(initialUsers);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (credentials) => {
    const allUsers = getAllUsers();
    const foundUser = allUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password;
      localStorage.setItem('mentorship_user', JSON.stringify(userData));
      setUser(userData);
      navigate(userData.role === 'admin' ? '/admin/dashboard' : '/student/profile');
      return userData;
    }

    return null;
  };

  const registerStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: `student${Date.now()}`,
      role: 'student',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    const updatedUsers = [...users, newStudent];
    localStorage.setItem('mentorship_all_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    return newStudent;
  };

  const updateUserContextAndLocalStorage = (updatedUserData, avatarFile) => {
    let finalUserData = { ...updatedUserData };
    delete finalUserData.password;

    if (avatarFile) {
      finalUserData.avatarUrl = updatedUserData.avatarUrl;
    }

    localStorage.setItem('mentorship_user', JSON.stringify(finalUserData));
    setUser(finalUserData);
    updateUserInList(finalUserData);
  };

  const logout = () => {
    localStorage.removeItem('mentorship_user');
    setUser(null);
    navigate('/login');
  };

  const getAllUsers = () => {
    try {
      const storedUsers = localStorage.getItem('mentorship_all_users');
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error("Erro ao recuperar usuários:", error);
      return [];
    }
  };

  const updateUserInList = (updatedUser) => {
    const currentUsers = getAllUsers();
    const updatedUsersList = currentUsers.map((u) => {
      if (u.id === updatedUser.id) {
        const finalUser = { ...u, ...updatedUser };
        if (!updatedUser.password) {
          finalUser.password = u.password;
        }
        return finalUser;
      }
      return u;
    });

    localStorage.setItem('mentorship_all_users', JSON.stringify(updatedUsersList));
    setUsers(updatedUsersList);
  };

  const deleteUserFromList = (userId) => {
    const currentUsers = getAllUsers();
    const updatedUsersList = currentUsers.filter((u) => u.id !== userId);
    localStorage.setItem('mentorship_all_users', JSON.stringify(updatedUsersList));
    setUsers(updatedUsersList);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        registerStudent,
        loading,
        isAuthenticated: !!user,
        getAllUsers,
        updateUserInList,
        deleteUserFromList,
        updateUserContext: updateUserContextAndLocalStorage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
