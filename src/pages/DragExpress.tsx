import React, { useState } from 'react';
import { GalleryHorizontalEnd, FolderUp, Info, ArrowUp as ArrowUpIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DropZone } from '../components/ui/DropZone';
import { ImageSlot } from '../components/drag-express/ImageSlot';
import { ActionPanel } from '../components/drag-express/ActionPanel';
import { useDragExpress } from '../hooks/useDragExpress';
import { TOTAL_SLOTS, SLOTS_PER_PAGE } from '../types/drag-express';

export function DragExpress() {
  const {
    slots,
    setSlots,
    draggedSlot,
    setDraggedSlot,
    isDownloading,
    isProcessingFolder,
    prefix,
    setPrefix,
    editingPosition,
    setEditingPosition,
    editValue,
    setEditValue,
    handlePositionChange,
    renumberSlots,
    renumberByDisplayNumber,
    incrementBis,
    handleDownload,
    clearAll,
    sortAscending,
    sortDescending,
    onDrop
  } = useDragExpress();

  const [currentPage, setCurrentPage] = useState(1);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
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

  const startIndex = (currentPage - 1) * SLOTS_PER_PAGE;
  const endIndex = startIndex + SLOTS_PER_PAGE;
  const currentSlots = slots.slice(startIndex, endIndex);
  const totalPages = Math.ceil(TOTAL_SLOTS / SLOTS_PER_PAGE);
  const filledSlotsCount = slots.filter(slot => slot.file !== null).length;

  const handleDragStart = (e: React.DragEvent, slot: any) => {
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

  const handleDrop = async (e: React.DragEvent, targetSlot: any) => {
    e.preventDefault();
    
    if (e.currentTarget.classList.contains('drag-target')) {
      e.currentTarget.classList.remove('drag-over');
    }

    if (draggedSlot) {
      const newSlots = [...slots];
      const sourceIndex = newSlots.findIndex(s => s.id === draggedSlot.id);
      const targetIndex = newSlots.findIndex(s => s.id === targetSlot.id);

      if (sourceIndex !== -1 && targetIndex !== -1) {
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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, slot: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setSlots(prev => prev.map(s => 
      s.id === slot.id 
        ? { ...s, file, preview, bisNumber: 0 }
        : s
    ));
  };

  const removeImage = (slotId: string) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        if (slot.preview) {
          URL.revokeObjectURL(slot.preview);
        }
        return {
          ...slot,
          file: null,
          preview: null,
          customPosition: undefined,
          bisNumber: 0
        };
      }
      return slot;
    }));
  };

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
          onDrop={onDrop}
          icon={FolderUp}
          message={`Déposez un dossier d'images ici (${TOTAL_SLOTS - filledSlotsCount} emplacements disponibles)`}
          activeMessage="Déposez le dossier ici..."
          className={isProcessingFolder ? 'pointer-events-none opacity-50' : ''}
        />
      </div>

      <ActionPanel
        prefix={prefix}
        onPrefixChange={setPrefix}
        filledSlotsCount={filledSlotsCount}
        totalSlots={TOTAL_SLOTS}
        onRenumber={renumberSlots}
        onRenumberByNumber={renumberByDisplayNumber}
        onSortAscending={sortAscending}
        onSortDescending={sortDescending}
        onClearAll={clearAll}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />

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
            <ImageSlot
              key={slot.id}
              slot={slot}
              draggedSlot={draggedSlot}
              editingPosition={editingPosition}
              editValue={editValue}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onRemove={removeImage}
              onIncrementBis={incrementBis}
              onStartEditing={(slot) => {
                setEditingPosition(slot.id);
                setEditValue(`${slot.customPosition || slot.position}${slot.bisNumber ? '_' + slot.bisNumber : ''}`);
              }}
              onEditValueChange={setEditValue}
              onPositionChange={(slot, value) => {
                handlePositionChange(slot, value);
                setEditingPosition(null);
              }}
              onFileInput={handleFileInput}
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-4">
          <Button
            variant="secondary"
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