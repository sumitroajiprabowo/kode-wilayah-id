/**
 * Angular Example — Cascading Dropdown Wilayah Indonesia
 *
 * Install:
 *   npm install kode-wilayah-id
 *
 * Usage:
 *   // app.module.ts
 *   import { WilayahModule } from './wilayah/wilayah.module';
 *
 *   // template
 *   <app-wilayah-dropdown />
 */

// ============================================================
// wilayah.service.ts — Service
// ============================================================

import { Injectable } from "@angular/core";
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
  type Province,
  type Regency,
  type District,
  type Village,
  type SearchResult,
  type SearchOptions,
  type VillageHierarchy,
} from "kode-wilayah-id";

@Injectable({ providedIn: "root" })
export class WilayahService {
  getProvinces(): Province[] {
    return getProvinces();
  }

  getRegencies(bpsProvinceCode: string): Regency[] {
    return getRegenciesByBpsProvinceCode(bpsProvinceCode);
  }

  getDistricts(bpsRegencyCode: string): District[] {
    return getDistrictsByBpsRegencyCode(bpsRegencyCode);
  }

  getVillages(bpsDistrictCode: string): Village[] {
    return getVillagesByBpsDistrictCode(bpsDistrictCode);
  }

  getVillagesByPostal(postalCode: string): Village[] {
    return getVillagesByPostalCode(postalCode);
  }

  search(query: string, options?: SearchOptions): SearchResult[] {
    return searchByName(query, options);
  }

  getHierarchy(bpsVillageCode: string): VillageHierarchy | undefined {
    return getVillageWithParents(bpsVillageCode);
  }

  getSummary() {
    return getSummary();
  }
}

// ============================================================
// wilayah-dropdown.component.ts — Component
// ============================================================

import { Component } from "@angular/core";
// import { WilayahService } from "./wilayah.service";

@Component({
  selector: "app-wilayah-dropdown",
  template: `
    <h2>Pilih Wilayah</h2>

    <!-- Provinsi -->
    <select [(ngModel)]="selectedProvince" (ngModelChange)="onProvinceChange()">
      <option value="">-- Pilih Provinsi --</option>
      <option *ngFor="let p of provinces" [value]="p.bps_code">
        {{ p.name }}
      </option>
    </select>

    <!-- Kabupaten/Kota -->
    <select [(ngModel)]="selectedRegency" [disabled]="!selectedProvince"
            (ngModelChange)="onRegencyChange()">
      <option value="">-- Pilih Kabupaten/Kota --</option>
      <option *ngFor="let r of regencies" [value]="r.bps_code">
        {{ r.name }}
      </option>
    </select>

    <!-- Kecamatan -->
    <select [(ngModel)]="selectedDistrict" [disabled]="!selectedRegency"
            (ngModelChange)="onDistrictChange()">
      <option value="">-- Pilih Kecamatan --</option>
      <option *ngFor="let d of districts" [value]="d.bps_code">
        {{ d.name }}
      </option>
    </select>

    <!-- Desa/Kelurahan -->
    <select [(ngModel)]="selectedVillage" [disabled]="!selectedDistrict">
      <option value="">-- Pilih Desa/Kelurahan --</option>
      <option *ngFor="let v of villages" [value]="v.bps_code">
        {{ v.name }} {{ v.postal_code ? '(' + v.postal_code + ')' : '' }}
      </option>
    </select>

    <!-- Hasil -->
    <div *ngIf="villageDetail" style="margin-top: 16px">
      <h3>Wilayah Terpilih</h3>
      <pre>{{ villageDetail | json }}</pre>
    </div>
  `,
})
export class WilayahDropdownComponent {
  provinces: Province[] = [];
  regencies: Regency[] = [];
  districts: District[] = [];
  villages: Village[] = [];

  selectedProvince = "";
  selectedRegency = "";
  selectedDistrict = "";
  selectedVillage = "";

  constructor(private wilayahService: WilayahService) {
    this.provinces = this.wilayahService.getProvinces();
  }

  get villageDetail(): Village | undefined {
    return this.villages.find((v) => v.bps_code === this.selectedVillage);
  }

  onProvinceChange(): void {
    this.regencies = this.selectedProvince
      ? this.wilayahService.getRegencies(this.selectedProvince)
      : [];
    this.selectedRegency = "";
    this.onRegencyChange();
  }

  onRegencyChange(): void {
    this.districts = this.selectedRegency
      ? this.wilayahService.getDistricts(this.selectedRegency)
      : [];
    this.selectedDistrict = "";
    this.onDistrictChange();
  }

  onDistrictChange(): void {
    this.villages = this.selectedDistrict
      ? this.wilayahService.getVillages(this.selectedDistrict)
      : [];
    this.selectedVillage = "";
  }
}
