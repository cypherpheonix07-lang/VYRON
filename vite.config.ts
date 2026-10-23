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

const ssrTimeoutPlugin: any = {
  name: "vyron:ssr-timeout",
  configureServer(server: any) {
    const patchEnvironment = (env: any) => {
      if (!env) return;
      const applyTimeout = (runner: any) => {
        if (!runner) return;
        try {
          if (runner.options?.transport) {
            runner.options.transport.timeout = 300000;
          }
          if (runner.transport) {
            runner.transport.timeout = 300000;
          }
        } catch (_err) {
          // ignore ssr transport timeout setting errors
        }
      };

      try {
        if (env.runner) {
          applyTimeout(env.runner);
        }
      } catch (_err) {
        // ignore runner inspection errors
      }

      const proto = Object.getPrototypeOf(env);
      const desc = Object.getOwnPropertyDescriptor(proto, "runner") || Object.getOwnPropertyDescriptor(env, "runner");
      if (desc?.get) {
        const originalGet = desc.get;
        Object.defineProperty(env, "runner", {
          get() {
            const runner = originalGet.call(this);
            applyTimeout(runner);
            return runner;
          },
          configurable: true,
        });
      }
    };

    patchEnvironment(server.environments?.ssr);
    patchEnvironment(server.environments?.server);
  },
};

export default defineConfig({
  tanstackStart: {
    client: { entry: "client" },
    server: { entry: "server" },
  },
  vite: {
    plugins: [ssrTimeoutPlugin],
    optimizeDeps: {
      entries: ["src/client.tsx"],
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@tanstack/react-router",
        "@tanstack/react-query",
        "@supabase/supabase-js",
        "lucide-react",
        "sonner",
        "clsx",
        "tailwind-merge",
      ],
    },
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
