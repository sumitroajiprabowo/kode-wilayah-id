/** Provinsi — id 2 digit (contoh: "32") */
export interface Province {
	id: string;
	name: string;
}

/** Kabupaten/Kota — id 4 digit (contoh: "3204") */
export interface Regency {
	id: string;
	province_id: string;
	name: string;
}

/** Kecamatan — id 7 digit (contoh: "1101010") */
export interface District {
	id: string;
	regency_id: string;
	name: string;
}

/** Desa/Kelurahan — id 10 digit (contoh: "1101010001") */
export interface Village {
	id: string;
	district_id: string;
	name: string;
}

/** Hasil pencarian — discriminated union by level */
export type SearchResult =
	| { level: "province"; data: Province }
	| { level: "regency"; data: Regency }
	| { level: "district"; data: District }
	| { level: "village"; data: Village };
