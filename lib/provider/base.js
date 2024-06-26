"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFormatCodeOptions = void 0;
const ts = require("typescript");
const path = require("path");
const fs = require("fs");
const utils_1 = require("../utils");
function makeFormatCodeOptions(fileName, opts, formatSettings) {
    let baseDir = opts.baseDir ? path.resolve(opts.baseDir) : path.dirname(path.resolve(fileName));
    let configFileName;
    if (opts.tsfmtFile && path.isAbsolute(opts.tsfmtFile)) {
        configFileName = opts.tsfmtFile;
    }
    else {
        configFileName = (0, utils_1.getConfigFileName)(baseDir, opts.tsfmtFile || "tsfmt.json");
    }
    if (!configFileName) {
        return formatSettings;
    }
    if (opts.verbose) {
        console.log(`read ${configFileName} for ${fileName}`);
    }
    let config = (0, utils_1.parseJSON)(fs.readFileSync(configFileName, "utf-8"));
    if (typeof config.insertSpaceAfterCommaDelimiter === "boolean") {
        formatSettings.insertSpaceAfterCommaDelimiter = config.insertSpaceAfterCommaDelimiter;
    }
    if (typeof config.insertSpaceAfterSemicolonInForStatements === "boolean") {
        formatSettings.insertSpaceAfterSemicolonInForStatements = config.insertSpaceAfterSemicolonInForStatements;
    }
    if (typeof config.insertSpaceBeforeAndAfterBinaryOperators === "boolean") {
        formatSettings.insertSpaceBeforeAndAfterBinaryOperators = config.insertSpaceBeforeAndAfterBinaryOperators;
    }
    if (typeof config.insertSpaceAfterConstructor === "boolean") {
        formatSettings.insertSpaceAfterConstructor = config.insertSpaceAfterConstructor;
    }
    if (typeof config.insertSpaceAfterKeywordsInControlFlowStatements === "boolean") {
        formatSettings.insertSpaceAfterKeywordsInControlFlowStatements = config.insertSpaceAfterKeywordsInControlFlowStatements;
    }
    if (typeof config.insertSpaceAfterFunctionKeywordForAnonymousFunctions === "boolean") {
        formatSettings.insertSpaceAfterFunctionKeywordForAnonymousFunctions = config.insertSpaceAfterFunctionKeywordForAnonymousFunctions;
    }
    if (typeof config.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis === "boolean") {
        formatSettings.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis = config.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis;
    }
    if (typeof config.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces === "boolean") {
        formatSettings.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces = config.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces;
    }
    if (typeof config.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets === "boolean") {
        formatSettings.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets = config.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets;
    }
    if (typeof config.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces === "boolean") {
        formatSettings.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces = config.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces;
    }
    if (typeof config.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces === "boolean") {
        formatSettings.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces = config.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces;
    }
    if (typeof config.insertSpaceAfterTypeAssertion === "boolean") {
        formatSettings.insertSpaceAfterTypeAssertion = config.insertSpaceAfterTypeAssertion;
    }
    if (typeof config.insertSpaceBeforeFunctionParenthesis === "boolean") {
        formatSettings.insertSpaceBeforeFunctionParenthesis = config.insertSpaceBeforeFunctionParenthesis;
    }
    if (typeof config.placeOpenBraceOnNewLineForFunctions === "boolean") {
        formatSettings.placeOpenBraceOnNewLineForFunctions = config.placeOpenBraceOnNewLineForFunctions;
    }
    if (typeof config.placeOpenBraceOnNewLineForControlBlocks === "boolean") {
        formatSettings.placeOpenBraceOnNewLineForControlBlocks = config.placeOpenBraceOnNewLineForControlBlocks;
    }
    if (typeof config.insertSpaceBeforeTypeAnnotation === "boolean") {
        formatSettings.insertSpaceBeforeTypeAnnotation = config.insertSpaceBeforeTypeAnnotation;
    }
    if (typeof config.baseIndentSize === "number") {
        formatSettings.baseIndentSize = config.baseIndentSize;
    }
    if (typeof config.indentSize === "number") {
        formatSettings.indentSize = config.indentSize;
    }
    if (typeof config.indentStyle === "number") {
        formatSettings.indentStyle = config.indentStyle;
    }
    else if (typeof config.indentStyle === "string") {
        formatSettings.indentStyle = ts.IndentStyle[config.indentStyle];
    }
    if (typeof config.tabSize === "number") {
        formatSettings.tabSize = config.tabSize;
    }
    if (typeof config.newLineCharacter === "string") {
        formatSettings.newLineCharacter = config.newLineCharacter;
    }
    if (typeof config.convertTabsToSpaces === "boolean") {
        formatSettings.convertTabsToSpaces = config.convertTabsToSpaces;
    }
    return formatSettings;
}
exports.makeFormatCodeOptions = makeFormatCodeOptions;
//# sourceMappingURL=base.js.map