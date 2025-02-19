import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucun fichier n'est enregistré sur nos serveurs. Tout le traitement est effectué localement dans votre navigateur.
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Créé par</span>
            <a 
              href="https://3pi.fr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <img src="https://i.imgur.com/VxI9d5K.png" alt="Logo 3PI" className="w-5 h-5" />
              <span className="font-medium"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}