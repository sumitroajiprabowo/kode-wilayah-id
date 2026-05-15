/**
 * Fungsi hierarki wilayah — reverse lookup dan drill-down tree.
 *
 * Modul ini paling berguna untuk:
 * - **Form alamat**: user pilih desa → otomatis keisi kecamatan, kabupaten, provinsi
 * - **Detail wilayah**: dari satu kode, dapat info lengkap sampai ke atas
 * - **Drill-down**: dari provinsi, dapat tree lengkap sampai desa
 *
 * @example
 * ```typescript
 * import {
 *   getVillageWithParents,
 *   getDistrictWithParents,
 *   getRegencyWithParent,
 *   getProvinceTree,
 * } from "kode-wilayah-id/hierarchy";
 *
 * // Reverse lookup: desa → kecamatan → kabupaten → provinsi
 * const info = getVillageWithParents("3204101005");
 * console.log(info?.province.name); // "JAWA BARAT"
 *
 * // Drill-down: provinsi → kabupaten → kecamatan → desa
 * const tree = getProvinceTree("32");
 * console.log(tree?.regencies.length); // 27 kabupaten/kota di Jabar
 * ```
 *
 * @module hierarchy
 */

import districtsData from "../data/districts.json";
import provincesData from "../data/provinces.json";
import regenciesData from "../data/regencies.json";
import villagesData from "../data/villages.json";
import type {
	District,
	DistrictHierarchy,
	DistrictNode,
	Province,
	ProvinceTree,
	Regency,
	RegencyHierarchy,
	RegencyNode,
	Village,
	VillageHierarchy,
} from "./types";

const provinces: Province[] = provincesData as Province[];
const regencies: Regency[] = regenciesData as Regency[];
const districts: District[] = districtsData as District[];
const villages: Village[] = villagesData as Village[];

// Helper: cari satu item, return undefined kalau gak ketemu
function findProvince(code: string): Province | undefined {
	return provinces.find((p) => p.bps_code === code);
}
function findRegency(code: string): Regency | undefined {
	return regencies.find((r) => r.bps_code === code);
}
function findDistrict(code: string): District | undefined {
	return districts.find((d) => d.bps_code === code);
}

/**
 * Dari kode BPS desa, dapat info lengkap desa + kecamatan + kabupaten + provinsi.
 *
 * Ini reverse lookup — dari level paling bawah, naik ke atas sampai provinsi.
 * Berguna banget untuk form alamat: user pilih desa, langsung keisi semua field di atasnya.
 *
 * @param bpsCode - Kode BPS desa/kelurahan (10 digit). Contoh: `"3204101005"`.
 * @returns Object berisi `village`, `district`, `regency`, `province`.
 *          `undefined` kalau kode desa tidak ditemukan atau parent-nya tidak lengkap.
 *
 * @example
 * ```typescript
 * const info = getVillageWithParents("3204101005");
 * if (info) {
 *   console.log(info.village.name);   // "NAGREG"
 *   console.log(info.district.name);  // "NAGREG"
 *   console.log(info.regency.name);   // "KAB. BANDUNG"
 *   console.log(info.province.name);  // "JAWA BARAT"
 *   console.log(info.village.postal_code); // "40215"
 * }
 * ```
 */
export function getVillageWithParents(bpsCode: string): VillageHierarchy | undefined {
	const village = villages.find((v) => v.bps_code === bpsCode);
	if (!village) return undefined;

	const district = findDistrict(village.bps_district_code);
	/* v8 ignore next -- data integrity dijamin oleh integration test */
	const regency = district ? findRegency(district.bps_regency_code) : undefined;
	/* v8 ignore next -- data integrity dijamin oleh integration test */
	const province = regency ? findProvince(regency.bps_province_code) : undefined;

	/* v8 ignore next 2 -- data integrity dijamin oleh integration test */
	if (!district || !regency || !province) return undefined;

	return { province, regency, district, village };
}

/**
 * Dari kode BPS kecamatan, dapat info lengkap kecamatan + kabupaten + provinsi.
 *
 * @param bpsCode - Kode BPS kecamatan (7 digit). Contoh: `"3204101"`.
 * @returns Object berisi `district`, `regency`, `province`.
 *          `undefined` kalau kode tidak ditemukan.
 *
 * @example
 * ```typescript
 * const info = getDistrictWithParents("3204101");
 * if (info) {
 *   console.log(info.district.name); // "NAGREG"
 *   console.log(info.regency.name);  // "KAB. BANDUNG"
 *   console.log(info.province.name); // "JAWA BARAT"
 * }
 * ```
 */
export function getDistrictWithParents(bpsCode: string): DistrictHierarchy | undefined {
	const district = findDistrict(bpsCode);
	if (!district) return undefined;

	const regency = findRegency(district.bps_regency_code);
	/* v8 ignore next -- ternary false branch: data integrity dijamin oleh integration test */
	const province = regency ? findProvince(regency.bps_province_code) : undefined;

	/* v8 ignore next 2 -- data integrity dijamin oleh integration test */
	if (!regency || !province) return undefined;

	return { province, regency, district };
}

