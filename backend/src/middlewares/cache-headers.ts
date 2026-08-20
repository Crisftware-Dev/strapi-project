import type { Core } from '@strapi/strapi';

export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    await next();

    if (ctx.url.startsWith('/api/') && ctx.method === 'GET') {
      if (ctx.url.includes('/login-pages') || ctx.url.includes('/plans')) {
        ctx.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
      } else if (ctx.url.includes('/clientes') || ctx.url.includes('/users')) {
        ctx.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      } else {
        ctx.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=30');
      }
    }
  };
};
