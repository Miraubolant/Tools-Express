import React, { useState, useCallback, useEffect } from 'react';
import { GalleryHorizontalEnd, Download, Trash2, FolderUp, ChevronLeft, ChevronRight, ArrowUp, Edit2, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DropZone } from '../components/ui/DropZone';
import JSZip from 'jszip';

interface ImageSlot {
  id: string;
  file: File | null;
  preview: string | null;
  position: number;
  customPosition?: number;
}

const TOTAL_SLOTS = 500;
const SLOTS_PER_PAGE = 100;

export function DragExpress() {
  const [slots, setSlots] = useState<ImageSlot[]>(() => 
    Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
      id: `slot-${i + 1}`,
      file: null,
      preview: null,
      position: i + 1
    }))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedSlot, setDraggedSlot] = useState<ImageSlot | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProcessingFolder, setIsProcessingFolder] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [prefix, setPrefix] = useState('');

  const filledSlotsCount = slots.filter(slot => slot.file !== null).length;
  const emptySlotCount = TOTAL_SLOTS - filledSlotsCount;

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

  const handlePositionEdit = (slot: ImageSlot, newPosition: string) => {
    const numPosition = parseInt(newPosition, 10);
    if (!isNaN(numPosition) && numPosition > 0 && numPosition <= TOTAL_SLOTS) {
      setSlots(prev => prev.map(s => 
        s.id === slot.id ? { ...s, customPosition: numPosition } : s
      ));
    }
  };

  const handlePositionEditComplete = () => {
    setEditingPosition(null);
  };

  const handleFolderDrop = useCallback(async (acceptedFiles: File[]) => {
    if (isProcessingFolder) return;
    setIsProcessingFolder(true);

    try {
      const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
      const availableSlots = slots.filter(slot => !slot.file);

      if (availableSlots.length === 0) {
        alert('Aucun emplacement disponible');
        return;
      }

      const newSlots = [...slots];
      for (let i = 0; i < Math.min(imageFiles.length, availableSlots.length); i++) {
        const slot = availableSlots[i];
        const file = imageFiles[i];
        const preview = URL.createObjectURL(file);

        const slotIndex = newSlots.findIndex(s => s.id === slot.id);
        if (slotIndex !== -1) {
          newSlots[slotIndex] = {
            ...newSlots[slotIndex],
            file,
            preview
          };
        }
      }

      setSlots(newSlots);
    } catch (error) {
      console.error('Erreur lors du traitement du dossier:', error);
    } finally {
      setIsProcessingFolder(false);
    }
  }, [isProcessingFolder, slots]);

  const handleDragStart = (e: React.DragEvent, slot: ImageSlot) => {
    if (!slot.file) return;
    setDraggedSlot(slot);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', slot.id);
  };

  const handleDragEnd = () => {
    setDraggedSlot(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSlot: ImageSlot) => {
    e.preventDefault();
    if (!draggedSlot) return;

    const newSlots = [...slots];
    const sourceIndex = newSlots.findIndex(s => s.id === draggedSlot.id);
    const targetIndex = newSlots.findIndex(s => s.id === targetSlot.id);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      // Échanger uniquement les fichiers et aperçus, pas les positions
      const tempFile = newSlots[targetIndex].file;
      const tempPreview = newSlots[targetIndex].preview;

      newSlots[targetIndex] = {
        ...newSlots[targetIndex],
        file: newSlots[sourceIndex].file,
        preview: newSlots[sourceIndex].preview
      };

      newSlots[sourceIndex] = {
        ...newSlots[sourceIndex],
        file: tempFile,
        preview: tempPreview
      };

      setSlots(newSlots);
    }

    setDraggedSlot(null);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, slot: ImageSlot) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newSlots = [...slots];
    const slotIndex = newSlots.findIndex(s => s.id === slot.id);
    
    if (slotIndex !== -1) {
      const preview = URL.createObjectURL(file);
      newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        file,
        preview
      };
      setSlots(newSlots);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    document.body.style.cursor = 'wait';

    try {
      const zip = new JSZip();
      const filledSlots = slots.filter(slot => slot.file);

      for (const slot of filledSlots) {
        if (slot.file) {
          const extension = slot.file.name.split('.').pop() || 'jpg';
          const position = slot.customPosition || slot.position;
          const fileName = prefix 
            ? `${prefix}_${position}.${extension}`
            : `${position}.${extension}`;
          zip.file(fileName, slot.file);
        }
      }

      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 3 }
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'photos_organisees.zip';
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

  const clearAll = () => {
    slots.forEach(slot => {
      if (slot.preview) {
        URL.revokeObjectURL(slot.preview);
      }
    });

    setSlots(slots.map(slot => ({
      ...slot,
      file: null,
      preview: null,
      customPosition: undefined
    })));
    setPrefix('');
  };

  const startIndex = (currentPage - 1) * SLOTS_PER_PAGE;
  const endIndex = startIndex + SLOTS_PER_PAGE;
  const currentSlots = slots.slice(startIndex, endIndex);
  const totalPages = Math.ceil(TOTAL_SLOTS / SLOTS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <GalleryHorizontalEnd className="w-10 h-10 text-blue-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Drag Express</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Réorganisez vos photos par glisser-déposer
        </p>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <DropZone
          onDrop={handleFolderDrop}
          icon={FolderUp}
          message={`Déposez un dossier d'images ici (${emptySlotCount} emplacements disponibles)`}
          activeMessage="Déposez le dossier ici..."
          className={isProcessingFolder ? 'pointer-events-none opacity-50' : ''}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Préfixe pour les noms de fichiers..."
              className="w-full sm:w-80 h-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {prefix && (
              <button
                onClick={() => setPrefix('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {filledSlotsCount} photo{filledSlotsCount > 1 ? 's' : ''} sur {TOTAL_SLOTS}
          </div>
          <Button
            variant="secondary"
            icon={Trash2}
            onClick={clearAll}
            disabled={filledSlotsCount === 0}
          >
            Tout effacer
          </Button>
          <Button
            variant="primary"
            icon={Download}
            onClick={handleDownload}
            disabled={filledSlotsCount === 0 || isDownloading}
            className={isDownloading ? 'cursor-wait' : ''}
          >
            {isDownloading ? 'Création du ZIP...' : 'Télécharger les photos'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {currentSlots.map((slot) => (
            <div
              key={slot.id}
              className={`
                relative aspect-square rounded-xl overflow-hidden
                border-2 transition-all duration-200 transform
                ${slot.file 
                  ? 'border-transparent shadow-lg hover:shadow-xl hover:scale-[1.02]' 
                  : 'border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500'}
                ${draggedSlot?.id === slot.id ? 'opacity-50 scale-95' : 'opacity-100'}
              `}
              draggable={slot.file !== null}
              onDragStart={(e) => handleDragStart(e, slot)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slot)}
            >
              {slot.preview ? (
                <>
                  <img
                    src={slot.preview}
                    alt={`Position ${slot.position}`}
                    className="w-full h-full object-cover cursor-move"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60">
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                      <span className="text-3xl font-bold text-white drop-shadow-lg">
                        {slot.customPosition || slot.position}
                      </span>
                      <button
                        onClick={() => setEditingPosition(slot.id)}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  {editingPosition === slot.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div 
                        className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="number"
                          min="1"
                          max={TOTAL_SLOTS}
                          value={slot.customPosition || slot.position}
                          onChange={(e) => handlePositionEdit(slot, e.target.value)}
                          onBlur={handlePositionEditComplete}
                          onKeyDown={(e) => e.key === 'Enter' && handlePositionEditComplete()}
                          className="w-24 px-3 py-2 text-center text-lg font-medium text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <label
                  htmlFor={`file-${slot.id}`}
                  className="absolute inset-0 flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50"
                >
                  <span className="text-3xl font-bold text-gray-400 dark:text-gray-600 mb-2">
                    {slot.position}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Glissez une photo ici ou cliquez pour en sélectionner une
                  </span>
                  <input
                    type="file"
                    id={`file-${slot.id}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileInput(e, slot)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4">
          <Button
            variant="secondary"
            icon={ChevronLeft}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Page précédente
          </Button>
          <span className="text-gray-600 dark:text-gray-300">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="secondary"
            icon={ChevronRight}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Page suivante
          </Button>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}