import { describe, expect, it } from "vitest";
import {
	getDistrictById,
	getDistricts,
	getDistrictsByRegencyId,
} from "../src/districts";

describe("getDistricts", () => {
	it("returns 7286 districts", () => {
		expect(getDistricts()).toHaveLength(7286);
	});

	it("returns a new array copy each call", () => {
		const a = getDistricts();
		const b = getDistricts();
		expect(a).not.toBe(b);
		expect(a).toEqual(b);
	});
});

describe("getDistrictsByRegencyId", () => {
	it('returns 10 districts for regency "1101"', () => {
		expect(getDistrictsByRegencyId("1101")).toHaveLength(10);
	});

	it('returns empty array for non-existent regency "9999"', () => {
		expect(getDistrictsByRegencyId("9999")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(getDistrictsByRegencyId("")).toEqual([]);
	});
});

describe("getDistrictById", () => {
	it('finds TEUPAH SELATAN by id "1101010"', () => {
		const d = getDistrictById("1101010");
		expect(d).toBeDefined();
		expect(d?.name).toBe("TEUPAH SELATAN");
		expect(d?.regency_id).toBe("1101");
	});

	it('returns undefined for non-existent id "0000000"', () => {
		expect(getDistrictById("0000000")).toBeUndefined();
	});
});
