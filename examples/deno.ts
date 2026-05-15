/**
 * Deno Example — Native Deno HTTP Server
 *
 * Install:
 *   deno add npm:kode-wilayah-id
 *
 * Run:
 *   deno run --allow-net --allow-read examples/deno.ts
 *
 * Endpoints:
 *   GET /api/provinces
 *   GET /api/regencies?province=31
 *   GET /api/districts?regency=3101
 *   GET /api/villages?district=3101010
 *   GET /api/postal?code=10110
 *   GET /api/search?q=bandung
 */

import {
  getProvinces,
  getProvinceByBpsCode,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
  getVillagesByPostalCode,
  searchByName,
} from "npm:kode-wilayah-id";

const PORT = Number(Deno.env.get("PORT") ?? "3000");

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve({ port: PORT }, (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;
  const params = url.searchParams;

  // Provinces
  if (path === "/api/provinces") {
    const code = params.get("code");
    if (code) {
      const province = getProvinceByBpsCode(code);
      if (!province) return jsonResponse({ error: "Not found" }, 404);
      return jsonResponse(province);
    }
    return jsonResponse(getProvinces());
  }

  // Regencies
  if (path === "/api/regencies") {
    const province = params.get("province");
    if (!province) return jsonResponse({ error: "province param required" }, 400);
    return jsonResponse(getRegenciesByBpsProvinceCode(province));
  }

  // Districts
  if (path === "/api/districts") {
    const regency = params.get("regency");
    if (!regency) return jsonResponse({ error: "regency param required" }, 400);
    return jsonResponse(getDistrictsByBpsRegencyCode(regency));
  }

  // Villages
  if (path === "/api/villages") {
    const district = params.get("district");
    if (!district) return jsonResponse({ error: "district param required" }, 400);
    return jsonResponse(getVillagesByBpsDistrictCode(district));
  }

  // Postal code
  if (path === "/api/postal") {
    const code = params.get("code");
    if (!code) return jsonResponse({ error: "code param required" }, 400);
    return jsonResponse(getVillagesByPostalCode(code));
  }

  // Search
  if (path === "/api/search") {
    const q = params.get("q");
    if (!q) return jsonResponse({ error: "q param required" }, 400);
    return jsonResponse(searchByName(q));
  }

  return jsonResponse({ error: "Not found" }, 404);
});

console.log(`Wilayah API (Deno) running at http://localhost:${PORT}`);
