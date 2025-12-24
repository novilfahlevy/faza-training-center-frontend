# 📚 Faza Training Center - Frontend

## 🎯 Pengenalan Singkat
Next.js 14 dan React.js aplikasi frontend untuk website manajemen pelatihan/kursus/seminar seputar medis bernama Faza Training Center (FTC) dengan 3 halaman utama:
- **Admin Dashboard**: Dashboard untuk mengelola semua data (pelatihan, pengguna, laporan, mitra)
- **Mitra Pages**: Halaman untuk mitra melihat informasi pelatihan dan pesertanya
- **Main Pages**: Halaman publik untuk peserta melihat dan mendaftar pelatihan

## 🚀 Cara menjalankan app
```bash
pnpm install

pnpm dev

# > faza-training-center@0.1.0 dev
# > next dev

# ▲ Next.js 14.2.33
# - Local:        http://localhost:3000
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

## 🏗 Alur Arsitektur

```
User membuka halaman
  ↓
Routes (di folder /app dan /routes.jsx, Next.js menentukan halaman yang sesuai)
  ↓
Layout (di folder /components/admin/layout atau /components/main, UI layout halaman)
  ↓
Components (di folder /components, komponen-komponen UI yang bisa digunakan ulang)
  ↓
Store/Context (di folder /stores dan /context, state management)
  ↓
HTTP Client (adminHttpClient.js atau mainHttpClient.js, komunikasi dengan backend)
  ↓
Render halaman ke user
```

## 📁 Struktur Folder
| Folder | Fungsi |
|--------|--------|
| `/src/app/` | App router Next.js 14 (page routes dan API routes). |
| `/src/components/` | Komponen-komponen React yang bisa digunakan ulang. |
| `/src/stores/` | State management global menggunakan Zustand. |
| `/src/context/` | Context API untuk state management (Material Tailwind, etc). |
| `/src/configs/` | Konfigurasi-konfigurasi aplikasi (charts config, dll). |
| `/src/css/` | Stylesheet CSS dan Tailwind CSS. |
| `/src/data/` | Data statis atau mock data untuk pengembangan. |
| `/src/lib/` | Fungsi-fungsi utility dan library helper. |
| `/src/middleware.js` | Middleware Next.js untuk route protection dan redirects. |
| `/src/routes.jsx` | Definisi routes untuk admin dashboard. |
| `/src/adminHttpClient.js` | Axios instance untuk komunikasi dengan backend (admin routes). |
| `/src/mainHttpClient.js` | Axios instance untuk komunikasi dengan backend (main/public routes). |
| `/public/` | Static assets (gambar, icon, dll). |

## 🏗 Struktur Components
| Folder | Fungsi |
|--------|--------|
| `/components/admin/` | Komponen-komponen untuk admin dashboard. |
| `/components/admin/auth/` | Komponen login admin. |
| `/components/admin/cards/` | Card components untuk dashboard. |
| `/components/admin/charts/` | Chart components untuk visualisasi data. |
| `/components/admin/layout/` | Layout wrapper untuk admin pages. |
| `/components/admin/pelatihan/` | Komponen untuk manajemen pelatihan. |
| `/components/admin/pengguna/` | Komponen untuk manajemen pengguna. |
| `/components/admin/laporan-kegiatan/` | Komponen untuk manajemen laporan kegiatan. |
| `/components/admin/mitra/` | Komponen untuk manajemen mitra. |
| `/components/main/` | Komponen-komponen untuk halaman publik (peserta). |

## 🔐 State Management

### Authentication Store (Zustand)
**File:** `/src/stores/useAuthStore.js`

Menyimpan state autentikasi global (token, user data):
```javascript
const { token, user, login, logout } = useAuthStore();
```

### Configurator Context (Context API)
**File:** `/src/context/index.jsx`

Menyimpan state UI seperti sidebar state, navbar transparency, dll.

## 🌐 HTTP Clients

### Admin HTTP Client
**File:** `/src/adminHttpClient.js`

Instance Axios untuk admin routes dengan:
- Base URL ke backend admin endpoints
- Automatic token injection dari auth store
- Error handling dan redirect ke login jika unauthorized

### Main HTTP Client
**File:** `/src/mainHttpClient.js`

Instance Axios untuk public/main routes:
- Base URL ke backend public endpoints
- Automatic token injection jika user sudah login
- Handling untuk publik routes (tidak perlu auth)

## 🛣️ Pages Structure (App Router)

```
/src/app/
├── (main)/                    # Group untuk main/publik pages
│   ├── page.jsx              # Homepage
│   ├── pelatihan/            # Halaman daftar pelatihan
│   │   └── [id]/             # Detail pelatihan
│   ├── mitra/                # Halaman daftar mitra
│   ├── profile/              # Profile user
│   └── layout.jsx            # Layout untuk main pages
│
├── admin/                     # Group untuk admin pages
│   ├── page.jsx              # Admin dashboard
│   ├── pelatihan/            # Manajemen pelatihan
│   ├── pengguna/             # Manajemen pengguna
│   ├── laporan-kegiatan/     # Manajemen laporan kegiatan
│   └── layout.jsx            # Layout untuk admin pages
│
└── api/                       # API routes Next.js (optional)
    └── auth/                  # API routes untuk auth
