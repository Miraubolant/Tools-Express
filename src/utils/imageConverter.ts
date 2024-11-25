import JSZip from 'jszip';

export async function convertToJPG(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Création d'un canvas avec la taille originale
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Conserver les dimensions originales
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        // Appliquer un fond blanc pour les images PNG transparentes
        if (file.type === 'image/png') {
          ctx!.fillStyle = '#FFFFFF';
          ctx!.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Dessiner l'image avec une meilleure qualité
        ctx!.imageSmoothingEnabled = true;
        ctx!.imageSmoothingQuality = 'high';
        ctx!.drawImage(img, 0, 0);
        
        // Convertir en JPG avec une qualité optimale
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Optimiser la taille si nécessaire
              if (blob.size > 1024 * 1024) { // Si plus de 1MB
                const quality = Math.min(0.9, (1024 * 1024) / blob.size);
                canvas.toBlob(
                  (optimizedBlob) => {
                    if (optimizedBlob) {
                      resolve(optimizedBlob);
                    } else {
                      reject(new Error('Échec de l\'optimisation'));
                    }
                  },
                  'image/jpeg',
                  quality
                );
              } else {
                resolve(blob);
              }
            } else {
              reject(new Error('Échec de la conversion'));
            }
          },
          'image/jpeg',
          0.92 // Qualité par défaut
        );
      };
      
      img.onerror = () => {
        reject(new Error('Échec du chargement de l\'image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Échec de la lecture du fichier'));
    };
    
    reader.readAsDataURL(file);
  });
}

export async function createDownloadZip(files: { file: File; preview: string }[]): Promise<Blob> {
  const zip = new JSZip();
  const maxConcurrent = 3; // Limite le nombre de conversions simultanées
  const chunks = [];
  
  // Diviser les fichiers en chunks pour éviter la surcharge mémoire
  for (let i = 0; i < files.length; i += maxConcurrent) {
    chunks.push(files.slice(i, i + maxConcurrent));
  }
  
  // Traiter les chunks séquentiellement
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async ({ file }) => {
        try {
          const jpgBlob = await convertToJPG(file);
          const fileName = file.name.toLowerCase().endsWith('.jpg') 
            ? file.name 
            : `${file.name.split('.')[0]}.jpg`;
          
          zip.file(fileName, jpgBlob);
        } catch (error) {
          console.error(`Échec de la conversion de ${file.name}:`, error);
        }
      })
    );
  }
  
  return zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6 // Niveau de compression optimal
    }
  });
}