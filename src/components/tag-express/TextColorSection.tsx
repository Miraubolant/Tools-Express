import React from 'react';
import { Type } from 'lucide-react';
import { TextColors } from '../../types/tag-express';

interface TextColorSectionProps {
  textColors: TextColors;
  handleTextColorChange: (type: keyof TextColors, value: string) => void;
}

const colorFields = [
  {
    key: 'title' as keyof TextColors,
    label: 'Titre',
    preview: 'Étude de Maître Dupont'
  },
  {
    key: 'subtitle' as keyof TextColors,
    label: 'Sous-titres',
    preview: 'Réf: 2024-001'
  },
  {
    key: 'number' as keyof TextColors,
    label: 'Numéro',
    preview: 'N°42'
  }
];

const predefinedColors = [
  { value: '#000000' },
  { value: '#4A5568' },
  { value: '#718096' },
  { value: '#2B6CB0' },
  { value: '#2F855A' },
  { value: '#C53030' }
];

export function TextColorSection({ textColors, handleTextColorChange }: TextColorSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Type className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Couleurs du texte
        </h3>
      </div>

      <div className="grid gap-3">
        {colorFields.map(field => (
          <div key={field.key} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </span>
              <span 
                className="text-sm"
                style={{ color: textColors[field.key] }}
              >
                {field.preview}
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="color"
                  value={textColors[field.key]}
                  onChange={(e) => handleTextColorChange(field.key, e.target.value)}
                  className="w-full h-8 rounded cursor-pointer border border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="flex gap-1">
                {predefinedColors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => handleTextColorChange(field.key, color.value)}
                    className={`w-8 h-8 rounded transition-all hover:scale-110 ${
                      textColors[field.key] === color.value
                        ? 'ring-2 ring-emerald-500 ring-offset-2'
                        : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600'
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}