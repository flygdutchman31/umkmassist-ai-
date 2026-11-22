"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import image959 from "../public/products/959.webp";
import image960 from "../public/products/960.webp";
import image961 from "../public/products/961.webp";
import image962 from "../public/products/962.webp";
import image963 from "../public/products/963.webp";
import image964 from "../public/products/964.webp";
import image965 from "../public/products/965.webp";
import image966 from "../public/products/966.webp";
import image967 from "../public/products/967.webp";
import "./product-gallery.css";

const items = [
  { image: image959, id: "Meja kaca bertingkat", en: "Nested glass coffee tables", altId: "Dua meja kaca bertingkat dengan rangka besi hitam", altEn: "Nested glass coffee tables with black steel frames" },
  { image: image960, id: "Rak buku geometris", en: "Geometric bookshelf", altId: "Rak buku geometris dengan rangka hitam dan lapisan kayu", altEn: "Geometric bookshelf with black frame and wood lining" },
  { image: image961, id: "Rak dan panel TV", en: "TV panel and shelves", altId: "Panel televisi dengan rak kayu dan rangka besi", altEn: "Television panel with wooden shelves and steel frame" },
  { image: image962, id: "Meja TV industrial", en: "Industrial TV console", altId: "Meja TV panjang dengan rangka besi dan kabinet kayu", altEn: "Long TV console with steel frame and wooden cabinet" },
  { image: image963, id: "Rak pakaian terbuka", en: "Open clothing rack", altId: "Rak pakaian terbuka dengan rangka besi dan ukuran pada gambar", altEn: "Open steel-frame clothing rack with measurements shown" },
  { image: image964, id: "Inspirasi furnitur & pagar", en: "Furniture & gate ideas", altId: "Kolase referensi desain meja, rak, dan pagar", altEn: "Collage of table, shelving, and gate design references" },
  { image: image965, id: "Lemari kaca", en: "Glass wardrobe", altId: "Lemari dengan pintu kaca, rangka hitam, dan bagian dalam kayu", altEn: "Glass-door wardrobe with black frame and wooden interior" },
  { image: image966, id: "Meja TV rangka besi", en: "Steel-frame TV console", altId: "Meja TV kayu panjang dengan rangka besi hitam", altEn: "Long wooden TV console with black steel frame" },
  { image: image967, id: "Meja samping lingkar", en: "Circular-frame side table", altId: "Meja samping bundar dengan rangka berbentuk lingkaran", altEn: "Round side table with circular steel frame" },
];

export default function ProductGallery() {
  const { language } = useLanguage();
  const en = language === "en";
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected !== null && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [selected]);
  const item = selected === null ? null : items[selected];
  const close = () => dialog.current?.close();
  return <>
    <div className="gallery-grid">{items.map((product, index) => <article className="gallery-card" key={product.id}>
      <button type="button" className="gallery-image" onClick={() => setSelected(index)} aria-label={en ? `View ${product.en} in full` : `Lihat ${product.id} ukuran penuh`}>
        <img src={product.image.src} alt={en ? product.altEn : product.altId} loading="lazy" decoding="async" />
        <span className="gallery-number">{String(index + 1).padStart(2, "0")} / 09</span><span className="gallery-expand" aria-hidden="true">＋</span>
      </button>
      <div className="gallery-info"><span>{en ? "DESIGN REFERENCE" : "REFERENSI DESAIN"}</span><h3>{en ? product.en : product.id}</h3><a href="#pesan">{en ? "DISCUSS THIS DESIGN" : "DISKUSIKAN DESAIN"} <span aria-hidden="true">→</span></a></div>
    </article>)}</div>
    <dialog ref={dialog} className="gallery-dialog" onClose={() => setSelected(null)} aria-label={en ? "Full product image" : "Foto produk ukuran penuh"}>
      {item && <div className="gallery-modal"><div className="gallery-modal-top"><span>{String((selected ?? 0) + 1).padStart(2, "0")} / 09</span><button type="button" onClick={close} aria-label={en ? "Close image" : "Tutup foto"}>×</button></div><img src={item.image.src} alt={en ? item.altEn : item.altId} /><div className="gallery-modal-bottom"><strong>{en ? item.en : item.id}</strong><div><button type="button" onClick={() => setSelected(current => current === null ? 0 : (current + items.length - 1) % items.length)} aria-label={en ? "Previous image" : "Foto sebelumnya"}>←</button><button type="button" onClick={() => setSelected(current => current === null ? 0 : (current + 1) % items.length)} aria-label={en ? "Next image" : "Foto berikutnya"}>→</button></div></div></div>}
    </dialog>
  </>;
}
