import React from 'react'
import { FilePenLine, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export function ResourceActions({ entity, confirmDelete }) {
  const navigate = useNavigate()
  const { authUser } = useAuthStore()

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      {authUser.Permission.can_edit && (
        <button
          onClick={() => navigate(`${entity.id}/edytuj`)}
          className="bg-blue-800 hover:bg-blue-800/80 text-white py-1 px-3 rounded-xl flex items-center gap-1 cursor-pointer"
        >
          <FilePenLine className="size-5" /> Edytuj
        </button>
      )}
      {authUser.Permission.can_delete && (
        <button
          onClick={() => confirmDelete({ ...entity, _label: entity._label })}
          className="bg-red-500 hover:bg-red-500/70 text-white py-1 px-3 rounded-xl flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="size-5" /> Usuń
        </button>
      )}
    </div>
  )
}
