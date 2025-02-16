import * as fs from "node:fs/promises";

export async function fileExists(file: string): Promise<boolean> {
  const fileUrl = new URL(file, import.meta.url);

  try {
    await fs.access(fileUrl);

    return true;
  } catch {
    return false;
  }
}
