/**
 * PENARCHY STUDIO — Product Importer
 * ============================================================================
 * Migrates a real product export into the catalog. Supports JSON and CSV
 * input plus a local image folder. Safe to rerun — dedupes on a stable
 * `sourceId` (falls back to SKU) so the same listing is never imported twice.
 *
 * USAGE
 *   npx tsx scripts/import-products.ts --input ./import/products.json
 *   npx tsx scripts/import-products.ts --input ./import/products.csv
 *
 * EXPECTED JSON SHAPE (array of objects):
 *   [{
 *     "sourceId": "etsy-1234567890",       // REQUIRED — stable external id
 *     "name": "...",
 *     "sku": "...",
 *     "categorySlug": "damascus-pen",       // must match an existing category
 *     "description": "...",
 *     "shortDescription": "...",
 *     "price": 175.00,
 *     "compareAtPrice": 350.00,
 *     "materials": "...",
 *     "dimensions": "...",
 *     "weight": "...",
 *     "images": ["./import/images/1234567890/1.jpg", "..."],
 *     "quantity": 5,
 *     "sourceUrl": "https://www.etsy.com/listing/..."
 *   }]
 *
 * EXPECTED CSV SHAPE: same fields as flat columns; `images` is a
 * semicolon-separated list of local file paths.
 *
 * WHAT THIS SCRIPT DOES NOT DO
 *   - It does not scrape Etsy directly (not reachable from network-restricted
 *     environments, and against Etsy's terms). Export your data manually via
 *     Etsy Shop Manager first.
 *   - It does not invent missing fields. Rows missing required facts
 *     (name, sku, categorySlug, price) are skipped and reported, not guessed.
 * ============================================================================
 */

import fs from "node:fs";
import path from "node:path";

interface ImportRow {
  sourceId?: string;
  name?: string;
  sku?: string;
  categorySlug?: string;
  description?: string;
  shortDescription?: string;
  price?: number | string;
  compareAtPrice?: number | string;
  materials?: string;
  dimensions?: string;
  weight?: string;
  images?: string[] | string;
  quantity?: number | string;
  sourceUrl?: string;
}

interface ImportSummary {
  total: number;
  created: number;
  skippedDuplicate: number;
  skippedInvalid: number;
  errors: { row: number; reason: string }[];
}

function parseArgs() {
  const args = process.argv.slice(2);
  const inputIdx = args.indexOf("--input");
  if (inputIdx === -1 || !args[inputIdx + 1]) {
    console.error("Usage: tsx scripts/import-products.ts --input <file.json|file.csv>");
    process.exit(1);
  }
  return { inputPath: args[inputIdx + 1] };
}

function loadRows(inputPath: string): ImportRow[] {
  const raw = fs.readFileSync(inputPath, "utf-8");
  const ext = path.extname(inputPath).toLowerCase();

  if (ext === ".json") {
    return JSON.parse(raw) as ImportRow[];
  }

  if (ext === ".csv") {
    const [headerLine, ...lines] = raw.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(",").map((h) => h.trim());
    return lines.map((line) => {
      const cells = line.split(",");
      const row: Record<string, string> = {};
      headers.forEach((h, i) => (row[h] = cells[i]?.trim() ?? ""));
      return {
        ...row,
        images: row.images ? row.images.split(";") : [],
      } as ImportRow;
    });
  }

  throw new Error(`Unsupported file type: ${ext}. Use .json or .csv.`);
}

function validateRow(row: ImportRow): string | null {
  if (!row.sourceId && !row.sku) return "Missing both sourceId and sku";
  if (!row.name) return "Missing name";
  if (!row.categorySlug) return "Missing categorySlug";
  if (row.price === undefined || row.price === "") return "Missing price";
  return null;
}

async function run() {
  const { inputPath } = parseArgs();
  const rows = loadRows(inputPath);

  const summary: ImportSummary = {
    total: rows.length,
    created: 0,
    skippedDuplicate: 0,
    skippedInvalid: 0,
    errors: [],
  };

  // TODO(prisma): once the database is reachable, replace this Set with:
  //   const existing = await prisma.product.findMany({ select: { sourceId: true, sku: true } });
  const existingSourceIds = new Set<string>();
  const existingSkus = new Set<string>();

  for (const [index, row] of rows.entries()) {
    const invalidReason = validateRow(row);
    if (invalidReason) {
      summary.skippedInvalid++;
      summary.errors.push({ row: index, reason: invalidReason });
      continue;
    }

    const dedupeKey = row.sourceId ?? row.sku!;
    if (existingSourceIds.has(dedupeKey) || existingSkus.has(row.sku ?? "")) {
      summary.skippedDuplicate++;
      continue;
    }

    // TODO(prisma): create the product, its category relation, images
    // (uploaded to the media store — see lib/media), and inventory record:
    //
    //   await prisma.product.create({
    //     data: {
    //       sourceId: row.sourceId,
    //       name: row.name,
    //       slug: slugify(row.name),
    //       sku: row.sku ?? generateSku(row.name),
    //       category: { connect: { slug: row.categorySlug } },
    //       description: row.description ?? "",
    //       price: Number(row.price),
    //       compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : undefined,
    //       materials: row.materials,
    //       dimensions: row.dimensions,
    //       weight: row.weight,
    //       status: "DRAFT", // review before publishing
    //       inventory: { create: { quantity: Number(row.quantity ?? 0) } },
    //       images: { create: (Array.isArray(row.images) ? row.images : []).map((url, i) => ({
    //         media: { connect: { id: await uploadToMedia(url) } },
    //         sortOrder: i,
    //       })) },
    //     },
    //   });

    existingSourceIds.add(dedupeKey);
    if (row.sku) existingSkus.add(row.sku);
    summary.created++;
  }

  console.log("\n=== Import Summary ===");
  console.log(`Total rows:         ${summary.total}`);
  console.log(`Created (dry-run):  ${summary.created}`);
  console.log(`Skipped (dupe):     ${summary.skippedDuplicate}`);
  console.log(`Skipped (invalid):  ${summary.skippedInvalid}`);
  if (summary.errors.length) {
    console.log("\nErrors:");
    summary.errors.forEach((e) => console.log(`  Row ${e.row}: ${e.reason}`));
  }
  console.log(
    "\nNOTE: this ran in dry-run mode (no Prisma calls) because this script is\n" +
      "meant to run against a real, reachable Postgres instance. Uncomment the\n" +
      "prisma.product.create block above once DATABASE_URL points at a live DB."
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
