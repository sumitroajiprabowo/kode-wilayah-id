# kode-wilayah-id

[![npm version](https://img.shields.io/npm/v/kode-wilayah-id.svg)](https://www.npmjs.com/package/kode-wilayah-id)
[![CI](https://github.com/sumitroajiprabowo/kode-wilayah-id/actions/workflows/ci.yml/badge.svg)](https://github.com/sumitroajiprabowo/kode-wilayah-id/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/sumitroajiprabowo/kode-wilayah-id/branch/main/graph/badge.svg)](https://codecov.io/gh/sumitroajiprabowo/kode-wilayah-id)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-green.svg)](https://nodejs.org/)
[![Bundle Size](https://img.shields.io/badge/provinces-1.9KB-green.svg)](https://www.npmjs.com/package/kode-wilayah-id)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.com/package/kode-wilayah-id)

Data **kode wilayah Indonesia** lengkap (provinsi, kabupaten/kota, kecamatan, desa/kelurahan) dari BPS.

```bash
npm install kode-wilayah-id
```

Tidak perlu database, API call, atau file eksternal. Semua data ter-embed di package, langsung pakai.

**Periode data:** 2025 Semester 1 (BPS) - 2025 (Kemendagri)

## Fitur

- **92.108 wilayah** — 38 provinsi, 514 kabupaten/kota, 7.286 kecamatan, 84.270 desa/kelurahan
- **Tree-shakeable** — import hanya level yang dibutuhkan (provinsi saja = 1.9 KB)
- **TypeScript-first** — strict types, auto-complete di IDE
- **Dual ESM + CJS** — support semua environment (browser, Node.js, Bun, Deno)
- **Zero dependencies** — hanya data + types
- **Pencarian** — case-insensitive search di semua level

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
import { getProvinces, getProvinceById, searchByName } from 'kode-wilayah-id'

// Semua provinsi
const provinces = getProvinces() // Province[] (38 items)

// Cari provinsi by ID
const jabar = getProvinceById('32')
console.log(jabar?.name) // "JAWA BARAT"

// Pencarian case-insensitive
const results = searchByName('bandung')
// → KAB. BANDUNG, KAB. BANDUNG BARAT, KOTA BANDUNG, ...
```

## API Reference

| Function | Parameter | Return | Keterangan |
|----------|-----------|--------|------------|
| `getProvinces()` | — | `Province[]` | Semua provinsi |
| `getProvinceById(id)` | `string` | `Province \| undefined` | Cari provinsi by kode BPS |
| `getRegencies()` | — | `Regency[]` | Semua kabupaten/kota |
| `getRegenciesByProvinceId(id)` | `string` | `Regency[]` | Kabupaten/kota di provinsi |
| `getRegencyById(id)` | `string` | `Regency \| undefined` | Cari kabupaten/kota by kode |
| `getDistricts()` | — | `District[]` | Semua kecamatan |
| `getDistrictsByRegencyId(id)` | `string` | `District[]` | Kecamatan di kabupaten/kota |
| `getDistrictById(id)` | `string` | `District \| undefined` | Cari kecamatan by kode |
| `getVillages()` | — | `Village[]` | Semua desa/kelurahan |
| `getVillagesByDistrictId(id)` | `string` | `Village[]` | Desa di kecamatan |
| `getVillageById(id)` | `string` | `Village \| undefined` | Cari desa by kode |
| `searchByName(query)` | `string` | `SearchResult[]` | Pencarian case-insensitive |

## Tree-shaking / Sub-path Imports

Import hanya data yang dibutuhkan — bundler hanya include JSON yang di-import:

```typescript
// Hanya provinsi (1.9 KB)
import { getProvinces } from 'kode-wilayah-id/provinces'

// Hanya kabupaten (41 KB)
import { getRegenciesByProvinceId } from 'kode-wilayah-id/regencies'

// Hanya kecamatan (573 KB)
import { getDistrictsByRegencyId } from 'kode-wilayah-id/districts'

// Hanya desa (7.2 MB) — hati-hati bundle size!
import { getVillagesByDistrictId } from 'kode-wilayah-id/villages'

// Types only (zero runtime)
import type { Province, Regency } from 'kode-wilayah-id/types'
```

### Bundle Size per Module

| Import | Data Size |
|--------|-----------|
| `kode-wilayah-id/provinces` | ~1.9 KB |
| `kode-wilayah-id/regencies` | ~41 KB |
| `kode-wilayah-id/districts` | ~573 KB |
| `kode-wilayah-id/villages` | ~7.2 MB |
| `kode-wilayah-id/search` | ~7.8 MB (loads all) |
| `kode-wilayah-id` (full) | ~7.8 MB |

## Contoh Penggunaan

### React — Cascading Address Picker

```tsx
import { useState } from 'react'
import { getProvinces } from 'kode-wilayah-id/provinces'
import { getRegenciesByProvinceId } from 'kode-wilayah-id/regencies'
import { getDistrictsByRegencyId } from 'kode-wilayah-id/districts'
import { getVillagesByDistrictId } from 'kode-wilayah-id/villages'

export function AddressPicker() {
  const [provinceId, setProvinceId] = useState('')
  const [regencyId, setRegencyId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [villageId, setVillageId] = useState('')

  const provinces = getProvinces()
  const regencies = provinceId ? getRegenciesByProvinceId(provinceId) : []
  const districts = regencyId ? getDistrictsByRegencyId(regencyId) : []
  const villages = districtId ? getVillagesByDistrictId(districtId) : []

  return (
    <div>
      <select value={provinceId} onChange={e => {
        setProvinceId(e.target.value)
        setRegencyId('')
        setDistrictId('')
        setVillageId('')
      }}>
        <option value="">Pilih Provinsi</option>
        {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      <select value={regencyId} onChange={e => {
        setRegencyId(e.target.value)
        setDistrictId('')
        setVillageId('')
      }} disabled={!provinceId}>
        <option value="">Pilih Kabupaten/Kota</option>
        {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>

      <select value={districtId} onChange={e => {
        setDistrictId(e.target.value)
        setVillageId('')
      }} disabled={!regencyId}>
        <option value="">Pilih Kecamatan</option>
        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <select value={villageId} onChange={e => setVillageId(e.target.value)}
        disabled={!districtId}>
        <option value="">Pilih Desa/Kelurahan</option>
        {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
      </select>
    </div>
  )
}
```

### Vue 3 — Composition API

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { getProvinces } from 'kode-wilayah-id/provinces'
import { getRegenciesByProvinceId } from 'kode-wilayah-id/regencies'
import { getDistrictsByRegencyId } from 'kode-wilayah-id/districts'
import { getVillagesByDistrictId } from 'kode-wilayah-id/villages'

const provinceId = ref('')
const regencyId = ref('')
const districtId = ref('')
const villageId = ref('')

const provinces = getProvinces()
const regencies = computed(() =>
  provinceId.value ? getRegenciesByProvinceId(provinceId.value) : []
)
const districts = computed(() =>
  regencyId.value ? getDistrictsByRegencyId(regencyId.value) : []
)
const villages = computed(() =>
  districtId.value ? getVillagesByDistrictId(districtId.value) : []
)

function onProvinceChange() {
  regencyId.value = ''
  districtId.value = ''
  villageId.value = ''
}
function onRegencyChange() {
  districtId.value = ''
  villageId.value = ''
}
function onDistrictChange() {
  villageId.value = ''
}
</script>

<template>
  <select v-model="provinceId" @change="onProvinceChange">
    <option value="">Pilih Provinsi</option>
    <option v-for="p in provinces" :key="p.id" :value="p.id">{{ p.name }}</option>
  </select>

  <select v-model="regencyId" @change="onRegencyChange" :disabled="!provinceId">
    <option value="">Pilih Kabupaten/Kota</option>
    <option v-for="r in regencies" :key="r.id" :value="r.id">{{ r.name }}</option>
  </select>

  <select v-model="districtId" @change="onDistrictChange" :disabled="!regencyId">
    <option value="">Pilih Kecamatan</option>
    <option v-for="d in districts" :key="d.id" :value="d.id">{{ d.name }}</option>
  </select>

  <select v-model="villageId" :disabled="!districtId">
    <option value="">Pilih Desa/Kelurahan</option>
    <option v-for="v in villages" :key="v.id" :value="v.id">{{ v.name }}</option>
  </select>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { getProvinces } from 'kode-wilayah-id/provinces'
  import { getRegenciesByProvinceId } from 'kode-wilayah-id/regencies'
  import { getDistrictsByRegencyId } from 'kode-wilayah-id/districts'
  import { getVillagesByDistrictId } from 'kode-wilayah-id/villages'

  let provinceId = ''
  let regencyId = ''
  let districtId = ''
  let villageId = ''

  const provinces = getProvinces()
  $: regencies = provinceId ? getRegenciesByProvinceId(provinceId) : []
  $: districts = regencyId ? getDistrictsByRegencyId(regencyId) : []
  $: villages = districtId ? getVillagesByDistrictId(districtId) : []
</script>

<select bind:value={provinceId} on:change={() => { regencyId = ''; districtId = ''; villageId = '' }}>
  <option value="">Pilih Provinsi</option>
  {#each provinces as p}
    <option value={p.id}>{p.name}</option>
  {/each}
</select>

<select bind:value={regencyId} on:change={() => { districtId = ''; villageId = '' }} disabled={!provinceId}>
  <option value="">Pilih Kabupaten/Kota</option>
  {#each regencies as r}
    <option value={r.id}>{r.name}</option>
  {/each}
</select>

<select bind:value={districtId} on:change={() => { villageId = '' }} disabled={!regencyId}>
  <option value="">Pilih Kecamatan</option>
  {#each districts as d}
    <option value={d.id}>{d.name}</option>
  {/each}
</select>

<select bind:value={villageId} disabled={!districtId}>
  <option value="">Pilih Desa/Kelurahan</option>
  {#each villages as v}
    <option value={v.id}>{v.name}</option>
  {/each}
</select>
```

### Next.js — Server Component

```tsx
// app/provinces/page.tsx
import { getProvinces } from 'kode-wilayah-id/provinces'
import { getRegenciesByProvinceId } from 'kode-wilayah-id/regencies'

export default function ProvincesPage() {
  const provinces = getProvinces()

  return (
    <div>
      <h1>Daftar Provinsi Indonesia</h1>
      <ul>
        {provinces.map(p => (
          <li key={p.id}>
            {p.name} ({getRegenciesByProvinceId(p.id).length} kab/kota)
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
import { getProvinces, getProvinceById } from 'kode-wilayah-id'

const app = express()

app.get('/api/provinces', (req, res) => {
  res.json({ status: 200, data: getProvinces(), meta: { total: getProvinces().length } })
})

app.get('/api/provinces/:id', (req, res) => {
  const province = getProvinceById(req.params.id)
  if (!province) return res.status(404).json({ status: 404, error: 'Not Found' })
  res.json({ status: 200, data: province })
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
| **Total** | **92.108** |

Sumber: [BPS SIG Bridging Kode](https://sig.bps.go.id/bridging-kode/index)

Periode data: 2025 Semester 1 (BPS) - 2025 (Kemendagri)

## Format Kode BPS

```
32           → Provinsi (JAWA BARAT)
3204         → Kabupaten/Kota (KAB. BANDUNG)
3204050      → Kecamatan (NAGREG)
3204052003   → Desa/Kelurahan (NAGREG)
```

| Level | Panjang ID | Contoh |
|-------|-----------|--------|
| Provinsi | 2 digit | `"32"` |
| Kabupaten/Kota | 4 digit | `"3204"` |
| Kecamatan | 7 digit | `"3204050"` |
| Desa/Kelurahan | 10 digit | `"3204052003"` |

## TypeScript

Semua function dan data fully typed. IDE auto-complete bekerja out of the box:

```typescript
import type { Province, Regency, District, Village, SearchResult } from 'kode-wilayah-id/types'
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

[MIT](LICENSE) © [Sumitro Aji Prabowo](https://github.com/sumitroajiprabowo)

## Acknowledgments

- [BPS (Badan Pusat Statistik)](https://www.bps.go.id/) — sumber data kode wilayah Indonesia
- [BPS SIG Bridging Kode](https://sig.bps.go.id/bridging-kode/index) — API endpoint data wilayah
