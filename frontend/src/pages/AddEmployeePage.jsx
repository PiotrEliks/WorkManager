import React from 'react';
import EmployeeForm from '../components/employees/EmployeeForm';
import { useUserstore } from '../store/useUserstore';
import useDocumentTitle from '../lib/useDocumentTitle';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const AddEmployeePage = () => {
  useDocumentTitle('Dodaj pracownika | Panel Elektropomiar');
  const { addUser, isAdding } = useUserstore();
  const navigate = useNavigate();

  const handleAdd = async (data) => {
    await addUser(data);
    navigate('/pracownicy');
  };

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-xl shadow mt-4 relative">
      <button
        onClick={() => navigate('/pracownicy')}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        title="Anuluj"
      >
        <X />
      </button>

      <h2 className="text-2xl font-bold mb-4">Dodaj nowego pracownika</h2>
      <EmployeeForm onSubmit={handleAdd} isSubmitting={isAdding} />
    </div>
  );
};

export default AddEmployeePage;
