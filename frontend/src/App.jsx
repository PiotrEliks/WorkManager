import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore.js'
import { LoaderCircle } from 'lucide-react'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="w-full flex items-center justify-center h-screen bg-gradient-to-r from-violet-600 to-indigo-600">
        <LoaderCircle className="size-6 animate-spin text-white" />
      </div>
    );

  return (
    <div >
      <Navbar />
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login" /> }/>
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/" /> }/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
