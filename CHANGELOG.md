# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

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

[0.1.0]: https://github.com/sumitroajiprabowo/kode-wilayah-id/releases/tag/v0.1.0
