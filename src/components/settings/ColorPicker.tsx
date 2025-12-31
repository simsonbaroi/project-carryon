import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  label: string;
  value: string; // HSL format: "160 84% 39%"
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const parseHSL = (hsl: string) => {
    const parts = hsl.split(' ').map(p => parseFloat(p));
    return { h: parts[0] || 0, s: parts[1] || 0, l: parts[2] || 0 };
  };

  const [hsl, setHsl] = useState(parseHSL(value));

  useEffect(() => {
    setHsl(parseHSL(value));
  }, [value]);

  const updateColor = (key: 'h' | 's' | 'l', val: number) => {
    const newHsl = { ...hsl, [key]: val };
    setHsl(newHsl);
    onChange(`${newHsl.h} ${newHsl.s}% ${newHsl.l}%`);
  };

  const previewStyle = {
    backgroundColor: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  };

  return (
    <div className="space-y-3 p-4 rounded-lg bg-surface-light border border-border">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div 
          className="w-8 h-8 rounded-md border border-border shadow-inner"
          style={previewStyle}
        />
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Hue</span>
            <span>{Math.round(hsl.h)}°</span>
          </div>
          <div 
            className="h-3 rounded-full"
            style={{
              background: `linear-gradient(to right, 
                hsl(0, ${hsl.s}%, ${hsl.l}%), 
                hsl(60, ${hsl.s}%, ${hsl.l}%), 
                hsl(120, ${hsl.s}%, ${hsl.l}%), 
                hsl(180, ${hsl.s}%, ${hsl.l}%), 
                hsl(240, ${hsl.s}%, ${hsl.l}%), 
                hsl(300, ${hsl.s}%, ${hsl.l}%), 
                hsl(360, ${hsl.s}%, ${hsl.l}%))`
            }}
          />
          <Slider
            value={[hsl.h]}
            onValueChange={([v]) => updateColor('h', v)}
            max={360}
            step={1}
            className="mt-1"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Saturation</span>
            <span>{Math.round(hsl.s)}%</span>
          </div>
          <div 
            className="h-3 rounded-full"
            style={{
              background: `linear-gradient(to right, 
                hsl(${hsl.h}, 0%, ${hsl.l}%), 
                hsl(${hsl.h}, 100%, ${hsl.l}%))`
            }}
          />
          <Slider
            value={[hsl.s]}
            onValueChange={([v]) => updateColor('s', v)}
            max={100}
            step={1}
            className="mt-1"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Lightness</span>
            <span>{Math.round(hsl.l)}%</span>
          </div>
          <div 
            className="h-3 rounded-full"
            style={{
              background: `linear-gradient(to right, 
                hsl(${hsl.h}, ${hsl.s}%, 0%), 
                hsl(${hsl.h}, ${hsl.s}%, 50%), 
                hsl(${hsl.h}, ${hsl.s}%, 100%))`
            }}
          />
          <Slider
            value={[hsl.l]}
            onValueChange={([v]) => updateColor('l', v)}
            max={100}
            step={1}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
