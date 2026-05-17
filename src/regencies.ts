/**
 * Data 514 kabupaten/kota di Indonesia.
 *
 * Menyediakan fungsi untuk mengambil daftar kabupaten/kota dalam satu provinsi,
 * maupun mencari kabupaten/kota tertentu berdasarkan kode BPS atau Kemendagri.
 *
 * Secara internal, modul ini pakai lazy-initialized `Map` untuk lookup O(1),
 * bukan linear scan. Map dibuat saat pertama kali dibutuhkan, lalu di-cache
 * supaya panggilan berikutnya instan.
 *
 * @example
 * ```typescript
 * import { getRegenciesByBpsProvinceCode, getRegencyByBpsCode } from "kode-wilayah-id/regencies";
 *
 * // Semua kabupaten/kota di Jawa Barat
 * const kabJabar = getRegenciesByBpsProvinceCode("32"); // 27 item
 *
 * // Cari satu kabupaten
 * const bandung = getRegencyByBpsCode("3204"); // { name: "KAB. BANDUNG", ... }
 * ```
 *
 * @module regencies
 */

import regenciesData from "../data/regencies.json";
import type { Regency } from "./types";

const regencies: Regency[] = regenciesData as Regency[];

// ---------------------------------------------------------------------------
// Lazy-initialized index Maps — dibuat sekali saat pertama kali dipanggil
// ---------------------------------------------------------------------------

/** Index kode BPS kabupaten → Regency (1-to-1) */
let bpsIndex: Map<string, Regency> | null = null;
function getBpsIndex(): Map<string, Regency> {
	if (!bpsIndex) {
		bpsIndex = new Map(regencies.map((r) => [r.bps_code, r]));
	}
	return bpsIndex;
}

/** Index kode Kemendagri kabupaten → Regency (1-to-1, skip null) */
let kemendagriIndex: Map<string, Regency> | null = null;
function getKemendagriIndex(): Map<string, Regency> {
	if (!kemendagriIndex) {
		kemendagriIndex = new Map();
		for (const r of regencies) {
			if (r.kemendagri_code) {
				kemendagriIndex.set(r.kemendagri_code, r);
			}
		}
	}
	return kemendagriIndex;
}

/** Index kode BPS provinsi → Regency[] (1-to-many) */
let bpsProvinceIndex: Map<string, Regency[]> | null = null;
function getBpsProvinceIndex(): Map<string, Regency[]> {
	if (!bpsProvinceIndex) {
		bpsProvinceIndex = new Map();
		for (const r of regencies) {
			const arr = bpsProvinceIndex.get(r.bps_province_code);
			if (arr) {
				arr.push(r);
			} else {
				bpsProvinceIndex.set(r.bps_province_code, [r]);
			}
		}
	}
	return bpsProvinceIndex;
}

/** Index kode Kemendagri provinsi → Regency[] (1-to-many, skip null) */
let kemendagriProvinceIndex: Map<string, Regency[]> | null = null;
function getKemendagriProvinceIndex(): Map<string, Regency[]> {
	if (!kemendagriProvinceIndex) {
		kemendagriProvinceIndex = new Map();
		for (const r of regencies) {
			if (r.kemendagri_province_code) {
				const arr = kemendagriProvinceIndex.get(r.kemendagri_province_code);
				if (arr) {
					arr.push(r);
				} else {
					kemendagriProvinceIndex.set(r.kemendagri_province_code, [r]);
				}
			}
		}
	}
	return kemendagriProvinceIndex;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Ambil seluruh data kabupaten/kota di Indonesia.
 *
 * @returns Array berisi 514 kabupaten/kota (shallow copy).
 *
 * @example
 * ```typescript
 * const semua = getRegencies();
 * console.log(semua.length); // 514
 * ```
 */
export function getRegencies(): Regency[] {
	return [...regencies];
}

/**
 * Ambil daftar kabupaten/kota dalam satu provinsi berdasarkan kode BPS provinsi.
 *
 * @param code - Kode BPS provinsi (2 digit). Contoh: `"32"` untuk Jawa Barat.
 * @returns Array kabupaten/kota di provinsi tersebut. Kosong kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * const kabJabar = getRegenciesByBpsProvinceCode("32");
 * console.log(kabJabar.length); // 27
 * console.log(kabJabar[0].name); // "KAB. BOGOR"
 * ```
 */
export function getRegenciesByBpsProvinceCode(code: string): Regency[] {
	const arr = getBpsProvinceIndex().get(code);
	return arr ? [...arr] : [];
}

/**
 * Ambil daftar kabupaten/kota dalam satu provinsi berdasarkan kode Kemendagri provinsi.
 *
 * @param code - Kode Kemendagri provinsi (2 digit). Contoh: `"32"` untuk Jawa Barat.
 * @returns Array kabupaten/kota di provinsi tersebut. Kosong kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * const kabJabar = getRegenciesByKemendagriProvinceCode("32");
 * console.log(kabJabar.length); // 27
 * ```
 */
export function getRegenciesByKemendagriProvinceCode(code: string): Regency[] {
	const arr = getKemendagriProvinceIndex().get(code);
	return arr ? [...arr] : [];
}

/**
 * Cari satu kabupaten/kota berdasarkan kode BPS.
 *
 * @param code - Kode BPS kabupaten/kota (4 digit). Contoh: `"3204"` untuk Kab. Bandung.
 * @returns Data kabupaten/kota kalau ketemu, `undefined` kalau tidak ada.
 *
 * @example
 * ```typescript
 * const bandung = getRegencyByBpsCode("3204");
 * console.log(bandung?.name);              // "KAB. BANDUNG"
 * console.log(bandung?.bps_province_code); // "32"
 * ```
 */
export function getRegencyByBpsCode(code: string): Regency | undefined {
	return getBpsIndex().get(code);
}

/**
 * Cari satu kabupaten/kota berdasarkan kode Kemendagri.
 *
 * @param code - Kode Kemendagri kabupaten/kota (4 digit). Contoh: `"3204"`.
 * @returns Data kabupaten/kota kalau ketemu, `undefined` kalau tidak ada.
 *
 * @example
 * ```typescript
 * const bandung = getRegencyByKemendagriCode("3204");
 * console.log(bandung?.name); // "KAB. BANDUNG"
 * ```
 */
export function getRegencyByKemendagriCode(code: string): Regency | undefined {
	return getKemendagriIndex().get(code);
}
