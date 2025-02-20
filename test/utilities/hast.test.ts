import { h } from "@expressive-code/core/hast";
import { describe, expect, test } from "vitest";

import { isTerminal } from "../../src/utilities/hast.js";

describe("isTerminal", async () => {
  test("returns false when there is no match", () => {
    const element = h("div", {
      className: ["terminal"],
    });

    const result = isTerminal(element);

    expect(result).toBe(false);
  });

  test("returns true when there is a match", () => {
    const element = h("div", {
      className: ["is-terminal"],
    });

    const result = isTerminal(element);

    expect(result).toBe(true);
  });
});
