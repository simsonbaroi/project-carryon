import React from 'react';
import { X, Pill } from 'lucide-react';
import { BillItem } from '@/types/billing';

interface MedicineTagsProps {
  bill: BillItem[];
  onRemove: (name: string) => void;
  visible: boolean;
}

export function MedicineTags({ bill, onRemove, visible }: MedicineTagsProps) {
  if (!visible) return null;

  const meds = bill.filter(i => 
    i.category === "Medicine" || i.category === "Discharge Medicine"
  );

  if (meds.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl mb-6 border border-border bg-surface-light">
      <div className="flex items-center gap-2 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
        <Pill className="w-4 h-4 text-primary" />
        ACTIVE MEDS:
      </div>
      <div className="flex flex-wrap gap-2">
        {meds.map((med, idx) => (
          <span key={`${med.name}-${idx}`} className="tag-pill">
            {med.name}
            <X 
              className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-destructive transition-colors" 
              onClick={() => onRemove(med.name)}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
