#!/usr/bin/env npx tsx
/**
 * Scrape BPS bridging API for all administrative levels.
 *
 * Output: scripts/bridging_provinsi.json, bridging_kabupaten.json,
 *         bridging_kecamatan.json, bridging_desa.json
 *
 * Usage: npx tsx scripts/scrape-bridging.ts
 */

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://sig.bps.go.id/rest-bridging/getwilayah";
const PERIODE = "2025s1";
const DELAY_MS = 50;
const MAX_RETRIES = 3;
const TIMEOUT_MS = 30_000;

/** 4 new Papua provinces not in BPS bridging */
const SKIP_PROVINCES = new Set(["92", "95", "96", "97"]);

interface BridgingRecord {
	kode_bps: string;
	kode_dagri: string;
	nama_bps: string;
}

interface ApiResponse {
	kode_bps: string;
	nama_bps: string;
	kode_dagri: string;
	nama_dagri: string;
}

function stripDots(code: string): string {
	return code.replaceAll(".", "");
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(
	url: string,
	timeoutMs: number,
): Promise<Response> {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(url, { signal: controller.signal });
	} finally {
		clearTimeout(id);
	}
}

async function fetchBridging(
	level: string,
	parent: string,
): Promise<ApiResponse[]> {
	const url = `${BASE_URL}?level=${level}&parent=${parent}&periode=${PERIODE}`;
	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			const resp = await fetchWithTimeout(url, TIMEOUT_MS);
			return (await resp.json()) as ApiResponse[];
		} catch (e) {
			console.error(
				`  RETRY ${attempt}/${MAX_RETRIES} for ${url}: ${e instanceof Error ? e.message : e}`,
			);
			if (attempt === MAX_RETRIES) {
				console.error(`  FAILED ${url}`);
				return [];
			}
			await sleep(2 ** attempt * 1000);
		}
	}
	return [];
}

function saveBridging(filename: string, data: BridgingRecord[]): void {
	const path = join(__dirname, filename);
	writeFileSync(path, JSON.stringify(data, null, undefined));
	console.log(`Saved ${data.length} records to ${path}`);
}

function loadIfExists(filename: string): BridgingRecord[] | null {
	const path = join(__dirname, filename);
	if (existsSync(path) && statSync(path).size > 10) {
		console.log(`Loading existing ${path}`);
		return JSON.parse(readFileSync(path, "utf-8")) as BridgingRecord[];
	}
	return null;
}

async function scrapeProvinsi(): Promise<BridgingRecord[]> {
	console.log("Fetching provinsi bridging...");
	const data = await fetchBridging("provinsi", "0");
	const result = data.map((item) => ({
		kode_bps: item.kode_bps,
		kode_dagri: stripDots(item.kode_dagri),
		nama_bps: item.nama_bps,
	}));
	console.log(`  Got ${result.length} provinsi`);
	return result;
}

async function scrapeKabupaten(
	provinsi: BridgingRecord[],
): Promise<BridgingRecord[]> {
	console.log("Fetching kabupaten bridging...");
	const result: BridgingRecord[] = [];
	for (let i = 0; i < provinsi.length; i++) {
		const prov = provinsi[i]!;
		if (SKIP_PROVINCES.has(prov.kode_bps)) continue;
		const data = await fetchBridging("kabupaten", prov.kode_bps);
		for (const item of data) {
			result.push({
				kode_bps: item.kode_bps,
				kode_dagri: stripDots(item.kode_dagri),
				nama_bps: item.nama_bps,
			});
		}
		await sleep(DELAY_MS);
		if ((i + 1) % 10 === 0)
			console.log(
				`  Progress: ${i + 1}/${provinsi.length} provinsi, ${result.length} kabupaten so far`,
			);
	}
	console.log(`  Got ${result.length} kabupaten`);
	return result;
}

async function scrapeKecamatan(
	kabupaten: BridgingRecord[],
): Promise<BridgingRecord[]> {
	console.log("Fetching kecamatan bridging...");
	const result: BridgingRecord[] = [];
	for (let i = 0; i < kabupaten.length; i++) {
		const kab = kabupaten[i]!;
		const data = await fetchBridging("kecamatan", kab.kode_bps);
		for (const item of data) {
			result.push({
				kode_bps: item.kode_bps,
				kode_dagri: stripDots(item.kode_dagri),
				nama_bps: item.nama_bps,
			});
		}
		await sleep(DELAY_MS);
		if ((i + 1) % 50 === 0)
			console.log(
				`  Progress: ${i + 1}/${kabupaten.length} kabupaten, ${result.length} kecamatan so far`,
			);
	}
	console.log(`  Got ${result.length} kecamatan`);
	return result;
}

async function scrapeDesa(
	kecamatan: BridgingRecord[],
): Promise<BridgingRecord[]> {
	console.log("Fetching desa bridging...");
	const result: BridgingRecord[] = [];
	const errors: string[] = [];
	for (let i = 0; i < kecamatan.length; i++) {
		const kec = kecamatan[i]!;
		const data = await fetchBridging("desa", kec.kode_bps);
		if (data.length === 0) errors.push(kec.kode_bps);
		for (const item of data) {
			result.push({
				kode_bps: item.kode_bps,
				kode_dagri: stripDots(item.kode_dagri),
				nama_bps: item.nama_bps,
			});
		}
		await sleep(DELAY_MS);
		if ((i + 1) % 200 === 0)
			console.log(
				`  Progress: ${i + 1}/${kecamatan.length} kecamatan, ${result.length} desa so far`,
			);
	}
	console.log(`  Got ${result.length} desa`);
	if (errors.length > 0)
		console.error(`  ERRORS for kecamatan: ${JSON.stringify(errors)}`);
	return result;
}

async function main(): Promise<void> {
	let provinsi =
		loadIfExists("bridging_provinsi.json") ?? (await scrapeProvinsi());
	if (!loadIfExists("bridging_provinsi.json"))
		saveBridging("bridging_provinsi.json", provinsi);

	let kabupaten =
		loadIfExists("bridging_kabupaten.json") ??
		(await scrapeKabupaten(provinsi));
	if (!loadIfExists("bridging_kabupaten.json"))
		saveBridging("bridging_kabupaten.json", kabupaten);

	let kecamatan =
		loadIfExists("bridging_kecamatan.json") ??
		(await scrapeKecamatan(kabupaten));
	if (!loadIfExists("bridging_kecamatan.json"))
		saveBridging("bridging_kecamatan.json", kecamatan);

	let desa =
		loadIfExists("bridging_desa.json") ?? (await scrapeDesa(kecamatan));
	if (!loadIfExists("bridging_desa.json"))
		saveBridging("bridging_desa.json", desa);

	console.log("\n=== Summary ===");
	console.log(`Provinsi:  ${provinsi.length}`);
	console.log(`Kabupaten: ${kabupaten.length}`);
	console.log(`Kecamatan: ${kecamatan.length}`);
	console.log(`Desa:      ${desa.length}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
