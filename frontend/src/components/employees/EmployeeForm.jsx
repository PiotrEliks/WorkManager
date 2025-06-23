import { Check, X } from 'lucide-react';
import React, { useState } from 'react';

const EmployeeForm = ({ initialData = {}, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState(() => ({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    role: initialData.role || '',
    cardId: initialData.cardId || '',
    Permission: {
      can_read: initialData.Permission?.can_read || false,
      can_write: initialData.Permission?.can_write || false,
      can_edit: initialData.Permission?.can_edit || false,
      can_delete: initialData.Permission?.can_delete || false,
    },
    changedDefaultPassword: initialData.changedDefaultPassword || false,
  }));

  const PERMISSION_KEYS = {
    can_read: 'Odczyt',
    can_write: 'Zapis',
    can_edit: 'Edycja',
    can_delete: 'Usuwanie'
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (perm) => {
    setFormData(prev => ({
      ...prev,
      Permission: {
        ...prev.Permission,
        [perm]: !prev.Permission[perm],
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
      <select
        value={formData.role}
        onChange={e => handleChange('role', e.target.value)}
        className="border px-3 py-2 rounded"
        required
      >
        <option value="">Wybierz rolę</option>
        <option value="administrator">Administrator</option>
        <option value="pracownik">Pracownik</option>
      </select>
      <input
        type="text"
        value={formData.cardId}
        onChange={e => handleChange('cardId', e.target.value)}
        placeholder="ID karty dostępu"
        className="border px-3 py-2 rounded"
      />
      <div>
        <label className="block font-semibold">Uprawnienia:</label>
        {Object.entries(PERMISSION_KEYS).map(([key, label]) => {
          const isChecked = formData.Permission[key];
          return (
            <label key={key} className="flex items-center gap-2 select-none">
              <span
                onClick={() => handlePermissionChange(key)}
                className={`text-xl cursor-pointer transition-colors
                  ${isChecked ? 'text-green-600' : 'text-red-600'}`}
              >
                {isChecked ? <Check /> : <X />}
              </span>
              <span className="text-gray-800">{label}</span>
            </label>
          );
        })}
      </div>
      {/* <label
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() =>
          handleChange('changedDefaultPassword', !formData.changedDefaultPassword)
        }
      >
        <span className={formData.changedDefaultPassword ? 'text-green-600' : 'text-red-600'}>
          {formData.changedDefaultPassword ? <Check size={20} /> : <X size={20} />}
        </span>
        Zmienił domyślne hasło
      </label> */}
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
