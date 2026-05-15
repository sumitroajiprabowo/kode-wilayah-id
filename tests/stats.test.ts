import { describe, expect, it } from "vitest";
import {
	getDistrictCountByProvince,
	getDistrictCountByRegency,
	getRegencyCountByProvince,
	getSummary,
	getVillageCountByDistrict,
	getVillageCountByProvince,
	getVillageCountByRegency,
} from "../src/stats";

describe("getRegencyCountByProvince", () => {
	it("returns correct count for Jawa Barat", () => {
		expect(getRegencyCountByProvince("32")).toBe(27);
	});

	it("returns 0 for invalid code", () => {
		expect(getRegencyCountByProvince("99")).toBe(0);
	});
});

describe("getDistrictCountByRegency", () => {
	it("returns positive count for Kab. Bandung", () => {
		expect(getDistrictCountByRegency("3204")).toBeGreaterThan(0);
	});

	it("returns 0 for invalid code", () => {
		expect(getDistrictCountByRegency("9999")).toBe(0);
	});
});

describe("getVillageCountByDistrict", () => {
	it("returns positive count for Nagreg", () => {
		expect(getVillageCountByDistrict("3204050")).toBeGreaterThan(0);
	});

	it("returns 0 for invalid code", () => {
		expect(getVillageCountByDistrict("9999999")).toBe(0);
	});
});

describe("getDistrictCountByProvince", () => {
	it("returns positive count for DKI Jakarta", () => {
		expect(getDistrictCountByProvince("31")).toBeGreaterThan(0);
	});

	it("returns 0 for invalid code", () => {
		expect(getDistrictCountByProvince("99")).toBe(0);
	});
});

describe("getVillageCountByRegency", () => {
	it("returns positive count for Kab. Bandung", () => {
		expect(getVillageCountByRegency("3204")).toBeGreaterThan(0);
	});

	it("returns 0 for invalid code", () => {
		expect(getVillageCountByRegency("9999")).toBe(0);
	});
});

describe("getVillageCountByProvince", () => {
	it("returns positive count for DKI Jakarta", () => {
		expect(getVillageCountByProvince("31")).toBeGreaterThan(0);
	});

	it("returns 0 for invalid code", () => {
		expect(getVillageCountByProvince("99")).toBe(0);
	});
});

describe("getSummary", () => {
	it("returns correct totals", () => {
		const s = getSummary();
		expect(s.provinces).toBe(38);
		expect(s.regencies).toBe(514);
		expect(s.districts).toBe(7286);
		expect(s.villages).toBe(84270);
	});
});
