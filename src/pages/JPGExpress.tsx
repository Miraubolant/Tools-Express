import React, { useState, useCallback, useEffect } from 'react';
import { Image, Download, Upload, Trash2 } from 'lucide-react';
import { DropZone } from '../components/ui/DropZone';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { convertToJPG, createDownloadZip } from '../utils/imageConverter';

interface FileItem {
  id: string;
  file: File;
  preview?: string;
  converted?: boolean;
  convertedBlob?: Blob;
}

export function JPGExpress() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [conversionTime, setConversionTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 50;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (converting && startTime) {
      interval = setInterval(() => {
        setConversionTime((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [converting, startTime]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      converted: false
    }));
    setFiles(prev => [...prev, ...newFiles]);
    startConversion(newFiles);
  }, []);

  const startConversion = async (newFiles: FileItem[]) => {
    setConverting(true);
    setProgress(0);
    setCurrentFileIndex(0);
    setConversionComplete(false);
    setStartTime(Date.now());
    setConversionTime(0);

    const totalFiles = newFiles.length;
    const updatedFiles = [...files, ...newFiles];
    
    for (let i = 0; i < newFiles.length; i++) {
      setCurrentFileIndex(files.length + i);
      try {
        const convertedBlob = await convertToJPG(newFiles[i].file);
        newFiles[i].convertedBlob = convertedBlob;
        newFiles[i].converted = true;
        setProgress(((i + 1) / totalFiles) * 100);
      } catch (error) {
        console.error(`Failed to convert ${newFiles[i].file.name}:`, error);
      }
    }

    setFiles(updatedFiles.map(f => ({ ...f, converted: true })));
    setConverting(false);
    setConversionComplete(true);
  };

  const handleDownloadSingle = async (file: FileItem) => {
    try {
      const blob = file.convertedBlob || await convertToJPG(file.file);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = file.file.name.toLowerCase().endsWith('.jpg') 
        ? file.file.name 
        : `${file.file.name.split('.')[0]}.jpg`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleDownloadAll = async () => {
    try {
      const blob = await createDownloadZip(files);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "images_converties.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create zip:', error);
    }
  };

  const clearAll = () => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setConverting(false);
    setConversionComplete(false);
    setProgress(0);
    setCurrentFileIndex(0);
    setStartTime(null);
    setConversionTime(0);
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)} secondes`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const estimateRemainingTime = (): string => {
    if (!converting || progress === 0) return '...';
    const elapsed = conversionTime;
    const totalEstimated = (elapsed * 100) / progress;
    const remaining = totalEstimated - elapsed;
    return formatTime(remaining);
  };

  const acceptedFormats = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.tiff', '.heic']
  };

  const startIndex = (currentPage - 1) * filesPerPage;
  const endIndex = startIndex + filesPerPage;
  const displayedFiles = files.slice(startIndex, endIndex);
  const totalPages = Math.ceil(files.length / filesPerPage);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Image className="w-10 h-10 text-blue-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">JPG Express</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Convertissez rapidement vos images en JPG
        </p>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
        <DropZone
          onDrop={onDrop}
          icon={Upload}
          accept={acceptedFormats}
          message="Déposez vos images ici pour les convertir en JPG"
          activeMessage="Déposez ici..."
        />
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Formats acceptés : PNG, JPEG, GIF, BMP, WebP, TIFF, HEIC
        </div>
      </div>

      {(files.length > 0 || converting || conversionComplete) && (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Images ({currentFileIndex + 1}/{files.length})
            </h3>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                icon={Trash2}
                onClick={clearAll}
                disabled={converting}
              >
                Tout effacer
              </Button>
              <Button
                variant="primary"
                icon={Download}
                onClick={handleDownloadAll}
                disabled={converting || files.length === 0}
              >
                Télécharger en ZIP
              </Button>
            </div>
          </div>

          {(converting || conversionComplete) && (
            <div className="space-y-4">
              <ProgressBar progress={progress} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="text-gray-500 dark:text-gray-400 mb-1">Progression</div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {Math.round(progress)}% • {currentFileIndex + 1}/{files.length}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="text-gray-500 dark:text-gray-400 mb-1">Temps écoulé</div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {formatTime(conversionTime)}
                  </div>
                </div>
                {converting && (
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-gray-500 dark:text-gray-400 mb-1">Temps restant estimé</div>
                    <div className="text-gray-900 dark:text-white font-medium">
                      {estimateRemainingTime()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedFiles.map((file) => (
              <div
                key={file.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group"
              >
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDownloadSingle(file)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Download className="w-6 h-6 text-white" />
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <span className="flex items-center px-4 text-gray-600 dark:text-gray-300">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}