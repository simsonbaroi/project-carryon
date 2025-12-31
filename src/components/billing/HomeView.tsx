import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ViewType } from '@/types/billing';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="inline-block p-8 rounded-[32px] bg-primary/10 border-2 border-dashed border-primary mb-8 animate-pulse-glow">
        <ShieldCheck className="w-20 h-20 text-primary" />
      </div>
      
      <h2 className="text-4xl font-extrabold tracking-tight mb-4">
        MCH Billing <span className="text-primary">System.</span>
      </h2>
      
      <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-12 font-semibold">
        Authorized Revenue Management Terminal.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onNavigate('outpatient')}
          className="btn-primary min-w-[200px]"
        >
          OUTPATIENT
        </button>
        <button
          onClick={() => onNavigate('inpatient')}
          className="btn-primary min-w-[200px]"
        >
          INPATIENT
        </button>
      </div>
    </div>
  );
}
