import { describe, expect, it } from "vitest";
import {
	getDistricts,
	getProvinces,
	getRegencies,
	getVillages,
} from "../src/index";

describe("data integrity", () => {
	it("all province ids are unique", () => {
		const ids = getProvinces().map((p) => p.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("all regency ids are unique", () => {
		const ids = getRegencies().map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("all district ids are unique", () => {
		const ids = getDistricts().map((d) => d.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("all village ids are unique", () => {
		const ids = getVillages().map((v) => v.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe("referential integrity", () => {
	it("every regency references a valid province", () => {
		const provinceIds = new Set(getProvinces().map((p) => p.id));
		for (const r of getRegencies()) {
			expect(provinceIds.has(r.province_id)).toBe(true);
		}
	});

	it("every district references a valid regency", () => {
		const regencyIds = new Set(getRegencies().map((r) => r.id));
		for (const d of getDistricts()) {
			expect(regencyIds.has(d.regency_id)).toBe(true);
		}
	});

	it("every village references a valid district", () => {
		const districtIds = new Set(getDistricts().map((d) => d.id));
		for (const v of getVillages()) {
			expect(districtIds.has(v.district_id)).toBe(true);
		}
	});
});

describe("parent-child completeness", () => {
	it("every province has at least one regency", () => {
		const regencies = getRegencies();
		for (const p of getProvinces()) {
			expect(regencies.some((r) => r.province_id === p.id)).toBe(true);
		}
	});

	it("every regency has at least one district", () => {
		const districts = getDistricts();
		for (const r of getRegencies()) {
			expect(districts.some((d) => d.regency_id === r.id)).toBe(true);
		}
	});

	it("every district has at least one village", () => {
		const villages = getVillages();
		for (const d of getDistricts()) {
			expect(villages.some((v) => v.district_id === d.id)).toBe(true);
		}
	});
});

describe("non-empty fields", () => {
	it("all province fields are non-empty strings", () => {
		for (const p of getProvinces()) {
			expect(p.id.length).toBeGreaterThan(0);
			expect(p.name.length).toBeGreaterThan(0);
		}
	});

	it("all regency fields are non-empty strings", () => {
		for (const r of getRegencies()) {
			expect(r.id.length).toBeGreaterThan(0);
			expect(r.province_id.length).toBeGreaterThan(0);
			expect(r.name.length).toBeGreaterThan(0);
		}
	});

	it("all district fields are non-empty strings", () => {
		for (const d of getDistricts()) {
			expect(d.id.length).toBeGreaterThan(0);
			expect(d.regency_id.length).toBeGreaterThan(0);
			expect(d.name.length).toBeGreaterThan(0);
		}
	});

	it("all village fields are non-empty strings", () => {
		for (const v of getVillages()) {
			expect(v.id.length).toBeGreaterThan(0);
			expect(v.district_id.length).toBeGreaterThan(0);
			expect(v.name.length).toBeGreaterThan(0);
		}
	});
});
