/**
 * Most of this is copied from Expressive Code with some modifications to
 * make testing this plugin easier or because it wasn't used.
 */
import * as fs from "node:fs";
import * as path from "node:path";

import { ExpressiveCodeEngine } from "@expressive-code/core";
import { toHtml } from "@expressive-code/core/hast";
import { html } from "common-tags";

import type {
  ExpressiveCodeEngineConfig,
  ExpressiveCodePlugin,
  ExpressiveCodeTheme,
  StyleVariant,
} from "@expressive-code/core";
import type { Element } from "@expressive-code/core/hast";

type TestFixture = {
  code: string;
  language?: string | undefined;
  meta?: string | undefined;
  themes?: ExpressiveCodeTheme[] | undefined;
  plugins: ExpressiveCodePlugin[];
  engineOptions?: Partial<ExpressiveCodeEngineConfig> | undefined;
  blockValidationFn?: BlockValidationFn | undefined;
};

type BlockValidationFn = ({
  renderedGroupAst,
  baseStyles,
  styleVariants,
}: {
  renderedGroupAst: Element;
  baseStyles: string;
  styleVariants: StyleVariant[];
}) => void;

export function buildFixture(fixtureContents: TestFixture) {
  const fixture: TestFixture = {
    ...fixtureContents,
  };

  return fixture;
}

export async function renderAndOutputHtmlSnapshot({
  testName,
  testBaseDir,
  fixture,
}: {
  testName: string;
  testBaseDir: string;
  fixture: TestFixture;
}) {
  const renderResults = await renderFixture(fixture);

  const documentParts = serializeRenderResultsToDocumentParts(renderResults);

  outputHtmlSnapshot({
    testName,
    testBaseDir,
    documentParts,
  });

  const { blockValidationFn, ...rest } = renderResults;

  if (!blockValidationFn) {
    return;
  }

  blockValidationFn({ ...rest });
}

async function renderFixture({
  code,
  language = "js",
  meta = "",
  themes,
  plugins,
  engineOptions,
  blockValidationFn,
}: TestFixture) {
  const engine = new ExpressiveCodeEngine({
    themes,
    plugins,
    ...engineOptions,
  });
  const baseStyles = await engine.getBaseStyles();
  const themeStyles = await engine.getThemeStyles();
  const jsModules = await engine.getJsModules();
  const { renderedGroupAst, styles } = await engine.render({
    code,
    language,
    meta,
  });

  return {
    renderedGroupAst,
    baseStyles,
    themeStyles,
    jsModules,
    styleVariants: engine.styleVariants,
    styles,
    styleOverrides: engine.styleOverrides,
    blockValidationFn,
  };
}

type DocumentParts = {
  head?: string;
  body: string;
};

function serializeRenderResultsToDocumentParts(
  renderResults: Awaited<ReturnType<typeof renderFixture>>,
): DocumentParts {
  // Output all fixtures to HTML
  const { baseStyles, themeStyles, jsModules, styleVariants, styles, renderedGroupAst } = renderResults;

  // Render the group AST to HTML
  const groupHtml = toHtml(renderedGroupAst);

  // Repeat the group HTML for each style variant, adding the theme name as a data attribute to each wrapper
  const variantGroupHtml = styleVariants.map(({ theme }, index) => {
    const foreground = theme.type === "dark" ? "#fff" : "#000";
    const background = theme.type === "dark" ? "#248" : "#eee";
    const heading = `Theme: ${theme?.name ?? 'Missing "name"'}`;

    return html`
      <section style="color:${foreground};background:${background}">
        <h2>${heading}</h2>
        ${groupHtml.replace(/<div (.*?)>/, `<div data-theme="${theme?.name ?? index}" $1>`)}
      </section>
    `;
  });

  // Wrap everything into a fixture section
  const blockStyles = [...styles];
  const renderedBlock = html`
    <style>
      ${themeStyles}
      ${blockStyles}
    </style>
    ${variantGroupHtml}
  `;

  return {
    head: html`
      <style>
        ${baseStyles}
      </style>
    `,
    body: html`
      ${jsModules.map(
        (moduleCode) => html`
          <script type="module">
            ${moduleCode};
          </script>
        `,
      )}
      ${renderedBlock}
    `,
  };
}

function outputHtmlSnapshot({
  testName,
  testBaseDir,
  documentParts,
}: {
  testName: string;
  testBaseDir: string;
  documentParts: DocumentParts;
}) {
  const snapshotBasePath = path.join(testBaseDir, "__snapshots__");
  const snapshotFileName = `${testName.replace(/[<>:"/\\|?*.]/g, "").toLowerCase()}.html`;
  const snapshotFilePath = path.join(snapshotBasePath, "__actual__", snapshotFileName);

  // Write the snapshot to an HTML file for easy inspection of failed tests
  const htmlOutput = html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${testName}</title>
        <style>
          body {
            margin: 0;
            background: #248;
            color: #fff;
            font-family: sans-serif;
          }
          body > header {
            padding: 0.5rem 1rem;
            background: hsl(230 40% 20%);
            border-bottom: 1px solid hsl(230 40% 35%);
          }
          body > div > section {
            padding: 1.25rem 1rem;
          }
          h1 {
            font-size: 1.5rem;
            padding: 0;
          }
          h2 {
            text-align: center;
            font-size: 0.8rem;
            padding: 0;
            margin: 0 0 1rem 0;
            opacity: 0.6;
          }
        </style>
        ${documentParts.head || ""}
      </head>
      <body>
        <header><h1>Test: ${testName}</h1></header>
        <div>${documentParts.body}</div>
      </body>
    </html>
  `;

  fs.mkdirSync(path.dirname(snapshotFilePath), { recursive: true });
  fs.writeFileSync(snapshotFilePath, htmlOutput, "utf8");
}
