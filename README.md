# Ruang — Asisten Produktivitas AI

Aplikasi produktivitas dengan daftar tugas lokal dan tiga alat AI: ringkasan, rencana, dan penulisan ulang.

## Menjalankan

```sh
npm ci
npm run dev
```

Buka aplikasi, lalu masukkan kunci API OpenAI pribadi melalui **Pengaturan kunci API** untuk menggunakan alat AI. Kunci hanya disimpan di memori halaman selama tab terbuka dan dikirim ke server aplikasi untuk diteruskan ke OpenAI; jangan gunakan kunci di situs yang tidak dipercaya. Pemrosesan AI menggunakan API berbayar sesuai akun OpenAI pemilik kunci. Teks yang dikirim akan diproses oleh OpenAI; hindari memasukkan informasi sensitif. Model dapat diubah melalui variabel server `OPENAI_MODEL` (default `gpt-4.1-mini`).

Daftar tugas tersimpan di browser perangkat ini, bukan disinkronkan ke akun atau perangkat lain. Menutup atau me-refresh halaman menghapus kunci dari memori, bukan daftar tugas.
