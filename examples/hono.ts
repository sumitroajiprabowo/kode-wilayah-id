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
 *   GET /api/search?q=bandung&level=regency&limit=5
 *   GET /api/hierarchy/village/:code
 *   GET /api/hierarchy/district/:code
 *   GET /api/hierarchy/regency/:code
 *   GET /api/tree/province/:code
 *   GET /api/tree/regency/:code
 *   GET /api/tree/district/:code
 *   GET /api/stats/summary
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
  // v1.1.0
  getVillageWithParents,
  getDistrictWithParents,
  getRegencyWithParent,
  getProvinceTree,
  getRegencyTree,
  getDistrictTree,
  getSummary,
  type SearchOptions,
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
  const options: SearchOptions = {};
  const level = c.req.query("level");
  const limit = c.req.query("limit");
  if (level) options.level = level as SearchOptions["level"];
  if (limit) options.limit = Number(limit);
  return c.json(searchByName(q, options));
});

// Hierarchy — reverse lookup
app.get("/api/hierarchy/village/:code", (c) => {
  const result = getVillageWithParents(c.req.param("code"));
  if (!result) return c.json({ error: "Not found" }, 404);
  return c.json(result);
});

app.get("/api/hierarchy/district/:code", (c) => {
  const result = getDistrictWithParents(c.req.param("code"));
  if (!result) return c.json({ error: "Not found" }, 404);
  return c.json(result);
});

app.get("/api/hierarchy/regency/:code", (c) => {
  const result = getRegencyWithParent(c.req.param("code"));
  if (!result) return c.json({ error: "Not found" }, 404);
  return c.json(result);
});

// Hierarchy — drill-down tree
app.get("/api/tree/province/:code", (c) => {
  const tree = getProvinceTree(c.req.param("code"));
  if (!tree) return c.json({ error: "Not found" }, 404);
  return c.json(tree);
});

app.get("/api/tree/regency/:code", (c) => {
  const tree = getRegencyTree(c.req.param("code"));
  if (!tree) return c.json({ error: "Not found" }, 404);
  return c.json(tree);
});

app.get("/api/tree/district/:code", (c) => {
  const tree = getDistrictTree(c.req.param("code"));
  if (!tree) return c.json({ error: "Not found" }, 404);
  return c.json(tree);
});

// Stats
app.get("/api/stats/summary", (c) => c.json(getSummary()));

const PORT = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Wilayah API (Hono) running at http://localhost:${info.port}`);
});
