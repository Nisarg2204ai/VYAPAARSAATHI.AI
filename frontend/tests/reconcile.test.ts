import { describe, it, expect } from 'vitest';
import { reconcileSmsWithInvoices, jaroWinklerDistance, parseBankSms } from '../lib/reconcile';
import { OpenInvoice } from '../lib/seedData';

describe('UPI & Bank SMS Reconciliation Engine', () => {
  const sampleInvoices: OpenInvoice[] = [
    {
      id: 'INV-1001',
      customerName: 'Ramesh Kumar',
      upiVpa: 'parleg@okaxis',
      items: [{ qty: 2, unit: 'kg', item: 'cheeni', price: 90 }],
      totalAmount: 200,
      amountPaid: 0,
      balanceDue: 200,
      date: '2026-07-28',
      dueDate: '2026-07-30',
      status: 'OPEN',
    },
    {
      id: 'INV-1002',
      customerName: 'Priya Sharma',
      upiVpa: 'priya@paytm',
      items: [{ qty: 1, unit: 'pkt', item: 'atta', price: 320 }],
      totalAmount: 450,
      amountPaid: 0,
      balanceDue: 450,
      date: '2026-07-29',
      dueDate: '2026-07-31',
      status: 'OPEN',
    },
    {
      id: 'INV-1003',
      customerName: 'Suresh Patel',
      upiVpa: 'suresh@ybl',
      items: [{ qty: 10, unit: 'kg', item: 'rice', price: 850 }],
      totalAmount: 1200,
      amountPaid: 0,
      balanceDue: 1200,
      date: '2026-07-25',
      dueDate: '2026-07-27',
      status: 'OPEN',
    },
  ];

  it('Band 1: AUTO_MATCH (score >= 0.8) for clean SBI/Axis UPI SMS', () => {
    const smsText = 'Rs.200.00 credited to a/c XX1234 on 30-07-26 from VPA parleg@okaxis (Ramesh Kumar) UPI Ref 123456789012';
    const matches = reconcileSmsWithInvoices(smsText, sampleInvoices);

    const topMatch = matches[0];
    expect(topMatch.invoice.id).toBe('INV-1001');
    expect(topMatch.band).toBe('AUTO_MATCH');
    expect(topMatch.score).toBeGreaterThanOrEqual(0.8);
    expect(topMatch.amountExact).toBe(1.0);
  });

  it('Band 1: AUTO_MATCH (score >= 0.8) for concise HDFC-style SMS', () => {
    const smsText = 'Credit of INR 450.00 to A/C 9876 via UPI/Priya Sharma/Ref 9876543210';
    const matches = reconcileSmsWithInvoices(smsText, sampleInvoices);

    const topMatch = matches[0];
    expect(topMatch.invoice.id).toBe('INV-1002');
    expect(topMatch.band).toBe('AUTO_MATCH');
    expect(topMatch.score).toBeGreaterThanOrEqual(0.8);
  });

  it('Band 2: ASK_TO_CONFIRM (0.5 <= score < 0.8) for truncated/ambiguous SMS', () => {
    const smsText = 'Rs 100 credited via UPI from R. K. Ref 555111';
    const matches = reconcileSmsWithInvoices(smsText, sampleInvoices);

    const topMatch = matches[0];
    expect(topMatch.invoice.id).toBe('INV-1001');
    expect(topMatch.band).toBe('ASK_TO_CONFIRM');
    expect(topMatch.score).toBeGreaterThanOrEqual(0.5);
    expect(topMatch.score).toBeLessThan(0.8);
  });

  it('Band 3: NO_MATCH (score < 0.5) for completely unrelated transaction SMS', () => {
    const smsText = 'Rs.9999.00 debited from A/C XX9999 for Electricity Bill Ref 000111222';
    const matches = reconcileSmsWithInvoices(smsText, sampleInvoices);

    const topMatch = matches[0];
    expect(topMatch.score).toBeLessThan(0.5);
    expect(topMatch.band).toBe('NO_MATCH');
  });

  it('correctly calculates Jaro-Winkler string similarity', () => {
    const exact = jaroWinklerDistance('Ramesh Kumar', 'Ramesh Kumar');
    expect(exact).toBe(1.0);

    const partial = jaroWinklerDistance('Ramesh Kumar', 'R. K.');
    expect(partial).toBeGreaterThan(0.6);

    const empty = jaroWinklerDistance('', 'Ramesh');
    expect(empty).toBe(0.0);
  });

  it('parses amounts and details from SMS accurately', () => {
    const sms = parseBankSms('Credit of INR 450.00 to A/C 9876 via UPI/Priya Sharma/Ref 9876543210');
    expect(sms.amount).toBe(450);
    expect(sms.payerName).toBe('Priya Sharma');
    expect(sms.refNo).toBe('9876543210');
  });
});
