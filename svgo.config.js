import * as path from "node:path";

export default {
  plugins: [
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeXMLNS",
    "removeEditorsNSData",
    "cleanupAttrs",
    "mergeStyles",
    "inlineStyles",
    "minifyStyles",
    "convertStyleToAttrs",
    "cleanupIds",
    {
      name: "prefixIds",
      params: {
        delim: "_",
        prefix(_node, info) {
          const fileExtension = path.extname(info.path);
          const fileName = path.basename(info.path, fileExtension);
          const iconName = fileName.replace(/file_type_/, "");

          return `ec-file-icon_${iconName}`;
        },
      },
    },
    "removeRasterImages",
    "removeUselessDefs",
    "convertColors",
    "removeUnknownsAndDefaults",
    "removeNonInheritableGroupAttrs",
    "removeUselessStrokeAndFill",
    "removeViewBox",
    "cleanupEnableBackground",
    "removeHiddenElems",
    "removeEmptyText",
    "convertShapeToPath",
    "moveElemsAttrsToGroup",
    "moveGroupAttrsToElems",
    "collapseGroups",
    "convertEllipseToCircle",
    "removeEmptyAttrs",
    "removeEmptyContainers",
    "mergePaths",
    "removeUnusedNS",
    "sortAttrs",
    "sortDefsChildren",
    "removeTitle",
    "removeDesc",
  ],
};
