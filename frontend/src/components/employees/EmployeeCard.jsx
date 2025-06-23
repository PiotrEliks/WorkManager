import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';

const EmployeeCard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow-md rounded-xl p-4 hover:bg-blue-50 cursor-pointer transition"
      onClick={() => navigate(`/pracownicy/${user.id}`)}
    >
      <div className="flex items-center gap-3">
        <UserRound className="text-blue-700" />
        <div>
          <h3 className="font-semibold text-lg">{user.fullName}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm">{user.role.charAt(0).toUpperCase()}{user.role.slice(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
