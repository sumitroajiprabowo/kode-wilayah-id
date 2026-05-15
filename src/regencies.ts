import regenciesData from "../data/regencies.json";
import type { Regency } from "./types";

const regencies: Regency[] = regenciesData as Regency[];

export function getRegencies(): Regency[] {
	return [...regencies];
}

export function getRegenciesByBpsProvinceCode(code: string): Regency[] {
	return regencies.filter((r) => r.bps_province_code === code);
}

export function getRegenciesByKemendagriProvinceCode(code: string): Regency[] {
	return regencies.filter((r) => r.kemendagri_province_code === code);
}

export function getRegencyByBpsCode(code: string): Regency | undefined {
	return regencies.find((r) => r.bps_code === code);
}

export function getRegencyByKemendagriCode(code: string): Regency | undefined {
	return regencies.find((r) => r.kemendagri_code === code);
}
