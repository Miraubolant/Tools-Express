import React from 'react';
import { ImageIcon, Palette, X } from 'lucide-react';
import { Background } from '../../types/tag-express';

interface BackgroundSectionProps {
  background: Background;
  setBackground: (background: Background) => void;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeBackground: () => void;
}

export function BackgroundSection({
  background,
  setBackground,
  handleBackgroundImageUpload,
  removeBackground
}: BackgroundSectionProps) {
  const backgroundTypes = [
    {
      type: 'none',
      icon: () => <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700" />,
      label: 'Aucun'
    },
    {
      type: 'color',
      icon: () => <Palette className="w-8 h-8 text-emerald-500" />,
      label: 'Couleur'
    },
    {
      type: 'image',
      icon: () => <ImageIcon className="w-8 h-8 text-emerald-500" />,
      label: 'Image'
    }
  ];

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Fond de l'étiquette
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          optionnel
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {backgroundTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => {
              if (type === 'image') {
                document.getElementById('background-upload')?.click();
              } else {
                setBackground({ type: type as 'none' | 'color' | 'image', value: type === 'color' ? '#f3f4f6' : '' });
              }
            }}
            className={`group p-4 rounded-lg border-2 transition-all duration-200 ${
              background.type === type
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="transition-transform group-hover:scale-110">
                <Icon />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <input
        id="background-upload"
        type="file"
        accept="image/*"
        onChange={handleBackgroundImageUpload}
        className="hidden"
      />

      {background.type === 'color' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Couleur de fond
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={background.value}
              onChange={(e) => setBackground({ type: 'color', value: e.target.value })}
              className="h-11 w-11 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600 transition-all hover:scale-105"
            />
            <input
              type="text"
              value={background.value}
              onChange={(e) => setBackground({ type: 'color', value: e.target.value })}
              className="flex-1 h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all uppercase font-mono"
              placeholder="#000000"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </div>
      )}

      {background.type === 'image' && background.value && (
        <div className="relative group">
          <div className="overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-600 transition-all group-hover:border-emerald-500">
            <img
              src={background.value}
              alt="Fond personnalisé"
              className="w-full h-32 object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <button
            onClick={removeBackground}
            className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-110 shadow-lg"
            title="Supprimer le fond"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
        <p>
          Le fond sera appliqué à toutes les étiquettes. Pour une meilleure lisibilité, privilégiez des couleurs claires ou des images peu contrastées.
        </p>
      </div>
    </div>
  );
}