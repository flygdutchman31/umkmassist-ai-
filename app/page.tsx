export default function Home() {
  return (
    <>

  <div className="site-shell">
    <header className="topbar">
      <a className="wordmark" href="#top" aria-label="Form and Function home">F<span>/</span>F<span className="wordmark-dot">.</span></a>
      <span className="topbar-note">INDEPENDENT CREATIVE PRACTICE<br />PORTFOLIO / 2026</span>
      <nav aria-label="Main navigation">
        <a href="#work">Work <span>↗</span></a>
        <a href="#about">About <span>↗</span></a>
        <a className="nav-contact" href="#contact">Let’s talk <span>↗</span></a>
      </nav>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot"></span> OPEN TO INTERESTING THINGS <span className="eyebrow-index">[ 01 — 03 ]</span></div>
          <h1 id="hero-title">GOOD<br />WORK<span className="period">.</span><br /><em>NO</em> NOISE<span className="period">.</span></h1>
          <div className="hero-bottom">
            <p>Thoughtful design for a world<br />that doesn’t need more ordinary.</p>
            <a className="round-link" href="#work" aria-label="Explore selected work">↘</a>
          </div>
        </div>
        <div className="hero-visual">
          <img src="/assets/architecture.jpg" alt="Sculptural white architecture against a clear sky"/>
          <div className="image-topline"><span>FORM FOLLOWS FEELING</span><span>001 / 026</span></div>
          <div className="image-caption"><span>DESIGN WITH<br />DIMENSION.</span><span>↗</span></div>
          <span className="image-side">A LITTLE LESS EXPECTED — A LOT MORE INTENTIONAL</span>
        </div>
      </section>

      <div className="ticker" aria-label="Creative disciplines">
        <span>STRATEGY</span><b>✳</b><span>IDENTITY</span><b>✳</b><span>DIGITAL</span><b>✳</b><span>ART DIRECTION</span><b>✳</b><span>GOOD IDEAS</span><b>✳</b><span>STRATEGY</span>
      </div>

      <section className="work section-pad" id="work">
        <div className="section-heading"><div><span className="section-kicker">01 / THE GOOD STUFF</span><h2>SELECTED<br /><span>WORK</span><sup>®</sup></h2></div><p>A small collection of ideas<br />made with intention.<br /><span>CONCEPT PROJECTS / 2026</span></p></div>
        <div className="project-grid">
          <article className="project">
            <div className="project-image project-image-one"><img src="/assets/interior.jpg" alt="A bright, modern interior with warm wooden details"/><span className="project-tag">01 / SPACE</span><span className="project-arrow">↗</span></div>
            <div className="project-info"><div><h3>THE COMMON ROOM</h3><p>Making space for better ideas.</p></div><span>IDENTITY / DIGITAL</span></div>
          </article>
          <article className="project">
            <div className="project-image project-image-two"><img src="/assets/structure.jpg" alt="Architectural concrete structure seen from below"/><span className="project-tag">02 / FORM</span><span className="project-arrow">↗</span></div>
            <div className="project-info"><div><h3>OBJECTS OF NOTE</h3><p>A different perspective on the everyday.</p></div><span>ART DIRECTION / EDITORIAL</span></div>
          </article>
        </div>
      </section>

      <section className="about section-pad" id="about">
        <div className="about-label"><span className="section-kicker">02 / A LITTLE CONTEXT</span><span className="asterisk">✳</span></div>
        <div className="about-copy"><h2>LESS, BUT<br /><em>BETTER.</em></h2><p>Good design doesn’t need to shout. It needs a point of view, a little personality, and a reason to exist.</p><p className="about-small">Working across identity, digital, and art direction to make things that feel as good as they look. No unnecessary extras. Just the good stuff.</p><div className="services"><span>WHAT I DO</span><span>CREATIVE DIRECTION</span><span>BRAND IDENTITY</span><span>DIGITAL DESIGN</span></div></div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="contact-top"><span className="section-kicker">03 / YOUR TURN</span><span>HAVE A GOOD ONE. ✳</span></div>
        <h2>HAVE A<br />GOOD <em>IDEA?</em></h2>
        <div className="contact-bottom"><p>Let’s make something<br />worth looking at.</p><a href="mailto:hello@example.com?subject=Let%27s%20make%20something">START A CONVERSATION <span>↗</span></a></div>
        <p className="contact-note">Portfolio template — replace the example email with yours.</p>
      </section>
    </main>
    <footer><a className="wordmark" href="#top">F<span>/</span>F<span className="wordmark-dot">.</span></a><span>MADE WITH INTENTION, NOT NOISE.</span><a href="#top">BACK TO TOP ↑</a></footer>
  </div>

    </>
  );
}
