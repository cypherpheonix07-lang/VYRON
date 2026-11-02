import fs from 'node:fs';

let content = fs.readFileSync('src/routeTree.gen.ts', 'utf8');

// 1. Import
if (!content.includes('./routes/app.systems')) {
  content = content.replace(
    "import { Route as AppRealityMapRouteImport } from './routes/app.reality-map'",
    "import { Route as AppRealityMapRouteImport } from './routes/app.reality-map'\nimport { Route as AppSystemsRouteImport } from './routes/app.systems'"
  );
}

// 2. Route Declaration
if (!content.includes('const AppSystemsRoute =')) {
  const target = `const AppRealityMapRoute = AppRealityMapRouteImport.update({
  id: '/reality-map',
  path: '/reality-map',
  getParentRoute: () => AppRoute,
} as any)`;

  const replacement = `${target}

const AppSystemsRoute = AppSystemsRouteImport.update({
  id: '/systems',
  path: '/systems',
  getParentRoute: () => AppRoute,
} as any)`;

  content = content.replace(target, replacement);
}

// 3. FileRoutesByPath
if (!content.includes("'/app/systems': typeof AppSystemsRoute")) {
  content = content.replace(
    "'/app/reality-map': typeof AppRealityMapRoute",
    "'/app/reality-map': typeof AppRealityMapRoute\n  '/app/systems': typeof AppSystemsRoute"
  );
}

// 4. FileRoutesById
if (!content.includes("'/app/systems': {") && content.includes("'/app/reality-map': {")) {
  const targetId = `'/app/reality-map': {
      id: '/app/reality-map'
      path: '/reality-map'
      fullPath: '/app/reality-map'
      preLoaderRoute: typeof AppRealityMapRouteImport
      parentRoute: typeof AppRoute
    }`;

  const replacementId = `${targetId}
    '/app/systems': {
      id: '/app/systems'
      path: '/systems'
      fullPath: '/app/systems'
      preLoaderRoute: typeof AppSystemsRouteImport
      parentRoute: typeof AppRoute
    }`;

  content = content.replace(targetId, replacementId);
}

// 5. fullPaths / allPaths / id lists
content = content.replaceAll(
  "| '/app/reality-map'",
  "| '/app/reality-map'\n    | '/app/systems'"
);

// 6. AppRouteChildren interface & object
if (!content.includes('AppSystemsRoute: typeof AppSystemsRoute')) {
  content = content.replace(
    'AppRealityMapRoute: typeof AppRealityMapRoute\n',
    'AppRealityMapRoute: typeof AppRealityMapRoute\n  AppSystemsRoute: typeof AppSystemsRoute\n'
  );
}

if (!content.includes('AppSystemsRoute: AppSystemsRoute,')) {
  content = content.replace(
    'AppRealityMapRoute: AppRealityMapRoute,\n',
    'AppRealityMapRoute: AppRealityMapRoute,\n  AppSystemsRoute: AppSystemsRoute,\n'
  );
}

fs.writeFileSync('src/routeTree.gen.ts', content, 'utf8');
console.log('Successfully updated src/routeTree.gen.ts with AppSystemsRoute!');
