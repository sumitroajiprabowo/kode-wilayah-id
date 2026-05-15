/**
 * Node.js (Vanilla) Example — Basic Usage & CLI
 *
 * Install:
 *   npm install kode-wilayah-id
 *
 * Run:
 *   npx tsx examples/node.ts
 *   # or
 *   node --loader ts-node/esm examples/node.ts
 */

import {
  getProvinces,
  getProvinceByBpsCode,
  getProvinceByKemendagriCode,
  getRegenciesByBpsProvinceCode,
  getRegenciesByKemendagriProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
  getVillagesByPostalCode,
  searchByName,
  // v1.1.0 — Hierarchy
  getVillageWithParents,
  getDistrictWithParents,
  getRegencyWithParent,
  getProvinceTree,
  getRegencyTree,
  getDistrictTree,
  // v1.1.0 — Stats
  getRegencyCountByProvince,
  getDistrictCountByRegency,
  getVillageCountByDistrict,
  getDistrictCountByProvince,
  getVillageCountByRegency,
  getVillageCountByProvince,
  getSummary,
} from "kode-wilayah-id";

// ── List all provinces ─────────────────────────────────────────
console.log("=== All Provinces ===");
const provinces = getProvinces();
console.log(`Total: ${provinces.length} provinsi\n`);

for (const p of provinces.slice(0, 5)) {
  console.log(
    `  ${p.name} — BPS: ${p.bps_code}, Kemendagri: ${p.kemendagri_code ?? "N/A"}`
  );
}
console.log("  ...\n");

// ── Lookup by BPS code ─────────────────────────────────────────
console.log("=== Lookup by BPS Code ===");
const jakarta = getProvinceByBpsCode("31");
if (jakarta) {
  console.log(`  ${jakarta.name} (BPS: ${jakarta.bps_code})`);
}

// ── Lookup by Kemendagri code ──────────────────────────────────
console.log("\n=== Lookup by Kemendagri Code ===");
const jawaBarat = getProvinceByKemendagriCode("32");
if (jawaBarat) {
  console.log(`  ${jawaBarat.name} (Kemendagri: ${jawaBarat.kemendagri_code})`);
}

// ── Cascading: Province → Regency → District → Village ────────
console.log("\n=== Cascading Drill-Down ===");
if (jakarta) {
  const regencies = getRegenciesByBpsProvinceCode(jakarta.bps_code);
  console.log(`  ${jakarta.name} — ${regencies.length} kabupaten/kota`);

  const firstRegency = regencies[0];
  if (firstRegency) {
    const districts = getDistrictsByBpsRegencyCode(firstRegency.bps_code);
    console.log(`  └─ ${firstRegency.name} — ${districts.length} kecamatan`);

    const firstDistrict = districts[0];
    if (firstDistrict) {
      const villages = getVillagesByBpsDistrictCode(firstDistrict.bps_code);
      console.log(`     └─ ${firstDistrict.name} — ${villages.length} desa`);

      for (const v of villages.slice(0, 3)) {
        console.log(
          `        └─ ${v.name} (kode pos: ${v.postal_code ?? "N/A"})`
        );
      }
    }
  }
}

// ── Kemendagri-based lookup ────────────────────────────────────
console.log("\n=== Kemendagri-Based Lookup ===");
const regenciesKemendagri = getRegenciesByKemendagriProvinceCode("32");
console.log(
  `  Jawa Barat — ${regenciesKemendagri.length} kabupaten/kota (via Kemendagri)`
);

// ── Postal code lookup ─────────────────────────────────────────
console.log("\n=== Postal Code Lookup ===");
const villages10110 = getVillagesByPostalCode("10110");
console.log(`  Kode pos 10110 — ${villages10110.length} desa/kelurahan:`);
for (const v of villages10110) {
  console.log(`    ${v.name} (BPS: ${v.bps_code})`);
}

// ── Search by name ─────────────────────────────────────────────
console.log("\n=== Search by Name ===");
const results = searchByName("surabaya");
console.log(`  "surabaya" — ${results.length} hasil:`);
for (const r of results.slice(0, 5)) {
  console.log(`    [${r.level}] ${r.data.name} (BPS: ${r.data.bps_code})`);
}

// ── Search with options (v1.1.0) ───────────────────────────────
console.log("\n=== Search with Options ===");

// Filter by level
const regencyResults = searchByName("bandung", { level: "regency" });
console.log(`  "bandung" (level: regency) — ${regencyResults.length} hasil:`);
for (const r of regencyResults) {
  console.log(`    ${r.data.name} (BPS: ${r.data.bps_code})`);
}

