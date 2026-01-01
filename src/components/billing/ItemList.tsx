import React from 'react';
import { InventoryItem } from '@/types/billing';

interface ItemListProps {
  items: InventoryItem[];
  category: string;
  onItemClick: (category: string, name: string) => void;
}

export function ItemList({ items, category, onItemClick }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground opacity-60 font-semibold">
        NO MATCHES
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 md:gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemClick(category, item.name)}
          className="item-entry animate-fade-in"
        >
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="font-bold text-foreground text-sm md:text-base truncate">
              {item.name}
            </span>
            <span className="text-[9px] md:text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              {item.type || 'Service'}
              {item.strength && ` • ${item.strength}`}
            </span>
          </div>
          <span className="price-label text-sm md:text-base flex-shrink-0">
            <span className="text-sm md:text-base mr-0.5 opacity-80">৳</span>
            {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
          </span>
        </div>
      ))}
    </div>
  );
}
