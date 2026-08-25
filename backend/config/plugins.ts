export default () => ({
  upload: {
    config: {
      sizeLimit: 5 * 1024 * 1024,
      breakpoints: {
        thumbnail: { width: 160, height: 160 },
        small: { width: 500, height: 500 },
        medium: { width: 1000, height: 1000 },
        large: { width: 1400 },
      },
      sharp: {
        cache: true,
        concurrency: 4,
      },
      security: {
        allowedTypes: ['image/*', 'application/pdf'],
        deniedTypes: ['application/x-sh', 'application/x-dosexec'],
      },
      concurrentUploadSize: 5,
    },
  },
  'users-permissions': {
    config: {
      jwtManagement: 'refresh', // Para habilitar endpoints de gestión de JWT
      sessions: {
      accessTokenLifespan: 18000,  // Tiempo de vida del token para peticiones a la API (5 horas)
      maxRefreshTokenLifespan: 18000,  // Máxima duración del refresh token (5 horas)
    },
      jwt: {
        expiresIn: '5h',
      },
      register: {
        allowedFields: ['fullname', 'lastname'],
      },
    },
  },
});


// VERIFICAR PORQUE MOTIVO ALGO ESTÁ HACIENDO QUE NO PUEDA OBTENER FULLNAME Y LASTNAME