/**
 * Entry point utama paket `kode-wilayah-id`.
 *
 * Semua fungsi dan tipe di-re-export dari sini, jadi cukup import dari satu tempat:
 *
 * ```typescript
 * import { getProvinces, searchByName, type Province } from "kode-wilayah-id";
 * ```
 *
 * Kalau mau tree-shaking yang lebih optimal (misalnya cuma butuh data provinsi
 * dan tidak mau bundle data desa 84rb item), bisa import langsung dari sub-modul:
 *
 * ```typescript
 * import { getProvinces } from "kode-wilayah-id/provinces";
 * import { searchByName } from "kode-wilayah-id/search";
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

export type { District, Province, Regency, SearchResult, Village } from "./types";

export {
	getVillageByBpsCode,
	getVillageByKemendagriCode,
	getVillages,
	getVillagesByBpsDistrictCode,
	getVillagesByKemendagriDistrictCode,
	getVillagesByPostalCode,
} from "./villages";
