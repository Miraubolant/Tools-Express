import React, { useState, useCallback } from 'react';
import { Tags, Upload, AlertCircle, Trash2, Plus, X } from 'lucide-react';
import { DropZone } from '../components/ui/DropZone';
import { Button } from '../components/ui/Button';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface ImageItem {
  id: string;
  file: File;
  preview: string;
  categories?: string[];
  processing?: boolean;
}

// Catégories prédéfinies
const defaultCategories: Category[] = [
  { id: '1', name: 'Mobilier', description: 'Meubles, tables, chaises, armoires...' },
  { id: '2', name: 'Art', description: 'Peintures, sculptures, gravures...' },
  { id: '3', name: 'Bijoux', description: 'Bijoux précieux, montres, accessoires...' },
  { id: '4', name: 'Livres', description: 'Livres anciens, manuscrits...' },
  { id: '5', name: 'Céramique', description: 'Porcelaine, faïence, poterie...' },
  { id: '6', name: 'Textile', description: 'Tapis, tapisseries, vêtements anciens...' },
  { id: '7', name: 'Argenterie', description: 'Objets en argent, couverts...' },
  { id: '8', name: 'Verrerie', description: 'Cristal, verre ancien...' },
];

export function CategorieExpress() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const simulateImageAnalysis = (imageItem: ImageItem) => {
    // Simuler un délai d'analyse aléatoire entre 1.5 et 3 secondes
    const analysisTime = Math.random() * 1500 + 1500;
    
    setTimeout(() => {
      setImages(prev => prev.map(img => {
        if (img.id === imageItem.id) {
          // Sélectionner aléatoirement 1 à 3 catégories
          const numCategories = Math.floor(Math.random() * 3) + 1;
          const shuffledCategories = [...categories]
            .sort(() => Math.random() - 0.5)
            .slice(0, numCategories)
            .map(cat => cat.id);

          return {
            ...img,
            processing: false,
            categories: shuffledCategories
          };
        }
        return img;
      }));
    }, analysisTime);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      processing: true
    }));

    setImages(prev => [...prev, ...newImages]);

    // Analyser chaque image
    newImages.forEach(image => {
      simulateImageAnalysis(image);
    });
  }, [categories]);

  const handleAddCategory = () => {
    if (newCategory.name.trim() && newCategory.description.trim()) {
      const newCat = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCategory.name.trim(),
        description: newCategory.description.trim()
      };
      setCategories(prev => [...prev, newCat]);
      setNewCategory({ name: '', description: '' });
      setShowAddCategory(false);
    }
  };

  const toggleCategory = (imageId: string, categoryId: string) => {
    setImages(prev => prev.map(img => {
      if (img.id === imageId) {
        const currentCategories = img.categories || [];
        const newCategories = currentCategories.includes(categoryId)
          ? currentCategories.filter(id => id !== categoryId)
          : [...currentCategories, categoryId];
        return { ...img, categories: newCategories };
      }
      return img;
    }));
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => {
      if (img.id === id) {
        URL.revokeObjectURL(img.preview);
        return false;
      }
      return true;
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Tags className="w-10 h-10 text-emerald-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Catégorie Express</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Analysez vos objets avec l'IA pour déterminer leurs catégories
        </p>
      </div>

      <div className="grid md:grid-cols-[2fr,1fr] gap-8">
        <div className="space-y-6">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <DropZone
              onDrop={onDrop}
              icon={Upload}
              message="Déposez vos photos ici pour analyse"
              activeMessage="Déposez les photos..."
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
            />
          </div>

          {images.length > 0 && (
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={image.preview}
                      alt="Object à analyser"
                      className="w-full aspect-square object-cover"
                    />
                    
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="p-4 space-y-3">
                      {image.processing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Analyse en cours...
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Catégories suggérées :
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                              <button
                                key={category.id}
                                onClick={() => toggleCategory(image.id, category.id)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                                  ${image.categories?.includes(category.id)
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                                  }`}
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Catégories disponibles
              </h2>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setShowAddCategory(true)}
              >
                Ajouter
              </Button>
            </div>

            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {showAddCategory && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Ajouter une catégorie
                  </h3>
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom de la catégorie
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ex: Mobilier"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Description de la catégorie..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setShowAddCategory(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleAddCategory}
                      disabled={!newCategory.name.trim() || !newCategory.description.trim()}
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}