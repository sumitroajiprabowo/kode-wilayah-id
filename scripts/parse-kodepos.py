#!/usr/bin/env python3
"""Parse Kemendagri kodepos SQL dump into JSON.

Input:  Downloaded SQL from cahyadsn/wilayah_kodepos
Output: scripts/kodepos_map.json — { kemendagri_code: postal_code }
"""
import json
import os
import re
import urllib.request

SQL_URL = "https://raw.githubusercontent.com/cahyadsn/wilayah_kodepos/main/db/wilayah_kodepos.sql"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def download_sql() -> str:
    """Download the SQL file, or use cached /tmp version."""
    cache_path = "/tmp/wilayah_kodepos.sql"
    if os.path.exists(cache_path) and os.path.getsize(cache_path) > 1000:
        print(f"Using cached SQL from {cache_path}")
        with open(cache_path) as f:
            return f.read()

    print(f"Downloading from {SQL_URL}...")
    resp = urllib.request.urlopen(SQL_URL, timeout=60)
    content = resp.read().decode("utf-8")
    with open(cache_path, "w") as f:
        f.write(content)
    print(f"Downloaded {len(content)} bytes")
    return content


def parse_sql(sql: str) -> dict[str, str]:
    """Parse SQL INSERT values into { kemendagri_code: postal_code } map.

    SQL format: ('PP.RR.DD.SSSS', 'XXXXX')
    We strip dots from the code: 'PP.RR.DD.SSSS' -> 'PPRRDDSSSS'
    """
    pattern = re.compile(r"\('(\d{2}\.\d{2}\.\d{2}\.\d{4})',\s*'(\d{5})'\)")
    kodepos_map: dict[str, str] = {}

    for match in pattern.finditer(sql):
        kemendagri_code = match.group(1).replace(".", "")
        postal_code = match.group(2)
        kodepos_map[kemendagri_code] = postal_code

    return kodepos_map


def main():
    sql = download_sql()
    kodepos_map = parse_sql(sql)

    output_path = os.path.join(SCRIPT_DIR, "kodepos_map.json")
    with open(output_path, "w") as f:
        json.dump(kodepos_map, f, ensure_ascii=False)

    print(f"Parsed {len(kodepos_map)} kodepos entries")
    print(f"Unique postal codes: {len(set(kodepos_map.values()))}")
    print(f"Saved to {output_path}")

    # Sample
    items = list(kodepos_map.items())[:5]
    for code, postal in items:
        print(f"  {code} -> {postal}")


if __name__ == "__main__":
    main()
