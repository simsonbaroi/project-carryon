import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';
import { AppSettings } from '@/hooks/useSettingsStore';

interface AppInfoSettingsProps {
  settings: AppSettings;
  onUpdateAppInfo: (appName: string, appSubtitle: string) => void;
  onUpdateLogo: (logoUrl: string | null) => void;
  onUpdateFavicon: (faviconUrl: string | null) => void;
}

export function AppInfoSettings({
  settings,
  onUpdateAppInfo,
  onUpdateLogo,
  onUpdateFavicon,
}: AppInfoSettingsProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'favicon'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      alert('Please select a PNG or JPG file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === 'logo') {
        onUpdateLogo(dataUrl);
      } else {
        onUpdateFavicon(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Image className="w-5 h-5 text-primary" />
        App Information
      </h3>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="appName">App Name</Label>
          <Input
            id="appName"
            value={settings.appName}
            onChange={(e) => onUpdateAppInfo(e.target.value, settings.appSubtitle)}
            placeholder="MCH Billing"
            className="input-field"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appSubtitle">App Subtitle</Label>
          <Input
            id="appSubtitle"
            value={settings.appSubtitle}
            onChange={(e) => onUpdateAppInfo(settings.appName, e.target.value)}
            placeholder="System"
            className="input-field"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label>Logo (PNG/JPG)</Label>
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <div className="relative">
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="w-16 h-16 object-contain rounded-lg border border-border bg-surface-light"
                />
                <button
                  onClick={() => onUpdateLogo(null)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-surface-light">
                <Image className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => handleFileUpload(e, 'logo')}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Favicon (PNG/JPG)</Label>
          <div className="flex items-center gap-3">
            {settings.faviconUrl ? (
              <div className="relative">
                <img
                  src={settings.faviconUrl}
                  alt="Favicon"
                  className="w-16 h-16 object-contain rounded-lg border border-border bg-surface-light"
                />
                <button
                  onClick={() => onUpdateFavicon(null)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-surface-light">
                <Image className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <input
              ref={faviconInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => handleFileUpload(e, 'favicon')}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => faviconInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
