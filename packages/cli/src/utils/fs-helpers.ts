import fs from "fs";
import path from "path";

export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeFile(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

export function findProjectRoot(): string {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    // Check for a Next.js project with package.json
    if (
      fs.existsSync(path.join(dir, "package.json")) &&
      (fs.existsSync(path.join(dir, "src", "app")) ||
       fs.existsSync(path.join(dir, "src", "nextpanel")))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}
