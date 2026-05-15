export type { District, Province, Regency, SearchResult, Village } from "./types";

export { getProvinceById, getProvinces } from "./provinces";
export {
	getRegencies,
	getRegenciesByProvinceId,
	getRegencyById,
} from "./regencies";
export {
	getDistrictById,
	getDistricts,
	getDistrictsByRegencyId,
} from "./districts";
export {
	getVillageById,
	getVillages,
	getVillagesByDistrictId,
} from "./villages";
export { searchByName } from "./search";
