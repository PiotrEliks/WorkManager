import React, { useEffect, useState } from 'react'
import { useProtectiveEquipmentStore } from '../store/useProtectiveEquipmentStore.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { LoaderCircle, Trash2, FilePenLine, ArrowLeft, Mail, X, FilePlus, Hash, FileText, CheckCircle, Clock, Calendar, Building2, Tag, FileSpreadsheet } from 'lucide-react'
import { isWithinInterval, addDays, format } from 'date-fns'
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

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

  const exportToExcel = () => {
      const tableColumns = ["Nazwa", "Nr fabr", "Nr protokołu", "Data sprawdzenia", "Data następnego sprawdzenia", "Uwagi", "Edytowane przez"];

      const tableData = equipment.map(eq => ({
        "Nazwa": eq.name,
        "Nr fabr": eq.factoryNumber,
        "Nr protokołu": eq.protocolNumber,
        "Data sprawdzenia": eq.checkDate,
        "Data następnego sprawdzenia": eq.nextCheckDate,
        "Uwagi": eq.comments || '',
        "Edytowane przez": eq.editedBy
      }));

      const ws = XLSX.utils.json_to_sheet(tableData, { header: tableColumns });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sprzęt ochronny');

      XLSX.writeFile(wb, `sprzet_ochronny${format(new Date(), 'dd/MM/yyyy-h:m')}.xlsx`);
    };

    const exportToPDF = () => {
      const doc = new jsPDF();

      doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf', 'Roboto', 'normal');
      doc.setFont('Roboto', 'normal');

      doc.setFontSize(12);

      const tableColumns = ["Nazwa", "Nr fabr", "Nr protokołu", "Data sprawdzenia", "Data następnego sprawdzenia", "Uwagi", "Edytowane przez"];

      const tableData = equipment.map(eq => [
        eq.name,
        eq.factoryNumber,
        eq.protocolNumber,
        eq.checkDate,
        eq.nextCheckDate,
        eq.comments || '',
        eq.editedBy
      ]);

      autoTable(doc, {
        head: [tableColumns],
        body: tableData,
        startY: 20,
      });

      const pdfOutput = doc.output('bloburl');

      const link = document.createElement('a');
      link.href = pdfOutput;
      link.target = '_blank';
      link.click();
    };

  const handleEdit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      name: formData.name,
      factoryNumber: formData.factoryNumber,
      protocolNumber: formData.protocolNumber,
      checkDate: formData.checkcheckDatedate,
      nextCheckDate: formData.nextCheckDate,
      comments: formData.comments === "" ? null : formData.comments
    };
    updateEq(eqToEdit.id, dataToSend);
    setShowEditWindow(false);
    setFormData({ editedBy: authUser.fullName });
  };

  const handleShowDeleteConfirmationWindow = (id, name, factoryNumber, protocolNumber) => {
    setShowDeleteConfirmation(true);
    setEqToDelete({
      id: id,
      name: name,
      factoryNumber: factoryNumber,
      protocolNumber: protocolNumber
    });
  };

  const handleDeleteEq = (id) => {
    deleteEq(id);
    setShowDeleteConfirmation(false);
    setEqToDelete({});
  };

  const handleCancelDeleteEq = () => {
    setShowDeleteConfirmation(false);
    setEqToDelete({});
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

  const isAfterDeadline = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    if (!dateString) return;

    return today > date;
  };

  const isTwoMonthsToDeadline = (dateString) => {
    const today = new Date();
    const plusTwoMonths = addDays(today, 62);

    const date = new Date(dateString);

    return isWithinInterval(date, { start: today, end: plusTwoMonths });
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
                className="cursor-pointer bg-blue-800 hover:bg-blue-800/80 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
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
        <div className="w-full relative h-full flex flex-col overflow-auto">
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
                    onChange={(e) => {setFormData({ ...formData, name: e.target.value });setEqToEdit({ ...eqToEdit, name: ''})}}
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
                    onChange={(e) => {setFormData({ ...formData, factoryNumber: e.target.value }); setEqToEdit({ ...eqToEdit, factoryNumber: ''})}}
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
                    onChange={(e) => {setFormData({ ...formData, protocolNumber: e.target.value }); setEqToEdit({ ...eqToEdit, protocolNumber: ''})}}
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
                    onChange={(e) => {setFormData({ ...formData, checkDate: e.target.value });setEqToEdit({ ...eqToEdit, checkDate: ''})}}
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
                    onChange={(e) => {setFormData({ ...formData, nextCheckDate: e.target.value });setEqToEdit({ ...eqToEdit, nextCheckDate: ''})}}
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
                    onChange={(e) => {setFormData({ ...formData, comments: e.target.value });setEqToEdit({ ...eqToEdit, comments: ''})}}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="cursor-pointer bg-blue-800 hover:bg-blue-800/80 rounded-2xl py-3 text-white font-bold w-full flex flex-row items-center justify-center gap-2"
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
              <div className="flex flex-row gap-1">
                <button
                  onClick={exportToExcel}
                  className="cursor-pointer bg-green-800 hover:bg-green-800/80 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
                  title="Pobierz w formacie .xlsx"
                >
                  <FileSpreadsheet className="size-5" />
                  Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="cursor-pointer bg-red-800 hover:bg-red-800/80 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
                  title="Pobierz w formacie PDF"
                >
                  <FileText className="size-5" />
                  PDF
                </button>
                {
                  authUser.Permissions[0].add_permission &&
                    <button
                      className="cursor-pointer bg-blue-800 hover:bg-blue-800/80 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
                      onClick={() => {setShowAddNewWindow(true)}}
                      title="Dodaj nowy sprzęt"
                    >
                      <FilePlus className="size-5"/>
                      Dodaj nowy
                    </button>
                }
              </div>
            </div>

  <div className="hidden sm:grid-cols-8 gap-2 font-bold border-b pb-2 text-center items-center sm:grid text-sm">
    <div>Nazwa</div>
    <div>Nr fabr</div>
    <div>Nr protokołu</div>
    <div>Data sprawdzenia</div>
    <div>Data następnego sprawdzenia</div>
    <div>Uwagi</div>
    <div>Edytowane przez</div>
  </div>
  <div className="w-full overflow-x-auto h-full flex flex-col mt-3 sm:mt-0">
    {
      !equipment || isEquipmentLoading &&
        <div className="w-full fixed flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoaderCircle className="animate-spin duration-150 size-10" />
        </div>
    }
    {
      equipment && !isEquipmentLoading && equipment.map((eq) => (
        <div key={eq.id} className="grid grid-cols-1 sm:grid-cols-8 gap-2 border-b py-2 text-center items-center text-sm">
          <div className="break-words border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{eq.name}</div>
          <div className="break-words border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{eq.factoryNumber}</div>
          <div className="break-words border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{eq.protocolNumber}</div>
          <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">
            <span
              className={isTwoMonthsToDeadline(eq.nextCheckDate) ?
              'bg-yellow-600 rounded-md font-bold text-white px-2 py-0.5' : !isAfterDeadline(eq.nextCheckDate) ? 'bg-green-600 rounded-md font-bold text-white px-2 py-0.5' : ''}
              title={isTwoMonthsToDeadline(eq.nextCheckDate) ? 'Badanie aktualne jeszcze przez 2 miesiące' : !isAfterDeadline(eq.nextCheckDate) ? 'Badanie aktualne' : ''}>
                {eq.checkDate}
            </span>
          </div>
          <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">
            <span
            className={isDeadline(eq.nextCheckDate) ?
            'bg-orange-400 rounded-md font-bold text-white px-2 py-0.5'
            : isAfterDeadline(eq.nextCheckDate) ?
            'bg-red-600 rounded-md font-bold text-white px-2 py-0.5' : ''}
            title={isDeadline(eq.nextCheckDate) ? 'Zbliżający się termin' : isAfterDeadline(eq.nextCheckDate) ? 'Termin upłynął' : ''}>
              {eq.nextCheckDate}
            </span>
          </div>
          <div className="break-words border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{eq.comments || 'Brak'}</div>
          <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{eq.editedBy}</div>
          <div className="flex flex-col items-center justify-center gap-1">
            {
              authUser.Permissions[0].edit_permission &&
                <button
                  onClick={() => {
                    setShowEditWindow(true);
                    setEqToEdit(eq);
                  }}
                  className="bg-blue-800 hover:bg-blue-800/80 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
                  title="Edytuj informacje o sprzęcie"
                >
                  <FilePenLine className="size-5" />
                  Edytuj
                </button>
            }
            {
              authUser.Permissions[0].delete_permission &&
                <button
                  onClick={() => handleShowDeleteConfirmationWindow(eq.id, eq.name, eq.factoryNumber, eq.protocolNumber)}
                  className="bg-red-500 hover:bg-red-500/70 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
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
          Na pewno chcesz usunąć <span className="font-bold">{eqToDelete.name} {eqToDelete.factoryNumber} {eqToDelete.protocolNumber}</span>?
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