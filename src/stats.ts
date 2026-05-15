/**
 * Statistik dan penghitungan wilayah Indonesia.
 *
 * Fungsi-fungsi di sini berguna untuk dashboard, info page, atau
 * validasi data — menghitung jumlah wilayah di berbagai level.
 *
 * Secara internal, modul ini pakai lazy-initialized `Map` untuk group-by O(1),
 * bukan filter linear. Map dibuat saat pertama kali dibutuhkan, lalu di-cache
 * supaya panggilan berikutnya instan.
 *
 * @example
 * ```typescript
 * import {
 *   getRegencyCountByProvince,
 *   getDistrictCountByRegency,
 *   getVillageCountByDistrict,
 *   getSummary,
 * } from "kode-wilayah-id/stats";
 *
 * // Berapa kabupaten di Jawa Barat?
 * console.log(getRegencyCountByProvince("32")); // 27
 *
 * // Ringkasan keseluruhan
 * console.log(getSummary());
 * // { provinces: 38, regencies: 514, districts: 7286, villages: 84270 }
 * ```
 *
 * @module stats
 */

import districtsData from "../data/districts.json";
import provincesData from "../data/provinces.json";
import regenciesData from "../data/regencies.json";
import villagesData from "../data/villages.json";
import type { District, Province, Regency, Village } from "./types";

const provinces: Province[] = provincesData as Province[];
const regencies: Regency[] = regenciesData as Regency[];
const districts: District[] = districtsData as District[];
const villages: Village[] = villagesData as Village[];

// ---------------------------------------------------------------------------
// Lazy-initialized index Maps — dibuat sekali saat pertama kali dipanggil
// ---------------------------------------------------------------------------

/** Index kode BPS provinsi → Regency[] */
let regenciesByProvince: Map<string, Regency[]> | null = null;
function getRegenciesByProvince(): Map<string, Regency[]> {
	if (!regenciesByProvince) {
		regenciesByProvince = new Map();
		for (const r of regencies) {
			const arr = regenciesByProvince.get(r.bps_province_code);
			if (arr) {
				arr.push(r);
			} else {
				regenciesByProvince.set(r.bps_province_code, [r]);
			}
		}
	}
	return regenciesByProvince;
}

/** Index kode BPS kabupaten → District[] */
let districtsByRegency: Map<string, District[]> | null = null;
function getDistrictsByRegency(): Map<string, District[]> {
	if (!districtsByRegency) {
		districtsByRegency = new Map();
		for (const d of districts) {
			const arr = districtsByRegency.get(d.bps_regency_code);
			if (arr) {
				arr.push(d);
			} else {
				districtsByRegency.set(d.bps_regency_code, [d]);
			}
		}
	}
	return districtsByRegency;
}

