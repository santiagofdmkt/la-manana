'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [form, setForm] = useState({ nombre: '', email: '', fecha: '', personas: '2', comentario: '' })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  async function handleReserva(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    const { error } = await supabase.from('lm_reservas').insert({
      nombre: form.nombre,
      email: form.email,
      fecha: form.fecha,
      personas: parseInt(form.personas),
      comentario: form.comentario,
      estado: 'pendiente'
    })
    console.log('error:', error)
    setEnviando(false)
    setEnviado(true)
    setForm({ nombre: '', email: '', fecha: '', personas: '2', comentario: '' })
  }

  const navLinks = [
    { label: 'Nosotros', id: 'nosotros' },
    { label: 'Menú', id: 'menu' },
    { label: 'Promociones', id: 'promociones' },
    { label: 'Galería', id: 'galeria' },
    { label: 'Reservas', id: 'reservas' },
  ]

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuAbierto(false)
  }

  return (
    <main style={{ fontFamily: "'Georgia', serif", background: '#0F0608', color: '#F5EDE8', overflowX: 'hidden' }}>

      <style>{`
        .lm-nav-links { display: flex; gap: 2.5rem; }
        .lm-hamburger { display: none; }
        .lm-mobile-menu { display: none; }

        @media (max-width: 768px) {
          .lm-nav-links { display: none; }
          .lm-hamburger { display: flex; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
          .lm-hamburger span { display: block; width: 24px; height: 2px; background: #E8C4B8; transition: all 0.3s; }
          .lm-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
          .lm-hamburger.open span:nth-child(2) { opacity: 0; }
          .lm-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

          .lm-mobile-menu {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background: rgba(15,6,8,0.98);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(180,60,80,0.3);
            padding: 1.5rem 2rem;
            gap: 0;
            z-index: 99;
            transform: translateY(-110%);
            transition: transform 0.3s ease;
          }
          .lm-mobile-menu.open {
            transform: translateY(0);
          }
          .lm-mobile-menu a {
            padding: 1rem 0;
            font-size: 0.9rem;
            color: rgba(245,237,232,0.7);
            text-decoration: none;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            border-bottom: 1px solid rgba(180,60,80,0.15);
            cursor: pointer;
            display: block;
          }
          .lm-mobile-menu a:last-child { border-bottom: none; }

          .lm-nav-inner { padding: 1rem 1.2rem !important; }

          /* Secciones */
          .lm-nosotros-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .lm-nosotros-img { height: 260px !important; }
          .lm-galeria-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
          .lm-galeria-featured { grid-column: 1 / -1 !important; grid-row: auto !important; min-height: 220px !important; }
          .lm-reservas-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .lm-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
          .lm-ubicacion-info { flex-direction: column !important; gap: 1rem !important; align-items: flex-start !important; }
          .lm-footer-bottom { flex-direction: column !important; gap: 0.5rem !important; text-align: center; }
          .lm-section-pad { padding: 4rem 1.2rem !important; }
          .lm-form-dates { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(15,6,8,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(180,60,80,0.2)' }}>
        <div className="lm-nav-inner" style={{ padding: '1.2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#E8C4B8', letterSpacing: '0.05em' }}>La Mañana</span>

          {/* Desktop links */}
          <div className="lm-nav-links">
            {navLinks.map(item => (
              <a key={item.id} onClick={() => scrollTo(item.id)}
                style={{ fontSize: '0.8rem', color: 'rgba(245,237,232,0.55)', textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                {item.label}
              </a>
            ))}
          </div>

          {/* Hamburger */}
          <button className={`lm-hamburger${menuAbierto ? ' open' : ''}`} onClick={() => setMenuAbierto(!menuAbierto)} aria-label="Menú">
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`lm-mobile-menu${menuAbierto ? ' open' : ''}`}>
          {navLinks.map(item => (
            <a key={item.id} onClick={() => scrollTo(item.id)}>{item.label}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1800&q=80" alt="Café ambiente" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(74,14,26,0.85) 0%, rgba(15,6,8,0.95) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '2rem', maxWidth: '800px' }}>
          <div style={{ display: 'inline-block', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C4506A', marginBottom: '2rem', padding: '0.4rem 1.2rem', border: '1px solid rgba(196,80,106,0.4)' }}>Café & Brunch · Chivilcoy</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(3.5rem,9vw,7rem)', color: '#F5EDE8', lineHeight: 1.0, marginBottom: '1.5rem', fontWeight: 400 }}>
            La <span style={{ color: '#C4506A', fontStyle: 'italic' }}>Mañana</span><br />empieza aquí
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(245,237,232,0.6)', maxWidth: '480px', margin: '0 auto 3rem', lineHeight: 1.8 }}>Un rincón cálido donde el café es ritual, el brunch es celebración y cada visita se siente como volver a casa.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a onClick={() => scrollTo('reservas')} style={{ background: '#8B1A2E', color: '#F5EDE8', padding: '0.9rem 2.2rem', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Reservar mesa</a>
            <a onClick={() => scrollTo('menu')} style={{ background: 'transparent', color: '#F5EDE8', padding: '0.9rem 2.2rem', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(245,237,232,0.25)', cursor: 'pointer' }}>Ver menú</a>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="lm-section-pad" style={{ padding: '7rem 3rem', background: '#130508', borderTop: '1px solid rgba(180,60,80,0.15)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="lm-nosotros-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <img className="lm-nosotros-img" src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&q=80" alt="Interior del café" style={{ width: '100%', height: '480px', objectFit: 'cover', borderLeft: '3px solid #8B1A2E', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '100px', height: '100px', background: '#8B1A2E', opacity: 0.2 }} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4506A', display: 'block', marginBottom: '1rem' }}>Nuestra historia</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: '#F5EDE8', lineHeight: 1.15, marginBottom: '1.5rem', fontWeight: 400 }}>Más que un café,<br /><span style={{ color: '#C4506A', fontStyle: 'italic' }}>un lugar propio</span></h2>
              <p style={{ color: 'rgba(245,237,232,0.6)', lineHeight: 1.85, marginBottom: '1.25rem', fontSize: '0.95rem' }}>La Mañana nació del sueño de crear un espacio donde cada detalle importe. Donde el café se prepare con tiempo, los ingredientes lleguen frescos cada día y la gente quiera quedarse un poco más.</p>
              <p style={{ color: 'rgba(245,237,232,0.6)', lineHeight: 1.85, fontSize: '0.95rem' }}>Trabajamos con productores locales, priorizamos lo artesanal y creemos que un buen desayuno puede cambiar el día entero.</p>
              <div style={{ display: 'flex', gap: '3rem', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(180,60,80,0.2)' }}>
                {[['+ 5','años'],['100%','artesanal'],['8 am','abrimos']].map(([num, label]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#C4506A', display: 'block' }}>{num}</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(245,237,232,0.4)', letterSpacing: '0.08em' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENÚ */}
      <section id="menu" className="lm-section-pad" style={{ padding: '7rem 3rem', background: '#0F0608' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4506A', display: 'block', marginBottom: '1rem' }}>Lo que ofrecemos</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: '#F5EDE8', fontWeight: 400 }}>El menú de <span style={{ color: '#C4506A', fontStyle: 'italic' }}>La Mañana</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.5rem' }}>
            {[
              { nombre: 'Tostadas de palta', precio: '$3.200', desc: 'Pan de masa madre, palta, huevo poché, semillas tostadas y sal en escamas.', tag: '⭐ Favorito', img: 'https://images.unsplash.com/photo-1603046891744-76e6300f82ef?w=600&q=70' },
              { nombre: 'Huevos benedictinos', precio: '$3.800', desc: 'Muffin inglés, jamón artesanal, huevo poché y salsa holandesa casera.', tag: '', img: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&q=70' },
              { nombre: 'Bowl granola', precio: '$2.800', desc: 'Granola artesanal, yogur griego, frutas de estación y miel de la región.', tag: '', img: 'https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=600&q=70' },
              { nombre: 'Pancakes de la casa', precio: '$2.600', desc: 'Pancakes esponjosos con frutos rojos, maple y crema batida.', tag: 'Sin TACC', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=70' },
              { nombre: 'Flat white', precio: '$1.400', desc: 'Espresso concentrado con microespuma sedosa. El favorito de los entendidos.', tag: '⭐ Favorito', img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=70' },
              { nombre: 'Cheesecake de frutos rojos', precio: '$2.200', desc: 'Base de galleta, queso crema artesanal y coulis de frutillas frescas.', tag: '', img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=70' },
            ].map((item) => (
              <div key={item.nombre} style={{ background: '#1A060C', borderLeft: '3px solid #8B1A2E', overflow: 'hidden' }}>
                <img src={item.img} alt={item.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: '#F5EDE8' }}>{item.nombre}</span>
                    <span style={{ fontSize: '0.9rem', color: '#C4506A', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: '1rem' }}>{item.precio}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(245,237,232,0.5)', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  {item.tag && <span style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.68rem', letterSpacing: '0.08em', padding: '0.2rem 0.7rem', background: 'rgba(139,26,46,0.3)', color: '#C4506A', textTransform: 'uppercase' }}>{item.tag}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMOCIONES */}
      <section id="promociones" className="lm-section-pad" style={{ padding: '7rem 3rem', background: 'linear-gradient(135deg, #2A060F 0%, #1A040A 50%, #2A060F 100%)', borderTop: '1px solid rgba(180,60,80,0.2)', borderBottom: '1px solid rgba(180,60,80,0.2)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4506A', display: 'block', marginBottom: '1rem' }}>Ofertas especiales</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: '#F5EDE8', fontWeight: 400 }}>Nuestras <span style={{ color: '#C4506A', fontStyle: 'italic' }}>promociones</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '2rem' }}>
            {[
              { titulo: 'Brunch para dos', precio: '$9.900', antes: '$12.400', desc: 'Dos bebidas a elección + dos platos principales + postre para compartir. Fines de semana.', badge: 'MÁS PEDIDO', img: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&q=70' },
              { titulo: 'Happy Hour Café', precio: '$1.800', antes: '$2.400', desc: '2x1 en todas las bebidas calientes de lunes a viernes de 15 a 17 hs.', badge: 'LIMITADO', img: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=70' },
              { titulo: 'Desayuno Corporativo', precio: 'Consultar', antes: '', desc: 'Pack para empresas. Servicio a domicilio con bandeja completa para 6 o más personas.', badge: 'EMPRESAS', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=70' },
            ].map((promo) => (
              <div key={promo.titulo} style={{ background: '#0F0608', border: '1px solid rgba(196,80,106,0.3)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <img src={promo.img} alt={promo.titulo} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block', opacity: 0.7 }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#8B1A2E', color: '#F5EDE8', fontSize: '0.65rem', letterSpacing: '0.12em', padding: '0.25rem 0.6rem' }}>{promo.badge}</div>
                </div>
                <div style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#F5EDE8', marginBottom: '0.75rem', fontWeight: 400 }}>{promo.titulo}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#C4506A' }}>{promo.precio}</span>
                    {promo.antes && <span style={{ fontSize: '0.85rem', color: 'rgba(245,237,232,0.3)', textDecoration: 'line-through' }}>{promo.antes}</span>}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(245,237,232,0.55)', lineHeight: 1.7, margin: 0 }}>{promo.desc}</p>
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(180,60,80,0.2)' }}>
                    <a onClick={() => scrollTo('reservas')} style={{ fontSize: '0.78rem', color: '#C4506A', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Quiero esta promo →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section id="galeria" className="lm-section-pad" style={{ padding: '7rem 3rem', background: '#130508' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4506A', display: 'block', marginBottom: '1rem' }}>Viví la experiencia</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: '#F5EDE8', fontWeight: 400, fontStyle: 'italic' }}>Así se ve La Mañana</h2>
          </div>
          <div className="lm-galeria-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: '1rem' }}>
            {[
              { img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&q=80', featured: true },
              { img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=75', featured: false },
              { img: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=600&q=75', featured: false },
              { img: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=75', featured: false },
              { img: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=600&q=75', featured: false },
            ].map((item, i) => (
              <div key={i}
                className={item.featured ? 'lm-galeria-featured' : ''}
                style={{
                  ...(item.featured ? { gridColumn: '1', gridRow: '1 / 3', minHeight: '420px' } : { minHeight: '200px' }),
                  overflow: 'hidden', position: 'relative'
                }}>
                <img src={item.img} alt={`Galería ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(180,60,80,0.2)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESERVAS */}
      <section id="reservas" className="lm-section-pad" style={{ padding: '7rem 3rem', background: '#0F0608', borderTop: '1px solid rgba(180,60,80,0.15)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="lm-reservas-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4506A', display: 'block', marginBottom: '1rem' }}>Reservas</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: '#F5EDE8', lineHeight: 1.15, marginBottom: '1.5rem', fontWeight: 400 }}>
                Asegurá<br /><span style={{ color: '#C4506A', fontStyle: 'italic' }}>tu mesa</span>
              </h2>
              <p style={{ color: 'rgba(245,237,232,0.55)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2rem' }}>Para grupos de más de 4 personas recomendamos reservar con anticipación. También aceptamos pedidos para eventos y desayunos corporativos.</p>
              {[
                { titulo: 'Horarios', texto: 'Lun–Vie · 8:00 a 16:00 hs\nSábados · 9:00 a 17:00 hs\nDomingos · 9:00 a 14:00 hs' },
                { titulo: 'WhatsApp', texto: '+54 9 2346 000000\nRespondemos en menos de 1 hora' },
                { titulo: 'Ubicación', texto: 'Av. San Martín 450\nCentro, Chivilcoy' },
              ].map((info) => (
                <div key={info.titulo} style={{ marginBottom: '1rem', padding: '1.25rem 1.5rem', background: '#1A060C', borderLeft: '3px solid #8B1A2E' }}>
                  <strong style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4506A', display: 'block', marginBottom: '0.5rem' }}>{info.titulo}</strong>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(245,237,232,0.55)', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{info.texto}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleReserva}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,237,232,0.4)', marginBottom: '0.5rem' }}>Nombre completo</label>
                <input required type="text" placeholder="Tu nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem 1rem', background: '#1A060C', border: '1px solid rgba(180,60,80,0.25)', color: '#F5EDE8', fontSize: '0.9rem', fontFamily: 'Georgia, serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,237,232,0.4)', marginBottom: '0.5rem' }}>Email</label>
                <input type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem 1rem', background: '#1A060C', border: '1px solid rgba(180,60,80,0.25)', color: '#F5EDE8', fontSize: '0.9rem', fontFamily: 'Georgia, serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div className="lm-form-dates" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,237,232,0.4)', marginBottom: '0.5rem' }}>Fecha</label>
                  <input required type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem 1rem', background: '#1A060C', border: '1px solid rgba(180,60,80,0.25)', color: '#F5EDE8', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,237,232,0.4)', marginBottom: '0.5rem' }}>Personas</label>
                  <select value={form.personas} onChange={e => setForm({ ...form, personas: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem 1rem', background: '#1A060C', border: '1px solid rgba(180,60,80,0.25)', color: '#F5EDE8', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="1">1 persona</option>
                    <option value="2">2 personas</option>
                    <option value="4">3–4 personas</option>
                    <option value="5">5 o más</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,237,232,0.4)', marginBottom: '0.5rem' }}>Comentarios</label>
                <textarea placeholder="Alergias, ocasión especial, preferencias..." rows={4} value={form.comentario} onChange={e => setForm({ ...form, comentario: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem 1rem', background: '#1A060C', border: '1px solid rgba(180,60,80,0.25)', color: '#F5EDE8', fontSize: '0.9rem', fontFamily: 'Georgia, serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              {enviado ? (
                <div style={{ background: 'rgba(6,95,70,0.2)', border: '1px solid rgba(6,95,70,0.4)', padding: '1rem', textAlign: 'center', color: '#6EE7B7', fontSize: '0.9rem' }}>
                  ✓ Reserva enviada. Te confirmamos a la brevedad.
                </div>
              ) : (
                <button type="submit" disabled={enviando} style={{ width: '100%', padding: '1rem', background: enviando ? '#5C1A2E' : '#8B1A2E', color: '#F5EDE8', border: 'none', fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: enviando ? 'not-allowed' : 'pointer', fontFamily: 'Georgia, serif' }}>
                  {enviando ? 'Enviando...' : 'Enviar reserva'}
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section id="ubicacion" className="lm-section-pad" style={{ padding: '5rem 3rem', background: '#130508' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="lm-ubicacion-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4506A', display: 'block', marginBottom: '0.5rem' }}>Dónde estamos</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#F5EDE8', fontWeight: 400 }}>Encontranos <span style={{ color: '#C4506A', fontStyle: 'italic' }}>fácil</span></h2>
            </div>
            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              {[{ label: 'Dirección', value: 'Av. San Martín 450, Chivilcoy' }, { label: 'Teléfono', value: '+54 9 2346 000000' }, { label: 'Email', value: 'hola@lamanana.com.ar' }].map((d) => (
                <div key={d.label}>
                  <strong style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4506A', marginBottom: '0.3rem' }}>{d.label}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(245,237,232,0.55)' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.0!2d-60.0167!3d-34.8983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDUzJzU0LjAiUyA2MMKwMDEnMDAuMSJX!5e0!3m2!1ses!2sar!4v1234567890"
            width="100%" height="320" style={{ border: '1px solid rgba(180,60,80,0.2)', display: 'block', filter: 'grayscale(80%) invert(90%) sepia(20%)' }} allowFullScreen loading="lazy" />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#080306', padding: '4rem 3rem 2rem', borderTop: '1px solid rgba(180,60,80,0.2)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="lm-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#E8C4B8', marginBottom: '0.5rem' }}>La Mañana</div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,237,232,0.3)', marginBottom: '1.25rem' }}>Café & Brunch · Chivilcoy</div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(245,237,232,0.4)', lineHeight: 1.7 }}>Un espacio cálido para empezar el día con lo mejor. Abrimos todos los días para vos.</p>
            </div>
            {[
              { titulo: 'Menú', links: ['Brunch','Cafés','Postres','Bebidas'] },
              { titulo: 'Horarios', links: ['Lun–Vie 8 a 16 hs','Sábados 9 a 17 hs','Domingos 9 a 14 hs'] },
              { titulo: 'Contacto', links: ['WhatsApp','Instagram','Facebook','Email'] },
            ].map((col) => (
              <div key={col.titulo}>
                <strong style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C4506A', marginBottom: '1rem' }}>{col.titulo}</strong>
                {col.links.map(link => <div key={link} style={{ fontSize: '0.85rem', color: 'rgba(245,237,232,0.4)', marginBottom: '0.5rem' }}>{link}</div>)}
              </div>
            ))}
          </div>
          <div className="lm-footer-bottom" style={{ borderTop: '1px solid rgba(180,60,80,0.15)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(245,237,232,0.2)' }}>© 2026 La Mañana. Todos los derechos reservados.</span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(245,237,232,0.2)' }}>Diseñado por <span style={{ color: '#C4506A' }}>Santiago JFD</span> · <span style={{ color: '#C4506A' }}>santiagofd.mkt@gmail.com</span></span>
          </div>
        </div>
      </footer>

    </main>
  )
}