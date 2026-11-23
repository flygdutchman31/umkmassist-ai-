"use client";

import { useLanguage } from "./LanguageProvider";

export default function OrderFaq() {
  const { language } = useLanguage();
  const english = language === "en";
  const items = english ? [
    { q: "How is the price determined?", a: "Pricing can be discussed after you share the design, approximate dimensions, materials, and any other requirements via WhatsApp." },
    { q: "Can I request a custom design?", a: "Yes. Tell us what you have in mind using the request form. You can also share a reference image in the WhatsApp conversation." },
    { q: "What if I don't know the exact dimensions?", a: "An approximate size is a useful starting point. We can discuss the details and measurements before agreeing on the work." },
    { q: "How long will my order take?", a: "The estimated timeframe depends on the details of the work. Please discuss it when requesting a quote." },
    { q: "Can delivery or installation be arranged?", a: "Please share your location and requirements via WhatsApp so we can discuss whether delivery or installation is possible." },
  ] : [
    { q: "Bagaimana harga ditentukan?", a: "Harga dapat dibahas setelah Anda menyampaikan desain, perkiraan ukuran, bahan, dan kebutuhan lainnya melalui WhatsApp." },
    { q: "Bisakah saya pesan desain sendiri?", a: "Bisa. Ceritakan ide Anda melalui formulir pesanan. Anda juga dapat mengirim gambar referensi dalam percakapan WhatsApp." },
    { q: "Bagaimana jika saya belum tahu ukuran pastinya?", a: "Perkiraan ukuran bisa menjadi titik awal. Detail dan pengukuran dapat dibahas sebelum pekerjaan disepakati." },
    { q: "Berapa lama pengerjaannya?", a: "Perkiraan waktu tergantung detail pekerjaan. Silakan tanyakan saat meminta penawaran." },
    { q: "Apakah bisa diantar atau dipasang?", a: "Sampaikan lokasi dan kebutuhan Anda melalui WhatsApp agar kita bisa membahas kemungkinan pengantaran atau pemasangan." },
  ];
  return <section className="faq-section section" id="faq" aria-labelledby="faq-title">
    <div className="faq-intro"><span className="section-label">{english ? "ORDER INFORMATION" : "INFORMASI PEMESANAN"}</span><h2 id="faq-title">{english ? <>GOOD TO<br />KNOW.</> : <>YANG PERLU<br />DIKETAHUI.</>}</h2><p>{english ? "A few helpful answers before we discuss your project." : "Beberapa jawaban untuk membantu Anda sebelum berkonsultasi."}</p><a href="#pesan">{english ? "TELL US ABOUT YOUR PROJECT" : "CERITAKAN KEBUTUHAN ANDA"} <span aria-hidden="true">→</span></a></div>
    <div className="faq-list">{items.map((item, index) => <details key={index}><summary><span className="faq-number">{String(index + 1).padStart(2, "0")}</span><span>{item.q}</span><span className="faq-toggle" aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div>
  </section>;
}
