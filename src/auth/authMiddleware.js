const { validateApiKey } = require('./apiKeys');

function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.apikey;
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Se requiere una API key válida. Incluya la key en el header "X-API-Key" o en el parámetro de query "apikey"',
      documentation: '/api/docs',
      contact: 'servidorl3ho@gmail.com'
    });
  }
  
  if (!validateApiKey(apiKey)) {
    return res.status(403).json({
      error: 'API key inválida o inactiva',
      message: 'La API key proporcionada no es válida o ha sido desactivada',
      contact: 'servidorl3ho@gmail.com'
    });
  }
  
  next();
}

module.exports = authMiddleware;