/**
 * Data 38 provinsi Indonesia.
 * @module provinces
 */

import provincesData from "../data/provinces.json";
import type { Province } from "./types";

const provinces: Province[] = provincesData as Province[];

/** Ambil semua provinsi. */
export function getProvinces(): Province[] {
	return [...provinces];
}

/** Cari provinsi berdasarkan kode BPS (2 digit). */
export function getProvinceByBpsCode(code: string): Province | undefined {
	return provinces.find((p) => p.bps_code === code);
}

/**
 * Cari provinsi berdasarkan kode Kemendagri (2 digit).
 *
 * 4 provinsi pemekaran Papua punya `kemendagri_code: null`,
 * jadi tidak akan ditemukan lewat fungsi ini.
 */
export function getProvinceByKemendagriCode(code: string): Province | undefined {
	return provinces.find((p) => p.kemendagri_code === code);
}
