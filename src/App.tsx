import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Moon, Sun, Image, Files, GalleryHorizontalEnd, Menu, X, ArrowUp, Tags } from 'lucide-react';
import { JPGExpress } from './pages/JPGExpress';
import { RenameExpress } from './pages/RenameExpress';
import { DragExpress } from './pages/DragExpress';
import { TagExpress } from './pages/TagExpress';
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Router>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        {/* Header */}
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
                  <div className="max-w-3xl mx-auto">
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      Suite d'outils pour le tri, le renommage et la conversion de vos fichiers. 
                      Optimisé pour les commissaires-priseurs, photographes et catalogueurs.
                    </p>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                  {/* Tri Visuel */}
                  <NavLink 
                    to="/drag-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <GalleryHorizontalEnd className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tri Visuel</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Interface intuitive pour organiser et numéroter vos photos par glisser-déposer. 
                      Modifiez les numéros facilement, ajoutez des numéros bis et exportez le tout 
                      avec un nommage cohérent.
                    </p>
                    <span className="text-emerald-500 group-hover:underline">Commencer le tri →</span>
                  </NavLink>

                  {/* Renommage Fichiers */}
                  <NavLink 
                    to="/rename-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <Files className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Renommage Fichiers</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Renommez des centaines de fichiers en quelques clics. Remplacez des textes spécifiques, 
                      ajoutez des préfixes ou suffixes, et prévisualisez les changements avant de les appliquer.
                    </p>
                    <span className="text-emerald-500 group-hover:underline">Commencer le renommage →</span>
                  </NavLink>

                  {/* Conversion JPG */}
                  <NavLink 
                    to="/jpg-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <Image className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conversion JPG</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Convertissez instantanément vos images en JPG. Compatible avec de nombreux formats 
                      (PNG, WEBP, HEIC, etc.), préserve la qualité originale et traite les lots d'images 
                      rapidement.
                    </p>
                    <span className="text-emerald-500 group-hover:underline">Commencer la conversion →</span>
                  </NavLink>

                  {/* Étiquettes Lots */}
                  <NavLink 
                    to="/tag-express"
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <Tags className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Étiquettes Lots</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Générez des étiquettes professionnelles pour vos lots. Personnalisez avec votre logo, 
                      ajoutez des informations de vente et créez des PDF prêts à imprimer avec numérotation 
                      automatique.
                    </p>
                    <span className="text-emerald-500 group-hover:underline">Créer des étiquettes →</span>
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
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aucun fichier n'est enregistré sur nos serveurs. Tout le traitement est effectué localement dans votre navigateur.
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Créé par</span>
                <a 
                  href="https://3pi.fr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <img src={LogoCheops} alt="Logo 3PI" className="w-5 h-5" />
                  <span className="font-medium">3PI</span>
                </a>
              </div>
            </div>
          </div>
        </footer>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </Router>
  );
}