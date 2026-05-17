/**
 * Benchmark perbandingan Map lookup vs Array.find() linear scan.
 *
 * Membuktikan bahwa Map-based indexing yang dipakai di semua modul
 * jauh lebih cepat dari pendekatan linear scan (Array.find / Array.filter).
 *
 * Jalankan benchmark:
 * ```bash
 * npx vitest bench
 * ```
 */

import { bench, describe } from "vitest";
import { getDistrictByBpsCode, getDistricts, getDistrictsByBpsRegencyCode } from "../src/districts";
import { getProvinceByBpsCode, getProvinces } from "../src/provinces";
import { getRegencies, getRegenciesByBpsProvinceCode, getRegencyByBpsCode } from "../src/regencies";
import { getVillageByBpsCode, getVillages, getVillagesByBpsDistrictCode } from "../src/villages";

// ---------------------------------------------------------------------------
// Preload data supaya benchmark tidak terpengaruh cold-start JSON parsing.
// Kita akses semua getter satu kali dulu sebelum benchmark dimulai.
// ---------------------------------------------------------------------------
const allVillages = getVillages();
const allDistricts = getDistricts();
const allRegencies = getRegencies();
const allProvinces = getProvinces();

// Pilih kode yang ada di tengah-tengah dataset (worst case buat linear scan)
const midVillage = allVillages[Math.floor(allVillages.length / 2)];
const midDistrict = allDistricts[Math.floor(allDistricts.length / 2)];
const midRegency = allRegencies[Math.floor(allRegencies.length / 2)];
const midProvince = allProvinces[Math.floor(allProvinces.length / 2)];

describe("Single lookup: Map.get() vs Array.find()", () => {
	bench("Village Map.get() — 84.270 items", () => {
		getVillageByBpsCode(midVillage.bps_code);
	});

	bench("Village Array.find() — 84.270 items (baseline)", () => {
		allVillages.find((v) => v.bps_code === midVillage.bps_code);
	});

	bench("District Map.get() — 7.286 items", () => {
		getDistrictByBpsCode(midDistrict.bps_code);
	});

	bench("District Array.find() — 7.286 items (baseline)", () => {
		allDistricts.find((d) => d.bps_code === midDistrict.bps_code);
	});

	bench("Regency Map.get() — 514 items", () => {
		getRegencyByBpsCode(midRegency.bps_code);
	});

	bench("Regency Array.find() — 514 items (baseline)", () => {
		allRegencies.find((r) => r.bps_code === midRegency.bps_code);
	});

	bench("Province Map.get() — 38 items", () => {
		getProvinceByBpsCode(midProvince.bps_code);
	});

	bench("Province Array.find() — 38 items (baseline)", () => {
		allProvinces.find((p) => p.bps_code === midProvince.bps_code);
	});
});

describe("Grouped lookup: Map.get() vs Array.filter()", () => {
	bench("Villages by district Map.get()", () => {
		getVillagesByBpsDistrictCode(midVillage.bps_district_code);
	});

	bench("Villages by district Array.filter() (baseline)", () => {
		allVillages.filter((v) => v.bps_district_code === midVillage.bps_district_code);
	});

	bench("Districts by regency Map.get()", () => {
		getDistrictsByBpsRegencyCode(midDistrict.bps_regency_code);
	});

	bench("Districts by regency Array.filter() (baseline)", () => {
		allDistricts.filter((d) => d.bps_regency_code === midDistrict.bps_regency_code);
	});

	bench("Regencies by province Map.get()", () => {
		getRegenciesByBpsProvinceCode(midRegency.bps_province_code);
	});

	bench("Regencies by province Array.filter() (baseline)", () => {
		allRegencies.filter((r) => r.bps_province_code === midRegency.bps_province_code);
	});
});
