import React from 'react';
import { cn } from '@/lib/utils';
import { InventoryItem } from '@/types/billing';

interface CategoryGridProps {
  categories: string[];
  inventory: Record<string, InventoryItem[]>;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function CategoryGrid({ categories, inventory, selectedIndex, onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
      {categories.map((cat, idx) => (
        <div
          key={cat}
          onClick={() => onSelect(idx)}
          className={cn('cat-card', selectedIndex === idx && 'active')}
        >
          <span className="block font-extrabold text-foreground text-sm tracking-tight">
            {cat}
          </span>
          <span className="block text-[10px] text-muted-foreground font-semibold mt-2 uppercase tracking-wider">
            {inventory[cat]?.length || 0} ITEMS
          </span>
        </div>
      ))}
    </div>
  );
}
