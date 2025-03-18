import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, User } from 'lucide-react'

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [showUserInfo, setShowUserInfo] = useState(false);

  return (
    <div className="w-full flex items-center justify-between fixed p-5">
      {
        authUser &&
        <div className="relative">
          <div
            className="bg-white rounded-2xl px-4 py-2 inline-flex gap-1 items-center cursor-pointer sm:cursor-auto"
            title={`Zalogowano jako ${authUser.fullName}`}
            onMouseOver={() => setShowUserInfo(true)}
            onMouseLeave={() => setShowUserInfo(false)}
          >
            <User className="size-5" />
            <span className="hidden sm:block" >{authUser.fullName} - {authUser.role}</span>
          </div>
          {
            showUserInfo &&
              <div className="sm:hidden fixed top-15 bg-zinc-100 rounded-2xl px-3 py-1">
                <span className="">{authUser.fullName} - {authUser.role}</span>
              </div>
          }
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
              <span className="hidden sm:block">Wyloguj</span>
            </div>
          </button>
      }
    </div>
  )
}

export default Navbar