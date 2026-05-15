import { describe, expect, it } from "vitest";
import { searchByName } from "../src/search";

describe("searchByName", () => {
	it('finds results for "bandung" including regencies', () => {
		const results = searchByName("bandung");
		expect(results.length).toBeGreaterThanOrEqual(3);
		const regencyNames = results
			.filter((r) => r.level === "regency")
			.map((r) => r.data.name);
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

	it("each result has correct level discriminator", () => {
		const results = searchByName("bandung");
		for (const r of results) {
			expect(["province", "regency", "district", "village"]).toContain(r.level);
			expect(r.data).toHaveProperty("id");
			expect(r.data).toHaveProperty("name");
		}
	});

	it("regency results have province_id", () => {
		const results = searchByName("bandung");
		const regencies = results.filter((r) => r.level === "regency");
		for (const r of regencies) {
			expect(r.data).toHaveProperty("province_id");
		}
	});
});
