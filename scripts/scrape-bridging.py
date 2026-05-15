#!/usr/bin/env python3
"""Scrape BPS bridging API for all administrative levels.

Output: scripts/bridging_provinsi.json, scripts/bridging_kabupaten.json,
        scripts/bridging_kecamatan.json, scripts/bridging_desa.json
"""
import json
import time
import urllib.request
import urllib.error
import sys
import os

BASE_URL = "https://sig.bps.go.id/rest-bridging/getwilayah"
PERIODE = "2025s1"
DELAY = 0.05  # 50ms between requests
MAX_RETRIES = 3
TIMEOUT = 30

# 4 new Papua provinces not in BPS bridging
SKIP_PROVINCES = {"92", "95", "96", "97"}

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def fetch(level: str, parent: str) -> list[dict]:
    """Fetch bridging data from BPS API with retries."""
    url = f"{BASE_URL}?level={level}&parent={parent}&periode={PERIODE}"
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            req = urllib.request.Request(url)
            resp = urllib.request.urlopen(req, timeout=TIMEOUT)
            return json.loads(resp.read())
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            print(f"  RETRY {attempt}/{MAX_RETRIES} for {url}: {e}", file=sys.stderr)
            if attempt == MAX_RETRIES:
                print(f"  FAILED {url}", file=sys.stderr)
                return []
            time.sleep(2 ** attempt)
    return []


def strip_dots(code: str) -> str:
    """Remove dots from Kemendagri code: '11.09.07' -> '110907'"""
    return code.replace(".", "")


def scrape_provinsi() -> list[dict]:
    print("Fetching provinsi bridging...")
    data = fetch("provinsi", "0")
    result = []
    for item in data:
        result.append({
            "kode_bps": item["kode_bps"],
            "kode_dagri": strip_dots(item["kode_dagri"]),
            "nama_bps": item["nama_bps"],
        })
    print(f"  Got {len(result)} provinsi")
    return result


def scrape_kabupaten(provinsi: list[dict]) -> list[dict]:
    print("Fetching kabupaten bridging...")
    result = []
    for i, prov in enumerate(provinsi):
        if prov["kode_bps"] in SKIP_PROVINCES:
            continue
        data = fetch("kabupaten", prov["kode_bps"])
        for item in data:
            result.append({
                "kode_bps": item["kode_bps"],
                "kode_dagri": strip_dots(item["kode_dagri"]),
                "nama_bps": item["nama_bps"],
            })
        time.sleep(DELAY)
        if (i + 1) % 10 == 0:
            print(f"  Progress: {i + 1}/{len(provinsi)} provinsi, {len(result)} kabupaten so far")
    print(f"  Got {len(result)} kabupaten")
    return result


def scrape_kecamatan(kabupaten: list[dict]) -> list[dict]:
    print("Fetching kecamatan bridging...")
    result = []
    for i, kab in enumerate(kabupaten):
        data = fetch("kecamatan", kab["kode_bps"])
        for item in data:
            result.append({
                "kode_bps": item["kode_bps"],
                "kode_dagri": strip_dots(item["kode_dagri"]),
                "nama_bps": item["nama_bps"],
            })
        time.sleep(DELAY)
        if (i + 1) % 50 == 0:
            print(f"  Progress: {i + 1}/{len(kabupaten)} kabupaten, {len(result)} kecamatan so far")
    print(f"  Got {len(result)} kecamatan")
    return result


def scrape_desa(kecamatan: list[dict]) -> list[dict]:
    print("Fetching desa bridging...")
    result = []
    errors = []
    for i, kec in enumerate(kecamatan):
        data = fetch("desa", kec["kode_bps"])
        if not data:
            errors.append(kec["kode_bps"])
        for item in data:
            result.append({
                "kode_bps": item["kode_bps"],
                "kode_dagri": strip_dots(item["kode_dagri"]),
                "nama_bps": item["nama_bps"],
            })
        time.sleep(DELAY)
        if (i + 1) % 200 == 0:
            print(f"  Progress: {i + 1}/{len(kecamatan)} kecamatan, {len(result)} desa so far")
    print(f"  Got {len(result)} desa")
    if errors:
        print(f"  ERRORS for kecamatan: {errors}", file=sys.stderr)
    return result


def save(filename: str, data: list[dict]) -> None:
    path = os.path.join(SCRIPT_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"Saved {len(data)} records to {path}")


def main():
    # Province level
    provinsi_path = os.path.join(SCRIPT_DIR, "bridging_provinsi.json")
    if os.path.exists(provinsi_path) and os.path.getsize(provinsi_path) > 10:
        print(f"Loading existing {provinsi_path}")
        with open(provinsi_path) as f:
            provinsi = json.load(f)
    else:
        provinsi = scrape_provinsi()
        save("bridging_provinsi.json", provinsi)

    # Kabupaten level
    kabupaten_path = os.path.join(SCRIPT_DIR, "bridging_kabupaten.json")
    if os.path.exists(kabupaten_path) and os.path.getsize(kabupaten_path) > 10:
        print(f"Loading existing {kabupaten_path}")
        with open(kabupaten_path) as f:
            kabupaten = json.load(f)
    else:
        kabupaten = scrape_kabupaten(provinsi)
        save("bridging_kabupaten.json", kabupaten)

    # Kecamatan level
    kecamatan_path = os.path.join(SCRIPT_DIR, "bridging_kecamatan.json")
    if os.path.exists(kecamatan_path) and os.path.getsize(kecamatan_path) > 10:
        print(f"Loading existing {kecamatan_path}")
        with open(kecamatan_path) as f:
            kecamatan = json.load(f)
    else:
        kecamatan = scrape_kecamatan(kabupaten)
        save("bridging_kecamatan.json", kecamatan)

    # Desa level
    desa_path = os.path.join(SCRIPT_DIR, "bridging_desa.json")
    if os.path.exists(desa_path) and os.path.getsize(desa_path) > 10:
        print(f"Loading existing {desa_path}")
        with open(desa_path) as f:
            desa = json.load(f)
    else:
        desa = scrape_desa(kecamatan)
        save("bridging_desa.json", desa)

    print("\n=== Summary ===")
    print(f"Provinsi:  {len(provinsi)}")
    print(f"Kabupaten: {len(kabupaten)}")
    print(f"Kecamatan: {len(kecamatan)}")
    print(f"Desa:      {len(desa)}")


if __name__ == "__main__":
    main()
