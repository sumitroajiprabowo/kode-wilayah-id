/**
 * Bun Example — Native Bun HTTP Server + File-based API
 *
 * Install:
 *   bun add kode-wilayah-id
 *
 * Run:
 *   bun examples/bun.ts
 *
 * Endpoints:
 *   GET /api/provinces
 *   GET /api/regencies?province=31
 *   GET /api/districts?regency=3101
 *   GET /api/villages?district=3101010
 *   GET /api/postal?code=10110
 *   GET /api/search?q=surabaya
 */

import {
  getProvinces,
  getProvinceByBpsCode,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
  getVillagesByPostalCode,
  searchByName,
} from "kode-wilayah-id";

const PORT = Number(process.env.PORT ?? 3000);

Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const params = url.searchParams;

    // Provinces
    if (path === "/api/provinces") {
      const code = params.get("code");
      if (code) {
        const province = getProvinceByBpsCode(code);
        if (!province)
          return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(province);
      }
      return Response.json(getProvinces());
    }

    // Regencies
    if (path === "/api/regencies") {
      const province = params.get("province");
      if (!province)
        return Response.json(
          { error: "province param required" },
          { status: 400 }
        );
      return Response.json(getRegenciesByBpsProvinceCode(province));
    }

    // Districts
    if (path === "/api/districts") {
      const regency = params.get("regency");
      if (!regency)
        return Response.json(
          { error: "regency param required" },
          { status: 400 }
        );
      return Response.json(getDistrictsByBpsRegencyCode(regency));
    }

    // Villages
    if (path === "/api/villages") {
      const district = params.get("district");
      if (!district)
        return Response.json(
          { error: "district param required" },
          { status: 400 }
        );
      return Response.json(getVillagesByBpsDistrictCode(district));
    }

    // Postal code
    if (path === "/api/postal") {
      const code = params.get("code");
      if (!code)
        return Response.json(
          { error: "code param required" },
          { status: 400 }
        );
      return Response.json(getVillagesByPostalCode(code));
    }

    // Search
    if (path === "/api/search") {
      const q = params.get("q");
      if (!q)
        return Response.json({ error: "q param required" }, { status: 400 });
      return Response.json(searchByName(q));
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
});

console.log(`Wilayah API (Bun) running at http://localhost:${PORT}`);
