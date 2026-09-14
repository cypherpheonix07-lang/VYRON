/**
 * PROJECT BRAHMA — CONNECTORS BARREL EXPORT
 * Exports classes, interfaces, and configured singletons for all 5 enterprise connectors.
 */

import { KaggleConnector } from "./kaggleConnector";
import { GitHubConnector } from "./githubConnector";
import { FigmaConnector } from "./figmaConnector";
import { NotionConnector } from "./notionConnector";
import { CustomMcpConnector } from "./customMcpConnector";

export * from "./kaggleConnector";
export * from "./githubConnector";
export * from "./figmaConnector";
export * from "./notionConnector";
export * from "./customMcpConnector";

export const kaggleConnector = new KaggleConnector();
export const gitHubConnector = new GitHubConnector();
export const figmaConnector = new FigmaConnector();
export const notionConnector = new NotionConnector();
export const customMcpConnector = new CustomMcpConnector();
