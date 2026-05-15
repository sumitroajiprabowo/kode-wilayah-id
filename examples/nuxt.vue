<!--
  Nuxt 3 Example — Server API + Composable + Page

  Install:
    npm install kode-wilayah-id

  Files:
    server/api/wilayah.ts     — Server API route
    composables/useWilayah.ts — Composable
    pages/wilayah.vue         — Page component
-->

<!-- ============================================================ -->
<!-- server/api/wilayah.ts — Nitro Server Route                   -->
<!-- ============================================================ -->

<!--
import {
  getProvinces,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
  getVillagesByPostalCode,
  searchByName,
  // v1.1.0
  getVillageWithParents,
  getSummary,
  type SearchOptions,
} from "kode-wilayah-id";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  if (query.q) {
    return searchByName(query.q as string);
  }

  if (query.postal_code) {
    return getVillagesByPostalCode(query.postal_code as string);
  }

  switch (query.level) {
    case "provinces":
      return getProvinces();
    case "regencies":
      return getRegenciesByBpsProvinceCode(query.parent as string);
    case "districts":
      return getDistrictsByBpsRegencyCode(query.parent as string);
    case "villages":
      return getVillagesByBpsDistrictCode(query.parent as string);
    default:
      throw createError({ statusCode: 400, message: "Invalid level" });
  }
});
-->

<!-- ============================================================ -->
<!-- composables/useWilayah.ts — Composable                       -->
<!-- ============================================================ -->

<!--
import {
  getProvinces,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
} from "kode-wilayah-id";

export function useWilayah() {
  const provinceCode = ref("");
  const regencyCode = ref("");
  const districtCode = ref("");
  const villageCode = ref("");

  const provinces = computed(() => getProvinces());
  const regencies = computed(() =>
    provinceCode.value ? getRegenciesByBpsProvinceCode(provinceCode.value) : []
  );
  const districts = computed(() =>
    regencyCode.value ? getDistrictsByBpsRegencyCode(regencyCode.value) : []
  );
  const villages = computed(() =>
    districtCode.value ? getVillagesByBpsDistrictCode(districtCode.value) : []
  );

  function reset(from: "province" | "regency" | "district") {
    if (from === "province") regencyCode.value = "";
    if (from === "province" || from === "regency") districtCode.value = "";
    villageCode.value = "";
  }

  return {
    provinceCode, regencyCode, districtCode, villageCode,
    provinces, regencies, districts, villages,
    reset,
  };
}
-->

<!-- ============================================================ -->
<!-- pages/wilayah.vue — Page Component                           -->
<!-- ============================================================ -->

<script setup lang="ts">
import {
  getProvinces,
  getRegenciesByBpsProvinceCode,
  getDistrictsByBpsRegencyCode,
  getVillagesByBpsDistrictCode,
} from "kode-wilayah-id";

const provinceCode = ref("");
const regencyCode = ref("");
const districtCode = ref("");
const villageCode = ref("");

const provinces = getProvinces();

const regencies = computed(() =>
  provinceCode.value ? getRegenciesByBpsProvinceCode(provinceCode.value) : []
);
const districts = computed(() =>
  regencyCode.value ? getDistrictsByBpsRegencyCode(regencyCode.value) : []
);
const villages = computed(() =>
  districtCode.value ? getVillagesByBpsDistrictCode(districtCode.value) : []
);

const selectedVillage = computed(() =>
  villages.value.find((v) => v.bps_code === villageCode.value)
);

function onProvinceChange() {
  regencyCode.value = "";
  districtCode.value = "";
  villageCode.value = "";
}
function onRegencyChange() {
  districtCode.value = "";
  villageCode.value = "";
}
function onDistrictChange() {
  villageCode.value = "";
}
</script>

<template>
  <div>
    <Head>
      <title>Wilayah Indonesia — Nuxt 3</title>
    </Head>

    <h1>Pilih Wilayah</h1>

    <select v-model="provinceCode" @change="onProvinceChange">
      <option value="">-- Provinsi --</option>
      <option v-for="p in provinces" :key="p.bps_code" :value="p.bps_code">
        {{ p.name }}
      </option>
    </select>

    <select v-model="regencyCode" :disabled="!provinceCode" @change="onRegencyChange">
      <option value="">-- Kabupaten/Kota --</option>
      <option v-for="r in regencies" :key="r.bps_code" :value="r.bps_code">
        {{ r.name }}
      </option>
    </select>

    <select v-model="districtCode" :disabled="!regencyCode" @change="onDistrictChange">
      <option value="">-- Kecamatan --</option>
      <option v-for="d in districts" :key="d.bps_code" :value="d.bps_code">
        {{ d.name }}
      </option>
    </select>

    <select v-model="villageCode" :disabled="!districtCode">
      <option value="">-- Desa/Kelurahan --</option>
      <option v-for="v in villages" :key="v.bps_code" :value="v.bps_code">
        {{ v.name }} {{ v.postal_code ? `(${v.postal_code})` : "" }}
      </option>
    </select>

    <pre v-if="selectedVillage">{{ JSON.stringify(selectedVillage, null, 2) }}</pre>
  </div>
</template>
