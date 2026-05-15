import type { Province } from "./types";
import provincesData from "../data/provinces.json";

const provinces: Province[] = provincesData as Province[];

export function getProvinces(): Province[] {
	return [...provinces];
}

export function getProvinceById(id: string): Province | undefined {
	return provinces.find((p) => p.id === id);
}
