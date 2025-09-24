
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import XrayAnalysis from './components/XrayAnalysis';
import PrescriptionOCR from './components/PrescriptionOCR';
import RiskScoring from './components/RiskScoring';
import { Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.XRay);

  const renderContent = () => {
    switch (activePage) {
      case Page.XRay:
        return <XrayAnalysis />;
      case Page.OCR:
        return <PrescriptionOCR />;
      case Page.Risk:
        return <RiskScoring />;
      default:
        return <XrayAnalysis />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
