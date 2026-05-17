/**
 * Fungsi hierarki wilayah — reverse lookup dan drill-down tree.
 *
 * Modul ini paling berguna untuk:
 * - **Form alamat**: user pilih desa → otomatis keisi kecamatan, kabupaten, provinsi
 * - **Detail wilayah**: dari satu kode, dapat info lengkap sampai ke atas
 * - **Drill-down**: dari provinsi, dapat tree lengkap sampai desa
 *
 * Secara internal, modul ini pakai lazy-initialized `Map` untuk lookup O(1).
 * Semua index dibuat sekali saat pertama kali dibutuhkan, lalu di-cache.
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

// ---------------------------------------------------------------------------
// Lazy-initialized index Maps — dibuat sekali saat pertama kali dipanggil
// ---------------------------------------------------------------------------

/** Index kode BPS provinsi → Province (1-to-1) */
let provinceByBps: Map<string, Province> | null = null;
function getProvinceByBps(): Map<string, Province> {
	if (!provinceByBps) {
		provinceByBps = new Map(provinces.map((p) => [p.bps_code, p]));
	}
	return provinceByBps;
}

/** Index kode BPS kabupaten → Regency (1-to-1) */
let regencyByBps: Map<string, Regency> | null = null;
function getRegencyByBps(): Map<string, Regency> {
	if (!regencyByBps) {
		regencyByBps = new Map(regencies.map((r) => [r.bps_code, r]));
	}
	return regencyByBps;
}

/** Index kode BPS kecamatan → District (1-to-1) */
let districtByBps: Map<string, District> | null = null;
function getDistrictByBps(): Map<string, District> {
	if (!districtByBps) {
		districtByBps = new Map(districts.map((d) => [d.bps_code, d]));
	}
	return districtByBps;
}

/** Index kode BPS desa → Village (1-to-1) */
let villageByBps: Map<string, Village> | null = null;
function getVillageByBps(): Map<string, Village> {
	if (!villageByBps) {
		villageByBps = new Map(villages.map((v) => [v.bps_code, v]));
	}
	return villageByBps;
}

/** Index kode BPS provinsi → Regency[] (1-to-many) */
let regenciesByProvince: Map<string, Regency[]> | null = null;
function getRegenciesByProvince(): Map<string, Regency[]> {
	/* v8 ignore next -- lazy init: branch "already cached" tercakup secara implisit */
	if (!regenciesByProvince) {
		regenciesByProvince = new Map();
		for (const r of regencies) {
			const arr = regenciesByProvince.get(r.bps_province_code);
			if (arr) {
				arr.push(r);
			} else {
				regenciesByProvince.set(r.bps_province_code, [r]);
			}
		}
	}
	return regenciesByProvince;
}

/** Index kode BPS kabupaten → District[] (1-to-many) */
let districtsByRegency: Map<string, District[]> | null = null;
function getDistrictsByRegency(): Map<string, District[]> {
	if (!districtsByRegency) {
		districtsByRegency = new Map();
		for (const d of districts) {
			const arr = districtsByRegency.get(d.bps_regency_code);
			if (arr) {
				arr.push(d);
			} else {
				districtsByRegency.set(d.bps_regency_code, [d]);
			}
		}
	}
	return districtsByRegency;
}

/** Index kode BPS kecamatan → Village[] (1-to-many) */
let villagesByDistrict: Map<string, Village[]> | null = null;
function getVillagesByDistrict(): Map<string, Village[]> {
	if (!villagesByDistrict) {
		villagesByDistrict = new Map();
		for (const v of villages) {
			const arr = villagesByDistrict.get(v.bps_district_code);
			if (arr) {
				arr.push(v);
			} else {
				villagesByDistrict.set(v.bps_district_code, [v]);
			}
		}
	}
	return villagesByDistrict;
}

// ---------------------------------------------------------------------------
// Public API — Reverse Lookup
// ---------------------------------------------------------------------------

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
	const village = getVillageByBps().get(bpsCode);
	if (!village) return undefined;

	const district = getDistrictByBps().get(village.bps_district_code);
	/* v8 ignore next -- data integrity dijamin oleh integration test */
	const regency = district ? getRegencyByBps().get(district.bps_regency_code) : undefined;
	/* v8 ignore next -- data integrity dijamin oleh integration test */
	const province = regency ? getProvinceByBps().get(regency.bps_province_code) : undefined;

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
	const district = getDistrictByBps().get(bpsCode);
	if (!district) return undefined;

	const regency = getRegencyByBps().get(district.bps_regency_code);
	/* v8 ignore next -- ternary false branch: data integrity dijamin oleh integration test */
	const province = regency ? getProvinceByBps().get(regency.bps_province_code) : undefined;

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
	const regency = getRegencyByBps().get(bpsCode);
	if (!regency) return undefined;

	const province = getProvinceByBps().get(regency.bps_province_code);
	/* v8 ignore next 2 -- data integrity dijamin oleh integration test */
	if (!province) return undefined;

	return { province, regency };
}

// ---------------------------------------------------------------------------
// Public API — Drill-down Tree
// ---------------------------------------------------------------------------

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
	const province = getProvinceByBps().get(bpsProvinceCode);
	if (!province) return undefined;

	/* v8 ignore next -- valid province selalu punya regencies di data */
	const provRegencies = getRegenciesByProvince().get(bpsProvinceCode) ?? [];
	const villDistrictIdx = getVillagesByDistrict();
	const distRegencyIdx = getDistrictsByRegency();

	const regencyNodes: RegencyNode[] = provRegencies.map((regency) => {
		/* v8 ignore next -- valid regency selalu punya districts di data */
		const regDistricts = distRegencyIdx.get(regency.bps_code) ?? [];

		const districtNodes: DistrictNode[] = regDistricts.map((district) => ({
			district,
			/* v8 ignore next -- valid district selalu punya villages di data */
			villages: [...(villDistrictIdx.get(district.bps_code) ?? [])],
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
	const regency = getRegencyByBps().get(bpsRegencyCode);
	if (!regency) return undefined;

	/* v8 ignore next -- valid regency selalu punya districts di data */
	const regDistricts = getDistrictsByRegency().get(bpsRegencyCode) ?? [];
	const villDistrictIdx = getVillagesByDistrict();

	const districtNodes: DistrictNode[] = regDistricts.map((district) => ({
		district,
		/* v8 ignore next -- valid district selalu punya villages di data */
		villages: [...(villDistrictIdx.get(district.bps_code) ?? [])],
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
	const district = getDistrictByBps().get(bpsDistrictCode);
	if (!district) return undefined;

	return {
		district,
		/* v8 ignore next -- valid district selalu punya villages di data */
		villages: [...(getVillagesByDistrict().get(bpsDistrictCode) ?? [])],
	};
}
