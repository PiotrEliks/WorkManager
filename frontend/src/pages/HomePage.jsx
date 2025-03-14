import React, { useState } from 'react'

import MetersManager from '../components/MetersManager.jsx'
import UsersManager from '../components/UsersManager.jsx'

const HomePage = () => {
  const [showMeterManager, setShowMeterManager] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);

  return (
    <div className="h-screen bg-gradient-to-r from-violet-600 to-indigo-600 w-full flex items-center justify-center sm:p-5 md:p-15">
      <div className="bg-white w-full p-5 rounded-2xl min-h-[70vh] max-h-[80vh] flex flex-col shadow-2xl">
        <div className="w-full flex flex-col gap-3 justify-center items-center">
          {
            !showMeterManager && !showUserManager &&
              <div className="bg-white p-3 rounded-md text-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text font-bold">
                WYBIERZ AKCJĘ
              </div>
          }

          {
            !showMeterManager && !showUserManager &&
              <button
                className="cursor-pointer bg-blue-500 p-2 rounded-xl text-white hover:bg-blue-700 min-w-1/2"
                onClick={() => {setShowMeterManager(true)}}
              >
                Zarządzaj miernikami
              </button>
          }
          {
            !showUserManager && !showMeterManager &&
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
          showUserManager && <UsersManager onClose={setShowUserManager}/>
        }
      </div>
    </div>
  );
};

export default HomePage;
