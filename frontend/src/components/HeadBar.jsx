import React from 'react'
import { FileSpreadsheet, FileText, FilePlus } from 'lucide-react'
import { exportToExcel, exportToPDF } from '../lib/utlis'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const HeadBar = ({ tableColumns, tableData, name}) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  return (
    <div className={`w-full flex flex-row items-center ${authUser.Permission.can_write ? 'justify-between' : 'justify-end'}`}>
      {
        authUser.Permission.can_write &&
          <button
            className="cursor-pointer bg-blue-800 hover:bg-blue-800/80 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
            onClick={() => navigate(`/${name}/nowy`)}
            title="Dodaj nowy miernik"
          >
            <FilePlus className="size-5"/>
            <span className="hidden md:inline">Dodaj nowy</span>
            <span className="inline md:hidden">Nowy</span>
          </button>
      }
      <div className="flex flex-row items-center justify-center gap-1">
        <button
          onClick={() => exportToExcel(tableColumns, tableData, name)}
          className="cursor-pointer bg-green-800 hover:bg-green-800/80 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
          title="Pobierz w formacie .xlsx"
        >
          <FileSpreadsheet className="size-5" />
          Excel
        </button>
        <button
          onClick={() => exportToPDF(tableColumns, tableData, name)}
          className="cursor-pointer bg-red-800 hover:bg-red-800/80 rounded-xl text-white py-1 px-3 flex flex-row items-center justify-center gap-1"
          title="Pobierz w formacie PDF"
        >
          <FileText className="size-5" />
          PDF
        </button>
      </div>
    </div>
  )
}

export default HeadBar
