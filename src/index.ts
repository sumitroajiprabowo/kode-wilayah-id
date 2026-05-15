/**
 * Titik masuk utama (barrel file) untuk paket `kode-wilayah-id`.
 *
 * Modul ini mengekspor ulang seluruh fungsi dan tipe dari sub-modul,
 * sehingga konsumer cukup mengimpor dari satu entry point:
 *
 * ```typescript
 * import { getProvinces, searchByName } from "kode-wilayah-id";
 * ```
 *
 * Untuk tree-shaking yang lebih optimal, impor langsung dari sub-modul:
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
