import * as ts from "typescript";
import { Options } from "../";
import { Mutable } from "./base";
export declare function makeFormatCodeOptions(fileName: string, opts: Options, formatSettings: Mutable<ts.FormatCodeSettings>): ts.FormatCodeSettings;
