import fs from "node:fs";
import path from "node:path";

export function readPrTemplate(cwd: string, templatePath: string): string | null {
  const candidates: string[] = [];

  if (templatePath && templatePath.trim()) {
    candidates.push(templatePath.trim());
  } else {
    candidates.push(".github/pull_request_template.md");
    candidates.push(".github/PULL_REQUEST_TEMPLATE.md");
    candidates.push("pull_request_template.md");
  }

  for (const rel of candidates) {
    const abs = path.resolve(cwd, rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      return fs.readFileSync(abs, "utf8");
    }
  }

  return null;
}

