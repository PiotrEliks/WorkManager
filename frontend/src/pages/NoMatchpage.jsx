import React from 'react'
import useDocumentTitle from '../lib/useDocumentTitle'

const NoMatchPage = () => {
  useDocumentTitle('Nie znaleziono strony | Panel Elektropomiar')
  return (
    <div>
      404
    </div>
  )
}

export default NoMatchPage
