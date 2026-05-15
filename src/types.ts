/**
 * Definisi tipe data wilayah Indonesia dari level provinsi sampai desa/kelurahan.
 *
 * Indonesia punya dua sistem kode wilayah yang berjalan paralel:
 * - **BPS** (Badan Pusat Statistik) — dipakai untuk keperluan sensus dan data statistik.
 *   Format kode: provinsi 2 digit, kabupaten 4 digit, kecamatan 7 digit, desa 10 digit.
 * - **Kemendagri** (Kementerian Dalam Negeri) — dipakai untuk administrasi pemerintahan.
 *   Format kode: provinsi 2 digit, kabupaten 4 digit, kecamatan 6 digit, desa 10 digit.
 *
 * Kedua kode ini sering berbeda untuk wilayah yang sama. Contoh kecamatan Nagreg:
 * BPS = `"3204050"`, Kemendagri = `"320407"`.
 *
 * Catatan penting: 4 provinsi pemekaran Papua (Papua Pegunungan, Papua Tengah,
 * Papua Selatan, Papua Barat Daya — kode BPS: 92, 95, 96, 97) belum punya kode
 * Kemendagri resmi, jadi `kemendagri_code` bernilai `null` untuk provinsi ini
 * beserta seluruh kabupaten, kecamatan, dan desa di bawahnya.
 *
 * @module types
 */

/**
 * Data provinsi Indonesia.
 *
 * @example
 * ```typescript
 * const jabar = getProvinceByBpsCode("32");
 * console.log(jabar?.name);            // "JAWA BARAT"
 * console.log(jabar?.kemendagri_code); // "32"
 * ```
 */
export interface Province {
	/** Kode BPS provinsi (2 digit). Contoh: `"32"` untuk Jawa Barat, `"11"` untuk Aceh */
	bps_code: string;
	/**
	 * Kode Kemendagri provinsi (2 digit).
	 * Bernilai `null` untuk 4 provinsi pemekaran Papua yang belum punya kode resmi.
	 */
	kemendagri_code: string | null;
	/** Nama resmi provinsi dalam huruf kapital. Contoh: `"JAWA BARAT"`, `"DKI JAKARTA"` */
	name: string;
}

/**
 * Data kabupaten atau kota.
 *
 * Prefix nama menunjukkan tipe wilayah: `"KAB."` untuk kabupaten, `"KOTA"` untuk kota.
 *
 * @example
 * ```typescript
 * const bandung = getRegencyByBpsCode("3204");
 * console.log(bandung?.name);              // "KAB. BANDUNG"
 * console.log(bandung?.bps_province_code); // "32"
 * ```
 */
export interface Regency {
	/** Kode BPS kabupaten/kota (4 digit). Contoh: `"3204"` untuk Kab. Bandung */
	bps_code: string;
	/**
	 * Kode Kemendagri kabupaten/kota (4 digit).
	 * `null` jika provinsi induknya termasuk 4 provinsi pemekaran Papua.
	 */
	kemendagri_code: string | null;
	/** Kode BPS provinsi induk (2 digit). Bisa dipakai untuk join ke data provinsi */
	bps_province_code: string;
	/** Kode Kemendagri provinsi induk (2 digit). `null` jika tidak tersedia */
	kemendagri_province_code: string | null;
	/** Nama resmi kabupaten/kota. Contoh: `"KAB. BANDUNG"`, `"KOTA SURABAYA"` */
	name: string;
}

/**
 * Data kecamatan.
 *
 * Perhatikan bahwa format kode BPS dan Kemendagri berbeda di level ini:
 * BPS pakai 7 digit (2+2+3), Kemendagri pakai 6 digit (2+2+2).
 *
 * @example
 * ```typescript
 * const nagreg = getDistrictByBpsCode("3204050");
 * console.log(nagreg?.name);              // "NAGREG"
 * console.log(nagreg?.bps_regency_code); // "3204"
 * ```
 */
export interface District {
	/** Kode BPS kecamatan (7 digit). Contoh: `"3204050"` untuk Nagreg */
	bps_code: string;
	/** Kode Kemendagri kecamatan (6 digit). Contoh: `"320407"`. `null` jika tidak tersedia */
	kemendagri_code: string | null;
	/** Kode BPS kabupaten/kota induk (4 digit). Bisa dipakai untuk join ke data kabupaten */
	bps_regency_code: string;
	/** Kode Kemendagri kabupaten/kota induk (4 digit). `null` jika tidak tersedia */
	kemendagri_regency_code: string | null;
	/** Nama resmi kecamatan dalam huruf kapital. Contoh: `"NAGREG"` */
	name: string;
}

/**
 * Data desa atau kelurahan, termasuk kode pos.
 *
 * Field `postal_code` berisi kode pos 5 digit dari PT Pos Indonesia.
 * Bernilai `null` untuk desa yang belum punya kode pos, terutama di
 * wilayah Papua pemekaran.
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
	/** Kode BPS kecamatan induk (7 digit). Bisa dipakai untuk join ke data kecamatan */
	bps_district_code: string;
	/** Kode Kemendagri kecamatan induk (6 digit). `null` jika tidak tersedia */
	kemendagri_district_code: string | null;
	/** Nama resmi desa/kelurahan dalam huruf kapital. Contoh: `"NAGREG"` */
	name: string;
	/**
	 * Kode pos dari PT Pos Indonesia (5 digit). Contoh: `"40263"`.
	 * `null` jika kode pos belum tersedia untuk desa ini.
	 */
	postal_code: string | null;
}

/**
 * Hasil pencarian wilayah — discriminated union berdasarkan `level`.
 *
 * Karena `searchByName()` mencari di semua level sekaligus, hasilnya bisa
 * campur antara provinsi, kabupaten, kecamatan, dan desa. Pakai properti
 * `level` untuk narrowing tipe `data`.
 *
 * @example
 * ```typescript
 * const hasil = searchByName("bandung");
 * for (const r of hasil) {
 *   switch (r.level) {
 *     case "province":
 *       console.log(r.data.bps_code);    // string (2 digit)
 *       break;
 *     case "village":
 *       console.log(r.data.postal_code); // bisa diakses karena tipe Village
 *       break;
 *   }
 * }
 * ```
 */
export type SearchResult =
	| { level: "province"; data: Province }
	| { level: "regency"; data: Regency }
	| { level: "district"; data: District }
	| { level: "village"; data: Village };
