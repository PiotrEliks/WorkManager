import { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Loader from './ui/Loader';
import DeleteConfirmation from './DeleteConfirmation';
import HeadBar from './HeadBar';

export default function ResourceManager({
  name,
  columns,
  items,
  loading,
  fetchItems,
  deleteItem,
  renderActions,
  handlePageChange,
  currentPage: page,
  pageSize,
  totalItems,
  handlePageSizeChange
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const [toDelete, setToDelete] = useState(null);
  const [fullData, setFullData] = useState([]);

  useEffect(() => {
    fetchItems(page, pageSize, false);
  }, [fetchItems, page, pageSize]);

  useEffect(() => {
    const fetchFullData = async () => {
      const response = await fetchItems(page, pageSize, true);
      setFullData(response);
    };
    fetchFullData();
  }, [fetchItems]);

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <>
      <HeadBar
        tableColumns={columns}
        tableData={fullData}
        name={name}
      />
      <DataTable
        columns={columns}
        data={items}
        renderActions={(item) => renderActions(item, setToDelete)}
      />

      {toDelete && (
        <DeleteConfirmation
          itemLabel={toDelete._label}
          onConfirm={() => {
            deleteItem(toDelete.id);
            setToDelete(null);
          }}
          onCancel={() => setToDelete(null)}
        />
      )}

      <div className="w-full flex flex-col sm:flex-row justify-between items-center mt-4">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <span className="text-sm text-gray-600">
            Wyświetlanie {startItem}-{endItem} z {totalItems} pozycji
          </span>
          <select 
            value={pageSize}
            onChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
            className="text-sm bg-white border border-gray-300 rounded-lg h-10 px-4"
          >
            {[10, 20, 40, 60].map((size) => (
              <option key={size} value={size}>
                {size} pozycji
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page <= 1}
            className={`${page <= 1 ? 'cursor-not-allowed bg-gray-100 text-gray-700' : 'cursor-pointer bg-white'} flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700`}
          >
            <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
            </svg>
            Poprzednia
          </button>
          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page === totalPages}
            className={`${page === totalPages ? 'cursor-not-allowed bg-gray-100 text-gray-700' : 'cursor-pointer bg-white'} flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700`}
          >
            Następna
            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
