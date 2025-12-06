
import React, { useState, useEffect } from 'react';
import { SavedItem } from './types';
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
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  // Load saved items from localStorage on mount
  useEffect(() => {
      const stored = localStorage.getItem('micdrop_saved_items');
      if (stored) {
          try {
              setSavedItems(JSON.parse(stored));
          } catch (e) {
              console.error("Failed to parse saved items", e);
          }
      }
  }, []);

  // -- Database Logic (Shared) --
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

  const handleNavigate = (view: AppView, mode?: AnalysisMode) => {
      if (mode) setAnalysisMode(mode);
      setCurrentView(view);
  };

  const goHome = (force: boolean = false) => {
      if (!force) {
          if (!confirm("Are you sure you want to go back? Current progress will be lost.")) return;
      }
      setCurrentView('home');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-cream text-charcoal font-sans">
      {currentView === 'home' && (
          <HomeView onNavigate={handleNavigate} />
      )}
      
      {currentView === 'database' && (
          <DatabaseView savedItems={savedItems} onDelete={deleteSavedItem} onHome={() => setCurrentView('home')} />
      )}
      
      {currentView === 'analysis' && (
          <AnalysisView 
              mode={analysisMode} 
              onHome={goHome} 
              isSaved={isSaved} 
              onToggleSave={toggleSaveItem} 
          />
      )}
      
      {currentView === 'teleprompter' && (
          <TeleprompterView 
              onHome={goHome} 
              isSaved={isSaved} 
              onToggleSave={toggleSaveItem}
          />
      )}
    </div>
  );
};

export default App;