```

## 🔐 Route Protection (Middleware)

**File:** `/src/middleware.js`

Middleware Next.js untuk:
- Validasi token user
- Redirect ke login jika tidak terautentikasi
- Redirect ke dashboard sesuai role (admin/peserta/mitra)
- CSRF protection

## 📋 Admin Routes Definition

### Dashboard
```
/admin                    # Admin dashboard dengan statistics
```

### Pelatihan Management
```
/admin/pelatihan         # List semua pelatihan (CRUD)
/admin/pelatihan/create  # Create pelatihan baru
/admin/pelatihan/[id]    # Detail & edit pelatihan
```

### Pengguna Management
```
/admin/pengguna          # List pengguna (CRUD)
/admin/pengguna/create   # Create pengguna baru
/admin/pengguna/[id]     # Detail & edit pengguna
```

### Laporan Kegiatan Management
```
/admin/laporan-kegiatan          # List laporan kegiatan (CRUD)
/admin/laporan-kegiatan/create   # Create laporan baru
/admin/laporan-kegiatan/[id]     # Detail & edit laporan
```

### Mitra Management
```
/admin/mitra             # List mitra (view)
```

## 📋 Main Routes Definition

### Publik Routes
```
/                        # Homepage
/pelatihan              # List pelatihan publik
/pelatihan/[id]         # Detail pelatihan
/mitra                  # List mitra
/profile                # User profile (perlu login)
```

### Auth Routes
```
/auth/login             # Login page
/auth/register          # Register page
```

## 🎯 Saat Coding

### Menambah Page Baru
1. Buat folder di `/src/app/` sesuai hierarchy yang diinginkan
2. Buat file `page.jsx` di folder tersebut
3. Buat layout jika perlu dengan file `layout.jsx`
4. Import dan gunakan components dari `/src/components/`

### Menambah Component Baru
1. Buat file di `/src/components/` sesuai kategori (admin/main/shared)
2. Export component sebagai default atau named export
3. Buat prop types documentation
4. Import di page atau component parent

### Membuat API Call
1. Gunakan `adminHttpClient` atau `mainHttpClient` yang sudah ada
2. Contoh:
```javascript
import { adminHttpClient } from '@/adminHttpClient';

const response = await adminHttpClient.get('/pelatihan');
const data = response.data;
```

### Update Auth State
```javascript
import { useAuthStore } from '@/stores/useAuthStore';

const { login, logout } = useAuthStore();

// Saat login berhasil
login(token, userData);

// Saat logout
logout();
```

## 🚀 Scripts Available

```bash
pnpm dev       # Jalankan development server
pnpm build     # Build untuk production
pnpm start     # Jalankan production server
pnpm lint      # Jalankan ESLint
```

## 🌍 Environment Variables

Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Faza Training Center
```

## 📦 Tech Stack

- **Framework:** Next.js 14.2.33
- **React:** 18.2.0
- **Styling:** Tailwind CSS 3.3.4
- **State Management:** Zustand 5.0.8 + Context API
- **HTTP Client:** Axios 1.13.2
- **Form:** React Hook Form 7.66.0 + Yup 1.7.1
- **UI Components:** Material Tailwind React 2.1.4
- **Icons:** Heroicons React 2.0.18
- **Rich Editor:** React Quill 2.0.0
- **Date:** date-fns 4.1.0

---

Untuk dokumentasi backend API, lihat [faza-training-center-backend/README.md](../faza-training-center-backend/README.md)
