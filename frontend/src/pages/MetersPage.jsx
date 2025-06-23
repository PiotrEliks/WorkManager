import React, { use } from 'react'
import MetersManager from '../components/MetersManager'
import useDocumentTitle from '../lib/useDocumentTitle'

const MetersPage = () => {
  useDocumentTitle('Mierniki | Panel Elektropomiar')
  return (
    <div>
      <MetersManager />
    </div>
  )
}

export default MetersPage
