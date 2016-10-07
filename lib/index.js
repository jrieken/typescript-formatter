"use strict";
var formatter_1 = require("./formatter");
var utils_1 = require("./utils");
exports.parseJSON = utils_1.parseJSON;
var fs = require("fs");
var base_1 = require("./provider/base");
var tsconfigjson_1 = require("./provider/tsconfigjson");
var editorconfig_1 = require("./provider/editorconfig");
var tslintjson_1 = require("./provider/tslintjson");
var PostProcess = (function () {
    function PostProcess() {
    }
    PostProcess.sequence = function (all) {
        var index = 0;
        function next(fileName, formattedCode, opts, formatOptions) {
            if (index < all.length) {
                return Promise.resolve(all[index++](fileName, formattedCode, opts, formatOptions)).then(function (newFormattedCode) {
                    return next(fileName, newFormattedCode || formattedCode, opts, formatOptions);
                });
            }
            return formattedCode;
        }
        ;
        return next;
    };
    return PostProcess;
}());
exports.PostProcess = PostProcess;
function processFiles(files, opts) {
    var resultMap = {};
    var promises = files.map(function (fileName) {
        if (!fs.existsSync(fileName)) {
            var result = {
                fileName: fileName,
                options: null,
                message: fileName + " does not exist. process abort.\n",
                error: true,
                src: "",
                dest: "",
            };
            return Promise.resolve(result);
        }
        var content = fs.readFileSync(fileName).toString();
        return processString(fileName, content, opts);
    });
    return Promise.all(promises).then(function (resultList) {
        resultList.forEach(function (result) {
            resultMap[result.fileName] = result;
        });
        return resultMap;
    });
}
exports.processFiles = processFiles;
function processStream(fileName, input, opts) {
    input.setEncoding("utf8");
    var promise = new Promise(function (resolve, _reject) {
        var fragment = "";
        input.on("data", function (chunk) {
            fragment += chunk;
        });
        input.on("end", function () {
            resolve(fragment);
        });
    });
    return promise.then(function (content) { return processString(fileName, content, opts); });
}
exports.processStream = processStream;
function processString(fileName, content, opts) {
    var formatOptions = utils_1.createDefaultFormatCodeOptions();
    var optGenPromises = [];
    var postProcesses = [];
    if (opts.tsfmt) {
        optGenPromises.push(base_1.default(fileName, opts, formatOptions));
    }
    if (opts.tsconfig) {
        optGenPromises.push(tsconfigjson_1.default(fileName, opts, formatOptions));
    }
    if (opts.editorconfig) {
        optGenPromises.push(editorconfig_1.default(fileName, opts, formatOptions));
        postProcesses.push(editorconfig_1.postProcess);
    }
    if (opts.tslint) {
        optGenPromises.push(tslintjson_1.default(fileName, opts, formatOptions));
        postProcesses.push(tslintjson_1.postProcess);
    }
    return Promise
        .all(optGenPromises)
        .then(function () {
        var formattedCode = formatter_1.default(fileName, content, formatOptions);
        // apply post process logic
        return PostProcess.sequence(postProcesses)(fileName, formattedCode, opts, formatOptions);
    }).then(function (formattedCode) {
        // replace newline code. maybe NewLineCharacter params affect to only "new" newline by language service.
        formattedCode = formattedCode.replace(/\r?\n/g, formatOptions.NewLineCharacter);
        var message = "";
        var error = false;
        if (opts && opts.verify) {
            if (content !== formattedCode) {
                message = fileName + " is not formatted\n";
                error = true;
            }
        }
        else if (opts && opts.replace) {
            if (content !== formattedCode) {
                fs.writeFileSync(fileName, formattedCode);
                message = "replaced " + fileName + "\n";
            }
        }
        else if (opts && !opts.dryRun) {
            message = formattedCode;
        }
        var result = {
            fileName: fileName,
            options: formatOptions,
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