'use client';

import ArrowIcon from "./ArrowIcon";
import WeldingVideo from "./WeldingVideo";
import FurnitureViewer from "./FurnitureViewer";
import RequestForm from "./RequestForm";
import { LanguageSwitcher, useLanguage } from "./LanguageProvider";
import furniture from "../public/welding/furniture.jpg";
import interior from "../public/welding/interior.jpg";
import steelWork from "../public/welding/steel-work.jpg";

const phone = "6287861045484";

function BrandMark() {
  return <svg className="brand-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M5 5h39l15 15v39H20L5 44V5Z" fill="#202422"/><path d="M15 15h20l10 10v14L35 49H15V15Z" stroke="#F4F2EB" strokeWidth="5" strokeLinejoin="bevel"/><path d="M25 23v17h11l6-6" stroke="#F4F2EB" strokeWidth="4" strokeLinejoin="bevel"/><path d="M48 6v9M43.5 10.5h9M44.8 7.3l6.4 6.4M51.2 7.3l-6.4 6.4" stroke="#ED673B" strokeWidth="2" strokeLinecap="square"/><path d="m43 48 7-7v8h-7Z" fill="#ED673B"/></svg>;
}

function WhatsAppIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.2 11.6a8.3 8.3 0 0 1-12.4 7.2L3 20l1.2-4.7a8.3 8.3 0 1 1 16-3.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M8.5 7.8c.3-.4.6-.4.9-.4h.4c.1 0 .3.1.4.4l.7 1.6c.1.2 0 .4-.1.5l-.6.8c-.1.1-.1.3 0 .5.4.7 1.5 1.8 2.5 2.3.2.1.4.1.5 0l.8-.9c.1-.2.3-.2.5-.1l1.6.8c.2.1.3.2.3.4 0 .3-.1 1-.5 1.3-.4.4-1.1.6-1.8.5-1.1-.2-2.8-.9-4.3-2.4-1.3-1.4-2.2-2.9-2.3-4.1-.1-.5.2-1 .4-1.2Z" fill="currentColor"/></svg>; }

