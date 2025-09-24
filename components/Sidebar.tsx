import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  activePage: Page;
  setActivePage: (page: Page) => void;
  // Fix: Used React.ReactElement for better type safety with React.cloneElement.
  icon: React.ReactElement;
  label: string;
}> = ({ page, activePage, setActivePage, icon, label }) => {
  const isActive = activePage === page;
  return (
    <button
      onClick={() => setActivePage(page)}
      className={`flex items-center w-full px-4 py-3 text-left text-sm font-medium transition-colors duration-200 rounded-lg ${
        isActive
          ? 'bg-emerald-600 text-white'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
      }`}
    >
      {React.cloneElement(icon, { className: 'h-5 w-5 mr-3' })}
      <span className="flex-1">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0 h-full flex flex-col p-4">
      <div className="flex items-center mb-8">
        <div className="bg-emerald-500 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Sehat<span className="text-emerald-500">AI</span></h1>
      </div>
      <nav className="flex-1 space-y-2">
        <NavItem
          page={Page.XRay}
          activePage={activePage}
          setActivePage={setActivePage}
          label="X-Ray Analysis"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
        />
        <NavItem
          page={Page.OCR}
          activePage={activePage}
          setActivePage={setActivePage}
          label="Prescription OCR"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>}
        />
        <NavItem
          page={Page.Risk}
          activePage={activePage}
          setActivePage={setActivePage}
          label="Risk Scoring"
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>}
        />
      </nav>
       <div className="mt-auto text-center text-xs text-gray-400">
          <p>&copy; 2024 SehatAI. All rights reserved.</p>
          <p>Empowering Rural Healthcare.</p>
        </div>
    </aside>
  );
};

export default Sidebar;