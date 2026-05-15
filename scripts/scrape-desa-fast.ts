#!/usr/bin/env npx tsx
/**
 * Fast parallel scraper for desa-level BPS bridging data.
 *
 * Uses Promise.all with concurrency limit to scrape ~7,219 kecamatan endpoints.
 * Loads kecamatan codes from bridging_kecamatan.json (already scraped).
 *
 * Output: scripts/bridging_desa.json
 *
 * Usage: npx tsx scripts/scrape-desa-fast.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://sig.bps.go.id/rest-bridging/getwilayah";
const PERIODE = "2025s1";
const MAX_RETRIES = 3;
const TIMEOUT_MS = 30_000;
const WORKERS = 20;

interface BridgingRecord {
	kode_bps: string;
	kode_dagri: string;
	nama_bps: string;
}

interface ApiResponse {
	kode_bps: string;
	nama_bps: string;
	kode_dagri: string;
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

async function fetchDesa(kecCode: string): Promise<BridgingRecord[]> {
	const url = `${BASE_URL}?level=desa&parent=${kecCode}&periode=${PERIODE}`;
	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			const resp = await fetchWithTimeout(url, TIMEOUT_MS);
			const data = (await resp.json()) as ApiResponse[];
			return data.map((item) => ({
				kode_bps: item.kode_bps,
				kode_dagri: item.kode_dagri.replaceAll(".", ""),
				nama_bps: item.nama_bps,
			}));
		} catch (e) {
			if (attempt < MAX_RETRIES) {
				await sleep(2 ** attempt * 1000);
			} else {
				console.error(
					`  FAILED ${kecCode}: ${e instanceof Error ? e.message : e}`,
				);
				return [];
			}
		}
	}
	return [];
}

async function runPool<T, R>(
	items: T[],
	concurrency: number,
	fn: (item: T) => Promise<R>,
	onProgress?: (done: number, total: number) => void,
): Promise<R[]> {
	const results: R[] = [];
	let idx = 0;
	let done = 0;

	async function worker(): Promise<void> {
		while (idx < items.length) {
			const currentIdx = idx++;
			const item = items[currentIdx]!;
			const result = await fn(item);
			results.push(result);
			done++;
			onProgress?.(done, items.length);
		}
	}

	const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
	await Promise.all(workers);
	return results;
}

async function main(): Promise<void> {
	const kecPath = join(__dirname, "bridging_kecamatan.json");
	const kecamatan = JSON.parse(readFileSync(kecPath, "utf-8")) as BridgingRecord[];
	const kecCodes = kecamatan.map((k) => k.kode_bps);
	const total = kecCodes.length;

	console.log(`Scraping desa for ${total} kecamatan with ${WORKERS} workers...`);

	const errors: string[] = [];
	const allDesa: BridgingRecord[] = [];

	const results = await runPool(
		kecCodes,
		WORKERS,
		async (code) => {
			const desa = await fetchDesa(code);
			if (desa.length === 0) errors.push(code);
			return desa;
		},
		(done, total) => {
			if (done % 500 === 0 || done === total) {
				console.log(`  Progress: ${done}/${total} kecamatan`);
			}
		},
	);

	for (const batch of results) {
		allDesa.push(...batch);
	}

	allDesa.sort((a, b) => a.kode_bps.localeCompare(b.kode_bps));

	const outPath = join(__dirname, "bridging_desa.json");
	writeFileSync(outPath, JSON.stringify(allDesa));
	console.log(`\nSaved ${allDesa.length} desa to ${outPath}`);

	if (errors.length > 0) {
		console.error(`ERRORS for ${errors.length} kecamatan: ${JSON.stringify(errors)}`);

		console.log(`\nRetrying ${errors.length} failed kecamatan...`);
		const retryResults = await runPool(errors, 5, fetchDesa);
		const recovered: BridgingRecord[] = [];
		for (const batch of retryResults) {
			recovered.push(...batch);
		}
		if (recovered.length > 0) {
			allDesa.push(...recovered);
			allDesa.sort((a, b) => a.kode_bps.localeCompare(b.kode_bps));
			writeFileSync(outPath, JSON.stringify(allDesa));
			console.log(`Updated: ${allDesa.length} total desa after retry`);
		}
	}

	console.log(`\n=== Final: ${allDesa.length} desa records ===`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
