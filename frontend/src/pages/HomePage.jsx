import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import MetersManager from '../components/MetersManager.jsx'
import UsersManager from '../components/UsersManager.jsx'
import ProtectiveEquipmentManager from '../components/ProtectiveEquipmentManager.jsx'
import ChangePassword from '../components/ChangePassword.jsx'

const HomePage = () => {
  const [showMeterManager, setShowMeterManager] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);
  const [showProtectiveEquipmentManager, setShowProtectiveEquipmentManager] = useState(false);
  const { authUser } = useAuthStore();

  if (!authUser.passwordChanged) return <ChangePassword />

  return (
    <div className="h-screen bg-gradient-to-r from-violet-600 to-indigo-600 w-full flex items-center justify-center sm:p-5 md:p-15">
      <div className="bg-white w-full p-5 rounded-2xl min-h-[70vh] max-h-[80vh] flex flex-col shadow-2xl">
        <div className="w-full flex flex-col gap-3 justify-center items-center">
          {
             !showProtectiveEquipmentManager && !showMeterManager && !showUserManager &&
                <div className="w-1/4 mb-10">
                  <img src="/logo.png" alt="logo"/>
                </div>
          }

          {
             !showProtectiveEquipmentManager && !showMeterManager && !showUserManager &&
              <button
                className="cursor-pointer bg-blue-500 p-2 rounded-xl text-white hover:bg-blue-700 min-w-1/2"
                onClick={() => {setShowMeterManager(true)}}
              >
                Zarządzaj miernikami
              </button>
          }
          {
            !showProtectiveEquipmentManager && !showMeterManager && !showUserManager &&
              <button
                className="cursor-pointer bg-blue-500 p-2 rounded-xl text-white hover:bg-blue-700 min-w-1/2"
                onClick={() => {setShowProtectiveEquipmentManager(true)}}
              >
                Zarządzaj sprzętem ochronnym
              </button>
          }
          {
            !showProtectiveEquipmentManager && !showUserManager && !showMeterManager && authUser.role === 'administrator' &&
              <button
                className="cursor-pointer bg-blue-500 p-2 rounded-xl text-white hover:bg-blue-700 min-w-1/2"
                onClick={() => {setShowUserManager(true)}}
              >
                Zarządzaj pracownikami
              </button>
          }
        </div>

        {
          showMeterManager && <MetersManager onClose={setShowMeterManager}/>
        }
        {
          showProtectiveEquipmentManager && <ProtectiveEquipmentManager onClose={setShowProtectiveEquipmentManager}/>
        }
        {
          showUserManager && <UsersManager onClose={setShowUserManager}/>
        }
      </div>
    </div>
  );
};

export default HomePage;
