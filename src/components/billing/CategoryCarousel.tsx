import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { InventoryItem } from '@/types/billing';

interface CategoryCarouselProps {
  categories: string[];
  inventory: Record<string, InventoryItem[]>;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onGridView: () => void;
}

export function CategoryCarousel({
  categories,
  inventory,
  currentIndex,
  onPrev,
  onNext,
  onGridView
}: CategoryCarouselProps) {
  const currentCat = categories[currentIndex] || '---';
  const itemCount = inventory[currentCat]?.length || 0;
  
  const touchStartX = useRef<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    setSwipeOffset(Math.max(-50, Math.min(50, diff * 0.3)));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    
    if (diff > threshold) {
      onPrev();
    } else if (diff < -threshold) {
      onNext();
    }
    
    touchStartX.current = null;
    setSwipeOffset(0);
  };

  return (
    <div 
      className="carousel-view animate-fade-in touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex items-center justify-between gap-4 transition-transform duration-150"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        <button onClick={onPrev} className="caro-arrow">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex-1 text-center select-none">
          <h4 className="font-black text-primary text-xl uppercase tracking-widest">
            {currentCat}
          </h4>
          <p className="text-muted-foreground font-bold text-xs mt-1">
            {itemCount} indexed items
          </p>
          <button
            onClick={onGridView}
            className="btn-primary mt-4 text-xs py-1.5 px-4 mx-auto"
          >
            GRID VIEW
          </button>
        </div>
        
        <button onClick={onNext} className="caro-arrow">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
