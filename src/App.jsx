import { useState, useEffect, useRef } from "react";

const LOGO_URL = "/images/logo.png";

const C = {
  darkGreen: "#0B2B1A", green: "#143D28", midGreen: "#1C4D33",
  gold: "#C5A55A", goldLight: "#D4B96E", goldPale: "#E8D9A8",
  cream: "#FAF7F0", parchment: "#F0EBE0", warmWhite: "#FDFCF8",
  text: "#1A1A18", textMuted: "#6B6960", textLight: "#9C9688",
  border: "#E2DDD2",
};

const F = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', system-ui, sans-serif",
  accent: "'Cormorant Garamond', Georgia, serif",
};

const OFFERINGS = [
  { name: "Yirgacheffe Grade 1", region: "Gedeo / Yirgacheffe", altitude: "1,750–2,200 m", process: "Washed", screen: "15+", harvest: "Oct – Jan", notes: "Jasmine, bergamot, lemon zest, silky body", badge: "Flagship", score: "86–89" },
  { name: "Guji Highland Natural", region: "Oromia / Guji Zone", altitude: "1,800–2,100 m", process: "Natural", screen: "15+", harvest: "Nov – Feb", notes: "Strawberry, wine, raw honey, complex fruit", badge: "Limited Lot", score: "87–90" },
  { name: "Sidamo Washed", region: "SNNPR / Sidama", altitude: "1,500–2,200 m", process: "Washed", screen: "14+", harvest: "Oct – Jan", notes: "Citrus, floral, tea-like clarity, bright finish", score: "84–87" },
  { name: "Harrar Longberry", region: "Harrar / Eastern Highlands", altitude: "1,500–2,100 m", process: "Natural", screen: "15+", harvest: "Oct – Feb", notes: "Dried fruit, dark chocolate, blueberry, spice", score: "85–88" },
  { name: "Limu Washed Organic", region: "Oromia / Jimma Zone", altitude: "1,400–2,000 m", process: "Washed", screen: "14+", harvest: "Nov – Feb", notes: "Stone fruit, brown sugar, balanced acidity", badge: "Organic", score: "83–86" },
  { name: "Djimmah Honey Reserve", region: "Oromia / Kaffa Zone", altitude: "1,400–1,800 m", process: "Honey", screen: "14+", harvest: "Nov – Jan", notes: "Wild berry, molasses, earthy depth, cocoa", badge: "Reserve", score: "84–87" },
];

/* ── Decorative Components ── */
const GoldDivider = ({ width = 200 }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "32px auto", width }}>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold})` }} />
    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, boxShadow: `0 0 8px ${C.gold}40` }} />
    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)` }} />
  </div>
);

const LeafAccent = ({ size = 60, color = C.gold, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ opacity: 0.12, ...style }}>
    <path d="M30 5C30 5 45 20 45 35C45 50 30 55 30 55C30 55 15 50 15 35C15 20 30 5 30 5Z" fill={color} />
    <path d="M30 15V50" stroke={color} strokeWidth="1" opacity="0.5" />
    <path d="M30 25L22 32M30 32L38 25M30 38L24 42M30 42L36 38" stroke={color} strokeWidth="0.8" opacity="0.4" />
  </svg>
);

function useReveal() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
};

