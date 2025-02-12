import fs from "node:fs/promises";

import { getClassNames } from "@expressive-code/core/hast";

import type { Element } from "@expressive-code/core/hast";

export async function fileExists(file: string): Promise<boolean> {
  const fileUrl = new URL(file, import.meta.url);

  try {
    await fs.access(fileUrl);

    return true;
  } catch {
    return false;
  }
}

export function isTerminal(element: Element) {
  const classes = getClassNames(element);

  return classes.includes("is-terminal");
}
