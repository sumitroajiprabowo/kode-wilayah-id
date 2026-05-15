/**
 * Data 7.286 kecamatan di Indonesia.
 *
 * Menyediakan fungsi untuk mengambil daftar kecamatan dalam satu kabupaten/kota,
 * maupun mencari kecamatan tertentu berdasarkan kode BPS atau Kemendagri.
 *
 * Perlu diketahui: format kode BPS dan Kemendagri berbeda di level kecamatan.
 * BPS pakai 7 digit (contoh: `"3204050"`), Kemendagri pakai 6 digit (contoh: `"320407"`).
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
	return districts.filter((d) => d.bps_regency_code === code);
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
	return districts.filter((d) => d.kemendagri_regency_code === code);
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
	return districts.find((d) => d.bps_code === code);
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
	return districts.find((d) => d.kemendagri_code === code);
}
