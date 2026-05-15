/**
 * Modul data provinsi Indonesia.
 *
 * Menyediakan fungsi untuk mengambil data 38 provinsi
 * berdasarkan kode BPS maupun kode Kemendagri.
 *
 * @example
 * ```typescript
 * import { getProvinces, getProvinceByBpsCode } from "kode-wilayah-id/provinces";
 *
 * const semua = getProvinces();           // 38 provinsi
 * const jabar = getProvinceByBpsCode("32"); // JAWA BARAT
 * ```
 *
 * @module provinces
 */

import provincesData from "../data/provinces.json";
import type { Province } from "./types";

const provinces: Province[] = provincesData as Province[];

/**
 * Mengambil seluruh data provinsi di Indonesia.
 *
 * @returns Salinan array 38 provinsi, diurutkan berdasarkan kode BPS.
 *
 * @example
 * ```typescript
 * const provinsi = getProvinces();
 * console.log(provinsi.length); // 38
 * console.log(provinsi[0].name); // "ACEH"
 * ```
 */
export function getProvinces(): Province[] {
	return [...provinces];
}

/**
 * Mencari provinsi berdasarkan kode BPS.
 *
 * @param code - Kode BPS provinsi (2 digit). Contoh: `"32"` untuk Jawa Barat.
 * @returns Data provinsi jika ditemukan, `undefined` jika tidak ada.
 *
 * @example
 * ```typescript
 * const jabar = getProvinceByBpsCode("32");
 * console.log(jabar?.name);            // "JAWA BARAT"
 * console.log(jabar?.kemendagri_code); // "32"
 * ```
 */
export function getProvinceByBpsCode(code: string): Province | undefined {
	return provinces.find((p) => p.bps_code === code);
}

/**
 * Mencari provinsi berdasarkan kode Kemendagri.
 *
 * Catatan: 4 provinsi pemekaran Papua (BPS: 92, 95, 96, 97) memiliki
 * `kemendagri_code: null` sehingga tidak akan ditemukan melalui fungsi ini.
 *
 * @param code - Kode Kemendagri provinsi (2 digit). Contoh: `"32"` untuk Jawa Barat.
 * @returns Data provinsi jika ditemukan, `undefined` jika tidak ada.
 *
 * @example
 * ```typescript
 * const jabar = getProvinceByKemendagriCode("32");
 * console.log(jabar?.name); // "JAWA BARAT"
 * ```
 */
export function getProvinceByKemendagriCode(code: string): Province | undefined {
	return provinces.find((p) => p.kemendagri_code === code);
}
