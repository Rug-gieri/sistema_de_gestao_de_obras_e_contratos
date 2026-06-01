import { useDB } from '../../stores/useDB'
import { tag, digits, mesAnoDate } from './common'

export function fiscalGestor(mes: string, ano: string): string | null {
  const db = useDB()
  const list = db.fiscalGestor
  if (!list || list.length === 0) return null
  let xml = ''
  for (const r of list) {
    xml += '    <FiscalGestor>\n'
    xml += tag('cnpj', digits(r.cnpj))
    xml += tag('idcontratopncp', r.idcontratopncp)
    xml += tag('tipoagente', r.tipoagente)
    xml += tag('identificadoragente', r.identificadoragente)
    xml += tag('nomeagente', r.nomeagente)
    if (r.identificadoragente === '1') {
      xml += tag('cpfagente', digits(r.cpfagente))
    }
    if (r.identificadoragente === '2') {
      xml += tag('cnpjagente', digits(r.cnpjagente))
    }
    xml += tag('naturezacargo', r.naturezacargo)
    if (r.naturezacargo === '7') {
      xml += tag('descricaonatureza', r.descricaonatureza)
    }
    if (r.tipoagente === '1') {
      xml += tag('classificacaofiscal', r.classificacaofiscal)
      if (r.classificacaofiscal === '6') {
        xml += tag('descricaofiscal', r.descricaofiscal)
      }
    }
    if (r.tipoagente === '2') {
      xml += tag('classificacaogestor', r.classificacaogestor)
      if (r.classificacaogestor === '3') {
        xml += tag('descricaogestor', r.descricaogestor)
      }
    }
    xml += tag('designacao', r.designacao)
    if (r.designacao === '6') {
      xml += tag('descricaodesignacao', r.descricaodesignacao)
    }
    xml += tag('numerodesignacao', r.numerodesignacao)
    xml += tag('anodesignacao', r.anodesignacao)
    xml += tag('datadesignacao', r.datadesignacao)
    xml += tag('localdesignacao', r.localdesignacao)
    xml += tag('urldesignacao', r.urldesignacao)
    xml += '    </FiscalGestor>\n'
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<Raiz>\n',
    `  <MesAnoMovimento>${mesAnoDate(mes, ano)}</MesAnoMovimento>\n`,
    xml,
    '</Raiz>\n',
  ].join('')
}
