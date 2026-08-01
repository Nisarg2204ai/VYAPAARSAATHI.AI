import seedDataJson from '../../data/seed.json';

export interface ProductSeed {
  id: string;
  name: string;
  displayName: string;
  price: number;
  unit: string;
}

export interface InvoiceItem {
  qty: number;
  unit?: string;
  item: string;
  price: number;
  total?: number;
  requiresManualEntry?: boolean;
}

export interface OpenInvoice {
  id: string;
  customerName: string;
  customerPhone?: string;
  upiVpa?: string;
  items: InvoiceItem[];
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  date: string;
  dueDate: string;
  status: 'OPEN' | 'PAID' | 'PARTIAL';
}

export interface SampleSms {
  id: string;
  bankFormat: string;
  rawText: string;
  expectedMatchInvoiceId: string;
  expectedBand: 'AUTO_MATCH' | 'ASK_TO_CONFIRM' | 'NO_MATCH';
}

export const SEED_DATA = seedDataJson as {
  products: ProductSeed[];
  openInvoices: OpenInvoice[];
  sampleSmsStrings: SampleSms[];
};

export function getInitialInvoices(): OpenInvoice[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('vyapari_open_invoices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse saved invoices', err);
      }
    }
  }
  return SEED_DATA.openInvoices;
}

export function saveInvoicesToStorage(invoices: OpenInvoice[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vyapari_open_invoices', JSON.stringify(invoices));
  }
}
