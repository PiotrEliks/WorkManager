import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut } from 'lucide-react'

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <div>
      {
        authUser &&
          <button className="block px-4 py-2 text-sm hover:bg-base-100 w-full cursor-pointer" onClick={() => {logout()}}>
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