import React from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Image, Files, GalleryHorizontalEnd, Menu, X, Tags } from 'lucide-react';

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
}

export function Navigation({ darkMode, setDarkMode, mobileMenuOpen, setMobileMenuOpen }: NavigationProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink 
            to="/" 
            className="group flex items-center gap-4"
          >
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-300/20 to-teal-300/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
              <img 
                src="https://i.imgur.com/VxI9d5K.png" 
                alt="Logo Cheops" 
                className="relative h-12 w-12 object-contain transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" 
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Outils Cheops
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Solutions pour commissaires-priseurs
              </p>
            </div>
          </NavLink>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/tag-express"
              className={({ isActive }) => `
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <Tags className="w-5 h-5" />
              <span>Étiquettes Lots</span>
            </NavLink>

            <NavLink
              to="/rename-express"
              className={({ isActive }) => `
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <Files className="w-5 h-5" />
              <span>Renommage Fichiers</span>
            </NavLink>

            <NavLink
              to="/jpg-express"
              className={({ isActive }) => `
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <Image className="w-5 h-5" />
              <span>Conversion JPG</span>
            </NavLink>

            <NavLink
              to="/drag-express"
              className={({ isActive }) => `
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <GalleryHorizontalEnd className="w-5 h-5" />
              <span>Tri Visuel</span>
            </NavLink>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              title={darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 mr-2"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            <NavLink
              to="/tag-express"
              className={({ isActive }) => `
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Tags className="w-5 h-5" />
              <span>Étiquettes Lots</span>
            </NavLink>

            <NavLink
              to="/rename-express"
              className={({ isActive }) => `
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Files className="w-5 h-5" />
              <span>Renommage Fichiers</span>
            </NavLink>

            <NavLink
              to="/jpg-express"
              className={({ isActive }) => `
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image className="w-5 h-5" />
              <span>Conversion JPG</span>
            </NavLink>

            <NavLink
              to="/drag-express"
              className={({ isActive }) => `
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
              onClick={() => setMobileMenuOpen(false)}
            >
              <GalleryHorizontalEnd className="w-5 h-5" />
              <span>Tri Visuel</span>
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}