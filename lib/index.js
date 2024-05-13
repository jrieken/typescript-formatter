"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processString = exports.processStream = exports.processFiles = exports.version = exports.parseJSON = void 0;
const formatter_1 = require("./formatter");
const utils_1 = require("./utils");
Object.defineProperty(exports, "parseJSON", { enumerable: true, get: function () { return utils_1.parseJSON; } });
const fs = require("fs");
const path = require("path");
const base = require("./provider/base");
const tsconfigjson = require("./provider/tsconfigjson");
const editorconfig = require("./provider/editorconfig");
const tslintjson = require("./provider/tslintjson");
const vscodesettings = require("./provider/vscodesettings");
const os_1 = require("os");
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")).toString());
exports.version = packageJson.version;
class Processor {
    optionModifiers = [];
    postProcessors = [];
    addOptionModify(modifier) {
        this.optionModifiers.push(modifier);
    }
    processFormatCodeOptions(fileName, opts, formatSettings) {
        let optionModifiers = [...this.optionModifiers];
        let next = (formatSettings) => {
            if (optionModifiers.length === 0) {
                return Promise.resolve(formatSettings);
            }
            let modifier = optionModifiers.shift();
            let ret = modifier(fileName, opts, formatSettings);
            return Promise.resolve(ret).then(formatSettings => next(formatSettings));
        };
        return next(formatSettings);
    }
    addPostProcess(postProcessor) {
        this.postProcessors.push(postProcessor);
    }
    postProcess(fileName, formattedCode, opts, formatSettings) {
        let postProcessors = [...this.postProcessors];
        let next = (formattedCode) => {
            if (postProcessors.length === 0) {
                return Promise.resolve(formattedCode);
            }
            let processor = postProcessors.shift();
            let ret = processor(fileName, formattedCode, opts, formatSettings);
            return Promise.resolve(ret).then(formattedCode => next(formattedCode));
        };
        return next(formattedCode);
    }
}
function processFiles(files, opts) {
    let resultMap = {};
    let promises = files.map(fileName => {
        if (!fs.existsSync(fileName)) {
            let result = {
                fileName: fileName,
                settings: null,
                message: `${fileName} does not exist. process abort.\n`,
                error: true,
                src: "",
                dest: "",
            };
            return Promise.resolve(result);
        }
        let content = fs.readFileSync(fileName).toString();
        return processString(fileName, content, opts);
    });
    return Promise.all(promises).then(resultList => {
        resultList.forEach(result => {
            resultMap[result.fileName] = result;
        });
        return resultMap;
    });
}
exports.processFiles = processFiles;
function processStream(fileName, input, opts) {
    input.setEncoding("utf8");
    let promise = new Promise((resolve, _reject) => {
        let fragment = "";
        input.on("data", (chunk) => {
            fragment += chunk;
        });
        input.on("end", () => {
            resolve(fragment);
        });
    });
    return promise.then(content => processString(fileName, content, opts));
}
exports.processStream = processStream;
function processString(fileName, content, opts) {
    let processor = new Processor();
    if (opts.tsfmt) {
        processor.addOptionModify(base.makeFormatCodeOptions);
    }
    if (opts.tsconfig) {
        processor.addOptionModify(tsconfigjson.makeFormatCodeOptions);
    }
    if (opts.editorconfig) {
        processor.addOptionModify(editorconfig.makeFormatCodeOptions);
        processor.addPostProcess(editorconfig.postProcess);
    }
    if (opts.tslint) {
        processor.addOptionModify(tslintjson.makeFormatCodeOptions);
        processor.addPostProcess(tslintjson.postProcess);
    }
    if (opts.vscode) {
        processor.addOptionModify(vscodesettings.makeFormatCodeOptions);
    }
    processor.addPostProcess((_fileName, formattedCode, _opts, formatSettings) => {
        // replace newline code. maybe NewLineCharacter params affect to only "new" newline by language service.
        formattedCode = formattedCode.replace(/\r?\n/g, formatSettings.newLineCharacter || os_1.EOL);
        return Promise.resolve(formattedCode);
    });
    let formatSettings = (0, utils_1.createDefaultFormatCodeSettings)();
    return processor.processFormatCodeOptions(fileName, opts, formatSettings)
        .then(formatSettings => {
        let formattedCode = (0, formatter_1.format)(fileName, content, formatSettings);
        // apply post process logic
        return processor.postProcess(fileName, formattedCode, opts, formatSettings);
    }).then(formattedCode => {
        let message = "";
        let error = false;
        if (opts && opts.verify) {
            if (content !== formattedCode) {
                message = `${fileName} is not formatted\n`;
                error = true;
            }
        }
        else if (opts && opts.replace) {
            if (content !== formattedCode) {
                fs.writeFileSync(fileName, formattedCode);
                message = `replaced ${fileName}\n`;
            }
        }
        else if (opts && !opts.dryRun) {
            message = formattedCode;
        }
        let result = {
            fileName: fileName,
            settings: formatSettings,
            message: message,
            error: error,
            src: content,
            dest: formattedCode,
        };
        return Promise.resolve(result);
    });
}
exports.processString = processString;
//# sourceMappingURL=index.js.map