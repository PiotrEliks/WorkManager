import React from 'react'
import { useNavigate } from 'react-router-dom'
import ResourceManager from '../../components/ResourceManager'
import { useMeterStore } from '../../store/useMeterStore'
import { useAuthStore } from '../../store/useAuthStore'
import { Trash2, FilePenLine } from 'lucide-react'
import useDocumentTitle from '../../lib/useDocumentTitle'
import { isAfterDeadline, isDeadline, dateFormat } from '../../lib/deadline'

export default function MetersPage() {
  useDocumentTitle('Mierniki | Panel Elektropomiar')
  const navigate = useNavigate()
  const { authUser } = useAuthStore()
  const { meters, getMeters, deleteMeter, areMetersLoading } = useMeterStore()

  const columns = [
    { key: 'type',     label: 'Typ' },
    { key: 'number',   label: 'Numer' },
    { key: 'producer', label: 'Producent' },
    { key: 'comments', label: 'Uwagi' },
    { 
      key: 'checkdate',
      label: 'Termin sprawdzenia',
      getClassName: (val) => {
        if (isAfterDeadline(val))     return 'bg-red-600 text-white rounded px-2';
        if (isDeadline(val, 30))      return 'bg-orange-400 text-white rounded px-2';
        return 'bg-green-600 text-white rounded px-2';
      },
      getTitle: (val) => {
        if (isAfterDeadline(val))     return 'Termin upłynął';
        if (isDeadline(val, 30))      return 'Zbliża się termin';
        return 'Termin w bezpiecznym okresie';
      },
      render: (val) => dateFormat(val)
    },
    { 
      key: 'nextcheckdate',
      label: 'Następny termin sprawdzenia',
      getClassName: (val) => {
        if (isAfterDeadline(val))     return 'bg-red-600 text-white rounded px-2';
        if (isDeadline(val, 30))      return 'bg-orange-400 text-white rounded px-2';
        return 'bg-green-600 text-white rounded px-2';
      },
      getTitle: (val) => {
        if (isAfterDeadline(val))     return 'Termin upłynął';
        if (isDeadline(val, 30))      return 'Zbliża się termin';
        return 'Termin w bezpiecznym okresie';
      },
      render: (val) => dateFormat(val)
    },
    { key: 'nextcheckin',   label: 'Okres (msc)' },
    { key: 'condition',     label: 'Stan' },
    { key: 'editedBy',      label: 'Edytowane przez' },
  ]

  return (
    <ResourceManager
      name="mierniki"
      columns={columns}
      items={meters}
      loading={areMetersLoading}
      fetchItems={getMeters}
      deleteItem={deleteMeter}
      renderActions={(meter, confirmDelete) => (
        <div className="flex flex-col items-center justify-center gap-1">
          {authUser.Permission.can_edit && (
            <button
              onClick={() => navigate(`${meter.id}/edytuj`)}
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
                  ...meter,
                  _label: `${meter.type} ${meter.number}`
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
