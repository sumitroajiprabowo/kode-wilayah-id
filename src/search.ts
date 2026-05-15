/**
 * Pencarian wilayah Indonesia berdasarkan nama.
 *
 * Fungsi `searchByName()` mencari di semua level sekaligus — provinsi, kabupaten/kota,
 * kecamatan, dan desa/kelurahan. Pencarian bersifat case-insensitive dan pakai
 * substring matching (bukan exact match).
 *
 * Hasilnya berupa array {@link SearchResult} yang merupakan discriminated union,
 * jadi bisa di-narrow berdasarkan properti `level` untuk akses field spesifik
 * tiap level (misalnya `postal_code` yang cuma ada di Village).
 *
 * @example
 * ```typescript
 * import { searchByName } from "kode-wilayah-id/search";
 *
 * const hasil = searchByName("bandung");
 * for (const r of hasil) {
 *   console.log(`[${r.level}] ${r.data.name}`);
 *   // [regency] KAB. BANDUNG
 *   // [regency] KAB. BANDUNG BARAT
 *   // [regency] KOTA BANDUNG
 *   // [district] BANDUNG
 *   // ... dan desa-desa yang mengandung "bandung"
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
 * Cari wilayah di semua level sekaligus berdasarkan nama.
 *
 * Pencarian bersifat case-insensitive dan pakai substring matching — jadi
 * query `"ban"` akan cocok dengan `"BANDUNG"`, `"BANJARNEGARA"`, dll.
 *
 * Hasil diurutkan berdasarkan hierarki: provinsi dulu, lalu kabupaten/kota,
 * kecamatan, dan terakhir desa/kelurahan. Dalam satu level, urutan mengikuti
 * urutan data asli (berdasarkan kode BPS).
 *
 * Hati-hati: query yang terlalu umum (misalnya `"KOTA"` atau `"DESA"`) bisa
 * return ribuan hasil. Pertimbangkan untuk menambah filter atau paginasi
 * di sisi aplikasi.
 *
 * @param query - Kata kunci pencarian. Di-trim dulu sebelum diproses.
 *                Kalau kosong atau cuma whitespace, langsung return array kosong.
 * @returns Array {@link SearchResult} berisi hasil dari semua level.
 *          Pakai properti `level` untuk narrowing tipe `data`.
 *          Array kosong kalau query kosong atau tidak ada yang cocok.
 *
 * @example
 * ```typescript
 * // Pencarian biasa
 * const hasil = searchByName("nagreg");
 * // hasil bisa berisi kecamatan "NAGREG" dan desa "NAGREG"
 *
 * // Pakai discriminated union untuk akses field spesifik
 * for (const r of hasil) {
 *   if (r.level === "village") {
 *     // TypeScript tahu r.data bertipe Village di sini
 *     console.log(`${r.data.name} — kode pos: ${r.data.postal_code}`);
 *   }
 * }
 *
 * // Query kosong return array kosong
 * searchByName("");   // []
 * searchByName("  "); // []
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
