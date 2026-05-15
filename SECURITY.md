# Security Policy

## Versi yang Didukung

| Versi | Didukung |
|-------|----------|
| 0.1.x | :white_check_mark: |

## Melaporkan Kerentanan

Jika Anda menemukan kerentanan keamanan di `kode-wilayah-id`, mohon laporkan secara bertanggung jawab.

**Jangan** melaporkan kerentanan keamanan melalui GitHub Issues publik.

### Cara Melaporkan

1. Buka [GitHub Security Advisory](https://github.com/sumitroajiprabowo/kode-wilayah-id/security/advisories/new)
2. Jelaskan kerentanan secara detail
3. Sertakan langkah-langkah reproduksi jika memungkinkan

### Apa yang Diharapkan

- Konfirmasi penerimaan laporan dalam 48 jam
- Penilaian awal dalam 7 hari
- Perbaikan dirilis sesegera mungkin setelah verifikasi

### Cakupan

Package ini berisi data statis (kode wilayah) tanpa runtime dependencies, sehingga attack surface sangat minimal. Potensi kerentanan yang mungkin relevan:

- Supply chain attacks (compromised dependencies)
- Data integrity issues (data wilayah yang salah/berbahaya)
- Build pipeline vulnerabilities

## Best Practices

- Selalu gunakan versi terbaru
- Jalankan `npm audit` secara berkala
- Verifikasi integritas package setelah instalasi
