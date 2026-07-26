'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
] as const;

const baseTranslations = {
  appName: 'VyapaarSathi AI',
  dashboard: 'Business Dashboard',
  language: 'Language',
  createInvoice: 'Create Invoice',
  invoices: 'Invoices',
  reconciliation: 'UPI Reconciliation',
  customer: 'Customer Name',
  addItem: 'Add Item',
  description: 'Description',
  quantity: 'Quantity',
  unitPrice: 'Unit Price (₹)',
  dueDate: 'Due Date',
  create: 'Create & Generate PDF',
  uploadCsv: 'Upload UPI CSV',
  runReconciliation: 'Run Reconciliation',
  recentTransactions: 'Recent Transactions',
  amount: 'Amount',
  status: 'Status',
  transactionId: 'Transaction ID',
  totalInvoiced: 'Total Invoiced',
  collected: 'Collected',
  needsReview: 'Needs Review',
  noData: 'No records yet.',
  signedInRequired: 'Sign in to access your business data.',
  loading: 'Loading your dashboard…',
  importSuccess: 'Imported {{count}} transactions.',
  reconcileSuccess: 'Matched {{count}} transactions.',
  error: 'Something went wrong. Please try again.',
  chooseFile: 'Choose a CSV file',
  csvHelp: 'UTF-8 CSV, up to 500 rows and 5 MB.',
  invoiceDate: 'Invoice Date',
  notes: 'Notes (optional)',
  schemes: 'MSME Govt Schemes',
  cfoAdvisor: 'CFO AI Advisor',
  profile: 'Merchant Profile',
  aboutUs: 'About Us',
  contactUs: 'Contact Support'
};

const resources = {
  en: { translation: { ...baseTranslations } },
  hi: { translation: { ...baseTranslations, appName: 'व्यापारसाथी AI', dashboard: 'बिज़नेस डैशबोर्ड', totalInvoiced: 'कुल इनवॉइस', collected: 'वसूल किया', needsReview: 'समीक्षा आवश्यक' } },
  gu: { translation: { ...baseTranslations, appName: 'વ્યાપારસાથી AI', dashboard: 'બિઝનેસ ડેશબોર્ડ', totalInvoiced: 'કુલ ઇનવોઇસ', collected: 'વસૂલ કરેલ', needsReview: 'સમીક્ષા જરૂરી' } },
  mr: { translation: { ...baseTranslations, appName: 'व्यापारसाथी AI', dashboard: 'बिझनेस डॅशबोर्ड', totalInvoiced: 'एकूण इनव्हॉइस', collected: 'जमा रक्कम', needsReview: 'तपासणी आवश्यक' } },
  bn: { translation: { ...baseTranslations, appName: 'ব্যাপারসাথী AI', dashboard: 'বিজনেস ড্যাশবোর্ড', totalInvoiced: 'মোট ইনভয়েস', collected: 'সংগৃহীত', needsReview: 'পর্যালোচনা প্রয়োজন' } },
  ta: { translation: { ...baseTranslations, appName: 'வியாபார்சாதி AI', dashboard: 'வணிக டாஷ்போர்டு', totalInvoiced: 'மொத்த இன்வாய்ஸ்', collected: 'சேகரிக்கப்பட்டது', needsReview: 'மதிப்பாய்வு தேவை' } },
  te: { translation: { ...baseTranslations, appName: 'వ్యాపార్‌సాథి AI', dashboard: 'బిజినెస్ డాష్‌బోర్డ్', totalInvoiced: 'మొత్తం ఇన్‌వాయిస్', collected: 'సేకరించినది', needsReview: 'సమీక్ష అవసరం' } },
  kn: { translation: { ...baseTranslations, appName: 'ವ್ಯಾಪಾರ್‌ಸಾಥಿ AI', dashboard: 'ಬಿಸಿನೆಸ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', totalInvoiced: 'ಒಟ್ಟು ಇನ್‌ವಾಯ್ಸ್', collected: 'ಸಂಗ್ರಹಿಸಿದೆ', needsReview: 'ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ' } },
  ml: { translation: { ...baseTranslations, appName: 'വ്യാപാരസാഥി AI', dashboard: 'ബിസിനസ്സ് ഡാഷ്‌ബോർഡ്', totalInvoiced: 'ആകെ ഇൻവോയ്സ്', collected: 'ശേഖരിച്ചു', needsReview: 'പരിശോധന ആവശ്യമാണ്' } },
  pa: { translation: { ...baseTranslations, appName: 'ਵਪਾਰਸਾਥੀ AI', dashboard: 'ਬਿਜ਼ਨਸ ਡੈਸ਼ਬੋਰਡ', totalInvoiced: 'ਕੁੱਲ ਇਨਵੌਇਸ', collected: 'ਇਕੱਠਾ ਕੀਤਾ', needsReview: 'ਸਮੀਖਿਆ ਦੀ ਲੋੜ ਹੈ' } },
  or: { translation: { ...baseTranslations, appName: 'ବ୍ୟାପାରସାଥୀ AI', dashboard: 'ବ୍ୟବସାୟ ଡ୍ୟାସବୋର୍ଡ', totalInvoiced: 'ମୋଟ ଇନଭଏସ', collected: 'ସଂଗୃହିତ', needsReview: 'ସମୀକ୍ଷା ଆବଶ୍ୟକ' } },
  as: { translation: { ...baseTranslations, appName: 'ব্যাপাৰসাথী AI', dashboard: 'ব্যৱসায়িক ড্যাশবৰ্ড', totalInvoiced: 'মুঠ ইনভয়েচ', collected: 'সংগ্ৰহ কৰা হৈছে', needsReview: 'পুনৰীক্ষণৰ প্ৰয়োজন' } }
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export { i18n };
