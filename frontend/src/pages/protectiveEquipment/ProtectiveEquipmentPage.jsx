import React from 'react'
import { useNavigate } from 'react-router-dom'
import ResourceManager from '../../components/ResourceManager'
import { useProtectiveEquipmentStore } from '../../store/useProtectiveEquipmentStore'
import { useAuthStore } from '../../store/useAuthStore'
import { Trash2, FilePenLine } from 'lucide-react'
import useDocumentTitle from '../../lib/useDocumentTitle'
import { isAfterDeadline, isDeadline, dateFormat } from '../../lib/deadline'

const ProtectiveEquipmentPage = () => {
  useDocumentTitle('Sprzęt ochronny | Panel Elektropomiar')
  const navigate = useNavigate()
    const { authUser } = useAuthStore()
    const { equipment, getEq, deleteEq, isEquipmentLoading } = useProtectiveEquipmentStore()
  
    const columns = [
      { key: 'name', label: "Nazwa" }, 
      { key: 'factoryNumber', label: "Nr fabr" }, 
      { key: 'protocolNumber', label: "Nr protokołu" }, 
      { 
        key: 'checkDate',
        label: "Data sprawdzenia",
        getClassName: (val) => {
          if (isAfterDeadline(val)) return 'bg-red-600 text-white rounded px-2';
          if (isDeadline(val, 30)) return 'bg-orange-400 text-white rounded px-2';
          return 'bg-green-600 text-white rounded px-2';
        },
        getTitle: (val) => {
          if (isAfterDeadline(val)) return 'Termin upłynął';
          if (isDeadline(val, 30)) return 'Zbliża się termin';
          return 'Termin w bezpiecznym okresie';
        },
        render: (val) => dateFormat(val)
      }, 
      { 
        key: 'nextCheckDate', 
        label: "Data następnego spradzenia",
        getClassName: (val) => {
          if (isAfterDeadline(val)) return 'bg-red-600 text-white rounded px-2';
          if (isDeadline(val, 30)) return 'bg-orange-400 text-white rounded px-2';
          return 'bg-green-600 text-white rounded px-2';
        },
        getTitle: (val) => {
          if (isAfterDeadline(val)) return 'Termin upłynął';
          if (isDeadline(val, 30)) return 'Zbliża się termin';
          return 'Termin w bezpiecznym okresie';
        },
        render: (val) => dateFormat(val)
      }, 
      { key: 'comments', label: "Uwagi" }, 
      { key: 'editedBy', label: "Edytowane przez" }
    ]
  return (
    <ResourceManager
      name="sprzet-ochronny"
      columns={columns}
      items={equipment}
      loading={isEquipmentLoading}
      fetchItems={getEq}
      deleteItem={deleteEq}
      renderActions={(eq, confirmDelete) => (
        <div className="flex flex-col items-center justify-center gap-1">
          {authUser.Permission.can_edit && (
            <button
              onClick={() => navigate(`${eq.id}/edytuj`)}
              className="bg-blue-800 hover:bg-blue-800/80 text-white py-1 px-3 rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <FilePenLine className="size-5" />
              Edytuj
            </button>
          )}
          {authUser.Permission.can_delete && (
            <button
              onClick={() =>
                confirmDelete({
                  ...eq,
                  _label: `${eq.type} ${eq.number}`
                })
              }
              className="bg-red-500 hover:bg-red-500/70 text-white py-1 px-3 rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="size-5" />
              Usuń
            </button>
          )}
        </div>
      )}
    />
  )
}

export default ProtectiveEquipmentPage
