/** Provinsi */
export interface Province {
	bps_code: string;
	kemendagri_code: string | null;
	name: string;
}

/** Kabupaten/Kota */
export interface Regency {
	bps_code: string;
	kemendagri_code: string | null;
	bps_province_code: string;
	kemendagri_province_code: string | null;
	name: string;
}

/** Kecamatan */
export interface District {
	bps_code: string;
	kemendagri_code: string | null;
	bps_regency_code: string;
	kemendagri_regency_code: string | null;
	name: string;
}

/** Desa/Kelurahan */
export interface Village {
	bps_code: string;
	kemendagri_code: string | null;
	bps_district_code: string;
	kemendagri_district_code: string | null;
	name: string;
	postal_code: string | null;
}

/** Hasil pencarian — discriminated union by level */
export type SearchResult =
	| { level: "province"; data: Province }
	| { level: "regency"; data: Regency }
	| { level: "district"; data: District }
	| { level: "village"; data: Village };