/**
 * Dari kode BPS kabupaten/kota, dapat info kabupaten + provinsi induk.
 *
 * @param bpsCode - Kode BPS kabupaten/kota (4 digit). Contoh: `"3204"`.
 * @returns Object berisi `regency`, `province`.
 *          `undefined` kalau kode tidak ditemukan.
 *
 * @example
 * ```typescript
 * const info = getRegencyWithParent("3204");
 * if (info) {
 *   console.log(info.regency.name);  // "KAB. BANDUNG"
 *   console.log(info.province.name); // "JAWA BARAT"
 * }
 * ```
 */
export function getRegencyWithParent(bpsCode: string): RegencyHierarchy | undefined {
	const regency = findRegency(bpsCode);
	if (!regency) return undefined;

	const province = findProvince(regency.bps_province_code);
	/* v8 ignore next 2 -- data integrity dijamin oleh integration test */
	if (!province) return undefined;

	return { province, regency };
}

/**
 * Drill-down: dari kode BPS provinsi, bangun tree lengkap sampai desa.
 *
 * Return tree hierarki: provinsi → kabupaten → kecamatan → desa.
 *
 * Hati-hati: untuk provinsi besar (misal Jawa Barat), tree-nya bisa berisi
 * ribuan desa. Pertimbangkan pakai `getRegencyTree()` atau `getDistrictTree()`
 * kalau cuma butuh sebagian.
 *
 * @param bpsProvinceCode - Kode BPS provinsi (2 digit). Contoh: `"32"` untuk Jawa Barat.
 * @returns Tree hierarki lengkap. `undefined` kalau provinsi tidak ditemukan.
 *
 * @example
 * ```typescript
 * const tree = getProvinceTree("32");
 * if (tree) {
 *   console.log(tree.province.name);        // "JAWA BARAT"
 *   console.log(tree.regencies.length);     // 27
 *   const firstKab = tree.regencies[0];
 *   console.log(firstKab.regency.name);     // "KAB. BOGOR"
 *   console.log(firstKab.districts.length); // jumlah kecamatan
 * }
 * ```
 */
export function getProvinceTree(bpsProvinceCode: string): ProvinceTree | undefined {
	const province = findProvince(bpsProvinceCode);
	if (!province) return undefined;

	const provRegencies = regencies.filter((r) => r.bps_province_code === bpsProvinceCode);

	const regencyNodes: RegencyNode[] = provRegencies.map((regency) => {
		const regDistricts = districts.filter((d) => d.bps_regency_code === regency.bps_code);

		const districtNodes: DistrictNode[] = regDistricts.map((district) => ({
			district,
			villages: villages.filter((v) => v.bps_district_code === district.bps_code),
		}));

		return { regency, districts: districtNodes };
	});

	return { province, regencies: regencyNodes };
}

/**
 * Drill-down: dari kode BPS kabupaten, bangun tree kabupaten → kecamatan → desa.
 *
 * Lebih ringan dari `getProvinceTree()` karena cuma satu kabupaten.
 *
 * @param bpsRegencyCode - Kode BPS kabupaten/kota (4 digit). Contoh: `"3204"`.
 * @returns Object berisi `regency` dan `districts` (masing-masing berisi `villages`).
 *          `undefined` kalau kabupaten tidak ditemukan.
 *
 * @example
 * ```typescript
 * const tree = getRegencyTree("3204");
 * if (tree) {
 *   console.log(tree.regency.name); // "KAB. BANDUNG"
 *   for (const kec of tree.districts) {
 *     console.log(`${kec.district.name}: ${kec.villages.length} desa`);
 *   }
 * }
 * ```
 */
export function getRegencyTree(bpsRegencyCode: string): RegencyNode | undefined {
	const regency = findRegency(bpsRegencyCode);
	if (!regency) return undefined;

	const regDistricts = districts.filter((d) => d.bps_regency_code === bpsRegencyCode);

	const districtNodes: DistrictNode[] = regDistricts.map((district) => ({
		district,
		villages: villages.filter((v) => v.bps_district_code === district.bps_code),
	}));

	return { regency, districts: districtNodes };
}

/**
 * Drill-down: dari kode BPS kecamatan, dapat kecamatan beserta semua desanya.
 *
 * Paling ringan dari semua fungsi tree — cuma satu kecamatan + desa-desanya.
 *
 * @param bpsDistrictCode - Kode BPS kecamatan (7 digit). Contoh: `"3204101"`.
 * @returns Object berisi `district` dan `villages`.
 *          `undefined` kalau kecamatan tidak ditemukan.
 *
 * @example
 * ```typescript
 * const tree = getDistrictTree("3204101");
 * if (tree) {
 *   console.log(tree.district.name); // "NAGREG"
 *   console.log(tree.villages.length); // jumlah desa di Nagreg
 *   for (const desa of tree.villages) {
 *     console.log(`${desa.name} — ${desa.postal_code}`);
 *   }
 * }
 * ```
 */
export function getDistrictTree(bpsDistrictCode: string): DistrictNode | undefined {
	const district = findDistrict(bpsDistrictCode);
	if (!district) return undefined;

	return {
		district,
		villages: villages.filter((v) => v.bps_district_code === bpsDistrictCode),
	};
}
