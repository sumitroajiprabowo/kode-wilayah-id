# kode-wilayah-id v1.0 — Dual Code System + Kodepos Design

## Goal

Upgrade kode-wilayah-id from a BPS-only dataset to a comprehensive dual-code system that provides both BPS and Kemendagri administrative codes for all Indonesian regions, plus postal codes at the village level. This is a breaking v1.0 release.

## Background

Indonesia has two official administrative code systems:

- **BPS (Badan Pusat Statistik):** Used for statistics and census. Format: `PP.RRRR.DDD.SSS` (2+2+3+3 = 10 digits for villages). Source: sig.bps.go.id, period 2025 Semester 1.
- **Kemendagri (Kementerian Dalam Negeri):** Used for government administration (KTP, Dukcapil). Format: `PP.RR.DD.SSSS` (2+2+2+4 = 10 digits for villages, stored without dots). Source: Kepmendagri No 300.2.2-2138 Tahun 2025.

The codes refer to the same regions but use different numbering. Example:

| Region | BPS Code | Kemendagri Code |
|---|---|---|
| Kab. Simeulue | `1101` | `1109` |
| Kec. Taman, Pemalang | `3327090` | `332709` |
| Desa Banjardawa | `3327090011` | `3327092009` |

Postal codes (kodepos) are mapped per village/kelurahan from Kemendagri data (83,762 records, 10,632 unique postal codes, all 5-digit).

## Data Sources

1. **BPS Wilayah (existing):** 38 provinces, 514 regencies, 7,286 districts, 84,270 villages. Already in `data/*.json`.
2. **BPS Bridging API:** `https://sig.bps.go.id/rest-bridging/getwilayah?level={level}&parent={code}&periode=2025s1`. Provides BPS ↔ Kemendagri mapping. Covers 34 of 38 provinces (missing 4 new Papua provinces: Papua Barat Daya, Papua Selatan, Papua Tengah, Papua Pegunungan = 5,588 villages).
3. **Kemendagri Kodepos:** `cahyadsn/wilayah_kodepos` on GitHub. SQL dump, MIT license. 83,762 village-to-kodepos mappings based on Kepmendagri 2025. Kode format: `PP.RR.DD.SSSS` with dots (we store without dots).

## Type Definitions

```typescript
/** Provinsi */
interface Province {
  bps_code: string;              // "33" — always present
  kemendagri_code: string | null; // "33" — null for 4 Papua provinces
  name: string;                  // "JAWA TENGAH"
}

/** Kabupaten/Kota */
interface Regency {
  bps_code: string;              // "3327"
  kemendagri_code: string | null; // "3327"
  bps_province_code: string;     // "33"
  kemendagri_province_code: string | null; // "33"
  name: string;                  // "KAB. PEMALANG"
}

/** Kecamatan */
interface District {
  bps_code: string;              // "3327090"
  kemendagri_code: string | null; // "332709"
  bps_regency_code: string;      // "3327"
  kemendagri_regency_code: string | null; // "3327"
  name: string;                  // "TAMAN"
}

/** Desa/Kelurahan */
interface Village {
  bps_code: string;              // "3327090011"
  kemendagri_code: string | null; // "3327092009"
  bps_district_code: string;     // "3327090"
  kemendagri_district_code: string | null; // "332709"
  name: string;                  // "BANJARDAWA"
  postal_code: string | null;    // "52361"
}

/** Hasil pencarian — discriminated union by level */
type SearchResult =
  | { level: "province"; data: Province }
  | { level: "regency"; data: Regency }
  | { level: "district"; data: District }
  | { level: "village"; data: Village };
```

### Null semantics

