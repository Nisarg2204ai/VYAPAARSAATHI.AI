'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: {
    appName: 'VyapaarSathi AI', dashboard: 'Business dashboard', language: 'Language', english: 'English', hindi: 'हिंदी',
    createInvoice: 'Create invoice', invoices: 'Invoices', reconciliation: 'UPI reconciliation', customer: 'Customer name',
    addItem: 'Add item', description: 'Description', quantity: 'Quantity', unitPrice: 'Unit price (₹)', dueDate: 'Due date',
    create: 'Create & generate PDF', uploadCsv: 'Upload UPI CSV', runReconciliation: 'Run reconciliation',
    recentTransactions: 'Recent transactions', amount: 'Amount', status: 'Status', transactionId: 'Transaction ID',
    totalInvoiced: 'Total invoiced', collected: 'Collected', needsReview: 'Needs review', noData: 'No records yet.',
    signedInRequired: 'Sign in with Supabase to load your business data.', loading: 'Loading your dashboard…',
    importSuccess: 'Imported {{count}} transactions.', reconcileSuccess: 'Matched {{count}} transactions.', error: 'Something went wrong. Please try again.',
    chooseFile: 'Choose a CSV file', csvHelp: 'UTF-8 CSV, up to 500 rows and 5 MB.', invoiceDate: 'Invoice date', notes: 'Notes (optional)'
  } },
  hi: { translation: {
    appName: 'व्यापारसाथी AI', dashboard: 'बिज़नेस डैशबोर्ड', language: 'भाषा', english: 'English', hindi: 'हिंदी',
    createInvoice: 'इनवॉइस बनाएं', invoices: 'इनवॉइस', reconciliation: 'UPI मिलान', customer: 'ग्राहक का नाम',
    addItem: 'आइटम जोड़ें', description: 'विवरण', quantity: 'मात्रा', unitPrice: 'इकाई मूल्य (₹)', dueDate: 'देय तिथि',
    create: 'PDF के साथ बनाएं', uploadCsv: 'UPI CSV अपलोड करें', runReconciliation: 'मिलान चलाएं',
    recentTransactions: 'हाल के लेन-देन', amount: 'राशि', status: 'स्थिति', transactionId: 'लेन-देन ID',
    totalInvoiced: 'कुल इनवॉइस', collected: 'वसूल किया', needsReview: 'समीक्षा आवश्यक', noData: 'अभी कोई रिकॉर्ड नहीं है।',
    signedInRequired: 'अपना डेटा देखने के लिए Supabase से साइन इन करें।', loading: 'आपका डैशबोर्ड लोड हो रहा है…',
    importSuccess: '{{count}} लेन-देन इम्पोर्ट किए गए।', reconcileSuccess: '{{count}} लेन-देन मिलाए गए।', error: 'कुछ गलत हो गया। कृपया फिर कोशिश करें।',
    chooseFile: 'CSV फ़ाइल चुनें', csvHelp: 'UTF-8 CSV, अधिकतम 500 पंक्तियाँ और 5 MB।', invoiceDate: 'इनवॉइस तारीख', notes: 'नोट्स (वैकल्पिक)'
  } }
} as const;

void i18n.use(initReactI18next).init({ resources, lng: 'en', fallbackLng: 'en', interpolation: { escapeValue: false } });
export { i18n };
