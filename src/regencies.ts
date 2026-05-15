import type { Regency } from "./types";
import regenciesData from "../data/regencies.json";

const regencies: Regency[] = regenciesData as Regency[];

export function getRegencies(): Regency[] {
	return [...regencies];
}

export function getRegenciesByProvinceId(provinceId: string): Regency[] {
	return regencies.filter((r) => r.province_id === provinceId);
}

export function getRegencyById(id: string): Regency | undefined {
	return regencies.find((r) => r.id === id);
}
