/**
 * Data 84.270 desa/kelurahan di Indonesia.
 *
 * Menyediakan fungsi untuk mengambil daftar desa dalam satu kecamatan,
 * mencari desa berdasarkan kode BPS/Kemendagri, maupun mencari berdasarkan kode pos.
 *
 * Setiap desa punya field `postal_code` yang berisi kode pos 5 digit dari
 * PT Pos Indonesia. Bernilai `null` kalau kode pos belum tersedia — ini
 * terutama terjadi di wilayah Papua pemekaran.
 *
 * Secara internal, modul ini pakai lazy-initialized `Map` untuk lookup O(1),
 * bukan linear scan. Map dibuat saat pertama kali dibutuhkan, lalu di-cache
 * supaya panggilan berikutnya instan.
 *
 * @example
 * ```typescript
 * import { getVillagesByBpsDistrictCode, getVillagesByPostalCode } from "kode-wilayah-id/villages";
 *
 * // Semua desa di kecamatan Nagreg
 * const desa = getVillagesByBpsDistrictCode("3204050");
 *
 * // Cari desa berdasarkan kode pos
 * const desa10110 = getVillagesByPostalCode("10110"); // [{ name: "GAMBIR", ... }]
 * ```
 *
 * @module villages
 */

import villagesData from "../data/villages.json";
import type { Village } from "./types";

const villages: Village[] = villagesData as Village[];

// ---------------------------------------------------------------------------
// Lazy-initialized index Maps — dibuat sekali saat pertama kali dipanggil
// ---------------------------------------------------------------------------

/** Index kode BPS desa → Village (1-to-1) */
let bpsIndex: Map<string, Village> | null = null;
function getBpsIndex(): Map<string, Village> {
	if (!bpsIndex) {
		bpsIndex = new Map(villages.map((v) => [v.bps_code, v]));
	}
	return bpsIndex;
}

/** Index kode Kemendagri desa → Village (1-to-1, skip null) */
let kemendagriIndex: Map<string, Village> | null = null;
function getKemendagriIndex(): Map<string, Village> {
	if (!kemendagriIndex) {
		kemendagriIndex = new Map();
		for (const v of villages) {
			if (v.kemendagri_code) {
				kemendagriIndex.set(v.kemendagri_code, v);
			}
		}
	}
	return kemendagriIndex;
}

/** Index kode BPS kecamatan → Village[] (1-to-many) */
let bpsDistrictIndex: Map<string, Village[]> | null = null;
function getBpsDistrictIndex(): Map<string, Village[]> {
	if (!bpsDistrictIndex) {
		bpsDistrictIndex = new Map();
		for (const v of villages) {
			const arr = bpsDistrictIndex.get(v.bps_district_code);
			if (arr) {
				arr.push(v);
			} else {
				bpsDistrictIndex.set(v.bps_district_code, [v]);
			}
		}
	}
	return bpsDistrictIndex;
}

/** Index kode Kemendagri kecamatan → Village[] (1-to-many, skip null) */
let kemendagriDistrictIndex: Map<string, Village[]> | null = null;
function getKemendagriDistrictIndex(): Map<string, Village[]> {
	if (!kemendagriDistrictIndex) {
		kemendagriDistrictIndex = new Map();
		for (const v of villages) {
			if (v.kemendagri_district_code) {
				const arr = kemendagriDistrictIndex.get(v.kemendagri_district_code);
				if (arr) {
					arr.push(v);
				} else {
					kemendagriDistrictIndex.set(v.kemendagri_district_code, [v]);
				}
			}
		}
	}
	return kemendagriDistrictIndex;
}

