#!/usr/bin/env python3
"""Fast parallel scraper for desa-level BPS bridging data.

Uses concurrent.futures with 20 workers to scrape ~7,219 kecamatan endpoints.
Loads kecamatan codes from bridging_kecamatan.json (already scraped).

Output: scripts/bridging_desa.json
"""
import json
import time
import urllib.request
import urllib.error
import sys
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://sig.bps.go.id/rest-bridging/getwilayah"
PERIODE = "2025s1"
MAX_RETRIES = 3
TIMEOUT = 30
WORKERS = 20

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def fetch_desa(kec_code: str) -> list[dict]:
    """Fetch desa bridging data for one kecamatan with retries."""
    url = f"{BASE_URL}?level=desa&parent={kec_code}&periode={PERIODE}"
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            req = urllib.request.Request(url)
            resp = urllib.request.urlopen(req, timeout=TIMEOUT)
            data = json.loads(resp.read())
            result = []
            for item in data:
                result.append({
                    "kode_bps": item["kode_bps"],
                    "kode_dagri": item["kode_dagri"].replace(".", ""),
                    "nama_bps": item["nama_bps"],
                })
            return result
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt)
            else:
                print(f"  FAILED {kec_code}: {e}", file=sys.stderr)
                return []
    return []


def main():
    # Load kecamatan codes
    kec_path = os.path.join(SCRIPT_DIR, "bridging_kecamatan.json")
    with open(kec_path) as f:
        kecamatan = json.load(f)

    kec_codes = [k["kode_bps"] for k in kecamatan]
    total = len(kec_codes)
    print(f"Scraping desa for {total} kecamatan with {WORKERS} workers...")

    all_desa = []
    errors = []
    done = 0

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        future_to_code = {executor.submit(fetch_desa, code): code for code in kec_codes}

        for future in as_completed(future_to_code):
            code = future_to_code[future]
            done += 1
            try:
                result = future.result()
                if result:
                    all_desa.extend(result)
                else:
                    errors.append(code)
            except Exception as e:
                errors.append(code)
                print(f"  ERROR {code}: {e}", file=sys.stderr)

            if done % 500 == 0 or done == total:
                print(f"  Progress: {done}/{total} kecamatan, {len(all_desa)} desa so far")

    # Sort by kode_bps for deterministic output
    all_desa.sort(key=lambda x: x["kode_bps"])

    # Save
    out_path = os.path.join(SCRIPT_DIR, "bridging_desa.json")
    with open(out_path, "w") as f:
        json.dump(all_desa, f, ensure_ascii=False)
    print(f"\nSaved {len(all_desa)} desa to {out_path}")

    if errors:
        print(f"ERRORS for {len(errors)} kecamatan: {errors}", file=sys.stderr)

    # Retry errors once more
    if errors:
        print(f"\nRetrying {len(errors)} failed kecamatan...")
        retry_results = []
        with ThreadPoolExecutor(max_workers=5) as executor:
            future_to_code = {executor.submit(fetch_desa, code): code for code in errors}
            for future in as_completed(future_to_code):
                code = future_to_code[future]
                try:
                    result = future.result()
                    if result:
                        retry_results.extend(result)
                        print(f"  Recovered {code}: {len(result)} desa")
                except Exception:
                    pass

        if retry_results:
            all_desa.extend(retry_results)
            all_desa.sort(key=lambda x: x["kode_bps"])
            with open(out_path, "w") as f:
                json.dump(all_desa, f, ensure_ascii=False)
            print(f"Updated: {len(all_desa)} total desa after retry")

    print(f"\n=== Final: {len(all_desa)} desa records ===")


if __name__ == "__main__":
    main()
