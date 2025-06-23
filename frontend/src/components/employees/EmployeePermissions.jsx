import React from 'react';

const permissionLabels = {
  view_permission: 'Odczyt',
  add_permission: 'Dodawanie',
  edit_permission: 'Edycja',
  delete_permission: 'Usuwanie'
};

const EmployeePermissions = ({ permissions }) => {
  console.log('EmployeePermissions', permissions);
  return (
    <div>
      <h4 className="font-semibold mb-2">Uprawnienia</h4>
      <ul className="flex flex-wrap gap-2">
        {Object.entries(permissions).map(([key, value]) => (
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
