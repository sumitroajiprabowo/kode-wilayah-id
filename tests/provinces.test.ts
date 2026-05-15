import { describe, expect, it } from "vitest";
import { getProvinceById, getProvinces } from "../src/provinces";

describe("getProvinces", () => {
	it("returns 38 provinces", () => {
		expect(getProvinces()).toHaveLength(38);
	});

	it("returns Province[] with correct shape", () => {
		const provinces = getProvinces();
		for (const p of provinces) {
			expect(p).toHaveProperty("id");
			expect(p).toHaveProperty("name");
			expect(typeof p.id).toBe("string");
			expect(typeof p.name).toBe("string");
		}
	});

	it("returns a new array copy each call", () => {
		const a = getProvinces();
		const b = getProvinces();
		expect(a).not.toBe(b);
		expect(a).toEqual(b);
	});
});

describe("getProvinceById", () => {
	it('finds JAWA BARAT by id "32"', () => {
		const p = getProvinceById("32");
		expect(p).toBeDefined();
		expect(p?.name).toBe("JAWA BARAT");
	});

	it('finds ACEH by id "11"', () => {
		const p = getProvinceById("11");
		expect(p).toBeDefined();
		expect(p?.name).toBe("ACEH");
	});

	it('returns undefined for non-existent id "99"', () => {
		expect(getProvinceById("99")).toBeUndefined();
	});

	it("returns undefined for empty string", () => {
		expect(getProvinceById("")).toBeUndefined();
	});
});
