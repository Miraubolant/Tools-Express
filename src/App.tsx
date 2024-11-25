import React, { useState, useEffect } from 'react';
import { Moon, Sun, Image, Files, Zap, ArrowRight, GalleryHorizontalEnd, Sparkles, Upload, Download, FolderUp, FileEdit } from 'lucide-react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { JPGExpress } from './pages/JPGExpress';
import { RenameExpress } from './pages/RenameExpress';
import { DragExpress } from './pages/DragExpress';

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
              <NavLink to="/" className="flex items-center space-x-4">
                <Zap className="w-10 h-10 text-blue-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
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

                <NavLink
                  to="/drag-express"
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <GalleryHorizontalEnd className="w-5 h-5" />
                  <span>Drag Express</span>
                </NavLink>

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
                    <Zap className="w-24 h-24 text-blue-500 animate-pulse" />
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    Express Tools
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Des outils simples et rapides pour vos fichiers
                  </p>
                </div>

                <div className="grid gap-8">
                  {/* JPG Express */}
                  <NavLink 
                    to="/jpg-express"
                    className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-shrink-0 p-4 bg-blue-500/10 rounded-2xl">
                        <Image className="w-12 h-12 text-blue-500" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">JPG Express</h2>
                          <p className="text-gray-600 dark:text-gray-300">
                            Convertissez rapidement vos images en JPG avec une interface intuitive et performante
                          </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <Upload className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Glisser-déposer</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Déposez simplement vos images pour commencer</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <FileEdit className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Multi-formats</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">PNG, WebP, HEIC et plus encore</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <FolderUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Traitement par lots</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Convertissez plusieurs images à la fois</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <Download className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">ZIP automatique</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Téléchargement groupé optimisé</p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4">
                          <span className="inline-flex items-center text-blue-500 font-medium group-hover:underline">
                            Commencer la conversion
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </NavLink>

                  {/* Rename Express */}
                  <NavLink 
                    to="/rename-express"
                    className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-shrink-0 p-4 bg-blue-500/10 rounded-2xl">
                        <Files className="w-12 h-12 text-blue-500" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rename Express</h2>
                          <p className="text-gray-600 dark:text-gray-300">
                            Renommez facilement vos fichiers en masse avec des outils puissants et intuitifs
                          </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <Upload className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Sélection multiple</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Gérez plusieurs fichiers à la fois</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <FileEdit className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Recherche & remplacement</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Modifiez les noms avec précision</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <FolderUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Support des dossiers</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Traitez des dossiers entiers</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <Download className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Prévisualisation</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Vérifiez avant de renommer</p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4">
                          <span className="inline-flex items-center text-blue-500 font-medium group-hover:underline">
                            Commencer le renommage
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </NavLink>

                  {/* Drag Express */}
                  <NavLink 
                    to="/drag-express"
                    className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-shrink-0 p-4 bg-blue-500/10 rounded-2xl">
                        <GalleryHorizontalEnd className="w-12 h-12 text-blue-500" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Drag Express</h2>
                          <p className="text-gray-600 dark:text-gray-300">
                            Organisez et renommez vos photos par glisser-déposer avec une interface visuelle intuitive
                          </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <Upload className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Glisser-déposer intuitif</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Réorganisez visuellement vos photos</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <FileEdit className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Numérotation flexible</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Modifiez les positions facilement</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <FolderUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Import de dossiers</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Chargez des dossiers entiers</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <Download className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">Export personnalisé</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Téléchargez avec préfixes</p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4">
                          <span className="inline-flex items-center text-blue-500 font-medium group-hover:underline">
                            Commencer l'organisation
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
            } />
            <Route path="/jpg-express" element={<JPGExpress />} />
            <Route path="/rename-express" element={<RenameExpress />} />
            <Route path="/drag-express" element={<DragExpress />} />
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