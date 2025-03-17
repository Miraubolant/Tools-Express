import { useState } from 'react';
import { StudyInfo, LotRange, Background, GridConfig, TextColors } from '../types/tag-express';
import { jsPDF } from 'jspdf';

export function useTagExpress() {
  const [studyInfo, setStudyInfo] = useState<StudyInfo>({
    name: '',
    orderNumber: '',
    saleName: '',
    logo: null
  });

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
    rows: 8,
    margin: 10,
    spacing: 2
  });

  const [textColors, setTextColors] = useState<TextColors>({
    title: '#000000',
    subtitle: '#666666',
    number: '#000000'
  });

  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleTextColorChange = (type: keyof TextColors, value: string) => {
    setTextColors(prev => ({
      ...prev,
      [type]: value
    }));
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

  const handleGridChange = (type: keyof GridConfig, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;
    
    const limits = {
      columns: { min: 1, max: 5 },
      rows: { min: 1, max: 12 },
      margin: { min: 0, max: 30 },
      spacing: { min: 0, max: 10 }
    };

    const limit = limits[type as keyof typeof limits];
    if (numValue < limit.min || numValue > limit.max) return;

    setGridConfig(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const generatePDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      // Créer un nouveau document PDF au format A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Dimensions de la page A4 en mm
      const pageWidth = 210;
      const pageHeight = 297;

      // Calculer les dimensions des étiquettes
      const usableWidth = pageWidth - (2 * gridConfig.margin);
      const usableHeight = pageHeight - (2 * gridConfig.margin);
      
      const labelWidth = (usableWidth - (gridConfig.spacing * (gridConfig.columns - 1))) / gridConfig.columns;
      const labelHeight = (usableHeight - (gridConfig.spacing * (gridConfig.rows - 1))) / gridConfig.rows;

      // Calculer le nombre total d'étiquettes et de pages
      const totalLabels = lotRange.end - lotRange.start + 1;
      const labelsPerPage = gridConfig.columns * gridConfig.rows;
      const totalPages = Math.ceil(totalLabels / labelsPerPage);

      // Pour chaque page
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // Ajouter un fond de page si nécessaire
        if (background.type === 'color') {
          pdf.setFillColor(background.value);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        }

        // Pour chaque étiquette sur la page
        for (let row = 0; row < gridConfig.rows; row++) {
          for (let col = 0; col < gridConfig.columns; col++) {
            const labelIndex = (page * labelsPerPage) + (row * gridConfig.columns) + col;
            const lotNumber = lotRange.start + labelIndex;

            if (lotNumber > lotRange.end) continue;

            // Calculer la position de l'étiquette
            const x = gridConfig.margin + (col * (labelWidth + gridConfig.spacing));
            const y = gridConfig.margin + (row * (labelHeight + gridConfig.spacing));

            // Dessiner le fond de l'étiquette
            pdf.setFillColor(255, 255, 255);
            pdf.rect(x, y, labelWidth, labelHeight, 'F');

            // Ajouter le logo si présent
            if (studyInfo.logo) {
              const logoHeight = labelHeight * 0.3;
              pdf.addImage(
                studyInfo.logo,
                'PNG',
                x + (labelWidth * 0.1),
                y + (labelHeight * 0.1),
                labelWidth * 0.8,
                logoHeight
              );
            }

            // Configuration des textes
            const startY = studyInfo.logo ? y + (labelHeight * 0.45) : y + (labelHeight * 0.2);
            const lineHeight = labelHeight * 0.12;

            // Ajouter les textes
            pdf.setFontSize(10);
            
            // Nom de l'étude
            if (studyInfo.name) {
              pdf.setTextColor(textColors.title);
              pdf.setFont('helvetica', 'bold');
              pdf.text(
                studyInfo.name,
                x + (labelWidth / 2),
                startY,
                { align: 'center', maxWidth: labelWidth * 0.9 }
              );
            }

            // Référence
            if (studyInfo.orderNumber) {
              pdf.setTextColor(textColors.subtitle);
              pdf.setFont('helvetica', 'normal');
              pdf.text(
                `Réf: ${studyInfo.orderNumber}`,
                x + (labelWidth / 2),
                startY + lineHeight,
                { align: 'center', maxWidth: labelWidth * 0.9 }
              );
            }

            // Nom de la vente
            if (studyInfo.saleName) {
              pdf.setTextColor(textColors.subtitle);
              pdf.setFont('helvetica', 'normal');
              pdf.text(
                studyInfo.saleName,
                x + (labelWidth / 2),
                startY + (lineHeight * 2),
                { align: 'center', maxWidth: labelWidth * 0.9 }
              );
            }

            // Numéro de lot
            pdf.setTextColor(textColors.number);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.text(
              `N°${lotNumber}`,
              x + (labelWidth / 2),
              startY + (lineHeight * 3.5),
              { align: 'center' }
            );
          }
        }
      }

      // Sauvegarder le PDF
      pdf.save('etiquettes.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetAll = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser tous les paramètres ?')) {
      setStudyInfo({
        name: '',
        orderNumber: '',
        saleName: '',
        logo: null
      });
      setLotRange({
        start: 1,
        end: 24
      });
      setBackground({
        type: 'none',
        value: ''
      });
      setGridConfig({
        columns: 3,
        rows: 8,
        margin: 10,
        spacing: 2
      });
      setTextColors({
        title: '#000000',
        subtitle: '#666666',
        number: '#000000'
      });
    }
  };

  return {
    studyInfo,
    setStudyInfo,
    isGenerating,
    lotRange,
    background,
    setBackground,
    gridConfig,
    textColors,
    handleLogoUpload,
    handleBackgroundImageUpload,
    removeLogo,
    removeBackground,
    handleTextColorChange,
    handleRangeChange,
    handleGridChange,
    generatePDF,
    resetAll
  };
}