/**
 * Data 514 kabupaten/kota Indonesia.
 * @module regencies
 */

import regenciesData from "../data/regencies.json";
import type { Regency } from "./types";

const regencies: Regency[] = regenciesData as Regency[];

/** Ambil semua kabupaten/kota. */
export function getRegencies(): Regency[] {
	return [...regencies];
}

/** Ambil daftar kabupaten/kota dalam satu provinsi berdasarkan kode BPS provinsi (2 digit). */
export function getRegenciesByBpsProvinceCode(code: string): Regency[] {
	return regencies.filter((r) => r.bps_province_code === code);
}

/** Ambil daftar kabupaten/kota dalam satu provinsi berdasarkan kode Kemendagri provinsi (2 digit). */
export function getRegenciesByKemendagriProvinceCode(code: string): Regency[] {
	return regencies.filter((r) => r.kemendagri_province_code === code);
}

/** Cari kabupaten/kota berdasarkan kode BPS (4 digit). */
export function getRegencyByBpsCode(code: string): Regency | undefined {
	return regencies.find((r) => r.bps_code === code);
}

/** Cari kabupaten/kota berdasarkan kode Kemendagri (4 digit). */
export function getRegencyByKemendagriCode(code: string): Regency | undefined {
	return regencies.find((r) => r.kemendagri_code === code);
}
