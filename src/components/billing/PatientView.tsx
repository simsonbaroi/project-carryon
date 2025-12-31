import React, { useState, useMemo } from 'react';
import { CategoryGrid } from './CategoryGrid';
import { CategoryCarousel } from './CategoryCarousel';
import { SearchBox } from './SearchBox';
import { ItemList } from './ItemList';
import { DosagePanel } from './DosagePanel';
import { MedicineTags } from './MedicineTags';
import { BillSidebar } from './BillSidebar';
import { InventoryItem, BillItem, CatMode } from '@/types/billing';
import { useToast } from '@/hooks/use-toast';

interface PatientViewProps {
  type: 'outpatient' | 'inpatient';
  categories: string[];
  inventory: Record<string, InventoryItem[]>;
  bill: BillItem[];
  onAddToBill: (item: BillItem) => void;
  onRemoveFromBill: (index: number) => void;
  onRemoveByName: (name: string) => void;
  onClearBill: () => void;
}

export function PatientView({
  type,
  categories,
  inventory,
  bill,
  onAddToBill,
  onRemoveFromBill,
  onRemoveByName,
  onClearBill
}: PatientViewProps) {
  const { toast } = useToast();
  const [catMode, setCatMode] = useState<CatMode>('grid');
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDosageItem, setActiveDosageItem] = useState<InventoryItem | null>(null);

  const currentCategory = categories[selectedCatIndex] || '';
  const showMedicineTags = currentCategory === 'Medicine' || currentCategory === 'Discharge Medicine';

  const filteredItems = useMemo(() => {
    const items = inventory[currentCategory] || [];
    if (!searchQuery) return items;
    return items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [inventory, currentCategory, searchQuery]);

  const handleSelectCategory = (index: number) => {
    setSelectedCatIndex(index);
    setCatMode('carousel');
    setActiveDosageItem(null);
    setSearchQuery('');
  };

  const handlePrevCategory = () => {
    setSelectedCatIndex(prev => (prev - 1 + categories.length) % categories.length);
  };

  const handleNextCategory = () => {
    setSelectedCatIndex(prev => (prev + 1) % categories.length);
  };

  const handleGridView = () => {
    setCatMode('grid');
    setActiveDosageItem(null);
  };

  const handleItemClick = (category: string, name: string) => {
    const item = inventory[category]?.find(i => i.name === name);
    if (item) {
      setActiveDosageItem({ ...item, category });
    }
  };

  const handleCloseDosage = () => {
    setActiveDosageItem(null);
  };

  const handleAddDosage = (item: InventoryItem, qty: number, subtotal: number) => {
    onAddToBill({
      ...item,
      qty,
      subtotal
    } as BillItem);
    
    toast({
      title: "ADDED TO STATEMENT",
      description: `${item.name} x${qty}`,
    });
    
    setActiveDosageItem(null);
  };

  const handleFinalize = () => {
    if (bill.length === 0) return;
    
    toast({
      title: "COMMITTED TO SERVER",
      description: `Total: ৳ ${bill.reduce((s, i) => s + i.subtotal, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    });
    
    onClearBill();
  };

  const sessionInfo = type === 'outpatient' 
    ? { label1: 'Patient', value1: '#OP-2025', label2: 'Location', value2: 'BLOCK B' }
    : { label1: 'Ward', value1: 'ACTIVE', label2: 'Priority', value2: 'STANDARD' };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight">
          {type === 'outpatient' ? 'OUTPATIENT' : 'INPATIENT'}{' '}
          <span className="font-light text-muted-foreground">
            {type === 'outpatient' ? 'TERMINAL' : 'CARE'}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div>
          {catMode === 'grid' ? (
            <CategoryGrid
              categories={categories}
              inventory={inventory}
              selectedIndex={selectedCatIndex}
              onSelect={handleSelectCategory}
            />
          ) : (
            <CategoryCarousel
              categories={categories}
              inventory={inventory}
              currentIndex={selectedCatIndex}
              onPrev={handlePrevCategory}
              onNext={handleNextCategory}
              onGridView={handleGridView}
            />
          )}

          {catMode === 'carousel' && (
            <>
              {activeDosageItem && (
                <DosagePanel
                  item={activeDosageItem}
                  onClose={handleCloseDosage}
                  onAdd={handleAddDosage}
                />
              )}

              <MedicineTags
                bill={bill}
                onRemove={onRemoveByName}
                visible={showMedicineTags}
              />

              <SearchBox
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search item codes..."
              />

              <ItemList
                items={filteredItems}
                category={currentCategory}
                onItemClick={handleItemClick}
              />
            </>
          )}
        </div>

        <BillSidebar
          title={type === 'outpatient' ? 'Statement' : 'Record'}
          bill={bill}
          onRemove={onRemoveFromBill}
          onReset={onClearBill}
          onFinalize={handleFinalize}
          sessionInfo={sessionInfo}
        />
      </div>
    </div>
  );
}
