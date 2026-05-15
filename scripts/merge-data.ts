#!/usr/bin/env npx tsx
/**
 * Merge BPS data with bridging and kodepos to produce enriched JSON.
 *
 * Reads:
 *   data/provinces.json, regencies.json, districts.json, villages.json (v0.1 format)
 *   scripts/bridging_provinsi.json, bridging_kabupaten.json, bridging_kecamatan.json, bridging_desa.json
 *   scripts/kodepos_map.json
 *
 * Writes:
 *   data/provinces.json, regencies.json, districts.json, villages.json (v1.0 format)
 *
 * Usage: npx tsx scripts/merge-data.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = dirname(__dirname);
const DATA_DIR = join(PROJECT_DIR, "data");
const SCRIPT_DIR = __dirname;

interface OldProvince {
	id: string;
	name: string;
}
interface OldRegency {
	province_id: string;
	id: string;
	name: string;
}
interface OldDistrict {
	regency_id: string;
	id: string;
	name: string;
}
interface OldVillage {
	district_id: string;
	id: string;
	name: string;
}

interface BridgingRecord {
	kode_bps: string;
	kode_dagri: string;
	nama_bps: string;
}

interface NewProvince {
	bps_code: string;
	kemendagri_code: string | null;
	name: string;
}
interface NewRegency {
	bps_code: string;
	kemendagri_code: string | null;
	bps_province_code: string;
	kemendagri_province_code: string | null;
	name: string;
}
interface NewDistrict {
	bps_code: string;
	kemendagri_code: string | null;
	bps_regency_code: string;
	kemendagri_regency_code: string | null;
	name: string;
}
interface NewVillage {
	bps_code: string;
	kemendagri_code: string | null;
	bps_district_code: string;
	kemendagri_district_code: string | null;
	name: string;
	postal_code: string | null;
}

function loadJson<T>(path: string): T {
	return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function saveJson(path: string, data: unknown[]): void {
	writeFileSync(path, JSON.stringify(data));
	console.log(`Saved ${data.length} records to ${path}`);
}

function buildBridgingMap(
	bridging: BridgingRecord[],
): Map<string, string> {
	return new Map(bridging.map((item) => [item.kode_bps, item.kode_dagri]));
}

function mergeProvinces(
	provinces: OldProvince[],
	bridgingMap: Map<string, string>,
): NewProvince[] {
	return provinces.map((p) => {
		const dagri = bridgingMap.get(p.id);
		return {
			bps_code: p.id,
			kemendagri_code: dagri || null,
			name: p.name,
		};
	});
}

function mergeRegencies(
	regencies: OldRegency[],
	bridgingMap: Map<string, string>,
	provBridgingMap: Map<string, string>,
): NewRegency[] {
	return regencies.map((r) => {
		const dagri = bridgingMap.get(r.id);
		const dagriProv = provBridgingMap.get(r.province_id);
		return {
			bps_code: r.id,
			kemendagri_code: dagri || null,
			bps_province_code: r.province_id,
			kemendagri_province_code: dagriProv || null,
			name: r.name,
		};
	});
}

function mergeDistricts(
	districts: OldDistrict[],
	bridgingMap: Map<string, string>,
	regBridgingMap: Map<string, string>,
): NewDistrict[] {
	return districts.map((d) => {
		const dagri = bridgingMap.get(d.id);
		const dagriReg = regBridgingMap.get(d.regency_id);
		return {
			bps_code: d.id,
			kemendagri_code: dagri || null,
			bps_regency_code: d.regency_id,
			kemendagri_regency_code: dagriReg || null,
			name: d.name,
		};
	});
}

function mergeVillages(
	villages: OldVillage[],
	bridgingMap: Map<string, string>,
	distBridgingMap: Map<string, string>,
	kodeposMap: Record<string, string>,
): NewVillage[] {
	return villages.map((v) => {
		const dagri = bridgingMap.get(v.id);
		const dagriDist = distBridgingMap.get(v.district_id);
		const postal = dagri ? kodeposMap[dagri] : undefined;
		return {
			bps_code: v.id,
			kemendagri_code: dagri || null,
			bps_district_code: v.district_id,
			kemendagri_district_code: dagriDist || null,
			name: v.name,
			postal_code: postal || null,
		};
	});
}

function validate(
	provinces: NewProvince[],
	regencies: NewRegency[],
	districts: NewDistrict[],
	villages: NewVillage[],
): void {
	const errors: string[] = [];

	// Unique BPS codes
	for (const [levelName, data] of [
		["provinces", provinces],
		["regencies", regencies],
		["districts", districts],
		["villages", villages],
	] as const) {
		const codes = (data as Array<{ bps_code: string }>).map(
			(item) => item.bps_code,
		);
		if (codes.length !== new Set(codes).size) {
			errors.push(`Duplicate BPS codes in ${levelName}`);
		}
	}

	// Unique non-null Kemendagri codes
	for (const [levelName, data] of [
		["provinces", provinces],
		["regencies", regencies],
		["districts", districts],
		["villages", villages],
	] as const) {
		const codes = (data as Array<{ kemendagri_code: string | null }>)
			.map((item) => item.kemendagri_code)
			.filter((c): c is string => c !== null);
		if (codes.length !== new Set(codes).size) {
			errors.push(`Duplicate Kemendagri codes in ${levelName}`);
		}
	}

	// Referential integrity
	const provBps = new Set(provinces.map((p) => p.bps_code));
	for (const r of regencies) {
		if (!provBps.has(r.bps_province_code)) {
			errors.push(
				`Regency ${r.bps_code} references invalid province ${r.bps_province_code}`,
			);
		}
	}

	const regBps = new Set(regencies.map((r) => r.bps_code));
	for (const d of districts) {
		if (!regBps.has(d.bps_regency_code)) {
			errors.push(
				`District ${d.bps_code} references invalid regency ${d.bps_regency_code}`,
			);
		}
	}

	const distBps = new Set(districts.map((d) => d.bps_code));
	for (const v of villages) {
		if (!distBps.has(v.bps_district_code)) {
			errors.push(
				`Village ${v.bps_code} references invalid district ${v.bps_district_code}`,
			);
		}
	}

	// No empty strings
	for (const [levelName, data] of [
		["provinces", provinces],
		["regencies", regencies],
		["districts", districts],
		["villages", villages],
	] as const) {
		for (const item of data as Array<Record<string, unknown>>) {
			for (const [key, val] of Object.entries(item)) {
				if (val === "") {
					errors.push(
						`Empty string in ${levelName} ${(item as { bps_code?: string }).bps_code ?? "?"}.${key}`,
					);
				}
			}
		}
	}

	// Coverage stats
	const vWithDagri = villages.filter(
		(v) => v.kemendagri_code !== null,
	).length;
	const vWithPostal = villages.filter((v) => v.postal_code !== null).length;
	console.log("\n=== Coverage ===");
	console.log(`Villages total:          ${villages.length}`);
	console.log(
		`Villages with kemendagri: ${vWithDagri} (${((100 * vWithDagri) / villages.length).toFixed(1)}%)`,
	);
	console.log(
		`Villages with postal:     ${vWithPostal} (${((100 * vWithPostal) / villages.length).toFixed(1)}%)`,
	);
	console.log(`Villages null kemendagri: ${villages.length - vWithDagri}`);

	if (errors.length > 0) {
		console.error(`\n=== VALIDATION ERRORS (${errors.length}) ===`);
		for (const e of errors) {
			console.error(`  ✗ ${e}`);
		}
		process.exit(1);
	} else {
		console.log("\n=== All validation checks passed ===");
	}
}

function main(): void {
	const provinces = loadJson<OldProvince[]>(join(DATA_DIR, "provinces.json"));
	const regencies = loadJson<OldRegency[]>(join(DATA_DIR, "regencies.json"));
	const districts = loadJson<OldDistrict[]>(join(DATA_DIR, "districts.json"));
	const villages = loadJson<OldVillage[]>(join(DATA_DIR, "villages.json"));

	const provBridging = buildBridgingMap(
		loadJson<BridgingRecord[]>(join(SCRIPT_DIR, "bridging_provinsi.json")),
	);
	const regBridging = buildBridgingMap(
		loadJson<BridgingRecord[]>(join(SCRIPT_DIR, "bridging_kabupaten.json")),
	);
	const distBridging = buildBridgingMap(
		loadJson<BridgingRecord[]>(join(SCRIPT_DIR, "bridging_kecamatan.json")),
	);
	const desaBridging = buildBridgingMap(
		loadJson<BridgingRecord[]>(join(SCRIPT_DIR, "bridging_desa.json")),
	);

	const kodeposMap = loadJson<Record<string, string>>(
		join(SCRIPT_DIR, "kodepos_map.json"),
	);

	const newProvinces = mergeProvinces(provinces, provBridging);
	const newRegencies = mergeRegencies(regencies, regBridging, provBridging);
	const newDistricts = mergeDistricts(districts, distBridging, regBridging);
	const newVillages = mergeVillages(
		villages,
		desaBridging,
		distBridging,
		kodeposMap,
	);

	validate(newProvinces, newRegencies, newDistricts, newVillages);

	saveJson(join(DATA_DIR, "provinces.json"), newProvinces);
	saveJson(join(DATA_DIR, "regencies.json"), newRegencies);
	saveJson(join(DATA_DIR, "districts.json"), newDistricts);
	saveJson(join(DATA_DIR, "villages.json"), newVillages);
}

main();
