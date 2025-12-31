import React from 'react';
import { Search } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBox({ value, onChange, placeholder = "Search..." }: SearchBoxProps) {
  return (
    <div className="search-box">
      <Search className="w-5 h-5 text-primary opacity-80" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-foreground text-lg font-semibold placeholder:text-muted-foreground placeholder:font-medium"
      />
    </div>
  );
}
