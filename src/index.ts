/**
 * Re-export semua fungsi dan tipe.
 *
 * Bisa juga import langsung dari sub-modul untuk tree-shaking yang lebih baik,
 * misal: `import { getProvinces } from "kode-wilayah-id/provinces"`
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
