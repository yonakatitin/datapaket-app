# DataPaket App 📶

Prototype web app e-commerce paket data internet berbasis IM3/myIM3, dibangun dengan React + MUI + json-server sebagai mock API.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-9-007FFF?logo=mui&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![json-server](https://img.shields.io/badge/json--server-1.0.0--beta-green)

---

## 📸 Preview

| Dashboard | Login | Transaksi |
|-----------|-------|-----------|
| Hero + Flash Sale + grid paket | Form login dengan konteks paket | Checkout 3 langkah |

| Riwayat Transaksi | Akun Saya |
|-------------------|-----------|
| List transaksi + filter status | Paket aktif + progress kuota |

---

## ✨ Fitur

- **Dashboard** — search bar, kategori tab scroll, flash sale countdown timer, best deal section, grid paket 2 kolom
- **Login** — autentikasi via mock API, redirect ke paket yang dipilih sebelum login
- **Transaksi** — checkout 3 langkah (detail nomor → pilih pembayaran → sukses), 7 metode pembayaran
- **Riwayat Transaksi** — list semua transaksi, filter by status, expandable detail, stats card
- **Akun Saya** — paket aktif + progress bar kuota, info akun, riwayat transaksi terbaru, logout
- **Auth flow** — belum login + klik Beli → redirect ke Login → setelah login langsung ke Transaksi
- **Persistent auth** — login state tersimpan di localStorage

---

## 🛠️ Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 19 + Vite |
| UI | Material UI (MUI) v9 |
| Routing | React Router DOM v7 |
| State | useState, useEffect, useContext (AuthContext) |
| Mock API | json-server v1 beta |
| HTTP | Fetch API native |

---

## 🚀 Cara Menjalankan

### 1. Clone repo

```bash
git clone https://github.com/USERNAME/datapaket-app.git
cd datapaket-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Jalankan app + mock API sekaligus

```bash
npm run dev:all
```

Atau jalankan terpisah di dua terminal:

```bash
# Terminal 1 — Mock API
npm run api
# → http://localhost:3001

# Terminal 2 — React App
npm run dev
# → http://localhost:5173
```

---

## 🔑 Akun Demo

| Email | Password | Keterangan |
|-------|----------|------------|
| `budi@example.com` | `password123` | Paket aktif Freedom Internet 20GB |
| `siti@example.com` | `password123` | Paket hampir habis (0.3 GB sisa) |

---

## 📁 Struktur Project

```
datapaket-app/
├── db.json                          # Mock database (json-server)
├── src/
│   ├── App.jsx                      # Root component + routing
│   ├── contexts/
│   │   └── AuthContext.jsx          # Global auth state (login/logout/updatePackage)
│   ├── components/
│   │   ├── Navbar.jsx               # Navbar responsive + auth-aware
│   │   ├── PackageCard.jsx          # Card paket dengan badge & harga
│   │   └── CategoryTabs.jsx         # Tab kategori horizontal scrollable
│   └── pages/
│       ├── Dashboard.jsx            # Halaman utama
│       ├── Login.jsx                # Form login
│       ├── Transaction.jsx          # Checkout 3 langkah
│       ├── TransactionHistory.jsx   # Riwayat transaksi
│       └── Customer.jsx             # Profil & paket aktif
```

---

## 🔌 Mock API Endpoints

Base URL: `http://localhost:3001`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/packages` | Semua paket data (14 paket) |
| GET | `/packages?category=...` | Filter by kategori |
| GET | `/users?email=...&password=...` | Login |
| GET | `/transactions?userId=...` | Riwayat transaksi by user |
| POST | `/transactions` | Buat transaksi baru |
| PATCH | `/users/:id` | Update paket aktif user |

---

## 🎨 Color Palette

| Token | Hex | Kegunaan |
|-------|-----|---------|
| Accent | `#E53935` | Primary action, badge, highlight |
| Navy | `#1F2D3D` | Background header, text utama |
| Background | `#F0F2F9` | Page background |

---

## 📦 Scripts

```bash
npm run dev        # Jalankan React dev server (port 5173)
npm run api        # Jalankan json-server (port 3001)
npm run dev:all    # Jalankan keduanya sekaligus
npm run build      # Build untuk production
npm run preview    # Preview hasil build
```

---

## 📝 Catatan

- Mock API menggunakan **json-server v1 beta** — data tersimpan langsung ke `db.json`
- Setiap pembelian otomatis mengupdate `activePackage` di profil user
- Tidak ada backend — hanya untuk prototype