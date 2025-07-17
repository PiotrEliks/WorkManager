import React from 'react';
import { useMediaQuery } from 'react-responsive';

export default function DataTable({
  columns,
  data = [],
  renderActions,
}) {
  const reduced = columns.filter(col => col.key !== 'nextcheckin');
  const isMobile = useMediaQuery({ maxWidth: 1188 });

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
            className="py-2 border-r last:border-r-0 px-2 min-w-0"
          >
            <span className="whitespace-normal break-all">{col.label}</span>
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
