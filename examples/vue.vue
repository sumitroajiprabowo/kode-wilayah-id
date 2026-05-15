<!--
  Vue 3 Example — Cascading Dropdown Wilayah Indonesia

  Install:
    npm install kode-wilayah-id

  Usage:
    <script setup>
    import WilayahDropdown from './WilayahDropdown.vue';
    </script>
    <template>
      <WilayahDropdown />
    </template>
-->

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  getProvinces,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
  searchByName,
} from "kode-wilayah-id";

// Selected codes
const selectedProvince = ref("");
const selectedRegency = ref("");
const selectedDistrict = ref("");
const selectedVillage = ref("");
const searchQuery = ref("");

// Data
const provinces = getProvinces();

const regencies = computed(() =>
  selectedProvince.value
    ? getRegenciesByBpsProvinceCode(selectedProvince.value)
    : []
);

const districts = computed(() =>
  selectedRegency.value
    ? getDistrictsByBpsRegencyCode(selectedRegency.value)
    : []
);

const villages = computed(() =>
  selectedDistrict.value
    ? getVillagesByBpsDistrictCode(selectedDistrict.value)
    : []
);

const searchResults = computed(() =>
  searchQuery.value.length >= 3 ? searchByName(searchQuery.value) : []
);

// Handlers
function onProvinceChange() {
  selectedRegency.value = "";
  selectedDistrict.value = "";
  selectedVillage.value = "";
}

function onRegencyChange() {
  selectedDistrict.value = "";
  selectedVillage.value = "";
}

function onDistrictChange() {
  selectedVillage.value = "";
}

// Selected village detail
const villageDetail = computed(() =>
  villages.value.find((v) => v.bps_code === selectedVillage.value)
);
</script>

<template>
  <div>
    <h2>Pilih Wilayah</h2>

    <!-- Provinsi -->
    <select v-model="selectedProvince" @change="onProvinceChange">
      <option value="">-- Pilih Provinsi --</option>
      <option
        v-for="p in provinces"
        :key="p.bps_code"
        :value="p.bps_code"
      >
        {{ p.name }}
      </option>
    </select>

    <!-- Kabupaten/Kota -->
    <select
      v-model="selectedRegency"
      :disabled="!selectedProvince"
      @change="onRegencyChange"
    >
      <option value="">-- Pilih Kabupaten/Kota --</option>
      <option
        v-for="r in regencies"
        :key="r.bps_code"
        :value="r.bps_code"
      >
        {{ r.name }}
      </option>
    </select>

    <!-- Kecamatan -->
    <select
      v-model="selectedDistrict"
      :disabled="!selectedRegency"
      @change="onDistrictChange"
    >
      <option value="">-- Pilih Kecamatan --</option>
      <option
        v-for="d in districts"
        :key="d.bps_code"
        :value="d.bps_code"
      >
        {{ d.name }}
      </option>
    </select>

    <!-- Desa/Kelurahan -->
    <select v-model="selectedVillage" :disabled="!selectedDistrict">
      <option value="">-- Pilih Desa/Kelurahan --</option>
      <option
        v-for="v in villages"
        :key="v.bps_code"
        :value="v.bps_code"
      >
        {{ v.name }} {{ v.postal_code ? `(${v.postal_code})` : "" }}
      </option>
    </select>

    <!-- Hasil -->
    <div v-if="villageDetail" style="margin-top: 16px">
      <h3>Wilayah Terpilih</h3>
      <pre>{{ JSON.stringify(villageDetail, null, 2) }}</pre>
    </div>

    <!-- Search -->
    <h2>Cari Wilayah</h2>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Ketik nama wilayah (min. 3 karakter)..."
    />
    <ul>
      <li v-for="r in searchResults.slice(0, 20)" :key="`${r.level}-${r.data.bps_code}`">
        <strong>[{{ r.level }}]</strong> {{ r.data.name }}
        <small> — BPS: {{ r.data.bps_code }}</small>
      </li>
    </ul>
  </div>
</template>
