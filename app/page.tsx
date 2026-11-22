import architecture from "../public/assets/architecture.jpg";
import interior from "../public/assets/interior.jpg";
import structure from "../public/assets/structure.jpg";

export default function Home() {
  return (
    <>

  <div className="site-shell">
    <header className="topbar">
      <a className="wordmark" href="#top" aria-label="Beranda Form and Function">F<span>/</span>F<span className="wordmark-dot">.</span></a>
      <span className="topbar-note">PRAKTIK KREATIF INDEPENDEN<br />PORTOFOLIO / 2026</span>
      <nav aria-label="Navigasi utama">
        <a href="#work">Karya <span>↗</span></a>
        <a href="#about">Tentang <span>↗</span></a>
        <a className="nav-contact" href="#contact">Mari bicara <span>↗</span></a>
      </nav>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot"></span> TERBUKA UNTUK HAL MENARIK <span className="eyebrow-index">[ 01 — 03 ]</span></div>
          <h1 id="hero-title">KARYA<br />BERARTI<span className="period">.</span><br /><em>TANPA</em> RIBUT<span className="period">.</span></h1>
          <div className="hero-bottom">
            <p>Desain penuh pertimbangan<br />untuk ide yang tak biasa.</p>
            <a className="round-link" href="#work" aria-label="Lihat karya pilihan">↘</a>
          </div>
        </div>
        <div className="hero-visual">
          <img src={architecture.src} alt="Arsitektur putih yang terpahat di bawah langit cerah"/>
          <div className="image-topline"><span>BENTUK MENGIKUTI RASA</span><span>001 / 026</span></div>
          <div className="image-caption"><span>DESAIN PENUH<br />DIMENSI.</span><span>↗</span></div>
          <span className="image-side">SEDIKIT TAK TERDUGA — SELALU PENUH MAKNA</span>
        </div>
      </section>

      <div className="ticker" aria-label="Bidang kreatif">
        <span>STRATEGI</span><b>✳</b><span>IDENTITAS</span><b>✳</b><span>DIGITAL</span><b>✳</b><span>ARAH SENI</span><b>✳</b><span>IDE BAGUS</span><b>✳</b><span>STRATEGI</span>
      </div>

      <section className="work section-pad" id="work">
        <div className="section-heading"><div><span className="section-kicker">01 / KARYA TERPILIH</span><h2>KARYA<br /><span>PILIHAN</span><sup>®</sup></h2></div><p>Kumpulan ide yang dibuat<br />dengan penuh pertimbangan.<br /><span>PROYEK KONSEP / 2026</span></p></div>
        <div className="project-grid">
          <article className="project">
            <div className="project-image project-image-one"><img src={interior.src} alt="Interior modern yang terang dengan detail kayu hangat"/><span className="project-tag">01 / RUANG</span><span className="project-arrow">↗</span></div>
            <div className="project-info"><div><h3>RUANG BERSAMA</h3><p>Ruang untuk ide yang lebih baik.</p></div><span>IDENTITAS / DIGITAL</span></div>
          </article>
          <article className="project">
            <div className="project-image project-image-two"><img src={structure.src} alt="Struktur arsitektur beton dilihat dari bawah"/><span className="project-tag">02 / BENTUK</span><span className="project-arrow">↗</span></div>
            <div className="project-info"><div><h3>OBJEK ISTIMEWA</h3><p>Sudut pandang baru untuk keseharian.</p></div><span>ARAH SENI / EDITORIAL</span></div>
          </article>
        </div>
      </section>

      <section className="about section-pad" id="about">
        <div className="about-label"><span className="section-kicker">02 / SEKILAS CERITA</span><span className="asterisk">✳</span></div>
        <div className="about-copy"><h2>LEBIH SEDIKIT,<br /><em>LEBIH BAIK.</em></h2><p>Desain yang baik tak perlu berteriak. Ia butuh sudut pandang, karakter, dan alasan untuk hadir.</p><p className="about-small">Berkarya di bidang identitas, digital, dan arahan seni untuk menciptakan sesuatu yang terasa sebaik tampilannya. Tanpa tambahan yang tak perlu, hanya yang bermakna.</p><div className="services"><span>YANG SAYA KERJAKAN</span><span>ARAH KREATIF</span><span>IDENTITAS MEREK</span><span>DESAIN DIGITAL</span></div></div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="contact-top"><span className="section-kicker">03 / GILIRANMU</span><span>SEMOGA HARIMU MENYENANGKAN. ✳</span></div>
        <h2>PUNYA<br /><em>IDE BAGUS?</em></h2>
        <div className="contact-bottom"><p>Mari ciptakan sesuatu<br />yang layak dilihat.</p><a href="mailto:hello@example.com?subject=Mari%20buat%20sesuatu">MULAI PERCAKAPAN <span>↗</span></a></div>
        <p className="contact-note">Templat portofolio — ganti email contoh dengan emailmu.</p>
      </section>
    </main>
    <footer><a className="wordmark" href="#top">F<span>/</span>F<span className="wordmark-dot">.</span></a><span>DIBUAT DENGAN MAKNA, TANPA BASA-BASI.</span><a href="#top">KEMBALI KE ATAS ↑</a></footer>
  </div>

    </>
  );
}
