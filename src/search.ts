/**
 * Pencarian wilayah Indonesia berdasarkan nama.
 *
 * Fungsi `searchByName()` mencari di semua level sekaligus — provinsi, kabupaten/kota,
 * kecamatan, dan desa/kelurahan. Pencarian bersifat case-insensitive dan pakai
 * substring matching (bukan exact match).
 *
 * Karena semua nama wilayah di data sudah tersimpan dalam format UPPERCASE,
 * pencarian cukup meng-uppercase query-nya saja — tidak perlu uppercase data lagi.
 *
 * Sejak v1.1.0, `searchByName()` menerima parameter kedua `options` untuk
 * filter level dan batasi jumlah hasil — berguna untuk autocomplete dan paginasi.
 *
 * @example
 * ```typescript
 * import { searchByName } from "kode-wilayah-id/search";
 *
 * // Cari di semua level
 * const hasil = searchByName("bandung");
 *
 * // Cari cuma kabupaten, maksimal 5 hasil
 * const kab = searchByName("bandung", { level: "regency", limit: 5 });
 *
 * // Cari di semua level, tapi batasi 10
 * const top10 = searchByName("bandung", { limit: 10 });
 * ```
 *
 * @module search
 */

import districtsData from "../data/districts.json";
import provincesData from "../data/provinces.json";
import regenciesData from "../data/regencies.json";
import villagesData from "../data/villages.json";
import type { District, Province, Regency, SearchOptions, SearchResult, Village } from "./types";

const provinces: Province[] = provincesData as Province[];
const regencies: Regency[] = regenciesData as Regency[];
const districts: District[] = districtsData as District[];
const villages: Village[] = villagesData as Village[];

/**
 * Cari wilayah berdasarkan nama, dengan opsi filter level dan limit.
 *
 * Pencarian bersifat case-insensitive dan pakai substring matching — jadi
 * query `"ban"` akan cocok dengan `"BANDUNG"`, `"BANJARNEGARA"`, dll.
 *
 * Hasil diurutkan berdasarkan hierarki: provinsi → kabupaten → kecamatan → desa.
 *
 * @param query - Kata kunci pencarian. Di-trim dulu sebelum diproses.
 *                Kalau kosong atau cuma whitespace, return array kosong.
 * @param options - Opsi pencarian (opsional).
 * @param options.level - Filter level wilayah: `"province"`, `"regency"`, `"district"`, atau `"village"`.
 *                        Kalau tidak diisi, cari di semua level.
 * @param options.limit - Batas maksimal jumlah hasil. Berguna untuk autocomplete.
 *                        Kalau tidak diisi, return semua yang cocok.
 * @returns Array {@link SearchResult} berisi hasil pencarian.
 *          Pakai properti `level` untuk narrowing tipe `data`.
 *
 * @example
 * ```typescript
 * // Cari biasa, semua level
 * const hasil = searchByName("nagreg");
 *
 * // Cari cuma desa yang mengandung "nagreg"
 * const desa = searchByName("nagreg", { level: "village" });
 * for (const r of desa) {
 *   console.log(`${r.data.name} — ${r.data.postal_code}`);
 * }
 *
 * // Autocomplete: cari semua level, tapi batasi 10 hasil
 * const suggest = searchByName("band", { limit: 10 });
 * ```
 */
export function searchByName(query: string, options?: SearchOptions): SearchResult[] {
	const trimmed = query.trim();
	if (trimmed === "") {
		return [];
	}

	const upperQuery = trimmed.toUpperCase();
	const level = options?.level;
	const limit = options?.limit;
	const results: SearchResult[] = [];

	if (!level || level === "province") {
		for (const p of provinces) {
			if (limit && results.length >= limit) return results;
			if (p.name.includes(upperQuery)) {
				results.push({ level: "province", data: p });
			}
		}
	}

	if (!level || level === "regency") {
		for (const r of regencies) {
			if (limit && results.length >= limit) return results;
			if (r.name.includes(upperQuery)) {
				results.push({ level: "regency", data: r });
			}
		}
	}

	if (!level || level === "district") {
		for (const d of districts) {
			if (limit && results.length >= limit) return results;
			if (d.name.includes(upperQuery)) {
				results.push({ level: "district", data: d });
			}
		}
	}

	if (!level || level === "village") {
		for (const v of villages) {
			if (limit && results.length >= limit) return results;
			if (v.name.includes(upperQuery)) {
				results.push({ level: "village", data: v });
			}
		}
	}

	return results;
}
