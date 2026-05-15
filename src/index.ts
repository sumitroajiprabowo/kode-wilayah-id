/**
 * Entry point utama paket `kode-wilayah-id`.
 *
 * Semua fungsi dan tipe di-re-export dari sini, jadi cukup import dari satu tempat:
 *
 * ```typescript
 * import { getProvinces, searchByName, getVillageWithParents } from "kode-wilayah-id";
 * ```
 *
 * Kalau mau tree-shaking yang lebih optimal (misalnya cuma butuh data provinsi
 * dan tidak mau bundle data desa 84rb item), bisa import langsung dari sub-modul:
 *
 * ```typescript
 * import { getProvinces } from "kode-wilayah-id/provinces";
 * import { getVillageWithParents } from "kode-wilayah-id/hierarchy";
 * import { getSummary } from "kode-wilayah-id/stats";
 * ```
 *
 * @module index
 */

export {
	getDistrictByBpsCode,
	getDistrictByKemendagriCode,
	getDistricts,
	getDistrictsByBpsRegencyCode,
	getDistrictsByKemendagriRegencyCode,
} from "./districts";

export {
	getDistrictTree,
	getDistrictWithParents,
	getProvinceTree,
	getRegencyTree,
	getRegencyWithParent,
	getVillageWithParents,
} from "./hierarchy";

export {
	getProvinceByBpsCode,
	getProvinceByKemendagriCode,
	getProvinces,
} from "./provinces";

export {
	getRegencies,
	getRegenciesByBpsProvinceCode,
	getRegenciesByKemendagriProvinceCode,
	getRegencyByBpsCode,
	getRegencyByKemendagriCode,
} from "./regencies";

export { searchByName } from "./search";

export {
	getDistrictCountByProvince,
	getDistrictCountByRegency,
	getRegencyCountByProvince,
	getSummary,
	getVillageCountByDistrict,
	getVillageCountByProvince,
	getVillageCountByRegency,
} from "./stats";

export type {
	District,
	DistrictHierarchy,
	DistrictNode,
	Province,
	ProvinceTree,
	Regency,
	RegencyHierarchy,
	RegencyNode,
	SearchOptions,
	SearchResult,
	Village,
	VillageHierarchy,
} from "./types";

export {
	getVillageByBpsCode,
	getVillageByKemendagriCode,
	getVillages,
	getVillagesByBpsDistrictCode,
	getVillagesByKemendagriDistrictCode,
	getVillagesByPostalCode,
} from "./villages";
