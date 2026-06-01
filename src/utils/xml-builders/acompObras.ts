import { useDB } from '../../stores/useDB'
import { tag, digits, mesAnoDate } from './common'

export function acompObras(mes: string, ano: string): string | null {
  const db = useDB()
  const list = db.acompObras
  if (!list || list.length === 0) return null
  let xml = ''
  for (const r of list) {
    xml += '    <AcompanhamentoObras>\n'
    xml += tag('cnpj', digits(r.cnpj))
    xml += tag('idcontratopncp', r.idcontratopncp)
    xml += tag('numinstrumentocontratual', r.numinstrumentocontratual)
    xml += tag('anoinstrumentocontratual', r.anoinstrumentocontratual)
    xml += tag('situacao', r.situacao)
    xml += tag('medicaonum', r.medicaonum)
    xml += tag('medicaoval', r.medicaoval)
    xml += tag('medicaoperc', r.medicaoperc)
    xml += tag('medicaodata', r.medicaodata)
    xml += tag('medicaovalac', r.medicaovalac)
    xml += tag('medicaopercac', r.medicaopercac)
    xml += tag('processo', r.processo)
    xml += tag('anoproc', r.anoproc)
    xml += tag('relfot', r.relfot)
    xml += tag('planobra', r.planobra)
    xml += '    </AcompanhamentoObras>\n'
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<Raiz>\n',
    `  <MesAnoMovimento>${mesAnoDate(mes, ano)}</MesAnoMovimento>\n`,
    xml,
    '</Raiz>\n',
  ].join('')
}
