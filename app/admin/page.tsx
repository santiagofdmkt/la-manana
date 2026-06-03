'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Reserva = {
  id: string
  nombre: string
  email: string
  fecha: string
  horario: string
  personas: number
  comentario: string
  estado: string
  created_at: string
}

type Promocion = {
  id: string
  titulo: string
  descripcion: string
  precio: string
  activa: boolean
}

const pillStyle = (bg: string, color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
  borderRadius: '20px', fontSize: '0.72rem', fontWeight: 500, background: bg, color
})

const S: Record<string, React.CSSProperties> = {
  wrap: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", background: '#F4F1EE' },
  sidebar: { width: '240px', background: '#0F0608', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  logoWrap: { padding: '1.75rem 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  logoName: { fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#E8C4B8', marginBottom: '2px' },
  logoTag: { fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' },
  navWrap: { padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar: { background: '#fff', padding: '1rem 2rem', borderBottom: '1px solid #E5E0DB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  content: { flex: 1, padding: '2rem', overflowY: 'auto' },
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #E5E0DB', padding: '1.5rem' },
  metricCard: { background: '#fff', borderRadius: '12px', border: '1px solid #E5E0DB', padding: '1.25rem' },
}

export default function AdminPanel() {
  const [seccion, setSeccion] = useState('dashboard')
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    setLoading(true)
    const { data: res } = await supabase.from('lm_reservas').select('*').order('created_at', { ascending: false })
    const { data: pro } = await supabase.from('lm_promociones').select('*').order('created_at', { ascending: false })
    if (res) setReservas(res)
    if (pro) setPromociones(pro)
    setLoading(false)
  }

  async function cambiarEstado(id: string, estado: string) {
    await supabase.from('lm_reservas').update({ estado }).eq('id', id)
    cargarDatos()
  }

  async function togglePromo(id: string, activa: boolean) {
    await supabase.from('lm_promociones').update({ activa: !activa }).eq('id', id)
    cargarDatos()
  }

  async function agregarPromo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    await supabase.from('lm_promociones').insert({
      titulo: fd.get('titulo'),
      descripcion: fd.get('descripcion'),
      precio: fd.get('precio'),
      activa: true
    })
    form.reset()
    cargarDatos()
  }

  const pendientes = reservas.filter(r => r.estado === 'pendiente').length
  const confirmadas = reservas.filter(r => r.estado === 'confirmada').length
  const promosActivas = promociones.filter(p => p.activa).length
  const hoy = new Date().toISOString().split('T')[0]
  const reservasHoy = reservas.filter(r => r.fecha === hoy).length

  const nav = [
    { id: 'dashboard', label: 'Dashboard', emoji: '▦' },
    { id: 'reservas', label: 'Reservas', emoji: '◷', badge: pendientes },
    { id: 'promociones', label: 'Promociones', emoji: '✦' },
    { id: 'mensajes', label: 'Mensajes', emoji: '◉' },
  ]

  function NavBtn({ item }: { item: typeof nav[0] }) {
    const active = seccion === item.id
    return (
      <button onClick={() => setSeccion(item.id)} style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
        padding: '0.65rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
        background: active ? 'rgba(196,80,106,0.18)' : 'transparent',
        color: active ? '#E8A0B0' : 'rgba(255,255,255,0.45)',
        fontSize: '0.875rem', textAlign: 'left', transition: 'all 0.15s'
      }}>
        <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>{item.emoji}</span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge ? <span style={{ background: '#8B1A2E', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '10px' }}>{item.badge}</span> : null}
      </button>
    )
  }

  function EstadoPill({ estado }: { estado: string }) {
    const cfg: Record<string, { bg: string; color: string; label: string }> = {
      pendiente: { bg: '#FEF3C7', color: '#92400E', label: 'Pendiente' },
      confirmada: { bg: '#D1FAE5', color: '#065F46', label: 'Confirmada' },
      cancelada: { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelada' },
    }
    const c = cfg[estado] || cfg.pendiente
    return <span style={pillStyle(c.bg, c.color)}>{c.label}</span>
  }

  return (
    <div style={S.wrap}>
      <div style={S.sidebar}>
        <div style={S.logoWrap}>
          <div style={S.logoName}>La Mañana</div>
          <div style={S.logoTag}>Panel de administración</div>
        </div>
        <div style={S.navWrap}>
          {nav.map(item => <NavBtn key={item.id} item={item} />)}
        </div>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', marginBottom: '0.5rem' }}>
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <a href="/" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Ver sitio</a>
        </div>
      </div>

      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1A0A0C' }}>
              {nav.find(n => n.id === seccion)?.label || 'Dashboard'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#999', marginTop: '1px' }}>La Mañana · Café & Brunch</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {pendientes > 0 && (
              <span style={{ background: '#FEE2E2', color: '#991B1B', fontSize: '0.75rem', padding: '0.3rem 0.85rem', borderRadius: '20px', fontWeight: 500 }}>
                {pendientes} pendiente{pendientes > 1 ? 's' : ''}
              </span>
            )}
            <button onClick={cargarDatos} style={{ background: '#F4F1EE', border: '1px solid #E5E0DB', padding: '0.45rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#666', fontWeight: 500 }}>
              ↻ Actualizar
            </button>
          </div>
        </div>

        <div style={S.content}>
          {loading && <div style={{ textAlign: 'center', color: '#999', padding: '4rem' }}>Cargando datos...</div>}

          {!loading && seccion === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Reservas hoy', val: reservasHoy, sub: 'del día', accent: '#8B1A2E' },
                  { label: 'Pendientes', val: pendientes, sub: 'sin confirmar', accent: '#92400E' },
                  { label: 'Confirmadas', val: confirmadas, sub: 'total', accent: '#065F46' },
                  { label: 'Promos activas', val: promosActivas, sub: 'publicadas', accent: '#1E3A5F' },
                ].map(m => (
                  <div key={m.label} style={S.metricCard}>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, color: m.accent, lineHeight: 1 }}>{m.val}</div>
                    <div style={{ fontSize: '0.72rem', color: '#bbb', marginTop: '4px' }}>{m.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={S.card}>
                  <div style={{ fontWeight: 600, color: '#1A0A0C', marginBottom: '1rem', fontSize: '0.9rem' }}>Últimas reservas</div>
                  {reservas.slice(0, 5).map(r => (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F0EDE8' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#8B1A2E', fontSize: '0.85rem', flexShrink: 0 }}>
                        {r.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1A0A0C' }}>{r.nombre}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999' }}>{r.fecha} · {r.personas} personas</div>
                      </div>
                      <EstadoPill estado={r.estado} />
                    </div>
                  ))}
                  {reservas.length === 0 && <div style={{ color: '#999', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>Sin reservas aún</div>}
                </div>
                <div style={S.card}>
                  <div style={{ fontWeight: 600, color: '#1A0A0C', marginBottom: '1rem', fontSize: '0.9rem' }}>Promociones activas</div>
                  {promociones.filter(p => p.activa).map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F0EDE8' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B1A2E', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1A0A0C' }}>{p.titulo}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999' }}>{p.precio}</div>
                      </div>
                    </div>
                  ))}
                  {promosActivas === 0 && <div style={{ color: '#999', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>Sin promos activas</div>}
                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F0EDE8' }}>
                    <div style={{ fontWeight: 600, color: '#1A0A0C', marginBottom: '0.75rem', fontSize: '0.85rem' }}>Accesos rápidos</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[
                        { label: 'Instagram', color: '#E1306C', href: 'https://instagram.com' },
                        { label: 'Facebook', color: '#1877F2', href: 'https://facebook.com' },
                        { label: 'WhatsApp Business', color: '#25D366', href: 'https://wa.me' },
                        { label: 'Google My Business', color: '#EA4335', href: 'https://business.google.com' },
                      ].map(a => (
                        <a key={a.label} href={a.href} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: '#F8F6F3', textDecoration: 'none', fontSize: '0.82rem', color: '#333', border: '1px solid #EEE' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, display: 'inline-block' }} />
                          {a.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && seccion === 'reservas' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Total', val: reservas.length, color: '#1A0A0C' },
                  { label: 'Pendientes', val: pendientes, color: '#92400E' },
                  { label: 'Confirmadas', val: confirmadas, color: '#065F46' },
                ].map(m => (
                  <div key={m.label} style={S.metricCard}>
                    <div style={{ fontSize: '0.72rem', color: '#999', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: m.color }}>{m.val}</div>
                  </div>
                ))}
              </div>
              {reservas.length === 0 && <div style={{ ...S.card, textAlign: 'center', color: '#999', padding: '3rem' }}>No hay reservas aún</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reservas.map(r => (
                  <div key={r.id} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.5rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#8B1A2E', fontSize: '1rem', flexShrink: 0 }}>
                      {r.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: '#1A0A0C', marginBottom: '2px' }}>{r.nombre}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        {r.fecha} · {r.horario || 'Sin horario'} · {r.personas} {r.personas === 1 ? 'persona' : 'personas'}
                        {r.email && ` · ${r.email}`}
                      </div>
                      {r.comentario && <div style={{ fontSize: '0.76rem', color: '#bbb', marginTop: '3px', fontStyle: 'italic' }}>"{r.comentario}"</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <EstadoPill estado={r.estado} />
                      {r.estado === 'pendiente' && (
                        <>
                          <button onClick={() => cambiarEstado(r.id, 'confirmada')} style={{ background: '#065F46', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500 }}>Confirmar</button>
                          <button onClick={() => cambiarEstado(r.id, 'cancelada')} style={{ background: '#991B1B', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500 }}>Cancelar</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && seccion === 'promociones' && (
            <div>
              <div style={{ ...S.card, marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 600, color: '#1A0A0C', marginBottom: '1.25rem' }}>Nueva promoción</div>
                <form onSubmit={agregarPromo} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Título</label>
                    <input name="titulo" required placeholder="Brunch para dos" style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #E5E0DB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: '#FAFAF9' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Precio</label>
                    <input name="precio" placeholder="$9.900" style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #E5E0DB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: '#FAFAF9' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Descripción</label>
                    <input name="descripcion" placeholder="Descripción de la promo" style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #E5E0DB', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: '#FAFAF9' }} />
                  </div>
                  <div>
                    <button type="submit" style={{ background: '#8B1A2E', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>+ Agregar promoción</button>
                  </div>
                </form>
              </div>
              {promociones.length === 0 && <div style={{ ...S.card, textAlign: 'center', color: '#999', padding: '3rem' }}>No hay promociones aún</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {promociones.map(p => (
                  <div key={p.id} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.activa ? '#8B1A2E' : '#D1D5DB', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#1A0A0C' }}>{p.titulo}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>{p.descripcion}{p.precio ? ` · ${p.precio}` : ''}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.78rem', color: p.activa ? '#065F46' : '#999', fontWeight: 500 }}>{p.activa ? 'Activa' : 'Inactiva'}</span>
                      <div onClick={() => togglePromo(p.id, p.activa)} style={{ width: '44px', height: '24px', borderRadius: '12px', background: p.activa ? '#8B1A2E' : '#D1D5DB', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                        <div style={{ position: 'absolute', top: '4px', left: p.activa ? '22px' : '4px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && seccion === 'mensajes' && (
            <div style={{ ...S.card, textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
              <div style={{ fontWeight: 600, color: '#1A0A0C', marginBottom: '0.5rem' }}>Mensajes de contacto</div>
              <div style={{ fontSize: '0.85rem', color: '#999' }}>Aparecerán aquí cuando alguien envíe el formulario del sitio</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}