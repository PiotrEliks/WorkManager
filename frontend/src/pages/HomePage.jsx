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
    <div className="h-screen bg-gradient-to-r from-violet-700 to-blue-800 w-full flex items-center justify-center sm:p-5 md:p-15">
      <div className="bg-white w-full p-5 m-1 rounded-2xl min-h-[70vh] max-h-[80vh] flex flex-col shadow-2xl">
        {
          !showProtectiveEquipmentManager && !showMeterManager && !showUserManager &&
            <div className="w-full flex flex-col gap-3 justify-center items-center h-[70vh]">
              <button
                className="cursor-pointer bg-blue-800 p-2 rounded-xl text-white font-bold hover:bg-blue-800/80 w-full sm:w-1/2"
                onClick={() => {setShowMeterManager(true)}}
              >
                Zarządzaj miernikami
              </button>      
              <button
                className="cursor-pointer bg-blue-800 p-2 rounded-xl text-white font-bold hover:bg-blue-800/80 w-full sm:w-1/2"
                onClick={() => {setShowProtectiveEquipmentManager(true)}}
              >
                Zarządzaj sprzętem ochronnym
              </button>
              {
                authUser.role === 'administrator' &&
                  <button
                    className="cursor-pointer bg-blue-800 p-2 rounded-xl text-white font-bold hover:bg-blue-800/80 w-full sm:w-1/2"
                    onClick={() => {setShowUserManager(true)}}
                  >
                    Zarządzaj pracownikami
                  </button>
              }
            </div>
        }

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
