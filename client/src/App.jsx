import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import JobFeed from './pages/JobFeed.jsx';
import CreateJob from './pages/CreateJob.jsx';
import PrivateRoute from './components/routing/PrivateRoute.jsx';
import './App.css';

function App() {
  
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>RizeOS</Link>
        <div className="nav-links">
          <Link to="/jobs">Job Feed</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/post-job">Post a Job</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>
      
      <main>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/jobs" element={<JobFeed />} />
          <Route path="/" element={<JobFeed />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-job" element={<CreateJob />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;