/** Index kode BPS kecamatan → Village[] */
let villagesByDistrict: Map<string, Village[]> | null = null;
function getVillagesByDistrict(): Map<string, Village[]> {
	if (!villagesByDistrict) {
		villagesByDistrict = new Map();
		for (const v of villages) {
			const arr = villagesByDistrict.get(v.bps_district_code);
			if (arr) {
				arr.push(v);
			} else {
				villagesByDistrict.set(v.bps_district_code, [v]);
			}
		}
	}
	return villagesByDistrict;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Hitung jumlah kabupaten/kota dalam satu provinsi.
 *
 * @param bpsProvinceCode - Kode BPS provinsi (2 digit). Contoh: `"32"`.
 * @returns Jumlah kabupaten/kota. `0` kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * console.log(getRegencyCountByProvince("32")); // 27 (Jawa Barat)
 * console.log(getRegencyCountByProvince("31")); // 6 (DKI Jakarta)
 * ```
 */
export function getRegencyCountByProvince(bpsProvinceCode: string): number {
	return (getRegenciesByProvince().get(bpsProvinceCode) ?? []).length;
}

/**
 * Hitung jumlah kecamatan dalam satu kabupaten/kota.
 *
 * @param bpsRegencyCode - Kode BPS kabupaten/kota (4 digit). Contoh: `"3204"`.
 * @returns Jumlah kecamatan. `0` kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * console.log(getDistrictCountByRegency("3204")); // 31 (Kab. Bandung)
 * ```
 */
export function getDistrictCountByRegency(bpsRegencyCode: string): number {
	return (getDistrictsByRegency().get(bpsRegencyCode) ?? []).length;
}

/**
 * Hitung jumlah desa/kelurahan dalam satu kecamatan.
 *
 * @param bpsDistrictCode - Kode BPS kecamatan (7 digit). Contoh: `"3204050"`.
 * @returns Jumlah desa. `0` kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * console.log(getVillageCountByDistrict("3204050")); // jumlah desa di Nagreg
 * ```
 */
export function getVillageCountByDistrict(bpsDistrictCode: string): number {
	return (getVillagesByDistrict().get(bpsDistrictCode) ?? []).length;
}

/**
 * Hitung jumlah kecamatan dalam satu provinsi (langsung, tanpa lewat kabupaten).
 *
 * @param bpsProvinceCode - Kode BPS provinsi (2 digit). Contoh: `"32"`.
 * @returns Jumlah kecamatan di seluruh provinsi. `0` kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * console.log(getDistrictCountByProvince("32")); // total kecamatan se-Jawa Barat
 * ```
 */
export function getDistrictCountByProvince(bpsProvinceCode: string): number {
	const provRegencies = getRegenciesByProvince().get(bpsProvinceCode);
	if (!provRegencies) return 0;

	const distIdx = getDistrictsByRegency();
	let count = 0;
	for (const r of provRegencies) {
		/* v8 ignore next -- valid regency selalu punya districts di data */
		count += (distIdx.get(r.bps_code) ?? []).length;
	}
	return count;
}

/**
 * Hitung jumlah desa/kelurahan dalam satu kabupaten/kota (langsung, tanpa lewat kecamatan).
 *
 * @param bpsRegencyCode - Kode BPS kabupaten/kota (4 digit). Contoh: `"3204"`.
 * @returns Jumlah desa di seluruh kabupaten. `0` kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * console.log(getVillageCountByRegency("3204")); // total desa se-Kab. Bandung
 * ```
 */
export function getVillageCountByRegency(bpsRegencyCode: string): number {
	const regDistricts = getDistrictsByRegency().get(bpsRegencyCode);
	if (!regDistricts) return 0;

	const villIdx = getVillagesByDistrict();
	let count = 0;
	for (const d of regDistricts) {
		/* v8 ignore next -- valid district selalu punya villages di data */
		count += (villIdx.get(d.bps_code) ?? []).length;
	}
	return count;
}

/**
 * Hitung jumlah desa/kelurahan dalam satu provinsi.
 *
 * @param bpsProvinceCode - Kode BPS provinsi (2 digit). Contoh: `"32"`.
 * @returns Jumlah desa di seluruh provinsi. `0` kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * console.log(getVillageCountByProvince("32")); // total desa se-Jawa Barat
 * ```
 */
export function getVillageCountByProvince(bpsProvinceCode: string): number {
	const provRegencies = getRegenciesByProvince().get(bpsProvinceCode);
	if (!provRegencies) return 0;

	const distIdx = getDistrictsByRegency();
	const villIdx = getVillagesByDistrict();
	let count = 0;
	for (const r of provRegencies) {
		/* v8 ignore next -- valid regency selalu punya districts di data */
		const regDistricts = distIdx.get(r.bps_code) ?? [];
		for (const d of regDistricts) {
			/* v8 ignore next -- valid district selalu punya villages di data */
			count += (villIdx.get(d.bps_code) ?? []).length;
		}
	}
	return count;
}

/**
 * Ringkasan jumlah seluruh wilayah Indonesia.
 *
 * @returns Object berisi total provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan.
 *
 * @example
 * ```typescript
 * const s = getSummary();
 * console.log(s);
 * // { provinces: 38, regencies: 514, districts: 7286, villages: 84270 }
 *
 * console.log(`Indonesia punya ${s.provinces} provinsi dan ${s.villages} desa`);
 * ```
 */
export function getSummary(): {
	provinces: number;
	regencies: number;
	districts: number;
	villages: number;
} {
	return {
		provinces: provinces.length,
		regencies: regencies.length,
		districts: districts.length,
		villages: villages.length,
	};
}
