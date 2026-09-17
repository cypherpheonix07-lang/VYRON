import { defineConfig } from "@lovable.dev/vite-tanstack-config";

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
  onwarn(warning: any, warn: any) {
    if (warning?.code === "MODULE_LEVEL_DIRECTIVE" || warning?.message?.includes("module level directive")) {
      return;
    }
    warn?.(warning);
  },
};

export default defineConfig({
  tanstackStart: {
    client: { entry: "client" },
    server: { entry: "server" },
  },
  vite: {
    build: {
      rolldownOptions: suppressDirectiveFilter,
      rollupOptions: suppressDirectiveFilter,
    },
    environments: {
      client: {
        build: {
          rolldownOptions: suppressDirectiveFilter,
          rollupOptions: suppressDirectiveFilter,
        },
      },
      ssr: {
        build: {
          rolldownOptions: suppressDirectiveFilter,
          rollupOptions: suppressDirectiveFilter,
        },
      },
      nitro: {
        build: {
          rolldownOptions: suppressDirectiveFilter,
          rollupOptions: suppressDirectiveFilter,
        },
      },
    },
  },
});

