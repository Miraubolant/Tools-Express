import React, { useState } from 'react';
import { 
  Hash, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Download, 
  HelpCircle, 
  Info, 
  Loader2,
  MousePointerClick,
  Copy,
  Move,
  FolderUp,
  FileEdit,
  SortAsc,
  SortDesc,
  FileType,
  Keyboard
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ActionPanelProps {
  prefix: string;
  onPrefixChange: (value: string) => void;
  filledSlotsCount: number;
  totalSlots: number;
  onRenumberByNumber: () => void;
  onSortAscending: () => void;
  onSortDescending: () => void;
  onClearAll: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export function ActionPanel({
  prefix,
  onPrefixChange,
  filledSlotsCount,
  totalSlots,
  onRenumberByNumber,
  onSortAscending,
  onSortDescending,
  onClearAll,
  onDownload,
  isDownloading
}: ActionPanelProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isRenumbering, setIsRenumbering] = useState(false);

  const handleDoubleRenumber = async () => {
    if (isRenumbering) return;
    
    setIsRenumbering(true);
    
    // Première renumérotation
    onRenumberByNumber();
    
    // Attendre 2 secondes
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Deuxième renumérotation
    onRenumberByNumber();
    
    // Réinitialiser l'état après un court délai
    setTimeout(() => {
      setIsRenumbering(false);
    }, 500);
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Section de tri */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-2">
          <div className="relative group">
            <Button
              variant="secondary"
              icon={isRenumbering ? Loader2 : Hash}
              onClick={handleDoubleRenumber}
              disabled={filledSlotsCount === 0 || isRenumbering}
              className={`h-10 text-sm ${isRenumbering ? 'animate-pulse' : ''}`}
            >
              {isRenumbering ? 'Renumérotation...' : 'Renuméroter'}
            </Button>
            <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              Réorganise les numéros de manière séquentielle en fonction des numéros affichés
            </div>
          </div>
          <div className="flex gap-1">
            <div className="relative group">
              <Button
                variant="secondary"
                icon={ArrowUp}
                onClick={onSortAscending}
                disabled={filledSlotsCount === 0}
                className="h-10 text-sm px-3"
                title="Tri croissant"
              />
              <div className="absolute left-0 top-full mt-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                Trier les photos par ordre croissant
              </div>
            </div>
            <div className="relative group">
              <Button
                variant="secondary"
                icon={ArrowDown}
                onClick={onSortDescending}
                disabled={filledSlotsCount === 0}
                className="h-10 text-sm px-3"
                title="Tri décroissant"
              />
              <div className="absolute left-0 top-full mt-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                Trier les photos par ordre décroissant
              </div>
            </div>
          </div>
        </div>

        {/* Section du préfixe */}
        <div className="flex items-center justify-center">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={prefix}
              onChange={(e) => onPrefixChange(e.target.value)}
              placeholder="Préfixe pour les fichiers..."
              className="w-full h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500 text-sm"
            />
            <div className="absolute -top-2 -right-2">
              <div className="px-2 py-1 bg-emerald-500 text-white text-xs rounded-full shadow-lg">
                {filledSlotsCount}/{totalSlots}
              </div>
            </div>
          </div>
        </div>

        {/* Section des actions */}
        <div className="flex flex-wrap justify-center lg:justify-end gap-2">
          <Button
            variant="secondary"
            icon={Trash2}
            onClick={onClearAll}
            disabled={filledSlotsCount === 0}
            className="h-10 text-sm"
          >
            Effacer
          </Button>
          <Button
            variant="primary"
            icon={Download}
            onClick={onDownload}
            disabled={filledSlotsCount === 0 || isDownloading}
            className={`h-10 text-sm ${isDownloading ? 'cursor-wait' : ''}`}
          >
            {isDownloading ? 'ZIP...' : 'Télécharger'}
          </Button>
          <Button
            variant="secondary"
            icon={HelpCircle}
            onClick={() => setShowTutorial(!showTutorial)}
            className="h-10 text-sm px-3"
            title="Aide"
          />
        </div>
      </div>

      {/* Tutoriel détaillé */}
      {showTutorial && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 text-sm space-y-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-6 text-emerald-600 dark:text-emerald-400">
                <h3 className="font-medium text-lg text-emerald-700 dark:text-emerald-300">
                  Guide complet de Tri Express
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Import et Organisation */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                      <FolderUp className="w-4 h-4" />
                      Import et Organisation
                    </h4>
                    <ul className="space-y-2 list-disc list-inside ml-1">
                      <li>Glissez-déposez un dossier complet d'images</li>
                      <li>Importez des images individuellement dans chaque emplacement</li>
                      <li>Réorganisez par glisser-déposer entre les emplacements</li>
                    </ul>
                  </div>

                  {/* Numérotation */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Numérotation Intelligente
                    </h4>
                    <ul className="space-y-2 list-disc list-inside ml-1">
                      <li>Double-cliquez sur un numéro pour le modifier</li>
                      <li>Format : "numéro_bis" (ex: 12_3)</li>
                      <li>Renumérotation automatique séquentielle</li>
                      <li>Conservation des numéros bis lors du tri</li>
                    </ul>
                  </div>

                  {/* Manipulation */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                      <Move className="w-4 h-4" />
                      Manipulation
                    </h4>
                    <ul className="space-y-2 list-disc list-inside ml-1">
                      <li className="flex items-start gap-2">
                        <MousePointerClick className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Double-clic sur le numéro pour édition</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Copy className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Bouton copie pour les numéros bis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Move className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Glisser-déposer pour réorganiser</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tri et Export */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                      <SortAsc className="w-4 h-4" />
                      Tri et Export
                    </h4>
                    <ul className="space-y-2 list-disc list-inside ml-1">
                      <li className="flex items-start gap-2">
                        <SortAsc className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Tri croissant automatique</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <SortDesc className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Tri décroissant automatique</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileType className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Préfixe personnalisable pour l'export</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Download className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Export en ZIP avec numérotation</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Raccourcis clavier */}
                <div className="pt-4 border-t border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2 mb-3">
                    <Keyboard className="w-4 h-4" />
                    Raccourcis Clavier
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-xs">
                        Double-clic
                      </kbd>
                      <span className="ml-2">Éditer un numéro</span>
                    </div>
                    <div>
                      <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-xs">
                        Entrée
                      </kbd>
                      <span className="ml-2">Valider l'édition</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}