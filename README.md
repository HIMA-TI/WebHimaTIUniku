# Web Himpunan (Frontend)

## Setup

1) Install dependencies

```bash
npm install
```

2) Konfigurasi env

- Copy `.env.example` → `.env`
- Atur value sesuai backend kamu

### Opsi A (disarankan): Dev pakai proxy (tanpa CORS)

Di `.env`:

```env
VITE_API_BASE_URL=/api
DEV_API_PROXY_TARGET=http://localhost:3000
```

- Frontend akan request ke `/api/*`
- Vite dev server akan proxy ke `DEV_API_PROXY_TARGET`

### Opsi B: Langsung ke URL backend (butuh CORS di backend)

Di `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Pastikan backend mengizinkan origin dev Vite (biasanya `http://localhost:5173`).

3) Jalankan

```bash
npm run dev
```
