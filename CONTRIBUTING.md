# Contributing to kode-wilayah-id

Terima kasih atas ketertarikan Anda untuk berkontribusi! Berikut panduan untuk membantu Anda memulai.

## Cara Berkontribusi

### Melaporkan Bug

- Gunakan [GitHub Issues](https://github.com/sumitroajiprabowo/kode-wilayah-id/issues) untuk melaporkan bug
- Sertakan langkah-langkah reproduksi yang jelas
- Sertakan versi Node.js dan package yang digunakan
- Lampirkan error message atau stack trace jika ada

### Mengusulkan Fitur

- Buka issue baru dengan label `enhancement`
- Jelaskan use case dan manfaat fitur yang diusulkan
- Diskusikan terlebih dahulu sebelum membuat PR

### Pull Request

1. Fork repository ini
2. Buat branch baru: `git checkout -b feat/fitur-baru`
3. Lakukan perubahan Anda
4. Pastikan semua checks passed:

```bash
npm run lint        # Cek lint
npm run format:check # Cek formatting
npm run typecheck   # Cek TypeScript types
npm run test:coverage # Jalankan test dengan coverage 100%
npm run build       # Build package
```

5. Commit dengan format [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: tambah fitur baru
fix: perbaiki bug pada search
docs: update dokumentasi API
chore: update dependencies
test: tambah test case baru
```

6. Push ke fork Anda dan buat Pull Request

## Development Setup

```bash
# Clone repository
git clone https://github.com/sumitroajiprabowo/kode-wilayah-id.git
cd kode-wilayah-id

# Install dependencies
npm install

# Jalankan test
npm test

# Jalankan test dengan coverage
npm run test:coverage

# Build
npm run build

# Lint & format
npm run lint
npm run format:check
```

## Struktur Proyek

```
kode-wilayah-id/
├── data/                        # JSON data wilayah (BPS + Kemendagri)
│   ├── provinces.json           # 38 provinsi
│   ├── regencies.json           # 514 kabupaten/kota
│   ├── districts.json           # 7.286 kecamatan
│   └── villages.json            # 84.270 desa/kelurahan
├── src/                         # Source code TypeScript
│   ├── types.ts                 # Type definitions (dual-code)
│   ├── provinces.ts             # Modul provinsi (BPS + Kemendagri)
│   ├── regencies.ts             # Modul kabupaten/kota
│   ├── districts.ts             # Modul kecamatan
│   ├── villages.ts              # Modul desa/kelurahan + kode pos
│   ├── search.ts                # Modul pencarian
│   └── index.ts                 # Re-export semua
├── tests/                       # Unit & integration tests
├── scripts/                     # Data pipeline (TypeScript)
│   ├── scrape-bridging.ts       # Scraper BPS bridging API
│   ├── scrape-desa-fast.ts      # Parallel desa scraper
│   ├── parse-kodepos.ts         # Parser kodepos Kemendagri
│   └── merge-data.ts            # Merger & validator data
├── dist/                        # Build output (generated)
└── ...
```

## Standar Kualitas

- **Coverage 100%** — Semua test harus pass dengan coverage 100%
- **TypeScript strict** — Tidak boleh ada `any` type
- **Lint clean** — Biome lint tanpa error
- **Format consistent** — Biome format sesuai konfigurasi

## Data Pipeline

Data wilayah bersumber dari dua sumber resmi:

- **BPS** (Badan Pusat Statistik) — kode wilayah & bridging BPS-Kemendagri via [SIG Bridging API](https://sig.bps.go.id/bridging-kode/index)
- **Kemendagri** — kode pos via [cahyadsn/wilayah_kodepos](https://github.com/cahyadsn/wilayah_kodepos) (MIT license)

Semua scripts pipeline ditulis dalam TypeScript (`scripts/`). Untuk regenerasi data:

```bash
# 1. Scrape bridging data dari BPS API
npx tsx scripts/scrape-bridging.ts

# 2. Scrape data desa (parallel, ~12 menit)
npx tsx scripts/scrape-desa-fast.ts

# 3. Parse kodepos Kemendagri
npx tsx scripts/parse-kodepos.ts

# 4. Merge & validasi semua data
npx tsx scripts/merge-data.ts
```

Jika ada pemekaran wilayah atau perubahan data:

1. Jalankan pipeline di atas untuk regenerasi `data/*.json`
2. Update jumlah di README.md
3. Pastikan semua test masih pass dengan coverage 100%
4. Buat PR dengan label `data-update`

## Lisensi

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah lisensi [MIT](LICENSE).
