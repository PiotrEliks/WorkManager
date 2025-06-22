import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore.js'
import { LoaderCircle } from 'lucide-react'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Navbar from './components/Navbar.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import NoMatchPage from './pages/NoMatchPage.jsx'
import ProtectiveEquipmentPage from './pages/ProtectiveEquipmentPage.jsx'
import MetersPage from './pages/MetersPage.jsx'
import EmployeesPage from './pages/EmployeesPage.jsx'

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="w-full flex items-center justify-center h-screen bg-gradient-to-r from-violet-700 to-blue-800">
        <LoaderCircle className="size-6 animate-spin text-white" />
      </div>
    );

  return (
    <div >
      <Routes>
        <Route path="/logowanie" element={ !authUser ? <LoginPage /> : <Navigate to="/" /> }/>
        <Route
          path="/"
          element={authUser ? <DashboardLayout /> : <Navigate to="/logowanie" />}
        >
          <Route path="mierniki" element={<MetersPage />} />
          <Route path="sprzet-ochronny" element={<ProtectiveEquipmentPage />} />
          <Route path="pracownicy" element={<EmployeesPage />} />
          <Route path="*" element={<NoMatchPage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
