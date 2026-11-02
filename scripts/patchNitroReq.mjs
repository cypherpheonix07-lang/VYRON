import fs from 'node:fs';

const filePath = '.output/server/index.mjs';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    'if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);',
    'if (env?.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);'
  );
  content = content.replace(
    'req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;',
    'try { req.ip = cfReq.headers.get("cf-connecting-ip") || void 0; } catch {}'
  );
  content = content.replace(
    'req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);',
    'req.waitUntil = ctx.context?.waitUntil ? ctx.context.waitUntil.bind(ctx.context) : () => {};'
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched .output/server/index.mjs for env?.ASSETS, req.ip, and req.waitUntil!');
}

const serverWrapper = `import handler from "../../.output/server/index.mjs";

export default {
  ...handler,
  async fetch(request, env = {}, context = {}) {
    const safeContext = {
      waitUntil: () => {},
      ...(context || {}),
    };
    return handler.fetch(request, env || {}, {
      context: safeContext,
      ...safeContext,
    });
  },
};
`;

fs.writeFileSync('dist/server/server.js', serverWrapper, 'utf8');
console.log('Updated dist/server/server.js with safe context.waitUntil default!');
