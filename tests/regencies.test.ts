import { describe, expect, it } from "vitest";
import {
	getRegencies,
	getRegenciesByBpsProvinceCode,
	getRegenciesByKemendagriProvinceCode,
	getRegencyByBpsCode,
	getRegencyByKemendagriCode,
} from "../src/regencies";

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

describe("getRegenciesByBpsProvinceCode", () => {
	it('returns 27 regencies for BPS province "32" (Jawa Barat)', () => {
		expect(getRegenciesByBpsProvinceCode("32")).toHaveLength(27);
	});

	it('returns empty array for non-existent province "99"', () => {
		expect(getRegenciesByBpsProvinceCode("99")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(getRegenciesByBpsProvinceCode("")).toEqual([]);
	});
});

describe("getRegenciesByKemendagriProvinceCode", () => {
	it("returns regencies for a known Kemendagri province code", () => {
		const result = getRegenciesByKemendagriProvinceCode("32");
		expect(result.length).toBeGreaterThan(0);
		for (const r of result) {
			expect(r.kemendagri_province_code).toBe("32");
		}
	});

	it('returns empty array for non-existent code "99"', () => {
		expect(getRegenciesByKemendagriProvinceCode("99")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(getRegenciesByKemendagriProvinceCode("")).toEqual([]);
	});
});

describe("getRegencyByBpsCode", () => {
	it('finds KAB. BANDUNG by BPS code "3204"', () => {
		const r = getRegencyByBpsCode("3204");
		expect(r).toBeDefined();
		expect(r?.name).toBe("KAB. BANDUNG");
		expect(r?.bps_province_code).toBe("32");
	});

	it("regency has kemendagri_code", () => {
		const r = getRegencyByBpsCode("3204");
		expect(r?.kemendagri_code).not.toBeNull();
	});

	it('returns undefined for non-existent code "9999"', () => {
		expect(getRegencyByBpsCode("9999")).toBeUndefined();
	});
});

describe("getRegencyByKemendagriCode", () => {
	it("finds a regency by Kemendagri code", () => {
		const r = getRegencyByBpsCode("1101");
		expect(r).toBeDefined();
		if (r?.kemendagri_code) {
			const found = getRegencyByKemendagriCode(r.kemendagri_code);
			expect(found).toBeDefined();
			expect(found?.bps_code).toBe("1101");
		}
	});

	it('returns undefined for non-existent code "9999"', () => {
		expect(getRegencyByKemendagriCode("9999")).toBeUndefined();
	});

	it("returns undefined for empty string", () => {
		expect(getRegencyByKemendagriCode("")).toBeUndefined();
	});
});
