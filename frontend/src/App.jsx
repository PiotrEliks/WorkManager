import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore.js'
import { LoaderCircle } from 'lucide-react'
import LoginPage from './pages/LoginPage.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectiveEquipmentPage from './pages/protectiveEquipment/ProtectiveEquipmentPage.jsx'
import MetersPage from './pages/meter/MetersPage.jsx'
import EmployeesPage from './pages/employee/EmployeesPage.jsx'
import NoMatchPage from './pages/NoMatchPage.jsx'
import EmployeeDetailPage from './pages/employee/EmployeeDetailPage.jsx'
import AddEmployeePage from './pages/employee/AddEmployeePage.jsx'
import EditEmployeePage from './pages/employee/EditEmployeePage';
import AddNewMeterPage from './pages/meter/AddNewMeterPage.jsx'
import AddNewProtEqPage from './pages/protectiveEquipment/AddNewProtEqPage.jsx'
import EditMeterPage from './pages/meter/EditMeterPage.jsx'
import EditProtEqPage from './pages/protectiveEquipment/EditProtEqPage.jsx'

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
          <Route path="mierniki/nowy" element={<AddNewMeterPage />} />
          <Route path="mierniki/:id/edytuj" element={<EditMeterPage />} />
          <Route path="sprzet-ochronny" element={<ProtectiveEquipmentPage />} />
          <Route path="sprzet-ochronny/nowy" element={<AddNewProtEqPage />} />
          <Route path="sprzet-ochronny/:id/edytuj" element={<EditProtEqPage />} />
          <Route path="pracownicy" element={<EmployeesPage />} />
          <Route path="pracownicy/:id" element={<EmployeeDetailPage />} />
          <Route path="pracownicy/:id/edytuj" element={<EditEmployeePage />} />
          <Route path="pracownicy/nowy" element={<AddEmployeePage />} />
          <Route path="*" element={<NoMatchPage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
