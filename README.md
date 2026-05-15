# kode-wilayah-id

[![npm version](https://img.shields.io/npm/v/kode-wilayah-id.svg)](https://www.npmjs.com/package/kode-wilayah-id)
[![CI](https://github.com/sumitroajiprabowo/kode-wilayah-id/actions/workflows/ci.yml/badge.svg)](https://github.com/sumitroajiprabowo/kode-wilayah-id/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/sumitroajiprabowo/kode-wilayah-id/branch/main/graph/badge.svg)](https://codecov.io/gh/sumitroajiprabowo/kode-wilayah-id)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-green.svg)](https://nodejs.org/)
[![Bundle Size](https://img.shields.io/badge/provinces-2.5KB-green.svg)](https://www.npmjs.com/package/kode-wilayah-id)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.com/package/kode-wilayah-id)

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
  getVillagesByPostalCode,
  searchByName,
} from 'kode-wilayah-id'

// Semua provinsi
const provinces = getProvinces() // Province[] (38 items)

// Cari provinsi by kode BPS
const jabar = getProvinceByBpsCode('32')
console.log(jabar?.name) // "JAWA BARAT"
console.log(jabar?.bps_code) // "32"
console.log(jabar?.kemendagri_code) // "32"

// Cari provinsi by kode Kemendagri
const jabar2 = getProvinceByKemendagriCode('32')
console.log(jabar2?.name) // "JAWA BARAT"

// Cari desa/kelurahan by kode pos
const villages = getVillagesByPostalCode('40263')
console.log(villages.length) // jumlah desa dengan kode pos 40263

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
| `searchByName(query)` | `string` | `SearchResult[]` | Pencarian case-insensitive |

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
| `kode-wilayah-id/search` | ~13 MB (loads all) |
| `kode-wilayah-id` (full) | ~13 MB |

## Contoh Penggunaan

### React -- Cascading Address Picker

```tsx
import { useState } from 'react'
import { getProvinces } from 'kode-wilayah-id/provinces'
import { getRegenciesByBpsProvinceCode } from 'kode-wilayah-id/regencies'
import { getDistrictsByBpsRegencyCode } from 'kode-wilayah-id/districts'
import { getVillagesByBpsDistrictCode } from 'kode-wilayah-id/villages'

export function AddressPicker() {
  const [provinceCode, setProvinceCode] = useState('')
  const [regencyCode, setRegencyCode] = useState('')
  const [districtCode, setDistrictCode] = useState('')
  const [villageCode, setVillageCode] = useState('')

  const provinces = getProvinces()
  const regencies = provinceCode ? getRegenciesByBpsProvinceCode(provinceCode) : []
  const districts = regencyCode ? getDistrictsByBpsRegencyCode(regencyCode) : []
  const villages = districtCode ? getVillagesByBpsDistrictCode(districtCode) : []

  return (
    <div>
      <select value={provinceCode} onChange={e => {
        setProvinceCode(e.target.value)
        setRegencyCode('')
        setDistrictCode('')
        setVillageCode('')
      }}>
        <option value="">Pilih Provinsi</option>
        {provinces.map(p => <option key={p.bps_code} value={p.bps_code}>{p.name}</option>)}
      </select>

      <select value={regencyCode} onChange={e => {
        setRegencyCode(e.target.value)
        setDistrictCode('')
        setVillageCode('')
      }} disabled={!provinceCode}>
        <option value="">Pilih Kabupaten/Kota</option>
        {regencies.map(r => <option key={r.bps_code} value={r.bps_code}>{r.name}</option>)}
      </select>

      <select value={districtCode} onChange={e => {
        setDistrictCode(e.target.value)
        setVillageCode('')
      }} disabled={!regencyCode}>
        <option value="">Pilih Kecamatan</option>
        {districts.map(d => <option key={d.bps_code} value={d.bps_code}>{d.name}</option>)}
      </select>

      <select value={villageCode} onChange={e => setVillageCode(e.target.value)}
        disabled={!districtCode}>
        <option value="">Pilih Desa/Kelurahan</option>
        {villages.map(v => <option key={v.bps_code} value={v.bps_code}>{v.name}</option>)}
      </select>
    </div>
  )
}
```

### Vue 3 -- Composition API

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { getProvinces } from 'kode-wilayah-id/provinces'
import { getRegenciesByBpsProvinceCode } from 'kode-wilayah-id/regencies'
import { getDistrictsByBpsRegencyCode } from 'kode-wilayah-id/districts'
import { getVillagesByBpsDistrictCode } from 'kode-wilayah-id/villages'

const provinceCode = ref('')
const regencyCode = ref('')
const districtCode = ref('')
const villageCode = ref('')

const provinces = getProvinces()
const regencies = computed(() =>
  provinceCode.value ? getRegenciesByBpsProvinceCode(provinceCode.value) : []
)
const districts = computed(() =>
  regencyCode.value ? getDistrictsByBpsRegencyCode(regencyCode.value) : []
)
const villages = computed(() =>
  districtCode.value ? getVillagesByBpsDistrictCode(districtCode.value) : []
)

function onProvinceChange() {
  regencyCode.value = ''
  districtCode.value = ''
  villageCode.value = ''
}
function onRegencyChange() {
  districtCode.value = ''
  villageCode.value = ''
}
function onDistrictChange() {
  villageCode.value = ''
}
</script>

<template>
  <select v-model="provinceCode" @change="onProvinceChange">
    <option value="">Pilih Provinsi</option>
    <option v-for="p in provinces" :key="p.bps_code" :value="p.bps_code">{{ p.name }}</option>
  </select>

  <select v-model="regencyCode" @change="onRegencyChange" :disabled="!provinceCode">
    <option value="">Pilih Kabupaten/Kota</option>
    <option v-for="r in regencies" :key="r.bps_code" :value="r.bps_code">{{ r.name }}</option>
  </select>

  <select v-model="districtCode" @change="onDistrictChange" :disabled="!regencyCode">
    <option value="">Pilih Kecamatan</option>
    <option v-for="d in districts" :key="d.bps_code" :value="d.bps_code">{{ d.name }}</option>
  </select>

  <select v-model="villageCode" :disabled="!districtCode">
    <option value="">Pilih Desa/Kelurahan</option>
    <option v-for="v in villages" :key="v.bps_code" :value="v.bps_code">{{ v.name }}</option>
  </select>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { getProvinces } from 'kode-wilayah-id/provinces'
  import { getRegenciesByBpsProvinceCode } from 'kode-wilayah-id/regencies'
  import { getDistrictsByBpsRegencyCode } from 'kode-wilayah-id/districts'
  import { getVillagesByBpsDistrictCode } from 'kode-wilayah-id/villages'

  let provinceCode = ''
  let regencyCode = ''
  let districtCode = ''
  let villageCode = ''

  const provinces = getProvinces()
  $: regencies = provinceCode ? getRegenciesByBpsProvinceCode(provinceCode) : []
  $: districts = regencyCode ? getDistrictsByBpsRegencyCode(regencyCode) : []
  $: villages = districtCode ? getVillagesByBpsDistrictCode(districtCode) : []
</script>

<select bind:value={provinceCode} on:change={() => { regencyCode = ''; districtCode = ''; villageCode = '' }}>
  <option value="">Pilih Provinsi</option>
  {#each provinces as p}
    <option value={p.bps_code}>{p.name}</option>
  {/each}
</select>

<select bind:value={regencyCode} on:change={() => { districtCode = ''; villageCode = '' }} disabled={!provinceCode}>
  <option value="">Pilih Kabupaten/Kota</option>
  {#each regencies as r}
    <option value={r.bps_code}>{r.name}</option>
  {/each}
</select>

<select bind:value={districtCode} on:change={() => { villageCode = '' }} disabled={!regencyCode}>
  <option value="">Pilih Kecamatan</option>
  {#each districts as d}
    <option value={d.bps_code}>{d.name}</option>
  {/each}
</select>

<select bind:value={villageCode} disabled={!districtCode}>
  <option value="">Pilih Desa/Kelurahan</option>
  {#each villages as v}
    <option value={v.bps_code}>{v.name}</option>
  {/each}
</select>
```

### Next.js -- Server Component

```tsx
// app/provinces/page.tsx
import { getProvinces } from 'kode-wilayah-id/provinces'
import { getRegenciesByBpsProvinceCode } from 'kode-wilayah-id/regencies'

export default function ProvincesPage() {
  const provinces = getProvinces()

  return (
    <div>
      <h1>Daftar Provinsi Indonesia</h1>
      <ul>
        {provinces.map(p => (
          <li key={p.bps_code}>
            {p.name} ({getRegenciesByBpsProvinceCode(p.bps_code).length} kab/kota)
            {p.kemendagri_code && ` [Kemendagri: ${p.kemendagri_code}]`}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Node.js / Express

```typescript
import express from 'express'
import {
  getProvinces,
  getProvinceByBpsCode,
  getProvinceByKemendagriCode,
  getVillagesByPostalCode,
} from 'kode-wilayah-id'

const app = express()

app.get('/api/provinces', (req, res) => {
  res.json({ status: 200, data: getProvinces(), meta: { total: getProvinces().length } })
})

app.get('/api/provinces/bps/:code', (req, res) => {
  const province = getProvinceByBpsCode(req.params.code)
  if (!province) return res.status(404).json({ status: 404, error: 'Not Found' })
  res.json({ status: 200, data: province })
})

app.get('/api/provinces/kemendagri/:code', (req, res) => {
  const province = getProvinceByKemendagriCode(req.params.code)
  if (!province) return res.status(404).json({ status: 404, error: 'Not Found' })
  res.json({ status: 200, data: province })
})

app.get('/api/villages/postal/:code', (req, res) => {
  const villages = getVillagesByPostalCode(req.params.code)
  res.json({ status: 200, data: villages, meta: { total: villages.length } })
})

app.listen(3000, () => console.log('Server running on port 3000'))
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
# Setup development
git clone https://github.com/sumitroajiprabowo/kode-wilayah-id.git
cd kode-wilayah-id
npm install

# Development workflow
npm run lint          # Lint check
npm run format:check  # Format check
npm run typecheck     # TypeScript check
npm run test:coverage # Test + 100% coverage
npm run build         # Build ESM + CJS
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
