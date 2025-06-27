import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function RequireAdmin() {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const isAdmin = authUser?.role === 'administrator';

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
