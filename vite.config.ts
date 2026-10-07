import { defineConfig } from "@lovable.dev/vite-tanstack-config";

interface RollupLog {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

const suppressDirectiveFilter = {
  onLog(level: string, log: RollupLog, defaultHandler?: (level: string, log: RollupLog) => void) {
    if (
      log?.code === "MODULE_LEVEL_DIRECTIVE" ||
      log?.message?.includes("module level directive")
    ) {
      return;
    }
    defaultHandler?.(level, log);
  },
  onwarn(warning: RollupLog, warn?: (warning: RollupLog) => void) {
    if (
      warning?.code === "MODULE_LEVEL_DIRECTIVE" ||
      warning?.message?.includes("module level directive")
    ) {
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
    server: {
      watch: {
        ignored: [
          "**/.output/**",
          "**/.wrangler/**",
          "**/.vinxi/**",
          "**/.chrome-demo-profile/**",
          "**/brahma-engine/**",
          "**/vyron-engine/**",
          "**/.agents/**",
          "**/51 — TESTING PLATFORM/**",
          "**/acceptance-gates-report.json",
          "**/continuation_advancement_report.json",
        ],
      },
    },
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
