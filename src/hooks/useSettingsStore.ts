import { useState, useEffect } from 'react';

export interface NavButton {
  id: string;
  label: string;
  icon: string;
  visible: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  visible: boolean;
  type: 'outpatient' | 'inpatient' | 'both';
}

export interface ColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  destructive: string;
}

export interface AppSettings {
  appName: string;
  appSubtitle: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  navButtons: NavButton[];
  categories: CategoryItem[];
  colors: ColorSettings;
}

const defaultNavButtons: NavButton[] = [
  { id: 'home', label: 'HOME', icon: 'Home', visible: true },
  { id: 'outpatient', label: 'OUTPATIENT', icon: 'UserCheck', visible: true },
  { id: 'inpatient', label: 'INPATIENT', icon: 'BedDouble', visible: true },
  { id: 'pricing', label: 'PRICING', icon: 'Tags', visible: true },
];

const defaultCategories: CategoryItem[] = [
  { id: 'antibiotics', name: 'Antibiotics', icon: 'Pill', visible: true, type: 'both' },
  { id: 'analgesics', name: 'Analgesics', icon: 'Thermometer', visible: true, type: 'both' },
  { id: 'cardiovascular', name: 'Cardiovascular', icon: 'Heart', visible: true, type: 'both' },
  { id: 'respiratory', name: 'Respiratory', icon: 'Wind', visible: true, type: 'both' },
  { id: 'gastrointestinal', name: 'Gastrointestinal', icon: 'Apple', visible: true, type: 'both' },
  { id: 'vitamins', name: 'Vitamins', icon: 'Sparkles', visible: true, type: 'both' },
  { id: 'services', name: 'Services', icon: 'Stethoscope', visible: true, type: 'both' },
  { id: 'lab', name: 'Lab Tests', icon: 'FlaskConical', visible: true, type: 'both' },
];

const defaultColors: ColorSettings = {
  primary: '160 84% 39%',
  secondary: '160 30% 20%',
  accent: '160 60% 45%',
  background: '180 20% 8%',
  foreground: '160 20% 95%',
  muted: '180 15% 15%',
  destructive: '0 62% 50%',
};

const defaultSettings: AppSettings = {
  appName: 'MCH Billing',
  appSubtitle: 'System',
  logoUrl: null,
  faviconUrl: null,
  navButtons: defaultNavButtons,
  categories: defaultCategories,
  colors: defaultColors,
};

export function useSettingsStore() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mch-settings');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('mch-settings', JSON.stringify(settings));
    applyColors(settings.colors);
    applyFavicon(settings.faviconUrl);
  }, [settings]);

  const applyColors = (colors: ColorSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--destructive', colors.destructive);
  };

  const applyFavicon = (url: string | null) => {
    if (url) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = url;
    }
  };

  const updateAppInfo = (appName: string, appSubtitle: string) => {
    setSettings(prev => ({ ...prev, appName, appSubtitle }));
    document.title = `${appName} ${appSubtitle}`;
  };

  const updateLogo = (logoUrl: string | null) => {
    setSettings(prev => ({ ...prev, logoUrl }));
  };

  const updateFavicon = (faviconUrl: string | null) => {
    setSettings(prev => ({ ...prev, faviconUrl }));
  };

  const updateNavButton = (id: string, updates: Partial<NavButton>) => {
    setSettings(prev => ({
      ...prev,
      navButtons: prev.navButtons.map(btn =>
        btn.id === id ? { ...btn, ...updates } : btn
      ),
    }));
  };

  const addNavButton = (button: NavButton) => {
    setSettings(prev => ({
      ...prev,
      navButtons: [...prev.navButtons, button],
    }));
  };

  const removeNavButton = (id: string) => {
    setSettings(prev => ({
      ...prev,
      navButtons: prev.navButtons.filter(btn => btn.id !== id),
    }));
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    }));
  };

  const addCategory = (category: CategoryItem) => {
    setSettings(prev => ({
      ...prev,
      categories: [...prev.categories, category],
    }));
  };

  const removeCategory = (id: string) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== id),
    }));
  };

  const updateColor = (key: keyof ColorSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    document.title = `${defaultSettings.appName} ${defaultSettings.appSubtitle}`;
  };

  return {
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
  };
}
