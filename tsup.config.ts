import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/types.ts",
    "src/provinces.ts",
    "src/regencies.ts",
    "src/districts.ts",
    "src/villages.ts",
    "src/search.ts",
    "src/hierarchy.ts",
    "src/stats.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
});