export default function Home() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const greeting = isEnglish
    ? "Hello, I would like to ask about your welding and custom furniture services."
    : "Halo, saya ingin bertanya tentang jasa las dan furnitur custom.";
  const whatsapp = `https://wa.me/${phone}?text=${encodeURIComponent(greeting)}`;
  const products = [
    {
      number: "01",
      type: isEnglish ? "FURNITURE" : "FURNITUR",
      name: isEnglish ? "Custom tables" : "Meja custom",
      description: isEnglish
        ? "Steel-frame tables made to suit your space."
        : "Meja dengan rangka besi yang dibuat sesuai kebutuhan ruang.",
      image: interior.src,
      alt: isEnglish
        ? "Steel-frame table inspiration in a workspace"
        : "Inspirasi meja dengan rangka besi di ruang kerja",
    },
    {
      number: "02",
      type: isEnglish ? "FURNITURE" : "FURNITUR",
      name: isEnglish ? "Chairs & benches" : "Kursi & bangku",
      description: isEnglish
        ? "Seating designs for homes, cafés, or workplaces."
        : "Desain dudukan untuk rumah, kafe, atau ruang usaha.",
      image: furniture.src,
      alt: isEnglish
        ? "Table and chair inspiration for a dining room"
        : "Inspirasi meja dan kursi untuk ruang makan",
    },
    {
      number: "03",
      type: isEnglish ? "FABRICATION" : "PEMBUATAN",
      name: isEnglish ? "Frames & construction" : "Rangka & konstruksi",
      description: isEnglish
        ? "Custom steel frames and welding to suit your needs."
        : "Pembuatan rangka besi dan pekerjaan las sesuai permintaan.",
      image: steelWork.src,
      alt: isEnglish
        ? "Worker welding a steel joint with protective equipment"
        : "Pekerja mengelas sambungan besi dengan perlengkapan pelindung",
    },
  ];

  return <div className="site" id="beranda">

    <header className="header"><a href="#beranda" className="brand" aria-label={isEnglish ? "Deni Jaya Las, home" : "Deni Jaya Las, beranda"}><BrandMark /><span className="brand-name">DENI JAYA<span> / </span>LAS<small>{isEnglish ? "CUSTOM WELDING & FURNITURE" : "LAS & FURNITUR CUSTOM"}</small></span></a><nav aria-label={isEnglish ? "Main navigation" : "Navigasi utama"}><a href="#produk">{isEnglish ? "Products" : "Produk"}</a><a href="#layanan">{isEnglish ? "Services" : "Layanan"}</a><a href="#proses">{isEnglish ? "How to order" : "Cara pesan"}</a></nav><LanguageSwitcher /><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="header-contact"><WhatsAppIcon/> <span>{isEnglish ? "Contact us" : "Hubungi kami"}</span> <b><ArrowIcon /></b></a></header>
    <main>
      <section className="hero"><WeldingVideo poster={steelWork.src} src="/welding/new-welding.mp4" /><div className="hero-copy"><div className="eyebrow">{isEnglish ? "DENI JAYA LAS / FURNITURE & CONSTRUCTION" : "DENI JAYA LAS / FURNITUR & KONSTRUKSI"}</div><h1>{isEnglish ? <>BUILT STRONG.<br/><em>BUILT RIGHT.</em></> : <>DIBUAT KUAT.<br/><em>DIBUAT TEPAT.</em></>}</h1><p>{isEnglish ? "Custom welding and steel furniture for your home, business, and space." : "Jasa pengelasan dan furnitur besi custom untuk kebutuhan rumah, usaha, dan ruang Anda."}</p><div className="hero-actions"><a className="button button-orange" href="#pesan">{isEnglish ? "TELL US WHAT YOU NEED" : "CERITAKAN KEBUTUHAN"} <span><ArrowIcon /></span></a><a className="hero-secondary" href="#produk">{isEnglish ? "Explore product ideas" : "Lihat inspirasi produk"} <span><ArrowIcon direction="down" /></span></a></div><div className="hero-note"><span>01 / 03</span><span>{isEnglish ? "SCROLL TO EXPLORE" : "SCROLL UNTUK MENJELAJAHI"}</span></div></div></section>

      <section className="products section" id="produk"><div className="section-heading"><div><span className="section-label">01 / {isEnglish ? "WHAT WE CAN MAKE" : "APA YANG BISA DIBUAT"}</span><h2>{isEnglish ? <>MADE FOR<br/><em>YOUR SPACE.</em></> : <>DIBUAT UNTUK<br/><em>RUANG ANDA.</em></>}</h2></div><div className="heading-side"><p>{isEnglish ? "From a simple idea to your dream furniture. Choose the size, shape, and features you need." : "Dari ide sederhana hingga furnitur impian. Sesuaikan ukuran, bentuk, dan kebutuhan Anda."}</p><a href="#pesan">{isEnglish ? "HAVE AN IDEA?" : "PUNYA IDE SENDIRI?"} <span><ArrowIcon /></span></a></div></div><div className="product-grid">{products.map(product=><article className="product-card" key={product.number}><div className="product-image"><img src={product.image} alt={product.alt}/><span className="product-number">{product.number} / 03</span><a href="#pesan" aria-label={isEnglish ? `Ask about ${product.name}` : `Tanyakan ${product.name}`} className="product-arrow"><ArrowIcon /></a></div><div className="product-content"><span className="product-type">{product.type}</span><h3>{product.name}</h3><p>{product.description}</p><a href="#pesan">{isEnglish ? "ASK ABOUT THIS PRODUCT" : "TANYAKAN PRODUK INI"} <span><ArrowIcon /></span></a></div></article>)}</div><p className="image-disclaimer">{isEnglish ? "Videos and photos are illustrative, not documentation of workshop jobs. Products are made to order by agreement." : "Video dan foto sebagai ilustrasi, bukan dokumentasi pekerjaan bengkel. Produk dibuat sesuai permintaan dan kesepakatan."}</p></section>
      <section className="model-section" id="model-3d"><div className="model-intro"><span className="section-label">{isEnglish ? "3D MODEL / INSPIRATION" : "MODEL 3D / INSPIRASI"}</span><h2>{isEnglish ? <>SEE IT FROM<br/><em>EVERY ANGLE.</em></> : <>LIHAT DARI<br/><em>SEGALA SISI.</em></>}</h2><p>{isEnglish ? "Rotate this sample steel-frame table with a wooden top. We can discuss sizes and designs to suit your needs." : "Putar contoh meja dengan rangka besi dan permukaan kayu. Ukuran dan desain dapat dibicarakan sesuai kebutuhan Anda."}</p><a href="#pesan">{isEnglish ? "ASK ABOUT THIS DESIGN" : "TANYAKAN DESAIN INI"} <span><ArrowIcon /></span></a></div><FurnitureViewer /></section>
      <section className="about section" id="layanan"><div className="about-label"><span className="section-label">02 / {isEnglish ? "MORE THAN WELDING" : "LEBIH DARI SEKADAR LAS"}</span></div><div className="about-main"><h2>{isEnglish ? <>YOUR IDEA.<br/><em>MADE REAL.</em></> : <>IDE ANDA.<br/><em>KAMI WUJUDKAN.</em></>}</h2><p>{isEnglish ? "Every space has different needs. Share your ideas, dimensions, and preferred design, and we'll find the right solution together." : "Setiap ruang punya kebutuhan yang berbeda. Diskusikan ide, ukuran, dan model yang Anda inginkan, lalu kita cari solusi yang sesuai."}</p><div className="service-list"><div><span>01</span><strong>{isEnglish ? "Custom furniture" : "Furnitur custom"}</strong><span><ArrowIcon /></span></div><div><span>02</span><strong>{isEnglish ? "Welding & steel frames" : "Pengelasan & rangka besi"}</strong><span><ArrowIcon /></span></div><div><span>03</span><strong>{isEnglish ? "Design & sizing discussion" : "Diskusi desain & ukuran"}</strong><span><ArrowIcon /></span></div></div></div></section>
      <section className="process section" id="proses"><div className="section-heading"><div><span className="section-label">03 / {isEnglish ? "HOW TO ORDER" : "CARA PEMESANAN"}</span><h2>{isEnglish ? <>EASY FROM<br/><em>THE START.</em></> : <>MUDAH DARI<br/><em>AWAL.</em></>}</h2></div><p className="process-intro">{isEnglish ? "You don't need a complete drawing. Just tell us your idea and we'll work it out together." : "Tak perlu punya gambar lengkap. Ceritakan saja ide Anda, kita bahas bersama."}</p></div><div className="process-grid"><article><span>01</span><h3>{isEnglish ? "Share your idea" : "Ceritakan ide"}</h3><p>{isEnglish ? "Tell us what you need, approximate dimensions, and your preferred design." : "Isi kebutuhan, ukuran perkiraan, dan model yang diinginkan."}</p></article><article><span>02</span><h3>{isEnglish ? "Discuss the details" : "Diskusi bersama"}</h3><p>{isEnglish ? "Message us on WhatsApp to discuss the details and get a quote." : "Kirim pesan lewat WhatsApp untuk membahas detail dan penawaran."}</p></article><article><span>03</span><h3>{isEnglish ? "We'll get started" : "Mulai pengerjaan"}</h3><p>{isEnglish ? "Once the details are agreed, we'll get to work on your order." : "Setelah detail disepakati, pesanan dapat mulai dikerjakan."}</p></article></div></section>
      <RequestForm phone={phone}/>
      <section className="closing"><div><span className="section-label">{isEnglish ? "HAVE A QUESTION?" : "PUNYA PERTANYAAN?"}</span><h2>{isEnglish ? <>LET'S<br/><em>TALK.</em></> : <>MARI KITA<br/><em>BICARAKAN.</em></>}</h2></div><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="button button-orange"><WhatsAppIcon/> {isEnglish ? "CHAT ON WHATSAPP" : "CHAT VIA WHATSAPP"} <span><ArrowIcon /></span></a></section>
    </main>
    <footer><a href="#beranda" className="footer-brand" aria-label={isEnglish ? "Deni Jaya Las, home" : "Deni Jaya Las, beranda"}><BrandMark /><span>DENI JAYA <b>/</b> LAS<span>.</span></span></a><p>{isEnglish ? "CUSTOM WELDING & FURNITURE" : "JASA LAS & FURNITUR CUSTOM"}</p><a href="#beranda">{isEnglish ? "BACK TO TOP" : "KEMBALI KE ATAS"}</a></footer>
  </div>;
}
