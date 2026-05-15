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
} from "kode-wilayah-id";

export const GET: RequestHandler = ({ url }) => {
  const level = url.searchParams.get("level");
  const parent = url.searchParams.get("parent") ?? "";
  const search = url.searchParams.get("q");
  const postalCode = url.searchParams.get("postal_code");

  if (search) return json(searchByName(search));
  if (postalCode) return json(getVillagesByPostalCode(postalCode));

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
