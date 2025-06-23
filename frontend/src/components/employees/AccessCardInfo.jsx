import React from 'react';
import { format } from 'date-fns';

const AccessCardInfo = ({ cardId, logs }) => {
  return (
    <div>
      <p><strong>ID:</strong> {cardId}</p>

      <h5 className="font-medium mt-4 mb-2">Historia odbić</h5>
      <ul className="text-sm bg-gray-100 rounded-xl p-3 max-h-48 overflow-y-auto">
        {logs && logs.length > 0 ? (
          logs.map((log, i) => (
            <li key={i} className="border-b last:border-none py-1">
              {log.type === 'in' ? 'Start' : 'Koniec'} – {format(new Date(log.timestamp), 'dd.MM.yyyy HH:mm')}
            </li>
          ))
        ) : (
          <li className="text-gray-500">Brak danych</li>
        )}
      </ul>
    </div>
  );
};

export default AccessCardInfo;
