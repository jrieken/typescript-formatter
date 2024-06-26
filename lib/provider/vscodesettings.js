"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFormatCodeOptions = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("../utils");
function makeFormatCodeOptions(fileName, opts, formatSettings) {
    let baseDir = opts.baseDir ? path.resolve(opts.baseDir) : path.dirname(path.resolve(fileName));
    let configFileName;
    if (opts.vscodeFile && path.isAbsolute(opts.vscodeFile)) {
        configFileName = opts.vscodeFile;
    }
    else {
        configFileName = (0, utils_1.getConfigFileName)(baseDir, opts.vscodeFile || ".vscode/settings.json");
    }
    if (!configFileName) {
        return formatSettings;
    }
    if (opts.verbose) {
        console.log(`read ${configFileName} for ${fileName}`);
    }
    let config = (0, utils_1.parseJSON)(fs.readFileSync(configFileName, "utf-8"));
    if (config["typescript.format.insertSpaceAfterCommaDelimiter"] != null) {
        formatSettings.insertSpaceAfterCommaDelimiter = config["typescript.format.insertSpaceAfterCommaDelimiter"];
    }
    if (config["typescript.format.insertSpaceAfterConstructor"] != null) {
        formatSettings.insertSpaceAfterConstructor = config["typescript.format.insertSpaceAfterConstructor"];
    }
    if (config["typescript.format.insertSpaceAfterSemicolonInForStatements"] != null) {
        formatSettings.insertSpaceAfterSemicolonInForStatements = config["typescript.format.insertSpaceAfterSemicolonInForStatements"];
    }
    if (config["typescript.format.insertSpaceBeforeAndAfterBinaryOperators"] != null) {
        formatSettings.insertSpaceBeforeAndAfterBinaryOperators = config["typescript.format.insertSpaceBeforeAndAfterBinaryOperators"];
    }
    if (config["typescript.format.insertSpaceAfterKeywordsInControlFlowStatements"] != null) {
        formatSettings.insertSpaceAfterKeywordsInControlFlowStatements = config["typescript.format.insertSpaceAfterKeywordsInControlFlowStatements"];
    }
    if (config["typescript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions"] != null) {
        formatSettings.insertSpaceAfterFunctionKeywordForAnonymousFunctions = config["typescript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions"];
    }
    if (config["typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis"] != null) {
        formatSettings.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis = config["typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis"];
    }
    if (config["typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets"] != null) {
        formatSettings.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets = config["typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets"];
    }
    if (config["typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces"] != null) {
        formatSettings.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces = config["typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces"];
    }
    if (config["typescript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces"] != null) {
        formatSettings.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces = config["typescript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces"];
    }
    if (config["typescript.format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces"] != null) {
        formatSettings.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces = config["typescript.format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces"];
    }
    if (config["typescript.format.insertSpaceAfterTypeAssertion"] != null) {
        formatSettings.insertSpaceAfterTypeAssertion = config["typescript.format.insertSpaceAfterTypeAssertion"];
    }
    if (config["typescript.format.insertSpaceBeforeFunctionParenthesis"] != null) {
        formatSettings.insertSpaceBeforeFunctionParenthesis = config["typescript.format.insertSpaceBeforeFunctionParenthesis"];
    }
    if (config["typescript.format.placeOpenBraceOnNewLineForFunctions"] != null) {
        formatSettings.placeOpenBraceOnNewLineForFunctions = config["typescript.format.placeOpenBraceOnNewLineForFunctions"];
    }
    if (config["typescript.format.placeOpenBraceOnNewLineForControlBlocks"] != null) {
        formatSettings.placeOpenBraceOnNewLineForControlBlocks = config["typescript.format.placeOpenBraceOnNewLineForControlBlocks"];
    }
    return formatSettings;
}
exports.makeFormatCodeOptions = makeFormatCodeOptions;
//# sourceMappingURL=vscodesettings.js.map