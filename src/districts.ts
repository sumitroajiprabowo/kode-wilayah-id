import type { District } from "./types";
import districtsData from "../data/districts.json";

const districts: District[] = districtsData as District[];

export function getDistricts(): District[] {
	return [...districts];
}

export function getDistrictsByRegencyId(regencyId: string): District[] {
	return districts.filter((d) => d.regency_id === regencyId);
}

export function getDistrictById(id: string): District | undefined {
	return districts.find((d) => d.id === id);
}
