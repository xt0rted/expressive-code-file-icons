import { getClassNames } from "@expressive-code/core/hast";

import type { Element } from "@expressive-code/core/hast";

export function isTerminal(element: Element) {
  const classes = getClassNames(element);

  return classes.includes("is-terminal");
}
