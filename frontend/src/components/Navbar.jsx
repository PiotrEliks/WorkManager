import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, User } from 'lucide-react'

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <div className="w-full flex items-center justify-between fixed p-5">
      {
        authUser &&
          <div 
            className="bg-white rounded-2xl px-4 py-2 inline-flex gap-1 items-center"
            title={`Zalogowano jako ${authUser.fullName}`}
          >
            <User className="size-5" />
            {authUser.fullName}
          </div>
      }
      {
        authUser &&
          <button
            className="px-4 py-2 text-sm cursor-pointer bg-white rounded-2xl hover:bg-white/80"
            onClick={() => {logout()}}
            title="Wyloguj"
          >
            <div className="flex flex-row gap-1 items-center">
              <LogOut className="size-5" />
              <span className="">Wyloguj</span>
            </div>
          </button>
      }
    </div>
  )
}

export default Navbar