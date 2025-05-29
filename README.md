

# 🚀 API de Gestión de Tareas con WebSockets

API REST construida con Node.js, Express, TypeScript y Socket.IO para gestión de tareas en tiempo real.

## 🛠️ Stack Tecnológico

- **Node.js + TypeScript** (ES2022)
- **Express.js** - Framework web
- **Socket.IO** - WebSockets tiempo real
- **SQLite** - Base de datos
- **Zod** - Validación de esquemas
- **Jest** - Testing unitario
- **OpenAPI** - Documentación schema
- **Swagger** - Documentacion de rutas


## 🚀 Instalación, Prueba y Ejecución

### .env requerido tener en la raiz del proyecto
```env
PORT=3000
MORGAN_FORMAT=dev
HOST=localhost
DB_PATH=./src/database/tasks.db
```
### Comandos
```bash
# Instalar dependencias
npm i

# crear database de tareas
npm run migration

# Ejecutar tests
npm test

# Ejecutar 
npm run build
npm run start
```

### 🔗 Abrir Accesos rápidos API Backend 
- Abrir Cliente: front.html (**esta en la raíz del proyecto**)
- Documentación **para realizar las pruebas** : http://localhost:3000/docs
  - probar tanto crear,actualizar,borrar presionando en **Try it out** -> **Execute**
    - eliminar tarea **requiere id**
    - actualizar requiere **requiere id y status**

---


### Base de Datos
- Se crea automáticamente en primera ejecución
- Migraciones automáticas en desarrollo **dev**
- Seeds opcionales para datos de prueba usado en **dev**

## 📚 Documentación API

**Swagger UI disponible en la ruta:** `/docs`
- Documentación de esquema **automática** generada desde usando Zod
- Interfaz interactiva para probar endpoints. **no WS**

## 📁 Arquitectura del Proyecto

```
├── src/
│   ├── app.ts              # Configuración de Express
│   ├── config/             # Configuraciones (Swagger, env)
│   ├── controllers/        # Recibe las solicitudes HTTP, valida y delega a los 'services'
│   ├── models/             # Modelo de Task
│   ├── database/           # DB y Migracion 
│   ├── routes/             # Definición de rutas de la API y del Servidor
│   ├── services/           # Lógica de negocio
│   ├── middleware/         # middlewares generales
│   ├── seed/               # Datos iniciales de prueba
│   ├── test/               # Tests unitarios
│   └── utils/              # Constantes comunes
├── server.ts               # Server
├── jest.config.js          # Config de Jest para testing
└── tsconfig.json           # Config de TypeScript
```
**Estructura siguiendo la separación de responsabilidades.**

## 🏗️ Decisiones Técnicas

### **Arquitectura**
- **Patrón Repository** para abstracción de datos
- **Patrón Singleton** para conexión DB
- **Service Layer** separando lógica de negocio
- **Middleware centralizado** para validaciones

### **TypeScript + Zod**
- **Validación mixta:** tiempo compilación (TS) y ejecución (Zod)
- **Schemas reutilizables** para validación en ejecucion y para generar documentación del schema

### **Base de Datos**
- **SQLite** por simplicidad y portabilidad
- **Migraciones automáticas** en startup en **dev**
- **Seeds** para datos de prueba

### **Manejo de Errores**
- Middleware centralizado
- Respuestas consistentes
- Logging estructurado

## 🎯 Funcionalidades Destacadas

- **TypeScript nativo:** ES2022 con módulos ES6+
- **Validación:** Zod + TypeScript 
- **Testing unitario:** Cobertura de servicios y API
- **WebSockets:** Sincronización automática entre clientes
- **Documentación automática:** OpenAPI generado desde código
- **Arquitectura escalable:** Preparada para crecimiento

## ✨ Middleware y Seguridad

- Express.json() - Parsing de JSON automático
- CORS - Política de origen cruzado configurada
- Helmet - Headers de seguridad HTTP
- Morgan - Logging de requests HTTP
- URL encoding - Manejo de formularios
- Middleware centralizado - Setup limpio y reutilizable

---

**Aplicación lista para producción con arquitectura profesional, documentación completa y testing robusto.**