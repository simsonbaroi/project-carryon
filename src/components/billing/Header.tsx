import React from 'react';
import { Microscope, Sun, Moon, Settings } from 'lucide-react';
import { useClock } from '@/hooks/useClock';
import { AppSettings } from '@/hooks/useSettingsStore';

interface HeaderProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onSettingsClick: () => void;
  settings: AppSettings;
}

export function Header({ theme, onThemeToggle, onSettingsClick, settings }: HeaderProps) {
  const time = useClock();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 pt-5 pb-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => window.location.reload()}
        >
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
          ) : (
            <Microscope className="w-8 h-8 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
          )}
          <h1 className="text-xl font-bold tracking-tight">
            {settings.appName} <span className="font-light text-muted-foreground">{settings.appSubtitle}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSettingsClick}
            className="w-10 h-10 rounded-xl border border-border bg-surface-light flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onThemeToggle}
            className="w-10 h-10 rounded-xl border border-border bg-surface-light flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="font-mono font-bold text-primary text-lg">
            {time}
          </div>
        </div>
      </div>
    </header>
  );
}
