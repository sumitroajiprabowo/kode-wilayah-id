import { describe, expect, it } from "vitest";
import {
	getDistrictTree,
	getDistrictWithParents,
	getProvinceTree,
	getRegencyTree,
	getRegencyWithParent,
	getVillageWithParents,
} from "../src/hierarchy";

describe("getVillageWithParents", () => {
	it("returns full hierarchy for valid village code", () => {
		const result = getVillageWithParents("3204101005");
		expect(result).toBeDefined();
		expect(result?.village.bps_code).toBe("3204101005");
		expect(result?.village.name).toBe("NAGREG");
		expect(result?.district.bps_code).toBe("3204101");
		expect(result?.regency.bps_code).toBe("3204");
		expect(result?.regency.name).toBe("KAB. BANDUNG");
		expect(result?.province.bps_code).toBe("32");
		expect(result?.province.name).toBe("JAWA BARAT");
	});

	it("returns undefined for invalid village code", () => {
		expect(getVillageWithParents("9999999999")).toBeUndefined();
	});

	it("includes postal_code in village", () => {
		const result = getVillageWithParents("3204101005");
		expect(result?.village.postal_code).toBeDefined();
	});
});

describe("getDistrictWithParents", () => {
	it("returns district + regency + province for valid code", () => {
		const result = getDistrictWithParents("3204101");
		expect(result).toBeDefined();
		expect(result?.district.name).toBe("NAGREG");
		expect(result?.regency.name).toBe("KAB. BANDUNG");
		expect(result?.province.name).toBe("JAWA BARAT");
	});

	it("returns undefined for invalid code", () => {
		expect(getDistrictWithParents("9999999")).toBeUndefined();
	});
});

describe("getRegencyWithParent", () => {
	it("returns regency + province for valid code", () => {
		const result = getRegencyWithParent("3204");
		expect(result).toBeDefined();
		expect(result?.regency.name).toBe("KAB. BANDUNG");
		expect(result?.province.name).toBe("JAWA BARAT");
	});

	it("returns undefined for invalid code", () => {
		expect(getRegencyWithParent("9999")).toBeUndefined();
	});
});

describe("getProvinceTree", () => {
	it("returns full tree for valid province", () => {
		// Pakai provinsi kecil supaya test cepat
		const tree = getProvinceTree("31"); // DKI Jakarta
		expect(tree).toBeDefined();
		expect(tree?.province.name).toBe("DKI JAKARTA");
		expect(tree?.regencies.length).toBeGreaterThan(0);

		// Setiap kabupaten harus punya kecamatan
		for (const regNode of tree?.regencies ?? []) {
			expect(regNode.regency.bps_code).toBeDefined();
			expect(regNode.districts.length).toBeGreaterThan(0);

			// Setiap kecamatan harus punya desa
			for (const distNode of regNode.districts) {
				expect(distNode.district.bps_code).toBeDefined();
				expect(distNode.villages.length).toBeGreaterThan(0);
			}
		}
	});

	it("returns undefined for invalid province code", () => {
		expect(getProvinceTree("99")).toBeUndefined();
	});
});

describe("getRegencyTree", () => {
	it("returns regency tree with districts and villages", () => {
		const tree = getRegencyTree("3171"); // Kota Jakarta Selatan
		expect(tree).toBeDefined();
		expect(tree?.regency.name).toContain("JAKARTA");
		expect(tree?.districts.length).toBeGreaterThan(0);

		for (const distNode of tree?.districts ?? []) {
			expect(distNode.villages.length).toBeGreaterThan(0);
		}
	});

	it("returns undefined for invalid code", () => {
		expect(getRegencyTree("9999")).toBeUndefined();
	});
});

describe("getDistrictTree", () => {
	it("returns district with its villages", () => {
		const tree = getDistrictTree("3204101"); // Nagreg
		expect(tree).toBeDefined();
		expect(tree?.district.name).toBe("NAGREG");
		expect(tree?.villages.length).toBeGreaterThan(0);
		expect(tree?.villages[0].bps_district_code).toBe("3204101");
	});

	it("returns undefined for invalid code", () => {
		expect(getDistrictTree("9999999")).toBeUndefined();
	});
});
