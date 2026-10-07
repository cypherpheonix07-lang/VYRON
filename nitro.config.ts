import { defineNitroConfig } from "nitro/config";

interface RollupLog {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

const suppressDirectiveFilter = {
  checks: {
    moduleLevelDirective: false,
  },
  onLog(level: string, log: RollupLog, defaultHandler?: (level: string, log: RollupLog) => void) {
    if (
      log?.code === "MODULE_LEVEL_DIRECTIVE" ||
      log?.message?.includes("module level directive")
    ) {
      return;
    }
    defaultHandler?.(level, log);
  },
  onwarn(warning: RollupLog, defaultHandler?: (warning: RollupLog) => void) {
    if (
      warning?.code === "MODULE_LEVEL_DIRECTIVE" ||
      warning?.message?.includes("module level directive")
    ) {
      return;
    }
    defaultHandler?.(warning);
  },
};

export default defineNitroConfig({
  rolldownConfig: suppressDirectiveFilter,
  rollupConfig: suppressDirectiveFilter,
});
