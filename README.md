# kode-wilayah-id

[![npm version](https://img.shields.io/npm/v/kode-wilayah-id.svg)](https://www.npmjs.com/package/kode-wilayah-id)
[![CI](https://github.com/sumitroajiprabowo/kode-wilayah-id/actions/workflows/ci.yml/badge.svg)](https://github.com/sumitroajiprabowo/kode-wilayah-id/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/sumitroajiprabowo/kode-wilayah-id/branch/main/graph/badge.svg)](https://codecov.io/gh/sumitroajiprabowo/kode-wilayah-id)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Data **kode wilayah Indonesia** lengkap (provinsi, kabupaten/kota, kecamatan, desa/kelurahan) dengan **dual code system**: BPS (Badan Pusat Statistik) dan Kemendagri (Kementerian Dalam Negeri), termasuk kode pos.

```bash
npm install kode-wilayah-id
```

Tidak perlu database, API call, atau file eksternal. Semua data ter-embed di package, langsung pakai.

**Periode data:** 2025 Semester 1 (BPS) - 2025 (Kemendagri)

## Fitur

- **92.108 wilayah** -- 38 provinsi, 514 kabupaten/kota, 7.286 kecamatan, 84.270 desa/kelurahan
- **Dual code system** -- kode BPS (statistik) dan Kemendagri (administrasi) dalam satu package
- **83.762 kode pos** -- mapping kode pos dari PT Pos Indonesia
- **Tree-shakeable** -- import hanya level yang dibutuhkan (provinsi saja = ~2.5 KB)
- **Immutable** -- semua grouped lookup return shallow copy, aman dimutasi tanpa merusak data internal
- **TypeScript-first** -- strict types, auto-complete di IDE
- **Dual ESM + CJS** -- support semua environment (browser, Node.js, Bun, Deno)
- **Zero dependencies** -- hanya data + types
- **Pencarian** -- case-insensitive search di semua level

## Dual Code System

Indonesia memiliki dua sistem kode wilayah yang berbeda:

| Aspek | BPS | Kemendagri |
|-------|-----|------------|
| Instansi | Badan Pusat Statistik | Kementerian Dalam Negeri |
| Fungsi | Keperluan statistik | Keperluan administrasi pemerintahan |
| Format | Numerik tanpa separator | Numerik tanpa separator (dots dihilangkan) |
| Coverage | Semua wilayah | Semua wilayah (kecuali 4 provinsi Papua baru) |

**Catatan:** 4 provinsi pemekaran Papua (kode BPS: 92, 95, 96, 97) belum memiliki kode Kemendagri (`kemendagri_code: null`).

## Performance

Semua modul pakai **lazy-initialized `Map`** untuk lookup O(1). Map dibuat sekali saat pertama kali dibutuhkan, lalu di-cache — panggilan berikutnya instan tanpa overhead.

| Modul | Items | Index Maps | Speedup vs linear scan |
|-------|-------|------------|------------------------|
| `villages` | 84.270 | 5 Maps | ~18.000× |
| `districts` | 7.286 | 4 Maps | ~2.000× |
| `regencies` | 514 | 4 Maps | ~150× |
| `provinces` | 38 | 2 Maps | konsistensi |
| `hierarchy` | semua | 7 Maps | massive pada tree ops |
| `stats` | semua | 3 Maps | no multi-pass filter |

> Angka speedup berdasarkan hasil `npx vitest bench` aktual. Hasil bervariasi tergantung hardware.

```typescript
// Contoh: lookup desa dari 84.270 item
const desa = getVillageByBpsCode("3204052003"); // O(1) via Map, ~0.00003ms

// Contoh: semua desa di satu kecamatan
const desaKec = getVillagesByBpsDistrictCode("3204050"); // O(1) via Map

// Tanpa Map (versi lama): ~1ms per lookup = 30.000× lebih lambat
```

### Immutability

Semua fungsi yang return array (baik `getAll*()`, `getBy*()` grouped, maupun tree `villages`) selalu return **shallow copy**. Aman dimutasi tanpa merusak data internal:

```typescript
const desa = getVillagesByBpsDistrictCode("3204050");
desa.push(customVillage); // aman — tidak merusak index internal
const desaLagi = getVillagesByBpsDistrictCode("3204050"); // tetap original
```

## Instalasi

```bash
npm install kode-wilayah-id
# atau
yarn add kode-wilayah-id
# atau
pnpm add kode-wilayah-id
# atau
bun add kode-wilayah-id
```

## Quick Start

```typescript
import {
  getProvinces,
  getProvinceByBpsCode,
  getProvinceByKemendagriCode,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
  getVillagesByPostalCode,
  searchByName,
} from 'kode-wilayah-id'

// Semua provinsi
const provinces = getProvinces() // Province[] (38 items)

// Lookup by kode BPS
const jabar = getProvinceByBpsCode('32')
// -> { bps_code: "32", kemendagri_code: "32", name: "JAWA BARAT" }

// Lookup by kode Kemendagri
const jabar2 = getProvinceByKemendagriCode('32')

// Cascading: Provinsi -> Kabupaten -> Kecamatan -> Desa
const regencies = getRegenciesByBpsProvinceCode('32')  // 27 kabupaten/kota
const districts = getDistrictsByBpsRegencyCode('3204')  // kecamatan di KAB. BANDUNG
const villages = getVillagesByBpsDistrictCode('3204050') // desa di kec. NAGREG

// Kode pos
const desa = getVillagesByPostalCode('40263') // desa dengan kode pos 40263

// Pencarian case-insensitive
const results = searchByName('bandung')
// -> KAB. BANDUNG, KAB. BANDUNG BARAT, KOTA BANDUNG, ...
```

## API Reference

### Fungsi BPS (Badan Pusat Statistik)

| Function | Parameter | Return | Keterangan |
|----------|-----------|--------|------------|
| `getProvinces()` | -- | `Province[]` | Semua provinsi |
| `getProvinceByBpsCode(code)` | `string` | `Province \| undefined` | Cari provinsi by kode BPS |
| `getRegencies()` | -- | `Regency[]` | Semua kabupaten/kota |
| `getRegenciesByBpsProvinceCode(code)` | `string` | `Regency[]` | Kabupaten/kota di provinsi (kode BPS) |
| `getRegencyByBpsCode(code)` | `string` | `Regency \| undefined` | Cari kabupaten/kota by kode BPS |
| `getDistricts()` | -- | `District[]` | Semua kecamatan |
| `getDistrictsByBpsRegencyCode(code)` | `string` | `District[]` | Kecamatan di kabupaten/kota (kode BPS) |
| `getDistrictByBpsCode(code)` | `string` | `District \| undefined` | Cari kecamatan by kode BPS |
| `getVillages()` | -- | `Village[]` | Semua desa/kelurahan |
| `getVillagesByBpsDistrictCode(code)` | `string` | `Village[]` | Desa di kecamatan (kode BPS) |
| `getVillageByBpsCode(code)` | `string` | `Village \| undefined` | Cari desa by kode BPS |

### Fungsi Kemendagri (Kementerian Dalam Negeri)

| Function | Parameter | Return | Keterangan |
|----------|-----------|--------|------------|
| `getProvinceByKemendagriCode(code)` | `string` | `Province \| undefined` | Cari provinsi by kode Kemendagri |
| `getRegenciesByKemendagriProvinceCode(code)` | `string` | `Regency[]` | Kabupaten/kota di provinsi (kode Kemendagri) |
| `getRegencyByKemendagriCode(code)` | `string` | `Regency \| undefined` | Cari kabupaten/kota by kode Kemendagri |
| `getDistrictsByKemendagriRegencyCode(code)` | `string` | `District[]` | Kecamatan di kabupaten/kota (kode Kemendagri) |
| `getDistrictByKemendagriCode(code)` | `string` | `District \| undefined` | Cari kecamatan by kode Kemendagri |
| `getVillagesByKemendagriDistrictCode(code)` | `string` | `Village[]` | Desa di kecamatan (kode Kemendagri) |
| `getVillageByKemendagriCode(code)` | `string` | `Village \| undefined` | Cari desa by kode Kemendagri |

### Fungsi Kode Pos dan Pencarian

| Function | Parameter | Return | Keterangan |
|----------|-----------|--------|------------|
| `getVillagesByPostalCode(code)` | `string` | `Village[]` | Desa/kelurahan by kode pos |
| `searchByName(query, options?)` | `string, SearchOptions?` | `SearchResult[]` | Pencarian case-insensitive dengan opsi filter level dan limit |

### Fungsi Hierarki (Reverse Lookup & Drill-down)

| Function | Parameter | Return | Keterangan |
|----------|-----------|--------|------------|
| `getVillageWithParents(code)` | `string` | `VillageHierarchy \| undefined` | Dari desa → kecamatan → kabupaten → provinsi |
| `getDistrictWithParents(code)` | `string` | `DistrictHierarchy \| undefined` | Dari kecamatan → kabupaten → provinsi |
| `getRegencyWithParent(code)` | `string` | `RegencyHierarchy \| undefined` | Dari kabupaten → provinsi |
| `getProvinceTree(code)` | `string` | `ProvinceTree \| undefined` | Tree provinsi → kabupaten → kecamatan → desa |
| `getRegencyTree(code)` | `string` | `RegencyNode \| undefined` | Tree kabupaten → kecamatan → desa |
| `getDistrictTree(code)` | `string` | `DistrictNode \| undefined` | Tree kecamatan → desa |

### Fungsi Statistik

| Function | Parameter | Return | Keterangan |
|----------|-----------|--------|------------|
| `getRegencyCountByProvince(code)` | `string` | `number` | Jumlah kabupaten/kota di provinsi |
| `getDistrictCountByRegency(code)` | `string` | `number` | Jumlah kecamatan di kabupaten |
| `getVillageCountByDistrict(code)` | `string` | `number` | Jumlah desa di kecamatan |
| `getDistrictCountByProvince(code)` | `string` | `number` | Jumlah kecamatan di provinsi |
| `getVillageCountByRegency(code)` | `string` | `number` | Jumlah desa di kabupaten |
| `getVillageCountByProvince(code)` | `string` | `number` | Jumlah desa di provinsi |
| `getSummary()` | -- | `object` | Ringkasan total semua level |

## Tree-shaking / Sub-path Imports

Import hanya data yang dibutuhkan -- bundler hanya include JSON yang di-import:

```typescript
// Hanya provinsi (~2.5 KB)
import { getProvinces } from 'kode-wilayah-id/provinces'

// Hanya kabupaten (~55 KB)
import { getRegenciesByBpsProvinceCode } from 'kode-wilayah-id/regencies'

// Hanya kecamatan (~750 KB)
import { getDistrictsByBpsRegencyCode } from 'kode-wilayah-id/districts'

// Hanya desa (~12 MB) -- hati-hati bundle size!
import { getVillagesByBpsDistrictCode } from 'kode-wilayah-id/villages'

// Hierarchy -- reverse lookup & drill-down tree (~13 MB, loads all)
import { getVillageWithParents, getProvinceTree } from 'kode-wilayah-id/hierarchy'

// Stats -- penghitungan wilayah (~13 MB, loads all)
import { getSummary, getRegencyCountByProvince } from 'kode-wilayah-id/stats'

// Types only (zero runtime)
import type { Province, Regency } from 'kode-wilayah-id/types'
```

### Bundle Size per Module

| Import | Data Size |
|--------|-----------|
| `kode-wilayah-id/provinces` | ~2.5 KB |
| `kode-wilayah-id/regencies` | ~55 KB |
| `kode-wilayah-id/districts` | ~750 KB |
| `kode-wilayah-id/villages` | ~12 MB |
| `kode-wilayah-id/hierarchy` | ~13 MB (loads all) |
| `kode-wilayah-id/stats` | ~13 MB (loads all) |
| `kode-wilayah-id/search` | ~13 MB (loads all) |
| `kode-wilayah-id` (full) | ~13 MB |

## Contoh Penggunaan

Lihat folder [`examples/`](examples/) untuk contoh lengkap di berbagai framework dan runtime:

| Framework | File | Fitur |
|-----------|------|-------|
| **Node.js** | [`node.ts`](examples/node.ts) | Basic usage — semua fungsi API |
| **React** | [`react.tsx`](examples/react.tsx) | Cascading dropdown + search component |
| **Next.js** | [`nextjs.tsx`](examples/nextjs.tsx) | API route + server component |
| **Vue 3** | [`vue.vue`](examples/vue.vue) | Cascading dropdown (Composition API) |
| **Nuxt 3** | [`nuxt.vue`](examples/nuxt.vue) | Server API + composable + page |
| **Svelte 5** | [`svelte.svelte`](examples/svelte.svelte) | Cascading dropdown (runes) |
| **SvelteKit** | [`sveltekit.ts`](examples/sveltekit.ts) | Server load + API endpoint |
| **Angular** | [`angular.ts`](examples/angular.ts) | Service + component |
| **Express** | [`express.ts`](examples/express.ts) | REST API lengkap |
| **Hono** | [`hono.ts`](examples/hono.ts) | Lightweight REST API |
| **Bun** | [`bun.ts`](examples/bun.ts) | Native Bun HTTP server |
| **Deno** | [`deno.ts`](examples/deno.ts) | Native Deno server |

```bash
# Jalankan contoh Node.js
npx tsx examples/node.ts
```

## Data

| Level | Jumlah |
|-------|--------|
| Provinsi | 38 |
| Kabupaten/Kota | 514 |
| Kecamatan | 7.286 |
| Desa/Kelurahan | 84.270 |
| Kode Pos (mapping) | 83.762 |
| **Total wilayah** | **92.108** |

### Sumber Data

| Sumber | Keterangan |
|--------|------------|
| [BPS (Badan Pusat Statistik)](https://www.bps.go.id/) | Kode wilayah dan bridging BPS-Kemendagri, periode 2025 Semester 1 |
| [BPS SIG Bridging Kode](https://sig.bps.go.id/bridging-kode/index) | API endpoint data wilayah |
| Kemendagri | Kepmendagri No 300.2.2-2138 Tahun 2025 (via [cahyadsn/wilayah_kodepos](https://github.com/cahyadsn/wilayah_kodepos), MIT license) |
| PT Pos Indonesia | Kode pos (via Kemendagri dataset) |

**Periode data:** 2025 Semester 1 (BPS) - 2025 (Kemendagri)

## Format Kode

### Format Kode BPS

```
32           -> Provinsi (JAWA BARAT)
3204         -> Kabupaten/Kota (KAB. BANDUNG)
3204050      -> Kecamatan (NAGREG)
3204052003   -> Desa/Kelurahan (NAGREG)
```

| Level | Panjang Kode | Contoh |
|-------|-------------|--------|
| Provinsi | 2 digit | `"32"` |
| Kabupaten/Kota | 4 digit | `"3204"` |
| Kecamatan | 7 digit | `"3204050"` |
| Desa/Kelurahan | 10 digit | `"3204052003"` |

### Format Kode Kemendagri

Kode Kemendagri disimpan tanpa titik (dots dihilangkan):

```
32           -> Provinsi (JAWA BARAT)
3204         -> Kabupaten/Kota (KAB. BANDUNG)
320407       -> Kecamatan (NAGREG)
3204072003   -> Desa/Kelurahan (NAGREG)
```

| Level | Panjang Kode | Contoh |
|-------|-------------|--------|
| Provinsi | 2 digit | `"32"` |
| Kabupaten/Kota | 4 digit | `"3204"` |
| Kecamatan | 6 digit | `"320407"` |
| Desa/Kelurahan | 10 digit | `"3204072003"` |

**Catatan:** Kode BPS dan Kemendagri bisa berbeda di level kecamatan dan desa. Selalu gunakan fungsi yang sesuai dengan sistem kode yang dipakai.

## TypeScript

Semua function dan data fully typed. IDE auto-complete bekerja out of the box:

```typescript
import type { Province, Regency, District, Village, SearchResult } from 'kode-wilayah-id/types'

// Province
interface Province {
  bps_code: string
  kemendagri_code: string | null
  name: string
}

// Regency
interface Regency {
  bps_code: string
  kemendagri_code: string | null
  bps_province_code: string
  kemendagri_province_code: string | null
  name: string
}

// District
interface District {
  bps_code: string
  kemendagri_code: string | null
  bps_regency_code: string
  kemendagri_regency_code: string | null
  name: string
}

// Village
interface Village {
  bps_code: string
  kemendagri_code: string | null
  bps_district_code: string
  kemendagri_district_code: string | null
  name: string
  postal_code: string | null
}
```

## Migrasi dari v0.x ke v1.0

v1.0 memperkenalkan **breaking changes** untuk mendukung dual code system. Berikut panduan migrasi:

### Perubahan Nama Field

| v0.x | v1.0 |
|------|------|
| `id` | `bps_code` |
| `province_id` | `bps_province_code` |
| `regency_id` | `bps_regency_code` |
| `district_id` | `bps_district_code` |

### Perubahan Nama Fungsi

| v0.x | v1.0 |
|------|------|
| `getProvinceById(id)` | `getProvinceByBpsCode(code)` |
| `getRegencyById(id)` | `getRegencyByBpsCode(code)` |
| `getRegenciesByProvinceId(id)` | `getRegenciesByBpsProvinceCode(code)` |
| `getDistrictById(id)` | `getDistrictByBpsCode(code)` |
| `getDistrictsByRegencyId(id)` | `getDistrictsByBpsRegencyCode(code)` |
| `getVillageById(id)` | `getVillageByBpsCode(code)` |
| `getVillagesByDistrictId(id)` | `getVillagesByBpsDistrictCode(code)` |

### Field Baru di v1.0

Semua type sekarang memiliki field tambahan:
- `kemendagri_code` -- kode Kemendagri (`string | null`)
- `kemendagri_province_code` / `kemendagri_regency_code` / `kemendagri_district_code` -- kode parent Kemendagri
- `postal_code` -- kode pos pada Village (`string | null`)

### Contoh Migrasi

```typescript
// v0.x
const province = getProvinceById('32')
console.log(province?.id) // "32"
const regencies = getRegenciesByProvinceId('32')
regencies.forEach(r => console.log(r.id, r.province_id))

// v1.0
const province = getProvinceByBpsCode('32')
console.log(province?.bps_code) // "32"
console.log(province?.kemendagri_code) // "32" (field baru)
const regencies = getRegenciesByBpsProvinceCode('32')
regencies.forEach(r => console.log(r.bps_code, r.bps_province_code))
```

## Contributing

Kontribusi sangat diterima! Baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan lengkap.

```bash
git clone https://github.com/sumitroajiprabowo/kode-wilayah-id.git
cd kode-wilayah-id
npm install
npm run lint          # Lint check
npm run format:check  # Format check
npm run typecheck     # TypeScript check
npm run test:coverage # Test dengan coverage
npm run build         # Build ESM + CJS
npx vitest bench      # Benchmark Map vs Array
```

## Security

Untuk melaporkan kerentanan keamanan, baca [SECURITY.md](SECURITY.md).

## Changelog

Lihat [CHANGELOG.md](CHANGELOG.md) untuk riwayat perubahan.

## Lisensi

[MIT](LICENSE) (c) [Sumitro Aji Prabowo](https://github.com/sumitroajiprabowo)

## Acknowledgments

- [BPS (Badan Pusat Statistik)](https://www.bps.go.id/) -- sumber data kode wilayah Indonesia
- [BPS SIG Bridging Kode](https://sig.bps.go.id/bridging-kode/index) -- API endpoint data wilayah dan bridging BPS-Kemendagri
- [Kemendagri](https://www.kemendagri.go.id/) -- Kepmendagri No 300.2.2-2138 Tahun 2025
- [cahyadsn/wilayah_kodepos](https://github.com/cahyadsn/wilayah_kodepos) -- data Kemendagri dan kode pos (MIT license)
- [PT Pos Indonesia](https://www.posindonesia.co.id/) -- sumber data kode pos
