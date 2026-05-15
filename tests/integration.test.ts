import { describe, expect, it } from "vitest";
import { getDistricts, getProvinces, getRegencies, getVillages } from "../src/index";

describe("data integrity", () => {
	it("all province BPS codes are unique", () => {
		const codes = getProvinces().map((p) => p.bps_code);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it("all regency BPS codes are unique", () => {
		const codes = getRegencies().map((r) => r.bps_code);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it("all district BPS codes are unique", () => {
		const codes = getDistricts().map((d) => d.bps_code);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it("all village BPS codes are unique", () => {
		const codes = getVillages().map((v) => v.bps_code);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it("all non-null province Kemendagri codes are unique", () => {
		const codes = getProvinces()
			.map((p) => p.kemendagri_code)
			.filter((c): c is string => c !== null);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it("all non-null regency Kemendagri codes are unique", () => {
		const codes = getRegencies()
			.map((r) => r.kemendagri_code)
			.filter((c): c is string => c !== null);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it("all non-null district Kemendagri codes are unique", () => {
		const codes = getDistricts()
			.map((d) => d.kemendagri_code)
			.filter((c): c is string => c !== null);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it("all non-null village Kemendagri codes are unique", () => {
		const codes = getVillages()
			.map((v) => v.kemendagri_code)
			.filter((c): c is string => c !== null);
		expect(new Set(codes).size).toBe(codes.length);
	});
});

describe("referential integrity", () => {
	it("every regency references a valid province (BPS)", () => {
		const provinceCodes = new Set(getProvinces().map((p) => p.bps_code));
		for (const r of getRegencies()) {
			expect(provinceCodes.has(r.bps_province_code)).toBe(true);
		}
	});

	it("every district references a valid regency (BPS)", () => {
		const regencyCodes = new Set(getRegencies().map((r) => r.bps_code));
		for (const d of getDistricts()) {
			expect(regencyCodes.has(d.bps_regency_code)).toBe(true);
		}
	});

	it("every village references a valid district (BPS)", () => {
		const districtCodes = new Set(getDistricts().map((d) => d.bps_code));
		for (const v of getVillages()) {
			expect(districtCodes.has(v.bps_district_code)).toBe(true);
		}
	});
});

describe("parent-child completeness", () => {
	it("every province has at least one regency", () => {
		const regencies = getRegencies();
		for (const p of getProvinces()) {
			expect(regencies.some((r) => r.bps_province_code === p.bps_code)).toBe(true);
		}
	});

	it("every regency has at least one district", () => {
		const districts = getDistricts();
		for (const r of getRegencies()) {
			expect(districts.some((d) => d.bps_regency_code === r.bps_code)).toBe(true);
		}
	});

	it("every district has at least one village", () => {
		const villageDistrictCodes = new Set(getVillages().map((v) => v.bps_district_code));
		for (const d of getDistricts()) {
			expect(villageDistrictCodes.has(d.bps_code)).toBe(true);
		}
	}, 30_000);
});

describe("non-empty fields", () => {
	it("all province required fields are non-empty strings", () => {
		for (const p of getProvinces()) {
			expect(p.bps_code.length).toBeGreaterThan(0);
			expect(p.name.length).toBeGreaterThan(0);
		}
	});

	it("all regency required fields are non-empty strings", () => {
		for (const r of getRegencies()) {
			expect(r.bps_code.length).toBeGreaterThan(0);
			expect(r.bps_province_code.length).toBeGreaterThan(0);
			expect(r.name.length).toBeGreaterThan(0);
		}
	});

	it("all district required fields are non-empty strings", () => {
		for (const d of getDistricts()) {
			expect(d.bps_code.length).toBeGreaterThan(0);
			expect(d.bps_regency_code.length).toBeGreaterThan(0);
			expect(d.name.length).toBeGreaterThan(0);
		}
	});

	it("all village required fields are non-empty strings", () => {
		for (const v of getVillages()) {
			expect(v.bps_code.length).toBeGreaterThan(0);
			expect(v.bps_district_code.length).toBeGreaterThan(0);
			expect(v.name.length).toBeGreaterThan(0);
		}
	}, 30_000);
});

describe("null semantics", () => {
	it("no empty strings in nullable fields (use null, not empty)", () => {
		for (const p of getProvinces()) {
			expect(p.kemendagri_code !== "").toBe(true);
		}
		for (const r of getRegencies()) {
			expect(r.kemendagri_code !== "").toBe(true);
			expect(r.kemendagri_province_code !== "").toBe(true);
		}
		for (const d of getDistricts()) {
			expect(d.kemendagri_code !== "").toBe(true);
			expect(d.kemendagri_regency_code !== "").toBe(true);
		}
	});

	it("no empty strings in village nullable fields", () => {
		for (const v of getVillages()) {
			expect(v.kemendagri_code !== "").toBe(true);
			expect(v.kemendagri_district_code !== "").toBe(true);
			expect(v.postal_code !== "").toBe(true);
		}
	}, 30_000);

	it("kemendagri_code null implies postal_code also null", () => {
		const villages = getVillages();
		const nullVillages = villages.filter((v) => v.kemendagri_code === null);
		expect(nullVillages.length).toBeGreaterThan(0);
		for (const v of nullVillages) {
			expect(v.postal_code).toBeNull();
		}
	});

	it("Papua province villages have all kemendagri fields null", () => {
		const papuaBpsCodes = ["92", "95", "96", "97"];
		const villages = getVillages();
		const papuaVillages = villages.filter((v) =>
			papuaBpsCodes.includes(v.bps_code.substring(0, 2)),
		);
		expect(papuaVillages.length).toBeGreaterThan(0);
		for (const v of papuaVillages) {
			expect(v.kemendagri_code).toBeNull();
			expect(v.kemendagri_district_code).toBeNull();
			expect(v.postal_code).toBeNull();
		}
	});

	it("4 Papua provinces have null kemendagri_code", () => {
		const papuaProvinceCodes = ["92", "95", "96", "97"];
		const provinces = getProvinces();
		for (const code of papuaProvinceCodes) {
			const p = provinces.find((prov) => prov.bps_code === code);
			expect(p).toBeDefined();
			expect(p?.kemendagri_code).toBeNull();
		}
	});

	it("postal_code is 5-digit string when present", () => {
		const villages = getVillages();
		const withPostal = villages.filter((v) => v.postal_code !== null);
		expect(withPostal.length).toBeGreaterThan(0);
		for (const v of withPostal) {
			expect(v.postal_code).toMatch(/^\d{5}$/);
		}
	}, 30_000);
});

describe("coverage statistics", () => {
	it("has expected coverage levels", () => {
		const villages = getVillages();
		const withKemendagri = villages.filter((v) => v.kemendagri_code !== null);
		const withPostal = villages.filter((v) => v.postal_code !== null);

		// At least 90% should have kemendagri codes
		expect(withKemendagri.length / villages.length).toBeGreaterThan(0.9);
		// At least 88% should have postal codes
		expect(withPostal.length / villages.length).toBeGreaterThan(0.88);
	});
});
