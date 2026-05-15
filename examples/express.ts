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
 *   GET /api/search?q=jakarta
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
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "q query required" });
  res.json(searchByName(q as string));
});

app.listen(PORT, () => {
  console.log(`Wilayah API running at http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/provinces`);
});
