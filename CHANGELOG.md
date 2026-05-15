# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [1.1.0] - 2026-05-15

### Added

- Modul `hierarchy` — reverse lookup dan drill-down tree
  - `getVillageWithParents()` — dari desa, dapat kecamatan + kabupaten + provinsi
  - `getDistrictWithParents()` — dari kecamatan, dapat kabupaten + provinsi
  - `getRegencyWithParent()` — dari kabupaten, dapat provinsi
  - `getProvinceTree()` — tree lengkap provinsi → kabupaten → kecamatan → desa
  - `getRegencyTree()` — tree kabupaten → kecamatan → desa
  - `getDistrictTree()` — tree kecamatan → desa
- Modul `stats` — penghitungan wilayah
  - `getRegencyCountByProvince()`, `getDistrictCountByRegency()`, `getVillageCountByDistrict()`
  - `getDistrictCountByProvince()`, `getVillageCountByRegency()`, `getVillageCountByProvince()`
  - `getSummary()` — ringkasan total semua level
- `searchByName()` sekarang menerima parameter kedua `options`:
  - `level` — filter pencarian ke satu level tertentu
  - `limit` — batasi jumlah hasil (berguna untuk autocomplete)
- Tipe baru: `VillageHierarchy`, `DistrictHierarchy`, `RegencyHierarchy`, `ProvinceTree`, `RegencyNode`, `DistrictNode`, `SearchOptions`

## [1.0.0] - 2025-05-15

### Added

- **Dual code system** — kode BPS dan Kemendagri di semua level (provinsi, kabupaten, kecamatan, desa)
- Kode pos (postal code) di level desa/kelurahan (~83.762 mapping)
- `getProvinceByBpsCode()`, `getProvinceByKemendagriCode()`
- `getRegencyByBpsCode()`, `getRegencyByKemendagriCode()`
- `getRegenciesByBpsProvinceCode()`, `getRegenciesByKemendagriProvinceCode()`
- `getDistrictByBpsCode()`, `getDistrictByKemendagriCode()`
- `getDistrictsByBpsRegencyCode()`, `getDistrictsByKemendagriRegencyCode()`
- `getVillageByBpsCode()`, `getVillageByKemendagriCode()`
- `getVillagesByBpsDistrictCode()`, `getVillagesByKemendagriDistrictCode()`
- `getVillagesByPostalCode()` — pencarian desa berdasarkan kode pos
- Data pipeline scripts (TypeScript) untuk scraping BPS bridging API dan parsing kodepos Kemendagri
- Contoh penggunaan (`examples/`) untuk 12 framework: React, Next.js, Vue, Nuxt, Svelte, SvelteKit, Angular, Express, Hono, Bun, Deno, Node.js

### Changed

- **BREAKING:** Field `id` diganti `bps_code` di semua level
- **BREAKING:** Field `province_id` diganti `bps_province_code`
- **BREAKING:** Field `regency_id` diganti `bps_regency_code`
- **BREAKING:** Field `district_id` diganti `bps_district_code`
- **BREAKING:** Semua fungsi `*ById()` diganti `*ByBpsCode()`
- **BREAKING:** Semua fungsi `*ByProvinceId()` diganti `*ByBpsProvinceCode()` (dst.)

### Data Source

- BPS (Badan Pusat Statistik) — kode wilayah dan bridging BPS-Kemendagri, periode 2025 Semester 1
- Kemendagri — Kepmendagri No 300.2.2-2138 Tahun 2025 (via cahyadsn/wilayah_kodepos, MIT license)
- PT Pos Indonesia — kode pos (via Kemendagri dataset)

## [0.1.0] - 2025-05-15

### Added

- Data lengkap 92.108 wilayah Indonesia (38 provinsi, 514 kabupaten/kota, 7.286 kecamatan, 84.270 desa/kelurahan)
- Modul `provinces` — `getProvinces()`, `getProvinceById()`
- Modul `regencies` — `getRegencies()`, `getRegenciesByProvinceId()`, `getRegencyById()`
- Modul `districts` — `getDistricts()`, `getDistrictsByRegencyId()`, `getDistrictById()`
- Modul `villages` — `getVillages()`, `getVillagesByDistrictId()`, `getVillageById()`
- Modul `search` — `searchByName()` pencarian case-insensitive di semua level
- Tree-shakeable sub-path imports (`kode-wilayah-id/provinces`, dll.)
- Dual ESM + CJS output
- TypeScript strict types dengan auto-complete
- 100% test coverage
- Zero runtime dependencies

### Data Source

- BPS SIG Bridging Kode — Periode 2025 Semester 1 (BPS) - 2025 (Kemendagri)

[1.1.0]: https://github.com/sumitroajiprabowo/kode-wilayah-id/releases/tag/v1.1.0
[1.0.0]: https://github.com/sumitroajiprabowo/kode-wilayah-id/releases/tag/v1.0.0
[0.1.0]: https://github.com/sumitroajiprabowo/kode-wilayah-id/releases/tag/v0.1.0
