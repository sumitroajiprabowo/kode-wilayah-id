import { describe, expect, it } from "vitest";
import { searchByName } from "../src/search";

describe("searchByName", () => {
	it("finds province-level results", () => {
		const results = searchByName("JAWA BARAT");
		const provinces = results.filter((r) => r.level === "province");
		expect(provinces.length).toBeGreaterThanOrEqual(1);
		expect(provinces[0].data.name).toBe("JAWA BARAT");
	});

	it('finds results for "bandung" including regencies', () => {
		const results = searchByName("bandung");
		expect(results.length).toBeGreaterThanOrEqual(3);
		const regencyNames = results.filter((r) => r.level === "regency").map((r) => r.data.name);
		expect(regencyNames).toContain("KAB. BANDUNG");
		expect(regencyNames).toContain("KAB. BANDUNG BARAT");
		expect(regencyNames).toContain("KOTA BANDUNG");
	});

	it("is case-insensitive", () => {
		const upper = searchByName("BANDUNG");
		const lower = searchByName("bandung");
		const mixed = searchByName("Bandung");
		expect(upper.length).toBe(lower.length);
		expect(upper.length).toBe(mixed.length);
	});

	it("returns empty array for empty query", () => {
		expect(searchByName("")).toEqual([]);
	});

	it("returns empty array for whitespace-only query", () => {
		expect(searchByName("   ")).toEqual([]);
	});

	it("returns empty array for non-matching query", () => {
		expect(searchByName("XYZNONEXISTENT999")).toEqual([]);
	});

	it("each result has correct level discriminator and v1.0 fields", () => {
		const results = searchByName("bandung");
		for (const r of results) {
			expect(["province", "regency", "district", "village"]).toContain(r.level);
			expect(r.data).toHaveProperty("bps_code");
			expect(r.data).toHaveProperty("kemendagri_code");
			expect(r.data).toHaveProperty("name");
		}
	});

	it("regency results have bps_province_code", () => {
		const results = searchByName("bandung");
		const regencies = results.filter((r) => r.level === "regency");
		for (const r of regencies) {
			expect(r.data).toHaveProperty("bps_province_code");
			expect(r.data).toHaveProperty("kemendagri_province_code");
		}
	});
});

describe("searchByName with options", () => {
	it("filters by level: province", () => {
		const results = searchByName("jawa", { level: "province" });
		expect(results.length).toBeGreaterThan(0);
		for (const r of results) {
			expect(r.level).toBe("province");
		}
	});

	it("filters by level: regency", () => {
		const results = searchByName("bandung", { level: "regency" });
		expect(results.length).toBeGreaterThanOrEqual(3);
		for (const r of results) {
			expect(r.level).toBe("regency");
		}
	});

	it("filters by level: district", () => {
		const results = searchByName("nagreg", { level: "district" });
		expect(results.length).toBeGreaterThanOrEqual(1);
		for (const r of results) {
			expect(r.level).toBe("district");
		}
	});

	it("filters by level: village", () => {
		const results = searchByName("nagreg", { level: "village" });
		expect(results.length).toBeGreaterThanOrEqual(1);
		for (const r of results) {
			expect(r.level).toBe("village");
		}
	});

	it("limits results", () => {
		const unlimited = searchByName("bandung");
		const limited = searchByName("bandung", { limit: 5 });
		expect(limited.length).toBe(5);
		expect(unlimited.length).toBeGreaterThan(5);
	});

	it("limit with level combined", () => {
		const results = searchByName("bandung", { level: "regency", limit: 2 });
		expect(results.length).toBe(2);
		for (const r of results) {
			expect(r.level).toBe("regency");
		}
	});

	it("returns all when limit exceeds matches", () => {
		const results = searchByName("XYZNONEXISTENT", { limit: 100 });
		expect(results.length).toBe(0);
	});

	it("empty options behaves same as no options", () => {
		const withOpts = searchByName("bandung", {});
		const withoutOpts = searchByName("bandung");
		expect(withOpts.length).toBe(withoutOpts.length);
	});

	it("limit stops early across different levels", () => {
		// "JAWA" appears in multiple provinces, regencies, etc.
		const limited = searchByName("jawa", { limit: 3 });
		expect(limited.length).toBe(3);
	});

	it("limit 1 returns exactly one result", () => {
		const results = searchByName("bandung", { limit: 1 });
		expect(results.length).toBe(1);
	});

	it("limit stops at village level when filtering villages only", () => {
		const results = searchByName("nagreg", { level: "village", limit: 1 });
		expect(results.length).toBe(1);
		expect(results[0].level).toBe("village");
	});
});
