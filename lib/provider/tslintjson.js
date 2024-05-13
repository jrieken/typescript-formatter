"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postProcess = exports.makeFormatCodeOptions = void 0;
const path = require("path");
const utils_1 = require("../utils");
async function makeFormatCodeOptions(fileName, opts, formatSettings) {
    const rules = await getRules(fileName, opts);
    if (!rules) {
        return formatSettings;
    }
    const indent = rules.get("indent");
    const whitespace = rules.get("whitespace");
    if (indent && indent.ruleArguments) {
        switch (indent.ruleArguments[0]) {
            case "spaces":
                formatSettings.convertTabsToSpaces = true;
                break;
            case "tabs":
                formatSettings.convertTabsToSpaces = false;
                break;
            default:
                break;
        }
    }
    if (whitespace && whitespace.ruleArguments) {
        for (let p in whitespace.ruleArguments) {
            switch (whitespace.ruleArguments[p]) {
                case "check-branch":
                    formatSettings.insertSpaceAfterKeywordsInControlFlowStatements = true;
                    break;
                case "check-operator":
                    formatSettings.insertSpaceBeforeAndAfterBinaryOperators = true;
                    break;
                case "check-separator":
                    formatSettings.insertSpaceAfterCommaDelimiter = true;
                    formatSettings.insertSpaceAfterSemicolonInForStatements = true;
                    break;
                case "check-typecast":
                    formatSettings.insertSpaceAfterTypeAssertion = true;
                    break;
                default:
                    break;
            }
        }
    }
    return formatSettings;
}
exports.makeFormatCodeOptions = makeFormatCodeOptions;
async function postProcess(fileName, formattedCode, opts, _formatSettings) {
    const rules = await getRules(fileName, opts);
    if (!rules) {
        return formattedCode;
    }
    if (rules.has("no-consecutive-blank-lines")) {
        formattedCode = formattedCode.replace(/\n+^$/mg, "\n");
    }
    return formattedCode;
}
exports.postProcess = postProcess;
async function getRules(fileName, opts) {
    const baseDir = opts.baseDir ? path.resolve(opts.baseDir) : path.dirname(path.resolve(fileName));
    let configFileName;
    if (opts.tslintFile && path.isAbsolute(opts.tslintFile)) {
        configFileName = opts.tslintFile;
    }
    else {
        configFileName = (0, utils_1.getConfigFileName)(baseDir, opts.tslintFile || "tslint.json");
    }
    if (!configFileName) {
        return undefined;
    }
    if (opts.verbose) {
        console.log(`read ${configFileName} for ${fileName}`);
    }
    const { Configuration } = await Promise.resolve().then(() => require("tslint"));
    const { rules } = Configuration.loadConfigurationFromPath(configFileName);
    return rules;
}
//# sourceMappingURL=tslintjson.js.map