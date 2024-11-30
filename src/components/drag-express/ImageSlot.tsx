import React from 'react';
import { X, Copy, MousePointerClick } from 'lucide-react';
import { ImageSlot as ImageSlotType } from '../../types/drag-express';

interface ImageSlotProps {
  slot: ImageSlotType;
  draggedSlot: ImageSlotType | null;
  editingPosition: string | null;
  editValue: string;
  onDragStart: (e: React.DragEvent, slot: ImageSlotType) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, slot: ImageSlotType) => void;
  onRemove: (id: string) => void;
  onIncrementBis: (slot: ImageSlotType) => void;
  onStartEditing: (slot: ImageSlotType) => void;
  onEditValueChange: (value: string) => void;
  onPositionChange: (slot: ImageSlotType, value: string) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>, slot: ImageSlotType) => void;
}

export function ImageSlot({
  slot,
  draggedSlot,
  editingPosition,
  editValue,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemove,
  onIncrementBis,
  onStartEditing,
  onEditValueChange,
  onPositionChange,
  onFileInput
}: ImageSlotProps) {
  const handleBisIncrement = (e: React.MouseEvent, slot: ImageSlotType) => {
    e.preventDefault();
    e.stopPropagation();
    onIncrementBis(slot);
  };

  return (
    <div
      className={`
        relative aspect-square rounded-xl overflow-hidden select-none
        border-2 transition-all duration-200 transform drag-target group
        ${slot.file 
          ? 'border-transparent shadow-lg hover:shadow-xl hover:scale-[1.02]' 
          : 'border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500'}
        ${draggedSlot?.id === slot.id ? 'opacity-50 scale-95' : 'opacity-100'}
      `}
      draggable={slot.file !== null}
      onDragStart={(e) => onDragStart(e, slot)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, slot)}
    >
      {slot.preview ? (
        <>
          <img
            src={slot.preview}
            alt={`Position ${slot.position}`}
            className="w-full h-full object-cover cursor-move select-none"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(slot.id);
              }}
              className="absolute top-4 left-4 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Supprimer l'image"
            >
              <X className="w-5 h-5" />
            </button>
            
            <button
              onClick={(e) => handleBisIncrement(e, slot)}
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
                    onChange={(e) => onEditValueChange(e.target.value)}
                    onBlur={() => onPositionChange(slot, editValue)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onPositionChange(slot, editValue);
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
                  className="group/number inline-flex items-center select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartEditing(slot);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onStartEditing(slot);
                  }}
                >
                  <div className="
                    flex items-center px-3 py-1.5 rounded-lg
                    bg-black/50 hover:bg-black/70 transition-all duration-200
                    cursor-pointer group-hover/number:ring-2 group-hover/number:ring-white/30
                  ">
                    <span className="text-xl font-bold text-white drop-shadow-lg select-none">
                      {slot.customPosition || slot.position}
                      {slot.bisNumber > 0 && (
                        <span className="text-emerald-400 ml-1 select-none">{`_${slot.bisNumber}`}</span>
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
          className="absolute inset-0 flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 select-none"
        >
          <span className="text-3xl font-bold text-gray-400 dark:text-gray-600 mb-2 select-none">
            {slot.position}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 text-center select-none">
            Glissez une photo ici ou cliquez pour en sélectionner une
          </span>
          <input
            type="file"
            id={`file-${slot.id}`}
            accept="image/*"
            className="hidden"
            onChange={(e) => onFileInput(e, slot)}
          />
        </label>
      )}
    </div>
  );
}