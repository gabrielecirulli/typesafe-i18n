import type { OutputFormats } from '../../config/src/types.mjs';
import type { Locale } from '../../runtime/src/core.mjs';
import type { BaseTranslation } from '../../runtime/src/index.mjs';
/**
 * TypeScript 7 no longer exports `createProgram`, so the locale file is transpiled with the `tsc` command.
 * Every TypeScript version ships that command.
 */
export declare const transpileWithTsc: (typescriptPath: string, languageFilePath: string, tempPath: string) => void;
export declare const parseLanguageFile: (outputPath: string, outputFormat: OutputFormats, typesFileName: string, tempPath: string, locale: Locale, namespace?: string) => Promise<BaseTranslation | null>;
