import * as fs from "node:fs/promises";
import { EOL } from "node:os";
import * as path from "node:path";

const typeFileName = "icon-names.ts";
const typeFileLocation = "./src";
const iconSource = "./src/icons";

const iconFiles = await fs.readdir(iconSource);

const iconNames = iconFiles
  .filter((fileName) => fileName.startsWith("file_type_"))
  .filter((fileName) => !fileName.startsWith("file_type_light_"))
  .map((fileName) => fileName.replace(/^file_type_/, "").replace(/\.svg$/, ""));

const iconEnum = iconNames.map((fileName) => `  | "${fileName}"`);

await fs.writeFile(
  path.join(typeFileLocation, typeFileName),
  `export type IconName =
${iconEnum.join("\n")};
`,
  "utf8",
);

await fs.writeFile("./icons.txt", iconNames.join(EOL), "utf8");
