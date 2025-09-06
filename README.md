# 💼 HRIS - Human Resource Information System

A modern, AI-assisted Human Resource Information System built from scratch using **Next.js** and **PostgreSQL**.  
This project integrates ideas and code generated with the help of **Motiff**, **Bolts**, and **CursorAI**.

---

## 🚀 Tech Stack

- ⚛️ [Next.js](https://nextjs.org/)
- 🛢️ [PostgreSQL](https://www.postgresql.org/)
- 🧪 [Prisma ORM](https://www.prisma.io/) _(if applicable)_
- 💨 [Tailwind CSS](https://tailwindcss.com/) _(if applicable)_
- 🤖 AI tools: Motiff, Bolts, CursorAI

---

## 🛠️ Installation

### 1. Clone the repository

```
git clone https://github.com/expressa002/hr_nextjs.git
cd hr_nextjs
```

```
npm install
# or
yarn install
```

# ⚙️ Environment Setup

To run the project, you need to configure environment variables.

Step-by-step:

## 1. Create a .env file in the root directory:

```
touch .env
```

Copy the content from the readmefirst.txt file:

```
cat readmefirst.txt >> .env
```

Verify that .env has been populated correctly.

# 🧪 Running the Project

```
npm run dev
# or
yarn dev
```

Visit http://localhost:3000 in your browser.

## Master Data CRUD

### Fitur Master CRUD

- Bank
- Shift
- Department
- Location
- Holiday

### Cara Menambah/Edit/Hapus Master

1. Buka menu **Settings** > tab master yang diinginkan (Bank, Shift, dsb).
2. Gunakan tombol **Tambah** untuk menambah data baru.
3. Klik ikon **Edit** untuk mengubah data.
4. Klik ikon **Hapus** untuk menghapus data (dengan konfirmasi).
5. Semua aksi CRUD sudah mendukung validasi, notifikasi, dan loading state.

### Integrasi Dropdown Master di Form

- Form **Tambah/Edit Karyawan**: dropdown Bank, Department, Shift, Location otomatis terisi dari master.
- Form **Tambah/Edit Kontrak**: dropdown Employee, Department, Shift, Location otomatis terisi dari master.
- Untuk menambah dropdown master di form lain, fetch data dari endpoint `/api/master/{master}/list` dan gunakan `<select>` dengan value id master.

### Validasi & Error Handling

- Field wajib (required) dan unique sudah divalidasi di frontend & backend.
- Error dari backend (misal: duplikat, constraint) akan tampil di modal/form.
- Tombol Simpan akan disable saat loading.
- Notifikasi sukses/gagal akan muncul di kanan atas.

### Catatan

- Untuk menambah master baru, duplikasi pola CRUD yang sudah ada.
- Untuk membatasi akses CRUD master, implementasikan role-based access di backend/frontend.
