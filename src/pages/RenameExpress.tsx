import React, { useState, useCallback, useEffect } from 'react';
import { Files, Search, Download, ArrowUpDown, Wand2, FileText, FileEdit, FileType, Scale, Calendar, Check, ArrowUp, FolderUp, Trash2, X, AlertTriangle, AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { DropZone } from '../components/ui/DropZone';
import { Button } from '../components/ui/Button';
import JSZip from 'jszip';

interface FileItem {
  id: string;
  originalName: string;
  newName: string;
  type: string;
  size: number;
  modifiedDate: Date;
  file: File;
  specialCharacters?: string[];
}

export function RenameExpress() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [withText, setWithText] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const detectSpecialCharacters = (fileName: string): string[] => {
    const validChars = /[^0-9\-_]/g;
    const matches = fileName.match(validChars);
    return matches ? Array.from(new Set(matches)) : [];
  };

  const validateFileName = (fileName: string): boolean => {
    const validChars = /^[0-9\-_]+$/;
    const nameWithoutExt = fileName.split('.')[0];
    if (!validChars.test(nameWithoutExt)) return false;

    const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
    if (reservedNames.test(nameWithoutExt)) return false;

    if (fileName.trim() !== fileName) return false;

    if (fileName.endsWith('.')) return false;

    return true;
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const clearAll = () => {
    setFiles([]);
    setSelectedFiles(new Set());
    setSearchQuery('');
    setReplaceText('');
    setWithText('');
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      const specialChars = detectSpecialCharacters(file.name.split('.')[0]);
      return {
        id: Math.random().toString(36).substr(2, 9),
        originalName: file.name,
        newName: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        modifiedDate: new Date(file.lastModified),
        file: file,
        specialCharacters: specialChars
      };
    });
    setFiles(prev => [...prev, ...newFiles]);
    setSelectedFiles(new Set([...selectedFiles, ...newFiles.map(f => f.id)]));

    if (newFiles.some(file => file.specialCharacters && file.specialCharacters.length > 0)) {
      setShowWarning(true);
    }
  }, [selectedFiles]);

  const toggleFileSelection = (id: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedFiles(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
    }
  };

  const handleReplace = () => {
    if (!replaceText) return;
    
    setFiles(files.map(file => {
      if (!selectedFiles.has(file.id)) return file;
      if (searchQuery && !file.originalName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return file;
      }

      const escapedReplaceText = replaceText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const newName = file.newName.replace(new RegExp(escapedReplaceText, 'g'), withText);
      
      const nameWithoutExt = newName.split('.')[0];
      const specialChars = detectSpecialCharacters(nameWithoutExt);
      
      return {
        ...file,
        newName,
        specialCharacters: specialChars
      };
    }));
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    
    const hasInvalidNames = files.some(file => 
      selectedFiles.has(file.id) && 
      !validateFileName(file.newName.split('.')[0])
    );

    if (hasInvalidNames) {
      if (!confirm('Certains fichiers contiennent des caractères non autorisés (seuls les chiffres, tiret et underscore sont permis). Voulez-vous continuer ?')) {
        return;
      }
    }
    
    setIsDownloading(true);
    document.body.style.cursor = 'wait';
    
    try {
      const zip = new JSZip();
      const filesToDownload = files.filter(file => 
        selectedFiles.has(file.id) && 
        (!searchQuery || file.originalName.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      for (const fileItem of filesToDownload) {
        zip.file(fileItem.newName, fileItem.file, { 
          compression: "STORE",
          streamFiles: true
        });
      }

      const blob = await zip.generateAsync({ 
        type: 'blob',
        compression: "DEFLATE",
        compressionOptions: { level: 3 },
        streamFiles: true
      }, (metadata) => {
        console.log(`Progression: ${metadata.percent.toFixed(0)}%`);
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fichiers_renommes.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de la création du ZIP:', error);
    } finally {
      setIsDownloading(false);
      document.body.style.cursor = 'default';
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Files className="w-10 h-10 text-emerald-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Rename Express</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Renommez facilement vos fichiers en masse avec des outils puissants et intuitifs
        </p>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="relative">
          <DropZone
            onDrop={onDrop}
            icon={FolderUp}
            message="Déposez vos fichiers ou dossiers ici"
            activeMessage="Déposez ici..."
          />
          
          <div className="absolute top-4 right-4">
            <div className="relative group">
              <button
                onClick={() => setShowWarning(!showWarning)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Règles de nommage"
              >
                <Info className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              {showWarning && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <h3 className="font-medium">Règles de nommage des fichiers</h3>
                      </div>
                      <button
                        onClick={() => setShowWarning(false)}
                        className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>Caractères autorisés uniquement :</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Chiffres (0-9)</li>
                        <li>Tiret (-)</li>
                        <li>Underscore (_)</li>
                      </ul>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                        Les fichiers non conformes seront signalés par une icône ⚠️
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {showWarning && (
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setShowWarning(false)}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Filtrer les fichiers par nom original..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
            <Button
              variant="secondary"
              icon={Trash2}
              onClick={clearAll}
              disabled={files.length === 0}
              className="h-11"
            >
              Tout effacer
            </Button>
            <Button
              variant="primary"
              icon={Download}
              onClick={handleDownload}
              disabled={selectedFiles.size === 0 || isDownloading}
              className={`h-11 ${isDownloading ? 'cursor-wait' : ''}`}
            >
              {isDownloading ? 'Création du ZIP...' : 'Télécharger les fichiers modifiés'}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 grid grid-cols-[1fr,1fr,auto] gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Caractères à remplacer..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="w-full h-11 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
                {replaceText && (
                  <button
                    onClick={() => setReplaceText('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Remplacer par..."
                  value={withText}
                  onChange={(e) => setWithText(e.target.value)}
                  className="w-full h-11 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
                {withText && (
                  <button
                    onClick={() => setWithText('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
              <Button
                variant="primary"
                icon={Wand2}
                onClick={handleReplace}
                disabled={!replaceText || selectedFiles.size === 0}
                className="h-11 whitespace-nowrap"
              >
                Remplacer
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100/80 dark:bg-gray-700/80 sticky top-0">
              <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                <th className="p-4 first:rounded-tl-lg">
                  <div className="relative inline-flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0}
                      onChange={toggleSelectAll}
                      disabled={files.length === 0}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all checked:bg-emerald-500 checked:border-0 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50"
                    />
                    <Check className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Nom actuel</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Nouveau nom</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <FileType className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Format</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Taille</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left last:rounded-tr-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Date de modification</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <tr 
                    key={file.id} 
                    className={`group hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                      file.originalName !== file.newName 
                        ? 'bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20' 
                        : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="relative inline-flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all checked:bg-emerald-500 checked:border-0 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50"
                        />
                        <Check className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{file.originalName}</td>
                    <td className="px-4 py-3 text-sm relative">
                      <div className={`flex items-center gap-2 ${
                        file.originalName !== file.newName 
                          ? 'text-green-600 dark:text-green-400 font-medium' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        <span>{file.newName}</span>
                        {file.specialCharacters && file.specialCharacters.length > 0 && (
                          <div className="group/tooltip relative">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-amber-50 dark:bg-amber-900/90 text-amber-700 dark:text-amber-200 text-xs rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Caractères non autorisés détectés: {file.specialCharacters.join(' ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{file.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {file.modifiedDate.toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Files className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-600" />
                      <p className="text-lg font-medium mb-1">Aucun fichier</p>
                      <p className="text-sm">
                        Déposez des fichiers ci-dessus pour commencer le renommage
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}