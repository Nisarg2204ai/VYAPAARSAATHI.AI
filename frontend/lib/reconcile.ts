import { OpenInvoice } from './seedData';

export interface ParsedSmsDetails {
  amount: number | null;
  payerName: string | null;
  vpa: string | null;
  refNo: string | null;
  rawText: string;
}

export interface MatchBreakdown {
  invoice: OpenInvoice;
  score: number;
  band: 'AUTO_MATCH' | 'ASK_TO_CONFIRM' | 'NO_MATCH';
  amountExact: number;
  nameScore: number;
  keywordScore: number;
  parsedDetails: ParsedSmsDetails;
}

/**
 * Extract initials from a name (e.g., "Ramesh Kumar" -> "rk", "R. K." -> "rk")
 */
export function getInitials(name: string): string {
  if (!name) return '';
  const tokens = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  return tokens.map((t) => t[0]).join('');
}

/**
 * Enhanced Jaro-Winkler string similarity calculation with initials & substring matching
 */
export function jaroWinklerDistance(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;

  // Check Initials Matching (e.g., "R. K." vs "Ramesh Kumar")
  const init1 = getInitials(s1);
  const init2 = getInitials(s2);
  if (init1 && init2 && (init1 === init2 || init1.includes(init2) || init2.includes(init1))) {
    return 0.85;
  }

  // Check Substring Match
  if (s1.includes(s2) || s2.includes(s1)) {
    const minLen = Math.min(s1.length, s2.length);
    const maxLen = Math.max(s1.length, s2.length);
    if (minLen >= 2) return Math.min(0.95, 0.75 + 0.2 * (minLen / maxLen));
  }

  const len1 = s1.length;
  const len2 = s2.length;
  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;

  const matches1 = new Array(len1).fill(false);
  const matches2 = new Array(len2).fill(false);

  let matchCount = 0;
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, len2);
    for (let j = start; j < end; j++) {
      if (!matches2[j] && s1[i] === s2[j]) {
        matches1[i] = true;
        matches2[j] = true;
        matchCount++;
        break;
      }
    }
  }

  if (matchCount === 0) return 0.0;

  let transCount = 0;
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (matches1[i]) {
      while (!matches2[k]) k++;
      if (s1[i] !== s2[k]) transCount++;
      k++;
    }
  }

  const jaro = (matchCount / len1 + matchCount / len2 + (matchCount - transCount / 2) / matchCount) / 3;

  // Winkler scaling for common prefix
  let prefix = 0;
  const maxPrefix = Math.min(4, Math.min(len1, len2));
  for (let i = 0; i < maxPrefix; i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }

  const p = 0.1;
  return Math.min(1.0, jaro + prefix * p * (1 - jaro));
}

/**
 * Extract financial transaction details from a Bank / UPI SMS string
 */
export function parseBankSms(smsText: string): ParsedSmsDetails {
  const text = smsText.trim();

  // 1. Amount Extraction
  let amount: number | null = null;
  const amountMatch = text.match(/(?:Rs\.?|INR)\s*(\d+(?:\.\d+)?)/i);
  if (amountMatch) {
    amount = parseFloat(amountMatch[1]);
  }

  // 2. Payer Name & VPA Extraction
  let payerName: string | null = null;
  let vpa: string | null = null;

  // Pattern A: "from VPA parleg@okaxis (Ramesh Kumar)"
  const vpaPayerMatch = text.match(/from VPA ([^\s()]+)(?:\s*\(([^)]+)\))?/i);
  if (vpaPayerMatch) {
    vpa = vpaPayerMatch[1];
    payerName = vpaPayerMatch[2] || vpa;
  }

  // Pattern B: "via UPI/Priya Sharma/Ref"
  if (!payerName) {
    const hdfcMatch = text.match(/via UPI\/([^/]+)\//i);
    if (hdfcMatch) {
      payerName = hdfcMatch[1].trim();
    }
  }

  // Pattern C: "from R. K." or "from Ramesh"
  if (!payerName) {
    const fromMatch = text.match(/from ([A-Z\.\s]+?)(?:\s+Ref|\s+UPI|$)/i);
    if (fromMatch) {
      payerName = fromMatch[1].trim();
    }
  }

  // 3. Reference Number Extraction
  let refNo: string | null = null;
  const refMatch = text.match(/(?:Ref|Reference|UPI Ref)\s*:?\s*(\d+)/i);
  if (refMatch) {
    refNo = refMatch[1];
  }

  return {
    amount,
    payerName,
    vpa,
    refNo,
    rawText: text,
  };
}

