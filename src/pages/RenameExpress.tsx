import React, { useState, useCallback, useEffect } from 'react';
import { Files, Search, Download, ArrowUpDown, Wand2, FileText, FileEdit, FileType, Scale, Calendar, Check, ArrowUp, FolderUp, Trash2 } from 'lucide-react';
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
}

export function RenameExpress() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [withText, setWithText] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      originalName: file.name,
      newName: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      modifiedDate: new Date(file.lastModified),
      file: file
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setSelectedFiles(new Set([...selectedFiles, ...newFiles.map(f => f.id)]));
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

      // Échapper les caractères spéciaux pour qu'ils soient traités littéralement
      const escapedReplaceText = replaceText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      return {
        ...file,
        newName: file.newName.replace(new RegExp(escapedReplaceText, 'g'), withText)
      };
    }));
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    document.body.style.cursor = 'wait';
    
    try {
      const zip = new JSZip();
      const filesToDownload = files.filter(file => 
        selectedFiles.has(file.id) && 
        (!searchQuery || file.originalName.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // Ajouter les fichiers au ZIP avec une taille de chunk optimisée
      const chunkSize = 1024 * 1024; // 1MB chunks
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
        // La progression est disponible ici si nécessaire
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
        <DropZone
          onDrop={onDrop}
          icon={FolderUp}
          message="Déposez vos fichiers ou dossiers ici"
          activeMessage="Déposez ici..."
        />
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Filtre et actions */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Filtrer les fichiers par nom original..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
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

          {/* Outils de renommage */}
          <div className="flex items-center gap-4">
            <div className="flex-1 grid grid-cols-[1fr,1fr,auto] gap-4">
              <input
                type="text"
                placeholder="Caractères à remplacer..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="w-full h-11 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Remplacer par..."
                value={withText}
                onChange={(e) => setWithText(e.target.value)}
                className="w-full h-11 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
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
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
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
                    <td className={`px-4 py-3 text-sm ${
                      file.originalName !== file.newName 
                        ? 'text-green-600 dark:text-green-400 font-medium' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>{file.newName}</td>
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