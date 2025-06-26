import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMeterStore } from '../store/useMeterStore.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { Trash2, FilePenLine } from 'lucide-react'
import { isWithinInterval, addDays } from 'date-fns'
import HeadBar from './HeadBar.jsx'
import DeleteConfirmation from './DeleteConfirmation.jsx'
import Loader from '../components/Loader.jsx'

const MetersManager = () => {
  const navigate = useNavigate();
  const { meters, getMeters, deleteMeter, areMetersLoading } = useMeterStore();
  const { authUser } = useAuthStore();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [meterToDelete, setMeterToDelete] = useState({});

  useEffect(() => {
    getMeters();
  }, [getMeters]);

  const tableColumns = [
    { key: 'type', label: "Typ" }, 
    { key: 'number', label: "Numer"}, 
    { key: 'producer', label: "Producent" }, 
    { key: 'comments', label: "Uwagi" }, 
    { key: 'checkdate', label: "Termin sprawdzenia" }, 
    { key: 'nextcheckdate', label: "Nastepny termin sprawdzenia" }, 
    { key: 'condition', label: "Stan" }, 
    { key: 'editedBy', label: "Edytowane przez" }
  ];

  const tableData = meters.map(meter => ({
    type: meter.type,
    number: meter.number,
    producer: meter.producer,
    comments: meter.comments || '',
    checkdate: meter.checkdate,
    nextcheckdate: meter.nextcheckdate,
    condition: meter.condition || '',
    editedBy: meter.editedBy
  }));

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

  if (!meters) {
    return <Loader />;
  }

  return (
    <>
      <HeadBar 
        tableColumns={tableColumns}
        tableData={tableData}
        name="mierniki"
      />

    <div className="hidden sm:grid-cols-10 gap-2 font-bold text-sm border-b pb-2 text-center items-center sm:grid">
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
    <div className="w-full overflow-x-auto h-full flex flex-col mt-3 sm:mt-0">
      {
        meters && !areMetersLoading && meters.map((meter) => (
          <div key={meter.id} className={`grid grid-cols-1 sm:grid-cols-10 gap-2 border-b py-2 text-center items-center text-sm ${meter.condition === "Wyłączony z użytkowania" ? 'bg-zinc-200' : ''}`}>
            <div className="break-words border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{meter.type}</div>
            <div className="break-words border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{meter.number}</div>
            <div>{meter.producer}</div>
            <div className="break-words border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{meter.comments || 'Brak'}</div>
            <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">
              <span
                className={isTwoMonthsToDeadline(meter.nextcheckdate) ?
                'bg-yellow-600 rounded-md font-bold text-white px-2 py-0.5' : !isAfterDeadline(meter.nextcheckdate) ? 'bg-green-600 rounded-md font-bold text-white px-2 py-0.5' : ''}
                title={isTwoMonthsToDeadline(meter.nextcheckdate) ? 'Badanie aktualne jeszcze przez 2 miesiące' : !isAfterDeadline(meter.nextcheckdate) ? 'Badanie aktualne' : ''}>
                  {meter.checkdate}
              </span>
            </div>
            <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">
              <span
              className={isDeadline(meter.nextcheckdate) ?
              'bg-orange-400 rounded-md font-bold text-white px-2 py-0.5'
              : isAfterDeadline(meter.nextcheckdate) ?
              'bg-red-600 rounded-md font-bold text-white px-2 py-0.5' : ''}
              title={isDeadline(meter.nextcheckdate) ? 'Zbliża się termin następnego badania' : isAfterDeadline(meter.nextcheckdate) ? 'Badanie nieaktualne' : ''}>
                {meter.nextcheckdate}
              </span>
            </div>
            {
              meter.nextcheckin &&
                <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{meter.nextcheckin} msc</div>
            }
            {
              !meter.nextcheckin &&
                <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0"></div>
            }
            <div className="break-words border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{meter.condition || 'Brak'}</div>
            <div className="border-b-1 border-zinc-300 sm:border-none mx-5 sm:mx-0">{meter.editedBy}</div>
            <div className="flex flex-col items-center justify-center gap-1">
              {
                authUser.Permission.can_edit &&
                  <button
                    onClick={() => {
                      navigate(`${meter.id}/edytuj`);
                    }}
                    className="bg-blue-800 hover:bg-blue-800/80 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
                    title="Edytuj informacje o mierniku"
                  >
                    <FilePenLine className="size-5" />
                    Edytuj
                  </button>
              }
              {
                authUser.Permission.can_delete &&
                  <button
                    onClick={() => handleShowDeleteConfirmationWindow(meter.id, meter.type, meter.number, meter.producer)}
                    className="bg-red-500 hover:bg-red-500/70 text-white py-1 px-3 rounded-xl cursor-pointer flex flex-row items-center gap-1"
                    title="Usuń miernik"
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
            itemLabel={`${meterToDelete.type} ${meterToDelete.number} ${meterToDelete.producer}`}
            onConfirm={() => handleDeleteMeter(meterToDelete.id)}
            onCancel={() => handleCancelDeleteMeter()}
          />
        )
      }
    </div>
    </>
  )
}

export default MetersManager