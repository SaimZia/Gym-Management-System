// src/components/layouts/AdminLayout.js
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiSettings, FiBarChart2, FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/accounts', icon: <FiUsers />, label: 'Accounts' },
    { path: '/admin/gyms', icon: <FiSettings />, label: 'Gyms' },
    { path: '/admin/reports', icon: <FiBarChart2 />, label: 'Reports' },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-indigo-800 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4">
          {isSidebarOpen && <span className="text-white font-bold">Admin Panel</span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white p-2 rounded-md hover:bg-indigo-700"
          >
            <FiMenu />
          </button>
        </div>
        <nav className="mt-5 flex-1">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-900 text-white'
                      : 'text-indigo-100 hover:bg-indigo-700'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {isSidebarOpen && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 rounded-md"
          >
            <FiLogOut className="mr-3" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-16 bg-white shadow-sm flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}