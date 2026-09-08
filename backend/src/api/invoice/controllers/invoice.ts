/**
 * invoice controller
 */

import { factories } from '@strapi/strapi';
import { InvoicePaymentError } from '../services/invoice';

export default factories.createCoreController('api::invoice.invoice', ({ strapi }) => ({
  async pay(ctx) {
    const { documentId } = ctx.params;
    const body = ctx.request.body ?? {};
    try {
      const invoice = await strapi
        .service('api::invoice.invoice')
        .registerPayment(documentId, body);
      return { data: invoice };
    } catch (error) {
      if (error instanceof InvoicePaymentError) {
        ctx.throw(400, error.message);
      }
      throw error;
    }
  },
}));