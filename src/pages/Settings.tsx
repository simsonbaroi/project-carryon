import React from 'react';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppInfoSettings } from '@/components/settings/AppInfoSettings';
import { NavButtonSettings } from '@/components/settings/NavButtonSettings';
import { CategorySettings } from '@/components/settings/CategorySettings';
import { ColorSettings } from '@/components/settings/ColorSettings';
import { useSettingsStore } from '@/hooks/useSettingsStore';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const {
    settings,
    updateAppInfo,
    updateLogo,
    updateFavicon,
    updateNavButton,
    addNavButton,
    removeNavButton,
    updateCategory,
    addCategory,
    removeCategory,
    updateColor,
    resetToDefaults,
  } = useSettingsStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-border sticky top-0 z-50 py-4">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-65px)]">
        <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          <div className="card-panel p-6">
            <AppInfoSettings
              settings={settings}
              onUpdateAppInfo={updateAppInfo}
              onUpdateLogo={updateLogo}
              onUpdateFavicon={updateFavicon}
            />
          </div>

          <Separator />

          <div className="card-panel p-6">
            <NavButtonSettings
              navButtons={settings.navButtons}
              onUpdate={updateNavButton}
              onAdd={addNavButton}
              onRemove={removeNavButton}
            />
          </div>

          <Separator />

          <div className="card-panel p-6">
            <CategorySettings
              categories={settings.categories}
              onUpdate={updateCategory}
              onAdd={addCategory}
              onRemove={removeCategory}
            />
          </div>

          <Separator />

          <div className="card-panel p-6">
            <ColorSettings
              colors={settings.colors}
              onUpdateColor={updateColor}
              onReset={resetToDefaults}
            />
          </div>

          <div className="pb-8" />
        </main>
      </ScrollArea>
    </div>
  );
}
