import type { SearchResult } from "./types";
import type { District, Province, Regency, Village } from "./types";
import provincesData from "../data/provinces.json";
import regenciesData from "../data/regencies.json";
import districtsData from "../data/districts.json";
import villagesData from "../data/villages.json";

const provinces: Province[] = provincesData as Province[];
const regencies: Regency[] = regenciesData as Regency[];
const districts: District[] = districtsData as District[];
const villages: Village[] = villagesData as Village[];

export function searchByName(query: string): SearchResult[] {
	const trimmed = query.trim();
	if (trimmed === "") {
		return [];
	}

	const upperQuery = trimmed.toUpperCase();
	const results: SearchResult[] = [];

	for (const p of provinces) {
		if (p.name.toUpperCase().includes(upperQuery)) {
			results.push({ level: "province", data: p });
		}
	}

	for (const r of regencies) {
		if (r.name.toUpperCase().includes(upperQuery)) {
			results.push({ level: "regency", data: r });
		}
	}

	for (const d of districts) {
		if (d.name.toUpperCase().includes(upperQuery)) {
			results.push({ level: "district", data: d });
		}
	}

	for (const v of villages) {
		if (v.name.toUpperCase().includes(upperQuery)) {
			results.push({ level: "village", data: v });
		}
	}

	return results;
}
