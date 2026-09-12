/**
 * PROJECT BRAHMA — PLUGIN REGISTRY BARREL EXPORT (PHASE B.6)
 * Instantiates the registry and registers all 5 core plugins.
 * Exports brahmaPlugins singleton.
 */

import { pluginRegistry, PluginRegistry } from "./PluginRegistry";
import { analysisPluginTool } from "./analysis-plugin";
import { chatPluginTool } from "./chat-plugin";
import { dataPluginTool } from "./data-plugin";
import { reportPluginTool } from "./report-plugin";
import { githubPluginTool } from "./github-plugin";

// Register all 5 core plugins into the in-process registry
pluginRegistry.registerTool(analysisPluginTool);
pluginRegistry.registerTool(chatPluginTool);
pluginRegistry.registerTool(dataPluginTool);
pluginRegistry.registerTool(reportPluginTool);
pluginRegistry.registerTool(githubPluginTool);

export const brahmaPlugins = pluginRegistry;
export { PluginRegistry };
export * from "./types";
export { analysisPluginTool } from "./analysis-plugin";
export { chatPluginTool } from "./chat-plugin";
export { dataPluginTool } from "./data-plugin";
export { reportPluginTool } from "./report-plugin";
export { githubPluginTool } from "./github-plugin";
