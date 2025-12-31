import React from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './ColorPicker';
import { ColorSettings as ColorSettingsType } from '@/hooks/useSettingsStore';

interface ColorSettingsProps {
  colors: ColorSettingsType;
  onUpdateColor: (key: keyof ColorSettingsType, value: string) => void;
  onReset: () => void;
}

const COLOR_LABELS: Record<keyof ColorSettingsType, string> = {
  primary: 'Primary (Main Brand)',
  secondary: 'Secondary',
  accent: 'Accent',
  background: 'Background',
  foreground: 'Text/Foreground',
  muted: 'Muted/Subtle',
  destructive: 'Destructive/Error',
};

export function ColorSettings({ colors, onUpdateColor, onReset }: ColorSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Color Theme
        </h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Colors
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(colors) as Array<keyof ColorSettingsType>).map((key) => (
          <ColorPicker
            key={key}
            label={COLOR_LABELS[key]}
            value={colors[key]}
            onChange={(value) => onUpdateColor(key, value)}
          />
        ))}
      </div>

      <div className="p-4 rounded-lg bg-surface-light border border-border">
        <h4 className="text-sm font-medium mb-3">Preview</h4>
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
            Primary Button
          </div>
          <div className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">
            Secondary
          </div>
          <div className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm">
            Accent
          </div>
          <div className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm">
            Muted
          </div>
          <div className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm">
            Destructive
          </div>
        </div>
      </div>
    </div>
  );
}
