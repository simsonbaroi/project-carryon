import { useState, useEffect, useCallback } from 'react';
import { InventoryItem, BillItem, INPATIENT_CATEGORIES } from '@/types/billing';

export function useBillingStore() {
  const [inventory, setInventory] = useState<Record<string, InventoryItem[]>>({});
  const [bill, setBill] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextItemId, setNextItemId] = useState(1);

  const loadInitialData = useCallback(async () => {
    try {
      const res = await fetch('/med.json');
      if (res.ok) {
        const data = await res.json();
        const newInventory: Record<string, InventoryItem[]> = {};
        let maxId = 1;

        data.forEach((item: InventoryItem) => {
          const cat = item.category || "General";
          if (!newInventory[cat]) newInventory[cat] = [];
          if (typeof item.id === 'number' && item.id >= maxId) {
            maxId = item.id + 1;
          }
          newInventory[cat].push(item);
        });

        // Ensure all inpatient categories exist
        INPATIENT_CATEGORIES.forEach(c => {
          if (!newInventory[c]) newInventory[c] = [];
        });

        setInventory(newInventory);
        setNextItemId(maxId);
      }
    } catch (e) {
      console.warn("Load error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const outpatientCategories = Object.keys(inventory).sort();
  const inpatientCategories = INPATIENT_CATEGORIES;

  const addToBill = useCallback((item: BillItem) => {
    setBill(prev => [...prev, item]);
  }, []);

  const removeFromBill = useCallback((index: number) => {
    setBill(prev => prev.filter((_, i) => i !== index));
  }, []);

  const removeByName = useCallback((name: string) => {
    setBill(prev => {
      const idx = prev.findIndex(i => i.name === name);
      if (idx > -1) {
        return prev.filter((_, i) => i !== idx);
      }
      return prev;
    });
  }, []);

  const clearBill = useCallback(() => {
    setBill([]);
  }, []);

  const getBillTotal = useCallback(() => {
    return bill.reduce((sum, item) => sum + item.subtotal, 0);
  }, [bill]);

  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...item, id: nextItemId };
    setNextItemId(prev => prev + 1);
    
    setInventory(prev => {
      const cat = item.category || "General";
      return {
        ...prev,
        [cat]: [...(prev[cat] || []), newItem]
      };
    });

    return newItem;
  }, [nextItemId]);

  const updateInventoryItem = useCallback((item: InventoryItem, oldCategory?: string) => {
    setInventory(prev => {
      const newInventory = { ...prev };
      
      // Remove from old category if it changed
      if (oldCategory && oldCategory !== item.category) {
        newInventory[oldCategory] = (newInventory[oldCategory] || []).filter(i => i.id !== item.id);
        if (newInventory[oldCategory].length === 0) {
          delete newInventory[oldCategory];
        }
      }

      const cat = item.category || "General";
      if (!newInventory[cat]) {
        newInventory[cat] = [];
      }

      const existingIdx = newInventory[cat].findIndex(i => i.id === item.id);
      if (existingIdx > -1) {
        newInventory[cat][existingIdx] = item;
      } else {
        newInventory[cat].push(item);
      }

      return newInventory;
    });
  }, []);

  const deleteInventoryItem = useCallback((item: InventoryItem) => {
    setInventory(prev => {
      const cat = item.category || "General";
      const newCategoryItems = (prev[cat] || []).filter(i => i.id !== item.id);
      
      if (newCategoryItems.length === 0) {
        const { [cat]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [cat]: newCategoryItems
      };
    });
  }, []);

  const exportDatabase = useCallback(() => {
    const data = JSON.stringify(Object.values(inventory).flat(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mch_db_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [inventory]);

  const importDatabase = useCallback((data: InventoryItem[]) => {
    const newInventory: Record<string, InventoryItem[]> = {};
    let maxId = 1;

    data.forEach(item => {
      const cat = item.category || "General";
      if (!newInventory[cat]) newInventory[cat] = [];
      if (item.id === undefined || item.id === null) {
        item.id = maxId++;
      } else if (item.id >= maxId) {
        maxId = item.id + 1;
      }
      newInventory[cat].push(item);
    });

    setInventory(newInventory);
    setNextItemId(maxId);
  }, []);

  return {
    inventory,
    bill,
    loading,
    outpatientCategories,
    inpatientCategories,
    addToBill,
    removeFromBill,
    removeByName,
    clearBill,
    getBillTotal,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    exportDatabase,
    importDatabase,
  };
}
