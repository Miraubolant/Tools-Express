import React from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { StudyInfo } from '../../types/tag-express';

interface LogoSectionProps {
  studyInfo: StudyInfo;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeLogo: () => void;
}

export function LogoSection({ studyInfo, handleLogoUpload, removeLogo }: LogoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Logo de l'étude
        </h3>
      </div>
      
      <div className="flex flex-col items-center">
        {studyInfo.logo ? (
          <div className="relative group">
            <div className="w-48 h-24 bg-white dark:bg-gray-900 rounded-lg shadow-sm p-3 transition-transform group-hover:scale-[1.02]">
              <img
                src={studyInfo.logo}
                alt="Logo de l'étude"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              onClick={removeLogo}
              className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-lg"
              title="Supprimer le logo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="group cursor-pointer">
            <div className="w-48 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-all duration-200 group-hover:border-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20">
              <Upload className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mb-2 transition-transform group-hover:scale-110" />
              <span className="text-sm text-emerald-500 dark:text-emerald-400 font-medium">
                Ajouter un logo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </label>
        )}
      </div>
    </div>
  );
}