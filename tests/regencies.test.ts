import { describe, expect, it } from "vitest";
import { getRegencies, getRegenciesByProvinceId, getRegencyById } from "../src/regencies";

describe("getRegencies", () => {
	it("returns 514 regencies", () => {
		expect(getRegencies()).toHaveLength(514);
	});

	it("returns a new array copy each call", () => {
		const a = getRegencies();
		const b = getRegencies();
		expect(a).not.toBe(b);
		expect(a).toEqual(b);
	});
});

describe("getRegenciesByProvinceId", () => {
	it('returns 27 regencies for province "32" (Jawa Barat)', () => {
		expect(getRegenciesByProvinceId("32")).toHaveLength(27);
	});

	it('returns empty array for non-existent province "99"', () => {
		expect(getRegenciesByProvinceId("99")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(getRegenciesByProvinceId("")).toEqual([]);
	});
});

describe("getRegencyById", () => {
	it('finds KAB. BANDUNG by id "3204"', () => {
		const r = getRegencyById("3204");
		expect(r).toBeDefined();
		expect(r?.name).toBe("KAB. BANDUNG");
		expect(r?.province_id).toBe("32");
	});

	it('returns undefined for non-existent id "9999"', () => {
		expect(getRegencyById("9999")).toBeUndefined();
	});
});
