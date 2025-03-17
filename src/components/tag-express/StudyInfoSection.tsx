import React from 'react';
import { FileText, Hash, CalendarDays } from 'lucide-react';
import { StudyInfo, LotRange, GridConfig } from '../../types/tag-express';

interface StudyInfoSectionProps {
  studyInfo: StudyInfo;
  setStudyInfo: (info: StudyInfo) => void;
  lotRange: LotRange;
  handleRangeChange: (type: 'start' | 'end', value: string) => void;
  gridConfig: GridConfig;
}

export function StudyInfoSection({
  studyInfo,
  setStudyInfo,
  lotRange,
  handleRangeChange,
  gridConfig
}: StudyInfoSectionProps) {
  const fields = [
    {
      id: 'name',
      label: "Nom de l'étude",
      placeholder: 'Ex: Étude de Maître Dupont',
      icon: FileText,
      value: studyInfo.name
    },
    {
      id: 'orderNumber',
      label: 'Référence Interne',
      placeholder: 'Ex: 2024-001',
      icon: Hash,
      value: studyInfo.orderNumber
    },
    {
      id: 'saleName',
      label: 'Nom de la vente',
      placeholder: 'Ex: Succession Durand',
      icon: CalendarDays,
      value: studyInfo.saleName
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Informations de l'étude
      </h3>
      
      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.id} className="group relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <field.icon className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="text"
              value={field.value}
              onChange={(e) => setStudyInfo({ ...studyInfo, [field.id]: e.target.value })}
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder={field.placeholder}
            />
            <label className="absolute -top-2 left-2 -mt-px px-2 bg-white dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
              {field.label}
            </label>
          </div>
        ))}

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Plage de numéros
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {gridConfig.columns * gridConfig.rows} étiquettes/page
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="number"
                min="1"
                value={lotRange.start}
                onChange={(e) => handleRangeChange('start', e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <label className="absolute -top-2 left-2 -mt-px px-2 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
                Premier lot
              </label>
            </div>
            
            <div className="flex items-center justify-center w-8">
              <div className="w-full h-px bg-gray-300 dark:bg-gray-600" />
            </div>
            
            <div className="relative flex-1">
              <input
                type="number"
                min={lotRange.start}
                value={lotRange.end}
                onChange={(e) => handleRangeChange('end', e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <label className="absolute -top-2 left-2 -mt-px px-2 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
                Dernier lot
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}