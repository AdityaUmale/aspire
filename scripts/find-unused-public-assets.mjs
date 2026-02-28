import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const PUBLIC_DIR = path.join(ROOT, "public");
const ARCHIVE_DIR = path.join(PUBLIC_DIR, "_archive-unused");
const REPORT_PATH = path.join(ROOT, "scripts", "unused-public-assets-report.json");

const SHOULD_ARCHIVE = process.argv.includes("--archive");
const SOURCE_FILE_REGEX = /\.(ts|tsx|js|jsx|css|mdx?)$/;
const ASSET_REFERENCE_REGEX =
  /\/[A-Za-z0-9 _&().,\-]+?\.(?:jpg|jpeg|png|webp|gif|svg|mp4|mov|ico)/gi;

const walk = async (dirPath) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    files.push(fullPath);
  }
  return files;
};

const toPublicAssetPath = (absolutePath) =>
  `/${path.relative(PUBLIC_DIR, absolutePath).split(path.sep).join("/")}`;

const main = async () => {
  const sourceFiles = (await walk(SRC_DIR)).filter((filePath) => SOURCE_FILE_REGEX.test(filePath));
  const referencedAssets = new Set();

  for (const filePath of sourceFiles) {
    const content = await fs.readFile(filePath, "utf8");
    const matches = content.match(ASSET_REFERENCE_REGEX) ?? [];
    matches.forEach((match) => referencedAssets.add(match));
  }

  const publicFiles = await walk(PUBLIC_DIR);
  const candidateAssets = publicFiles.filter(
    (filePath) => !filePath.includes(`${path.sep}_archive-unused${path.sep}`)
  );

  const unusedAssets = [];
  for (const filePath of candidateAssets) {
    const assetPath = toPublicAssetPath(filePath);
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) {
      continue;
    }
    if (!referencedAssets.has(assetPath)) {
      unusedAssets.push({
        assetPath,
        absolutePath: filePath,
        sizeBytes: stat.size,
      });
    }
  }

  unusedAssets.sort((a, b) => b.sizeBytes - a.sizeBytes);

  if (SHOULD_ARCHIVE && unusedAssets.length > 0) {
    await fs.mkdir(ARCHIVE_DIR, { recursive: true });
    for (const asset of unusedAssets) {
      const relativePath = asset.assetPath.replace(/^\//, "");
      const destination = path.join(ARCHIVE_DIR, relativePath);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.rename(asset.absolutePath, destination);
    }
  }

  const totalUnusedSize = unusedAssets.reduce((sum, asset) => sum + asset.sizeBytes, 0);
  const report = {
    mode: SHOULD_ARCHIVE ? "archive" : "dry-run",
    totalPublicFiles: candidateAssets.length,
    referencedCount: referencedAssets.size,
    unusedCount: unusedAssets.length,
    unusedSizeBytes: totalUnusedSize,
    unusedAssets: unusedAssets.map((asset) => ({
      assetPath: asset.assetPath,
      sizeBytes: asset.sizeBytes,
    })),
  };

  await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");

  console.log(`Mode: ${report.mode}`);
  console.log(`Unused assets: ${report.unusedCount}`);
  console.log(`Unused size: ${(report.unusedSizeBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
  if (SHOULD_ARCHIVE) {
    console.log(`Archived to: ${path.relative(ROOT, ARCHIVE_DIR)}`);
  }
};

main().catch((error) => {
  console.error("Unused asset scan failed:", error);
  process.exit(1);
});
