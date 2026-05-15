/**
 * Definisi tipe data untuk seluruh level wilayah Indonesia.
 *
 * Setiap tipe memiliki dual code system:
 * - `bps_code` — kode dari BPS (Badan Pusat Statistik), digunakan untuk keperluan statistik
 * - `kemendagri_code` — kode dari Kemendagri (Kementerian Dalam Negeri), digunakan untuk administrasi pemerintahan
 *
 * Kode Kemendagri bernilai `null` pada 4 provinsi pemekaran Papua (BPS: 92, 95, 96, 97)
 * yang belum memiliki kode Kemendagri resmi.
 *
 * @module types
 */

/**
 * Data provinsi Indonesia.
 *
 * @example
 * ```typescript
 * const provinsi = getProvinceByBpsCode("32");
 * console.log(provinsi?.name);            // "JAWA BARAT"
 * console.log(provinsi?.bps_code);        // "32"
 * console.log(provinsi?.kemendagri_code); // "32"
 * ```
 */
export interface Province {
	/** Kode BPS provinsi (2 digit). Contoh: `"32"` untuk Jawa Barat */
	bps_code: string;
	/** Kode Kemendagri provinsi (2 digit). `null` untuk 4 provinsi pemekaran Papua */
	kemendagri_code: string | null;
	/** Nama resmi provinsi dalam huruf kapital. Contoh: `"JAWA BARAT"` */
	name: string;
}

/**
 * Data kabupaten atau kota.
 *
 * @example
 * ```typescript
 * const kab = getRegencyByBpsCode("3204");
 * console.log(kab?.name);               // "KAB. BANDUNG"
 * console.log(kab?.bps_province_code);  // "32"
 * ```
 */
export interface Regency {
	/** Kode BPS kabupaten/kota (4 digit). Contoh: `"3204"` untuk Kab. Bandung */
	bps_code: string;
	/** Kode Kemendagri kabupaten/kota (4 digit). `null` jika provinsi induk belum punya kode Kemendagri */
	kemendagri_code: string | null;
	/** Kode BPS provinsi induk (2 digit). Contoh: `"32"` */
	bps_province_code: string;
	/** Kode Kemendagri provinsi induk (2 digit). `null` jika tidak tersedia */
	kemendagri_province_code: string | null;
	/** Nama resmi kabupaten/kota dalam huruf kapital. Contoh: `"KAB. BANDUNG"` */
	name: string;
}

/**
 * Data kecamatan.
 *
 * @example
 * ```typescript
 * const kec = getDistrictByBpsCode("3204050");
 * console.log(kec?.name);              // "NAGREG"
 * console.log(kec?.bps_regency_code); // "3204"
 * ```
 */
export interface District {
	/** Kode BPS kecamatan (7 digit). Contoh: `"3204050"` untuk Nagreg */
	bps_code: string;
	/** Kode Kemendagri kecamatan (6 digit). `null` jika tidak tersedia */
	kemendagri_code: string | null;
	/** Kode BPS kabupaten/kota induk (4 digit). Contoh: `"3204"` */
	bps_regency_code: string;
	/** Kode Kemendagri kabupaten/kota induk (4 digit). `null` jika tidak tersedia */
	kemendagri_regency_code: string | null;
	/** Nama resmi kecamatan dalam huruf kapital. Contoh: `"NAGREG"` */
	name: string;
}

/**
 * Data desa atau kelurahan, termasuk kode pos.
 *
 * @example
 * ```typescript
 * const desa = getVillageByBpsCode("3204052003");
 * console.log(desa?.name);        // "NAGREG"
 * console.log(desa?.postal_code); // "40263"
 * ```
 */
export interface Village {
	/** Kode BPS desa/kelurahan (10 digit). Contoh: `"3204052003"` */
	bps_code: string;
	/** Kode Kemendagri desa/kelurahan (10 digit). `null` jika tidak tersedia */
	kemendagri_code: string | null;
	/** Kode BPS kecamatan induk (7 digit). Contoh: `"3204050"` */
	bps_district_code: string;
	/** Kode Kemendagri kecamatan induk (6 digit). `null` jika tidak tersedia */
	kemendagri_district_code: string | null;
	/** Nama resmi desa/kelurahan dalam huruf kapital. Contoh: `"NAGREG"` */
	name: string;
	/** Kode pos dari PT Pos Indonesia (5 digit). `null` jika tidak tersedia. Contoh: `"40263"` */
	postal_code: string | null;
}

/**
 * Hasil pencarian wilayah — discriminated union berdasarkan level.
 *
 * Gunakan properti `level` untuk menentukan tipe `data`:
 *
 * @example
 * ```typescript
 * const hasil = searchByName("bandung");
 * for (const r of hasil) {
 *   if (r.level === "village") {
 *     console.log(r.data.postal_code); // aman, data bertipe Village
 *   }
 * }
 * ```
 */
export type SearchResult =
	| { level: "province"; data: Province }
	| { level: "regency"; data: Regency }
	| { level: "district"; data: District }
	| { level: "village"; data: Village };
