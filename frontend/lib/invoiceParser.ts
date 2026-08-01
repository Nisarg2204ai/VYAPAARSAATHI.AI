/**
 * Invoice Grammar Parser (Deterministic)
 * Grammar: `<qty><unit?> <item> <price>` repeated, comma-separated or newline-separated.
 * Allowed units: kg, g, l, ml, pc, pkt, dozen (and common plurals: pcs, pkts, gms, ltr).
 * 
 * Scope: Hinglish/Latin script.
 * Note: Hindi-voice transcripts are transliterated to Latin script before passing into this parser.
 */

export interface ParsedItem {
  qty: number;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'pc' | 'pkt' | 'dozen';
  item: string;
  price: number;
  total: number;
  requiresManualEntry?: boolean;
  unparsedToken?: string;
}

export interface ParseResult {
  items: ParsedItem[];
  totalAmount: number;
  hasUnparsedTokens: boolean;
  unparsedTokens: string[];
  rawInput: string;
}

const ALLOWED_UNITS_REGEX = /^(kg|g|gm|gms|l|ltr|litres|ml|pc|pcs|pkt|pkts|dozen|dozens)$/i;

function normalizeUnit(rawUnit?: string): 'kg' | 'g' | 'l' | 'ml' | 'pc' | 'pkt' | 'dozen' {
  if (!rawUnit) return 'pc';
  const u = rawUnit.toLowerCase();
  if (u === 'g' || u === 'gm' || u === 'gms') return 'g';
  if (u === 'l' || u === 'ltr' || u === 'litres') return 'l';
  if (u === 'ml') return 'ml';
  if (u === 'pc' || u === 'pcs') return 'pc';
  if (u === 'pkt' || u === 'pkts') return 'pkt';
  if (u === 'dozen' || u === 'dozens') return 'dozen';
  if (u === 'kg') return 'kg';
  return 'pc';
}

/**
 * Transliterates Hindi/Devanagari text to Latin script if Devanagari characters are present.
 * For Web Speech Hindi transcripts before passing to deterministic grammar parser.
 */
export function transliterateHindiToLatin(input: string): string {
  // Simple mapping for common Kirana items if Devanagari is detected
  const devanagariMap: Record<string, string> = {
    'चीनी': 'cheeni',
    'चाय': 'chai',
    'आटा': 'atta',
    'चावल': 'rice',
    'तेल': 'oil',
    'दूध': 'doodh',
    'बिस्कुट': 'biscuit',
    'किलो': 'kg',
    'ग्राम': 'g',
    'लीटर': 'l',
    'पैकेट': 'pkt',
    'दर्जन': 'dozen',
    'पीस': 'pc',
  };

  let result = input;
  Object.keys(devanagariMap).forEach((hindiWord) => {
    result = result.replace(new RegExp(hindiWord, 'g'), devanagariMap[hindiWord]);
  });
  return result;
}

/**
 * Parses a single item segment of format `<qty><unit?> <item> <price>`
 */
