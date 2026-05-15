import districtsData from "../data/districts.json";
import type { District } from "./types";

const districts: District[] = districtsData as District[];

export function getDistricts(): District[] {
	return [...districts];
}

export function getDistrictsByBpsRegencyCode(code: string): District[] {
	return districts.filter((d) => d.bps_regency_code === code);
}

export function getDistrictsByKemendagriRegencyCode(code: string): District[] {
	return districts.filter((d) => d.kemendagri_regency_code === code);
}

export function getDistrictByBpsCode(code: string): District | undefined {
	return districts.find((d) => d.bps_code === code);
}

export function getDistrictByKemendagriCode(code: string): District | undefined {
	return districts.find((d) => d.kemendagri_code === code);
}
