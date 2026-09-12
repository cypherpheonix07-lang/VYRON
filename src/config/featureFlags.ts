const _env =
  typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined"
    ? import.meta.env
    : ({} as Record<string, string>);

export const FEATURE_FLAGS = {
  DEMO_MODE: _env["VITE_DEMO_MODE"] === "true",
  FORCE_TEMPLATE: _env["VITE_FORCE_TEMPLATE"] === "true",
} as const;
