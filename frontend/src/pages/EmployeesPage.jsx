import React from 'react'
import UsersManager from '../components/UsersManager'
import useDocumentTitle from '../lib/useDocumentTitle'

const EmployeesPage = () => {
  useDocumentTitle('Pracownicy | Panel Elektropomiar')
  return (
    <div>
      <UsersManager />
    </div>
  )
}

export default EmployeesPage
