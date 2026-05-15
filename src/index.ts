export {
	getDistrictById,
	getDistricts,
	getDistrictsByRegencyId,
} from "./districts";

export { getProvinceById, getProvinces } from "./provinces";
export {
	getRegencies,
	getRegenciesByProvinceId,
	getRegencyById,
} from "./regencies";
export { searchByName } from "./search";
export type { District, Province, Regency, SearchResult, Village } from "./types";
export {
	getVillageById,
	getVillages,
	getVillagesByDistrictId,
} from "./villages";
