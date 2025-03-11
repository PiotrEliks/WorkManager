import React, { useEffect, useState } from 'react'
import { ArrowLeft, UserPlus, LoaderCircle, UserPen, UserRoundX, X, Mail, UserRound, ShieldUser } from 'lucide-react'
import { useUserstore } from '../store/useUserStore'
import { useAuthStore } from '../store/useAuthStore'

const UsersManager = ({ onClose }) => {
    const { users, getUsers, addUser, deleteUser, updateUser, areUsersLoading, isAdding, isUpdating } = useUserstore();
    const { authUser } = useAuthStore();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [userToDelete, setUserToDelete] = useState({});
    const [userToEdit, setUserToEdit] = useState({});
    const [showEditWindow, setShowEditWindow] = useState(false);
    const [showAddNewWindow, setShowAddNewWindow] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const handleEdit = (e) => {
        e.preventDefault();
        updateUser(userToEdit.id, formData);
        setShowEditWindow(false);
        setFormData({});
      };
    
      const handleShowDeleteConfirmationWindow = (id, name) => {
        setShowDeleteConfirmation(true);
        setUserToDelete({
          id: id,
          fullName: name,
        });
      };
    
      const handleDeleteUser = (id) => {
        deleteUser(id);
        setShowDeleteConfirmation(false);
        setUserToDelete({});
      };
    
      const handleCancelDeleteUser = () => {
        setShowDeleteConfirmation(false);
        setUserToDelete({});
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        addUser(formData);
        setShowAddNewWindow(false);
        setFormData({});
      };

      console.log(formData)

    return (
<>
      {
        showAddNewWindow &&
        <div className="w-full relative h-full flex flex-col justify-center">
          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={() => {
              setShowAddNewWindow(false);
              setFormData({});
            }}
            title="Anuluj i zamnknik dodawanie"
          >
            <X className="size-6" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-3">
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Imię i Nazwisko
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <UserRound  className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź nazwę"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    E-mail
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Rola
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <ShieldUser  className="size-5 text-black/70 z-10" />
                  </div>
                  <select
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    value={formData.role}
                    onChange={(e) => {
                      setFormData({ ...formData, role: e.target.value });
                    }}
                  >
                    <option value="">
                      {formData.role ||  "Wybierz rolę"}
                    </option>
                    <option value="pracownik">Pracownik</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-violet-600 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
                disabled={isAdding || Object.keys(formData).length !== 3}
                title="Dodaj nowego pracownika"
              >
                {isAdding ? (
                  <>
                    <LoaderCircle  className="size-5 animate-spin" />
                    Dodawanie...
                  </>
                ) : (
                  "Dodaj"
                )}
              </button>
            </form>
        </div>
      }
      {
        showEditWindow &&
        <div className="w-full relative h-full flex flex-col justify-center">
          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={() => {
              setShowEditWindow(false);
              setFormData({});
            }}
            title="Anuluj i zamnknik edycję"
          >
            <X className="size-6" />
          </div>
          <form onSubmit={handleEdit} className="space-y-6 flex flex-col gap-3">
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Imię i Nazwisko
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <UserRound  className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź nazwę"
                    value={formData.fullName || userToEdit.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    E-mail
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź email"
                    value={formData.email || userToEdit.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Rola
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <ShieldUser  className="size-5 text-black/70 z-10" />
                  </div>
                  <select
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    value={formData.role ?? userToEdit.role ?? ""}
                    onChange={(e) => {
                      setFormData({ ...formData, role: e.target.value });
                    }}
                  >
                    <option value="" disabled>
                      {userToEdit.role ? userToEdit.role : "Wybierz rolę"}
                    </option>
                    <option value="pracownik">Pracownik</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-violet-600 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
                disabled={isUpdating || Object.keys(formData).length === 0}
                title="Zapisz informacje o pracowniku"
              >
                {isUpdating ? (
                  <>
                    <LoaderCircle  className="size-5 animate-spin" />
                    Zapisywanie...
                  </>
                ) : (
                  "Zapisz"
                )}
              </button>
            </form>
        </div>
      }
      {
        !showAddNewWindow && !showEditWindow &&
          <>
            <div className="w-full flex flex-row items-center justify-between">
              <button
                className="cursor-pointer"
                onClick={() => {onClose(false)}}
                title="Powrót do menu"
              >
                <ArrowLeft className="size-6"/>
              </button>
              <button
                className="cursor-pointer bg-blue-500 hover:bg-blue-700 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
                onClick={() => {setShowAddNewWindow(true)}}
                title="Dodaj nowego pracownika"
              >
                <UserPlus className="size-5"/>
                Dodaj nowego
              </button>
            </div>
            <div className="hidden sm:grid-cols-7 gap-2 font-bold border-b pb-2 text-center items-center sm:grid">
            <div>Imię i Nazwisko</div>
            <div>Email</div>
            <div>Rola</div>
          </div>
          <div className="w-full overflow-x-auto h-full flex flex-col">
            {
              !users || areUsersLoading &&
                <div className="w-full fixed flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <LoaderCircle  className="animate-spin duration-150 size-10" />
                </div>
            }

            {
              users && !areUsersLoading && users.map((user) => (
                <div key={user.id} className="grid grid-cols-1 sm:grid-cols-7 gap-2 border-b py-2 text-center items-center">
                  <div>{user.fullName}</div>
                  <div>{user.email}</div>
                  <div>{user.role}</div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <button
                      onClick={() => {
                        setShowEditWindow(true);
                        setUserToEdit(user);
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded-xl cursor-pointer
                      flex flex-row items-center gap-1"
                      title="Edytuj infomracje o pracowniku"
                    >
                      <UserPen className="size-5" />
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleShowDeleteConfirmationWindow(user.id, user.fullName)}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
                      title="Usuń pracownika"
                    >
                      <UserRoundX className="size-5" />
                      Usuń
                    </button>
                  </div>
                </div>
              ))
            }
            {
              showDeleteConfirmation && (
                <div className="fixed bg-gray-900 text-white p-10 rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  Na pewno chcesz usunąć {userToDelete.fullName}?
                  <div className="mt-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleDeleteUser(userToDelete.id)}
                      className="bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded-xl cursor-pointer"
                    >
                      Potwierdź
                    </button>
                    <button
                      onClick={() => handleCancelDeleteUser()}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded-xl cursor-pointer"
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              )
            }
            </div>
        </>
      }
      
    </>
  )
}

export default UsersManager
