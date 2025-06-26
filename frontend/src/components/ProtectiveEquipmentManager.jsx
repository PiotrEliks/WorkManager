import React, { useEffect, useState } from 'react'
import { useProtectiveEquipmentStore } from '../store/useProtectiveEquipmentStore.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { Trash2, FilePenLine } from 'lucide-react'
import { isWithinInterval, addDays } from 'date-fns'
import HeadBar from './HeadBar.jsx'
import DeleteConfirmation from './DeleteConfirmation.jsx'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader.jsx'

const ProtectiveEquipmentManager = () => {
  const navigate = useNavigate();
  const { equipment, getEq, deleteEq, isEquipmentLoading } = useProtectiveEquipmentStore();
  const { authUser } = useAuthStore();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [eqToDelete, setEqToDelete] = useState({});

  useEffect(() => {
    getEq();
  }, [getEq]);

  const tableColumns = [
    { key: 'name', label: "Nazwa" }, 
    { key: 'factoryNumber', label: "Nr fabr" }, 
    { key: 'protocolNumber', label: "Nr protokołu" }, 
    { key: 'checkDate', label: "Data sprawdzenia" }, 
    { key: 'nextCheckDate', label: "Data następnego spradzenia" }, 
    { key: 'comments', label: "Uwagi" }, 
    { key: 'editedBy', label: "Edytowane przez" }
  ];

  const tableData = equipment.map(eq => ({
    name: eq.name,
    factoryNumber: eq.factoryNumber,
    protocolNumber: eq.protocolNumber,
    checkDate: eq.checkDate,
    nextCheckDate: eq.nextCheckDate,
    comments: eq.comments || '',
    editedBy: eq.editedBy
  }));

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

  if (!equipment) {
    return <Loader />;
  }

  return (
    <>
      <HeadBar 
        tableColumns={tableColumns}
        tableData={tableData}
        name="sprzet-ochronny"
      />
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
                  authUser.Permission.can_edit &&
                    <button
                      onClick={() => {
                        navigate(`${eq.id}/edytuj`)
                      }}
                      className="bg-blue-800 hover:bg-blue-800/80 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
                      title="Edytuj informacje o sprzęcie"
                    >
                      <FilePenLine className="size-5" />
                      Edytuj
                    </button>
                }
                {
                  authUser.Permission.can_delete &&
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
            <DeleteConfirmation
              itemLabel={`${eqToDelete.name} ${eqToDelete.factoryNumber} ${eqToDelete.protocolNumber}`}
              onConfirm={() => handleDeleteEq(eqToDelete.id)}
              onCancel={() => handleCancelDeleteEq()}
            />
          )
        }
      </div>
    </>
  )
}

export default ProtectiveEquipmentManager