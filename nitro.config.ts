import { defineNitroConfig } from "nitro/config";

const suppressDirectiveFilter = {
  checks: {
    moduleLevelDirective: false,
  },
  onLog(level: any, log: any, defaultHandler: any) {
    if (log?.code === "MODULE_LEVEL_DIRECTIVE" || log?.message?.includes("module level directive")) {
      return;
    }
    defaultHandler?.(level, log);
  },
  onwarn(warning: any, defaultHandler: any) {
    if (warning?.code === "MODULE_LEVEL_DIRECTIVE" || warning?.message?.includes("module level directive")) {
      return;
    }
    defaultHandler?.(warning);
  },
};

export default defineNitroConfig({
  rolldownConfig: suppressDirectiveFilter,
  rollupConfig: suppressDirectiveFilter,
});
