/**
 * Data 38 provinsi Indonesia.
 *
 * Menyediakan fungsi untuk mengambil dan mencari data provinsi
 * berdasarkan kode BPS maupun kode Kemendagri.
 *
 * Secara internal, modul ini pakai lazy-initialized `Map` untuk lookup O(1).
 * Meskipun provinsi cuma 38 item (jadi Array.find pun cepat), Map tetap dipakai
 * supaya pola akses konsisten di seluruh modul.
 *
 * @example
 * ```typescript
 * import { getProvinces, getProvinceByBpsCode } from "kode-wilayah-id/provinces";
 *
 * const semua = getProvinces();            // 38 provinsi
 * const jabar = getProvinceByBpsCode("32"); // { name: "JAWA BARAT", ... }
 * ```
 *
 * @module provinces
 */

import provincesData from "../data/provinces.json";
import type { Province } from "./types";

const provinces: Province[] = provincesData as Province[];

// ---------------------------------------------------------------------------
// Lazy-initialized index Maps — dibuat sekali saat pertama kali dipanggil
// ---------------------------------------------------------------------------

/** Index kode BPS provinsi → Province (1-to-1) */
let bpsIndex: Map<string, Province> | null = null;
function getBpsIndex(): Map<string, Province> {
	if (!bpsIndex) {
		bpsIndex = new Map(provinces.map((p) => [p.bps_code, p]));
	}
	return bpsIndex;
}

/** Index kode Kemendagri provinsi → Province (1-to-1, skip null) */
let kemendagriIndex: Map<string, Province> | null = null;
function getKemendagriIndex(): Map<string, Province> {
	if (!kemendagriIndex) {
		kemendagriIndex = new Map();
		for (const p of provinces) {
			if (p.kemendagri_code) {
				kemendagriIndex.set(p.kemendagri_code, p);
			}
		}
	}
	return kemendagriIndex;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Ambil seluruh data provinsi di Indonesia.
 *
 * Return shallow copy supaya data asli tidak bisa dimutasi dari luar.
 *
 * @returns Array berisi 38 provinsi, urut berdasarkan kode BPS.
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
 * Cari satu provinsi berdasarkan kode BPS.
 *
 * @param code - Kode BPS provinsi (2 digit). Contoh: `"32"` untuk Jawa Barat.
 * @returns Data provinsi kalau ketemu, `undefined` kalau kode tidak valid.
 *
 * @example
 * ```typescript
 * const jabar = getProvinceByBpsCode("32");
 * console.log(jabar?.name);            // "JAWA BARAT"
 * console.log(jabar?.kemendagri_code); // "32"
 * ```
 */
export function getProvinceByBpsCode(code: string): Province | undefined {
	return getBpsIndex().get(code);
}

/**
 * Cari satu provinsi berdasarkan kode Kemendagri.
 *
 * Perlu diketahui: 4 provinsi pemekaran Papua (BPS: 92, 95, 96, 97) punya
 * `kemendagri_code: null`, jadi tidak akan pernah ketemu lewat fungsi ini.
 * Pakai `getProvinceByBpsCode()` untuk mencari provinsi-provinsi tersebut.
 *
 * @param code - Kode Kemendagri provinsi (2 digit). Contoh: `"32"` untuk Jawa Barat.
 * @returns Data provinsi kalau ketemu, `undefined` kalau tidak ada.
 *
 * @example
 * ```typescript
 * const jabar = getProvinceByKemendagriCode("32");
 * console.log(jabar?.name); // "JAWA BARAT"
 *
 * // Papua Pegunungan (BPS: 95) tidak punya kode Kemendagri
 * const papuaPeg = getProvinceByKemendagriCode("95"); // undefined
 * ```
 */
export function getProvinceByKemendagriCode(code: string): Province | undefined {
	return getKemendagriIndex().get(code);
}
