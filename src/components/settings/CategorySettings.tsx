import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, Plus, Trash2, Pill, Heart, Wind, Apple, Sparkles, Stethoscope, FlaskConical, Thermometer, Syringe, Eye, Brain, Bone } from 'lucide-react';
import { CategoryItem } from '@/hooks/useSettingsStore';

const CATEGORY_ICONS = [
  { name: 'Pill', icon: Pill },
  { name: 'Heart', icon: Heart },
  { name: 'Wind', icon: Wind },
  { name: 'Apple', icon: Apple },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Stethoscope', icon: Stethoscope },
  { name: 'FlaskConical', icon: FlaskConical },
  { name: 'Thermometer', icon: Thermometer },
  { name: 'Syringe', icon: Syringe },
  { name: 'Eye', icon: Eye },
  { name: 'Brain', icon: Brain },
  { name: 'Bone', icon: Bone },
];

interface CategorySettingsProps {
  categories: CategoryItem[];
  onUpdate: (id: string, updates: Partial<CategoryItem>) => void;
  onAdd: (category: CategoryItem) => void;
  onRemove: (id: string) => void;
}

export function CategorySettings({
  categories,
  onUpdate,
  onAdd,
  onRemove,
}: CategorySettingsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    icon: 'Pill', 
    type: 'both' as 'outpatient' | 'inpatient' | 'both' 
  });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const id = newCategory.name.toLowerCase().replace(/\s+/g, '-');
    onAdd({
      id,
      name: newCategory.name,
      icon: newCategory.icon,
      visible: true,
      type: newCategory.type,
    });
    setNewCategory({ name: '', icon: 'Pill', type: 'both' });
    setShowAddForm(false);
  };

  const filterByType = (type: string) => {
    if (type === 'all') return categories;
    return categories.filter(c => c.type === type || c.type === 'both');
  };

  const renderCategoryList = (filteredCategories: CategoryItem[]) => (
    <div className="space-y-3">
      {filteredCategories.map((category) => {
        const IconComponent = CATEGORY_ICONS.find(i => i.name === category.icon)?.icon || Pill;
        return (
          <div
            key={category.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-surface-light border border-border"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex-1 grid sm:grid-cols-3 gap-3">
              <Input
                value={category.name}
                onChange={(e) => onUpdate(category.id, { name: e.target.value })}
                className="input-field text-sm"
              />
              <Select
                value={category.icon}
                onValueChange={(v) => onUpdate(category.id, { icon: v })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_ICONS.map(({ name }) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={category.type}
                onValueChange={(v) => onUpdate(category.id, { type: v as CategoryItem['type'] })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both</SelectItem>
                  <SelectItem value="outpatient">Outpatient Only</SelectItem>
                  <SelectItem value="inpatient">Inpatient Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={category.visible}
                onCheckedChange={(v) => onUpdate(category.id, { visible: v })}
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => onRemove(category.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" />
          Categories
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showAddForm && (
        <div className="p-4 rounded-lg bg-surface-light border border-border space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Dermatology"
                className="input-field"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select
                value={newCategory.icon}
                onValueChange={(v) => setNewCategory(prev => ({ ...prev, icon: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_ICONS.map(({ name }) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Available In</Label>
              <Select
                value={newCategory.type}
                onValueChange={(v) => setNewCategory(prev => ({ ...prev, type: v as CategoryItem['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both</SelectItem>
                  <SelectItem value="outpatient">Outpatient Only</SelectItem>
                  <SelectItem value="inpatient">Inpatient Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddCategory}>
              Add Category
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({categories.length})</TabsTrigger>
          <TabsTrigger value="outpatient">Outpatient</TabsTrigger>
          <TabsTrigger value="inpatient">Inpatient</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {renderCategoryList(filterByType('all'))}
        </TabsContent>
        <TabsContent value="outpatient" className="mt-4">
          {renderCategoryList(filterByType('outpatient'))}
        </TabsContent>
        <TabsContent value="inpatient" className="mt-4">
          {renderCategoryList(filterByType('inpatient'))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
