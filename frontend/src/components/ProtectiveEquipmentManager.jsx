import React, { useEffect, useState } from 'react'
import { useProtectiveEquipmentStore } from '../store/useProtectiveEquipmentStore.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { LoaderCircle, Trash2, FilePenLine, ArrowLeft, Mail, X, FilePlus, Hash, FileText, CheckCircle, Clock, Calendar, Building2, Tag } from 'lucide-react'
import { isWithinInterval, addDays } from 'date-fns'

const ProtectiveEquipmentManager = ({ onClose }) => {
  const { equipment, getEq, deleteEq, updateEq, addEq, isAdding, isUpdating, isEquipmentLoading } = useProtectiveEquipmentStore();
  const { authUser } = useAuthStore();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [eqToDelete, setEqToDelete] = useState({});
  const [eqToEdit, setEqToEdit] = useState({});
  const [showEditWindow, setShowEditWindow] = useState(false);
  const [showAddNewWindow, setShowAddNewWindow] = useState(false);
  const [formData, setFormData] = useState({ editedBy: authUser.fullName });

  useEffect(() => {
    getEq();
  }, [getEq]);

  const handleEdit = (e) => {
    e.preventDefault();
    updateEq(eqToEdit.id, formData);
    setShowEditWindow(false);
    setFormData({ editedBy: authUser.fullName });
  };

  const handleShowDeleteConfirmationWindow = (id, type, number, producer) => {
    setShowDeleteConfirmation(true);
    setEqToDelete({
      id: id,
      type: type,
      number: number,
      producer: producer
    });
  };

  const handleDeleteEq = (id) => {
    deleteMeter(id);
    setShowDeleteConfirmation(false);
    setMeterToDelete({});
  };

  const handleCancelDeleteEq = () => {
    setShowDeleteConfirmation(false);
    setEqrToDelete({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    addEq(formData);
    setShowAddNewWindow(false);
    setFormData({ editedBy: authUser.fullName });
  };

   const isDeadline = (dateString) => {
      const today = new Date();
      const endOfThisWeek = addDays(today, 7);

      const date = new Date(dateString);

      return isWithinInterval(date, { start: today, end: endOfThisWeek });
   };

  return (
    <>
      {
        showAddNewWindow &&
        <div className="w-full relative h-full flex flex-col justify-center">
          <div
            className="absolute top-0 right-0 cursor-pointer z-10"
            onClick={() => {
              setShowAddNewWindow(false);
              setFormData({ editedBy: authUser.fullName });
            }}
            title="Anuluj i zamnknik dodawanie"
          >
            <X className="size-6" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-10">
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Nazwa
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Tag className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź nazwę"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Numer fabryczny
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Hash className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź numer fabryczny"
                    value={formData.factoryNumber}
                    onChange={(e) => setFormData({ ...formData, factoryNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Numer protokołu
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Hash className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź numer protokołu"
                    value={formData.protocolNumber}
                    onChange={(e) => setFormData({ ...formData, protocolNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Data sprawdzenia
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Calendar className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="date"
                    className="w-full py-4 pl-10 pr-3 border rounded-2xl"
                    value={formData.checkDate}
                    onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Data następnego sprawdzenia
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Calendar className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="date"
                    className="w-full py-4 pl-10 pr-3 border rounded-2xl"
                    value={formData.nextCheckDate}
                    onChange={(e) => setFormData({ ...formData, nextCheckDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Uwagi
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FileText className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź uwagi"
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-violet-600 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
                disabled={isAdding}
                title="Dodaj nowy sprzęt"
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
            className="absolute top-0 right-0 cursor-pointer z-10"
            onClick={() => {
              setShowEditWindow(false);
              setFormData({ editedBy: authUser.fullName });
            }}
            title="Anuluj i zamknij edycję"
          >
            <X className="size-6" />
          </div>
          <form onSubmit={handleEdit} className="flex flex-col gap-5 mt-10">
          <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Nazwa
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Tag className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź nazwę"
                    value={formData.name || eqToEdit.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Numer fabryczny
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Hash className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź numer fabryczny"
                    value={formData.factoryNumber || eqToEdit.factoryNumber}
                    onChange={(e) => setFormData({ ...formData, factoryNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Number protokołu
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Hash className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź numer protokołu"
                    value={formData.protocolNumber || eqToEdit.protocolNumber}
                    onChange={(e) => setFormData({ ...formData, protocolNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Data sprawdzenia
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Calendar className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="date"
                    className="w-full py-4 pl-10 pr-3 border rounded-2xl"
                    value={formData.checkDate || eqToEdit.checkDate}
                    onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Data następnego sprawdzenia
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Calendar className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="date"
                    className="w-full py-4 pl-10 pr-3 border rounded-2xl"
                    value={formData.nextCheckDate || eqToEdit.nextCheckDate}
                    onChange={(e) => setFormData({ ...formData, nextCheckDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Uwagi
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FileText className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź uwagi"
                    value={formData.comments || eqToEdit.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-violet-600 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
                disabled={isUpdating}
                title="Zapisz informacje o sprzęcie"
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
              {
                authUser.Permissions[0].add_permission &&
                  <button
                    className="cursor-pointer bg-blue-500 hover:bg-blue-700 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
                    onClick={() => {setShowAddNewWindow(true)}}
                    title="Dodaj nowy sprzęt"
                  >
                    <FilePlus className="size-5"/>
                    Dodaj nowy
                  </button>
              }
            </div>

  <div className="hidden sm:grid-cols-8 gap-2 font-bold border-b pb-2 text-center items-center sm:grid">
    <div>Nazwa</div>
    <div>Nr fabr</div>
    <div>Nr protokołu</div>
    <div>Data sprawdzenia</div>
    <div>Data następnego sprawdzeia</div>
    <div>Uwagi</div>
    <div>Edytowane przez</div>
  </div>
  <div className="w-full overflow-x-auto h-full flex flex-col">
    {
      !equipment || isEquipmentLoading &&
        <div className="w-full fixed flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoaderCircle className="animate-spin duration-150 size-10" />
        </div>
    }
    {
      equipment && !isEquipmentLoading && equipment.map((eq) => (
        <div key={eq.id} className="grid grid-cols-1 sm:grid-cols-8 gap-2 border-b py-2 text-center items-center">
          <div className="break-words">{eq.name}</div>
          <div className="break-words">{eq.factoryNumber}</div>
          <div className="break-words">{eq.protocolNumber}</div>
          <div>{eq.checkDate}</div>
          <div><span className={isDeadline(eq.nextCheckDate) ? 'bg-orange-400 rounded-md font-bold text-white px-2 py-0.5' : ''} title="Zbliżający się termin">{eq.nextCheckDate}</span></div>
          <div className="break-words">{eq.comments || 'Brak'}</div>
          <div>{eq.editedBy}</div>
          <div className="flex flex-col items-center justify-center gap-1">
            {
              authUser.Permissions[0].edit_permission &&
                <button
                  onClick={() => {
                    setShowEditWindow(true);
                    setEqToEdit(eq);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
                  title="Edytuj informacje o sprzęcie"
                >
                  <FilePenLine className="size-5" />
                  Edytuj
                </button>
            }
            {
              authUser.Permissions[0].delete_permission &&
                <button
                  onClick={() => handleShowDeleteConfirmationWindow(eq.id, eq.type, eq.number, eq.producer)}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
                  title="Usuń sprzęt"
                >
                  <Trash2 className="size-5" />
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
          Na pewno chcesz usunąć <span className="font-bold">{eqToDelete.type} {eqToDelete.number} {eqToDelete.producer}</span>?
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => handleDeleteEq(eqToDelete.id)}
              className="bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded-xl cursor-pointer"
            >
              Potwierdź
            </button>
            <button
              onClick={() => handleCancelDeleteEq()}
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

export default ProtectiveEquipmentManager