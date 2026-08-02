export default () => ({
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