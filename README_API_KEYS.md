# Sistema de Autenticación con API Keys

## Configuración Inicial

### 1. Establecer Contraseña de Administrador

La contraseña de administrador se puede configurar de dos formas:

**Opción A: Variable de entorno (Recomendado para producción)**
```bash
export ADMIN_PASSWORD="tu_contraseña_segura"
```

**Opción B: Usar contraseña por defecto**
Si no se establece la variable de entorno, se usará: `L3HO2025`

⚠️ **IMPORTANTE**: Cambia la contraseña por defecto en producción.

---

## Gestión de API Keys

### Panel de Administración Web
Accede a: `https://tu-dominio.com/admin.html`

### Crear Nueva API Key

**Método 1: Panel Web**
1. Abre `/admin.html`
2. Ingresa la contraseña de administrador
3. Completa el formulario con el nombre del cliente
4. Click en "Crear API Key"
5. **IMPORTANTE**: Copia y guarda la key generada (no se puede recuperar después)

**Método 2: API REST**
```bash
curl -X POST https://tu-dominio.com/admin/create-key \
  -H "Content-Type: application/json" \
  -d '{
    "adminPassword": "L3HO2025",
    "clientName": "Nombre del Cliente",
    "description": "Plan Premium - Acceso ilimitado"
  }'
```

Respuesta:
```json
{
  "success": true,
  "message": "API key creada exitosamente",
  "apiKey": "lmx_4b371d3bf055c5a12f9b14806fef2362e444e098ff85bfe117f3d1481efd93a6",
  "clientName": "Nombre del Cliente",
  "description": "Plan Premium - Acceso ilimitado"
}
```

### Ver Todas las API Keys

```bash
curl "https://tu-dominio.com/admin/keys?adminPassword=L3HO2025"
```

### Desactivar una API Key

```bash
curl -X POST https://tu-dominio.com/admin/deactivate-key \
  -H "Content-Type: application/json" \
  -d '{
    "adminPassword": "L3HO2025",
    "apiKey": "lmx_..."
  }'
```

### Ver Estadísticas

```bash
curl "https://tu-dominio.com/admin/stats?adminPassword=L3HO2025"
```

---

## Uso de la API (Para Clientes)

### Opción 1: Header HTTP (Recomendado)

```bash
curl -H "X-API-Key: lmx_tu_api_key_aqui" \
  https://tu-dominio.com/tabla
```

```javascript
fetch('https://tu-dominio.com/tabla', {
  headers: {
    'X-API-Key': 'lmx_tu_api_key_aqui'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

```python
import requests

headers = {'X-API-Key': 'lmx_tu_api_key_aqui'}
response = requests.get('https://tu-dominio.com/tabla', headers=headers)
data = response.json()
```

### Opción 2: Query Parameter

```bash
curl "https://tu-dominio.com/tabla?apikey=lmx_tu_api_key_aqui"
```

---

## Endpoints Públicos (No requieren API key)

- `/` - Documentación HTML
- `/api/docs` - Documentación JSON
- `/admin.html` - Panel de administración

---

## Formato de API Keys

Las API keys generadas tienen el formato:
```
lmx_[64 caracteres hexadecimales]
```

Ejemplo: `lmx_4b371d3bf055c5a12f9b14806fef2362e444e098ff85bfe117f3d1481efd93a6`

---

## Respuestas de Error

### Sin API Key
```json
{
  "error": "Acceso no autorizado",
  "message": "Se requiere una API key válida. Incluya la key en el header 'X-API-Key' o en el parámetro de query 'apikey'",
  "documentation": "/api/docs",
  "contact": "servidorl3ho@gmail.com"
}
```

### API Key Inválida
```json
{
  "error": "API key inválida o inactiva",
  "message": "La API key proporcionada no es válida o ha sido desactivada",
  "contact": "servidorl3ho@gmail.com"
}
```

---

## Almacenamiento de API Keys

Las API keys se almacenan en: `data/api-keys.json`

Cada key incluye:
- `clientName`: Nombre del cliente
- `description`: Descripción del plan/uso
- `createdAt`: Fecha de creación
- `active`: Estado (true/false)
- `requestCount`: Contador de peticiones
- `lastUsed`: Última fecha de uso

**⚠️ IMPORTANTE**: 
- Haz backup regular de `data/api-keys.json`
- No compartas este archivo (contiene todas las keys activas)
- Mantenlo seguro en `.gitignore`

---

## Seguridad

### Mejores Prácticas

1. **Protege la contraseña de administrador**
   - Usa una contraseña fuerte y única
   - Guárdala en variables de entorno
   - No la incluyas en el código fuente

2. **Gestión de API Keys**
   - Genera una key única por cliente
   - Incluye descripción detallada de cada key
   - Desactiva keys cuando ya no sean necesarias
   - Monitorea el uso con `requestCount`

3. **Monitoreo**
   - Revisa regularmente las estadísticas
   - Detecta patrones de uso anormal
   - Desactiva keys con actividad sospechosa

4. **Backup**
   - Respalda `data/api-keys.json` regularmente
   - Mantén copias seguras de las keys de clientes importantes

---

## Troubleshooting

### La API rechaza una key válida

1. Verifica que la key esté activa:
   ```bash
   curl "https://tu-dominio.com/admin/keys?adminPassword=L3HO2025"
   ```

2. Revisa que no haya espacios extra en la key

3. Confirma que uses el header correcto: `X-API-Key`

### No puedo acceder al panel de admin

1. Verifica la contraseña de administrador
2. Revisa que el servidor esté ejecutándose
3. Comprueba que accedes a `/admin.html` (no `/admin`)

### Perdí una API key

Las API keys no se pueden recuperar una vez creadas. Deberás:
1. Desactivar la key perdida
2. Generar una nueva key
3. Proporcionarla al cliente

---

## Contacto y Soporte

📧 Email: servidorl3ho@gmail.com

Para:
- Obtener una API key
- Soporte técnico
- Consultas sobre planes
- Reportar problemas

---

© 2025 L3HO. Todos los derechos reservados.
