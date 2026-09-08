export default {
  type: 'content-api',
  routes: [
    {
      method: 'POST',
      path: '/invoices/:documentId/pay',
      handler: 'invoice.pay',
      config: {},
    },
  ],
};