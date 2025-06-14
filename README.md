# OFFCORSS - Prueba Técnica Frontend

Esta aplicación es una prueba técnica desarrollada con **React**, **TypeScript** y **Vite**. Permite la gestión y visualización de productos, así como la autenticación de usuarios mediante un backend desplegado.

## ¿Qué hace la aplicación?

- **Autenticación de usuarios** (login)
- **Visualización de productos** en lista y detalle
- **Edición de usuario autenticado**
- **Búsqueda y filtrado de productos**
- **Exportación de productos a CSV**
- **Consumo de API REST y GraphQL** para productos y usuarios

---

## ¿Cómo ejecutar la aplicación?

### 1. Clona el repositorio

```bash
git clone https://github.com/santiagogozu/PruebaTecnicaFrontOFFCORSS.git
cd PruebaTecnicaFrontOFFCORSS
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto y agrega la siguiente variable:

```
VITE_API_BASE_URL=https://offcorss-backend-production.up.railway.app
```

> **Nota:**  
> La variable `VITE_API_BASE_URL` debe contener la URL del backend. Actualmente, el backend ya está desplegado y configurado.

### 4. Ejecuta la aplicación en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173) (o el puerto que indique la terminal).

---

## Acceso a la aplicación

Para ingresar a la aplicación utiliza las siguientes credenciales:

- **Usuario:** `admin`
- **Contraseña:** `admin`

## Nota importante sobre el tiempo de respuesta

> **Importante:**  
> Debido a que el backend está desplegado en una plataforma gratuita, la primera interacción (por ejemplo, el login) puede demorar aproximadamente **50 segundos** en ejecutarse. Esto se debe a que el servidor entra en modo reposo cuando no recibe solicitudes por un tiempo y necesita "despertar" en la primera petición.  
> Una vez el backend esté activo, las siguientes interacciones funcionarán normalmente y de manera mucho más rápida.

---

## Notas adicionales

- El código fuente está organizado en carpetas por componentes, contextos, interfaces y servicios GraphQL.
- Puedes modificar la variable `VITE_API_BASE_URL` en el archivo `.env` si necesitas apuntar a otro backend.
