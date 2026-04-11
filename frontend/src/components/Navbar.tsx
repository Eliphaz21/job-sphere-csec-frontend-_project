import React from 'react';
import { Briefcase, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Page } from '../types';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
  user: any;
  onLogout: () => void;
}

export const Navbar = ({ onNavigate, currentPage, user, onLogout }: NavbarProps) => {
  const navLinks: { label: string; page: Page }[] = [
    { label: 'Job Search',      page: 'home'         },
    { label: 'My Applications', page: 'applications' },
    { label: 'Companies',       page: 'companies'    },
    { label: 'Contact Us',      page: 'contact'      },
  ];

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              onClick={() => onNavigate('home')}
            >
              <div className="bg-[#0046D5] p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-[#0046D5] tracking-tight">JOBSPHEERE</span>
            </div>

            {/* Nav links — hidden on mobile */}
            <div className="hidden md:flex items-center gap-10 ml-6">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.page)}
                  className={`text-sm font-bold transition-colors relative py-2 ${
                    currentPage === item.page
                      ? 'text-[#0046D5]'
                      : 'text-gray-500 hover:text-[#0046D5]'
                  }`}
                >
                  {item.label}
                  {currentPage === item.page && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0046D5]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Admin panel button */}
                {user.isAdmin && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      currentPage === 'admin'
                        ? 'bg-[#0046D5] text-white shadow-lg shadow-blue-200'
                        : 'bg-blue-50 text-[#0046D5] hover:bg-blue-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </button>
                )}

                {/* User avatar */}
                <div className="flex items-center gap-3 pr-4 border-r border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0046D5] font-bold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.isAdmin ? 'Administrator' : 'Professional'}</p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-10 py-3 text-sm font-bold text-white bg-[#0046D5] rounded-lg hover:bg-blue-700 transition-all shadow-[0_10px_25px_-5px_rgba(0,70,213,0.5)] active:scale-95"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-10 py-3 text-sm font-bold text-[#0046D5] border-2 border-[#0046D5] rounded-lg hover:bg-blue-50 transition-all active:scale-95"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="h-1 bg-white border-b border-blue-600/10" />
      <div className="h-1 bg-white" />
      <div className="h-1.5 bg-[#0046D5]" />
    </div>
  );
};
