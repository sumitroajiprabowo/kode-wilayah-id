#!/usr/bin/env python3
"""Merge BPS data with bridging and kodepos to produce enriched JSON.

Reads:
  data/provinces.json, regencies.json, districts.json, villages.json (v0.1 format)
  scripts/bridging_provinsi.json, bridging_kabupaten.json, bridging_kecamatan.json, bridging_desa.json
  scripts/kodepos_map.json

Writes:
  data/provinces.json, regencies.json, districts.json, villages.json (v1.0 format)
"""
import json
import os
import sys

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_DIR, "data")
SCRIPT_DIR = os.path.join(PROJECT_DIR, "scripts")


def load_json(path: str) -> list | dict:
    with open(path) as f:
        return json.load(f)


def save_json(path: str, data: list) -> None:
    with open(path, "w") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"Saved {len(data)} records to {path}")


def build_bridging_map(bridging: list[dict]) -> dict[str, str]:
    """Build { bps_code: kemendagri_code } map from bridging data."""
    return {item["kode_bps"]: item["kode_dagri"] for item in bridging}


def merge_provinces(provinces: list[dict], bridging_map: dict[str, str]) -> list[dict]:
    result = []
    for p in provinces:
        dagri = bridging_map.get(p["id"])
        result.append({
            "bps_code": p["id"],
            "kemendagri_code": dagri if dagri else None,
            "name": p["name"],
        })
    return result


def merge_regencies(
    regencies: list[dict],
    bridging_map: dict[str, str],
    prov_bridging_map: dict[str, str],
) -> list[dict]:
    result = []
    for r in regencies:
        dagri = bridging_map.get(r["id"])
        dagri_prov = prov_bridging_map.get(r["province_id"])
        result.append({
            "bps_code": r["id"],
            "kemendagri_code": dagri if dagri else None,
            "bps_province_code": r["province_id"],
            "kemendagri_province_code": dagri_prov if dagri_prov else None,
            "name": r["name"],
        })
    return result


def merge_districts(
    districts: list[dict],
    bridging_map: dict[str, str],
    reg_bridging_map: dict[str, str],
) -> list[dict]:
    result = []
    for d in districts:
        dagri = bridging_map.get(d["id"])
        dagri_reg = reg_bridging_map.get(d["regency_id"])
        result.append({
            "bps_code": d["id"],
            "kemendagri_code": dagri if dagri else None,
            "bps_regency_code": d["regency_id"],
            "kemendagri_regency_code": dagri_reg if dagri_reg else None,
            "name": d["name"],
        })
    return result


def merge_villages(
    villages: list[dict],
    bridging_map: dict[str, str],
    dist_bridging_map: dict[str, str],
    kodepos_map: dict[str, str],
) -> list[dict]:
    result = []
    for v in villages:
        dagri = bridging_map.get(v["id"])
        dagri_dist = dist_bridging_map.get(v["district_id"])
        postal = kodepos_map.get(dagri) if dagri else None
        result.append({
            "bps_code": v["id"],
            "kemendagri_code": dagri if dagri else None,
            "bps_district_code": v["district_id"],
            "kemendagri_district_code": dagri_dist if dagri_dist else None,
            "name": v["name"],
            "postal_code": postal if postal else None,
        })
    return result


