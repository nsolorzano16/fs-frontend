import { AppRouter } from './router/appRouter';
import './App.css';
import { AppContext } from './context/appContext';
import React, { useReducer, useEffect } from 'react';
import { authReducer } from './auth/authReducer';

const init = () => {
  return (
    JSON.parse(localStorage.getItem('user')) || {
      logged: false,
    }
  );
};

function App() {
  const [user, dispatch] = useReducer(authReducer, {}, init);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <AppContext.Provider value={{ user, dispatch }}>
      <AppRouter />
    </AppContext.Provider>
  );
}

export default App;
