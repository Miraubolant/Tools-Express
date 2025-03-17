import React from 'react';
import { Grid } from 'lucide-react';
import { GridConfig } from '../../types/tag-express';

interface GridConfigSectionProps {
  gridConfig: GridConfig;
  handleGridChange: (type: keyof GridConfig, value: string) => void;
}

export function GridConfigSection({ gridConfig, handleGridChange }: GridConfigSectionProps) {
  const configs = [
    {
      type: 'columns' as keyof GridConfig,
      label: 'Colonnes',
      min: 1,
      max: 5,
      icon: '↔️'
    },
    {
      type: 'rows' as keyof GridConfig,
      label: 'Lignes',
      min: 1,
      max: 12,
      icon: '↕️'
    },
    {
      type: 'margin' as keyof GridConfig,
      label: 'Marge',
      min: 0,
      max: 30,
      icon: '↔️',
      unit: 'mm'
    },
    {
      type: 'spacing' as keyof GridConfig,
      label: 'Espacement',
      min: 0,
      max: 10,
      icon: '↕️',
      unit: 'mm'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Grid className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Disposition de la grille
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {configs.map(config => (
          <div key={config.type} className="relative">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {config.label}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({config.min}-{config.max}{config.unit && ` ${config.unit}`})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentValue = gridConfig[config.type];
                  if (currentValue > config.min) {
                    handleGridChange(config.type, (currentValue - 1).toString());
                  }
                }}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={gridConfig[config.type] <= config.min}
              >
                -
              </button>
              <input
                type="number"
                min={config.min}
                max={config.max}
                value={gridConfig[config.type]}
                onChange={(e) => handleGridChange(config.type, e.target.value)}
                className="w-full h-8 px-2 text-center rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => {
                  const currentValue = gridConfig[config.type];
                  if (currentValue < config.max) {
                    handleGridChange(config.type, (currentValue + 1).toString());
                  }
                }}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={gridConfig[config.type] >= config.max}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          Total par page
        </span>
        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
          {gridConfig.columns * gridConfig.rows} étiquettes
        </span>
      </div>
    </div>
  );
}