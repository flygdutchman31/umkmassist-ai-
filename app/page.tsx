'use client';

import ProductGallery from "./ProductGallery";

import ArrowIcon from "./ArrowIcon";
import WeldingVideo from "./WeldingVideo";
import FurnitureViewer from "./FurnitureViewer";
import RequestForm from "./RequestForm";
import OrderFaq from "./OrderFaq";
import { LanguageSwitcher, useLanguage } from "./LanguageProvider";
import steelWork from "../public/welding/steel-work.jpg";

const phone = "6287861045484";

function BrandMark() {
  return <svg className="brand-mark" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M11 14h27l21 20v12L38 66H11V14Z M24 25v30h10l14-13v-4L34 25H24Z" fill="currentColor" fillRule="evenodd"/><path d="M52 18h18v7H59v11h-7V18Z" fill="#ED673B"/><path d="M58 51h12v7H58z" fill="currentColor"/></svg>;
}

function WhatsAppIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.2 11.6a8.3 8.3 0 0 1-12.4 7.2L3 20l1.2-4.7a8.3 8.3 0 1 1 16-3.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M8.5 7.8c.3-.4.6-.4.9-.4h.4c.1 0 .3.1.4.4l.7 1.6c.1.2 0 .4-.1.5l-.6.8c-.1.1-.1.3 0 .5.4.7 1.5 1.8 2.5 2.3.2.1.4.1.5 0l.8-.9c.1-.2.3-.2.5-.1l1.6.8c.2.1.3.2.3.4 0 .3-.1 1-.5 1.3-.4.4-1.1.6-1.8.5-1.1-.2-2.8-.9-4.3-2.4-1.3-1.4-2.2-2.9-2.3-4.1-.1-.5.2-1 .4-1.2Z" fill="currentColor"/></svg>; }

