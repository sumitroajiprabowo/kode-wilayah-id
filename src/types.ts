/**
 * Tipe data untuk seluruh level wilayah Indonesia.
 *
 * Setiap tipe punya dual code: BPS (statistik) dan Kemendagri (administrasi).
 * Kemendagri bernilai `null` untuk 4 provinsi pemekaran Papua (BPS: 92, 95, 96, 97).
 *
 * @module types
 */

/** Provinsi. */
export interface Province {
	/** Kode BPS (2 digit), misal `"32"` */
	bps_code: string;
	/** Kode Kemendagri (2 digit). `null` untuk 4 provinsi pemekaran Papua */
	kemendagri_code: string | null;
	/** Nama provinsi, misal `"JAWA BARAT"` */
	name: string;
}

/** Kabupaten/kota. */
export interface Regency {
	/** Kode BPS (4 digit), misal `"3204"` */
	bps_code: string;
	/** Kode Kemendagri (4 digit). `null` jika provinsi induk belum punya kode */
	kemendagri_code: string | null;
	/** Kode BPS provinsi induk (2 digit) */
	bps_province_code: string;
	/** Kode Kemendagri provinsi induk. `null` jika tidak tersedia */
	kemendagri_province_code: string | null;
	/** Nama kabupaten/kota, misal `"KAB. BANDUNG"` */
	name: string;
}

/** Kecamatan. */
export interface District {
	/** Kode BPS (7 digit), misal `"3204050"` */
	bps_code: string;
	/** Kode Kemendagri (6 digit). `null` jika tidak tersedia */
	kemendagri_code: string | null;
	/** Kode BPS kabupaten/kota induk (4 digit) */
	bps_regency_code: string;
	/** Kode Kemendagri kabupaten/kota induk. `null` jika tidak tersedia */
	kemendagri_regency_code: string | null;
	/** Nama kecamatan, misal `"NAGREG"` */
	name: string;
}

/** Desa/kelurahan. */
export interface Village {
	/** Kode BPS (10 digit), misal `"3204052003"` */
	bps_code: string;
	/** Kode Kemendagri (10 digit). `null` jika tidak tersedia */
	kemendagri_code: string | null;
	/** Kode BPS kecamatan induk (7 digit) */
	bps_district_code: string;
	/** Kode Kemendagri kecamatan induk. `null` jika tidak tersedia */
	kemendagri_district_code: string | null;
	/** Nama desa/kelurahan, misal `"NAGREG"` */
	name: string;
	/** Kode pos (5 digit). `null` jika belum tersedia */
	postal_code: string | null;
}

/**
 * Hasil pencarian — discriminated union berdasarkan `level`.
 *
 * @example
 * ```typescript
 * const hasil = searchByName("bandung");
 * for (const r of hasil) {
 *   if (r.level === "village") {
 *     console.log(r.data.postal_code); // aman, tipe Village
 *   }
 * }
 * ```
 */
export type SearchResult =
	| { level: "province"; data: Province }
	| { level: "regency"; data: Regency }
	| { level: "district"; data: District }
	| { level: "village"; data: Village };
