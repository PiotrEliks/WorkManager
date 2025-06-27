import React from 'react';

export default function DataTable({
  columns,
  data = [],
  renderActions,
}) {
  const reducedColumns = columns.filter(col => col.key !== 'nextcheckin');
  const totalCols = reducedColumns.length + (renderActions ? 1 : 0);
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${totalCols}, minmax(0,1fr))`,
  };

  return (
    <div className="w-full overflow-x-auto mt-3">
      <div
        className="hidden font-bold text-sm border-b text-center items-center sm:grid border-1 rounded-tl-xl rounded-tr-xl bg-zinc-200"
        style={gridStyle}
      >
        {reducedColumns.map(col => (
          <div key={col.key} className="border-r-1 w-full h-full flex items-center justify-center">{col.label}</div>
        ))}
        {renderActions && <div>Akcje</div>}
      </div>
      <div className="flex flex-col mt-3 sm:mt-0">
        {
          data.length == 0 ? 
            <div className="w-full p-3 text-center border-b border-x">
              Brak danych
            </div>
          :
            data.map(row => (
            <div
              key={row.id}
              className="border-b border-x text-center items-center text-sm grid"
              style={gridStyle}
            >
              {reducedColumns.map(col => {
                const val = row[col.key];
                const cls = col.getClassName?.(val, row) ?? '';
                const title = col.getTitle?.(val, row);
                return (
                  <div key={col.key} className="border-r-1 w-full h-full flex items-center justify-center py-1" title={title}>
                    <span className={cls}>
                    {col.render
                      ? col.render(val, row)
                      : val ? val : '—'}
                    </span>
                  </div>
                );
              })}
              {renderActions && (
                <div>
                  {renderActions(row)}
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}
