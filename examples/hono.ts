/**
 * Hono Example — Lightweight REST API Wilayah Indonesia
 *
 * Install:
 *   npm install hono kode-wilayah-id
 *
 * Run (Node.js):
 *   npx tsx examples/hono.ts
 *
 * Run (Bun):
 *   bun examples/hono.ts
 *
 * Endpoints:
 *   GET /api/provinces
 *   GET /api/regencies/:provinceCode
 *   GET /api/districts/:regencyCode
 *   GET /api/villages/:districtCode
 *   GET /api/postal/:postalCode
 *   GET /api/search?q=bandung
 */

import { Hono } from "hono";
import { serve } from "@hono/node-server";
import {
  getProvinces,
  getProvinceByBpsCode,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
  getVillagesByPostalCode,
  searchByName,
} from "kode-wilayah-id";

const app = new Hono();

// Provinces
app.get("/api/provinces", (c) => c.json(getProvinces()));

app.get("/api/provinces/:code", (c) => {
  const province = getProvinceByBpsCode(c.req.param("code"));
  if (!province) return c.json({ error: "Not found" }, 404);
  return c.json(province);
});

// Regencies by province
app.get("/api/regencies/:provinceCode", (c) =>
  c.json(getRegenciesByBpsProvinceCode(c.req.param("provinceCode")))
);

// Districts by regency
app.get("/api/districts/:regencyCode", (c) =>
  c.json(getDistrictsByBpsRegencyCode(c.req.param("regencyCode")))
);

// Villages by district
app.get("/api/villages/:districtCode", (c) =>
  c.json(getVillagesByBpsDistrictCode(c.req.param("districtCode")))
);

// Postal code lookup
app.get("/api/postal/:postalCode", (c) =>
  c.json(getVillagesByPostalCode(c.req.param("postalCode")))
);

// Search
app.get("/api/search", (c) => {
  const q = c.req.query("q");
  if (!q) return c.json({ error: "q query required" }, 400);
  return c.json(searchByName(q));
});

const PORT = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Wilayah API (Hono) running at http://localhost:${info.port}`);
});
