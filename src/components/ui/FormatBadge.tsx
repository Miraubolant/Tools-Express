import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface FormatBadgeProps {
  format: string;
  description: string;
}

export function FormatBadge({ format, description }: FormatBadgeProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium cursor-help"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <span>{format}</span>
        <Info className="w-4 h-4" />
      </div>

      {showInfo && (
        <div className="absolute z-10 top-full mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 text-sm w-48">
          {description}
        </div>
      )}
    </div>
  );
}