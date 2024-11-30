import { useState, useCallback } from 'react';
import { ImageSlot, TOTAL_SLOTS } from '../types/drag-express';
import JSZip from 'jszip';

export function useDragExpress() {
  const [slots, setSlots] = useState<ImageSlot[]>(() => 
    Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
      id: `slot-${i + 1}`,
      file: null,
      preview: null,
      position: i + 1,
      bisNumber: 0
    }))
  );
  const [draggedSlot, setDraggedSlot] = useState<ImageSlot | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProcessingFolder, setIsProcessingFolder] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

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
            position: position || s.position,
            customPosition: position || s.position,
            bisNumber: bis
          }
        : s
    ));
  };

  const renumberSlots = () => {
    setSlots(prev => {
      // Créer une copie des slots pour la manipulation
      const newSlots = [...prev];
      
      // Trouver le premier slot non vide
      let nextNumber = 1;
      
      // Parcourir tous les slots dans l'ordre actuel
      for (let i = 0; i < newSlots.length; i++) {
        const slot = newSlots[i];
        
        // Si le slot a un fichier et pas de numéro bis
        if (slot.file && !slot.bisNumber) {
          // Mettre à jour la position avec le prochain numéro disponible
          slot.position = nextNumber;
          slot.customPosition = nextNumber;
          nextNumber++;
        }
        // Si le slot a un fichier et un numéro bis, ne pas le modifier
        else if (slot.file && slot.bisNumber) {
          // Conserver la position actuelle
          continue;
        }
        // Si le slot est vide, conserver sa position originale
        else {
          slot.position = i + 1;
          slot.customPosition = i + 1;
        }
      }
      
      return newSlots;
    });
  };

  const renumberByDisplayNumber = () => {
    setSlots(prev => {
      const newSlots = [...prev];
      
      // Trier les slots avec des fichiers par leur numéro affiché
      const filledSlots = newSlots.filter(slot => slot.file !== null);
      filledSlots.sort((a, b) => {
        const posA = a.position;
        const posB = b.position;
        return posA - posB;
      });
      
      // Garder une trace du prochain numéro disponible
      let nextNumber = 1;
      
      // Parcourir les slots remplis triés
      filledSlots.forEach(slot => {
        // Si le slot a un numéro bis, le conserver
        if (slot.bisNumber) {
          return;
        }
        
        // Trouver le prochain numéro disponible qui n'est pas utilisé par un bis
        while (filledSlots.some(s => s.bisNumber && (s.customPosition || s.position) === nextNumber)) {
          nextNumber++;
        }
        
        // Mettre à jour le slot avec le nouveau numéro
        const slotIndex = newSlots.findIndex(s => s.id === slot.id);
        if (slotIndex !== -1) {
          newSlots[slotIndex] = {
            ...slot,
            position: nextNumber,
            customPosition: nextNumber,
          };
        }
        nextNumber++;
      });

      // Renuméroter les slots vides en fonction des slots avec photos
      let emptyNumber = 1;
      newSlots.forEach((slot, index) => {
        if (!slot.file) {
          while (filledSlots.some(s => (s.customPosition || s.position) === emptyNumber)) {
            emptyNumber++;
          }
          slot.position = emptyNumber;
          slot.customPosition = emptyNumber;
          emptyNumber++;
        }
      });
      
      return newSlots;
    });
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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

  return {
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
  };
}