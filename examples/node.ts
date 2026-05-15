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