// Limit results (cocok untuk autocomplete)
const limited = searchByName("jawa", { limit: 3 });
console.log(`\n  "jawa" (limit: 3) — ${limited.length} hasil:`);
for (const r of limited) {
  console.log(`    [${r.level}] ${r.data.name}`);
}

// Combined: level + limit
const combo = searchByName("bandung", { level: "village", limit: 5 });
console.log(`\n  "bandung" (level: village, limit: 5) — ${combo.length} hasil:`);
for (const r of combo) {
  console.log(`    ${r.data.name} (BPS: ${r.data.bps_code})`);
}

// ── Hierarchy: Reverse Lookup (v1.1.0) ─────────────────────────
console.log("\n=== Hierarchy: Reverse Lookup ===");

// Dari desa, dapat kecamatan + kabupaten + provinsi
const villageInfo = getVillageWithParents("3204101005");
if (villageInfo) {
  console.log("  Desa → Kecamatan → Kabupaten → Provinsi:");
  console.log(`    Desa      : ${villageInfo.village.name} (${villageInfo.village.postal_code})`);
  console.log(`    Kecamatan : ${villageInfo.district.name}`);
  console.log(`    Kabupaten : ${villageInfo.regency.name}`);
  console.log(`    Provinsi  : ${villageInfo.province.name}`);
}

// Dari kecamatan
const districtInfo = getDistrictWithParents("3204101");
if (districtInfo) {
  console.log(`\n  Kecamatan ${districtInfo.district.name} → ${districtInfo.regency.name} → ${districtInfo.province.name}`);
}

// Dari kabupaten
const regencyInfo = getRegencyWithParent("3204");
if (regencyInfo) {
  console.log(`  Kabupaten ${regencyInfo.regency.name} → ${regencyInfo.province.name}`);
}

// ── Hierarchy: Drill-Down Tree (v1.1.0) ────────────────────────
console.log("\n=== Hierarchy: Drill-Down Tree ===");

// Province tree (DKI Jakarta — kecil, cocok untuk contoh)
const provinceTree = getProvinceTree("31");
if (provinceTree) {
  console.log(`  ${provinceTree.province.name}:`);
  for (const reg of provinceTree.regencies.slice(0, 3)) {
    console.log(`    └─ ${reg.regency.name} (${reg.districts.length} kecamatan)`);
    for (const dist of reg.districts.slice(0, 2)) {
      console.log(`       └─ ${dist.district.name} (${dist.villages.length} desa)`);
    }
  }
  console.log("    ...");
}

// Regency tree
const regencyTree = getRegencyTree("3171");
if (regencyTree) {
  console.log(`\n  ${regencyTree.regency.name}:`);
  for (const dist of regencyTree.districts.slice(0, 3)) {
    console.log(`    └─ ${dist.district.name} (${dist.villages.length} desa)`);
  }
}

// District tree
const districtTree = getDistrictTree("3204101");
if (districtTree) {
  console.log(`\n  ${districtTree.district.name}:`);
  for (const v of districtTree.villages) {
    console.log(`    └─ ${v.name} (kode pos: ${v.postal_code ?? "N/A"})`);
  }
}

// ── Stats (v1.1.0) ─────────────────────────────────────────────
console.log("\n=== Stats ===");

// Summary
const summary = getSummary();
console.log("  Ringkasan Indonesia:");
console.log(`    Provinsi       : ${summary.provinces}`);
console.log(`    Kabupaten/Kota : ${summary.regencies}`);
console.log(`    Kecamatan      : ${summary.districts}`);
console.log(`    Desa/Kelurahan : ${summary.villages}`);

// Per-provinsi
console.log(`\n  Jawa Barat (BPS: 32):`);
console.log(`    Kabupaten/Kota : ${getRegencyCountByProvince("32")}`);
console.log(`    Kecamatan      : ${getDistrictCountByProvince("32")}`);
console.log(`    Desa/Kelurahan : ${getVillageCountByProvince("32")}`);

// Per-kabupaten
console.log(`\n  KAB. BANDUNG (BPS: 3204):`);
console.log(`    Kecamatan      : ${getDistrictCountByRegency("3204")}`);
console.log(`    Desa/Kelurahan : ${getVillageCountByRegency("3204")}`);

// Per-kecamatan
console.log(`\n  NAGREG (BPS: 3204101):`);
console.log(`    Desa/Kelurahan : ${getVillageCountByDistrict("3204101")}`);
