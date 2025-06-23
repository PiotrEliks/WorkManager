import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserstore } from '../store/useUserstore';
import EmployeePermissions from '../components/employees/EmployeePermissions';
import AccessCardInfo from '../components/employees/AccessCardInfo';
import { ArrowLeft, Pencil, Trash  } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import useDocumentTitle from '../lib/useDocumentTitle';


const EmployeeDetailPage = () => {
  useDocumentTitle('Szczegóły pracownika | Panel Elektropomiar')
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, getUsers, areUsersLoading, deleteUser } = useUserstore();
  const [employee, setEmployee] = useState(null);

  const handleDelete = async () => {
  if (window.confirm(`Czy na pewno chcesz usunąć pracownika: ${employee.fullName}?`)) {
    await deleteUser(employee.id);
    toast.success("Pracownik usunięty");
    navigate('/pracownicy');
  }
};


  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const found = users.find(u => u.id ===id);
    setEmployee(found || null);
  }, [users, id]);

  console.log('EmployeeDetailPage', { employee, users });

  if (areUsersLoading) return <Loader />;
  if (!employee) return <div className="text-center mt-10 text-lg font-medium">Nie znaleziono pracownika.</div>;

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate('/pracownicy')}
          className="text-sm text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Wróć do listy
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/pracownicy/${employee.id}/edytuj`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
          >
            <Pencil className="size-4" /> Edytuj
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
          >
            <Trash className="size-4" /> Usuń
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">
        {employee.fullName}
      </h2>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Rola:</strong> {employee.role.charAt(0).toUpperCase()}{employee.role.slice(1)}</p>
      <p><strong>Zmienił hasło domyślne:</strong> {employee.changedDefaultPassword ? 'Tak' : 'Nie'}</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Uprawnienia</h3>
        <EmployeePermissions permissions={employee.Permission} />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Karta dostępu</h3>
        <AccessCardInfo cardId={employee.cardId} entries={employee.entries} />
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
