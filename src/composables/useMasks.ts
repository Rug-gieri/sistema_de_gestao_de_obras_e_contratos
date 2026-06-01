export function maskCNPJ(v: string): string {
  let s = v.replace(/\D/g, '').substring(0, 14)
  s = s.replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  return s
}

export function maskCPF(v: string): string {
  let s = v.replace(/\D/g, '').substring(0, 11)
  s = s.replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return s
}

export function maskCEP(v: string): string {
  let s = v.replace(/\D/g, '').substring(0, 8)
  s = s.replace(/(\d{5})(\d)/, '$1-$2')
  return s
}
