import * as ts from "typescript";
import { Options } from "../";
export declare function makeFormatCodeOptions(fileName: string, opts: Options, formatSettings: Mutable<ts.FormatCodeSettings>): ts.FormatCodeSettings;
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
