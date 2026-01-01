import React, { useState } from 'react';
import { Header } from '@/components/billing/Header';
import { Navigation } from '@/components/billing/Navigation';
import { HomeView } from '@/components/billing/HomeView';
import { PatientView } from '@/components/billing/PatientView';
import { PricingView } from '@/components/billing/PricingView';
import { Settings } from '@/pages/Settings';
import { useBillingStore } from '@/hooks/useBillingStore';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { ViewType } from '@/types/billing';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [showSettings, setShowSettings] = useState(false);
  const { settings } = useSettingsStore();

  const {
    inventory,
    bill,
    loading,
    outpatientCategories,
    inpatientCategories,
    addToBill,
    removeFromBill,
    removeByName,
    clearBill,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    exportDatabase,
    importDatabase,
  } = useBillingStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-semibold">Loading System...</p>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        theme={theme} 
        onThemeToggle={toggleTheme} 
        onSettingsClick={() => setShowSettings(true)}
        settings={settings}
      />
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-8 md:pb-12">
        {currentView === 'home' && (
          <HomeView onNavigate={setCurrentView} />
        )}

        {currentView === 'outpatient' && (
          <PatientView
            type="outpatient"
            categories={outpatientCategories}
            inventory={inventory}
            bill={bill}
            onAddToBill={addToBill}
            onRemoveFromBill={removeFromBill}
            onRemoveByName={removeByName}
            onClearBill={clearBill}
          />
        )}

        {currentView === 'inpatient' && (
          <PatientView
            type="inpatient"
            categories={inpatientCategories}
            inventory={inventory}
            bill={bill}
            onAddToBill={addToBill}
            onRemoveFromBill={removeFromBill}
            onRemoveByName={removeByName}
            onClearBill={clearBill}
          />
        )}

        {currentView === 'pricing' && (
          <PricingView
            inventory={inventory}
            categories={outpatientCategories}
            onAdd={addInventoryItem}
            onUpdate={updateInventoryItem}
            onDelete={deleteInventoryItem}
            onExport={exportDatabase}
            onImport={importDatabase}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
