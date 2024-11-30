export interface ImageSlot {
  id: string;
  file: File | null;
  preview: string | null;
  position: number;
  customPosition?: number;
  bisNumber?: number;
}

export interface DragState {
  draggedSlot: ImageSlot | null;
  editingPosition: string | null;
  editValue: string;
}

export const TOTAL_SLOTS = 500;
export const SLOTS_PER_PAGE = 100;