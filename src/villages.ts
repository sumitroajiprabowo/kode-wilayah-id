import villagesData from "../data/villages.json";
import type { Village } from "./types";

const villages: Village[] = villagesData as Village[];

export function getVillages(): Village[] {
	return [...villages];
}

export function getVillagesByBpsDistrictCode(code: string): Village[] {
	return villages.filter((v) => v.bps_district_code === code);
}

export function getVillagesByKemendagriDistrictCode(code: string): Village[] {
	return villages.filter((v) => v.kemendagri_district_code === code);
}

export function getVillageByBpsCode(code: string): Village | undefined {
	return villages.find((v) => v.bps_code === code);
}

export function getVillageByKemendagriCode(code: string): Village | undefined {
	return villages.find((v) => v.kemendagri_code === code);
}

export function getVillagesByPostalCode(code: string): Village[] {
	return villages.filter((v) => v.postal_code === code);
}