export function parseSingleSegment(segment: string): ParsedItem {
  const trimmed = segment.trim();
  if (!trimmed) {
    return {
      qty: 1,
      unit: 'pc',
      item: 'Unknown Item',
      price: 0,
      total: 0,
      requiresManualEntry: true,
      unparsedToken: segment,
    };
  }

  // Tokenize segment by spaces
  const tokens = trimmed.split(/\s+/);
  if (tokens.length < 2) {
    // Cannot deterministically parse item name and price with < 2 tokens
    return {
      qty: 1,
      unit: 'pc',
      item: trimmed,
      price: 0,
      total: 0,
      requiresManualEntry: true,
      unparsedToken: trimmed,
    };
  }

  // Extract trailing price token (e.g. 90, ₹90, rs.90, 90.00)
  const lastToken = tokens[tokens.length - 1];
  const priceMatch = lastToken.match(/^(?:rs\.?|₹|inr)?\s*(\d+(?:\.\d+)?)$/i);

  if (!priceMatch) {
    // If the last token is not a numeric price, flag for manual entry
    return {
      qty: 1,
      unit: 'pc',
      item: trimmed,
      price: 0,
      total: 0,
      requiresManualEntry: true,
      unparsedToken: trimmed,
    };
  }

  const price = parseFloat(priceMatch[1]);
  const nonPriceTokens = tokens.slice(0, tokens.length - 1);

  // Now parse leading quantity & unit from nonPriceTokens
  let qty = 1;
  let unit: 'kg' | 'g' | 'l' | 'ml' | 'pc' | 'pkt' | 'dozen' = 'pc';
  let itemStartIndex = 0;

  const firstToken = nonPriceTokens[0];

  // Case A: First token is combined qty+unit like "2kg", "1pkt", "500g"
  const combinedQtyUnitMatch = firstToken.match(/^(\d+(?:\.\d+)?)(kg|g|gm|gms|l|ltr|litres|ml|pc|pcs|pkt|pkts|dozen|dozens)$/i);

  if (combinedQtyUnitMatch) {
    qty = parseFloat(combinedQtyUnitMatch[1]);
    unit = normalizeUnit(combinedQtyUnitMatch[2]);
    itemStartIndex = 1;
  } else if (/^\d+(?:\.\d+)?$/.test(firstToken)) {
    // Case B: First token is numeric qty like "2" or "1"
    qty = parseFloat(firstToken);
    if (nonPriceTokens.length > 1 && ALLOWED_UNITS_REGEX.test(nonPriceTokens[1])) {
      // Second token is unit like "kg"
      unit = normalizeUnit(nonPriceTokens[1]);
      itemStartIndex = 2;
    } else {
      // No explicit unit token, default to pc
      unit = 'pc';
      itemStartIndex = 1;
    }
  } else {
    // Case C: Quantity omitted (e.g. "chai 20")
    qty = 1;
    unit = 'pc';
    itemStartIndex = 0;
  }

  const itemTokens = nonPriceTokens.slice(itemStartIndex);
  const item = itemTokens.join(' ').trim();

  if (!item) {
    return {
      qty,
      unit,
      item: trimmed,
      price,
      total: price,
      requiresManualEntry: true,
      unparsedToken: trimmed,
    };
  }

  return {
    qty,
    unit,
    item,
    price,
    total: price, // Or price provided for line item
  };
}

/**
 * Deterministic parser for comma-separated or newline-separated invoice text
 */
export function parseInvoiceGrammar(input: string): ParseResult {
  const latinInput = transliterateHindiToLatin(input);
  const rawSegments = latinInput.split(/,|\n/).map((s) => s.trim()).filter(Boolean);

  const items: ParsedItem[] = [];
  const unparsedTokens: string[] = [];

  for (const seg of rawSegments) {
    const parsed = parseSingleSegment(seg);
    items.push(parsed);
    if (parsed.requiresManualEntry && parsed.unparsedToken) {
      unparsedTokens.push(parsed.unparsedToken);
    }
  }

  const totalAmount = items.reduce((acc, curr) => acc + curr.price, 0);

  return {
    items,
    totalAmount,
    hasUnparsedTokens: unparsedTokens.length > 0,
    unparsedTokens,
    rawInput: input,
  };
}

/**
 * Generates formatted WhatsApp summary text
 */
export function generateWhatsAppSummary(
  invoice: { id: string; customerName?: string; items: ParsedItem[]; totalAmount: number; upiVpa?: string },
  lang: 'en' | 'hi' = 'en'
): string {
  const isHi = lang === 'hi';
  const header = isHi ? `🧾 *व्यापारी बिल #${invoice.id}*` : `🧾 *Vyapari Invoice #${invoice.id}*`;
  const customer = invoice.customerName ? (isHi ? `ग्राहक: ${invoice.customerName}\n` : `Customer: ${invoice.customerName}\n`) : '';
  const separator = '--------------------------------';
  const lineItems = invoice.items
    .map((item) => `• ${item.qty} ${item.unit} ${item.item} - ₹${item.price}`)
    .join('\n');
  const total = isHi ? `*कुल राशि:* ₹${invoice.totalAmount}` : `*Total Amount:* ₹${invoice.totalAmount}`;
  const upi = isHi ? `UPI द्वारा भुगतान: ${invoice.upiVpa || 'kirana@upi'}` : `Pay via UPI: ${invoice.upiVpa || 'kirana@upi'}`;
  const footer = isHi ? `धन्यवाद! फिर पधारें 🙏` : `Thank you for shopping with us! 🙏`;

  return `${header}\n${customer}${separator}\n${lineItems}\n${separator}\n${total}\n${upi}\n\n${footer}`;
}
