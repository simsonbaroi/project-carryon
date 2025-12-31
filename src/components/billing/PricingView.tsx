import React, { useState, useMemo, useRef } from 'react';
import { Tags, Upload, Download, Plus, Edit, Trash2 } from 'lucide-react';
import { SearchBox } from './SearchBox';
import { InventoryItem, MEDICINE_TYPES } from '@/types/billing';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PricingViewProps {
  inventory: Record<string, InventoryItem[]>;
  categories: string[];
  onAdd: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdate: (item: InventoryItem, oldCategory?: string) => void;
  onDelete: (item: InventoryItem) => void;
  onExport: () => void;
  onImport: (data: InventoryItem[]) => void;
}

export function PricingView({
  inventory,
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onExport,
  onImport
}: PricingViewProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formType, setFormType] = useState('Medicine');

  const allCategories = useMemo(() => {
    const cats = new Set(Object.keys(inventory));
    return Array.from(cats).sort();
  }, [inventory]);

  const filteredItems = useMemo(() => {
    const flat: InventoryItem[] = [];
    Object.entries(inventory).forEach(([cat, items]) => {
      items.forEach(item => {
        if (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          flat.push({ ...item, category: cat });
        }
      });
    });
    return flat;
  }, [inventory, searchQuery]);

  const openAddModal = () => {
    setEditItem(null);
    setFormName('');
    setFormCategory(allCategories[0] || 'General');
    setFormPrice('');
    setFormType('Medicine');
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditItem(item);
    setFormName(item.name);
    setFormCategory(item.category || 'General');
    setFormPrice(String(item.price).replace(/[^\d.]/g, ''));
    setFormType(item.type || 'Medicine');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || isNaN(parseFloat(formPrice)) || parseFloat(formPrice) < 0) {
      toast({
        title: "Input Error",
        description: "Please provide a valid name and non-negative price.",
        variant: "destructive"
      });
      return;
    }

    if (editItem) {
      const oldCategory = editItem.category;
      onUpdate({
        ...editItem,
        name: formName,
        category: formCategory,
        price: parseFloat(formPrice),
        type: formType
      }, oldCategory);
      toast({ title: "RECORD UPDATED" });
    } else {
      onAdd({
        name: formName,
        category: formCategory,
        price: parseFloat(formPrice),
        type: formType
      });
      toast({ title: "RECORD ADDED" });
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteItem) {
      onDelete(deleteItem);
      toast({ title: "DELETED!", description: `"${deleteItem.name}" has been removed.` });
      setDeleteItem(null);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast({
        title: "Invalid file type",
        description: "Please select a .json file.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!Array.isArray(data) || data.some(item => !item.name || item.price === undefined)) {
          throw new Error('Invalid JSON structure');
        }
        onImport(data);
        toast({ title: "Import Successful!", description: "Your pricing database has been updated." });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Could not process file. Invalid JSON format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Tags className="w-10 h-10 text-accent" />
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Pricing</h2>
            <span className="text-xl font-normal text-muted-foreground">Database</span>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
          <button onClick={handleImportClick} className="btn-primary text-xs py-3 px-4">
            <Upload className="w-4 h-4" />
            IMPORT
          </button>
          <button onClick={onExport} className="btn-primary text-xs py-3 px-4">
            <Download className="w-4 h-4" />
            EXPORT
          </button>
          <button onClick={openAddModal} className="btn-primary text-xs py-3 px-4">
            <Plus className="w-4 h-4" />
            ADD
          </button>
        </div>
      </div>

      <SearchBox
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Filter records..."
      />

      <div className="flex flex-col gap-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground opacity-60 font-semibold">
            No records matching "{searchQuery}"
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="item-entry">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-foreground text-base">{item.name}</span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  {item.category || 'N/A'} • {item.type || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="price-label">
                  <span className="text-base mr-0.5 opacity-80">৳</span>
                  {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                </span>
                <Edit
                  className="icon-action edit"
                  onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                />
                <Trash2
                  className="icon-action delete"
                  onClick={(e) => { e.stopPropagation(); setDeleteItem(item); }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-primary font-extrabold uppercase tracking-widest">
              {editItem ? 'EDIT DATABASE RECORD' : 'ADD NEW DATABASE RECORD'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-extrabold text-muted-foreground mb-2 uppercase">
                NAME/DESCRIPTION
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-muted-foreground mb-2 uppercase">
                GROUP CATEGORY
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="input-field"
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-muted-foreground mb-2 uppercase">
                  UNIT RATE
                </label>
                <input
                  type="number"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="input-field"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-muted-foreground mb-2 uppercase">
                  MODALITY
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="input-field"
                >
                  {MEDICINE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary w-full mt-4">
              SAVE TO MASTER
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">DELETE RECORD?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.name}" from {deleteItem?.category || 'N/A'}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-secondary-foreground border-border">
              CANCEL
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              YES, DELETE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
