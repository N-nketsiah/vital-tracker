import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddEntry from './pages/AddEntry';
import Settings from './pages/Settings';
import HealthGoals from './pages/HealthGoals';
import Medications from './pages/Medications';
import DoctorNotes from './pages/DoctorNotes';
import Meals from './pages/Meals';
import Symptoms from './pages/Symptoms';
import Achievements from './pages/Achievements';
import './App.css';

function App() {
  const { token, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchProfile(token).catch(() => {
        console.log('Session expired');
      });
    }
  }, [token, fetchProfile]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route
            path='/dashboard'
            element={
              token ? (
                <Dashboard />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/add-entry'
            element={
              token ? (
                <AddEntry />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/settings'
            element={
              token ? (
                <Settings />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/goals'
            element={
              token ? (
                <HealthGoals />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/medications'
            element={
              token ? (
                <Medications />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/doctor-notes'
            element={
              token ? (
                <DoctorNotes />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/meals'
            element={
              token ? (
                <Meals />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/symptoms'
            element={
              token ? (
                <Symptoms />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/achievements'
            element={
              token ? (
                <Achievements />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route path='/' element={token ? <Navigate to='/dashboard' /> : <Navigate to='/login' />} />
          <Route path='*' element={<Navigate to={token ? '/dashboard' : '/login'} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
