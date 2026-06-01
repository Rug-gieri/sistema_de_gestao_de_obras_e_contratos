import { useDB } from '../../stores/useDB'
import { tag, digits, mesAnoDate } from './common'

export function respTecnico(mes: string, ano: string): string | null {
  const db = useDB()
  const list = db.respTecnico
  if (!list || list.length === 0) return null
  let xml = ''
  for (const r of list) {
    xml += '    <RespTecnico>\n'
    xml += tag('cnpj', digits(r.cnpj))
    xml += tag('idcontratopncp', r.idcontratopncp)
    xml += tag('numinstrumentocontratual', r.numinstrumentocontratual)
    xml += tag('anoinstrumentocontratual', r.anoinstrumentocontratual)
    xml += tag('processo', r.processo)
    xml += tag('anoproc', r.anoproc)
    xml += tag('arttipo', r.arttipo)
    xml += tag('artnum', r.artnum)
    xml += tag('artdata', r.artdata)
    xml += tag('artcpf', digits(r.artcpf))
    xml += tag('artregistro', r.artregistro)
    xml += tag('artconselho', r.artconselho)
    xml += '    </RespTecnico>\n'
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<Raiz>\n',
    `  <MesAnoMovimento>${mesAnoDate(mes, ano)}</MesAnoMovimento>\n`,
    xml,
    '</Raiz>\n',
  ].join('')
}
