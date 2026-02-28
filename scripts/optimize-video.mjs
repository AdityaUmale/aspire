import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const SHOULD_WRITE = process.argv.includes("--write");

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

const run = (command, args) =>
  new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: "inherit" });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
    proc.on("error", reject);
  });

const main = async () => {
  const publicFiles = await walk(PUBLIC_DIR);
  const movFiles = publicFiles.filter((filePath) => filePath.toLowerCase().endsWith(".mov"));

  if (movFiles.length === 0) {
    console.log("No .mov files found.");
    return;
  }

  for (const movFile of movFiles) {
    const mp4File = movFile.replace(/\.mov$/i, ".mp4");
    console.log(`Found source video: ${path.relative(ROOT, movFile)}`);
    console.log(`Target output: ${path.relative(ROOT, mp4File)}`);

    if (!SHOULD_WRITE) {
      continue;
    }

    await run("ffmpeg", [
      "-y",
      "-i",
      movFile,
      "-vcodec",
      "libx264",
      "-crf",
      "23",
      "-preset",
      "medium",
      "-acodec",
      "aac",
      "-movflags",
      "+faststart",
      mp4File,
    ]);
  }

  if (!SHOULD_WRITE) {
    console.log("Dry run complete. Re-run with --write to transcode videos.");
  }
};

main().catch((error) => {
  console.error("Video optimization failed:", error);
  process.exit(1);
});
