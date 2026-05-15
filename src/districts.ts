/**
 * Data 7.286 kecamatan Indonesia.
 * @module districts
 */

import districtsData from "../data/districts.json";
import type { District } from "./types";

const districts: District[] = districtsData as District[];

/** Ambil semua kecamatan. */
export function getDistricts(): District[] {
	return [...districts];
}

/** Ambil daftar kecamatan dalam satu kabupaten/kota berdasarkan kode BPS kabupaten (4 digit). */
export function getDistrictsByBpsRegencyCode(code: string): District[] {
	return districts.filter((d) => d.bps_regency_code === code);
}

/** Ambil daftar kecamatan dalam satu kabupaten/kota berdasarkan kode Kemendagri kabupaten (4 digit). */
export function getDistrictsByKemendagriRegencyCode(code: string): District[] {
	return districts.filter((d) => d.kemendagri_regency_code === code);
}

/** Cari kecamatan berdasarkan kode BPS (7 digit). */
export function getDistrictByBpsCode(code: string): District | undefined {
	return districts.find((d) => d.bps_code === code);
}

/** Cari kecamatan berdasarkan kode Kemendagri (6 digit). */
export function getDistrictByKemendagriCode(code: string): District | undefined {
	return districts.find((d) => d.kemendagri_code === code);
}
