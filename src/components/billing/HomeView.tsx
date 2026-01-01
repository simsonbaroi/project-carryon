import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ViewType } from '@/types/billing';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="text-center py-12 md:py-20 px-4 animate-fade-in">
      <div className="inline-block p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-primary/10 border-2 border-dashed border-primary mb-6 md:mb-8 animate-pulse-glow">
        <ShieldCheck className="w-14 h-14 md:w-20 md:h-20 text-primary" />
      </div>
      
      <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3 md:mb-4">
        MCH Billing <span className="text-primary">System.</span>
      </h2>
      
      <p className="text-sm md:text-lg text-muted-foreground max-w-lg mx-auto mb-8 md:mb-12 font-semibold">
        Authorized Revenue Management Terminal.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
        <button
          onClick={() => onNavigate('outpatient')}
          className="btn-primary min-w-[160px] md:min-w-[200px] text-sm md:text-base py-3 md:py-4"
        >
          OUTPATIENT
        </button>
        <button
          onClick={() => onNavigate('inpatient')}
          className="btn-primary min-w-[160px] md:min-w-[200px] text-sm md:text-base py-3 md:py-4"
        >
          INPATIENT
        </button>
      </div>
    </div>
  );
}
