import React, { useEffect } from 'react';
import { useUserstore } from '../store/useUserstore';
import EmployeeCard from '../components/employees/EmployeeCard';
import useDocumentTitle from '../lib/useDocumentTitle';
import { useNavigate } from 'react-router-dom';
import { UserRoundPlus } from 'lucide-react';
import Loader from '../components/Loader';

const EmployeesPage = () => {
  const navigate = useNavigate();
  useDocumentTitle('Pracownicy | Panel Elektropomiar');
  const { users, getUsers, areUsersLoading } = useUserstore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (areUsersLoading) {
    return (
      <Loader />
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <button
        onClick={() => navigate('/pracownicy/nowy')}
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl cursor-pointer"
      >
        <span className="flex flex-row items-center justify-center gap-1">
          <UserRoundPlus /> 
          Dodaj pracownika
        </span>
      </button>
      {users.map(user => (
        <EmployeeCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default EmployeesPage;
