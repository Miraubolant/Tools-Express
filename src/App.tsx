import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { JPGExpress } from './pages/JPGExpress';
import { RenameExpress } from './pages/RenameExpress';
import { DragExpress } from './pages/DragExpress';
import { TagExpress } from './pages/TagExpress';
import { ContactForm } from './components/ui/ContactForm';
import { GalleryHorizontalEnd, Files, Image, Tags } from 'lucide-react';
import LogoCheops from './assets/logo-cheops.svg';

export function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <img src={LogoCheops} alt="Logo Cheops" className="w-24 h-24" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-[#8CD4B9] via-[#9FD066] to-[#3E9DD6] text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient-x">
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
                <a 
                  href="/drag-express"
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
                    Modifiez les numéros facilement, ajoutez des numéros bis, triez automatiquement 
                    et exportez le tout avec un nommage cohérent. Idéal pour la préparation des 
                    catalogues de vente.
                  </p>
                  <span className="text-emerald-500 group-hover:underline">Commencer le tri →</span>
                </a>

                {/* Renommage Fichiers */}
                <a 
                  href="/rename-express"
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
                    Parfait pour harmoniser les noms de fichiers selon vos conventions.
                  </p>
                  <span className="text-emerald-500 group-hover:underline">Commencer le renommage →</span>
                </a>

                {/* Conversion JPG */}
                <a 
                  href="/jpg-express"
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
                    rapidement. Optimisé pour la préparation des photos pour les catalogues et sites web.
                  </p>
                  <span className="text-emerald-500 group-hover:underline">Commencer la conversion →</span>
                </a>

                {/* Étiquettes Lots */}
                <a 
                  href="/tag-express"
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
                    automatique. Parfait pour l'identification des lots pendant les expositions.
                  </p>
                  <span className="text-emerald-500 group-hover:underline">Créer des étiquettes →</span>
                </a>
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
      </Layout>
    </Router>
  );
}
