import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function DataTable({
  columns,
  data = [],
  renderActions,
  sortConfig,
  setSortConfig,
}) {
  const reduced = columns.filter(col => col.key !== 'nextcheckin');
  const isMobile = useMediaQuery({ maxWidth: 1188 });

  const [visibleSortMenu, setVisibleSortMenu] = useState(null);

  const toggleSortMenu = (key) => {
    setVisibleSortMenu(visibleSortMenu === key ? null : key);
  };

  const handleClearSort = () => {
    setSortConfig(null, null);
  };

  if (isMobile) {
    return (
      <div className="space-y-4 mt-3">
        {data.length === 0
          ? <div className="p-4 bg-white rounded-lg shadow text-center">Brak danych</div>
          : data.map(row => (
            <div key={row.id} className="bg-white p-4 rounded-lg shadow">
              {reduced.map(col => {
                const val = row[col.key] && row[col.key] !== '' ? row[col.key] : '—';
                const cls = col.getClassName?.(val, row) ?? '';
                const title = col.getTitle?.(val, row);
                return (
                  <div key={col.key} className="flex justify-between py-1">
                    <span className="font-medium text-gray-600">{col.label}:</span>
                    <span
                      className={`${cls} text-gray-800 whitespace-normal break-all min-w-0`}
                      title={title}
                    >
                      {col.render ? col.render(val, row) : val}
                    </span>
                  </div>
                );
              })}
              {renderActions && (
                <div className="mt-2 flex justify-end space-x-2">
                  {renderActions(row)}
                </div>
              )}
            </div>
          ))
        }
      </div>
    );
  }

  const totalCols = reduced.length + (renderActions ? 1 : 0);
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))`,
  };

  return (
    <div className="w-full overflow-x-auto mt-3">
      <div
        className="grid border bg-gray-100 text-sm font-semibold text-center"
        style={gridStyle}
      >
        {reduced.map(col => (
          <div
            key={col.key}
            className="py-2 border-r last:border-r-0 px-2 min-w-0 cursor-pointer"
            onClick={() => toggleSortMenu(col.key)}
          >
            <div className="flex items-center justify-center w-full gap-0.5">
              <span>{col.label}</span>
              {sortConfig.key === col.key && sortConfig.direction && (
                <span className="text-xs">
                  {sortConfig.direction === 'asc' ? <ArrowUp className='size-4 text-blue-700' /> : <ArrowDown className='size-4 text-blue-700' />}
                </span>
              )}
            </div>

            {visibleSortMenu === col.key && (
              <div className="absolute bg-white border border-gray-300 mt-1 p-2 shadow-lg rounded-md">
                <button
                  onClick={() => setSortConfig(col.key, 'asc')}
                  className="block w-full text-sm text-gray-600 hover:bg-gray-100 p-1 cursor-pointer"
                >
                  Sortuj malejąco
                </button>
                <button
                  onClick={() => setSortConfig(col.key, 'desc')}
                  className="block w-full text-sm text-gray-600 hover:bg-gray-100 p-1 cursor-pointer"
                >
                  Sortuj rosnąco
                </button>
                {sortConfig.key === col.key && sortConfig.direction && (
                  <button
                    onClick={handleClearSort}
                    className="block w-full text-sm text-red-500 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                  >
                    Wyczyść sortowanie
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {renderActions && (
          <div className="py-2 px-2 min-w-0"><span>Akcje</span></div>
        )}
      </div>

      {data.length === 0
        ? <div className="p-4 text-center">Brak danych</div>
        : data.map(row => (
          <div
            key={row.id}
            className="grid border-b border-x text-sm text-center"
            style={gridStyle}
          >
            {reduced.map(col => {
              const val = row[col.key] && row[col.key] !== '' ? row[col.key] : '—';
              const cls = col.getClassName?.(val, row) ?? '';
              const title = col.getTitle?.(val, row);
              return (
                <div
                  key={col.key}
                  className="py-2 border-r last:border-r-0 px-2 min-w-0 flex items-center justify-center"
                  title={title}
                >
                  <span className={`${cls} whitespace-normal break-all`}>
                    {col.render ? col.render(val, row) : val}
                  </span>
                </div>
              );
            })}
            {renderActions && (
              <div className="py-2 px-2 min-w-0 flex items-center justify-center">
                {renderActions(row)}
              </div>
            )}
          </div>
        ))
      }
    </div>
  );
}
