import React, { useEffect, useState } from 'react'
import { ArrowLeft, UserPlus, LoaderCircle, UserPen, UserRoundX, X, Mail, UserRound, ShieldUser, ShieldQuestion } from 'lucide-react'
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

    return (
<>
      {
        showAddNewWindow &&
        <div className="w-full relative h-full flex flex-col overflow-auto">
          <div
            className="absolute top-0 right-0 cursor-pointer z-10"
            onClick={() => {
              setShowAddNewWindow(false);
              setFormData({});
            }}
            title="Anuluj i zamnknij dodawanie"
          >
            <X className="size-6" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-10">
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
                    <Mail className="size-5 text-black=/70 z-10" />
                  </div>
                  <input
                    type="email"
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
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Uprawnienia
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <ShieldQuestion   className="size-5 text-black/70 z-10" />
                  </div>
                  <select
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    value={formData.permission}
                    onChange={(e) => {
                      setFormData({ ...formData, permissions: e.target.value });
                    }}
                  >
                    <option value="" disabled selected>
                      Wybierz uprawnienia
                    </option>
                    <option value={1}>Wyświetlanie, edytownaie, dodawanie, usuwanie</option>
                    <option value={2}>Wyświetlanie</option>
                    <option value={3}>Wyświetlanie, edytowanie</option>
                    <option value={4}>Wyświetlanie, edytowanie, dodawanie</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-blue-800 hover:bg-blue-800/80 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
                disabled={isAdding || Object.keys(formData).length !== 4}
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
        <div className="w-full relative h-full flex flex-col overflow-auto">
          <div
            className="absolute top-0 right-0 cursor-pointer z-10"
            onClick={() => {
              setShowEditWindow(false);
              setFormData({});
            }}
            title="Anuluj i zamnknik edycję"
          >
            <X className="size-6" />
          </div>
          <form onSubmit={handleEdit} className="flex flex-col gap-5 mt-10">
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
                    onChange={(e) => {setFormData({ ...formData, fullName: e.target.value });setUserToEdit({ ...userToEdit, fullName: ''})}}
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
                    type="email"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź email"
                    value={formData.email || userToEdit.email}
                    onChange={(e) => {setFormData({ ...formData, email: e.target.value });setUserToEdit({ ...userToEdit, email: ''})}}
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
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Uprawnienia
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <ShieldQuestion   className="size-5 text-black/70 z-10" />
                  </div>
                  <select
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    value={formData.permission || userToEdit.Permissions[0].id}
                    onChange={(e) => {
                      setFormData({ ...formData, permissions: e.target.value });
                    }}
                  >
                    <option value="" disabled>
                      {userToEdit.Permissions[0]?.id === 1 ? 'Wyświetlanie, edytownaie, dodawanie, usuwanie' : userToEdit.Permissions[0]?.id === 2 ? 'Wyświetlanie' : userToEdit.Permissions[0]?.id === 3 ? 'Wyświetlanie, edytowanie' : userToEdit.Permissions[0]?.id === 4 ? 'Wyświetlanie, edytowanie, dodawanie' : 'Wybierz uprawnienia'}
                    </option>
                    <option value={1}>Wyświetlanie, edytownaie, dodawanie, usuwanie</option>
                    <option value={2}>Wyświetlanie</option>
                    <option value={3}>Wyświetlanie, edytowanie</option>
                    <option value={4}>Wyświetlanie, edytowanie, dodawanie</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-blue-800 hover:bg-blue-800/80 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
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
                className="cursor-pointer bg-blue-800 hover:bg-blue-800/80 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
                onClick={() => {setShowAddNewWindow(true)}}
                title="Dodaj nowego pracownika"
              >
                <UserPlus className="size-5"/>
                Dodaj nowego
              </button>
            </div>
            <div className="hidden sm:grid-cols-6 gap-2 font-bold border-b pb-2 text-center items-center sm:grid mt-3 text-sm">
              <div>Imię i Nazwisko</div>
              <div>Email</div>
              <div>Rola</div>
              <div>Uprawnienia</div>
              <div>Zmieniono hasło</div>
            </div>
          <div className="w-full overflow-x-auto h-full flex flex-col mt-3 sm:mt-0">
            {
              !users || areUsersLoading &&
                <div className="w-full fixed flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <LoaderCircle  className="animate-spin duration-150 size-10" />
                </div>
            }

            {
              users && !areUsersLoading && users.map((user) => (
                <div key={user.id} className="grid grid-cols-1 sm:grid-cols-6 gap-2 border-b py-2 text-center items-center text-sm">
                  <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{user.fullName}</div>
                  <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{user.email}</div>
                  <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{user.role}</div>
                  <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">
                    <p>{user.Permissions[0]?.view_permission && 'wyświetlanie'}</p>
                    <p>{user.Permissions[0]?.add_permission && 'dodawanie'}</p>
                    <p>{user.Permissions[0]?.edit_permission && 'edytowanie'}</p>
                    <p>{user.Permissions[0]?.delete_permission && 'usuwanie'}</p>
                  </div>
                  <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{user.passwordChanged ? 'Tak' : 'Nie'}</div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <button
                      onClick={() => {
                        setShowEditWindow(true);
                        setUserToEdit(user);
                      }}
                      className="bg-blue-800 hover:bg-blue-800/80 text-white py-1 px-3 rounded-xl cursor-pointer
                      flex flex-row items-center gap-1"
                      title="Edytuj infomracje o pracowniku"
                    >
                      <UserPen className="size-5" />
                      Edytuj
                    </button>
                    {
                      authUser.id !== user.id &&
                        <button
                          onClick={() => handleShowDeleteConfirmationWindow(user.id, user.fullName)}
                          className="bg-red-500 hover:bg-red-500/70 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
                          title="Usuń pracownika"
                        >
                          <UserRoundX className="size-5" />
                          Usuń
                        </button>
                    }
                  </div>
                </div>
              ))
            }
            {
              showDeleteConfirmation && (
                <div className="fixed bg-gray-900 text-white p-10 rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  Na pewno chcesz usunąć <span className="font-bold">{userToDelete.fullName}</span>?
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
