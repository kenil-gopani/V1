import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { Flame, Bell, Search, GraduationCap, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">EduVerse</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
          
          {user.role === UserRole.TEACHER && (
             <NavLink
             to="/create-course"
             className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-4 ${
               isActive
                 ? 'bg-indigo-50 text-indigo-700'
                 : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
             }`}
           >
             <PlusCircle size={20} />
             Create Course
           </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors mb-4"
          >
            <LogOut size={20} />
            Sign Out
          </button>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg shadow-indigo-200">
            <h4 className="font-semibold text-sm mb-1">Upgrade Plan</h4>
            <p className="text-xs text-indigo-100 mb-3">Get unlimited AI access & mentorship.</p>
            <button className="w-full py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors">
              Go Premium
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-full max-w-md hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search courses, mentors..." 
                 className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
               />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
              <Flame size={18} fill="currentColor" />
              <span className="text-sm font-bold">{user.streak} Day Streak</span>
            </div>

            <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="h-9 w-9 rounded-full object-cover border border-slate-200 bg-indigo-50"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;