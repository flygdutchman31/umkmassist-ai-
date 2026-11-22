"use client";

import type { FormEvent } from "react";
import "./request-form.css";

type RequestFormProps = {
  phone: string;
};

export default function RequestForm({ phone }: RequestFormProps) {
  const whatsappNumber = phone.replace(/\D/g, "");
  const isConfigured = whatsappNumber.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const product = String(formData.get("product") ?? "").trim();
    const dimensions = String(formData.get("dimensions") ?? "").trim();
    const details = String(formData.get("details") ?? "").trim();
    const message = [
      "Halo, saya ingin konsultasi dan meminta penawaran pembuatan furnitur/produk las.",
      "",
      `Nama: ${name}`,
      `Produk: ${product}`,
      `Ukuran: ${dimensions}`,
      ...(details ? [`Catatan: ${details}`] : []),
    ].join("\n");

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <section className="request-section" id="pesan" aria-labelledby="request-title">
      <div className="request-intro">
        <p className="request-kicker">DIBUAT SESUAI KEBUTUHAN</p>
        <h2 id="request-title">Punya ide? Mari kita wujudkan.</h2>
        <p className="request-lead">
          Ceritakan kebutuhan Anda. Saya akan membantu menentukan bahan, ukuran,
          dan perkiraan pengerjaan.
        </p>
        <div className="request-note">
          <span className="request-note-mark" aria-hidden="true">✳</span>
          <p>Mulai dari pagar dan rak sampai meja, kursi, atau furnitur custom.</p>
        </div>
      </div>

      <form className="request-card" onSubmit={handleSubmit}>
        <div className="request-card-heading">
          <div>
            <p className="request-card-kicker">FORM PERMINTAAN</p>
            <h3>Ceritakan pesanan Anda</h3>
          </div>
          <span className="request-step" aria-hidden="true">01 / 01</span>
        </div>

        <div className="request-fields">
          <div className="request-field">
            <label htmlFor="request-name">Nama Anda <span aria-hidden="true">*</span></label>
            <input
              id="request-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>

          <div className="request-field">
            <label htmlFor="request-product">Produk yang ingin dibuat <span aria-hidden="true">*</span></label>
            <select id="request-product" name="product" defaultValue="" required>
              <option value="" disabled>Pilih jenis produk</option>
              <option>Pagar atau gerbang</option>
              <option>Kanopi atau rangka</option>
              <option>Meja atau kursi</option>
              <option>Rak atau lemari</option>
              <option>Furnitur custom</option>
              <option>Lainnya</option>
            </select>
          </div>

          <div className="request-field">
            <label htmlFor="request-dimensions">Ukuran / dimensi <span aria-hidden="true">*</span></label>
            <input
              id="request-dimensions"
              name="dimensions"
              type="text"
              placeholder="Contoh: panjang 2 m × tinggi 1 m"
              required
            />
            <span className="request-hint">Perkiraan ukuran juga boleh.</span>
          </div>

          <div className="request-field">
            <label htmlFor="request-details">Detail tambahan <span className="request-optional">(opsional)</span></label>
            <textarea
              id="request-details"
              name="details"
              rows={4}
              placeholder="Bahan, warna, lokasi pemasangan, atau contoh yang diinginkan..."
            />
          </div>
        </div>

        {!isConfigured && (
          <p className="request-unconfigured" role="status">
            Pemilik belum mengatur nomor WhatsApp, jadi permintaan belum dapat dikirim.
          </p>
        )}
        <button className="request-submit" type="submit" disabled={!isConfigured}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.57 0 .26 5.3.25 11.82c0 2.08.54 4.1 1.57 5.89L.15 24l6.45-1.69a11.9 11.9 0 0 0 5.5 1.4h.01c6.52 0 11.83-5.3 11.84-11.82a11.75 11.75 0 0 0-3.43-8.41ZM12.1 21.7a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.83 1 1.02-3.73-.24-.38a9.82 9.82 0 0 1-1.51-5.18c0-5.5 4.47-9.96 9.97-9.96a9.9 9.9 0 0 1 7.04 2.92 9.9 9.9 0 0 1 2.91 7.05c0 5.49-4.47 9.95-9.96 9.95Zm5.47-7.46c-.3-.15-1.78-.88-2.06-.98-.28-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.9 1.22 3.1c.15.2 2.1 3.21 5.1 4.5.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
          </svg>
          <span>{isConfigured ? "Kirim permintaan via WhatsApp" : "WhatsApp belum tersedia"}</span>
          {isConfigured && <span className="request-arrow" aria-hidden="true">↗</span>}
        </button>
        <p className="request-privacy">Pesan akan dibuka di WhatsApp untuk Anda tinjau sebelum dikirim.</p>
      </form>
    </section>
  );
}
