export default {
  async beforeCreate(event) {
    const { data } = event.params;

    // Calcular el max+1 para el campo contrato
    try {
      const lastClient = await strapi.db.query('api::cliente.cliente').findMany({
        orderBy: { contrato: 'desc' },
        limit: 1,
      });

      const lastContract = lastClient && lastClient.length > 0 ? lastClient[0].contrato : 0;
      data.contrato = (lastContract || 0) + 1;
    } catch (error) {
      console.error('Error al generar el número de contrato:', error);
    }
  },
};
