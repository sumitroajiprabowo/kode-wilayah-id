<!--
  Svelte 5 Example — Cascading Dropdown Wilayah Indonesia

  Install:
    npm install kode-wilayah-id

  Usage:
    <script>
    import WilayahDropdown from './WilayahDropdown.svelte';
    </script>
    <WilayahDropdown />
-->

<script lang="ts">
  import {
    getProvinces,
    getRegenciesByBpsProvinceCode,
    getDistrictsByBpsRegencyCode,
    getVillagesByBpsDistrictCode,
    searchByName,
    // v1.1.0
    getVillageWithParents,
    getSummary,
    type SearchOptions,
  } from "kode-wilayah-id";

  let selectedProvince = $state("");
  let selectedRegency = $state("");
  let selectedDistrict = $state("");
  let selectedVillage = $state("");
  let searchQuery = $state("");
  let searchLevel = $state<SearchOptions["level"]>(undefined);

  const provinces = getProvinces();
  const summary = getSummary();

  let regencies = $derived(
    selectedProvince ? getRegenciesByBpsProvinceCode(selectedProvince) : []
  );

  let districts = $derived(
    selectedRegency ? getDistrictsByBpsRegencyCode(selectedRegency) : []
  );

  let villages = $derived(
    selectedDistrict ? getVillagesByBpsDistrictCode(selectedDistrict) : []
  );

  let villageDetail = $derived(
    villages.find((v) => v.bps_code === selectedVillage)
  );

  let searchResults = $derived(
    searchQuery.length >= 3
      ? searchByName(searchQuery, { level: searchLevel, limit: 20 })
      : []
  );

  // Hierarchy — reverse lookup ketika desa dipilih
  let villageHierarchy = $derived(
    selectedVillage ? getVillageWithParents(selectedVillage) : null
  );

  function onProvinceChange() {
    selectedRegency = "";
    selectedDistrict = "";
    selectedVillage = "";
  }

  function onRegencyChange() {
    selectedDistrict = "";
    selectedVillage = "";
  }

  function onDistrictChange() {
    selectedVillage = "";
  }
</script>

<div>
  <h2>Pilih Wilayah</h2>

  <!-- Provinsi -->
  <select bind:value={selectedProvince} onchange={onProvinceChange}>
    <option value="">-- Pilih Provinsi --</option>
    {#each provinces as p (p.bps_code)}
      <option value={p.bps_code}>{p.name}</option>
    {/each}
  </select>

  <!-- Kabupaten/Kota -->
  <select bind:value={selectedRegency} disabled={!selectedProvince} onchange={onRegencyChange}>
    <option value="">-- Pilih Kabupaten/Kota --</option>
    {#each regencies as r (r.bps_code)}
      <option value={r.bps_code}>{r.name}</option>
    {/each}
  </select>

  <!-- Kecamatan -->
  <select bind:value={selectedDistrict} disabled={!selectedRegency} onchange={onDistrictChange}>
    <option value="">-- Pilih Kecamatan --</option>
    {#each districts as d (d.bps_code)}
      <option value={d.bps_code}>{d.name}</option>
    {/each}
  </select>

  <!-- Desa/Kelurahan -->
  <select bind:value={selectedVillage} disabled={!selectedDistrict}>
    <option value="">-- Pilih Desa/Kelurahan --</option>
    {#each villages as v (v.bps_code)}
      <option value={v.bps_code}>
        {v.name} {v.postal_code ? `(${v.postal_code})` : ""}
      </option>
    {/each}
  </select>

  <!-- Hasil + Hierarchy -->
  {#if villageDetail}
    <div style="margin-top: 16px">
      <h3>Wilayah Terpilih</h3>
      <pre>{JSON.stringify(villageDetail, null, 2)}</pre>

      {#if villageHierarchy}
        <h4>Hierarchy (Reverse Lookup)</h4>
        <p>Kecamatan: {villageHierarchy.district.name}</p>
        <p>Kabupaten: {villageHierarchy.regency.name}</p>
        <p>Provinsi: {villageHierarchy.province.name}</p>
      {/if}
    </div>
  {/if}

  <!-- Search -->
  <h2>Cari Wilayah</h2>
  <input
    type="text"
    placeholder="Ketik nama wilayah (min. 3 karakter)..."
    bind:value={searchQuery}
  />
  <select bind:value={searchLevel}>
    <option value={undefined}>Semua level</option>
    <option value="province">Provinsi</option>
    <option value="regency">Kabupaten/Kota</option>
    <option value="district">Kecamatan</option>
    <option value="village">Desa/Kelurahan</option>
  </select>
  <ul>
    {#each searchResults.slice(0, 20) as r (`${r.level}-${r.data.bps_code}`)}
      <li>
        <strong>[{r.level}]</strong> {r.data.name}
        <small> — BPS: {r.data.bps_code}</small>
      </li>
    {/each}
  </ul>

  <!-- Stats -->
  <h2>Statistik</h2>
  <p>Provinsi: {summary.provinces} | Kabupaten/Kota: {summary.regencies} | Kecamatan: {summary.districts} | Desa: {summary.villages}</p>
</div>
