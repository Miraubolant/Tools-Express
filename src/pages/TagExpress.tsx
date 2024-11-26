import React, { useState } from 'react';
import { Tags, Upload, X, AlertCircle, Printer, Download } from 'lucide-react';
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

export function TagExpress() {
  const [studyInfo, setStudyInfo] = useState<StudyInfo>({
    name: '',
    orderNumber: '',
    saleName: '',
    logo: null
  });
  const [labelCount, setLabelCount] = useState<number>(24);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lotRange, setLotRange] = useState<LotRange>({
    start: 1,
    end: 24
  });

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

  const removeLogo = () => {
    setStudyInfo(prev => ({
      ...prev,
      logo: null
    }));
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
      const totalPages = Math.ceil(totalLabels / 24);

      // Dimensions des étiquettes en mm
      const LABEL_WIDTH = 70;
      const LABEL_HEIGHT = 37;
      
      // Configuration de la grille
      const COLS = 3;
      const ROWS = 8;
      const LABELS_PER_PAGE = COLS * ROWS;

      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        const startLabel = pageNum * LABELS_PER_PAGE;
        const endLabel = Math.min((pageNum + 1) * LABELS_PER_PAGE, totalLabels);

        for (let i = startLabel; i < endLabel; i++) {
          const col = (i % LABELS_PER_PAGE) % COLS;
          const row = Math.floor((i % LABELS_PER_PAGE) / COLS);

          const x = col * LABEL_WIDTH;
          const y = row * LABEL_HEIGHT;

          // Dessiner le cadre de l'étiquette
          pdf.setDrawColor(200, 200, 200);
          pdf.rect(x, y, LABEL_WIDTH, LABEL_HEIGHT);

          // Ajouter le logo si présent
          if (studyInfo.logo) {
            try {
              pdf.addImage(
                studyInfo.logo,
                'PNG',
                x + (LABEL_WIDTH / 2) - 10,
                y + 4,
                20,
                8,
                undefined,
                'FAST'
              );
            } catch (error) {
              console.error('Erreur lors de l\'ajout du logo:', error);
            }
          }

          // Configuration du texte
          pdf.setFontSize(8);
          const centerX = x + (LABEL_WIDTH / 2);

          // Nom de l'étude
          if (studyInfo.name) {
            pdf.setFont('helvetica', 'bold');
            pdf.text(studyInfo.name, centerX, y + (studyInfo.logo ? 16 : 10), { align: 'center' });
          }

          // Référence
          if (studyInfo.orderNumber) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(6);
            pdf.text(`Réf: ${studyInfo.orderNumber}`, centerX, y + (studyInfo.logo ? 19 : 13), { align: 'center' });
          }

          // Nom de la vente
          if (studyInfo.saleName) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(6);
            pdf.text(studyInfo.saleName, centerX, y + (studyInfo.logo ? 22 : 16), { align: 'center' });
          }

          // Numéro
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10);
          const lotNumber = lotRange.start + i;
          pdf.text(`N°${lotNumber}`, centerX, y + (studyInfo.logo ? 28 : 22), { align: 'center' });
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
                24 étiquettes par page (3 colonnes × 8 lignes)
              </p>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Logo de l'étude
          </h3>
          
          <div className="flex flex-col items-center justify-center">
            {studyInfo.logo ? (
              <div className="relative w-64 h-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
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
              <div className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-emerald-500 transition-colors bg-white/50 dark:bg-gray-800/50">
                <Upload className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mb-4" />
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
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button
          variant="primary"
          icon={Printer}
          onClick={() => setShowPreview(true)}
          className="px-8"
        >
          Aperçu
        </Button>
        <Button
          variant="primary"
          icon={Download}
          onClick={generatePDF}
          disabled={isGenerating}
          className="px-8 bg-emerald-500 hover:bg-emerald-600"
        >
          {isGenerating ? 'Génération...' : 'Télécharger en PDF'}
        </Button>
      </div>

      {/* Aperçu */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Aperçu de l'étiquette
        </h3>
        
        <div className="flex justify-center">
          <div className="w-[280px] h-[148px] bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center border border-gray-200">
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
    </div>
  );
}