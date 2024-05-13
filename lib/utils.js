"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSON = exports.readTsconfig = exports.readFilesFromTsconfig = exports.getConfigFileName = exports.createDefaultFormatCodeSettings = void 0;
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const TSCONFIG_CACHE = {};
function createDefaultFormatCodeSettings() {
    return {
        baseIndentSize: 0,
        indentSize: 4,
        tabSize: 4,
        indentStyle: ts.IndentStyle.Smart,
        newLineCharacter: "\r\n",
        convertTabsToSpaces: true,
        insertSpaceAfterCommaDelimiter: true,
        insertSpaceAfterSemicolonInForStatements: true,
        insertSpaceBeforeAndAfterBinaryOperators: true,
        insertSpaceAfterConstructor: false,
        insertSpaceAfterKeywordsInControlFlowStatements: true,
        insertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
        insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
        insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
        insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
        insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: false,
        insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces: false,
        insertSpaceAfterTypeAssertion: false,
        insertSpaceBeforeFunctionParenthesis: false,
        placeOpenBraceOnNewLineForFunctions: false,
        placeOpenBraceOnNewLineForControlBlocks: false,
        insertSpaceBeforeTypeAnnotation: false,
    };
}
exports.createDefaultFormatCodeSettings = createDefaultFormatCodeSettings;
function getConfigFileName(baseDir, configFileName) {
    let configFilePath = path.resolve(baseDir, configFileName);
    if (fs.existsSync(configFilePath)) {
        return configFilePath;
    }
    if (baseDir.length === path.dirname(baseDir).length) {
        return null;
    }
    return getConfigFileName(path.resolve(baseDir, "../"), configFileName);
}
exports.getConfigFileName = getConfigFileName;
function readFilesFromTsconfig(configPath) {
    return readTsconfig(configPath).fileNames;
}
exports.readFilesFromTsconfig = readFilesFromTsconfig;
function readTsconfig(configPath) {
    if (TSCONFIG_CACHE[configPath]) {
        return TSCONFIG_CACHE[configPath];
    }
    // for `extends` support. It supported from TypeScript 2.1.1.
    // `& { readFile(path: string): string; }` is backword compat for TypeScript compiler 2.0.3 support.
    const host = {
        useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
        readDirectory: ts.sys.readDirectory,
        fileExists: path => fs.existsSync(path),
        readFile: (path) => fs.readFileSync(path, "utf-8"),
    };
    let rootConfig = parseJSON(fs.readFileSync(configPath, "utf-8"));
    let parsed = ts.parseJsonConfigFileContent(rootConfig, host, path.dirname(configPath));
    if (parsed.errors && parsed.errors.length !== 0) {
        throw new Error(parsed.errors.map(e => e.messageText).join("\n"));
    }
    TSCONFIG_CACHE[configPath] = parsed;
    return parsed;
}
exports.readTsconfig = readTsconfig;
function parseJSON(jsonText) {
    let result = ts.parseConfigFileTextToJson("tmp.json", jsonText);
    if (result.error) {
        throw new Error("JSON parse error");
    }
    return result.config;
}
exports.parseJSON = parseJSON;
//# sourceMappingURL=utils.js.map