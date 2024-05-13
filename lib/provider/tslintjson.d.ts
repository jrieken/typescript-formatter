import * as ts from "typescript";
import { Options } from "../";
import { Mutable } from "./base";
export interface AdditionalFormatSettings {
    $noConsecutiveBlankLines: boolean;
}
export declare function makeFormatCodeOptions(fileName: string, opts: Options, formatSettings: Mutable<ts.FormatCodeSettings>): Promise<ts.FormatCodeSettings>;
export declare function postProcess(fileName: string, formattedCode: string, opts: Options, _formatSettings: ts.FormatCodeSettings): Promise<string>;
