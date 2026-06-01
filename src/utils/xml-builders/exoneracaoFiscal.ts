import { useDB } from '../../stores/useDB'
import { tag, digits, mesAnoDate } from './common'

export function exoneracaoFiscal(mes: string, ano: string): string | null {
  const db = useDB()
  const list = db.exoneracaoFiscal
  if (!list || list.length === 0) return null
  let xml = ''
  for (const r of list) {
    xml += '    <ExoneracaoFiscal>\n'
    xml += tag('cnpj', digits(r.cnpj))
    xml += tag('idcontratopncp', r.idcontratopncp)
    xml += tag('identificadoragente', r.identificadoragente)
    if (r.identificadoragente === '1') {
      xml += tag('cpfagente', digits(r.cpfagente))
    }
    if (r.identificadoragente === '2') {
      xml += tag('cnpjagente', digits(r.cnpjagente))
    }
    xml += tag('dataexoneracao', r.dataexoneracao)
    xml += tag('exoneracao', r.exoneracao)
    if (r.exoneracao === '6') {
      xml += tag('descricaoexoneracao', r.descricaoexoneracao)
    }
    xml += tag('numeroexoneracao', r.numeroexoneracao)
    xml += tag('anoexoneracao', r.anoexoneracao)
    xml += tag('datapubliexoneracao', r.datapubliexoneracao)
    xml += tag('localdesignacao', r.localexoneracao)
    xml += tag('urlexoneracao', r.urlexoneracao)
    xml += '    </ExoneracaoFiscal>\n'
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<Raiz>\n',
    `  <MesAnoMovimento>${mesAnoDate(mes, ano)}</MesAnoMovimento>\n`,
    xml,
    '</Raiz>\n',
  ].join('')
}