- `kemendagri_code` is `null` when no BPS bridging data exists (4 Papua provinces, ~5,588 villages).
- `postal_code` is `null` when either (a) no Kemendagri code exists for the village, or (b) the Kemendagri kodepos dataset has no entry for that code.
- `bps_code` is never null — BPS data is the primary dataset.
- Parent code nullability follows: if a village has `kemendagri_code: null`, then `kemendagri_district_code` is also `null` (its parent district's Kemendagri code is propagated, not independently resolved).

## API Functions

### provinces module (`kode-wilayah-id/provinces`)

| Function | Return | Description |
|---|---|---|
| `getProvinces()` | `Province[]` | All provinces (shallow copy) |
| `getProvinceByBpsCode(code)` | `Province \| undefined` | Find by BPS code |
| `getProvinceByKemendagriCode(code)` | `Province \| undefined` | Find by Kemendagri code |

### regencies module (`kode-wilayah-id/regencies`)

| Function | Return | Description |
|---|---|---|
| `getRegencies()` | `Regency[]` | All regencies |
| `getRegenciesByBpsProvinceCode(code)` | `Regency[]` | Filter by BPS province code |
| `getRegenciesByKemendagriProvinceCode(code)` | `Regency[]` | Filter by Kemendagri province code |
| `getRegencyByBpsCode(code)` | `Regency \| undefined` | Find by BPS code |
| `getRegencyByKemendagriCode(code)` | `Regency \| undefined` | Find by Kemendagri code |

### districts module (`kode-wilayah-id/districts`)

| Function | Return | Description |
|---|---|---|
| `getDistricts()` | `District[]` | All districts |
| `getDistrictsByBpsRegencyCode(code)` | `District[]` | Filter by BPS regency code |
| `getDistrictsByKemendagriRegencyCode(code)` | `District[]` | Filter by Kemendagri regency code |
| `getDistrictByBpsCode(code)` | `District \| undefined` | Find by BPS code |
| `getDistrictByKemendagriCode(code)` | `District \| undefined` | Find by Kemendagri code |

### villages module (`kode-wilayah-id/villages`)

| Function | Return | Description |
|---|---|---|
| `getVillages()` | `Village[]` | All villages |
| `getVillagesByBpsDistrictCode(code)` | `Village[]` | Filter by BPS district code |
| `getVillagesByKemendagriDistrictCode(code)` | `Village[]` | Filter by Kemendagri district code |
| `getVillageByBpsCode(code)` | `Village \| undefined` | Find by BPS code |
| `getVillageByKemendagriCode(code)` | `Village \| undefined` | Find by Kemendagri code |
| `getVillagesByPostalCode(code)` | `Village[]` | Find all villages with this postal code |

### search module (`kode-wilayah-id/search`)

| Function | Return | Description |
|---|---|---|
| `searchByName(query)` | `SearchResult[]` | Case-insensitive search across all levels |

Search behavior unchanged — searches by `name` field, returns new type shapes.

### index module (`kode-wilayah-id`)

Re-exports all types and functions from all modules.

## Data Pipeline

The data pipeline is a one-time scraping + merge process, run locally before build. It produces the enriched JSON files that ship with the package.

### Step 1: Scrape BPS Bridging (desa level)

```
For each of 7,286 kecamatan in data/districts.json:
  GET https://sig.bps.go.id/rest-bridging/getwilayah
    ?level=desa&parent={bps_kecamatan_code}&periode=2025s1
  
  Response: [{ kode_bps, nama_bps, kode_dagri, nama_dagri }, ...]
```

- Rate limit: 50ms delay between requests, retry on timeout (max 3 retries)
- Expected: ~84K records (minus ~5.6K from 4 missing Papua provinces)
- Output: `scripts/bridging_desa.json` — array of `{ bps_code, kemendagri_code }` pairs
- Also collect province, regency, district level bridging (already partially done)

### Step 2: Download Kemendagri Kodepos

```
Download: https://raw.githubusercontent.com/cahyadsn/wilayah_kodepos/main/db/wilayah_kodepos.sql
Parse SQL INSERT values: ('PP.RR.DD.SSSS', 'XXXXX') 
Strip dots from code: 'PP.RR.DD.SSSS' → 'PPRRDDSSSS'
Output: scripts/kodepos_map.json — { kemendagri_code: postal_code }
```

### Step 3: Merge and Generate

```
For each village in current data/villages.json:
  1. Look up kemendagri_code from bridging_desa.json (by bps_code)
  2. Look up postal_code from kodepos_map.json (by kemendagri_code)
  3. If no bridging exists: kemendagri_code = null, postal_code = null
  4. If bridging exists but no kodepos: kemendagri_code = value, postal_code = null
```

Same process for provinces, regencies, districts (without postal_code).

Output: enriched `data/provinces.json`, `data/regencies.json`, `data/districts.json`, `data/villages.json`.

### Step 4: Validation

After merge, validate:
- All BPS codes are unique per level
- All non-null Kemendagri codes are unique per level
- Referential integrity: village's bps_district_code exists in districts
- Referential integrity: village's kemendagri_district_code matches parent district's kemendagri_code
- Coverage stats: how many villages have kemendagri_code, how many have postal_code
- No empty strings (use null, not "")

## Breaking Changes from v0.1

| v0.1 Field | v1.0 Replacement |
|---|---|
| `id` | `bps_code` |
| `province_id` | `bps_province_code` |
| `regency_id` | `bps_regency_code` |
| `district_id` | `bps_district_code` |

| v0.1 Function | v1.0 Replacement |
|---|---|
| `getProvinceById()` | `getProvinceByBpsCode()` |
| `getRegencyById()` | `getRegencyByBpsCode()` |
| `getRegenciesByProvinceId()` | `getRegenciesByBpsProvinceCode()` |
| `getDistrictById()` | `getDistrictByBpsCode()` |
| `getDistrictsByRegencyId()` | `getDistrictsByBpsRegencyCode()` |
| `getVillageById()` | `getVillageByBpsCode()` |
| `getVillagesByDistrictId()` | `getVillagesByBpsDistrictCode()` |

New functions (no v0.1 equivalent):
- `get*ByKemendagriCode()` — lookup by Kemendagri code
- `get*sByKemendagri*Code()` — filter by Kemendagri parent code
- `getVillagesByPostalCode()` — lookup by kodepos

## Package Structure

```
kode-wilayah-id/
├── data/
│   ├── provinces.json     # enriched with kemendagri_code
│   ├── regencies.json     # enriched with kemendagri codes
│   ├── districts.json     # enriched with kemendagri codes
│   └── villages.json      # enriched with kemendagri_code + postal_code
├── scripts/               # data pipeline (not published)
│   ├── scrape-bridging.ts # scrape BPS bridging API
│   ├── scrape-kodepos.ts  # download + parse kodepos SQL
│   └── merge-data.ts      # merge and generate enriched JSON
├── src/
│   ├── types.ts
│   ├── provinces.ts
│   ├── regencies.ts
│   ├── districts.ts
│   ├── villages.ts
│   ├── search.ts
│   └── index.ts
├── tests/
│   ├── provinces.test.ts
│   ├── regencies.test.ts
│   ├── districts.test.ts
│   ├── villages.test.ts
│   ├── search.test.ts
│   └── integration.test.ts
└── ...
```

## Estimated Package Size

| Module | v0.1 | v1.0 (estimated) |
|---|---|---|
| provinces | ~1.9 KB | ~2.5 KB |
| regencies | ~41 KB | ~55 KB |
| districts | ~573 KB | ~750 KB |
| villages | ~7.2 MB | ~12 MB |
| **Total (compressed)** | **~4.6 MB** | **~8 MB** |

## Coverage Expectations

| Metric | Count | Coverage |
|---|---|---|
| Villages with BPS code | 84,270 | 100% |
| Villages with Kemendagri code | ~78,682 | ~93.4% |
| Villages with postal code | ~78,000 | ~92.5% |
| Villages with null Kemendagri | ~5,588 | 4 Papua provinces |

## Testing Requirements

- 100% code coverage maintained
- All existing test patterns updated for new field names
- New tests for Kemendagri lookup functions
- New tests for postal code lookup
- Integration tests for null handling (Papua provinces)
- Integration tests for referential integrity across both code systems

## Data Source Attribution

- BPS (Badan Pusat Statistik) — kode wilayah dan bridging BPS-Kemendagri, periode 2025 S1
- Kemendagri — Kepmendagri No 300.2.2-2138 Tahun 2025 (via cahyadsn/wilayah_kodepos, MIT license)
- PT Pos Indonesia — kode pos (via Kemendagri dataset)
