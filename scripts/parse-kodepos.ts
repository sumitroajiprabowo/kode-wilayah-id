#!/usr/bin/env npx tsx
/**
 * Parse Kemendagri kodepos SQL dump into JSON.
 *
 * Downloads SQL from cahyadsn/wilayah_kodepos and extracts
 * { kemendagri_code: postal_code } mapping.
 *
 * Output: scripts/kodepos_map.json
 *
 * Usage: npx tsx scripts/parse-kodepos.ts
 */

import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SQL_URL =
	"https://raw.githubusercontent.com/cahyadsn/wilayah_kodepos/main/db/wilayah_kodepos.sql";

async function downloadSql(): Promise<string> {
	const cachePath = join(tmpdir(), "wilayah_kodepos.sql");
	if (existsSync(cachePath) && statSync(cachePath).size > 1000) {
		console.log(`Using cached SQL from ${cachePath}`);
		return readFileSync(cachePath, "utf-8");
	}

	console.log(`Downloading from ${SQL_URL}...`);
	const resp = await fetch(SQL_URL);
	const content = await resp.text();
	writeFileSync(cachePath, content);
	console.log(`Downloaded ${content.length} bytes`);
	return content;
}

function parseSql(sql: string): Record<string, string> {
	/**
	 * SQL format: ('PP.RR.DD.SSSS', 'XXXXX')
	 * Strip dots: 'PP.RR.DD.SSSS' -> 'PPRRDDSSSS'
	 */
	const pattern = /\('(\d{2}\.\d{2}\.\d{2}\.\d{4})',\s*'(\d{5})'\)/g;
	const kodeposMap: Record<string, string> = {};

	let match: RegExpExecArray | null;
	while ((match = pattern.exec(sql)) !== null) {
		const kemendagriCode = match[1]!.replaceAll(".", "");
		const postalCode = match[2]!;
		kodeposMap[kemendagriCode] = postalCode;
	}

	return kodeposMap;
}

async function main(): Promise<void> {
	const sql = await downloadSql();
	const kodeposMap = parseSql(sql);

	const outputPath = join(__dirname, "kodepos_map.json");
	writeFileSync(outputPath, JSON.stringify(kodeposMap));

	const uniquePostals = new Set(Object.values(kodeposMap));
	console.log(`Parsed ${Object.keys(kodeposMap).length} kodepos entries`);
	console.log(`Unique postal codes: ${uniquePostals.size}`);
	console.log(`Saved to ${outputPath}`);

	const items = Object.entries(kodeposMap).slice(0, 5);
	for (const [code, postal] of items) {
		console.log(`  ${code} -> ${postal}`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