def validate(provinces, regencies, districts, villages):
    """Run validation checks on merged data."""
    errors = []

    # Unique BPS codes
    for level_name, data, key in [
        ("provinces", provinces, "bps_code"),
        ("regencies", regencies, "bps_code"),
        ("districts", districts, "bps_code"),
        ("villages", villages, "bps_code"),
    ]:
        codes = [item[key] for item in data]
        if len(codes) != len(set(codes)):
            errors.append(f"Duplicate BPS codes in {level_name}")

    # Unique non-null Kemendagri codes
    for level_name, data in [
        ("provinces", provinces),
        ("regencies", regencies),
        ("districts", districts),
        ("villages", villages),
    ]:
        codes = [item["kemendagri_code"] for item in data if item["kemendagri_code"] is not None]
        if len(codes) != len(set(codes)):
            dups = set(c for c in codes if codes.count(c) > 1)
            errors.append(f"Duplicate Kemendagri codes in {level_name}: {dups}")

    # Referential integrity
    prov_bps = {p["bps_code"] for p in provinces}
    for r in regencies:
        if r["bps_province_code"] not in prov_bps:
            errors.append(f"Regency {r['bps_code']} references invalid province {r['bps_province_code']}")

    reg_bps = {r["bps_code"] for r in regencies}
    for d in districts:
        if d["bps_regency_code"] not in reg_bps:
            errors.append(f"District {d['bps_code']} references invalid regency {d['bps_regency_code']}")

    dist_bps = {d["bps_code"] for d in districts}
    for v in villages:
        if v["bps_district_code"] not in dist_bps:
            errors.append(f"Village {v['bps_code']} references invalid district {v['bps_district_code']}")

    # No empty strings
    for level_name, data in [
        ("provinces", provinces),
        ("regencies", regencies),
        ("districts", districts),
        ("villages", villages),
    ]:
        for item in data:
            for key, val in item.items():
                if val == "":
                    errors.append(f"Empty string in {level_name} {item.get('bps_code', '?')}.{key}")

    # Coverage stats
    v_with_dagri = sum(1 for v in villages if v["kemendagri_code"] is not None)
    v_with_postal = sum(1 for v in villages if v["postal_code"] is not None)
    print(f"\n=== Coverage ===")
    print(f"Villages total:          {len(villages)}")
    print(f"Villages with kemendagri: {v_with_dagri} ({100*v_with_dagri/len(villages):.1f}%)")
    print(f"Villages with postal:     {v_with_postal} ({100*v_with_postal/len(villages):.1f}%)")
    print(f"Villages null kemendagri: {len(villages) - v_with_dagri}")

    if errors:
        print(f"\n=== VALIDATION ERRORS ({len(errors)}) ===", file=sys.stderr)
        for e in errors:
            print(f"  ✗ {e}", file=sys.stderr)
        sys.exit(1)
    else:
        print("\n=== All validation checks passed ===")


def main():
    # Load existing data
    provinces = load_json(os.path.join(DATA_DIR, "provinces.json"))
    regencies = load_json(os.path.join(DATA_DIR, "regencies.json"))
    districts = load_json(os.path.join(DATA_DIR, "districts.json"))
    villages = load_json(os.path.join(DATA_DIR, "villages.json"))

    # Load bridging data
    prov_bridging = build_bridging_map(load_json(os.path.join(SCRIPT_DIR, "bridging_provinsi.json")))
    reg_bridging = build_bridging_map(load_json(os.path.join(SCRIPT_DIR, "bridging_kabupaten.json")))
    dist_bridging = build_bridging_map(load_json(os.path.join(SCRIPT_DIR, "bridging_kecamatan.json")))
    desa_bridging = build_bridging_map(load_json(os.path.join(SCRIPT_DIR, "bridging_desa.json")))

    # Load kodepos
    kodepos_map = load_json(os.path.join(SCRIPT_DIR, "kodepos_map.json"))

    # Merge
    new_provinces = merge_provinces(provinces, prov_bridging)
    new_regencies = merge_regencies(regencies, reg_bridging, prov_bridging)
    new_districts = merge_districts(districts, dist_bridging, reg_bridging)
    new_villages = merge_villages(villages, desa_bridging, dist_bridging, kodepos_map)

    # Validate
    validate(new_provinces, new_regencies, new_districts, new_villages)

    # Save (overwrite existing v0.1 format)
    save_json(os.path.join(DATA_DIR, "provinces.json"), new_provinces)
    save_json(os.path.join(DATA_DIR, "regencies.json"), new_regencies)
    save_json(os.path.join(DATA_DIR, "districts.json"), new_districts)
    save_json(os.path.join(DATA_DIR, "villages.json"), new_villages)


if __name__ == "__main__":
    main()
