import React, { useState } from 'react';
import { Tags, Upload, X, AlertCircle, Download, Hash, Image as ImageIcon, Palette, Grid } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { jsPDF } from 'jspdf';

interface StudyInfo {
  name: string;
  orderNumber: string;
  saleName: string;
  logo: string | null;
}

interface LotRange {
  start: number;
  end: number;
}

interface Background {
  type: 'none' | 'color' | 'image';
  value: string;
}

interface GridConfig {
  columns: number;
  rows: number;
}

export function TagExpress() {
  const [studyInfo, setStudyInfo] = useState<StudyInfo>({
    name: '',
    orderNumber: '',
    saleName: '',
    logo: null
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [lotRange, setLotRange] = useState<LotRange>({
    start: 1,
    end: 24
  });
  const [background, setBackground] = useState<Background>({
    type: 'none',
    value: ''
  });
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    columns: 3,
    rows: 8
  });

  // Calculer les dimensions des étiquettes en fonction de la grille
  const calculateLabelDimensions = () => {
    // A4 dimensions en mm (210 x 297)
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10; // Marge de 10mm sur chaque côté

    const availableWidth = pageWidth - (2 * margin);
    const availableHeight = pageHeight - (2 * margin);

    const labelWidth = availableWidth / gridConfig.columns;
    const labelHeight = availableHeight / gridConfig.rows;

    return { labelWidth, labelHeight };
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStudyInfo(prev => ({
          ...prev,
          logo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackground({
          type: 'image',
          value: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setStudyInfo(prev => ({
      ...prev,
      logo: null
    }));
  };

  const removeBackground = () => {
    setBackground({
      type: 'none',
      value: ''
    });
  };

  const generatePDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const totalLabels = lotRange.end - lotRange.start + 1;
      const labelsPerPage = gridConfig.columns * gridConfig.rows;
      const totalPages = Math.ceil(totalLabels / labelsPerPage);

      // Calculer les dimensions des étiquettes
      const { labelWidth, labelHeight } = calculateLabelDimensions();
      const margin = 10;

      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        const startLabel = pageNum * labelsPerPage;
        const endLabel = Math.min((pageNum + 1) * labelsPerPage, totalLabels);

        for (let i = startLabel; i < endLabel; i++) {
          const col = (i % labelsPerPage) % gridConfig.columns;
          const row = Math.floor((i % labelsPerPage) / gridConfig.columns);

          const x = margin + (col * labelWidth);
          const y = margin + (row * labelHeight);

          // Ajouter le fond
          if (background.type === 'color') {
            pdf.setFillColor(background.value);
            pdf.rect(x, y, labelWidth, labelHeight, 'F');
          } else if (background.type === 'image' && background.value) {
            try {
              pdf.addImage(
                background.value,
                'PNG',
                x,
                y,
                labelWidth,
                labelHeight,
                undefined,
                'FAST'
              );
            } catch (error) {
              console.error('Erreur lors de l\'ajout du fond:', error);
            }
          }

          // Dessiner le cadre de l'étiquette
          pdf.setDrawColor(200, 200, 200);
          pdf.rect(x, y, labelWidth, labelHeight);

          // Ajouter le logo si présent
          if (studyInfo.logo) {
            try {
              pdf.addImage(
                studyInfo.logo,
                'PNG',
                x + (labelWidth / 2) - (labelWidth * 0.15),
                y + (labelHeight * 0.1),
                labelWidth * 0.3,
                labelHeight * 0.2,
                undefined,
                'FAST'
              );
            } catch (error) {
              console.error('Erreur lors de l\'ajout du logo:', error);
            }
          }

          // Configuration du texte
          pdf.setFontSize(8);
          const centerX = x + (labelWidth / 2);

          // Nom de l'étude
          if (studyInfo.name) {
            pdf.setFont('helvetica', 'bold');
            pdf.text(studyInfo.name, centerX, y + (labelHeight * 0.4), { align: 'center' });
          }

          // Référence
          if (studyInfo.orderNumber) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(6);
            pdf.text(`Réf: ${studyInfo.orderNumber}`, centerX, y + (labelHeight * 0.5), { align: 'center' });
          }

          // Nom de la vente
          if (studyInfo.saleName) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(6);
            pdf.text(studyInfo.saleName, centerX, y + (labelHeight * 0.6), { align: 'center' });
          }

          // Numéro
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10);
          const lotNumber = lotRange.start + i;
          pdf.text(`N°${lotNumber}`, centerX, y + (labelHeight * 0.8), { align: 'center' });
        }
      }

      pdf.save('etiquettes.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRangeChange = (type: 'start' | 'end', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setLotRange(prev => {
      const newRange = { ...prev, [type]: numValue };
      if (type === 'start' && numValue > prev.end) {
        newRange.end = numValue;
      } else if (type === 'end' && numValue < prev.start) {
        newRange.start = numValue;
      }
      return newRange;
    });
  };

  const handleGridChange = (type: 'columns' | 'rows', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) return;

    setGridConfig(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Tags className="w-10 h-10 text-emerald-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Tag Express</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Générez des étiquettes professionnelles pour vos lots
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Informations de l'étude */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-emerald-500" />
            Informations de l'étude (optionnelles)
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom de l'étude
              </label>
              <input
                type="text"
                value={studyInfo.name}
                onChange={(e) => setStudyInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Ex: Étude de Maître Dupont"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Référence Interne
              </label>
              <input
                type="text"
                value={studyInfo.orderNumber}
                onChange={(e) => setStudyInfo(prev => ({ ...prev, orderNumber: e.target.value }))}
                className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Ex: 2024-001"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom de la vente
              </label>
              <input
                type="text"
                value={studyInfo.saleName}
                onChange={(e) => setStudyInfo(prev => ({ ...prev, saleName: e.target.value }))}
                className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Ex: Succession Durand"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Plage de numéros de lots
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  value={lotRange.start}
                  onChange={(e) => handleRangeChange('start', e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Début"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="number"
                  min={lotRange.start}
                  value={lotRange.end}
                  onChange={(e) => handleRangeChange('end', e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Fin"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {gridConfig.columns * gridConfig.rows} étiquettes par page ({gridConfig.columns} colonnes × {gridConfig.rows} lignes)
              </p>
            </div>

            {/* Configuration de la grille */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Grid className="w-4 h-4 text-emerald-500" />
                Configuration de la grille
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Colonnes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={gridConfig.columns}
                    onChange={(e) => handleGridChange('columns', e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Lignes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={gridConfig.rows}
                    onChange={(e) => handleGridChange('rows', e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Limites : 1-5 colonnes, 1-12 lignes (format A4)
              </p>
            </div>
          </div>
        </div>

        {/* Logo et Fond */}
        <div className="space-y-8">
          {/* Logo */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Logo de l'étude
            </h3>
            
            <div className="flex flex-col items-center justify-center">
              {studyInfo.logo ? (
                <div className="relative w-64 h-32 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
                  <img
                    src={studyInfo.logo}
                    alt="Logo de l'étude"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Supprimer le logo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-64 h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-emerald-500 transition-colors bg-white/50 dark:bg-gray-800/50">
                  <Upload className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mb-4" />
                  <label className="cursor-pointer text-center">
                    <span className="text-sm text-emerald-500 hover:text-emerald-600 font-medium">
                      Choisir un logo
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Format recommandé : PNG ou JPG
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Fond */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Fond de l'étiquette
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setBackground({ type: 'none', value: '' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  background.type === 'none'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg" />
                  <span className="text-sm font-medium">Aucun</span>
                </div>
              </button>

              <button
                onClick={() => setBackground({ type: 'color', value: '#f3f4f6' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  background.type === 'color'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Palette className="w-8 h-8 text-emerald-500" />
                  <span className="text-sm font-medium">Couleur</span>
                </div>
              </button>

              <button
                onClick={() => document.getElementById('background-upload')?.click()}
                className={`p-4 rounded-lg border-2 transition-all ${
                  background.type === 'image'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8 text-emerald-500" />
                  <span className="text-sm font-medium">Image</span>
                </div>
                <input
                  id="background-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="hidden"
                />
              </button>
            </div>

            {background.type === 'color' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Couleur de fond
                </label>
                <input
                  type="color"
                  value={background.value}
                  onChange={(e) => setBackground({ type: 'color', value: e.target.value })}
                  className="w-full h-11 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {background.type === 'image' && background.value && (
              <div className="relative">
                <img
                  src={background.value}
                  alt="Fond personnalisé"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={removeBackground}
                  className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Supprimer le fond"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          icon={Download}
          onClick={generatePDF}
          disabled={isGenerating}
          className="px-8"
        >
          {isGenerating ? 'Génération...' : 'Télécharger en PDF'}
        </Button>
      </div>

      {/* Aperçu */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Aperçu
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Aperçu de l'étiquette */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Étiquette individuelle
            </h4>
            <div className="flex justify-center">
              <div 
                className="w-[280px] h-[148px] rounded-lg shadow-lg p-4 flex flex-col items-center justify-center border border-gray-200"
                style={{
                  backgroundColor: background.type === 'color' ? background.value : 'white',
                  backgroundImage: background.type === 'image' ? `url(${background.value})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {studyInfo.logo && (
                  <div className="h-8 mb-2">
                    <img
                      src={studyInfo.logo}
                      alt="Logo"
                      className="h-full object-contain"
                    />
                  </div>
                )}
                <div className="text-center space-y-1">
                  {studyInfo.name && (
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{studyInfo.name}</p>
                  )}
                  {studyInfo.orderNumber && (
                    <p className="text-xs text-gray-600">Réf: {studyInfo.orderNumber}</p>
                  )}
                  {studyInfo.saleName && (
                    <p className="text-xs text-gray-600 line-clamp-1">{studyInfo.saleName}</p>
                  )}
                  <p className="text-sm font-bold text-gray-900">N°{lotRange.start}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aperçu de la page */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Disposition sur la page
            </h4>
            <div className="flex justify-center">
              <div className="w-[210px] h-[297px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700 relative">
                {/* Grille d'étiquettes */}
                <div 
                  className="grid gap-1 h-full"
                  style={{
                    gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
                    gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`
                  }}
                >
                  {Array.from({ length: gridConfig.columns * gridConfig.rows }).map((_, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-600 rounded"
                      style={{
                        backgroundColor: background.type === 'color' ? background.value : 'white',
                        backgroundImage: background.type === 'image' ? `url(${background.value})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {index < 3 && (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500">
                          N°{lotRange.start + index}
                        </div>
                      )}
                      {index === 3 && (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">
                          ...
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Dimensions */}
                <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400 writing-vertical">
                  297mm
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
                  210mm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}