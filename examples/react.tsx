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

import { useMemo, useState } from "react";
import {
  getProvinces,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
  searchByName,
  // v1.1.0
  getVillageWithParents,
  getSummary,
  type Province,
  type Regency,
  type District,
  type Village,
  type SearchOptions,
} from "kode-wilayah-id";

/** Cascading Dropdown — Provinsi → Kabupaten → Kecamatan → Desa */
export function WilayahDropdown() {
  const [province, setProvince] = useState<Province | null>(null);
  const [regency, setRegency] = useState<Regency | null>(null);
  const [district, setDistrict] = useState<District | null>(null);
  const [village, setVillage] = useState<Village | null>(null);

  const provinces = useMemo(() => getProvinces(), []);
  const regencies = useMemo(
    () => (province ? getRegenciesByBpsProvinceCode(province.bps_code) : []),
    [province],
  );
  const districts = useMemo(
    () => (regency ? getDistrictsByBpsRegencyCode(regency.bps_code) : []),
    [regency],
  );
  const villages = useMemo(
    () => (district ? getVillagesByBpsDistrictCode(district.bps_code) : []),
    [district],
  );

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

      {/* Hasil + Hierarchy */}
      {village && (
        <div style={{ marginTop: 16 }}>
          <h3>Wilayah Terpilih</h3>
          <pre>{JSON.stringify(village, null, 2)}</pre>

          {/* Reverse lookup — dari desa, dapat info lengkap sampai provinsi */}
          {(() => {
            const hierarchy = getVillageWithParents(village.bps_code);
            if (!hierarchy) return null;
            return (
              <div>
                <h4>Hierarchy (Reverse Lookup)</h4>
                <p>Kecamatan: {hierarchy.district.name}</p>
                <p>Kabupaten: {hierarchy.regency.name}</p>
                <p>Provinsi: {hierarchy.province.name}</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

/** Search Component — with search options (v1.1.0) */
export function WilayahSearch() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<SearchOptions["level"]>(undefined);

  // Pakai limit untuk autocomplete — hemat performa
  const results = query.length >= 3
    ? searchByName(query, { level, limit: 20 })
    : [];

  return (
    <div>
      <h2>Cari Wilayah</h2>
      <input
        type="text"
        placeholder="Ketik nama wilayah (min. 3 karakter)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select
        value={level ?? ""}
        onChange={(e) =>
          setLevel((e.target.value || undefined) as SearchOptions["level"])
        }
      >
        <option value="">Semua level</option>
        <option value="province">Provinsi</option>
        <option value="regency">Kabupaten/Kota</option>
        <option value="district">Kecamatan</option>
        <option value="village">Desa/Kelurahan</option>
      </select>
      <ul>
        {results.map((r) => (
          <li key={`${r.level}-${r.data.bps_code}`}>
            <strong>[{r.level}]</strong> {r.data.name}
            <small> — BPS: {r.data.bps_code}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Stats Summary Component (v1.1.0) */
export function WilayahStats() {
  const summary = useMemo(() => getSummary(), []);

  return (
    <div>
      <h2>Statistik Wilayah Indonesia</h2>
      <table>
        <tbody>
          <tr><td>Provinsi</td><td>{summary.provinces}</td></tr>
          <tr><td>Kabupaten/Kota</td><td>{summary.regencies}</td></tr>
          <tr><td>Kecamatan</td><td>{summary.districts}</td></tr>
          <tr><td>Desa/Kelurahan</td><td>{summary.villages}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
