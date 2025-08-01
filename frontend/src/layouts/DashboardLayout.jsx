import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import {
  LogOut, FolderOpen, UserRound, Menu, X, CircleUser,
  ShieldCheck, Zap
} from 'lucide-react';

const DashboardLayout = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserInfo, setShowUserInfo] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return sessionStorage.getItem('sidebarCollapsed') === 'true';
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openResources, setOpenResources] = useState(false);
  const [openResourcesSection, setOpenResourcesSection] = useState(null);
  const [openEmployees, setOpenEmployees] = useState(false);
  const [showProtectiveEquipmentSubMenu, setShowProtectiveEquipmentSubMenu] = useState(false);

  useEffect(() => {
    const mapping = {
      meters: '/mierniki',
      protectiveEquipment: '/sprzet-ochronny',
    };

    let found = null;
    Object.entries(mapping).forEach(([key, prefix]) => {
      if (location.pathname.startsWith(prefix)) {
        found = key;
      }
    });

    setOpenResources(!!found);
    setOpenResourcesSection(found);
    setOpenEmployees(location.pathname.startsWith('/pracownicy'));
    
    if (location.pathname.startsWith('/sprzet-ochronny')) {
      setShowProtectiveEquipmentSubMenu(true);
    }
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(c => {
      const newState = !c;
      sessionStorage.setItem('sidebarCollapsed', String(newState));
      return newState;
    });
  };

  const resourceSections = [
    { 
      key: 'meters', 
      icon: <Zap />, 
      label: 'Mierniki', 
      path: '/mierniki?page=1&pageSize=10',
      onClick: () => {
        closeProtectiveEquipmentSubMenu();
        handleNavigation('/mierniki?page=1&pageSize=10');
      }
    },
    { 
      key: 'protectiveEquipment', 
      icon: <ShieldCheck />, 
      label: 'Sprzęt ochronny', 
      path: '',  
      onClick: () => setShowProtectiveEquipmentSubMenu(prev => !prev),  
      subMenu: [
        {
          key: 'elektropomiar',
          label: 'Elektropomiar',
          path: '/sprzet-ochronny?page=1&pageSize=10&type=elektropomiar'
        },
        {
          key: 'deceuninck',
          label: 'Deceuninck',
          path: '/sprzet-ochronny?page=1&pageSize=10&type=deceuninck'
        }
      ]
    },
  ];

  const closeProtectiveEquipmentSubMenu = () => {
    setShowProtectiveEquipmentSubMenu(false);
  };

  const isProtectiveEquipmentActive = location.pathname.startsWith('/sprzet-ochronny') || showProtectiveEquipmentSubMenu;

  return (
    <div className="flex h-screen">

      <aside className={`bg-blue-900 text-white p-4 ${sidebarCollapsed ? "w-18" : "w-54"} flex-none overflow-y-auto transition-all duration-300 hidden md:block`}>
        <button
          onClick={toggleSidebar}
          className="mb-4 cursor-pointer hover:text-white/60"
          title={sidebarCollapsed ? "Rozwiń menu" : "Zwiń menu"}
        >
          <Menu />
        </button>

        <ul>
          <li>
            <button
              onClick={() => {
                setOpenResources(prev => !prev);
                if (sidebarCollapsed) toggleSidebar();
              }}
              className={`w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-blue-700/80 ${openResources ? 'bg-blue-700/80' : ''}`}
            >
              <FolderOpen /> {!sidebarCollapsed && 'Zasoby'}
            </button>

            {openResources && !sidebarCollapsed && (
              <ul className="pl-4">
                {resourceSections.map(sec => (
                  <li key={sec.key}>
                    <button
                      onClick={() => {
                        sec.onClick();  
                      }}
                      className={`w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-blue-800/40 ${openResourcesSection === sec.key ? 'bg-blue-800/80' : ''} ${sec.key === 'protectiveEquipment' && isProtectiveEquipmentActive ? 'bg-blue-800/80' : ''}`}
                    >
                      {sec.icon} {sec.label}
                    </button>
                    {sec.subMenu && showProtectiveEquipmentSubMenu && (
                      <ul className="pl-4">
                        {sec.subMenu.map(sub => (
                          <li key={sub.key}>
                            <button
                              onClick={() => {
                                handleNavigation(sub.path);
                              }}
                              className={`w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-blue-800/40 ${location.search.includes(sub.key) ? 'bg-blue-800/40' : ''}`}
                            >
                              {sub.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
          {authUser.role === "administrator" && (
            <li>
              <button
                onClick={() => {
                  setOpenEmployees(true);
                  setOpenResources(false);
                  setOpenResourcesSection(null);
                  closeProtectiveEquipmentSubMenu();
                  handleNavigation('/pracownicy');
                }}
                className={`w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-blue-700/80 ${openEmployees ? 'bg-blue-700/80' : ''}`}
              >
                <UserRound /> {!sidebarCollapsed && 'Pracownicy'}
              </button>
            </li>
          )}
        </ul>
      </aside>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-blue-900 text-white p-4 md:hidden overflow-y-auto">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="mb-4 cursor-pointer"
          >
            <X />
          </button>
          <ul>
            <li>
              <button
                onClick={() => {
                  setOpenResources(prev => !prev);
                }}
                className={`w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-blue-700/80 ${openResources ? 'bg-blue-700/80' : ''}`}
              >
                <FolderOpen /> Zasoby
              </button>
              {openResources && (
                <ul className="pl-4">
                  {resourceSections.map(sec => (
                    <li key={sec.key}>
                      <button
                        onClick={() => {
                          if (sec.onClick) sec.onClick();
                          else handleNavigation(sec.path);
                        }}
                        className={`w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-blue-800/40 ${openResourcesSection === sec.key ? 'bg-blue-800/80' : ''} ${sec.key === 'protectiveEquipment' && isProtectiveEquipmentActive ? 'bg-blue-800/80' : ''}`}
                      >
                        {sec.icon} {sec.label}
                      </button>
                      {sec.subMenu && showProtectiveEquipmentSubMenu && (
                        <ul className="pl-4">
                          {sec.subMenu.map(sub => (
                            <li key={sub.key}>
                              <button
                                onClick={() => {
                                  handleNavigation(sub.path);
                                }}
                                className={`w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-blue-800/40 ${location.search.includes(sub.key) ? 'bg-blue-800/40' : ''}`}
                              >
                                {sub.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {authUser.role === "administrator" && (
              <li>
                <button
                  onClick={() => {
                    setOpenEmployees(true);
                    setOpenResources(false);
                    setOpenResourcesSection(null);
                    closeProtectiveEquipmentSubMenu();
                    handleNavigation('/pracownicy');
                  }}
                  className={`w-full text-left p-2 mb-1 flex items-center gap-1 rounded-xl cursor-pointer hover:bg-blue-700/80 ${openEmployees ? 'bg-blue-700/80' : ''}`}
                >
                  <UserRound /> Pracownicy
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="flex flex-col flex-1">
        <nav className="bg-white text-black p-2 flex justify-between items-center border-b md:justify-end">
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setMobileSidebarOpen(o => !o)}
          >
            <Menu />
          </button>
          <div className="flex items-center gap-2 relative">
            <span
              className="flex items-center gap-1 bg-white rounded-2xl md:px-3 md:py-1 cursor-pointer hover:bg-blue-700/10"
              onMouseOver={() => setShowUserInfo(true)}
              onMouseLeave={() => setShowUserInfo(false)}
            >
              <CircleUser /> <span className="hidden md:inline">{authUser.fullName}</span>
            </span>
            <button
              onClick={logout}
              className="md:bg-blue-700 hover:bg-blue-700/80 md:px-3 md:py-1 md:rounded-xl md:flex md:items-center md:gap-1 cursor-pointer"
            >
              <LogOut className="text-blue-700 md:text-white"/> <span className="hidden md:inline text-white">Wyloguj</span>
            </button>
            {showUserInfo && (
              <div className="fixed top-15 right-5 md:right-auto z-50 bg-zinc-100 rounded-2xl px-3 py-1">
                <span className="flex flex-col items-center"><span className="md:hidden">{authUser.fullName}</span>{authUser.role.charAt(0).toUpperCase()}{authUser.role.slice(1)}</span>
              </div>
            )}
          </div>
        </nav>
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
