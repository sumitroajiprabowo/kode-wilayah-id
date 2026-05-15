/**
 * Modul data kabupaten/kota di Indonesia.
 *
 * Menyediakan fungsi untuk mengambil data 514 kabupaten/kota
 * berdasarkan kode BPS maupun kode Kemendagri, serta
 * mengambil daftar kabupaten/kota dalam satu provinsi.
 *
 * @example
 * ```typescript
 * import { getRegenciesByBpsProvinceCode } from "kode-wilayah-id/regencies";
 *
 * const kabJabar = getRegenciesByBpsProvinceCode("32"); // 27 kab/kota
 * ```
 *
 * @module regencies
 */

import regenciesData from "../data/regencies.json";
import type { Regency } from "./types";

const regencies: Regency[] = regenciesData as Regency[];

/**
 * Mengambil seluruh data kabupaten/kota di Indonesia.
 *
 * @returns Salinan array 514 kabupaten/kota.
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
 * Mengambil daftar kabupaten/kota dalam satu provinsi berdasarkan kode BPS provinsi.
 *
 * @param code - Kode BPS provinsi induk (2 digit). Contoh: `"32"` untuk Jawa Barat.
 * @returns Array kabupaten/kota di provinsi tersebut. Array kosong jika kode tidak valid.
 *
 * @example
 * ```typescript
 * const kabJabar = getRegenciesByBpsProvinceCode("32");
 * console.log(kabJabar.length); // 27
 * console.log(kabJabar[0].name); // "KAB. BOGOR"
 * ```
 */
export function getRegenciesByBpsProvinceCode(code: string): Regency[] {
	return regencies.filter((r) => r.bps_province_code === code);
}

/**
 * Mengambil daftar kabupaten/kota dalam satu provinsi berdasarkan kode Kemendagri provinsi.
 *
 * @param code - Kode Kemendagri provinsi induk (2 digit). Contoh: `"32"` untuk Jawa Barat.
 * @returns Array kabupaten/kota di provinsi tersebut. Array kosong jika kode tidak valid.
 *
 * @example
 * ```typescript
 * const kabJabar = getRegenciesByKemendagriProvinceCode("32");
 * console.log(kabJabar.length); // 27
 * ```
 */
export function getRegenciesByKemendagriProvinceCode(code: string): Regency[] {
	return regencies.filter((r) => r.kemendagri_province_code === code);
}

/**
 * Mencari kabupaten/kota berdasarkan kode BPS.
 *
 * @param code - Kode BPS kabupaten/kota (4 digit). Contoh: `"3204"` untuk Kab. Bandung.
 * @returns Data kabupaten/kota jika ditemukan, `undefined` jika tidak ada.
 *
 * @example
 * ```typescript
 * const bandung = getRegencyByBpsCode("3204");
 * console.log(bandung?.name); // "KAB. BANDUNG"
 * ```
 */
export function getRegencyByBpsCode(code: string): Regency | undefined {
	return regencies.find((r) => r.bps_code === code);
}

/**
 * Mencari kabupaten/kota berdasarkan kode Kemendagri.
 *
 * @param code - Kode Kemendagri kabupaten/kota (4 digit). Contoh: `"3204"`.
 * @returns Data kabupaten/kota jika ditemukan, `undefined` jika tidak ada.
 *
 * @example
 * ```typescript
 * const bandung = getRegencyByKemendagriCode("3204");
 * console.log(bandung?.name); // "KAB. BANDUNG"
 * ```
 */
export function getRegencyByKemendagriCode(code: string): Regency | undefined {
	return regencies.find((r) => r.kemendagri_code === code);
}
