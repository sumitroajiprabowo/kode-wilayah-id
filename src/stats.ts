/**
 * Statistik dan penghitungan wilayah Indonesia.
 *
 * Fungsi-fungsi di sini berguna untuk dashboard, info page, atau
 * validasi data — menghitung jumlah wilayah di berbagai level.
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
	return regencies.filter((r) => r.bps_province_code === bpsProvinceCode).length;
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
	return districts.filter((d) => d.bps_regency_code === bpsRegencyCode).length;
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
	return villages.filter((v) => v.bps_district_code === bpsDistrictCode).length;
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
	const regencyCodes = new Set(
		regencies.filter((r) => r.bps_province_code === bpsProvinceCode).map((r) => r.bps_code),
	);
	return districts.filter((d) => regencyCodes.has(d.bps_regency_code)).length;
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
	const districtCodes = new Set(
		districts.filter((d) => d.bps_regency_code === bpsRegencyCode).map((d) => d.bps_code),
	);
	return villages.filter((v) => districtCodes.has(v.bps_district_code)).length;
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
	const regencyCodes = new Set(
		regencies.filter((r) => r.bps_province_code === bpsProvinceCode).map((r) => r.bps_code),
	);
	const districtCodes = new Set(
		districts.filter((d) => regencyCodes.has(d.bps_regency_code)).map((d) => d.bps_code),
	);
	return villages.filter((v) => districtCodes.has(v.bps_district_code)).length;
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
