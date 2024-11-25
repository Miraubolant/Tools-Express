import React, { useState, useEffect } from 'react';
import { Moon, Sun, Image, Files, Zap, Rocket, ArrowRight } from 'lucide-react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { JPGExpress } from './pages/JPGExpress';
import { RenameExpress } from './pages/RenameExpress';

export function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <NavLink to="/" className="flex items-center space-x-3">
                <Zap className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Express Tools
                </span>
              </NavLink>

              <nav className="flex items-center space-x-1">
                <NavLink
                  to="/jpg-express"
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <Image className="w-5 h-5" />
                  <span>JPG Express</span>
                </NavLink>

                <NavLink
                  to="/rename-express"
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <Files className="w-5 h-5" />
                  <span>Rename Express</span>
                </NavLink>

                <div
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50"
                  title="De nouvelles fonctionnalités arrivent bientôt"
                >
                  <Rocket className="w-5 h-5 animate-bounce" />
                  <span>Plus d'outils à venir</span>
                </div>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  title={darkMode ? 'Mode clair' : 'Mode sombre'}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
          <Routes>
            <Route path="/" element={
              <div className="max-w-5xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <Zap className="w-24 h-24 text-blue-500 animate-bounce" />
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    Express Tools
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Des outils simples et rapides pour vos fichiers
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* JPG Express */}
                  <NavLink 
                    to="/jpg-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <Image className="w-8 h-8 text-blue-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">JPG Express</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Convertissez rapidement vos images en JPG avec une interface intuitive :
                    </p>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-300 mb-6">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Conversion par glisser-déposer</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Support de multiples formats (PNG, WebP, HEIC, etc.)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Traitement par lots avec barre de progression</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Téléchargement groupé des images converties</span>
                      </li>
                    </ul>
                    <span className="text-blue-500 group-hover:underline">Commencer la conversion →</span>
                  </NavLink>

                  {/* Rename Express */}
                  <NavLink 
                    to="/rename-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <Files className="w-8 h-8 text-blue-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rename Express</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Renommez facilement vos fichiers en masse avec des outils puissants :
                    </p>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-300 mb-6">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Renommage par lot avec prévisualisation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Rechercher et remplacer dans les noms</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Filtrage et sélection multiple</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Support des dossiers et sous-dossiers</span>
                      </li>
                    </ul>
                    <span className="text-blue-500 group-hover:underline">Commencer le renommage →</span>
                  </NavLink>
                </div>
              </div>
            } />
            <Route path="/jpg-express" element={<JPGExpress />} />
            <Route path="/rename-express" element={<RenameExpress />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aucun fichier n'est enregistré sur nos serveurs. Tout le traitement est effectué localement dans votre navigateur.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Créé par Victor Mirault
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}