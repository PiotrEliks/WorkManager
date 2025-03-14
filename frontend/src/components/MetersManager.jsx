import React, { useEffect, useState } from 'react'
import { useMeterStore } from '../store/useMeterStore.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { LoaderCircle, Trash2, FilePenLine, ArrowLeft, Mail, X, FilePlus, Hash, FileText, CheckCircle, Clock, Calendar, Building2, Tag } from 'lucide-react'
import { isToday, isThisWeek } from 'date-fns'

const MetersManager = ({ onClose }) => {
  const { meters, getMeters, deleteMeter, updateMeter, addMeter, isAdding, isUpdating, areMetersLoading } = useMeterStore();
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

  const handleShowDeleteConfirmationWindow = (id, type, number, producer) => {
    setShowDeleteConfirmation(true);
    setMeterToDelete({
      id: id,
      type: type,
      number: number,
      producer: producer
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

  const isDeadline = (dateString) => {
    const date = new Date(dateString);
    return isToday(date) || isThisWeek(date) ? true : false;
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
                    Typ
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Tag className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź typ"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Numer
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Hash className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź numer"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Producent
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Building2 className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź producenta"
                    value={formData.producer}
                    onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Termin sprawdzenia (deklaracja producenta)
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Calendar className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="date"
                    className="w-full py-4 pl-10 pr-3 border rounded-2xl"
                    value={formData.checkdate}
                    onChange={(e) => setFormData({ ...formData, checkdate: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Następne sprawdzanie za
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Clock className="size-5 text-black/70 z-10" />
                  </div>
                  <select
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    value={formData.nextcheckin}
                    onChange={(e) => {
                      setFormData({ ...formData, nextcheckin: e.target.value });
                    }}
                  >
                    <option value="">
                      {formData.nextcheckin ||  "Wybierz"}
                    </option>
                    <option value={12}>12 msc</option>
                    <option value={13}>13 msc</option>
                    <option value={24}>24 msc</option>
                  </select>
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Stan
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <CheckCircle className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź stan"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
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
                    Typ
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Tag className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź typ"
                    value={meterToEdit.type || formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Numer
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Hash className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź numer"
                    value={meterToEdit.number || formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Producent
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Building2 className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź producenta"
                    value={meterToEdit.producer || formData.producer}
                    onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Termin sprawdzenia (deklaracja producenta)
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Calendar className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="date"
                    className="w-full py-4 pl-10 pr-3 border rounded-2xl"
                    value={meterToEdit.checkdate || formData.checkdate}
                    onChange={(e) => setFormData({ ...formData, checkdate: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Następne sprawdzanie za
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Clock className="size-5 text-black/70 z-10" />
                  </div>
                  <select
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    value={meterToEdit.nextcheckin || formData.nextcheckin}
                    onChange={(e) => {
                      setFormData({ ...formData, nextcheckin: e.target.value });
                    }}
                  >
                    <option value="">
                      {formData.nextcheckin ||  "Wybierz"}
                    </option>
                    <option value={12}>12 msc</option>
                    <option value={13}>13 msc</option>
                    <option value={24}>24 msc</option>
                  </select>
                </div>
              </div>
              <div className="w-full relative gap-3">
                <label className="absolute top-0 left-3 z-1 bg-white -translate-y-3 px-2">
                  <span className="font-medium">
                    Stan
                  </span>
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <CheckCircle className="size-5 text-black/70 z-10" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 py-4 bg-white rounded-2xl border-1"
                    placeholder="Wprowadź stan"
                    value={meterToEdit.condition || formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
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
                    value={formData.comments || meterToEdit.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-violet-600 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
                disabled={isUpdating}
                title="Zapisz informacje o mierniku"
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
                title="Dodaj nowy miernik"
              >
                <FilePlus className="size-5"/>
                Dodaj nowy
              </button>
            </div>

  <div className="hidden sm:grid-cols-10 gap-2 font-bold border-b pb-2 text-center items-center sm:grid">
    <div>Typ</div>
    <div>Numer</div>
    <div>Producent</div>
    <div>Uwagi</div>
    <div>Termin sprawdzenia (deklaracja producenta)</div>
    <div>Następny termin sprawdzenia</div>
    <div>Termin sprawdzenia</div>
    <div>Stan</div>
    <div>Edytowane przez</div>
  </div>
  <div className="w-full overflow-x-auto h-full flex flex-col">
    {
      !meters || areMetersLoading &&
        <div className="w-full fixed flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoaderCircle className="animate-spin duration-150 size-10" />
        </div>
    }
    {
      meters && !areMetersLoading && meters.map((meter) => (
        <div key={meter.id} className="grid grid-cols-1 sm:grid-cols-10 gap-2 border-b py-2 text-center items-center">
          <div className="break-words">{meter.type}</div>
          <div className="break-words">{meter.number}</div>
          <div>{meter.producer}</div>
          <div className="break-words">{meter.comments || 'Brak'}</div>
          <div><span className={isDeadline(meter.checkdate) ? 'bg-red-600 rounded-md font-bold text-white px-2 py-0.5' : ''}>{meter.checkdate}</span></div>
          <div>{meter.nextcheckdate}</div>
          <div>{meter.nextcheckin} msc</div>
          <div className="break-words">{meter.condition || 'Brak'}</div>
          <div>{meter.editedBy}</div>
          <div className="flex flex-col items-center justify-center gap-1">
            <button
              onClick={() => {
                setShowEditWindow(true);
                setMeterToEdit(meter);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
              title="Edytuj informacje o mierniku"
            >
              <FilePenLine className="size-5" />
              Edytuj
            </button>
            <button
              onClick={() => handleShowDeleteConfirmationWindow(meter.id, meter.type, meter.number, meter.producer)}
              className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
              title="Usuń miernik"
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
          Na pewno chcesz usunąć <span className="font-bold">{meterToDelete.type} {meterToDelete.number} {meterToDelete.producer}</span>?
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