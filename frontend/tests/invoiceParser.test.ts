import { describe, it, expect } from 'vitest';
import { parseInvoiceGrammar, generateWhatsAppSummary, transliterateHindiToLatin } from '../lib/invoiceParser';

describe('Invoice Grammar Parser (Deterministic)', () => {
  it('parses valid comma-separated items correctly', () => {
    const input = '2 kg cheeni 90, 1 Parle-G 10, chai 20';
    const result = parseInvoiceGrammar(input);

    expect(result.hasUnparsedTokens).toBe(false);
    expect(result.items).toHaveLength(3);

    // Item 1
    expect(result.items[0].qty).toBe(2);
    expect(result.items[0].unit).toBe('kg');
    expect(result.items[0].item).toBe('cheeni');
    expect(result.items[0].price).toBe(90);

    // Item 2
    expect(result.items[1].qty).toBe(1);
    expect(result.items[1].unit).toBe('pc');
    expect(result.items[1].item).toBe('Parle-G');
    expect(result.items[1].price).toBe(10);

    // Item 3 (quantity omitted -> defaults to 1 pc)
    expect(result.items[2].qty).toBe(1);
    expect(result.items[2].unit).toBe('pc');
    expect(result.items[2].item).toBe('chai');
    expect(result.items[2].price).toBe(20);

    expect(result.totalAmount).toBe(120);
  });

  it('handles units in set {kg, g, l, ml, pc, pkt, dozen}', () => {
    const input = '100 g gms_item 15, 2 l milk 80, 500 ml amul 40, 1 dozen kela 60, 2 pkts maggi 28';
    const result = parseInvoiceGrammar(input);

    expect(result.items[0].unit).toBe('g');
    expect(result.items[1].unit).toBe('l');
    expect(result.items[2].unit).toBe('ml');
    expect(result.items[3].unit).toBe('dozen');
    expect(result.items[4].unit).toBe('pkt');
  });

  it('flags unparseable tokens for manual entry without guessing', () => {
    const input = '2 kg cheeni 90, invalid token line, 1 pc chai 20';
    const result = parseInvoiceGrammar(input);

    expect(result.hasUnparsedTokens).toBe(true);
    expect(result.unparsedTokens).toContain('invalid token line');
    expect(result.items[1].requiresManualEntry).toBe(true);
  });

  it('transliterates Hindi/Devanagari inputs before parsing', () => {
    const hindiInput = '2 किलो चीनी 90';
    const latin = transliterateHindiToLatin(hindiInput);
    expect(latin).toContain('kg');
    expect(latin).toContain('cheeni');

    const result = parseInvoiceGrammar(hindiInput);
    expect(result.items[0].qty).toBe(2);
    expect(result.items[0].price).toBe(90);
  });

  it('generates shareable WhatsApp text summary in English and Hindi', () => {
    const invoice = {
      id: 'INV-1001',
      customerName: 'Ramesh Kumar',
      items: [
        { qty: 2, unit: 'kg' as const, item: 'cheeni', price: 90, total: 90 },
        { qty: 1, unit: 'pkt' as const, item: 'Parle-G', price: 10, total: 10 },
      ],
      totalAmount: 100,
    };

    const summaryEn = generateWhatsAppSummary(invoice, 'en');
    expect(summaryEn).toContain('Vyapari Invoice #INV-1001');
    expect(summaryEn).toContain('Ramesh Kumar');
    expect(summaryEn).toContain('*Total Amount:* ₹100');

    const summaryHi = generateWhatsAppSummary(invoice, 'hi');
    expect(summaryHi).toContain('व्यापारी बिल #INV-1001');
    expect(summaryHi).toContain('*कुल राशि:* ₹100');
  });
});
