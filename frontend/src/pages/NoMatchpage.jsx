import React from 'react'
import useDocumentTitle from '../lib/useDocumentTitle'
import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const NoMatchPage = () => {
  useDocumentTitle('Nie znaleziono strony | Panel Elektropomiar')
  return (
    <div className="w-full h-full flex items-center justify-center text-center text-gray-800">
      <div className="max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangle size={64} className="text-yellow-500" aria-hidden="true" />
        </div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg mb-6">Niestety, nie znaleźliśmy takiej strony.</p>
        <p className="text-gray-600 mb-6">
          Możliwe, że adres został wpisany błędnie lub strona została usunięta.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  )
}

export default NoMatchPage
