import React from 'react';
import { Home, UserCheck, BedDouble, Tags } from 'lucide-react';
import { ViewType } from '@/types/billing';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems = [
  { id: 'home' as ViewType, label: 'HOME', icon: Home },
  { id: 'outpatient' as ViewType, label: 'OUTPATIENT', icon: UserCheck },
  { id: 'inpatient' as ViewType, label: 'INPATIENT', icon: BedDouble },
  { id: 'pricing' as ViewType, label: 'PRICING', icon: Tags },
];

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-6">
      <nav className="nav-pill">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn('nav-btn', currentView === item.id && 'active')}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