/* ── Navigation ── */
const Nav = ({ page, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = page === "home";

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { id: "home", label: "Home" },
    { id: "about", label: "Our Story" },
    { id: "offerings", label: "Offerings" },
    { id: "contact", label: "Contact" },
  ];

  const navBg = scrolled ? "rgba(11,43,26,0.97)" : (isHome ? "transparent" : "rgba(11,43,26,0.97)");

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: navBg, backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(197,165,90,0.15)" : "1px solid transparent",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: scrolled ? 68 : 84, padding: "0 32px", transition: "height 0.4s" }}>
        <div onClick={() => { setPage("home"); window.scrollTo(0, 0); }} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
          <img src={LOGO_URL} alt="Asli Buna" style={{ height: scrolled ? 44 : 56, transition: "height 0.4s", objectFit: "contain"}} />
        </div>

        <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="nav-desktop">
          {links.map(l => (
            <span key={l.id} onClick={() => { setPage(l.id); window.scrollTo(0, 0); setMenuOpen(false); }} style={{
              fontFamily: F.body, fontSize: 12, fontWeight: 500, letterSpacing: 2.5, textTransform: "uppercase",
              color: page === l.id ? C.gold : "rgba(255,255,255,0.65)", cursor: "pointer", transition: "color 0.3s",
              paddingBottom: 4, borderBottom: page === l.id ? `1.5px solid ${C.gold}` : "1.5px solid transparent",
            }}>{l.label}</span>
          ))}
          <button onClick={() => { setPage("contact"); window.scrollTo(0, 0); }} style={{
            fontFamily: F.body, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", padding: "10px 24px",
            background: "transparent", border: `1px solid ${C.gold}`, color: C.gold, cursor: "pointer", transition: "all 0.3s",
          }}>Request Samples</button>
        </div>

        <div onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 8 }} className="nav-mobile-btn">
          <span style={{ width: 22, height: 1.5, background: C.gold, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none" }} />
          <span style={{ width: 22, height: 1.5, background: C.gold, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: 22, height: 1.5, background: C.gold, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none" }} />
        </div>
      </div>

      {menuOpen && (
        <div style={{ background: "rgba(11,43,26,0.98)", padding: "16px 32px 24px", borderTop: "1px solid rgba(197,165,90,0.1)" }}>
          {links.map(l => (
            <div key={l.id} onClick={() => { setPage(l.id); setMenuOpen(false); window.scrollTo(0, 0); }} style={{
              fontFamily: F.body, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", padding: "14px 0",
              color: page === l.id ? C.gold : "rgba(255,255,255,0.6)", cursor: "pointer", borderBottom: "1px solid rgba(197,165,90,0.08)",
            }}>{l.label}</div>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .nav-desktop{display:none!important}
          .nav-mobile-btn{display:flex!important}
        }
      `}</style>
    </nav>
  );
};

/* ── Footer ── */
const Footer = ({ setPage }) => (
  <footer style={{ background: C.darkGreen, borderTop: "1px solid rgba(197,165,90,0.12)" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 32px 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 48 }}>
        <div style={{ textAlign: "center" }}>
          <img src={LOGO_URL} alt="Asli Buna" style={{ height: 72, objectFit: "contain", marginBottom: 16, display: "block", margin: "0 auto 16px" }} />
          <p style={{ fontFamily: F.accent, fontSize: 16, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontStyle: "italic" }}>
            Specialty green coffee<br />from the birthplace of Arabica.
          </p>
        </div>
        <div>
          <h4 style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: C.gold, marginBottom: 18 }}>Navigate</h4>
          {[{ id: "home", l: "Home" }, { id: "about", l: "Our Story" }, { id: "offerings", l: "Offerings" }, { id: "contact", l: "Contact" }].map(n => (
            <div key={n.id} onClick={() => { setPage(n.id); window.scrollTo(0, 0); }} style={{ fontFamily: F.body, fontSize: 14, color: "rgba(255,255,255,0.45)", cursor: "pointer", padding: "5px 0", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.goldLight} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>{n.l}</div>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: C.gold, marginBottom: 18 }}>Connect</h4>
          <a href="https://www.instagram.com/asli.buna/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: F.body, fontSize: 14, color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "block", padding: "5px 0" }}>Instagram</a>
          <a href="https://www.linkedin.com/company/asli-buna" target="_blank" rel="noopener noreferrer" style={{ fontFamily: F.body, fontSize: 14, color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "block", padding: "5px 0" }}>LinkedIn</a>
        </div>
        <div>
          <h4 style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: C.gold, marginBottom: 18 }}>Inquiries</h4>
          <p style={{ fontFamily: F.body, fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 2 }}>
            Baltimore, Maryland<br />
            <a href="mailto:hello@aslibuna.com" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>hello@aslibuna.com</a>
          </p>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(197,165,90,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontFamily: F.body, fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>&copy; {new Date().getFullYear()} Asli Buna. All rights reserved.</p>
        <p style={{ fontFamily: F.accent, fontSize: 13, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>Specialty Green Coffee &middot; Ethiopia</p>
      </div>
    </div>
  </footer>
);

/* ── Home Page ── */
const HomePage = ({ setPage }) => (
  <div>
    {/* Hero with real background image */}
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
      backgroundImage: "url(/images/hero-farm.png)", backgroundSize: "cover", backgroundPosition: "center",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(11,43,26,0.75) 0%, rgba(11,43,26,0.55) 40%, rgba(11,43,26,0.8) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)" }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 900 }}>
        <img src={LOGO_URL} alt="Asli Buna" style={{
          height: "clamp(100px, 18vw, 180px)", objectFit: "contain",
          display: "block", margin: "0 auto 28px",
          animation: "fadeIn 1s ease", filter: "drop-shadow(0 4px 20px rgba(200,150,62,0.3))",
        }} />
        <p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 16, animation: "fadeIn 1s ease 0.2s both" }}>
          Ethiopian Heritage Coffee
        </p>
        <h1 style={{ fontFamily: F.display, fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 400, color: "#fff", lineHeight: 1.15, marginBottom: 20, fontStyle: "italic", animation: "fadeUp 1s ease 0.4s both" }}>
          From the Birthplace of Arabica,<br />Direct to Your Roastery
        </h1>
        <p style={{ fontFamily: F.accent, fontSize: "clamp(16px, 2.2vw, 21px)", color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.6, fontStyle: "italic", animation: "fadeUp 1s ease 0.6s both" }}>
          Traceable, single-origin Ethiopian green coffee for specialty roasters worldwide.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 1s ease 0.8s both" }}>
          <button onClick={() => { setPage("offerings"); window.scrollTo(0, 0); }} style={{
            fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "14px 36px",
            background: C.gold, color: C.darkGreen, border: "none", cursor: "pointer", fontWeight: 600, transition: "all 0.3s",
          }}>View Offerings</button>
          <button onClick={() => { setPage("contact"); window.scrollTo(0, 0); }} style={{
            fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "14px 36px",
            background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.3s",
          }}>Request Samples</button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", animation: "pulse 2.5s ease infinite" }}>
        <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${C.gold}, transparent)` }} />
      </div>
    </section>

    {/* Value Props */}
    <section style={{ background: C.cream, padding: "96px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, textAlign: "center", marginBottom: 12 }}>Why Asli Buna</p></Reveal>
        <Reveal delay={0.1}><h2 style={{ fontFamily: F.display, fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 400, color: C.text, textAlign: "center", fontStyle: "italic", marginBottom: 12 }}>Direct from Origin</h2></Reveal>
        <Reveal delay={0.15}><GoldDivider width={160} /></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginTop: 56 }}>
          {[
            { title: "Direct Origin", desc: "We source directly from cooperatives and washing stations across Ethiopia's premier coffee regions." },
            { title: "Full Traceability", desc: "Every lot documented from farm gate to export — region, altitude, process, harvest date, and cupping score." },
            { title: "Quality Assured", desc: "SCA-protocol cupping on every lot. Only 80+ scoring coffees make our seasonal offering list." },
            { title: "Flexible Volume", desc: "From single-bag trial orders to full container loads. GrainPro lined bags, export-ready." },
          ].map((item, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <LeafAccent size={48} style={{ margin: "0 auto 16px", display: "block" }} />
                <h3 style={{ fontFamily: F.body, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: C.text, marginBottom: 12, fontWeight: 600 }}>{item.title}</h3>
                <p style={{ fontFamily: F.accent, fontSize: 16, color: C.textMuted, lineHeight: 1.7, fontStyle: "italic" }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Origin Story with real image */}
    <section style={{ background: C.warmWhite, padding: "96px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="grid-responsive">
        <Reveal>
          <div>
            <p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Our Heritage</p>
            <h2 style={{ fontFamily: F.display, fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 400, color: C.text, lineHeight: 1.3, fontStyle: "italic", marginBottom: 20 }}>
              The Highlands Where Coffee Began
            </h2>
            <p style={{ fontFamily: F.accent, fontSize: 17, color: C.textMuted, lineHeight: 1.8, marginBottom: 16, fontStyle: "italic" }}>
              Ethiopia is the birthplace of Arabica coffee. In the ancient forests of Kaffa, Jimma, and Illubabor, coffee still grows wild among indigenous shade trees — a living genetic library found nowhere else on earth.
            </p>
            <p style={{ fontFamily: F.accent, fontSize: 17, color: C.textMuted, lineHeight: 1.8, marginBottom: 28, fontStyle: "italic" }}>
              We work with cooperatives in six premier growing regions, cupping every lot at origin before export. Each season brings new expressions of Ethiopian terroir.
            </p>
            <span onClick={() => { setPage("about"); window.scrollTo(0, 0); }} style={{
              fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.gold, cursor: "pointer",
              borderBottom: `1px solid ${C.gold}`, paddingBottom: 4, transition: "opacity 0.3s",
            }}>Read our story &rarr;</span>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ position: "relative" }}>
            <img src="/images/jebena.png" alt="Ethiopian Jebena Coffee Ceremony" style={{
              width: "100%", height: "auto", aspectRatio: "4/5", objectFit: "cover",
              filter: "brightness(0.95) contrast(1.05)",
            }} />
            <div style={{ position: "absolute", bottom: -12, right: -12, width: "60%", height: "40%", border: `1px solid ${C.gold}30`, zIndex: -1 }} />
            <p style={{ fontFamily: F.accent, fontSize: 13, color: C.textLight, fontStyle: "italic", marginTop: 12, textAlign: "center" }}>The Ethiopian Jebena — a tradition older than coffee itself</p>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Featured Offerings */}
    <section style={{ background: C.cream, padding: "96px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, textAlign: "center", marginBottom: 12 }}>Current Season</p></Reveal>
        <Reveal delay={0.1}><h2 style={{ fontFamily: F.display, fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 400, color: C.text, textAlign: "center", fontStyle: "italic", marginBottom: 12 }}>Green Coffee Offerings</h2></Reveal>
        <Reveal delay={0.15}><GoldDivider width={160} /></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, marginTop: 48 }}>
          {OFFERINGS.slice(0, 3).map((o, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <div style={{
                background: "#fff", border: `1px solid ${C.border}`, padding: 0, transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "default", position: "relative", overflow: "hidden",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ height: 4, background: `linear-gradient(90deg, ${C.gold}, ${C.midGreen})` }} />
                <div style={{ padding: "28px 28px 24px" }}>
                  {o.badge && <span style={{ fontFamily: F.body, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.gold, background: `${C.gold}12`, padding: "4px 10px", marginBottom: 12, display: "inline-block" }}>{o.badge}</span>}
                  <p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, marginBottom: 4, marginTop: o.badge ? 8 : 0 }}>{o.region}</p>
                  <h3 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 400, color: C.text, marginBottom: 8 }}>{o.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 1, color: C.gold, fontWeight: 600 }}>SCA {o.score}</span>
                    <span style={{ width: 1, height: 12, background: C.border }} />
                    <span style={{ fontFamily: F.body, fontSize: 11, color: C.textLight }}>{o.process}</span>
                  </div>
                  <p style={{ fontFamily: F.accent, fontSize: 15, color: C.textMuted, fontStyle: "italic", lineHeight: 1.6, marginBottom: 20 }}>{o.notes}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { label: "Altitude", value: o.altitude },
                      { label: "Screen", value: o.screen },
                      { label: "Harvest", value: o.harvest },
                      { label: "Bag", value: "60 kg GrainPro" },
                    ].map((s, j) => (
                      <div key={j}>
                        <p style={{ fontFamily: F.body, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, marginBottom: 2 }}>{s.label}</p>
                        <p style={{ fontFamily: F.body, fontSize: 13, color: C.text }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4}>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button onClick={() => { setPage("offerings"); window.scrollTo(0, 0); }} style={{
              fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "14px 40px",
              background: "transparent", border: `1px solid ${C.gold}`, color: C.gold, cursor: "pointer", transition: "all 0.3s",
            }}>View All Offerings</button>
          </div>
        </Reveal>
      </div>
    </section>

    {/* Process Showcase */}
    <section style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 500 }} className="grid-responsive">
        <div style={{ position: "relative" }}>
          <img src="/images/processing.png" alt="Coffee processing in Ethiopia" style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 400 }} />
        </div>
        <div style={{ background: C.darkGreen, display: "flex", alignItems: "center", padding: "64px 48px" }}>
          <Reveal>
            <div>
              <p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Our Process</p>
              <h2 style={{ fontFamily: F.display, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 400, color: "#fff", lineHeight: 1.3, fontStyle: "italic", marginBottom: 20 }}>
                From Cherry to Container
              </h2>
              <p style={{ fontFamily: F.accent, fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 16, fontStyle: "italic" }}>
                Every step is quality-controlled — from selective handpicking at peak ripeness, through precision washing and careful drying on raised African beds, to final grading and export preparation.
              </p>
              <p style={{ fontFamily: F.accent, fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontStyle: "italic" }}>
                We cup at origin, document every lot, and ship in GrainPro-lined bags to lock in freshness. Your coffee arrives exactly as it left the highlands.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    {/* CTA Banner */}
    <section style={{ background: C.darkGreen, padding: "96px 32px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, ${C.gold} 40px, ${C.gold} 41px)` }} />
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <Reveal>
          <img src={LOGO_URL} alt="Asli Buna" style={{ height: 80, objectFit: "contain", marginBottom: 24, opacity: 0.5, filter: "brightness(1.3)", display: "block", margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 400, color: "#fff", fontStyle: "italic", marginBottom: 16 }}>Partner With Us</h2>
          <p style={{ fontFamily: F.accent, fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 36, fontStyle: "italic" }}>
            Whether you are a micro-roaster seeking a single trial bag or a large importer building a seasonal program, we would love to hear from you.
          </p>
          <button onClick={() => { setPage("contact"); window.scrollTo(0, 0); }} style={{
            fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "14px 40px",
            background: C.gold, color: C.darkGreen, border: "none", cursor: "pointer", fontWeight: 600, transition: "all 0.3s",
          }}>Get in Touch</button>
        </Reveal>
      </div>
    </section>
  </div>
);

/* ── About Page ── */
const AboutPage = () => (
  <div>
    <section style={{ background: C.warmWhite, padding: "160px 32px 80px", textAlign: "center" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Reveal><p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Our Story</p></Reveal>
        <Reveal delay={0.1}><h1 style={{ fontFamily: F.display, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: C.text, fontStyle: "italic", marginBottom: 16 }}>Authentic Coffee, Rooted in Heritage</h1></Reveal>
        <Reveal delay={0.2}><p style={{ fontFamily: F.accent, fontSize: 19, color: C.textMuted, fontStyle: "italic", lineHeight: 1.6 }}>&ldquo;Buna&rdquo; means coffee in Amharic. &ldquo;Asli&rdquo; means authentic, original, genuine.</p></Reveal>
        <Reveal delay={0.25}><GoldDivider /></Reveal>
      </div>
    </section>

    {/* Story with cupping image */}
    <section style={{ background: C.cream, padding: "80px 32px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {[
          { title: "The Origin of All Coffee", text: "Ethiopia is where Arabica coffee was born. Long before coffee became a global commodity, Ethiopian highlanders were brewing it in clay jebena pots, sharing it in ceremonies that bound communities together. That same reverence for coffee runs through everything we do at Asli Buna." },
          { title: "Why Green Coffee", text: "We sell unroasted green beans because we believe the roaster's craft begins with exceptional raw material. By specializing in green coffee, we preserve the terroir — the altitude, soil, microclimate, and processing method — that makes Ethiopian coffee unlike anything else in the world." },
          { title: "Our Sourcing Approach", text: "We work directly with cooperatives and washing stations across Ethiopia's six premier regions. Every lot is cupped using SCA protocol at origin, and only coffees scoring 80 points or above make our offering list. We pack in GrainPro-lined jute bags to preserve freshness from Addis Ababa to your roastery." },
          { title: "Building Bridges", text: "Based in Baltimore with deep roots in Ethiopia, Asli Buna bridges two worlds. We believe in transparent sourcing, fair compensation for farmers, and building long-term relationships with roasters who care about quality and provenance." },
        ].map((block, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontFamily: F.display, fontSize: 24, fontWeight: 400, color: C.text, fontStyle: "italic", marginBottom: 12 }}>{block.title}</h3>
              <p style={{ fontFamily: F.accent, fontSize: 17, color: C.textMuted, lineHeight: 1.8, fontStyle: "italic" }}>{block.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Cupping image */}
      <Reveal delay={0.3}>
        <div style={{ maxWidth: 900, margin: "32px auto 0" }}>
          <img src="/images/cupping.png" alt="SCA Protocol Cupping Session" style={{ width: "100%", height: "auto", objectFit: "cover", maxHeight: 480 }} />
          <p style={{ fontFamily: F.accent, fontSize: 13, color: C.textLight, fontStyle: "italic", marginTop: 12, textAlign: "center" }}>Every lot is cupped using SCA protocol before export</p>
        </div>
      </Reveal>
    </section>

    {/* Sourcing Regions */}
    <section style={{ background: C.darkGreen, padding: "80px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <Reveal><p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>Sourcing Regions</p></Reveal>
        <Reveal delay={0.1}><h2 style={{ fontFamily: F.display, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 400, color: "#fff", fontStyle: "italic", marginBottom: 48 }}>Six Premier Ethiopian Origins</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
          {[
            { name: "Yirgacheffe", alt: "1,750–2,200 m", flavor: "Floral, citrus, tea-like" },
            { name: "Sidamo", alt: "1,500–2,200 m", flavor: "Stone fruit, bright" },
            { name: "Guji", alt: "1,800–2,100 m", flavor: "Berry, wine, complex" },
            { name: "Harrar", alt: "1,500–2,100 m", flavor: "Blueberry, chocolate" },
            { name: "Limu", alt: "1,400–2,000 m", flavor: "Sweet, balanced, clean" },
            { name: "Kaffa", alt: "1,400–1,800 m", flavor: "Wild, earthy, deep" },
          ].map((r, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <div style={{
                border: `1px solid rgba(197,165,90,0.15)`, padding: "28px 20px", transition: "border-color 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${C.gold}60`}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(197,165,90,0.15)"}
              >
                <h4 style={{ fontFamily: F.display, fontSize: 18, color: "#fff", fontStyle: "italic", marginBottom: 8 }}>{r.name}</h4>
                <p style={{ fontFamily: F.body, fontSize: 11, color: C.gold, letterSpacing: 1.5, marginBottom: 8 }}>{r.alt}</p>
                <p style={{ fontFamily: F.accent, fontSize: 14, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>{r.flavor}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  </div>
);

/* ── Offerings Page ── */
const OfferingsPage = ({ setPage }) => (
  <div>
    <section style={{ background: C.warmWhite, padding: "160px 32px 40px", textAlign: "center" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Reveal><p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>Current Season</p></Reveal>
        <Reveal delay={0.1}><h1 style={{ fontFamily: F.display, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: C.text, fontStyle: "italic", marginBottom: 16 }}>Green Coffee Offerings</h1></Reveal>
        <Reveal delay={0.2}><p style={{ fontFamily: F.accent, fontSize: 17, color: C.textMuted, fontStyle: "italic" }}>All lots available as pre-shipment samples. Minimum order: 1 bag (60 kg). FOB or CIF pricing available.</p></Reveal>
        <Reveal delay={0.25}><GoldDivider /></Reveal>
      </div>
    </section>

    <section style={{ background: C.warmWhite, padding: "20px 32px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
          {OFFERINGS.map((o, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <div style={{
                background: "#fff", border: `1px solid ${C.border}`, transition: "transform 0.3s, box-shadow 0.3s",
                position: "relative", overflow: "hidden",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ height: 4, background: `linear-gradient(90deg, ${C.gold}, ${C.midGreen})` }} />
                <div style={{ padding: "28px 28px 24px" }}>
                  {o.badge && <span style={{ fontFamily: F.body, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.gold, background: `${C.gold}12`, padding: "4px 10px", marginBottom: 12, display: "inline-block" }}>{o.badge}</span>}
                  <p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, marginBottom: 4, marginTop: o.badge ? 8 : 0 }}>{o.region}</p>
                  <h3 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 400, color: C.text, marginBottom: 8 }}>{o.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 1, color: C.gold, fontWeight: 600 }}>SCA {o.score}</span>
                    <span style={{ width: 1, height: 12, background: C.border }} />
                    <span style={{ fontFamily: F.body, fontSize: 11, color: C.textLight }}>{o.process}</span>
                  </div>
                  <p style={{ fontFamily: F.accent, fontSize: 15, color: C.textMuted, fontStyle: "italic", lineHeight: 1.6, marginBottom: 20 }}>{o.notes}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {[
                      { label: "Altitude", value: o.altitude },
                      { label: "Screen", value: o.screen },
                      { label: "Harvest", value: o.harvest },
                      { label: "Bag", value: "60 kg GrainPro" },
                    ].map((s, j) => (
                      <div key={j}>
                        <p style={{ fontFamily: F.body, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, marginBottom: 2 }}>{s.label}</p>
                        <p style={{ fontFamily: F.body, fontSize: 13, color: C.text }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontFamily: F.body, fontSize: 12, color: C.textLight }}>60 kg GrainPro</p>
                    <button onClick={() => { setPage("contact"); window.scrollTo(0, 0); }} style={{
                      fontFamily: F.body, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", padding: "8px 20px",
                      background: "transparent", border: `1px solid ${C.gold}`, color: C.gold, cursor: "pointer", transition: "all 0.3s",
                    }}>Request Sample</button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Logistics */}
    <section style={{ background: C.cream, padding: "80px 32px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 400, color: C.text, fontStyle: "italic", marginBottom: 24 }}>Logistics &amp; Terms</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginTop: 32 }}>
            <div style={{ textAlign: "center" }}>
              <h4 style={{ fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.text, marginBottom: 8 }}>Packaging</h4>
              <p style={{ fontFamily: F.accent, fontSize: 15, color: C.textMuted, fontStyle: "italic" }}>60 kg jute bags with GrainPro inner liner</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h4 style={{ fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.text, marginBottom: 8 }}>Shipping</h4>
              <p style={{ fontFamily: F.accent, fontSize: 15, color: C.textMuted, fontStyle: "italic" }}>FOB Djibouti or CIF to your port</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h4 style={{ fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.text, marginBottom: 8 }}>Contracts</h4>
              <p style={{ fontFamily: F.accent, fontSize: 15, color: C.textMuted, fontStyle: "italic" }}>Spot, forward, or seasonal programs</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ marginTop: 48 }}>
            <button onClick={() => { setPage("contact"); window.scrollTo(0, 0); }} style={{
              fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "14px 40px",
              background: C.gold, color: C.darkGreen, border: "none", cursor: "pointer", fontWeight: 600, transition: "all 0.3s",
            }}>Discuss Your Needs</button>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

/* ── Contact Page (with Formspree) ── */
const ContactPage = ({ setPage }) => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const formData = new FormData(e.target);
    try {
      const res = await fetch("https://formspree.io/f/xaqpvgvq", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) setSubmitted(true);
    } catch {
      alert("Something went wrong. Please email us directly at hello@aslibuna.com");
    }
    setSending(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", fontFamily: F.body, fontSize: 14, color: C.text,
    border: `1px solid ${C.border}`, background: "#fff", outline: "none", transition: "border-color 0.3s",
    boxSizing: "border-box",
  };

  if (submitted) {
    return (
      <div>
        <section style={{ background: C.warmWhite, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "160px 32px 80px" }}>
          <div style={{ textAlign: "center", maxWidth: 500 }}>
            <img src={LOGO_URL} alt="Asli Buna" style={{ height: 64, objectFit: "contain", marginBottom: 20, opacity: 0.7}} />
            <h2 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 400, color: C.text, fontStyle: "italic", marginBottom: 12 }}>Thank You</h2>
            <p style={{ fontFamily: F.accent, fontSize: 17, color: C.textMuted, fontStyle: "italic", lineHeight: 1.7 }}>
              Your inquiry has been received. We will follow up within one business day.
            </p>
            <GoldDivider width={120} />
            <button onClick={() => { setPage("home"); window.scrollTo(0, 0); }} style={{
              fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "12px 32px", marginTop: 16,
              background: "transparent", border: `1px solid ${C.gold}`, color: C.gold, cursor: "pointer",
            }}>Back to Home</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section style={{ background: C.warmWhite, padding: "160px 32px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal><p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>Get in Touch</p></Reveal>
          <Reveal delay={0.1}><h1 style={{ fontFamily: F.display, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: C.text, fontStyle: "italic", marginBottom: 16 }}>Let&apos;s Work Together</h1></Reveal>
          <Reveal delay={0.2}><p style={{ fontFamily: F.accent, fontSize: 17, color: C.textMuted, fontStyle: "italic" }}>Sample requests, wholesale inquiries, and partnerships</p></Reveal>
          <Reveal delay={0.25}><GoldDivider /></Reveal>
        </div>
      </section>

      <section style={{ background: C.warmWhite, padding: "20px 32px 80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 64, alignItems: "start" }} className="grid-responsive">
          <Reveal>
            <div>
              <h3 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 400, color: C.text, fontStyle: "italic", marginBottom: 16 }}>For Roasters &amp; Importers</h3>
              <p style={{ fontFamily: F.accent, fontSize: 16, color: C.textMuted, lineHeight: 1.7, fontStyle: "italic", marginBottom: 32 }}>
                Whether you are looking for a single-origin lot for your next roast or building a seasonal Ethiopian program, we are here to help.
              </p>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>Email</p>
                <a href="mailto:hello@aslibuna.com" style={{ fontFamily: F.body, fontSize: 15, color: C.text, textDecoration: "none" }}>hello@aslibuna.com</a>
              </div>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>Location</p>
                <p style={{ fontFamily: F.body, fontSize: 15, color: C.text }}>Baltimore, Maryland, USA</p>
              </div>
              <div>
                <p style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>Follow</p>
                <a href="https://www.instagram.com/asli.buna/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: F.body, fontSize: 15, color: C.text, textDecoration: "none" }}>@asli.buna</a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <form onSubmit={handleSubmit} style={{ background: "#fff", border: `1px solid ${C.border}`, padding: 36 }}>
              <h3 style={{ fontFamily: F.display, fontSize: 20, fontWeight: 400, color: C.text, fontStyle: "italic", marginBottom: 24 }}>Send an Inquiry</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, display: "block", marginBottom: 6 }}>Name *</label>
                <input name="name" required style={inputStyle} onFocus={e => e.target.style.borderColor = C.gold} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, display: "block", marginBottom: 6 }}>Email *</label>
                <input name="email" type="email" required style={inputStyle} onFocus={e => e.target.style.borderColor = C.gold} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, display: "block", marginBottom: 6 }}>Company</label>
                <input name="company" style={inputStyle} onFocus={e => e.target.style.borderColor = C.gold} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, display: "block", marginBottom: 6 }}>Inquiry Type</label>
                  <select name="inquiry_type" style={{ ...inputStyle, cursor: "pointer" }}>
                    <option>Sample Request</option>
                    <option>Wholesale Pricing</option>
                    <option>Forward Contract</option>
                    <option>Partnership</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, display: "block", marginBottom: 6 }}>Est. Volume</label>
                  <select name="volume" style={{ ...inputStyle, cursor: "pointer" }}>
                    <option>1–10 bags</option>
                    <option>10–50 bags</option>
                    <option>Half container (150+)</option>
                    <option>Full container (300+)</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: F.body, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: C.textLight, display: "block", marginBottom: 6 }}>Message</label>
                <textarea name="message" rows={5} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.target.style.borderColor = C.gold} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              <button type="submit" disabled={sending} style={{
                width: "100%", fontFamily: F.body, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "14px",
                background: sending ? C.textLight : C.gold, color: C.darkGreen, border: "none", cursor: sending ? "wait" : "pointer",
                fontWeight: 600, transition: "all 0.3s",
              }}>{sending ? "Sending..." : "Send Inquiry"}</button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

/* ── Main App ── */
export default function AsliBuna() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ minHeight: "100vh", background: C.warmWhite }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; }
        img { max-width: 100%; display: block; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }

        button:hover { opacity: 0.88; }
        a:hover { opacity: 0.8; }

        @media(max-width:768px) {
          .grid-responsive { grid-template-columns: 1fr !important; }
        }

        ::selection { background: ${C.gold}25; color: ${C.text}; }
      `}</style>

      <Nav page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "about" && <AboutPage />}
      {page === "offerings" && <OfferingsPage setPage={setPage} />}
      {page === "contact" && <ContactPage setPage={setPage} />}
      <Footer setPage={setPage} />
    </div>
  );
}
