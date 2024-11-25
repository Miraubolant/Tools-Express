import React from 'react';
import { useDropzone } from 'react-dropzone';
import { LucideIcon } from 'lucide-react';

interface DropZoneProps {
  onDrop: (files: File[]) => void;
  icon: LucideIcon;
  accept?: Record<string, string[]>;
  message: string;
  activeMessage: string;
  className?: string;
}

export function DropZone({
  onDrop,
  icon: Icon,
  accept,
  message,
  activeMessage,
  className = '',
}: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-all duration-300 transform hover:scale-[1.02]
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-blue-500 dark:hover:border-blue-500'}
        ${className}
      `}
    >
      <input {...getInputProps()} />
      <Icon className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {isDragActive ? activeMessage : message}
      </p>
    </div>
  );
}