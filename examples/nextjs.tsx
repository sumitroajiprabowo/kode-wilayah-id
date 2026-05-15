/**
 * Next.js Example — API Route + Server Component + Client Component
 *
 * Install:
 *   npm install kode-wilayah-id
 *
 * Files:
 *   app/api/wilayah/route.ts       — API route
 *   app/wilayah/page.tsx           — Server component
 *   app/wilayah/client-dropdown.tsx — Client component
 */

// ============================================================
// app/api/wilayah/route.ts — API Route Handler
// ============================================================

import { type NextRequest, NextResponse } from "next/server";
import {
  getProvinces,
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
  getSummary,
  type SearchOptions,
} from "kode-wilayah-id";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const parent = searchParams.get("parent");
  const search = searchParams.get("q");
  const postalCode = searchParams.get("postal_code");

  // Search by name (v1.1.0: with options)
  if (search) {
    const options: SearchOptions = {};
    const levelFilter = searchParams.get("search_level");
    const limitParam = searchParams.get("limit");
    if (levelFilter) options.level = levelFilter as SearchOptions["level"];
    if (limitParam) options.limit = Number(limitParam);
    return NextResponse.json(searchByName(search, options));
  }

  // Search by postal code
  if (postalCode) {
    return NextResponse.json(getVillagesByPostalCode(postalCode));
  }

  // Hierarchy — reverse lookup (v1.1.0)
  const hierarchy = searchParams.get("hierarchy");
  const hierarchyCode = searchParams.get("code");
  if (hierarchy && hierarchyCode) {
    switch (hierarchy) {
      case "village":
        return NextResponse.json(getVillageWithParents(hierarchyCode) ?? { error: "Not found" });
      case "district":
        return NextResponse.json(getDistrictWithParents(hierarchyCode) ?? { error: "Not found" });
      case "regency":
        return NextResponse.json(getRegencyWithParent(hierarchyCode) ?? { error: "Not found" });
      case "province-tree":
        return NextResponse.json(getProvinceTree(hierarchyCode) ?? { error: "Not found" });
    }
  }

  // Stats (v1.1.0)
  if (level === "summary") {
    return NextResponse.json(getSummary());
  }

  // Cascading data
  switch (level) {
    case "provinces":
      return NextResponse.json(getProvinces());
    case "regencies":
      return NextResponse.json(
        parent ? getRegenciesByBpsProvinceCode(parent) : []
      );
    case "districts":
      return NextResponse.json(
        parent ? getDistrictsByBpsRegencyCode(parent) : []
      );
    case "villages":
      return NextResponse.json(
        parent ? getVillagesByBpsDistrictCode(parent) : []
      );
    default:
      return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }
}

// ============================================================
// app/wilayah/page.tsx — Server Component
// ============================================================

import {
  getProvinces as getProvincesServer,
  getProvinceByBpsCode,
  getRegenciesByBpsProvinceCode as getRegenciesServer,
  // v1.1.0
  getSummary as getSummaryServer,
} from "kode-wilayah-id";

/** Server Component — data fetched at build/request time */
export default function WilayahPage() {
  const provinces = getProvincesServer();
  const jakarta = getProvinceByBpsCode("31");
  const jakartaRegencies = jakarta
    ? getRegenciesServer(jakarta.bps_code)
    : [];
  const summary = getSummaryServer();

  return (
    <main>
      <h1>Wilayah Indonesia</h1>
      <p>Total provinsi: {provinces.length}</p>

      {/* Stats (v1.1.0) */}
      <section>
        <h2>Statistik</h2>
        <p>Provinsi: {summary.provinces} | Kabupaten/Kota: {summary.regencies} | Kecamatan: {summary.districts} | Desa: {summary.villages}</p>
      </section>

      {jakarta && (
        <section>
          <h2>{jakarta.name}</h2>
          <p>BPS: {jakarta.bps_code} | Kemendagri: {jakarta.kemendagri_code}</p>
          <ul>
            {jakartaRegencies.map((r) => (
              <li key={r.bps_code}>{r.name}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Client-side interactive dropdown */}
      {/* <ClientDropdown provinces={provinces} /> */}
    </main>
  );
}

// ============================================================
// app/wilayah/client-dropdown.tsx — Client Component
// ============================================================

// "use client";
//
// import { useState } from "react";
// import type { Province } from "kode-wilayah-id";
//
// export function ClientDropdown({ provinces }: { provinces: Province[] }) {
//   const [selected, setSelected] = useState("");
//
//   async function loadRegencies(provinceCode: string) {
//     const res = await fetch(
//       `/api/wilayah?level=regencies&parent=${provinceCode}`
//     );
//     return res.json();
//   }
//
//   return (
//     <select
//       value={selected}
//       onChange={(e) => {
//         setSelected(e.target.value);
//         loadRegencies(e.target.value).then(console.log);
//       }}
//     >
//       <option value="">-- Pilih Provinsi --</option>
//       {provinces.map((p) => (
//         <option key={p.bps_code} value={p.bps_code}>
//           {p.name}
//         </option>
//       ))}
//     </select>
//   );
// }
