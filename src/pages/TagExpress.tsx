import React, { useState } from 'react';
import { Tags, Download, Settings, Eye, Layout } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTagExpress } from '../hooks/useTagExpress';
import { StudyInfoSection } from '../components/tag-express/StudyInfoSection';
import { GridConfigSection } from '../components/tag-express/GridConfigSection';
import { TextColorSection } from '../components/tag-express/TextColorSection';
import { BackgroundSection } from '../components/tag-express/BackgroundSection';
import { LogoSection } from '../components/tag-express/LogoSection';
import { PreviewSection } from '../components/tag-express/PreviewSection';

type TabType = 'informations' | 'style' | 'disposition';

interface TabConfig {
  id: TabType;
  label: string;
  icon: typeof Settings;
}

export function TagExpress() {
  const {
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
  } = useTagExpress();

  const [activeTab, setActiveTab] = useState<TabType>('informations');

  const tabs: TabConfig[] = [
    { id: 'informations', label: 'Informations', icon: Settings },
    { id: 'style', label: 'Style', icon: Eye },
    { id: 'disposition', label: 'Disposition', icon: Layout }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'informations':
        return (
          <div className="space-y-6">
            <StudyInfoSection
              studyInfo={studyInfo}
              setStudyInfo={setStudyInfo}
              lotRange={lotRange}
              handleRangeChange={handleRangeChange}
              gridConfig={gridConfig}
            />
            <LogoSection
              studyInfo={studyInfo}
              handleLogoUpload={handleLogoUpload}
              removeLogo={removeLogo}
            />
          </div>
        );
      case 'style':
        return (
          <div className="space-y-6">
            <TextColorSection
              textColors={textColors}
              handleTextColorChange={handleTextColorChange}
            />
            <BackgroundSection
              background={background}
              setBackground={setBackground}
              handleBackgroundImageUpload={handleBackgroundImageUpload}
              removeBackground={removeBackground}
            />
          </div>
        );
      case 'disposition':
        return (
          <GridConfigSection
            gridConfig={gridConfig}
            handleGridChange={handleGridChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Tags className="w-10 h-10 text-emerald-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Tag Express</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Générez des étiquettes professionnelles pour vos lots
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr,1fr] gap-8">
        {/* Panneau de configuration */}
        <div className="space-y-6">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-emerald-500 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={resetAll}
              className="w-full"
            >
              Réinitialiser
            </Button>
            <Button
              variant="primary"
              icon={Download}
              onClick={generatePDF}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Génération...' : 'Télécharger en PDF'}
            </Button>
          </div>
        </div>

        {/* Aperçu */}
        <div>
          <PreviewSection
            studyInfo={studyInfo}
            lotRange={lotRange}
            background={background}
            gridConfig={gridConfig}
            textColors={textColors}
          />
        </div>
      </div>
    </div>
  );
}