import React from 'react'
import ProtectiveEquipmentManager from '../../components/ProtectiveEquipmentManager'
import useDocumentTitle from '../../lib/useDocumentTitle'

const ProtectiveEquipmentPage = () => {
  useDocumentTitle('Sprzęt ochronny | Panel Elektropomiar')
  return (
    <div>
      <ProtectiveEquipmentManager />
    </div>
  )
}

export default ProtectiveEquipmentPage
