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
    <header className="bg-background border-b border-border sticky top-0 z-50 pt-3 pb-3 md:pt-5 md:pb-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer min-w-0" 
          onClick={() => window.location.reload()}
        >
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain flex-shrink-0" />
          ) : (
            <Microscope className="w-6 h-6 md:w-8 md:h-8 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))] flex-shrink-0" />
          )}
          <h1 className="text-base md:text-xl font-bold tracking-tight truncate">
            {settings.appName} <span className="font-light text-muted-foreground hidden sm:inline">{settings.appSubtitle}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <button
            onClick={onSettingsClick}
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl border border-border bg-surface-light flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onThemeToggle}
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl border border-border bg-surface-light flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="font-mono font-bold text-primary text-sm md:text-lg hidden sm:block">
            {time}
          </div>
        </div>
      </div>
    </header>
  );
}
