import FurnitureViewer from "./FurnitureViewer";
import RequestForm from "./RequestForm";
import workshop from "../public/welding/workshop.jpg";
import furniture from "../public/welding/furniture.jpg";
import interior from "../public/welding/interior.jpg";

const phone = "6287861045484";
const greeting = "Halo, saya ingin bertanya tentang jasa las dan furnitur custom.";
const whatsapp = `https://wa.me/${phone}?text=${encodeURIComponent(greeting)}`;
const products = [
  { number: "01", type: "FURNITUR", name: "Meja custom", description: "Meja dengan rangka besi yang dibuat sesuai kebutuhan ruang.", image: interior.src, alt: "Inspirasi meja dengan rangka besi di ruang kerja" },
  { number: "02", type: "FURNITUR", name: "Kursi & bangku", description: "Desain dudukan untuk rumah, kafe, atau ruang usaha.", image: furniture.src, alt: "Inspirasi meja dan kursi untuk ruang makan" },
  { number: "03", type: "PEMBUATAN", name: "Rangka & konstruksi", description: "Pembuatan rangka besi dan pekerjaan las sesuai permintaan.", image: workshop.src, alt: "Pengerjaan besi di bengkel" },
];

function WhatsAppIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.2 11.6a8.3 8.3 0 0 1-12.4 7.2L3 20l1.2-4.7a8.3 8.3 0 1 1 16-3.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M8.5 7.8c.3-.4.6-.4.9-.4h.4c.1 0 .3.1.4.4l.7 1.6c.1.2 0 .4-.1.5l-.6.8c-.1.1-.1.3 0 .5.4.7 1.5 1.8 2.5 2.3.2.1.4.1.5 0l.8-.9c.1-.2.3-.2.5-.1l1.6.8c.2.1.3.2.3.4 0 .3-.1 1-.5 1.3-.4.4-1.1.6-1.8.5-1.1-.2-2.8-.9-4.3-2.4-1.3-1.4-2.2-2.9-2.3-4.1-.1-.5.2-1 .4-1.2Z" fill="currentColor"/></svg>; }

export default function Home() {
  return <div className="site" id="beranda">
    <div className="announcement"><span>JASA LAS & PEMBUATAN FURNITUR CUSTOM</span><span>BUAT SESUAI KEBUTUHAN ANDA <b>↗</b></span></div>
    <header className="header"><a href="#beranda" className="brand" aria-label="Bengkel Besi, beranda"><span className="brand-symbol">B<span>✳</span></span><span className="brand-name">BENGKEL<span> / </span>BESI<small>LAS & FURNITUR CUSTOM</small></span></a><nav aria-label="Navigasi utama"><a href="#produk">Produk</a><a href="#layanan">Layanan</a><a href="#proses">Cara pesan</a></nav><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="header-contact"><WhatsAppIcon/> <span>Hubungi kami</span> <b>↗</b></a></header>
    <main>
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="dot"/> DIBUAT SESUAI KEBUTUHAN ANDA</div><h1>DARI BESI,<br/><em>JADI NYATA.</em></h1><p>Punya desain sendiri atau sekadar ide? Mari wujudkan furnitur dan kebutuhan besi yang pas untuk ruang Anda.</p><div className="hero-actions"><a className="button button-orange" href="#pesan">CERITAKAN KEBUTUHAN <span>↗</span></a><a className="hero-secondary" href="#produk">Lihat inspirasi produk <span>↓</span></a></div><div className="hero-note"><span>01 / BENGKEL LAS</span><span>DIRANCANG UNTUK ANDA</span></div></div><div className="hero-image"><img src={workshop.src} alt="Proses pengerjaan besi dengan percikan api di bengkel"/><div className="image-shade"/><span className="image-caption">PROSES YANG TELITI<br/><strong>HASIL YANG BERARTI.</strong></span><span className="image-index">B / 01 — 03</span></div><span className="hero-corner">✳</span></section>
      <div className="service-strip"><span>FURNITUR CUSTOM</span><b>✳</b><span>PEKERJAAN LAS</span><b>✳</b><span>RANGKA BESI</span><b>✳</b><span>DESAIN SESUAI KEBUTUHAN</span></div>
      <section className="products section" id="produk"><div className="section-heading"><div><span className="section-label">01 / APA YANG BISA DIBUAT</span><h2>DIBUAT UNTUK<br/><em>RUANG ANDA.</em></h2></div><div className="heading-side"><p>Dari ide sederhana hingga furnitur impian. Sesuaikan ukuran, bentuk, dan kebutuhan Anda.</p><a href="#pesan">PUNYA IDE SENDIRI? <span>↗</span></a></div></div><div className="product-grid">{products.map(product=><article className="product-card" key={product.number}><div className="product-image"><img src={product.image} alt={product.alt}/><span className="product-number">{product.number} / 03</span><a href="#pesan" aria-label={`Tanyakan ${product.name}`} className="product-arrow">↗</a></div><div className="product-content"><span className="product-type">{product.type}</span><h3>{product.name}</h3><p>{product.description}</p><a href="#pesan">TANYAKAN PRODUK INI <span>↗</span></a></div></article>)}</div><p className="image-disclaimer">Foto sebagai inspirasi. Produk dapat dibuat sesuai permintaan dan kesepakatan.</p></section>
      <FurnitureViewer />
      <section className="about section" id="layanan"><div className="about-label"><span className="section-label">02 / LEBIH DARI SEKADAR LAS</span><span className="about-star">✳</span></div><div className="about-main"><h2>IDE ANDA.<br/><em>KAMI WUJUDKAN.</em></h2><p>Setiap ruang punya kebutuhan yang berbeda. Diskusikan ide, ukuran, dan model yang Anda inginkan, lalu kita cari solusi yang sesuai.</p><div className="service-list"><div><span>01</span><strong>Furnitur custom</strong><span>↗</span></div><div><span>02</span><strong>Pengelasan & rangka besi</strong><span>↗</span></div><div><span>03</span><strong>Diskusi desain & ukuran</strong><span>↗</span></div></div></div></section>
      <section className="process section" id="proses"><div className="section-heading"><div><span className="section-label">03 / CARA PEMESANAN</span><h2>MUDAH DARI<br/><em>AWAL.</em></h2></div><p className="process-intro">Tak perlu punya gambar lengkap. Ceritakan saja ide Anda, kita bahas bersama.</p></div><div className="process-grid"><article><span>01</span><h3>Ceritakan ide</h3><p>Isi kebutuhan, ukuran perkiraan, dan model yang diinginkan.</p></article><article><span>02</span><h3>Diskusi bersama</h3><p>Kirim pesan lewat WhatsApp untuk membahas detail dan penawaran.</p></article><article><span>03</span><h3>Mulai pengerjaan</h3><p>Setelah detail disepakati, pesanan dapat mulai dikerjakan.</p></article></div></section>
      <RequestForm phone={phone}/>
      <section className="closing"><div><span className="section-label">PUNYA PERTANYAAN?</span><h2>MARI KITA<br/><em>BICARAKAN.</em></h2></div><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="button button-orange"><WhatsAppIcon/> CHAT VIA WHATSAPP <span>↗</span></a></section>
    </main>
    <footer><a href="#beranda" className="footer-brand">BENGKEL <span>/</span> BESI<span>.</span></a><p>JASA LAS & FURNITUR CUSTOM</p><a href="#beranda">KEMBALI KE ATAS ↑</a></footer>
  </div>;
}
