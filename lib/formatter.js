"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const ts = require("typescript");
const utils_1 = require("./utils");
class LanguageServiceHost {
    files = {};
    addFile(fileName, text) {
        this.files[fileName] = ts.ScriptSnapshot.fromString(text);
    }
    fileExists(path) {
        return !!this.files[path];
    }
    readFile(path) {
        return this.files[path]?.getText(0, this.files[path].getLength());
    }
    // for ts.LanguageServiceHost
    getCompilationSettings = () => ts.getDefaultCompilerOptions();
    getScriptFileNames = () => Object.keys(this.files);
    getScriptVersion = (_fileName) => "0";
    getScriptSnapshot = (fileName) => this.files[fileName];
    getCurrentDirectory = () => process.cwd();
    getDefaultLibFileName = (options) => ts.getDefaultLibFilePath(options);
}
function format(fileName, text, options = (0, utils_1.createDefaultFormatCodeSettings)()) {
    const host = new LanguageServiceHost();
    host.addFile(fileName, text);
    const languageService = ts.createLanguageService(host);
    const edits = languageService.getFormattingEditsForDocument(fileName, options);
    edits
        .sort((a, b) => a.span.start - b.span.start)
        .reverse()
        .forEach(edit => {
        const head = text.slice(0, edit.span.start);
        const tail = text.slice(edit.span.start + edit.span.length);
        text = `${head}${edit.newText}${tail}`;
    });
    return text;
}
exports.format = format;
//# sourceMappingURL=formatter.js.map