import { describe, expect, it } from "vitest";
import {
	getDistrictByBpsCode,
	getDistrictByKemendagriCode,
	getDistricts,
	getDistrictsByBpsRegencyCode,
	getDistrictsByKemendagriRegencyCode,
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

describe("getDistrictsByBpsRegencyCode", () => {
	it('returns 10 districts for BPS regency "1101"', () => {
		expect(getDistrictsByBpsRegencyCode("1101")).toHaveLength(10);
	});

	it('returns empty array for non-existent regency "9999"', () => {
		expect(getDistrictsByBpsRegencyCode("9999")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(getDistrictsByBpsRegencyCode("")).toEqual([]);
	});

	it("returns a defensive copy — mutasi tidak merusak data internal", () => {
		const a = getDistrictsByBpsRegencyCode("1101");
		const originalLength = a.length;
		a.push({} as never);
		const b = getDistrictsByBpsRegencyCode("1101");
		expect(b).toHaveLength(originalLength);
	});
});

describe("getDistrictsByKemendagriRegencyCode", () => {
	it("returns districts for a known Kemendagri regency code", () => {
		const d = getDistrictByBpsCode("1101010");
		expect(d).toBeDefined();
		if (d?.kemendagri_regency_code) {
			const result = getDistrictsByKemendagriRegencyCode(d.kemendagri_regency_code);
			expect(result.length).toBeGreaterThan(0);
			for (const item of result) {
				expect(item.kemendagri_regency_code).toBe(d.kemendagri_regency_code);
			}
		}
	});

	it('returns empty array for non-existent code "9999"', () => {
		expect(getDistrictsByKemendagriRegencyCode("9999")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(getDistrictsByKemendagriRegencyCode("")).toEqual([]);
	});

	it("returns a defensive copy — mutasi tidak merusak data internal", () => {
		const d = getDistrictByBpsCode("1101010");
		if (d?.kemendagri_regency_code) {
			const a = getDistrictsByKemendagriRegencyCode(d.kemendagri_regency_code);
			const originalLength = a.length;
			a.push({} as never);
			const b = getDistrictsByKemendagriRegencyCode(d.kemendagri_regency_code);
			expect(b).toHaveLength(originalLength);
		}
	});
});

describe("getDistrictByBpsCode", () => {
	it('finds TEUPAH SELATAN by BPS code "1101010"', () => {
		const d = getDistrictByBpsCode("1101010");
		expect(d).toBeDefined();
		expect(d?.name).toBe("TEUPAH SELATAN");
		expect(d?.bps_regency_code).toBe("1101");
	});

	it("district has kemendagri_code", () => {
		const d = getDistrictByBpsCode("1101010");
		expect(d?.kemendagri_code).not.toBeNull();
	});

	it('returns undefined for non-existent code "0000000"', () => {
		expect(getDistrictByBpsCode("0000000")).toBeUndefined();
	});
});

describe("getDistrictByKemendagriCode", () => {
	it("finds a district by Kemendagri code", () => {
		const d = getDistrictByBpsCode("1101010");
		expect(d).toBeDefined();
		if (d?.kemendagri_code) {
			const found = getDistrictByKemendagriCode(d.kemendagri_code);
			expect(found).toBeDefined();
			expect(found?.bps_code).toBe("1101010");
		}
	});

	it('returns undefined for non-existent code "000000"', () => {
		expect(getDistrictByKemendagriCode("000000")).toBeUndefined();
	});

	it("returns undefined for empty string", () => {
		expect(getDistrictByKemendagriCode("")).toBeUndefined();
	});
});
