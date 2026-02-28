import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const PUBLIC_DIR = path.join(ROOT, "public");
const REPORT_PATH = path.join(ROOT, "scripts", "image-optimization-report.json");
const SHOULD_WRITE = process.argv.includes("--write");

const SUPPORTED_RASTER = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const FILE_REFERENCE_REGEX =
  /\/[A-Za-z0-9 _&().,\-]+?\.(?:jpg|jpeg|png|webp|gif|svg|mp4|mov)/gi;

const walkDir = async (dirPath, matcher) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(entryPath, matcher)));
      continue;
    }
    if (matcher(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
};

const formatMb = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const optimizeBuffer = async (filePath, ext) => {
  const image = sharp(filePath, { animated: false }).rotate().resize({
    width: 1920,
    withoutEnlargement: true,
    fit: "inside",
  });

  if (ext === ".jpg" || ext === ".jpeg") {
    return image.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toBuffer();
  }
  if (ext === ".png") {
    return image.png({ compressionLevel: 9, quality: 80, palette: true }).toBuffer();
  }
  if (ext === ".webp") {
    return image.webp({ quality: 78 }).toBuffer();
  }
  return null;
};

const main = async () => {
  const sourceFiles = await walkDir(
    SRC_DIR,
    (name) => name.endsWith(".ts") || name.endsWith(".tsx") || name.endsWith(".js") || name.endsWith(".jsx")
  );

  const referencedAssets = new Set();
  for (const sourceFile of sourceFiles) {
    const content = await fs.readFile(sourceFile, "utf8");
    const matches = content.match(FILE_REFERENCE_REGEX) ?? [];
    for (const match of matches) {
      referencedAssets.add(match);
    }
  }

  const existingReferencedAssets = [];
  for (const asset of referencedAssets) {
    const absolutePath = path.join(PUBLIC_DIR, asset.replace(/^\//, ""));
    try {
      const stat = await fs.stat(absolutePath);
      if (stat.isFile()) {
        existingReferencedAssets.push({ asset, absolutePath, sizeBefore: stat.size });
      }
    } catch {
      // ignore unresolved references
    }
  }

  let processedCount = 0;
  let skippedCount = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;
  const details = [];

  for (const entry of existingReferencedAssets) {
    const ext = path.extname(entry.absolutePath).toLowerCase();
    bytesBefore += entry.sizeBefore;

    if (!SUPPORTED_RASTER.has(ext)) {
      skippedCount += 1;
      bytesAfter += entry.sizeBefore;
      details.push({
        asset: entry.asset,
        status: "skipped",
        reason: `unsupported format (${ext})`,
        before: entry.sizeBefore,
        after: entry.sizeBefore,
      });
      continue;
    }

    const optimizedBuffer = await optimizeBuffer(entry.absolutePath, ext);
    if (!optimizedBuffer) {
      skippedCount += 1;
      bytesAfter += entry.sizeBefore;
      details.push({
        asset: entry.asset,
        status: "skipped",
        reason: "optimizer did not return output",
        before: entry.sizeBefore,
        after: entry.sizeBefore,
      });
      continue;
    }

    const optimizedSize = optimizedBuffer.length;
    const shouldReplace = optimizedSize < entry.sizeBefore;
    const finalSize = shouldReplace ? optimizedSize : entry.sizeBefore;
    bytesAfter += finalSize;

    if (SHOULD_WRITE && shouldReplace) {
      await fs.writeFile(entry.absolutePath, optimizedBuffer);
    }

    processedCount += 1;
    details.push({
      asset: entry.asset,
      status: shouldReplace ? (SHOULD_WRITE ? "optimized" : "would_optimize") : "unchanged",
      before: entry.sizeBefore,
      after: finalSize,
      saved: Math.max(entry.sizeBefore - finalSize, 0),
    });
  }

  const summary = {
    mode: SHOULD_WRITE ? "write" : "dry-run",
    referencedAssetCount: existingReferencedAssets.length,
    processedCount,
    skippedCount,
    bytesBefore,
    bytesAfter,
    bytesSaved: Math.max(bytesBefore - bytesAfter, 0),
    reductionPercent:
      bytesBefore > 0 ? Number((((bytesBefore - bytesAfter) / bytesBefore) * 100).toFixed(2)) : 0,
  };

  await fs.writeFile(REPORT_PATH, JSON.stringify({ summary, details }, null, 2), "utf8");

  console.log(`Mode: ${summary.mode}`);
  console.log(`Referenced assets: ${summary.referencedAssetCount}`);
  console.log(`Processed images: ${summary.processedCount}`);
  console.log(`Skipped assets: ${summary.skippedCount}`);
  console.log(`Before: ${formatMb(summary.bytesBefore)}`);
  console.log(`After: ${formatMb(summary.bytesAfter)}`);
  console.log(`Saved: ${formatMb(summary.bytesSaved)} (${summary.reductionPercent}%)`);
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
};

main().catch((error) => {
  console.error("Image optimization script failed:", error);
  process.exit(1);
});