export default function Home() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const greeting = isEnglish
    ? "Hello, I would like to ask about your welding and custom furniture services."
    : "Halo, saya ingin bertanya tentang jasa las dan furnitur custom.";
  const whatsapp = `https://wa.me/${phone}?text=${encodeURIComponent(greeting)}`;

  return <div className="site" id="beranda">

    <header className="header"><a href="#beranda" className="brand" aria-label={isEnglish ? "Deni Metalworks, home" : "Deni Metalworks, beranda"}><BrandMark /><span className="brand-name">DENI<small>METALWORKS</small></span></a><nav aria-label={isEnglish ? "Main navigation" : "Navigasi utama"}><a href="#produk">{isEnglish ? "Products" : "Produk"}</a><a href="#layanan">{isEnglish ? "Services" : "Layanan"}</a><a href="#proses">{isEnglish ? "How to order" : "Cara pesan"}</a></nav><LanguageSwitcher /><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="header-contact"><WhatsAppIcon/> <span>{isEnglish ? "Contact us" : "Hubungi kami"}</span> <b><ArrowIcon /></b></a></header>
    <main>
      <section className="hero"><WeldingVideo poster={steelWork.src} src="/welding/new-welding.mp4" /><div className="hero-copy"><div className="eyebrow">{isEnglish ? "DENI METALWORKS / FURNITURE & CONSTRUCTION" : "DENI METALWORKS / FURNITUR & KONSTRUKSI"}</div><h1>{isEnglish ? <>BUILT STRONG.<br/><em>BUILT RIGHT.</em></> : <>DIBUAT KUAT.<br/><em>DIBUAT TEPAT.</em></>}</h1><p>{isEnglish ? "Custom welding and steel furniture for your home, business, and space." : "Jasa pengelasan dan furnitur besi custom untuk kebutuhan rumah, usaha, dan ruang Anda."}</p><div className="hero-actions"><a className="button button-orange" href="#pesan">{isEnglish ? "TELL US WHAT YOU NEED" : "CERITAKAN KEBUTUHAN"} <span><ArrowIcon /></span></a><a className="hero-secondary" href="#produk">{isEnglish ? "Explore product ideas" : "Lihat inspirasi produk"} <span><ArrowIcon direction="down" /></span></a></div><div className="hero-note"><span>01 / 03</span><span>{isEnglish ? "SCROLL TO EXPLORE" : "SCROLL UNTUK MENJELAJAHI"}</span></div></div></section>

      <section className="products section" id="produk"><div className="section-heading"><div><span className="section-label">01 / {isEnglish ? "WHAT WE CAN MAKE" : "APA YANG BISA DIBUAT"}</span><h2>{isEnglish ? <>MADE FOR<br/><em>YOUR SPACE.</em></> : <>DIBUAT UNTUK<br/><em>RUANG ANDA.</em></>}</h2></div><div className="heading-side"><p>{isEnglish ? "From a simple idea to your dream furniture. Choose the size, shape, and features you need." : "Dari ide sederhana hingga furnitur impian. Sesuaikan ukuran, bentuk, dan kebutuhan Anda."}</p><a href="#pesan">{isEnglish ? "HAVE AN IDEA?" : "PUNYA IDE SENDIRI?"} <span><ArrowIcon /></span></a></div></div><ProductGallery /><p className="image-disclaimer">{isEnglish ? "Images are design references; the welding video is illustrative. Products are made to order by agreement." : "Foto adalah referensi desain; video pengelasan adalah ilustrasi. Produk dibuat sesuai permintaan dan kesepakatan."}</p></section>
      <section className="model-section" id="model-3d"><div className="model-intro"><span className="section-label">{isEnglish ? "3D MODEL / INSPIRATION" : "MODEL 3D / INSPIRASI"}</span><h2>{isEnglish ? <>SEE IT FROM<br/><em>EVERY ANGLE.</em></> : <>LIHAT DARI<br/><em>SEGALA SISI.</em></>}</h2><p>{isEnglish ? "Explore these sample steel furniture designs. We can discuss sizes and designs to suit your needs." : "Pilih dan putar contoh desain furnitur besi. Ukuran dan desain dapat dibicarakan sesuai kebutuhan Anda."}</p><a href="#pesan">{isEnglish ? "ASK ABOUT THIS DESIGN" : "TANYAKAN DESAIN INI"} <span><ArrowIcon /></span></a></div><FurnitureViewer /></section>
      <section className="about section" id="layanan"><div className="about-label"><span className="section-label">02 / {isEnglish ? "MORE THAN WELDING" : "LEBIH DARI SEKADAR LAS"}</span></div><div className="about-main"><h2>{isEnglish ? <>YOUR IDEA.<br/><em>MADE REAL.</em></> : <>IDE ANDA.<br/><em>KAMI WUJUDKAN.</em></>}</h2><p>{isEnglish ? "Every space has different needs. Share your ideas, dimensions, and preferred design, and we'll find the right solution together." : "Setiap ruang punya kebutuhan yang berbeda. Diskusikan ide, ukuran, dan model yang Anda inginkan, lalu kita cari solusi yang sesuai."}</p><div className="service-list"><div><span>01</span><strong>{isEnglish ? "Custom furniture" : "Furnitur custom"}</strong><span><ArrowIcon /></span></div><div><span>02</span><strong>{isEnglish ? "Welding & steel frames" : "Pengelasan & rangka besi"}</strong><span><ArrowIcon /></span></div><div><span>03</span><strong>{isEnglish ? "Design & sizing discussion" : "Diskusi desain & ukuran"}</strong><span><ArrowIcon /></span></div></div></div></section>
      <section className="process section" id="proses"><div className="section-heading"><div><span className="section-label">03 / {isEnglish ? "HOW TO ORDER" : "CARA PEMESANAN"}</span><h2>{isEnglish ? <>EASY FROM<br/><em>THE START.</em></> : <>MUDAH DARI<br/><em>AWAL.</em></>}</h2></div><p className="process-intro">{isEnglish ? "You don't need a complete drawing. Just tell us your idea and we'll work it out together." : "Tak perlu punya gambar lengkap. Ceritakan saja ide Anda, kita bahas bersama."}</p></div><div className="process-grid"><article><span>01</span><h3>{isEnglish ? "Share your idea" : "Ceritakan ide"}</h3><p>{isEnglish ? "Tell us what you need, approximate dimensions, and your preferred design." : "Isi kebutuhan, ukuran perkiraan, dan model yang diinginkan."}</p></article><article><span>02</span><h3>{isEnglish ? "Discuss the details" : "Diskusi bersama"}</h3><p>{isEnglish ? "Message us on WhatsApp to discuss the details and get a quote." : "Kirim pesan lewat WhatsApp untuk membahas detail dan penawaran."}</p></article><article><span>03</span><h3>{isEnglish ? "We'll get started" : "Mulai pengerjaan"}</h3><p>{isEnglish ? "Once the details are agreed, we'll get to work on your order." : "Setelah detail disepakati, pesanan dapat mulai dikerjakan."}</p></article></div></section>
      <OrderFaq />
      <RequestForm phone={phone}/>
      <section className="closing"><div><span className="section-label">{isEnglish ? "HAVE A QUESTION?" : "PUNYA PERTANYAAN?"}</span><h2>{isEnglish ? <>LET'S<br/><em>TALK.</em></> : <>MARI KITA<br/><em>BICARAKAN.</em></>}</h2></div><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="button button-orange"><WhatsAppIcon/> {isEnglish ? "CHAT ON WHATSAPP" : "CHAT VIA WHATSAPP"} <span><ArrowIcon /></span></a></section>
    </main>
    <footer><a href="#beranda" className="footer-brand" aria-label={isEnglish ? "Deni Metalworks, home" : "Deni Metalworks, beranda"}><BrandMark /><span>DENI <b>/</b> METALWORKS<span>.</span></span></a><p>{isEnglish ? "CUSTOM WELDING & FURNITURE" : "JASA LAS & FURNITUR CUSTOM"}</p><a href="#beranda">{isEnglish ? "BACK TO TOP" : "KEMBALI KE ATAS"}</a></footer>
  </div>;
}
