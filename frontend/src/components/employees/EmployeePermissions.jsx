import React from 'react';

const permissionLabels = {
  can_read: 'Odczyt',
  can_write: 'Zapis',
  can_edit: 'Edycja',
  can_delete: 'Usuwanie'
};

const EmployeePermissions = ({ permissions }) => {
  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {Object.entries(permissions).filter(([key]) => key.startsWith('can_')).map(([key, value]) => (
          <li
            key={key}
            className={`px-3 py-1 rounded-xl text-sm text-white ${
              value ? 'bg-green-600' : 'bg-red-400 line-through'
            }`}
          >
            {permissionLabels[key]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeePermissions;
