import React, { useState } from 'react';

const EmployeeForm = ({ initialData = {}, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState(() => ({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    role: initialData.role || '',
    cardId: initialData.cardId || '',
    permissions: {
      read: initialData.permissions?.read || false,
      write: initialData.permissions?.write || false,
      edit: initialData.permissions?.edit || false,
      delete: initialData.permissions?.delete || false,
    },
    changedDefaultPassword: initialData.changedDefaultPassword || false,
  }));

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [perm]: !prev.permissions[perm],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
      <input
        type="text"
        value={formData.fullName}
        onChange={e => handleChange('fullName', e.target.value)}
        placeholder="Imię i nazwisko"
        className="border px-3 py-2 rounded"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={e => handleChange('email', e.target.value)}
        placeholder="Email"
        className="border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        value={formData.role}
        onChange={e => handleChange('role', e.target.value)}
        placeholder="Rola"
        className="border px-3 py-2 rounded"
      />
      <input
        type="text"
        value={formData.cardId}
        onChange={e => handleChange('cardId', e.target.value)}
        placeholder="ID karty dostępu"
        className="border px-3 py-2 rounded"
      />

      <div>
        <label className="block font-semibold">Uprawnienia:</label>
        {['read', 'write', 'edit', 'delete'].map(p => (
          <label key={p} className="block">
            <input
              type="checkbox"
              checked={formData.permissions[p]}
              onChange={() => handlePermissionChange(p)}
              className="mr-2"
            />
            {p}
          </label>
        ))}
      </div>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.changedDefaultPassword}
          onChange={() => handleChange('changedDefaultPassword', !formData.changedDefaultPassword)}
          className="mr-2"
        />
        Zmienił domyślne hasło
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isSubmitting ? 'Zapisywanie...' : 'Zapisz'}
      </button>
    </form>
  );
};

export default EmployeeForm;
