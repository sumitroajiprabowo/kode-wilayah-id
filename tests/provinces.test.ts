import { describe, expect, it } from "vitest";
import { getProvinceByBpsCode, getProvinceByKemendagriCode, getProvinces } from "../src/provinces";

describe("getProvinces", () => {
	it("returns 38 provinces", () => {
		expect(getProvinces()).toHaveLength(38);
	});

	it("returns Province[] with correct shape", () => {
		const provinces = getProvinces();
		for (const p of provinces) {
			expect(p).toHaveProperty("bps_code");
			expect(p).toHaveProperty("kemendagri_code");
			expect(p).toHaveProperty("name");
			expect(typeof p.bps_code).toBe("string");
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

describe("getProvinceByBpsCode", () => {
	it('finds JAWA BARAT by BPS code "32"', () => {
		const p = getProvinceByBpsCode("32");
		expect(p).toBeDefined();
		expect(p?.name).toBe("JAWA BARAT");
		expect(p?.bps_code).toBe("32");
	});

	it('finds ACEH by BPS code "11"', () => {
		const p = getProvinceByBpsCode("11");
		expect(p).toBeDefined();
		expect(p?.name).toBe("ACEH");
	});

	it("returns province with kemendagri_code for provinces in bridging", () => {
		const p = getProvinceByBpsCode("11");
		expect(p?.kemendagri_code).toBe("11");
	});

	it("returns province with kemendagri_code null for Papua Barat Daya (92)", () => {
		const p = getProvinceByBpsCode("92");
		expect(p).toBeDefined();
		expect(p?.name).toBe("PAPUA BARAT DAYA");
		expect(p?.kemendagri_code).toBeNull();
	});

	it('returns undefined for non-existent code "99"', () => {
		expect(getProvinceByBpsCode("99")).toBeUndefined();
	});

	it("returns undefined for empty string", () => {
		expect(getProvinceByBpsCode("")).toBeUndefined();
	});
});

describe("getProvinceByKemendagriCode", () => {
	it('finds JAWA BARAT by Kemendagri code "32"', () => {
		const p = getProvinceByKemendagriCode("32");
		expect(p).toBeDefined();
		expect(p?.name).toBe("JAWA BARAT");
		expect(p?.bps_code).toBe("32");
	});

	it('returns undefined for non-existent code "99"', () => {
		expect(getProvinceByKemendagriCode("99")).toBeUndefined();
	});

	it("returns undefined for empty string", () => {
		expect(getProvinceByKemendagriCode("")).toBeUndefined();
	});
});
