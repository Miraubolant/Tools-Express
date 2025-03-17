import React, { useState } from 'react';
import { Eye, ZoomIn, ZoomOut, Ruler, Grid } from 'lucide-react';
import { StudyInfo, LotRange, Background, GridConfig, TextColors } from '../../types/tag-express';

interface PreviewSectionProps {
  studyInfo: StudyInfo;
  lotRange: LotRange;
  background: Background;
  gridConfig: GridConfig;
  textColors: TextColors;
}

export function PreviewSection({
  studyInfo,
  lotRange,
  background,
  gridConfig,
  textColors
}: PreviewSectionProps) {
  const [showZoom, setShowZoom] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg space-y-6 sticky top-24">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Aperçu en temps réel
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${
              showGrid 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
            title="Afficher/masquer la grille"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowZoom(!showZoom)}
            className={`p-2 rounded-lg transition-colors ${
              showZoom 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
            title="Zoom sur l'étiquette"
          >
            {showZoom ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-8">
        {/* Aperçu d'une étiquette */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Étiquette individuelle
            </h4>
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                90×48mm
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <div 
              className={`rounded-lg shadow-lg p-4 flex flex-col items-center justify-center transition-all hover:shadow-xl ${
                showZoom ? 'w-[420px] h-[222px]' : 'w-[280px] h-[148px]'
              }`}
              style={{
                backgroundColor: background.type === 'color' ? background.value : 'white',
                backgroundImage: background.type === 'image' ? `url(${background.value})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {studyInfo.logo && (
                <div className={`${showZoom ? 'h-12' : 'h-8'} mb-2`}>
                  <img
                    src={studyInfo.logo}
                    alt="Logo"
                    className="h-full object-contain"
                  />
                </div>
              )}
              <div className="text-center space-y-1">
                {studyInfo.name && (
                  <p 
                    className={`font-bold line-clamp-1 ${showZoom ? 'text-base' : 'text-sm'}`}
                    style={{ color: textColors.title }}
                  >
                    {studyInfo.name}
                  </p>
                )}
                {studyInfo.orderNumber && (
                  <p 
                    className={showZoom ? 'text-sm' : 'text-xs'}
                    style={{ color: textColors.subtitle }}
                  >
                    Réf: {studyInfo.orderNumber}
                  </p>
                )}
                {studyInfo.saleName && (
                  <p 
                    className={`line-clamp-1 ${showZoom ? 'text-sm' : 'text-xs'}`}
                    style={{ color: textColors.subtitle }}
                  >
                    {studyInfo.saleName}
                  </p>
                )}
                <p 
                  className={`font-bold ${showZoom ? 'text-base' : 'text-sm'}`}
                  style={{ color: textColors.number }}
                >
                  N°{lotRange.start}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Aperçu de la page */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Disposition sur la page
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {gridConfig.columns}×{gridConfig.rows}
              </span>
              <span className="text-xs text-emerald-500 font-medium">
                {gridConfig.columns * gridConfig.rows} étiquettes
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              {/* Page A4 */}
              <div className="w-[210px] h-[297px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                {showGrid && (
                  <div 
                    className="absolute inset-0 border-2 border-dashed border-emerald-500/30 pointer-events-none transition-all"
                    style={{ margin: `${gridConfig.margin}px` }}
                  />
                )}
                
                {/* Grille d'étiquettes */}
                <div 
                  className="grid absolute transition-all"
                  style={{
                    gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
                    gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
                    gap: `${gridConfig.spacing}px`,
                    top: `${gridConfig.margin}px`,
                    left: `${gridConfig.margin}px`,
                    right: `${gridConfig.margin}px`,
                    bottom: `${gridConfig.margin}px`
                  }}
                >
                  {Array.from({ length: gridConfig.columns * gridConfig.rows }).map((_, index) => (
                    <div
                      key={index}
                      className={`border rounded transition-all ${
                        showGrid 
                          ? 'border-gray-200 dark:border-gray-600 hover:border-emerald-500' 
                          : 'border-transparent'
                      }`}
                      style={{
                        backgroundColor: background.type === 'color' ? background.value : 'white',
                        backgroundImage: background.type === 'image' ? `url(${background.value})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {index < 3 && (
                        <div className="w-full h-full flex items-center justify-center text-[8px] font-medium" style={{ color: textColors.number }}>
                          N°{lotRange.start + index}
                        </div>
                      )}
                      {index === 3 && (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">
                          ...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
                297mm
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
                210mm
              </div>
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400 transform -rotate-90">
                Marge: {gridConfig.margin}mm
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}