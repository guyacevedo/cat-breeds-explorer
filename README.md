# Cat Breeds Explorer

Aplicación full‑stack para explorar razas de gatos, consumiendo
[TheCatAPI](https://thecatapi.com/). Monorepo con **frontend Angular 20 (SPA)** +
**backend Node/Express + MongoDB**, contenerizado con Docker Compose.

Prueba técnica Full‑Stack. Diseño generado en Google Stitch ("Feline Ethos"),
arquitectura por capas, SOLID y pruebas unitarias (patrón AAA).

## Arquitectura

```
cat-breeds/
├─ frontend/   Angular 20 · Signals · inject() · control flow @if/@for · Tailwind · Vitest
├─ backend/    Express · TypeScript · Mongoose · JWT · Vitest (capas controller/service/model)
├─ design/     Artefactos descargados de Google Stitch (HTML de referencia)
└─ docker-compose.yml
```

### Decisiones técnicas
- **Backend independiente (no SSR).** El SSR de Angular no se usa para la API: la lógica
  de negocio (TheCatAPI, Mongo, JWT) vive en un Express aislado para respetar la separación
  de capas. Angular se entrega como SPA estática servida por nginx.
- **Auth con POST + JWT + bcrypt.** El enunciado pedía `GET /login` y `GET /Register`, pero
  enviar credenciales por GET las expone en URLs/logs. Se usan `POST /api/auth/login` y
  `POST /api/auth/register` con hash bcrypt y JWT. Desviación documentada e intencional.
- **Despliegue: Docker local** (no GitHub Pages, que es estático y no ejecuta Node/Mongo).

## API REST (backend)

| Método | Endpoint                                   | Descripción                              |
|--------|--------------------------------------------|------------------------------------------|
| GET    | `/api/breeds`                              | Lista de razas                           |
| GET    | `/api/breeds/search?q=`                    | Búsqueda de razas                        |
| GET    | `/api/breeds/:breed_id`                    | Raza específica                          |
| GET    | `/api/images/imagesbybreedid?breed_id=`    | Imágenes de una raza                     |
| POST   | `/api/auth/register`                       | Registro de usuario (Mongo + bcrypt)     |
| POST   | `/api/auth/login`                          | Login, devuelve usuario + JWT            |
| GET    | `/api/auth/me`                             | Usuario logueado (protegido por JWT)     |

Errores con esquema inmutable: `{ "error", "code", "timestamp" }`.

## Vistas (frontend)
1. **Explorer** (`/explorer`) — dropdown de razas + carrusel de imágenes + info de la raza.
2. **Breed Table** (`/table`) — tabla de datos relevantes con **filtro de búsqueda por texto**.
3. **Login** (`/login`).
4. **Register** (`/register`).
5. **Profile** (`/profile`) — vista protegida por `authGuard` con la info del usuario.

## Puesta en marcha

### Opción A — Docker Compose (recomendado)
```bash
cp .env.example .env          # setear CAT_API_KEY y JWT_SECRET
docker compose up --build
```
- Frontend: http://localhost:8080
- Backend:  http://localhost:3000/api/health
- MongoDB:  localhost:27017

### Opción B — Local (sin Docker)
```bash
# Backend
cd backend && cp .env.example .env   # editar valores
npm install && npm run dev

# Frontend (otra terminal)
cd frontend && npm install && npm start   # http://localhost:4200 (proxy /api -> :3000)
```
Requiere MongoDB local en `mongodb://localhost:27017` (o ajustar `MONGO_URI`).

## Pruebas
```bash
cd backend  && npm test      # Vitest — services, auth (AAA)
cd frontend && npm test      # Vitest — service, guard, interceptor, tabla (AAA)
```

## Variables de entorno
| Variable        | Descripción                              |
|-----------------|------------------------------------------|
| `CAT_API_KEY`   | API key de TheCatAPI (no se commitea)    |
| `CAT_API_URL`   | Base URL de TheCatAPI (`/v1`)            |
| `MONGO_URI`     | Cadena de conexión a MongoDB             |
| `JWT_SECRET`    | Secreto para firmar JWT                  |
| `JWT_EXPIRES_IN`| Expiración del token (p.ej. `1d`)        |

> El `.env` real **nunca** se sube al repositorio (ver `.gitignore`).
