/**
 * Data 7.286 kecamatan di Indonesia.
 *
 * Menyediakan fungsi untuk mengambil daftar kecamatan dalam satu kabupaten/kota,
 * maupun mencari kecamatan tertentu berdasarkan kode BPS atau Kemendagri.
 *
 * Perlu diketahui: format kode BPS dan Kemendagri berbeda di level kecamatan.
 * BPS pakai 7 digit (contoh: `"3204050"`), Kemendagri pakai 6 digit (contoh: `"320407"`).
 *
 * Secara internal, modul ini pakai lazy-initialized `Map` untuk lookup O(1),
 * bukan linear scan. Map dibuat saat pertama kali dibutuhkan, lalu di-cache
 * supaya panggilan berikutnya instan.
 *
 * @example
 * ```typescript
 * import { getDistrictsByBpsRegencyCode, getDistrictByBpsCode } from "kode-wilayah-id/districts";
 *
 * // Semua kecamatan di Kab. Bandung
 * const kecamatan = getDistrictsByBpsRegencyCode("3204");
 *
 * // Cari satu kecamatan
 * const nagreg = getDistrictByBpsCode("3204050"); // { name: "NAGREG", ... }
 * ```
 *
 * @module districts
 */

import districtsData from "../data/districts.json";
import type { District } from "./types";

const districts: District[] = districtsData as District[];

// ---------------------------------------------------------------------------
// Lazy-initialized index Maps — dibuat sekali saat pertama kali dipanggil
// ---------------------------------------------------------------------------

/** Index kode BPS kecamatan → District (1-to-1) */
let bpsIndex: Map<string, District> | null = null;
function getBpsIndex(): Map<string, District> {
	if (!bpsIndex) {
		bpsIndex = new Map(districts.map((d) => [d.bps_code, d]));
	}
	return bpsIndex;
}

/** Index kode Kemendagri kecamatan → District (1-to-1, skip null) */
let kemendagriIndex: Map<string, District> | null = null;
function getKemendagriIndex(): Map<string, District> {
	if (!kemendagriIndex) {
		kemendagriIndex = new Map();
		for (const d of districts) {
			if (d.kemendagri_code) {
				kemendagriIndex.set(d.kemendagri_code, d);
			}
		}
	}
	return kemendagriIndex;
}

/** Index kode BPS kabupaten → District[] (1-to-many) */
let bpsRegencyIndex: Map<string, District[]> | null = null;
function getBpsRegencyIndex(): Map<string, District[]> {
	if (!bpsRegencyIndex) {
		bpsRegencyIndex = new Map();
		for (const d of districts) {
			const arr = bpsRegencyIndex.get(d.bps_regency_code);
			if (arr) {
				arr.push(d);
			} else {
				bpsRegencyIndex.set(d.bps_regency_code, [d]);
			}
		}
	}
	return bpsRegencyIndex;
}

/** Index kode Kemendagri kabupaten → District[] (1-to-many, skip null) */
let kemendagriRegencyIndex: Map<string, District[]> | null = null;
function getKemendagriRegencyIndex(): Map<string, District[]> {
	if (!kemendagriRegencyIndex) {
		kemendagriRegencyIndex = new Map();
		for (const d of districts) {
			if (d.kemendagri_regency_code) {
				const arr = kemendagriRegencyIndex.get(d.kemendagri_regency_code);
				if (arr) {
					arr.push(d);
				} else {
					kemendagriRegencyIndex.set(d.kemendagri_regency_code, [d]);
				}
			}
		}
	}
	return kemendagriRegencyIndex;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Ambil seluruh data kecamatan di Indonesia.
 *
 * @returns Array berisi 7.286 kecamatan (shallow copy).
 *
 * @example
 * ```typescript
 * const semua = getDistricts();
 * console.log(semua.length); // 7286
 * ```
 */
export function getDistricts(): District[] {
	return [...districts];
}

/**
 * Ambil daftar kecamatan dalam satu kabupaten/kota berdasarkan kode BPS kabupaten.
 *
 * @param code - Kode BPS kabupaten/kota (4 digit). Contoh: `"3204"` untuk Kab. Bandung.
 * @returns Array kecamatan di kabupaten tersebut. Kosong kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * const kecBandung = getDistrictsByBpsRegencyCode("3204");
 * for (const kec of kecBandung) {
 *   console.log(kec.name); // "CIWIDEY", "RANCABALI", dst.
 * }
 * ```
 */
export function getDistrictsByBpsRegencyCode(code: string): District[] {
	const arr = getBpsRegencyIndex().get(code);
	return arr ? [...arr] : [];
}

/**
 * Ambil daftar kecamatan dalam satu kabupaten/kota berdasarkan kode Kemendagri kabupaten.
 *
 * @param code - Kode Kemendagri kabupaten/kota (4 digit). Contoh: `"3204"`.
 * @returns Array kecamatan di kabupaten tersebut. Kosong kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * const kecamatan = getDistrictsByKemendagriRegencyCode("3204");
 * console.log(kecamatan.length);
 * ```
 */
export function getDistrictsByKemendagriRegencyCode(code: string): District[] {
	const arr = getKemendagriRegencyIndex().get(code);
	return arr ? [...arr] : [];
}

/**
 * Cari satu kecamatan berdasarkan kode BPS.
 *
 * @param code - Kode BPS kecamatan (7 digit). Contoh: `"3204050"` untuk Nagreg.
 * @returns Data kecamatan kalau ketemu, `undefined` kalau tidak ada.
 *
 * @example
 * ```typescript
 * const nagreg = getDistrictByBpsCode("3204050");
 * console.log(nagreg?.name);              // "NAGREG"
 * console.log(nagreg?.bps_regency_code); // "3204"
 * ```
 */
export function getDistrictByBpsCode(code: string): District | undefined {
	return getBpsIndex().get(code);
}

/**
 * Cari satu kecamatan berdasarkan kode Kemendagri.
 *
 * @param code - Kode Kemendagri kecamatan (6 digit). Contoh: `"320407"` untuk Nagreg.
 * @returns Data kecamatan kalau ketemu, `undefined` kalau tidak ada.
 *
 * @example
 * ```typescript
 * const nagreg = getDistrictByKemendagriCode("320407");
 * console.log(nagreg?.name); // "NAGREG"
 * ```
 */
export function getDistrictByKemendagriCode(code: string): District | undefined {
	return getKemendagriIndex().get(code);
}
