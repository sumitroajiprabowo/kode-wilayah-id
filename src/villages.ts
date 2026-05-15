/**
 * Modul data desa/kelurahan di Indonesia.
 *
 * Menyediakan fungsi untuk mengambil data 84.270 desa/kelurahan
 * berdasarkan kode BPS, kode Kemendagri, maupun kode pos.
 *
 * Setiap desa memiliki field `postal_code` yang berisi kode pos
 * dari PT Pos Indonesia (5 digit). Bernilai `null` jika kode pos
 * tidak tersedia (terutama pada wilayah Papua pemekaran).
 *
 * @example
 * ```typescript
 * import {
 *   getVillagesByBpsDistrictCode,
 *   getVillagesByPostalCode,
 * } from "kode-wilayah-id/villages";
 *
 * // Desa di kecamatan Nagreg
 * const desa = getVillagesByBpsDistrictCode("3204050");
 *
 * // Desa dengan kode pos tertentu
 * const desa10110 = getVillagesByPostalCode("10110");
 * ```
 *
 * @module villages
 */

import villagesData from "../data/villages.json";
import type { Village } from "./types";

const villages: Village[] = villagesData as Village[];

/**
 * Mengambil seluruh data desa/kelurahan di Indonesia.
 *
 * **Perhatian:** Fungsi ini mengembalikan 84.270 item (~12 MB).
 * Gunakan fungsi yang lebih spesifik jika memungkinkan.
 *
 * @returns Salinan array seluruh desa/kelurahan.
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
 * Mengambil daftar desa/kelurahan dalam satu kecamatan berdasarkan kode BPS kecamatan.
 *
 * @param code - Kode BPS kecamatan induk (7 digit). Contoh: `"3204050"` untuk kec. Nagreg.
 * @returns Array desa/kelurahan di kecamatan tersebut. Array kosong jika kode tidak valid.
 *
 * @example
 * ```typescript
 * const desa = getVillagesByBpsDistrictCode("3204050");
 * for (const d of desa) {
 *   console.log(`${d.name} — kode pos: ${d.postal_code ?? "N/A"}`);
 * }
 * ```
 */
export function getVillagesByBpsDistrictCode(code: string): Village[] {
	return villages.filter((v) => v.bps_district_code === code);
}

/**
 * Mengambil daftar desa/kelurahan dalam satu kecamatan berdasarkan kode Kemendagri kecamatan.
 *
 * @param code - Kode Kemendagri kecamatan induk (6 digit). Contoh: `"320407"`.
 * @returns Array desa/kelurahan di kecamatan tersebut. Array kosong jika kode tidak valid.
 *
 * @example
 * ```typescript
 * const desa = getVillagesByKemendagriDistrictCode("320407");
 * console.log(desa.length);
 * ```
 */
export function getVillagesByKemendagriDistrictCode(code: string): Village[] {
	return villages.filter((v) => v.kemendagri_district_code === code);
}

/**
 * Mencari desa/kelurahan berdasarkan kode BPS.
 *
 * @param code - Kode BPS desa/kelurahan (10 digit). Contoh: `"3204052003"`.
 * @returns Data desa jika ditemukan, `undefined` jika tidak ada.
 *
 * @example
 * ```typescript
 * const nagreg = getVillageByBpsCode("3204052003");
 * console.log(nagreg?.name);        // "NAGREG"
 * console.log(nagreg?.postal_code); // "40263"
 * ```
 */
export function getVillageByBpsCode(code: string): Village | undefined {
	return villages.find((v) => v.bps_code === code);
}

/**
 * Mencari desa/kelurahan berdasarkan kode Kemendagri.
 *
 * @param code - Kode Kemendagri desa/kelurahan (10 digit). Contoh: `"3204072003"`.
 * @returns Data desa jika ditemukan, `undefined` jika tidak ada.
 *
 * @example
 * ```typescript
 * const desa = getVillageByKemendagriCode("3204072003");
 * console.log(desa?.name); // "NAGREG"
 * ```
 */
export function getVillageByKemendagriCode(code: string): Village | undefined {
	return villages.find((v) => v.kemendagri_code === code);
}

/**
 * Mencari desa/kelurahan berdasarkan kode pos.
 *
 * Satu kode pos bisa dimiliki oleh beberapa desa/kelurahan,
 * sehingga fungsi ini mengembalikan array.
 *
 * @param code - Kode pos dari PT Pos Indonesia (5 digit). Contoh: `"10110"`.
 * @returns Array desa/kelurahan dengan kode pos tersebut. Array kosong jika tidak ditemukan.
 *
 * @example
 * ```typescript
 * const desa = getVillagesByPostalCode("10110");
 * console.log(desa.length); // 1
 * console.log(desa[0].name); // "GAMBIR"
 * ```
 */
export function getVillagesByPostalCode(code: string): Village[] {
	return villages.filter((v) => v.postal_code === code);
}
