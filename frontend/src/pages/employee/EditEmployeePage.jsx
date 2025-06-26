import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeForm from '../../components/employees/EmployeeForm';
import { useUserstore } from '../../store/useUserstore';
import useDocumentTitle from '../../lib/useDocumentTitle';
import { X } from 'lucide-react';
import Loader from '../../components/Loader';

const EditEmployeePage = () => {
  useDocumentTitle('Edycja pracownika | Panel Elektropomiar');

  const { id } = useParams();
  const navigate = useNavigate();
  const { users, getUsers, updateUser, isUpdating } = useUserstore();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const found = users.find(u => u.id === id);
    if (found) setEmployee(found);
  }, [users, id]);

  const handleUpdate = async (updatedData) => {
    await updateUser(employee.id, updatedData);
    navigate(`/pracownicy/${employee.id}`);
  };

  if (!employee) {
    return (
      <Loader />
    );
  }

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-xl shadow relative">
      <button
        onClick={() => navigate(`/pracownicy/${employee.id}`)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        title="Anuluj"
      >
        <X />
      </button>
      <h2 className="text-xl font-bold mb-4">Edytuj dane pracownika</h2>
      <EmployeeForm
        initialData={employee}
        onSubmit={handleUpdate}
        isSubmitting={isUpdating}
      />
    </div>
  );
};

export default EditEmployeePage;
