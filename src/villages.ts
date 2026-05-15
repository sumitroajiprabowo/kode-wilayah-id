import villagesData from "../data/villages.json";
import type { Village } from "./types";

const villages: Village[] = villagesData as Village[];

export function getVillages(): Village[] {
	return [...villages];
}

export function getVillagesByDistrictId(districtId: string): Village[] {
	return villages.filter((v) => v.district_id === districtId);
}

export function getVillageById(id: string): Village | undefined {
	return villages.find((v) => v.id === id);
}
