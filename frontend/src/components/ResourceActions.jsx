import React from 'react'
import { FilePenLine, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export function ResourceActions({ entity, confirmDelete }) {
  const navigate = useNavigate()
  const { authUser } = useAuthStore()

  return (
    <div className="flex flex-row items-center justify-center gap-1">
      {authUser.Permission.can_edit && (
        <button
          onClick={() => navigate(`${entity.id}/edytuj`)}
          className="cursor-pointer"
        >
          <FilePenLine className="size-5 text-blue-500 hover:text-blue-500/50" />
        </button>
      )}
      {authUser.Permission.can_delete && (
        <button
          onClick={() => confirmDelete({ ...entity, _label: entity._label })}
          className="cursor-pointer"
        >
          <Trash2 className="size-5 text-red-500 hover:text-red-500/50" />
        </button>
      )}
    </div>
  )
}
