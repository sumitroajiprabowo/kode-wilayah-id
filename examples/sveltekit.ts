/**
 * SvelteKit Example — Server Load + API Endpoint
 *
 * Install:
 *   npm install kode-wilayah-id
 *
 * Files:
 *   src/routes/wilayah/+page.server.ts — Server load function
 *   src/routes/api/wilayah/+server.ts  — API endpoint
 */

// ============================================================
// src/routes/wilayah/+page.server.ts — Server Load
// ============================================================

import type { PageServerLoad } from "./$types";
import {
  getProvinces,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
} from "kode-wilayah-id";

export const load: PageServerLoad = ({ url }) => {
  const provinceCode = url.searchParams.get("province") ?? "";
  const regencyCode = url.searchParams.get("regency") ?? "";
  const districtCode = url.searchParams.get("district") ?? "";

  return {
    provinces: getProvinces(),
    regencies: provinceCode
      ? getRegenciesByBpsProvinceCode(provinceCode)
      : [],
    districts: regencyCode
      ? getDistrictsByBpsRegencyCode(regencyCode)
      : [],
    villages: districtCode
      ? getVillagesByBpsDistrictCode(districtCode)
      : [],
  };
};

// ============================================================
// src/routes/api/wilayah/+server.ts — API Endpoint
// ============================================================

import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  getProvinces as getProvincesApi,
  getRegenciesByBpsProvinceCode as getRegenciesApi,
  getDistrictsByBpsRegencyCode as getDistrictsApi,
  getVillagesByBpsDistrictCode as getVillagesApi,
  getVillagesByPostalCode,
  searchByName,
  // v1.1.0
  getVillageWithParents,
  getDistrictWithParents,
  getRegencyWithParent,
  getSummary,
  type SearchOptions,
} from "kode-wilayah-id";

export const GET: RequestHandler = ({ url }) => {
  const level = url.searchParams.get("level");
  const parent = url.searchParams.get("parent") ?? "";
  const search = url.searchParams.get("q");
  const postalCode = url.searchParams.get("postal_code");

  if (search) return json(searchByName(search));
  if (postalCode) return json(getVillagesByPostalCode(postalCode));

  // Hierarchy — reverse lookup (v1.1.0)
  const hierarchy = url.searchParams.get("hierarchy");
  const code = url.searchParams.get("code");
  if (hierarchy && code) {
    switch (hierarchy) {
      case "village":
        return json(getVillageWithParents(code) ?? { error: "Not found" });
      case "district":
        return json(getDistrictWithParents(code) ?? { error: "Not found" });
      case "regency":
        return json(getRegencyWithParent(code) ?? { error: "Not found" });
    }
  }

  // Stats (v1.1.0)
  if (level === "summary") return json(getSummary());

  switch (level) {
    case "provinces":
      return json(getProvincesApi());
    case "regencies":
      return json(getRegenciesApi(parent));
    case "districts":
      return json(getDistrictsApi(parent));
    case "villages":
      return json(getVillagesApi(parent));
    default:
      throw error(400, "Invalid level");
  }
};
