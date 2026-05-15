/**
 * Data 84.270 desa/kelurahan Indonesia.
 *
 * Setiap desa punya field `postal_code` (kode pos PT Pos Indonesia, 5 digit).
 * Bernilai `null` kalau belum tersedia (terutama wilayah Papua pemekaran).
 *
 * @module villages
 */

import villagesData from "../data/villages.json";
import type { Village } from "./types";

const villages: Village[] = villagesData as Village[];

/**
 * Ambil semua desa/kelurahan.
 *
 * Hati-hati, ini 84.270 item (~12 MB). Pakai fungsi yang lebih spesifik kalau bisa.
 */
export function getVillages(): Village[] {
	return [...villages];
}

/** Ambil daftar desa dalam satu kecamatan berdasarkan kode BPS kecamatan (7 digit). */
export function getVillagesByBpsDistrictCode(code: string): Village[] {
	return villages.filter((v) => v.bps_district_code === code);
}

/** Ambil daftar desa dalam satu kecamatan berdasarkan kode Kemendagri kecamatan (6 digit). */
export function getVillagesByKemendagriDistrictCode(code: string): Village[] {
	return villages.filter((v) => v.kemendagri_district_code === code);
}

/** Cari desa berdasarkan kode BPS (10 digit). */
export function getVillageByBpsCode(code: string): Village | undefined {
	return villages.find((v) => v.bps_code === code);
}

/** Cari desa berdasarkan kode Kemendagri (10 digit). */
export function getVillageByKemendagriCode(code: string): Village | undefined {
	return villages.find((v) => v.kemendagri_code === code);
}

/**
 * Cari desa berdasarkan kode pos (5 digit).
 *
 * Satu kode pos bisa dimiliki beberapa desa, makanya return array.
 */
export function getVillagesByPostalCode(code: string): Village[] {
	return villages.filter((v) => v.postal_code === code);
}
