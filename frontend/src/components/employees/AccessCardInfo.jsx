import React, { useEffect } from 'react';
import { format, differenceInMinutes } from 'date-fns';
import { useEntryStore } from '../../store/useEntryStore';
import Loader from '../../components/ui/Loader';

const AccessCardInfo = ({ cardId, employeeId: userId }) => {
  const { areEntriesLoading, getUserEntries, entries } = useEntryStore();

  useEffect(() => {
    getUserEntries(userId);
  }, [getUserEntries, userId]);

  const calculateTimeDifference = (entryTime, exitTime) => {
    const diffInMinutes = differenceInMinutes(new Date(exitTime), new Date(entryTime));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  };

  const reversedEntries = [...entries].reverse();

  const groupedEntries = reversedEntries.reduce((acc, entry) => {
    const formattedDate = format(new Date(entry.timestamp), 'dd.MM.yyyy');
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(entry);
    return acc;
  }, {});

  if (areEntriesLoading) {
    return <Loader />
  }

  return (
    <div>
      <p><strong>ID:</strong> {cardId}</p>

      <h5 className="font-medium mt-4 mb-2">Historia odbić</h5>
      
      <div className="bg-gray-100 p-4 rounded-xl">
        {Object.keys(groupedEntries).length > 0 ? (
          Object.keys(groupedEntries).reverse().map((date) => {
            const dayEntries = groupedEntries[date];
            let entryTime = null;
            let exitTime = null;
            let timeDiff = '';

            return (
              <div key={date} className="mb-6">
                <div className="font-medium text-gray-600">{date}</div>
                <hr className="my-2" />

                {dayEntries.map((entry, i) => {
                  const formattedTime = format(new Date(entry.timestamp), 'HH:mm');
                  const entryType = entry.type === 'entry' ? 'Start' : 'Koniec';
                  
                  if (entry.type === 'entry') {
                    entryTime = entry.timestamp;
                  } else if (entry.type === 'exit' && entryTime) {
                    exitTime = entry.timestamp;
                    timeDiff = calculateTimeDifference(entryTime, exitTime);
                    entryTime = null;
                    exitTime = null;
                  }

                  return (
                    <div key={entry.id || i} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-sm text-gray-700">{formattedTime}</div>
                      <div className="text-sm text-gray-700">{entryType}</div>
                      {timeDiff && i === dayEntries.length - 1 && (
                        <div className="text-sm text-blue-500">
                          {timeDiff}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="text-gray-500">Brak danych</div>
        )}
      </div>
    </div>
  );
};

export default AccessCardInfo;
