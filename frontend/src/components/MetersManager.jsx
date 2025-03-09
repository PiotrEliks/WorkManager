import React, { useEffect, useState } from 'react'
import { useMeterStore } from '../store/useMeterStore.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { LoaderCircle, Trash2, FilePenLine, ArrowLeft, Mail, X, FilePlus } from 'lucide-react'

const MetersManager = ({ onClose }) => {
  const { meters, getMeters, deleteMeter, updateMeter, addMeter, isAdding, isUpdating } = useMeterStore();
  const { authUser } = useAuthStore();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [meterToDelete, setMeterToDelete] = useState({});
  const [meterToEdit, setMeterToEdit] = useState({});
  const [showEditWindow, setShowEditWindow] = useState(false);
  const [showAddNewWindow, setShowAddNewWindow] = useState(false);
  const [formData, setFormData] = useState({ editedBy: authUser.fullName });

  useEffect(() => {
    getMeters();
  }, [getMeters]);

  const handleEdit = (e) => {
    e.preventDefault();
    updateMeter(meterToEdit.id, formData);
    setShowEditWindow(false);
    setFormData({ editedBy: authUser.fullName });
  };

  const handleShowDeleteConfirmationWindow = (id, name) => {
    setShowDeleteConfirmation(true);
    setMeterToDelete({
      id: id,
      name: name,
    });
  };

  const handleDeleteMeter = (id) => {
    deleteMeter(id);
    setShowDeleteConfirmation(false);
    setMeterToDelete({});
  };

  const handleCancelDeleteMeter = () => {
    setShowDeleteConfirmation(false);
    setMeterToDelete({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    addMeter(formData);
    setShowAddNewWindow(false);
    setFormData({ editedBy: authUser.fullName });
  };

  return (
    <>
      {
        showAddNewWindow &&
        <div className="w-full relative h-full flex flex-col justify-center">
          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={() => {
              setShowAddNewWindow(false);
              setFormData({ editedBy: authUser.fullName });
            }}
          >
            <X className="size-6" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-3">
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Nazwa
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="size-5 text-black/70 z-10" />
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
                    Data wygaśnięcia przeglądu
                  </span>
                </label>
                <input
                  type="date"
                  className="w-full py-4 px-3 border rounded-2xl"
                  value={formData.inspectionDate}
                  onChange={(e) => setFormData({ ...formData, inspectionExpiryDate: e.target.value })}
                />
              </div>
              <div className="w-full relative gap-3">
              <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Data następnego przeglądu
                  </span>
                </label>
                <input
                  type="date"
                  className="w-full py-4 px-3 border rounded-2xl"
                  value={formData.inspectionDate}
                  onChange={(e) => setFormData({ ...formData, nextInspectionDate: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-violet-600 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
                disabled={isAdding}
                title="Dodaj nowy miernik"
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
              setFormData({ editedBy: authUser.fullName });
            }}
          >
            <X className="size-6" />
          </div>
          <form onSubmit={handleEdit} className="space-y-6 flex flex-col gap-3">
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Nazwa
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź nazwę"
                    value={formData.name || meterToEdit.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Data wygaśnięcia przeglądu
                  </span>
                </label>
                <input
                  type="date"
                  className="w-full py-4 px-3 border rounded-2xl"
                  value={formData.inspectionExpiryDate || meterToEdit.inspectionExpiryDate}
                  onChange={(e) => setFormData({ ...formData, inspectionExpiryDate: e.target.value })}
                />
              </div>
              <div className="w-full relative gap-3">
              <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Data następnego przeglądu
                  </span>
                </label>
                <input
                  type="date"
                  className="w-full py-4 px-3 border rounded-2xl"
                  value={formData.nextInspectionDate || meterToEdit.nextInspectionDate}
                  onChange={(e) => setFormData({ ...formData, nextInspectionDate: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-violet-600 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
                disabled={isUpdating}
                title="Dodaj nowy miernik"
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
            >
              <ArrowLeft className="size-6"/>
            </button>
            <button
              className="cursor-pointer bg-blue-500 hover:bg-blue-700 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
              onClick={() => {setShowAddNewWindow(true)}}
            >
              <FilePlus className="size-5"/>
              Dodaj nowy
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2 font-bold border-b pb-2 text-center items-center">
            <div>Nazwa</div>
            <div>Wygaśnięcie przeglądu</div>
            <div>Następny przegląd</div>
            <div>Edytowane przez</div>
          </div>
          <div className="w-full overflow-auto h-full flex flex-col">
            {
              !meters &&
                <div className="w-full fixed flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <LoaderCircle  className="animate-spin duration-150 size-10" />
                </div>
            }

            {
              meters && meters.map((meter) => (
                <div key={meter.id} className="grid grid-cols-5 gap-2 border-b py-2 text-center items-center">
                  <div>{meter.name}</div>
                  <div>{meter.inspectionExpiryDate}</div>
                  <div>{meter.nextInspectionDate}</div>
                  <div>{meter.editedBy}</div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <button
                      onClick={() => {
                        setShowEditWindow(true);
                        setMeterToEdit(meter);
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded-xl cursor-pointer
                      flex flex-row items-center gap-1"
                    >
                      <FilePenLine className="size-5" />
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleShowDeleteConfirmationWindow(meter.id, meter.name)}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
                    >
                      <Trash2 className="size-5" />
                      Usuń
                    </button>
                  </div>
                </div>
              ))
            }
            {
              showDeleteConfirmation && (
                <div className="fixed bg-gray-900 text-white p-10 rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  Na pewno chcesz usunąć {meterToDelete.name}?
                  <div className="mt-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleDeleteMeter(meterToDelete.id)}
                      className="bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded-xl cursor-pointer"
                    >
                      Potwierdź
                    </button>
                    <button
                      onClick={() => handleCancelDeleteMeter()}
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

export default MetersManager