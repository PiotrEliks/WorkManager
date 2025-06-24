import React from 'react'

const DeleteConfirmation = ({ itemLabel, onConfirm, onCancel }) => {
  return (
    <div className="fixed bg-gray-900 text-white p-10 rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      Na pewno chcesz usunąć <span className="font-bold">{itemLabel}</span>?
      <div className="mt-4 flex justify-center gap-4">
        <button onClick={onConfirm} className="bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded-xl cursor-pointer">Potwierdź</button>
        <button onClick={onCancel} className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded-xl cursor-pointer">Anuluj</button>
      </div>
    </div>
  )
}

export default DeleteConfirmation