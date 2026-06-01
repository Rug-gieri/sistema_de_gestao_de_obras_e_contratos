export function mesAnoDate(mes: string, ano: string): string {
  return `${ano}-${mes}-01`
}

export function ex(v: string): string {
  return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export function tag(name: string, val: string, indent = '      '): string {
  if (val === null || val === undefined || val === '') return ''
  return `${indent}<${name}>${ex(String(val))}</${name}>\n`
}

export function tagR(name: string, val: string, indent = '      '): string {
  return `${indent}<${name}>${ex(String(val || ''))}</${name}>\n`
}

export function digits(v: string): string {
  return (v || '').replace(/\D/g, '')
}
