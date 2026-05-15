/**
 * Modul pencarian wilayah Indonesia berdasarkan nama.
 *
 * Menyediakan fungsi pencarian lintas level (provinsi, kabupaten/kota,
 * kecamatan, desa/kelurahan) secara sekaligus. Pencarian bersifat
 * case-insensitive dan menggunakan substring matching.
 *
 * Hasil pencarian dikembalikan sebagai discriminated union {@link SearchResult}
 * sehingga konsumer dapat menentukan tipe data berdasarkan properti `level`.
 *
 * @example
 * ```typescript
 * import { searchByName } from "kode-wilayah-id/search";
 *
 * const hasil = searchByName("bandung");
 * for (const r of hasil) {
 *   console.log(`[${r.level}] ${r.data.name}`);
 *   // [province] ...  (jika ada)
 *   // [regency]  KAB. BANDUNG
 *   // [regency]  KAB. BANDUNG BARAT
 *   // [regency]  KOTA BANDUNG
 *   // [district] BANDUNG
 *   // ...
 * }
 * ```
 *
 * @module search
 */

import districtsData from "../data/districts.json";
import provincesData from "../data/provinces.json";
import regenciesData from "../data/regencies.json";
import villagesData from "../data/villages.json";
import type { District, Province, Regency, SearchResult, Village } from "./types";

const provinces: Province[] = provincesData as Province[];
const regencies: Regency[] = regenciesData as Regency[];
const districts: District[] = districtsData as District[];
const villages: Village[] = villagesData as Village[];

/**
 * Mencari wilayah Indonesia berdasarkan nama di semua level administratif.
 *
 * Fungsi ini melakukan pencarian substring case-insensitive terhadap
 * nama seluruh provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan.
 * Urutan hasil mengikuti hierarki: provinsi → kabupaten/kota → kecamatan → desa.
 *
 * **Perhatian:** Pencarian dengan kata umum (misal "KOTA") dapat menghasilkan
 * ribuan hasil. Pertimbangkan untuk menambahkan logika paginasi di sisi aplikasi.
 *
 * @param query - Kata kunci pencarian. Minimal 1 karakter setelah di-trim.
 *                String kosong atau hanya whitespace mengembalikan array kosong.
 * @returns Array {@link SearchResult} berisi hasil dari semua level.
 *          Gunakan properti `level` untuk membedakan tipe `data`.
 *          Array kosong jika query kosong atau tidak ada yang cocok.
 *
 * @example
 * ```typescript
 * // Pencarian sederhana
 * const hasil = searchByName("nagreg");
 * console.log(hasil.length); // beberapa hasil (kecamatan + desa)
 *
 * // Menggunakan discriminated union untuk akses field spesifik
 * for (const r of hasil) {
 *   if (r.level === "village") {
 *     console.log(`${r.data.name} — kode pos: ${r.data.postal_code}`);
 *   }
 * }
 *
 * // Query kosong mengembalikan array kosong
 * const kosong = searchByName("  ");
 * console.log(kosong.length); // 0
 * ```
 */
export function searchByName(query: string): SearchResult[] {
	const trimmed = query.trim();
	if (trimmed === "") {
		return [];
	}

	const upperQuery = trimmed.toUpperCase();
	const results: SearchResult[] = [];

	for (const p of provinces) {
		if (p.name.toUpperCase().includes(upperQuery)) {
			results.push({ level: "province", data: p });
		}
	}

	for (const r of regencies) {
		if (r.name.toUpperCase().includes(upperQuery)) {
			results.push({ level: "regency", data: r });
		}
	}

	for (const d of districts) {
		if (d.name.toUpperCase().includes(upperQuery)) {
			results.push({ level: "district", data: d });
		}
	}

	for (const v of villages) {
		if (v.name.toUpperCase().includes(upperQuery)) {
			results.push({ level: "village", data: v });
		}
	}

	return results;
}
