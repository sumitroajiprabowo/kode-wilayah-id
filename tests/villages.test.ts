import { describe, expect, it } from "vitest";
import { getVillageById, getVillages, getVillagesByDistrictId } from "../src/villages";

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

describe("getVillagesByDistrictId", () => {
	it('returns 19 villages for district "1101010"', () => {
		expect(getVillagesByDistrictId("1101010")).toHaveLength(19);
	});

	it('returns empty array for non-existent district "0000000"', () => {
		expect(getVillagesByDistrictId("0000000")).toEqual([]);
	});

	it("returns empty array for empty string", () => {
		expect(getVillagesByDistrictId("")).toEqual([]);
	});
});

describe("getVillageById", () => {
	it('finds LATIUNG by id "1101010001"', () => {
		const v = getVillageById("1101010001");
		expect(v).toBeDefined();
		expect(v?.name).toBe("LATIUNG");
		expect(v?.district_id).toBe("1101010");
	});

	it('returns undefined for non-existent id "0000000000"', () => {
		expect(getVillageById("0000000000")).toBeUndefined();
	});
});
