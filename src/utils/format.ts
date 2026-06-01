export function fmtDt(v: string): string {
  return v ? v.split('-').reverse().join('/') : '—'
}

export function fmtBRL(v: string | number): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  return n ? 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'
}

export function fmtAbbr(v: string | number): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (n >= 1e6) return 'R$' + (n / 1e6).toFixed(2).replace('.', ',') + ' M'
  if (n >= 1e3) return 'R$' + (n / 1e3).toFixed(1).replace('.', ',') + ' K'
  return 'R$' + n.toFixed(0)
}

export function pct(v: string | number): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  return n ? n.toFixed(1) + '%' : '—'
}

export function digits(v: string): string {
  return (v || '').replace(/\D/g, '')
}

export function esc(v: string): string {
  return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function onlyNums(v: string): string {
  return (v || '').replace(/\D/g, '')
}

export function uid(): string {
  return Date.now() + Math.random().toString(36).slice(2)
}
