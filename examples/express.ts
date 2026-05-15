/**
 * Express.js Example — REST API Wilayah Indonesia
 *
 * Install:
 *   npm install express kode-wilayah-id
 *   npm install -D @types/express
 *
 * Run:
 *   npx tsx examples/express.ts
 *
 * Endpoints:
 *   GET /api/provinces
 *   GET /api/regencies?province=31
 *   GET /api/districts?regency=3101
 *   GET /api/villages?district=3101010
 *   GET /api/villages/postal/:postalCode
 *   GET /api/search?q=jakarta&level=regency&limit=5
 *   GET /api/hierarchy/village/:code
 *   GET /api/hierarchy/district/:code
 *   GET /api/hierarchy/regency/:code
 *   GET /api/tree/province/:code
 *   GET /api/tree/regency/:code
 *   GET /api/tree/district/:code
 *   GET /api/stats/summary
 *   GET /api/stats/province/:code
 */

import express from "express";
import {
  getProvinces,
  getProvinceByBpsCode,
  getRegenciesByBpsProvinceCode,
  getRegencyByBpsCode,
  getDistrictsByBpsRegencyCode,
  getDistrictByBpsCode,
  getVillagesByBpsDistrictCode,
  getVillageByBpsCode,
  getVillagesByPostalCode,
  searchByName,
  // v1.1.0
  getVillageWithParents,
  getDistrictWithParents,
  getRegencyWithParent,
  getProvinceTree,
  getRegencyTree,
  getDistrictTree,
  getRegencyCountByProvince,
  getSummary,
  type SearchOptions,
} from "kode-wilayah-id";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Provinces
app.get("/api/provinces", (_req, res) => {
  res.json(getProvinces());
});

app.get("/api/provinces/:code", (req, res) => {
  const province = getProvinceByBpsCode(req.params.code);
  if (!province) return res.status(404).json({ error: "Province not found" });
  res.json(province);
});

// Regencies
app.get("/api/regencies", (req, res) => {
  const { province } = req.query;
  if (!province) return res.status(400).json({ error: "province query required" });
  res.json(getRegenciesByBpsProvinceCode(province as string));
});

app.get("/api/regencies/:code", (req, res) => {
  const regency = getRegencyByBpsCode(req.params.code);
  if (!regency) return res.status(404).json({ error: "Regency not found" });
  res.json(regency);
});

// Districts
app.get("/api/districts", (req, res) => {
  const { regency } = req.query;
  if (!regency) return res.status(400).json({ error: "regency query required" });
  res.json(getDistrictsByBpsRegencyCode(regency as string));
});

app.get("/api/districts/:code", (req, res) => {
  const district = getDistrictByBpsCode(req.params.code);
  if (!district) return res.status(404).json({ error: "District not found" });
  res.json(district);
});

// Villages
app.get("/api/villages", (req, res) => {
  const { district } = req.query;
  if (!district) return res.status(400).json({ error: "district query required" });
  res.json(getVillagesByBpsDistrictCode(district as string));
});

// Postal code lookup (must be before :code to avoid matching "postal" as code)
app.get("/api/villages/postal/:postalCode", (req, res) => {
  res.json(getVillagesByPostalCode(req.params.postalCode));
});

app.get("/api/villages/:code", (req, res) => {
  const village = getVillageByBpsCode(req.params.code);
  if (!village) return res.status(404).json({ error: "Village not found" });
  res.json(village);
});

// Search
app.get("/api/search", (req, res) => {
  const { q, level, limit } = req.query;
  if (!q) return res.status(400).json({ error: "q query required" });
  const options: SearchOptions = {};
  if (level) options.level = level as SearchOptions["level"];
  if (limit) options.limit = Number(limit);
  res.json(searchByName(q as string, options));
});

// Hierarchy — reverse lookup
app.get("/api/hierarchy/village/:code", (req, res) => {
  const result = getVillageWithParents(req.params.code);
  if (!result) return res.status(404).json({ error: "Village not found" });
  res.json(result);
});

app.get("/api/hierarchy/district/:code", (req, res) => {
  const result = getDistrictWithParents(req.params.code);
  if (!result) return res.status(404).json({ error: "District not found" });
  res.json(result);
});

app.get("/api/hierarchy/regency/:code", (req, res) => {
  const result = getRegencyWithParent(req.params.code);
  if (!result) return res.status(404).json({ error: "Regency not found" });
  res.json(result);
});

// Hierarchy — drill-down tree
app.get("/api/tree/province/:code", (req, res) => {
  const tree = getProvinceTree(req.params.code);
  if (!tree) return res.status(404).json({ error: "Province not found" });
  res.json(tree);
});

app.get("/api/tree/regency/:code", (req, res) => {
  const tree = getRegencyTree(req.params.code);
  if (!tree) return res.status(404).json({ error: "Regency not found" });
  res.json(tree);
});

app.get("/api/tree/district/:code", (req, res) => {
  const tree = getDistrictTree(req.params.code);
  if (!tree) return res.status(404).json({ error: "District not found" });
  res.json(tree);
});

// Stats
app.get("/api/stats/summary", (_req, res) => {
  res.json(getSummary());
});

app.get("/api/stats/province/:code", (req, res) => {
  const code = req.params.code;
  res.json({
    regencies: getRegencyCountByProvince(code),
  });
});

app.listen(PORT, () => {
  console.log(`Wilayah API running at http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/provinces`);
});
