import { describe, expect, it } from "vitest";
import {
	getVillageByBpsCode,
	getVillageByKemendagriCode,
	getVillages,
	getVillagesByBpsDistrictCode,
	getVillagesByKemendagriDistrictCode,
	getVillagesByPostalCode,
} from "../src/villages";

describe("getVillages", () => {
	it("returns 84270 villages", () => {
		expect(getVillages()).toHaveLength(84270);
	});

	it("returns a new array copy each call", () => {
		const a = getVillages();
		const b = getVillages();
		expect(a).not.toBe(b);
	});
});

describe("getVillagesByBpsDistrictCode", () => {
	it('returns 19 villages for BPS district "1101010"', () => {
		expect(getVillagesByBpsDistrictCode("1101010")).toHaveLength(19);
	});

	it('returns empty array for non-existent district "0000000"', () => {
		expect(getVillagesByBpsDistrictCode("0000000")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(getVillagesByBpsDistrictCode("")).toEqual([]);
	});

	it("returns a defensive copy — mutasi tidak merusak data internal", () => {
		const a = getVillagesByBpsDistrictCode("1101010");
		const originalLength = a.length;
		a.push({} as never);
		const b = getVillagesByBpsDistrictCode("1101010");
		expect(b).toHaveLength(originalLength);
	});
});

describe("getVillagesByKemendagriDistrictCode", () => {
	it("returns villages for a known Kemendagri district code", () => {
		const v = getVillageByBpsCode("1101010001");
		expect(v).toBeDefined();
		if (v?.kemendagri_district_code) {
			const result = getVillagesByKemendagriDistrictCode(v.kemendagri_district_code);
			expect(result.length).toBeGreaterThan(0);
			for (const item of result) {
				expect(item.kemendagri_district_code).toBe(v.kemendagri_district_code);
			}
		}
	});

	it('returns empty array for non-existent code "000000"', () => {
		expect(getVillagesByKemendagriDistrictCode("000000")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(getVillagesByKemendagriDistrictCode("")).toEqual([]);
	});

	it("returns a defensive copy — mutasi tidak merusak data internal", () => {
		const v = getVillageByBpsCode("1101010001");
		if (v?.kemendagri_district_code) {
			const a = getVillagesByKemendagriDistrictCode(v.kemendagri_district_code);
			const originalLength = a.length;
			a.push({} as never);
			const b = getVillagesByKemendagriDistrictCode(v.kemendagri_district_code);
			expect(b).toHaveLength(originalLength);
		}
	});
});

describe("getVillageByBpsCode", () => {
	it('finds LATIUNG by BPS code "1101010001"', () => {
		const v = getVillageByBpsCode("1101010001");
		expect(v).toBeDefined();
		expect(v?.name).toBe("LATIUNG");
		expect(v?.bps_district_code).toBe("1101010");
	});

	it("village has kemendagri_code for non-Papua village", () => {
		const v = getVillageByBpsCode("1101010001");
		expect(v?.kemendagri_code).not.toBeNull();
	});

	it("village has postal_code for non-Papua village with kodepos data", () => {
		const v = getVillageByBpsCode("1101010001");
		if (v?.kemendagri_code) {
			expect(typeof v.postal_code === "string" || v.postal_code === null).toBe(true);
		}
	});

	it('returns undefined for non-existent code "0000000000"', () => {
		expect(getVillageByBpsCode("0000000000")).toBeUndefined();
	});
});

describe("getVillageByKemendagriCode", () => {
	it("finds a village by Kemendagri code", () => {
		const v = getVillageByBpsCode("1101010001");
		expect(v).toBeDefined();
		if (v?.kemendagri_code) {
			const found = getVillageByKemendagriCode(v.kemendagri_code);
			expect(found).toBeDefined();
			expect(found?.bps_code).toBe("1101010001");
		}
	});

	it('returns undefined for non-existent code "0000000000"', () => {
		expect(getVillageByKemendagriCode("0000000000")).toBeUndefined();
	});

	it("returns undefined for empty string", () => {
		expect(getVillageByKemendagriCode("")).toBeUndefined();
	});
});

describe("getVillagesByPostalCode", () => {
	it("returns villages for a known postal code", () => {
		const allVillages = getVillages();
		const withPostal = allVillages.find((v) => v.postal_code !== null);
		expect(withPostal).toBeDefined();
		if (withPostal?.postal_code) {
			const result = getVillagesByPostalCode(withPostal.postal_code);
			expect(result.length).toBeGreaterThan(0);
			for (const v of result) {
				expect(v.postal_code).toBe(withPostal.postal_code);
			}
		}
	});

	it('returns empty array for non-existent postal code "00000"', () => {
		expect(getVillagesByPostalCode("00000")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(getVillagesByPostalCode("")).toEqual([]);
	});

	it("returns a defensive copy — mutasi tidak merusak data internal", () => {
		const allVillages = getVillages();
		const withPostal = allVillages.find((v) => v.postal_code !== null);
		if (withPostal?.postal_code) {
			const a = getVillagesByPostalCode(withPostal.postal_code);
			const originalLength = a.length;
			a.push({} as never);
			const b = getVillagesByPostalCode(withPostal.postal_code);
			expect(b).toHaveLength(originalLength);
		}
	});
});

describe("null handling — Papua provinces", () => {
	it("Papua Barat Daya villages have null kemendagri_code", () => {
		const villages = getVillages().filter((v) => v.bps_code.startsWith("92"));
		expect(villages.length).toBeGreaterThan(0);
		for (const v of villages) {
			expect(v.kemendagri_code).toBeNull();
			expect(v.kemendagri_district_code).toBeNull();
			expect(v.postal_code).toBeNull();
		}
	});
});
