export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  cron: {
    enabled: true,
    tasks: {
      'invoice-mensual': {
        task: async ({ strapi }) => {
          strapi.log.info('[invoice] Generando compromisos mensuales');
          const result = await strapi
            .service('api::invoice.invoice')
            .createMonthlyInvoices();
          strapi.log.info(`[invoice] Creadas: ${result.created}, omitidas: ${result.skipped}`);
        },
        options: {
          rule: '0 0 0 1 * *',
          tz: 'America/Guayaquil',
        },
      },
    },
  },
});
