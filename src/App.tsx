import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Moon, Sun, Image, Files, GalleryHorizontalEnd, Menu, X, Tags, PenTool, Brain, ChevronDown } from 'lucide-react';
import { JPGExpress } from './pages/JPGExpress';
import { RenameExpress } from './pages/RenameExpress';
import { DragExpress } from './pages/DragExpress';
import { TagExpress } from './pages/TagExpress';
import { DesignationExpress } from './pages/DesignationExpress';
import { CategorieExpress } from './pages/CategorieExpress';
import { ContactForm } from './components/ui/ContactForm';
import LogoCheops from './assets/logo-cheops.svg';

export function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [iaMenuOpen, setIaMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <NavLink to="/" className="flex items-center space-x-4">
                <img src={LogoCheops} alt="Logo Cheops" className="w-10 h-10" />
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Outils Cheops
                </span>
              </NavLink>

              {/* Navigation desktop */}
              <nav className="hidden md:flex items-center space-x-1">
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
                  <span>JPG Express</span>
                </NavLink>

                <NavLink
                  to="/rename-express"
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                    ${isActive 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <Files className="w-5 h-5" />
                  <span>Rename Express</span>
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
                  <span>Drag Express</span>
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
                  <span>Tag Express</span>
                </NavLink>

                <div className="relative">
                  <button
                    onClick={() => setIaMenuOpen(!iaMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Brain className="w-5 h-5" />
                    <span>IA Express</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${iaMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {iaMenuOpen && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 animate-fadeIn"
                      onMouseLeave={() => setIaMenuOpen(false)}
                    >
                      <NavLink
                        to="/designation-express"
                        className={({ isActive }) => `
                          flex items-center space-x-2 px-4 py-2 transition-colors
                          ${isActive 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                        `}
                      >
                        <PenTool className="w-5 h-5" />
                        <span>Designation Express</span>
                      </NavLink>
                      <NavLink
                        to="/categorie-express"
                        className={({ isActive }) => `
                          flex items-center space-x-2 px-4 py-2 transition-colors
                          ${isActive 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                        `}
                      >
                        <Tags className="w-5 h-5" />
                        <span>Catégorie Express</span>
                      </NavLink>
                    </div>
                  )}
                </div>

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
                  <span>JPG Express</span>
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
                  <span>Rename Express</span>
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
                  <span>Drag Express</span>
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
                  <span>Tag Express</span>
                </NavLink>

                <div className="px-4 py-2">
                  <button
                    onClick={() => setIaMenuOpen(!iaMenuOpen)}
                    className="flex items-center space-x-2 w-full text-left text-gray-700 dark:text-gray-200"
                  >
                    <Brain className="w-5 h-5" />
                    <span>IA Express</span>
                    <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-200 ${iaMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {iaMenuOpen && (
                    <div className="pl-4 mt-2 space-y-2">
                      <NavLink
                        to="/designation-express"
                        className={({ isActive }) => `
                          flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                        `}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <PenTool className="w-5 h-5" />
                        <span>Designation Express</span>
                      </NavLink>
                      <NavLink
                        to="/categorie-express"
                        className={({ isActive }) => `
                          flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                        `}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Tags className="w-5 h-5" />
                        <span>Catégorie Express</span>
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
          <Routes>
            <Route path="/" element={
              <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <img src={LogoCheops} alt="Logo Cheops" className="w-24 h-24" />
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    Outils Cheops
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Des outils simples et rapides pour vos fichiers
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {/* JPG Express */}
                  <NavLink 
                    to="/jpg-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <Image className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">JPG Express</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Convertissez rapidement vos images en JPG avec une interface intuitive.
                    </p>
                    <span className="text-emerald-500 group-hover:underline">Commencer la conversion →</span>
                  </NavLink>

                  {/* Rename Express */}
                  <NavLink 
                    to="/rename-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <Files className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rename Express</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Renommez facilement vos fichiers en masse avec des outils puissants.
                    </p>
                    <span className="text-emerald-500 group-hover:underline">Commencer le renommage →</span>
                  </NavLink>

                  {/* Drag Express */}
                  <NavLink 
                    to="/drag-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <GalleryHorizontalEnd className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Drag Express</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Organisez et renommez vos photos par glisser-déposer.
                    </p>
                    <span className="text-emerald-500 group-hover:underline">Commencer l'organisation →</span>
                  </NavLink>

                  {/* Tag Express */}
                  <NavLink 
                    to="/tag-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <Tags className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tag Express</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Générez des étiquettes pour vos lots avec toutes les informations nécessaires.
                    </p>
                    <span className="text-emerald-500 group-hover:underline">Créer des étiquettes →</span>
                  </NavLink>

                  {/* Designation Express */}
                  <NavLink 
                    to="/designation-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <PenTool className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Designation Express</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Générez des descriptions professionnelles pour vos lots avec l'aide de l'IA.
                    </p>
                    <span className="text-emerald-500 group-hover:underline">Générer des descriptions →</span>
                  </NavLink>

                  {/* Categorie Express */}
                  <NavLink 
                    to="/categorie-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <Brain className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Catégorie Express</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Analysez vos objets avec l'IA pour déterminer leurs catégories.
                    </p>
                    <span className="text-emerald-500 group-hover:underline">Analyser des objets →</span>
                  </NavLink>
                </div>

                {/* Contact Form Section */}
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Suggérer un nouvel outil
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Vous avez une idée d'outil qui pourrait être utile ? Partagez-la avec nous !
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <ContactForm />
                  </div>
                </div>
              </div>
            } />
            <Route path="/jpg-express" element={<JPGExpress />} />
            <Route path="/rename-express" element={<RenameExpress />} />
            <Route path="/drag-express" element={<DragExpress />} />
            <Route path="/tag-express" element={<TagExpress />} />
            <Route path="/designation-express" element={<DesignationExpress />} />
            <Route path="/categorie-express" element={<CategorieExpress />} />
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
    </Router>
  );
}