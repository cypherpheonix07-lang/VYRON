import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const suppressDirectiveFilter: any = {
  onLog(level: string, log: any, defaultHandler?: any) {
    if (
      log?.code === "MODULE_LEVEL_DIRECTIVE" ||
      log?.message?.includes("module level directive")
    ) {
      return;
    }
    defaultHandler?.(level, log);
  },
  onwarn(warning: any, warn?: any) {
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
      port: 8080,
      watch: {
        ignored: [
          "**/.output/**",
          "**/.wrangler/**",
          "**/.vinxi/**",
          "**/.chrome-demo-profile/**",
          "**/brahma-engine/**",
          "**/vyron-engine/**",
          "**/.agents/**",
          "**/.devin/**",
          "**/.claude/**",
          "**/.augment/**",
          "**/.openhands/**",
          "**/.cursor/**",
          "**/.cline/**",
          "**/.roo/**",
          "**/[0-9][0-9] — */**",
          "**/artifacts/**",
          "**/docs/**",
          "**/data/**",
          "**/*.json",
          "**/*.md",
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