/**
 * Calculates keyword overlap score (0.0 to 1.0) between SMS narration and invoice context
 */
export function calculateKeywordOverlap(smsText: string, invoice: OpenInvoice): number {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1);

  const smsTokens = new Set(normalize(smsText));
  const invoiceContextStr = `${invoice.id} ${invoice.customerName} ${invoice.upiVpa || ''} ${invoice.items.map((i) => i.item).join(' ')}`;
  const invoiceTokens = normalize(invoiceContextStr);

  if (smsTokens.size === 0 || invoiceTokens.length === 0) return 0;

  let matchCount = 0;
  for (const token of invoiceTokens) {
    if (smsTokens.has(token)) {
      matchCount++;
    }
  }

  const overlapRatio = matchCount / Math.max(1, invoiceTokens.length);
  return Math.min(1.0, overlapRatio * 1.5);
}

/**
 * Core Reconciliation Logic using prompt formula:
 * score = 0.5 * amountExact + 0.3 * JaroWinkler(payerName) + 0.2 * keywordOverlap(narration, invoice)
 * >=0.8 auto-match, 0.5–0.8 ask-to-confirm, <0.5 no match.
 */
export function reconcileSmsWithInvoices(smsText: string, openInvoices: OpenInvoice[]): MatchBreakdown[] {
  const parsed = parseBankSms(smsText);

  const results: MatchBreakdown[] = openInvoices.map((invoice) => {
    // 1. Amount Exact Match (0.5 weight)
    let amountExact = 0;
    if (parsed.amount !== null && invoice.balanceDue > 0) {
      if (Math.abs(parsed.amount - invoice.balanceDue) < 0.01) {
        amountExact = 1.0;
      } else if (Math.abs(parsed.amount - invoice.totalAmount) < 0.01) {
        amountExact = 1.0;
      } else if (parsed.amount < invoice.balanceDue && parsed.amount > 0) {
        // Partial amount ratio
        amountExact = parsed.amount / invoice.balanceDue;
      } else {
        amountExact = 0.0;
      }
    }

    // 2. JaroWinkler Similarity (0.3 weight)
    const nameToCompare = parsed.payerName || parsed.vpa || '';
    const nameScoreCustomer = jaroWinklerDistance(nameToCompare, invoice.customerName);
    const nameScoreVpa = invoice.upiVpa ? jaroWinklerDistance(parsed.vpa || nameToCompare, invoice.upiVpa) : 0;
    const nameScore = Math.max(nameScoreCustomer, nameScoreVpa);

    // 3. Keyword Overlap (0.2 weight)
    const keywordScore = calculateKeywordOverlap(smsText, invoice);

    // Score formula
    const rawScore = 0.5 * amountExact + 0.3 * nameScore + 0.2 * keywordScore;
    const score = Math.round(rawScore * 100) / 100;

    let band: 'AUTO_MATCH' | 'ASK_TO_CONFIRM' | 'NO_MATCH' = 'NO_MATCH';
    if (score >= 0.8) {
      band = 'AUTO_MATCH';
    } else if (score >= 0.5) {
      band = 'ASK_TO_CONFIRM';
    } else {
      band = 'NO_MATCH';
    }

    return {
      invoice,
      score,
      band,
      amountExact,
      nameScore,
      keywordScore,
      parsedDetails: parsed,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}