/** Index kode pos → Village[] (1-to-many, skip null) */
let postalCodeIndex: Map<string, Village[]> | null = null;
function getPostalCodeIndex(): Map<string, Village[]> {
	if (!postalCodeIndex) {
		postalCodeIndex = new Map();
		for (const v of villages) {
			if (v.postal_code) {
				const arr = postalCodeIndex.get(v.postal_code);
				if (arr) {
					arr.push(v);
				} else {
					postalCodeIndex.set(v.postal_code, [v]);
				}
			}
		}
	}
	return postalCodeIndex;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Ambil seluruh data desa/kelurahan di Indonesia.
 *
 * Ini akan return 84.270 item sekaligus (~12 MB), jadi kalau bisa pakai
 * fungsi yang lebih spesifik seperti `getVillagesByBpsDistrictCode()`.
 *
 * @returns Array berisi seluruh desa/kelurahan (shallow copy).
 *
 * @example
 * ```typescript
 * const semua = getVillages();
 * console.log(semua.length); // 84270
 * ```
 */
export function getVillages(): Village[] {
	return [...villages];
}

/**
 * Ambil daftar desa/kelurahan dalam satu kecamatan berdasarkan kode BPS kecamatan.
 *
 * @param code - Kode BPS kecamatan induk (7 digit). Contoh: `"3204050"` untuk Nagreg.
 * @returns Array desa di kecamatan tersebut. Kosong kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * const desaNagreg = getVillagesByBpsDistrictCode("3204050");
 * for (const d of desaNagreg) {
 *   console.log(`${d.name} — kode pos: ${d.postal_code ?? "belum tersedia"}`);
 * }
 * ```
 */
export function getVillagesByBpsDistrictCode(code: string): Village[] {
	return getBpsDistrictIndex().get(code) ?? [];
}

/**
 * Ambil daftar desa/kelurahan dalam satu kecamatan berdasarkan kode Kemendagri kecamatan.
 *
 * @param code - Kode Kemendagri kecamatan induk (6 digit). Contoh: `"320407"`.
 * @returns Array desa di kecamatan tersebut. Kosong kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * const desa = getVillagesByKemendagriDistrictCode("320407");
 * console.log(desa.length);
 * ```
 */
export function getVillagesByKemendagriDistrictCode(code: string): Village[] {
	return getKemendagriDistrictIndex().get(code) ?? [];
}

/**
 * Cari satu desa/kelurahan berdasarkan kode BPS.
 *
 * @param code - Kode BPS desa/kelurahan (10 digit). Contoh: `"3204052003"`.
 * @returns Data desa kalau ketemu, `undefined` kalau tidak ada.
 *
 * @example
 * ```typescript
 * const nagreg = getVillageByBpsCode("3204052003");
 * console.log(nagreg?.name);        // "NAGREG"
 * console.log(nagreg?.postal_code); // "40263"
 * ```
 */
export function getVillageByBpsCode(code: string): Village | undefined {
	return getBpsIndex().get(code);
}

/**
 * Cari satu desa/kelurahan berdasarkan kode Kemendagri.
 *
 * @param code - Kode Kemendagri desa/kelurahan (10 digit). Contoh: `"3204072003"`.
 * @returns Data desa kalau ketemu, `undefined` kalau tidak ada.
 *
 * @example
 * ```typescript
 * const desa = getVillageByKemendagriCode("3204072003");
 * console.log(desa?.name); // "NAGREG"
 * ```
 */
export function getVillageByKemendagriCode(code: string): Village | undefined {
	return getKemendagriIndex().get(code);
}

/**
 * Cari desa/kelurahan berdasarkan kode pos.
 *
 * Satu kode pos bisa dimiliki oleh beberapa desa sekaligus, jadi fungsi ini
 * return array, bukan single item.
 *
 * @param code - Kode pos dari PT Pos Indonesia (5 digit). Contoh: `"10110"`.
 * @returns Array desa dengan kode pos tersebut. Kosong kalau tidak ketemu.
 *
 * @example
 * ```typescript
 * const desa = getVillagesByPostalCode("10110");
 * console.log(desa.length);    // 1
 * console.log(desa[0].name);   // "GAMBIR"
 *
 * // Beberapa kode pos bisa punya lebih dari satu desa
 * const desaLain = getVillagesByPostalCode("40263");
 * console.log(desaLain.length); // bisa lebih dari 1
 * ```
 */
export function getVillagesByPostalCode(code: string): Village[] {
	return getPostalCodeIndex().get(code) ?? [];
}
