import React, { useState, useEffect } from 'react';
import { Moon, Sun, Image, Files, Zap, GalleryHorizontalEnd, Menu, X, Sparkles, Rocket, Gauge } from 'lucide-react';
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const NavItem = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }) => (
    <NavLink
      to={to}
      onClick={closeMobileMenu}
      className={({ isActive }) => `
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
        ${isActive 
          ? 'bg-blue-500 text-white' 
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
      `}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </NavLink>
  );

  const FeatureCard = ({ 
    to, 
    icon: Icon, 
    title, 
    description, 
    features,
    className = ''
  }: { 
    to: string; 
    icon: React.ElementType; 
    title: string; 
    description: string;
    features: string[];
    className?: string;
  }) => (
    <NavLink 
      to={to}
      className={`group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 ${className}`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Icon className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Fonctionnalités principales</h3>
          </div>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-blue-500 group-hover:underline">
          <Gauge className="w-5 h-5" />
          <span>Commencer maintenant →</span>
        </div>
      </div>
    </NavLink>
  );

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <NavLink to="/" className="flex items-center space-x-4 flex-shrink-0">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Express Tools
                </span>
              </NavLink>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Desktop navigation */}
              <nav className="hidden md:flex items-center space-x-2">
                <NavItem to="/jpg-express" icon={Image}>JPG Express</NavItem>
                <NavItem to="/rename-express" icon={Files}>Rename Express</NavItem>
                <NavItem to="/drag-express" icon={GalleryHorizontalEnd}>Drag Express</NavItem>
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

          {/* Mobile navigation */}
          <div className={`
            md:hidden transition-all duration-300 ease-in-out overflow-hidden
            ${mobileMenuOpen ? 'max-h-64' : 'max-h-0'}
          `}>
            <nav className="px-4 py-2 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <NavItem to="/jpg-express" icon={Image}>JPG Express</NavItem>
              <NavItem to="/rename-express" icon={Files}>Rename Express</NavItem>
              <NavItem to="/drag-express" icon={GalleryHorizontalEnd}>Drag Express</NavItem>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{darkMode ? 'Mode clair' : 'Mode sombre'}</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-12">
          <Routes>
            <Route path="/" element={
              <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <Zap className="w-24 h-24 text-blue-500 animate-bounce" />
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    Express Tools
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Une suite d'outils puissants et intuitifs pour gérer vos fichiers en toute simplicité, directement dans votre navigateur.
                  </p>
                </div>

                <div className="grid gap-8">
                  <FeatureCard
                    to="/jpg-express"
                    icon={Image}
                    title="JPG Express"
                    description="Un convertisseur d'images ultra-rapide qui transforme vos fichiers en JPG tout en préservant leur qualité. Simple, efficace et entièrement local."
                    features={[
                      "Conversion instantanée par glisser-déposer",
                      "Support de multiples formats (PNG, WebP, HEIC, etc.)",
                      "Traitement par lots avec barre de progression",
                      "Téléchargement groupé des images converties"
                    ]}
                  />

                  <FeatureCard
                    to="/rename-express"
                    icon={Files}
                    title="Rename Express"
                    description="Un outil de renommage en masse qui vous fait gagner du temps. Modifiez les noms de vos fichiers en quelques clics avec une prévisualisation en temps réel."
                    features={[
                      "Renommage par lot avec prévisualisation instantanée",
                      "Rechercher et remplacer dans les noms de fichiers",
                      "Filtrage intelligent et sélection multiple",
                      "Support complet des dossiers et sous-dossiers"
                    ]}
                  />

                  <FeatureCard
                    to="/drag-express"
                    icon={GalleryHorizontalEnd}
                    title="Drag Express"
                    description="Organisez et renommez vos photos par simple glisser-déposer. Une interface visuelle intuitive pour réorganiser vos images comme vous le souhaitez."
                    features={[
                      "500 emplacements numérotés pour une organisation parfaite",
                      "Glissez-déposez pour réorganiser instantanément",
                      "Prévisualisation en temps réel des modifications",
                      "Export automatique avec numérotation personnalisée"
                    ]}
                  />
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