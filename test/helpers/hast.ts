import { selectAll } from "@expressive-code/core/hast";

import type { Element } from "@expressive-code/core/hast";

export const titleSelector = "figcaption > .title";
export const iconSelector = "figcaption > .title > svg";

export function selectSingle(
  selector: string,
  tree?: Parameters<typeof selectAll>[1],
  space?: Parameters<typeof selectAll>[2],
): Element {
  const nodes = selectAll(selector, tree, space);

  if (nodes.length !== 1) {
    throw new Error(`Expected selector "${selector}" to match a single element, but got ${nodes.length} matches`);
  }

  return nodes[0]!;
}

export function getProperty(
  node: Element,
  propertyName: string,
): boolean | number | string | null | undefined | Array<string | number> {
  const property = node.properties[propertyName];

  return property;
}
