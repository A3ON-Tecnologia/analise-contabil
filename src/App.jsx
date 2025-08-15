import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Upload from './Pages/Upload.jsx';
import Reports from './Pages/Reports.jsx';
import CientDetail from './Pages/CientDetail.jsx';
import Layout from './Layout.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  );

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === '123456789') {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      alert('Usuário ou senha inválidos');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route
              path="/"
              element={
                <Layout onLogout={handleLogout}>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Layout onLogout={handleLogout}>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/upload"
              element={
                <Layout onLogout={handleLogout}>
                  <Upload />
                </Layout>
              }
            />
            <Route
              path="/reports"
              element={
                <Layout onLogout={handleLogout}>
                  <Reports />
                </Layout>
              }
            />
            <Route
              path="/clientdetail"
              element={
                <Layout onLogout={handleLogout}>
                  <CientDetail />
                </Layout>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
