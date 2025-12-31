export interface InventoryItem {
  id: number;
  name: string;
  price: number | string;
  type?: string;
  category?: string;
  strength?: string;
}

export interface BillItem extends InventoryItem {
  qty: number;
  duration?: number;
  frequency?: number;
  dosePerTime?: number;
  subtotal: number;
}

export type ViewType = 'home' | 'outpatient' | 'inpatient' | 'pricing';

export type CatMode = 'grid' | 'carousel';

export const INPATIENT_CATEGORIES = [
  "Medicine",
  "Laboratory",
  "Blood",
  "Surgery, O.R. & Delivery",
  "Registration Fees",
  "Physical Therapy",
  "Limb and Brace",
  "Food",
  "Halo, O2, NO2, etc.",
  "Orthopedic, S.Roll, etc.",
  "IV.'s",
  "Discharge Medicine",
  "Procedures",
  "Seat & Ad. Fee"
];

export const MEDICINE_TYPES = [
  "Medicine",
  "Service",
  "Injection",
  "Tablet",
  "Capsule",
  "Syrup",
  "Ointment",
  "Solution",
  "Nasal Drops",
  "Eye Drops",
  "Ear Drop",
  "Gel",
  "Inhaler",
  "Mouth Wash",
  "Vaginal Ointment",
  "Medical Supply",
  "IV",
  "Supply"
];

export const DOSE_FREQUENCIES = [
  { value: 1, label: "QD (1/day)" },
  { value: 2, label: "BID (2/day)" },
  { value: 3, label: "TID (3/day)" },
  { value: 4, label: "QID (4/day)" },
];

export const DOSE_ROUTES = ["Tablet", "Capsule", "Injection", "Syrup"];
