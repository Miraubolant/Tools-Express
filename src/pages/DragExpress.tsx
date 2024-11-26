import React, { useState, useCallback, useEffect } from 'react';
import { GalleryHorizontalEnd, Download, Trash2, FolderUp, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUp as ArrowUpIcon, Copy, Info, MousePointerClick } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DropZone } from '../components/ui/DropZone';
import JSZip from 'jszip';

interface ImageSlot {
  id: string;
  file: File | null;
  preview: string | null;
  position: number;
  customPosition?: number;
  bisNumber?: number;
}

const TOTAL_SLOTS = 500;
const SLOTS_PER_PAGE = 100;

export function DragExpress() {
  const [slots, setSlots] = useState<ImageSlot[]>(() => 
    Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
      id: `slot-${i + 1}`,
      file: null,
      preview: null,
      position: i + 1,
      bisNumber: 0
    }))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedSlot, setDraggedSlot] = useState<ImageSlot | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProcessingFolder, setIsProcessingFolder] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [prefix, setPrefix] = useState('');
  const [editValue, setEditValue] = useState('');
  const [showTooltip, setShowTooltip] = useState(true);

  const filledSlotsCount = slots.filter(slot => slot.file !== null).length;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePositionChange = (slot: ImageSlot, value: string) => {
    const parts = value.split('_');
    let position = parseInt(parts[0], 10);
    let bis = parts.length > 1 ? parseInt(parts[1], 10) : 0;

    position = isNaN(position) ? 0 : position;
    bis = isNaN(bis) ? 0 : bis;

    position = Math.max(0, Math.min(position, TOTAL_SLOTS));
    bis = Math.max(0, Math.min(bis, 12));

    setSlots(prev => prev.map(s => 
      s.id === slot.id 
        ? { 
            ...s, 
            customPosition: position || s.position,
            bisNumber: bis
          }
        : s
    ));
  };

  const incrementBis = (slot: ImageSlot) => {
    setSlots(prev => prev.map(s => {
      if (s.id === slot.id) {
        const currentBis = s.bisNumber || 0;
        return {
          ...s,
          bisNumber: currentBis >= 12 ? 0 : currentBis + 1
        };
      }
      return s;
    }));
  };

  const startEditing = (slot: ImageSlot) => {
    if (!slot.file) return;
    setEditingPosition(slot.id);
    setEditValue(`${slot.customPosition || slot.position}${slot.bisNumber ? '_' + slot.bisNumber : ''}`);
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
            preview,
            bisNumber: 0
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

    if (slot.preview) {
      const dragImage = new Image();
      dragImage.src = slot.preview;
      dragImage.style.width = '100px';
      dragImage.style.height = '100px';
      dragImage.style.objectFit = 'cover';
      dragImage.style.opacity = '0.7';
      dragImage.style.borderRadius = '8px';
      
      dragImage.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.beginPath();
          ctx.roundRect(0, 0, 100, 100, 8);
          ctx.clip();
          ctx.drawImage(dragImage, 0, 0, 100, 100);
          
          e.dataTransfer.setDragImage(canvas, 50, 50);
        }
      };
    }
  };

  const handleDragEnd = () => {
    setDraggedSlot(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (e.currentTarget.classList.contains('drag-target')) {
      e.currentTarget.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('drag-target')) {
      e.currentTarget.classList.remove('drag-over');
    }
  };

  const handleDrop = async (e: React.DragEvent, targetSlot: ImageSlot) => {
    e.preventDefault();
    
    if (e.currentTarget.classList.contains('drag-target')) {
      e.currentTarget.classList.remove('drag-over');
    }

    if (draggedSlot) {
      const newSlots = [...slots];
      const sourceIndex = newSlots.findIndex(s => s.id === draggedSlot.id);
      const targetIndex = newSlots.findIndex(s => s.id === targetSlot.id);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        // Swap files and previews only, keep positions
        const tempFile = newSlots[targetIndex].file;
        const tempPreview = newSlots[targetIndex].preview;

        newSlots[targetIndex] = {
          ...newSlots[targetIndex],
          file: newSlots[sourceIndex].file,
          preview: newSlots[sourceIndex].preview,
        };

        newSlots[sourceIndex] = {
          ...newSlots[sourceIndex],
          file: tempFile,
          preview: tempPreview,
        };

        setSlots(newSlots);
      }
    } else {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        const preview = URL.createObjectURL(files[0]);
        setSlots(prev => prev.map(slot => 
          slot.id === targetSlot.id 
            ? { ...slot, file: files[0], preview, bisNumber: 0 }
            : slot
        ));
      }
    }

    setDraggedSlot(null);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, slot: ImageSlot) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setSlots(prev => prev.map(s => 
      s.id === slot.id 
        ? { ...s, file, preview, bisNumber: 0 }
        : s
    ));
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
            ? `${prefix}-${position}${slot.bisNumber ? '-' + slot.bisNumber : ''}.${extension}`
            : `${position}${slot.bisNumber ? '-' + slot.bisNumber : ''}.${extension}`;
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

    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
      id: `slot-${i + 1}`,
      file: null,
      preview: null,
      position: i + 1,
      customPosition: undefined,
      bisNumber: 0
    })));
    setPrefix('');
  };

  const sortAscending = () => {
    setSlots(prev => {
      const filledSlots = prev.filter(slot => slot.file);
      const emptySlots = prev.filter(slot => !slot.file);
      
      const sortedFilledSlots = [...filledSlots].sort((a, b) => {
        const posA = a.customPosition || a.position;
        const posB = b.customPosition || b.position;
        return posA - posB;
      });
      
      return [...sortedFilledSlots, ...emptySlots];
    });
  };

  const sortDescending = () => {
    setSlots(prev => {
      const filledSlots = prev.filter(slot => slot.file);
      const emptySlots = prev.filter(slot => !slot.file);
      
      const sortedFilledSlots = [...filledSlots].sort((a, b) => {
        const posA = a.customPosition || a.position;
        const posB = b.customPosition || b.position;
        return posB - posA;
      });
      
      return [...sortedFilledSlots, ...emptySlots];
    });
  };

  const startIndex = (currentPage - 1) * SLOTS_PER_PAGE;
  const endIndex = startIndex + SLOTS_PER_PAGE;
  const currentSlots = slots.slice(startIndex, endIndex);
  const totalPages = Math.ceil(TOTAL_SLOTS / SLOTS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <GalleryHorizontalEnd className="w-10 h-10 text-emerald-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Tri Express</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Réorganisez vos photos par glisser-déposer
        </p>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <DropZone
          onDrop={handleFolderDrop}
          icon={FolderUp}
          message={`Déposez un dossier d'images ici (${TOTAL_SLOTS - filledSlotsCount} emplacements disponibles)`}
          activeMessage="Déposez le dossier ici..."
          className={isProcessingFolder ? 'pointer-events-none opacity-50' : ''}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="Préfixe pour les noms de fichiers..."
            className="w-full sm:w-80 h-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {filledSlotsCount} photo{filledSlotsCount > 1 ? 's' : ''} sur {TOTAL_SLOTS}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon={ArrowUp}
              onClick={sortAscending}
              disabled={filledSlotsCount === 0}
            >
              Tri croissant
            </Button>
            <Button
              variant="secondary"
              icon={ArrowDown}
              onClick={sortDescending}
              disabled={filledSlotsCount === 0}
            >
              Tri décroissant
            </Button>
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

      {showTooltip && filledSlotsCount > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg flex items-center gap-2">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p>
            Double-cliquez sur le numéro d'une photo pour le modifier. 
            Utilisez le format "numéro_bis" (ex: 12_3) pour ajouter un numéro bis.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {currentSlots.map((slot) => (
            <div
              key={slot.id}
              className={`
                relative aspect-square rounded-xl overflow-hidden
                border-2 transition-all duration-200 transform drag-target
                ${slot.file 
                  ? 'border-transparent shadow-lg hover:shadow-xl hover:scale-[1.02]' 
                  : 'border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500'}
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
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80">
                    {/* Bouton Bis */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        incrementBis(slot);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-all duration-200 group"
                      title="Incrémenter le numéro bis"
                    >
                      <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>

                    <div className="absolute bottom-0 left-0 p-4">
                      {editingPosition === slot.id ? (
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => {
                              handlePositionChange(slot, editValue);
                              setEditingPosition(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handlePositionChange(slot, editValue);
                                setEditingPosition(null);
                              }
                            }}
                            className="
                              w-32 bg-black/70 text-white text-xl font-bold text-center 
                              rounded-lg px-3 py-1.5 border-2 border-white/30
                              focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50
                              placeholder-white/50 transition-all duration-200
                              hover:border-white/50
                            "
                            placeholder="N°_bis"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ) : (
                        <div 
                          className="group/number inline-flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(slot);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            startEditing(slot);
                          }}
                        >
                          <div className="
                            flex items-center px-3 py-1.5 rounded-lg
                            bg-black/50 hover:bg-black/70 transition-all duration-200
                            cursor-pointer group-hover/number:ring-2 group-hover/number:ring-white/30
                          ">
                            <span className="text-xl font-bold text-white drop-shadow-lg">
                              {slot.customPosition || slot.position}
                              {slot.bisNumber > 0 && (
                                <span className="text-emerald-400 ml-1">{`_${slot.bisNumber}`}</span>
                              )}
                            </span>
                            <MousePointerClick className="w-3.5 h-3.5 text-white/70 ml-2 group-hover/number:text-white transition-colors" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
          className="fixed bottom-8 right-8 p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          aria-label="Retour en haut"
        >
          <ArrowUpIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}