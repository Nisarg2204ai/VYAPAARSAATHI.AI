#!/usr/bin/env python3
"""Transcribe an Indian business voice note and create a GST invoice through VyapaarSathi API."""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from dataclasses import asdict, dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Any

import requests
from openai import APIConnectionError, APITimeoutError, OpenAI, RateLimitError


@dataclass(frozen=True)
class InvoiceFacts:
    merchant: str
    amount_paise: int
    gst_rate: int
    invoice_date: str
    transcript: str


def parse_date(value: str | None) -> str:
    if not value:
        return date.today().isoformat()
    for pattern in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(value, pattern).date().isoformat()
        except ValueError:
            continue
    raise ValueError("Use a date in YYYY-MM-DD, DD/MM/YYYY, or DD-MM-YYYY format")


def extract_facts(transcript: str, customer_override: str | None) -> InvoiceFacts:
    cleaned = " ".join(transcript.split())
    merchant_match = re.search(r"(?:merchant|shop|store|dukaan|दुकान|व्यापारी)\s*(?:is|है|:)?\s*([\w .&'()-]{2,80}?)(?=\s+(?:amount\b|₹|rs\.?\b|inr\b|rupees?\b|राशि\b)|$)", cleaned, re.IGNORECASE)
    merchant = customer_override or (merchant_match.group(1).strip(" .,-") if merchant_match else "")
    amount_match = re.search(r"(?:₹|rs\.?|inr|rupees?|रुपये)\s*([0-9][0-9,]*(?:\.\d{1,2})?)|(?:amount|राशि)\s*(?:is|है|:)?\s*([0-9][0-9,]*(?:\.\d{1,2})?)", cleaned, re.IGNORECASE)
    if not merchant:
        raise ValueError("Could not identify merchant/customer. Pass --customer explicitly.")
    if not amount_match:
        raise ValueError("Could not identify a currency amount in the transcription.")
    rupees = float((amount_match.group(1) or amount_match.group(2)).replace(",", ""))
    amount_paise = round(rupees * 100)
    if amount_paise <= 0 or amount_paise > 10_000_000_00:
        raise ValueError("Extracted amount is outside the permitted invoice range.")
    gst_match = re.search(r"(?:gst|जीएसटी)\s*(?:rate)?\s*(\d{1,2})\s*%", cleaned, re.IGNORECASE)
    gst_rate = int(gst_match.group(1)) if gst_match else 18
    date_match = re.search(r"\b(\d{4}-\d{2}-\d{2}|\d{2}[/-]\d{2}[/-]\d{4})\b", cleaned)
    return InvoiceFacts(merchant=merchant, amount_paise=amount_paise, gst_rate=gst_rate, invoice_date=parse_date(date_match.group(1) if date_match else None), transcript=cleaned)


def transcribe(client: OpenAI, audio_path: Path) -> str:
    for attempt in range(4):
        try:
            with audio_path.open("rb") as audio_file:
                result = client.audio.transcriptions.create(model="whisper-1", file=audio_file, response_format="text", prompt="Indian business invoice. Listen for merchant, INR amount, GST percent, and date.")
            return (result if isinstance(result, str) else result.text).strip()
        except (RateLimitError, APITimeoutError, APIConnectionError) as error:
            if attempt == 3:
                raise RuntimeError("Whisper is temporarily unavailable; retry later.") from error
            time.sleep(2 ** attempt)
    raise RuntimeError("Unreachable transcription state")


def create_invoice(facts: InvoiceFacts, api_url: str, access_token: str) -> dict[str, Any]:
    if facts.gst_rate != 18:
        raise ValueError(f"Voice note specifies GST {facts.gst_rate}%, but the configured API enforces 18%. Review before invoicing.")
    payload = {
        "customerName": facts.merchant,
        "invoiceDate": facts.invoice_date,
        "lineItems": [{"description": f"Voice invoice: {facts.transcript[:180]}", "quantity": 1, "unitPricePaise": facts.amount_paise}],
        "notes": "Created from a Whisper voice transcription; verify extracted details before sharing."
    }
    try:
        response = requests.post(f"{api_url.rstrip('/')}/api/invoices", json=payload, headers={"Authorization": f"Bearer {access_token}"}, timeout=(5, 20))
    except requests.Timeout as error:
        raise RuntimeError("Invoice API timed out; do not retry blindly without checking for a created invoice.") from error
    if response.status_code == 429:
        raise RuntimeError("Invoice API rate limit reached; retry after its Retry-After interval.")
    if not response.ok:
        raise RuntimeError(f"Invoice API rejected the request ({response.status_code}): {response.text[:300]}")
    return response.json()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("audio", type=Path, help="Audio file supported by Whisper (for example .m4a, .mp3, .wav)")
    parser.add_argument("--customer", help="Override merchant/customer extracted from speech")
    parser.add_argument("--dry-run", action="store_true", help="Print extracted facts without creating an invoice")
    args = parser.parse_args()
    if not args.audio.is_file() or args.audio.stat().st_size > 25 * 1024 * 1024:
        raise SystemExit("Audio must be an existing file no larger than 25 MB.")
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("OPENAI_API_KEY is required.")
    transcript = transcribe(OpenAI(api_key=api_key, timeout=30.0, max_retries=0), args.audio)
    facts = extract_facts(transcript, args.customer)
    print(json.dumps(asdict(facts), ensure_ascii=False, indent=2))
    if args.dry_run:
        return 0
    api_url = os.environ.get("VYAPAARSATHI_API_URL")
    token = os.environ.get("SUPABASE_ACCESS_TOKEN")
    if not api_url or not token:
        raise SystemExit("VYAPAARSATHI_API_URL and SUPABASE_ACCESS_TOKEN are required unless --dry-run is used.")
    result = create_invoice(facts, api_url, token)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, RuntimeError) as error:
        print(f"error: {error}", file=sys.stderr)
        raise SystemExit(2)
