import { useDB } from '../../stores/useDB'
import { tag, tagR, digits, mesAnoDate } from './common'

export function rolContratos(mes: string, ano: string): string | null {
  const db = useDB()
  const list = db.rolContratos
  if (!list || list.length === 0) return null
  let xml = ''
  for (const r of list) {
    xml += '    <RolContratos>\n'
    xml += tag('cnpj', digits(r.cnpj))
    xml += tag('idcontratopncp', r.idcontratopncp)
    xml += tag('idcontratacaopncp', r.idcontratacaopncp)
    xml += tag('tipo', r.tipo)
    xml += tag('processo', r.processo)
    xml += tag('anoproc', r.anoproc)
    xml += tag('numinstrumentocontratual', r.numinstrumentocontratual)
    xml += tag('anoinstrumentocontratual', r.anoinstrumentocontratual)
    xml += tag('categoria', r.categoria)
    xml += tag('tppessoa', r.tppessoa)
    xml += tagR('contratado', r.contratado)
    xml += tag('objeto', r.objeto)
    xml += tag('valini', r.valini)
    xml += tag('vigenciaindeterminada', r.vigenciaindeterminada)
    xml += tag('dataviginicio', r.dataviginicio)
    if (r.vigenciaindeterminada === 'N') {
      xml += tag('datavigfim', r.datavigfim)
    }
    xml += tag('dataassinatura', r.dataassinatura)
    xml += tag('datapub', r.datapub)
    xml += tag('localpub', r.localpub)
    xml += tag('urlpublicacao', r.urlpublicacao)
    xml += tag('recdes', r.recdes)
    xml += tag('garantia', r.garantia)
    if (r.garantia === 'S') {
      xml += tag('valorgarantia', r.valorgarantia)
      xml += tag('modalidadegarantia', r.modalidadegarantia)
      xml += tag('bensgarantia', r.bensgarantia)
      if (r.bensgarantia === 'S') {
        xml += tag('valbensgarantia', r.valbensgarantia)
      }
    }
    xml += tag('subcontrato', r.subcontrato)
    xml += tag('arquivo', r.arquivo)
    xml += '    </RolContratos>\n'
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<Raiz>\n',
    `  <MesAnoMovimento>${mesAnoDate(mes, ano)}</MesAnoMovimento>\n`,
    xml,
    '</Raiz>\n',
  ].join('')
}
