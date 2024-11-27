import React from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Image, Files, GalleryHorizontalEnd, Menu, X, Tags } from 'lucide-react';
import LogoCheops from '../../assets/logo-cheops.svg';

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
        <div className="flex items-center justify-between h-16">
          <NavLink 
            to="/" 
            className="group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="relative w-8 h-8 transform group-hover:scale-110 transition-transform duration-300">
              <img 
                src={LogoCheops} 
                alt="Logo Cheops" 
                className="w-full h-full object-contain" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Outils Cheops
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium -mt-1">
                Gestion de fichiers simplifiée
              </span>
            </div>
          </NavLink>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-4">
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
          </div>
        )}
      </div>
    </header>
  );
}