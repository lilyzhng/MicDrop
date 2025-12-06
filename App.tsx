
import React, { useState, useEffect } from 'react';
import { SavedItem, SavedReport, PerformanceReport } from './types';
import { generateId } from './utils';
import HomeView from './views/HomeView';
import DatabaseView from './views/DatabaseView';
import AnalysisView from './views/AnalysisView';
import TeleprompterView from './views/TeleprompterView';

// Application Views
type AppView = 'home' | 'teleprompter' | 'analysis' | 'database';
type AnalysisMode = 'sound_check' | 'coach';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('sound_check');
  
  // Persistence State
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  // Load saved data from localStorage on mount
  useEffect(() => {
      const storedItems = localStorage.getItem('micdrop_saved_items');
      if (storedItems) {
          try { setSavedItems(JSON.parse(storedItems)); } catch (e) { console.error("Failed to parse saved items", e); }
      }
      
      const storedReports = localStorage.getItem('micdrop_saved_reports');
      if (storedReports) {
          try { setSavedReports(JSON.parse(storedReports)); } catch (e) { console.error("Failed to parse saved reports", e); }
      }
  }, []);

  // -- Snippet Logic --
  const toggleSaveItem = (item: Omit<SavedItem, 'id' | 'date'>) => {
      const existingIndex = savedItems.findIndex(i => i.title === item.title && i.content === item.content);
      let newItems: SavedItem[];
      
      if (existingIndex >= 0) {
          newItems = savedItems.filter((_, idx) => idx !== existingIndex);
      } else {
          const newItem: SavedItem = { ...item, id: generateId(), date: new Date().toISOString() };
          newItems = [newItem, ...savedItems];
      }
      setSavedItems(newItems);
      localStorage.setItem('micdrop_saved_items', JSON.stringify(newItems));
  };
  
  const isSaved = (title: string, content: string) => {
      return savedItems.some(i => i.title === title && i.content === content);
  };
  
  const deleteSavedItem = (id: string) => {
      const newItems = savedItems.filter(i => i.id !== id);
      setSavedItems(newItems);
      localStorage.setItem('micdrop_saved_items', JSON.stringify(newItems));
  };

  // -- Report Logic --
  const saveReport = (title: string, type: 'coach' | 'rehearsal', report: PerformanceReport) => {
      const newReport: SavedReport = {
          id: generateId(),
          date: new Date().toISOString(),
          title: title || "Untitled Session",
          type,
          rating: report.rating,
          reportData: report
      };
      const newReports = [newReport, ...savedReports];
      setSavedReports(newReports);
      localStorage.setItem('micdrop_saved_reports', JSON.stringify(newReports));
  };

  const updateSavedReport = (id: string, updates: Partial<SavedReport>) => {
      const newReports = savedReports.map(report => 
          report.id === id ? { ...report, ...updates } : report
      );
      setSavedReports(newReports);
      localStorage.setItem('micdrop_saved_reports', JSON.stringify(newReports));
  };

  const deleteSavedReport = (id: string) => {
      const newReports = savedReports.filter(r => r.id !== id);
      setSavedReports(newReports);
      localStorage.setItem('micdrop_saved_reports', JSON.stringify(newReports));
  };

  const handleNavigate = (view: AppView, mode?: AnalysisMode) => {
      if (mode) setAnalysisMode(mode);
      setCurrentView(view);
  };

  const goHome = (force: boolean = false) => {
      const shouldForce = force === true;
      if (!shouldForce) {
          if (!window.confirm("Are you sure you want to go back? Current progress will be lost.")) return;
      }
      setCurrentView('home');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-cream text-charcoal font-sans">
      {currentView === 'home' && (
          <HomeView onNavigate={handleNavigate} />
      )}
      
      {currentView === 'database' && (
          <DatabaseView 
            savedItems={savedItems} 
            savedReports={savedReports}
            onDeleteSnippet={deleteSavedItem} 
            onDeleteReport={deleteSavedReport}
            onUpdateReport={updateSavedReport}
            onHome={() => setCurrentView('home')} 
            isSaved={isSaved}
            onToggleSave={toggleSaveItem}
          />
      )}
      
      {currentView === 'analysis' && (
          <AnalysisView 
              mode={analysisMode} 
              onHome={goHome} 
              isSaved={isSaved} 
              onToggleSave={toggleSaveItem}
              onSaveReport={saveReport}
          />
      )}
      
      {currentView === 'teleprompter' && (
          <TeleprompterView 
              onHome={goHome} 
              isSaved={isSaved} 
              onToggleSave={toggleSaveItem}
              onSaveReport={saveReport}
          />
      )}
    </div>
  );
};

export default App;
