import React from 'react'
import ResourceManager from '../../components/ResourceManager'
import { useMeterStore } from '../../store/useMeterStore'
import useDocumentTitle from '../../lib/useDocumentTitle'
import { isAfterDeadline, isDeadline, dateFormat } from '../../lib/deadline'
import { ResourceActions } from '../../components/ResourceActions'

export default function MetersPage() {
  useDocumentTitle('Mierniki | Panel Elektropomiar')
  const { meters, getMeters, deleteMeter, areMetersLoading } = useMeterStore()

  const columns = [
    { key: 'type', label: 'Typ' },
    { key: 'number', label: 'Numer' },
    { key: 'producer', label: 'Producent' },
    { 
      key: 'checkdate',
      label: 'Termin sprawdzenia',
      getClassName: (val, row) => {
        if (isAfterDeadline(row.nextcheckdate)) return 'bg-red-500 text-white rounded px-2';
        if (isDeadline(val, 30)) return 'bg-orange-500 text-white rounded px-2';
        return 'bg-green-500 text-white rounded px-2';
      },
      getTitle: (val) => {
        if (isAfterDeadline(val)) return 'Termin upłynął';
        if (isDeadline(val, 30)) return 'Zbliża się termin';
        return 'Termin w bezpiecznym okresie';
      },
      render: (val) => dateFormat(val)
    },
    { 
      key: 'nextcheckdate',
      label: 'Następny termin sprawdzenia',
      getClassName: (val) => {
        if (isAfterDeadline(val)) return 'bg-red-500 text-white rounded px-2';
        if (isDeadline(val, 30)) return 'bg-orange-400 text-white rounded px-2';
        return 'bg-green-500 text-white rounded px-2';
      },
      getTitle: (val) => {
        if (isAfterDeadline(val)) return 'Termin upłynął';
        if (isDeadline(val, 30)) return 'Zbliża się termin';
        return 'Termin w bezpiecznym okresie';
      },
      render: (val) => dateFormat(val)
    },
    { key: 'nextcheckin', label: 'Okres (msc)' },
    { key: 'condition', label: 'Stan' },
    { key: 'comments', label: 'Uwagi' },
    { key: 'editedBy', label: 'Edytowane przez' },
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
        <ResourceActions
          entity={{ ...meter, _label: `${meter.type} ${meter.number}` }}
          confirmDelete={confirmDelete}
        />
      )}
    />
  )
}
