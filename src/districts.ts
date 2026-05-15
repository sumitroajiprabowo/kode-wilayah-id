/**
 * Modul data kecamatan di Indonesia.
 *
 * Menyediakan fungsi untuk mengambil data 7.286 kecamatan
 * berdasarkan kode BPS maupun kode Kemendagri, serta
 * mengambil daftar kecamatan dalam satu kabupaten/kota.
 *
 * @example
 * ```typescript
 * import { getDistrictsByBpsRegencyCode } from "kode-wilayah-id/districts";
 *
 * const kecBandung = getDistrictsByBpsRegencyCode("3204"); // kecamatan di Kab. Bandung
 * ```
 *
 * @module districts
 */

import districtsData from "../data/districts.json";
import type { District } from "./types";

const districts: District[] = districtsData as District[];

/**
 * Mengambil seluruh data kecamatan di Indonesia.
 *
 * @returns Salinan array 7.286 kecamatan.
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
 * Mengambil daftar kecamatan dalam satu kabupaten/kota berdasarkan kode BPS kabupaten/kota.
 *
 * @param code - Kode BPS kabupaten/kota induk (4 digit). Contoh: `"3204"` untuk Kab. Bandung.
 * @returns Array kecamatan di kabupaten/kota tersebut. Array kosong jika kode tidak valid.
 *
 * @example
 * ```typescript
 * const kecamatan = getDistrictsByBpsRegencyCode("3204");
 * console.log(kecamatan.length); // jumlah kecamatan di Kab. Bandung
 * ```
 */
export function getDistrictsByBpsRegencyCode(code: string): District[] {
	return districts.filter((d) => d.bps_regency_code === code);
}

/**
 * Mengambil daftar kecamatan dalam satu kabupaten/kota berdasarkan kode Kemendagri kabupaten/kota.
 *
 * @param code - Kode Kemendagri kabupaten/kota induk (4 digit). Contoh: `"3204"`.
 * @returns Array kecamatan di kabupaten/kota tersebut. Array kosong jika kode tidak valid.
 *
 * @example
 * ```typescript
 * const kecamatan = getDistrictsByKemendagriRegencyCode("3204");
 * console.log(kecamatan.length); // jumlah kecamatan di Kab. Bandung
 * ```
 */
export function getDistrictsByKemendagriRegencyCode(code: string): District[] {
	return districts.filter((d) => d.kemendagri_regency_code === code);
}

/**
 * Mencari kecamatan berdasarkan kode BPS.
 *
 * @param code - Kode BPS kecamatan (7 digit). Contoh: `"3204050"` untuk Nagreg.
 * @returns Data kecamatan jika ditemukan, `undefined` jika tidak ada.
 *
 * @example
 * ```typescript
 * const nagreg = getDistrictByBpsCode("3204050");
 * console.log(nagreg?.name); // "NAGREG"
 * ```
 */
export function getDistrictByBpsCode(code: string): District | undefined {
	return districts.find((d) => d.bps_code === code);
}

/**
 * Mencari kecamatan berdasarkan kode Kemendagri.
 *
 * @param code - Kode Kemendagri kecamatan (6 digit). Contoh: `"320407"`.
 * @returns Data kecamatan jika ditemukan, `undefined` jika tidak ada.
 *
 * @example
 * ```typescript
 * const nagreg = getDistrictByKemendagriCode("320407");
 * console.log(nagreg?.name); // "NAGREG"
 * ```
 */
export function getDistrictByKemendagriCode(code: string): District | undefined {
	return districts.find((d) => d.kemendagri_code === code);
}
