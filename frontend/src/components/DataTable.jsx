import React from 'react';

export default function DataTable({
  columns,
  data = [],
  renderActions,
}) {
  const totalCols = columns.length + (renderActions ? 1 : 0);
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${totalCols}, minmax(0,1fr))`,
  };

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="hidden sm:gap-2 font-bold text-sm border-b pb-2 text-center items-center sm:grid"
        style={gridStyle}
      >
        {columns.map(col => (
          <div key={col.key}>{col.label}</div>
        ))}
        {renderActions && <div>Akcje</div>}
      </div>

      <div className="flex flex-col mt-3 sm:mt-0">
        {data.map(row => (
          <div
            key={row.id}
            className="gap-2 border-b py-2 text-center items-center text-sm grid"
            style={gridStyle}
          >
            {columns.map(col => {
              const val = row[col.key];
              const cls = col.getClassName?.(val, row) ?? '';
              const title = col.getTitle?.(val, row);
              return (
                <div key={col.key} className={cls} title={title}>
                  {col.render
                    ? col.render(val, row)
                    : val ?? '—'}
                </div>
              );
            })}
            {renderActions && (
              <div>
                {renderActions(row)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
