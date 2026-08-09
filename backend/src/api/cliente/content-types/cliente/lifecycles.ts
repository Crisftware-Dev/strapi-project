export default {
  async beforeCreate(event) {
    const { data } = event.params;
    const MAX_RETRIES = 5;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const lastClient = await strapi.entityService.findMany(
          "api::cliente.cliente",
          {
            sort: { contrato: "desc" },
            limit: 1,
            fields: ["contrato"],
          },
        );

        const lastContract =
          lastClient && lastClient.length > 0
            ? Number(lastClient[0].contrato)
            : 0;

        data.contrato = lastContract + 1;
        return;
      } catch (error) {
        console.error(
          `Error al generar el número de contrato (intento ${attempt + 1}/${MAX_RETRIES}):`,
          error,
        );

        if (attempt === MAX_RETRIES - 1) {
          throw new Error("No se pudo generar el número de contrato");
        }
      }
    }
  },
};
