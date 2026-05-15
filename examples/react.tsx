/**
 * React Example — Cascading Dropdown Wilayah Indonesia
 *
 * Install:
 *   npm install kode-wilayah-id
 *
 * Usage:
 *   import { WilayahDropdown } from './WilayahDropdown';
 *   <WilayahDropdown onChange={(v) => console.log(v)} />
 */

import { useState } from "react";
import {
  getProvinces,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
  searchByName,
  type Province,
  type Regency,
  type District,
  type Village,
} from "kode-wilayah-id";

/** Cascading Dropdown — Provinsi → Kabupaten → Kecamatan → Desa */
export function WilayahDropdown() {
  const [province, setProvince] = useState<Province | null>(null);
  const [regency, setRegency] = useState<Regency | null>(null);
  const [district, setDistrict] = useState<District | null>(null);
  const [village, setVillage] = useState<Village | null>(null);

  const provinces = getProvinces();
  const regencies = province
    ? getRegenciesByBpsProvinceCode(province.bps_code)
    : [];
  const districts = regency
    ? getDistrictsByBpsRegencyCode(regency.bps_code)
    : [];
  const villages = district
    ? getVillagesByBpsDistrictCode(district.bps_code)
    : [];

  return (
    <div>
      <h2>Pilih Wilayah</h2>

      {/* Provinsi */}
      <select
        value={province?.bps_code ?? ""}
        onChange={(e) => {
          const p = provinces.find((p) => p.bps_code === e.target.value) ?? null;
          setProvince(p);
          setRegency(null);
          setDistrict(null);
          setVillage(null);
        }}
      >
        <option value="">-- Pilih Provinsi --</option>
        {provinces.map((p) => (
          <option key={p.bps_code} value={p.bps_code}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Kabupaten/Kota */}
      <select
        value={regency?.bps_code ?? ""}
        disabled={!province}
        onChange={(e) => {
          const r = regencies.find((r) => r.bps_code === e.target.value) ?? null;
          setRegency(r);
          setDistrict(null);
          setVillage(null);
        }}
      >
        <option value="">-- Pilih Kabupaten/Kota --</option>
        {regencies.map((r) => (
          <option key={r.bps_code} value={r.bps_code}>
            {r.name}
          </option>
        ))}
      </select>

      {/* Kecamatan */}
      <select
        value={district?.bps_code ?? ""}
        disabled={!regency}
        onChange={(e) => {
          const d = districts.find((d) => d.bps_code === e.target.value) ?? null;
          setDistrict(d);
          setVillage(null);
        }}
      >
        <option value="">-- Pilih Kecamatan --</option>
        {districts.map((d) => (
          <option key={d.bps_code} value={d.bps_code}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Desa/Kelurahan */}
      <select
        value={village?.bps_code ?? ""}
        disabled={!district}
        onChange={(e) => {
          const v = villages.find((v) => v.bps_code === e.target.value) ?? null;
          setVillage(v);
        }}
      >
        <option value="">-- Pilih Desa/Kelurahan --</option>
        {villages.map((v) => (
          <option key={v.bps_code} value={v.bps_code}>
            {v.name} {v.postal_code ? `(${v.postal_code})` : ""}
          </option>
        ))}
      </select>

      {/* Hasil */}
      {village && (
        <div style={{ marginTop: 16 }}>
          <h3>Wilayah Terpilih</h3>
          <pre>{JSON.stringify(village, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

/** Search Component */
export function WilayahSearch() {
  const [query, setQuery] = useState("");
  const results = query.length >= 3 ? searchByName(query) : [];

  return (
    <div>
      <h2>Cari Wilayah</h2>
      <input
        type="text"
        placeholder="Ketik nama wilayah (min. 3 karakter)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.slice(0, 20).map((r) => (
          <li key={`${r.level}-${r.data.bps_code}`}>
            <strong>[{r.level}]</strong> {r.data.name}
            <small> — BPS: {r.data.bps_code}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
