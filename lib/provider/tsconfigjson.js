"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFormatCodeOptions = void 0;
const ts = require("typescript");
const path = require("path");
const utils_1 = require("../utils");
function makeFormatCodeOptions(fileName, opts, formatSettings) {
    let baseDir = opts.baseDir ? path.resolve(opts.baseDir) : path.dirname(path.resolve(fileName));
    let configFileName;
    if (opts.tsconfigFile && path.isAbsolute(opts.tsconfigFile)) {
        configFileName = opts.tsconfigFile;
    }
    else {
        configFileName = (0, utils_1.getConfigFileName)(baseDir, opts.tsconfigFile || "tsconfig.json");
    }
    if (!configFileName) {
        return formatSettings;
    }
    if (opts.verbose) {
        console.log(`read ${configFileName} for ${fileName}`);
    }
    let parsed = (0, utils_1.readTsconfig)(configFileName);
    if (parsed.options.newLine === ts.NewLineKind.CarriageReturnLineFeed) {
        formatSettings.newLineCharacter = "\r\n";
    }
    else if (parsed.options.newLine === ts.NewLineKind.LineFeed) {
        formatSettings.newLineCharacter = "\n";
    }
    return formatSettings;
}
exports.makeFormatCodeOptions = makeFormatCodeOptions;
//# sourceMappingURL=tsconfigjson.js.map