import React, { useState } from 'react'

import MetersManager from '../components/MetersManager.jsx'
import UsersManager from '../components/UsersManager.jsx'

const HomePage = () => {
  const [showMeterManager, setShowMeterManager] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);

  return (
    <div className="h-screen bg-gradient-to-r from-violet-600 to-indigo-600 w-full flex items-center justify-center sm:p-10 md:p-25">
      <div className="bg-white w-full p-5 rounded-2xl h-[70vh] flex flex-col">
        <div className="w-full flex flex-col gap-3 justify-center">
          {
            !showMeterManager && !showUserManager &&
              <button
                className="cursor-pointer bg-blue-500 p-2 rounded-xl text-white hover:bg-blue-700"
                onClick={() => {setShowMeterManager(true)}}
              >
                Zarządzaj miernikami
              </button>
          }
          {
            !showUserManager && !showMeterManager &&
              <button
                className="cursor-pointer bg-blue-500 p-2 rounded-xl text-white hover:bg-blue-700"
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
