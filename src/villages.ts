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
	return villages.filter((v) => v.bps_district_code === code);
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
	return villages.filter((v) => v.kemendagri_district_code === code);
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
	return villages.find((v) => v.bps_code === code);
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
	return villages.find((v) => v.kemendagri_code === code);
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
	return villages.filter((v) => v.postal_code === code);
}
