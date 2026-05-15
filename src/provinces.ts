import provincesData from "../data/provinces.json";
import type { Province } from "./types";

const provinces: Province[] = provincesData as Province[];

export function getProvinces(): Province[] {
	return [...provinces];
}

export function getProvinceByBpsCode(code: string): Province | undefined {
	return provinces.find((p) => p.bps_code === code);
}

export function getProvinceByKemendagriCode(code: string): Province | undefined {
	return provinces.find((p) => p.kemendagri_code === code);
}
