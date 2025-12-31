import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation, Plus, Trash2, GripVertical } from 'lucide-react';
import { NavButton } from '@/hooks/useSettingsStore';

const AVAILABLE_ICONS = [
  'Home', 'UserCheck', 'BedDouble', 'Tags', 'Settings', 'Users', 
  'ClipboardList', 'Calendar', 'FileText', 'BarChart', 'Package',
  'CreditCard', 'Bell', 'Search', 'Filter', 'Download', 'Upload'
];

interface NavButtonSettingsProps {
  navButtons: NavButton[];
  onUpdate: (id: string, updates: Partial<NavButton>) => void;
  onAdd: (button: NavButton) => void;
  onRemove: (id: string) => void;
}

export function NavButtonSettings({
  navButtons,
  onUpdate,
  onAdd,
  onRemove,
}: NavButtonSettingsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newButton, setNewButton] = useState({ label: '', icon: 'Home' });

  const handleAddButton = () => {
    if (!newButton.label.trim()) return;
    
    const id = newButton.label.toLowerCase().replace(/\s+/g, '-');
    onAdd({
      id,
      label: newButton.label.toUpperCase(),
      icon: newButton.icon,
      visible: true,
    });
    setNewButton({ label: '', icon: 'Home' });
    setShowAddForm(false);
  };

  const coreButtons = ['home', 'outpatient', 'inpatient', 'pricing'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" />
          Navigation Buttons
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Button
        </Button>
      </div>

      {showAddForm && (
        <div className="p-4 rounded-lg bg-surface-light border border-border space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Button Label</Label>
              <Input
                value={newButton.label}
                onChange={(e) => setNewButton(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., Reports"
                className="input-field"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select
                value={newButton.icon}
                onValueChange={(v) => setNewButton(prev => ({ ...prev, icon: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ICONS.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddButton}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {navButtons.map((button) => (
          <div
            key={button.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-surface-light border border-border"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
            
            <div className="flex-1 grid sm:grid-cols-3 gap-3">
              <Input
                value={button.label}
                onChange={(e) => onUpdate(button.id, { label: e.target.value.toUpperCase() })}
                className="input-field text-sm"
              />
              <Select
                value={button.icon}
                onValueChange={(v) => onUpdate(button.id, { icon: v })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ICONS.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={button.visible}
                    onCheckedChange={(v) => onUpdate(button.id, { visible: v })}
                  />
                  <span className="text-sm text-muted-foreground">Visible</span>
                </div>
                {!coreButtons.includes(button.id) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onRemove(button.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
