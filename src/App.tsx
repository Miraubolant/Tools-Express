import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { JPGExpress } from './pages/JPGExpress';
import { RenameExpress } from './pages/RenameExpress';
import { DragExpress } from './pages/DragExpress';
import { TagExpress } from './pages/TagExpress';
import { GalleryHorizontalEnd, Files, Image, Tags, ArrowRight, Mail } from 'lucide-react';

export function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={
            <div className="max-w-7xl mx-auto space-y-16 px-4 sm:px-6 lg:px-8">
              {/* Hero Section */}
              <div className="relative py-16 sm:py-24 text-center">
                <div className="flex justify-center">
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-300/20 to-teal-300/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
                    <img 
                      src="https://i.imgur.com/VxI9d5K.png" 
                      alt="Logo Cheops" 
                      className="relative w-24 h-24 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div className="mt-8 space-y-6">
                  <h1 className="text-4xl sm:text-6xl font-bold text-white dark:text-white">
                    Outils Cheops
                  </h1>
                  <div className="max-w-3xl mx-auto space-y-6">
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      Suite d'outils professionnels pour le tri, le renommage et la conversion de vos fichiers.
                      Optimisé pour les commissaires-priseurs, photographes et catalogueurs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tools Grid */}
              <div className="grid gap-8 md:grid-cols-2">
                {[
                  {
                    href: "/tag-express",
                    icon: Tags,
                    title: "Étiquettes Lots",
                    description: "Générez des étiquettes professionnelles pour vos lots. Personnalisez avec votre logo, ajoutez des informations de vente et créez des PDF prêts à imprimer avec numérotation automatique.",
                    features: ["Logo personnalisé", "Numérotation automatique", "Export PDF", "Format optimisé"]
                  },
                  {
                    href: "/rename-express",
                    icon: Files,
                    title: "Renommage Fichiers",
                    description: "Renommez des centaines de fichiers en quelques clics. Remplacez des textes spécifiques, ajoutez des préfixes ou suffixes, et prévisualisez les changements avant de les appliquer.",
                    features: ["Renommage en masse", "Prévisualisation", "Recherche et remplacement", "Export en ZIP"]
                  },
                  {
                    href: "/jpg-express",
                    icon: Image,
                    title: "Conversion JPG",
                    description: "Convertissez instantanément vos images en JPG. Compatible avec de nombreux formats (PNG, WEBP, HEIC, etc.), préserve la qualité originale et traite les lots d'images rapidement.",
                    features: ["Conversion rapide", "Préservation de la qualité", "Support multi-formats", "Traitement par lots"]
                  },
                  {
                    href: "/drag-express",
                    icon: GalleryHorizontalEnd,
                    title: "Tri Visuel",
                    description: "Interface intuitive pour organiser et numéroter vos photos par glisser-déposer. Modifiez les numéros facilement, ajoutez des numéros bis, triez automatiquement et exportez le tout avec un nommage cohérent.",
                    features: ["Glisser-déposer", "Numérotation automatique", "Support des numéros bis", "Export personnalisé"]
                  }
                ].map((tool) => (
                  <a
                    key={tool.title}
                    href={tool.href}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/10 rounded-xl">
                        <tool.icon className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.title}</h2>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                      {tool.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {tool.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight className="w-6 h-6 text-emerald-500" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Contact Section */}
              <div className="text-center pb-8">
                <a 
                  href="mailto:contact@3pi.fr"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all duration-300 group"
                >
                  <Mail className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                  <span className="font-medium">Nous contacter</span>
                </a>
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