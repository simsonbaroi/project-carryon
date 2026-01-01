import React from 'react';
import { X, CheckCheck } from 'lucide-react';
import { BillItem } from '@/types/billing';

interface BillSidebarProps {
  title: string;
  bill: BillItem[];
  onRemove: (index: number) => void;
  onReset: () => void;
  onFinalize: () => void;
  sessionInfo?: { label1: string; value1: string; label2: string; value2: string };
}

export function BillSidebar({ 
  title, 
  bill, 
  onRemove, 
  onReset, 
  onFinalize,
  sessionInfo = { label1: 'Patient', value1: '#OP-2025', label2: 'Location', value2: 'BLOCK B' }
}: BillSidebarProps) {
  const total = bill.reduce((sum, item) => sum + item.subtotal, 0);
  const categories = [...new Set(bill.map(i => i.category))].sort();

  return (
    <aside className="sidebar-panel lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] h-auto">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-xs md:text-sm font-black uppercase tracking-widest">{title}</h3>
        <button
          onClick={onReset}
          className="text-[9px] md:text-[10px] font-black text-muted-foreground tracking-widest border border-border px-2 md:px-3 py-1 rounded-md hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
        >
          RESET
        </button>
      </div>

      <div className="session-card">
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] md:text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest">
              {sessionInfo.label1}
            </span>
            <span className="text-[10px] md:text-xs text-foreground font-extrabold">{sessionInfo.value1}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] md:text-[9px] text-muted-foreground font-extrabold uppercase tracking-widest">
              {sessionInfo.label2}
            </span>
            <span className="text-[10px] md:text-xs text-foreground font-extrabold">{sessionInfo.value2}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 max-h-[200px] lg:max-h-none">
        {bill.length === 0 ? (
          <div className="text-center py-8 md:py-12 text-muted-foreground opacity-60 font-semibold text-sm">
            STATEMENT EMPTY
          </div>
        ) : (
          categories.map(cat => {
            const items = bill.filter(i => i.category === cat);
            return (
              <div key={cat} className="mb-3 md:mb-4">
                <span className="block text-[10px] md:text-xs font-extrabold text-primary mb-1.5 md:mb-2">{cat}</span>
                {items.map((item, idx) => {
                  const billIndex = bill.indexOf(item);
                  return (
                    <div key={`${item.name}-${idx}`} className="bill-line">
                      <span className="flex-1 font-bold text-foreground truncate text-sm">
                        {item.name}{' '}
                        <span className="text-[10px] md:text-xs opacity-50 font-normal">x{item.qty}</span>
                      </span>
                      <span className="font-mono font-bold text-primary text-sm">
                        ৳ {item.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <X 
                        className="w-4 h-4 ml-1.5 md:ml-2 text-muted-foreground cursor-pointer hover:text-destructive transition-colors flex-shrink-0"
                        onClick={() => onRemove(billIndex)}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-border pt-4 md:pt-6 mt-3 md:mt-4">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <span className="font-extrabold text-base md:text-lg uppercase">TOTAL</span>
          <span className="font-mono font-bold text-2xl md:text-3xl text-primary">
            ৳ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button onClick={onFinalize} className="btn-primary w-full text-sm md:text-base py-3" disabled={bill.length === 0}>
          <CheckCheck className="w-4 h-4 md:w-5 md:h-5" />
          COMMIT
        </button>
      </div>
    </aside>
  );
}
