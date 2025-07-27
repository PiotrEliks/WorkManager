import React from 'react'
import { FileSpreadsheet, FileText, FilePlus } from 'lucide-react'
import { exportToExcel, exportToPDF } from '../lib/utlis'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const HeadBar = ({ tableColumns, fetchItems, name, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || 'elektropomiar';

  const handleExcelExport = async () => {
    const response = await fetchItems(1, 1, type, true);
    exportToExcel(tableColumns, response, name, type);
  }

  const handlePDFExport = async () => {
    const response = await fetchItems(1, 1, type, true);
    exportToPDF(tableColumns, response, name, type);
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  return (
    <div className={`w-full flex flex-col items-center ${authUser.Permission.can_write ? 'justify-between' : 'justify-end'}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Szukaj..."
        className="border border-gray-300 rounded-lg p-2 text-sm w-full md:hidden"
      />
      <div className="flex flex-row items-center justify-between w-full mt-3 md:mt-0">
        {
          authUser.Permission.can_write &&
            <button
              className="cursor-pointer bg-blue-800 hover:bg-blue-800/80 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
              onClick={() => navigate(`/${name}/nowy?type=${type}`)}
              title="Dodaj nowy"
            >
              <FilePlus className="size-5"/>
              <span className="hidden md:inline">Dodaj nowy</span>
              <span className="inline md:hidden">Nowy</span>
            </button>
        }
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Szukaj..."
          className="border border-gray-300 rounded-lg p-2 text-sm w-64 lg:w-100 hidden md:block"
        />
        <div className="flex flex-row items-center justify-center gap-1">
          <button
            onClick={() => handleExcelExport()}
            className="cursor-pointer bg-green-800 hover:bg-green-800/80 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
            title="Pobierz w formacie .xlsx"
          >
            <FileSpreadsheet className="size-5" />
            Excel
          </button>
          <button
            onClick={() => handlePDFExport()}
            className="cursor-pointer bg-red-800 hover:bg-red-800/80 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
            title="Pobierz w formacie PDF"
          >
            <FileText className="size-5" />
            PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeadBar
