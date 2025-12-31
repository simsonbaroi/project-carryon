import React, { useState, useEffect } from 'react';
import { X, PlusCircle, FlaskConical } from 'lucide-react';
import { InventoryItem, DOSE_FREQUENCIES, DOSE_ROUTES } from '@/types/billing';

interface DosagePanelProps {
  item: InventoryItem | null;
  onClose: () => void;
  onAdd: (item: InventoryItem, qty: number, subtotal: number) => void;
}

export function DosagePanel({ item, onClose, onAdd }: DosagePanelProps) {
  const [doseQty, setDoseQty] = useState('1.0');
  const [doseType, setDoseType] = useState('Tablet');
  const [doseFreq, setDoseFreq] = useState('3');
  const [doseDays, setDoseDays] = useState('7');
  const [serviceQty, setServiceQty] = useState('1');

  // Determine if it's a medicine type
  const isMedicine = item && (
    item.category === 'Medicine' || 
    item.category === 'Discharge Medicine' ||
    ['Injection', 'Tablet', 'Capsule', 'Syrup'].includes(item.type || '')
  );

  useEffect(() => {
    if (item) {
      setDoseType(item.type || 'Tablet');
      setDoseQty('1.0');
      setDoseFreq('3');
      setDoseDays('7');
      setServiceQty('1');
    }
  }, [item]);

  if (!item) return null;

  const calculateTotal = () => {
    const price = typeof item.price === 'number' 
      ? item.price 
      : parseFloat(String(item.price).replace(/[^\d.]/g, '') || '0');

    if (isMedicine) {
      const qty = parseFloat(doseQty) || 0;
      const freq = parseFloat(doseFreq) || 0;
      const days = parseInt(doseDays) || 0;
      return qty * freq * days * price;
    } else {
      return (parseFloat(serviceQty) || 1) * price;
    }
  };

  const getTotalQty = () => {
    if (isMedicine) {
      const qty = parseFloat(doseQty) || 0;
      const freq = parseFloat(doseFreq) || 0;
      const days = parseInt(doseDays) || 0;
      return qty * freq * days;
    }
    return parseFloat(serviceQty) || 1;
  };

  const total = calculateTotal();

  const handleAdd = () => {
    onAdd(item, getTotalQty(), total);
  };

  return (
    <div className="dosage-panel animate-fade-in">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
        <h4 className="font-extrabold text-lg text-foreground flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          COMMIT: <span className="text-primary">{item.name}</span>
        </h4>
        <X 
          className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
          onClick={onClose}
        />
      </div>

      {isMedicine ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-extrabold text-muted-foreground mb-2 uppercase tracking-widest">
              Dose Qty
            </label>
            <input
              type="text"
              value={doseQty}
              onChange={(e) => setDoseQty(e.target.value)}
              className="input-field"
              placeholder="1.0"
            />
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-muted-foreground mb-2 uppercase tracking-widest">
              Route
            </label>
            <select
              value={doseType}
              onChange={(e) => setDoseType(e.target.value)}
              className="input-field"
            >
              {DOSE_ROUTES.map(route => (
                <option key={route} value={route}>{route}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-muted-foreground mb-2 uppercase tracking-widest">
              Frequency
            </label>
            <select
              value={doseFreq}
              onChange={(e) => setDoseFreq(e.target.value)}
              className="input-field"
            >
              {DOSE_FREQUENCIES.map(freq => (
                <option key={freq.value} value={freq.value}>{freq.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-muted-foreground mb-2 uppercase tracking-widest">
              Days
            </label>
            <input
              type="number"
              value={doseDays}
              onChange={(e) => setDoseDays(e.target.value)}
              className="input-field"
              min="1"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-extrabold text-muted-foreground mb-2 uppercase tracking-widest">
              Units Required
            </label>
            <input
              type="number"
              value={serviceQty}
              onChange={(e) => setServiceQty(e.target.value)}
              className="input-field"
              min="1"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-border gap-4">
        <div className="font-mono font-bold text-4xl text-primary">
          ৳ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <button onClick={handleAdd} className="btn-primary w-full sm:w-auto">
          <PlusCircle className="w-5 h-5" />
          ADD TO STATEMENT
        </button>
      </div>
    </div>
  );
}
