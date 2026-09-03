import type { Core } from '@strapi/strapi';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const UPLOADS_FOLDER = 'uploads';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],
      async afterCreate(event) {
        const fileData = event.params.data;
        if (!fileData || !fileData.mime?.startsWith('image/') || fileData.ext === '.webp') {
          return;
        }

        const uploadsDir = path.join(strapi.dirs.static.public, UPLOADS_FOLDER);
        const filePath = path.join(uploadsDir, fileData.name);
        if (!fs.existsSync(filePath)) return;

        try {
          const webpName = fileData.name.replace(/\.[^.]+$/, '.webp');
          const webpPath = path.join(uploadsDir, webpName);

          await sharp(filePath).webp({ quality: 80 }).toFile(webpPath);
          fs.unlinkSync(filePath);

          await strapi.entityService.update('plugin::upload.file', fileData.id, {
            data: {
              name: webpName,
              url: `/${UPLOADS_FOLDER}/${webpName}`,
              mime: 'image/webp',
              ext: '.webp',
            },
          });

          strapi.log.info(`[sharp] Convertido a WebP: ${webpName}`);
        } catch (error) {
          strapi.log.error(`[sharp] Error al convertir ${fileData.name} a WebP: ${error}`);
        }
      },
    });
  },
};
