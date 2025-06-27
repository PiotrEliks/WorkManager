import React from 'react'
import ResourceManager from '../../components/ResourceManager'
import { useProtectiveEquipmentStore } from '../../store/useProtectiveEquipmentStore'
import useDocumentTitle from '../../lib/useDocumentTitle'
import { isAfterDeadline, isDeadline, dateFormat } from '../../lib/deadline'
import { ResourceActions } from '../../components/ResourceActions'

const ProtectiveEquipmentPage = () => {
  useDocumentTitle('Sprzęt ochronny | Panel Elektropomiar')
    const { equipment, getEq, deleteEq, isEquipmentLoading } = useProtectiveEquipmentStore()
  
    const columns = [
      { key: 'name', label: "Nazwa" }, 
      { key: 'factoryNumber', label: "Nr fabr" }, 
      { key: 'protocolNumber', label: "Nr protokołu" }, 
      { 
        key: 'checkDate',
        label: "Data sprawdzenia",
        getClassName: (val, row) => {
          if (isAfterDeadline(row.nextCheckDate)) return 'bg-red-500 text-white rounded px-2';
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
      { 
        key: 'nextCheckDate', 
        label: "Data następnego sprawdzenia",
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
        <ResourceActions
          entity={{ ...eq, _label: eq.name }}
          confirmDelete={confirmDelete}
        />
      )}
    />
  )
}

export default ProtectiveEquipmentPage
