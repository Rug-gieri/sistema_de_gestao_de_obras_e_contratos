import { useDB } from '../../stores/useDB'
import { tag, digits, mesAnoDate } from './common'

export function situacaoContrato(mes: string, ano: string): string | null {
  const db = useDB()
  const list = db.situacaoContrato
  if (!list || list.length === 0) return null
  let xml = ''
  for (const r of list) {
    xml += '    <SituacaoContrato>\n'
    xml += tag('cnpj', digits(r.cnpj))
    xml += tag('idcontratopncp', r.idcontratopncp)
    xml += tag('codigosituacaoinstrumentocontratacao', r.codigosituacaoinstrumentocontratacao)
    xml += tag('justificativasituacao', r.justificativasituacao)
    xml += '    </SituacaoContrato>\n'
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<Raiz>\n',
    `  <MesAnoMovimento>${mesAnoDate(mes, ano)}</MesAnoMovimento>\n`,
    xml,
    '</Raiz>\n',
  ].join('')
}
