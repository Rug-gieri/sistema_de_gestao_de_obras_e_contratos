import { useDB } from '../../stores/useDB'
import { tag, digits, mesAnoDate } from './common'

export function acompContratos(mes: string, ano: string): string | null {
  const db = useDB()
  const list = db.acompContratos
  if (!list || list.length === 0) return null
  let xml = ''
  for (const r of list) {
    xml += '    <AcompanhamentoContratos>\n'
    xml += tag('cnpj', digits(r.cnpj))
    xml += tag('idcontratopncp', r.idcontratopncp)
    xml += tag('numeroalteracao', r.numeroalteracao)
    xml += tag('anoalteracao', r.anoalteracao)
    xml += tag('sequencial', r.sequencial)
    xml += tag('dataassinaturaalteracao', r.dataassinaturaalteracao)
    xml += tag('datapubalteracao', r.datapubalteracao)
    xml += tag('localpubalteracao', r.localpubalteracao)
    xml += tag('urlalteracao', r.urlalteracao)
    xml += tag('tipoalteracao', r.tipoalteracao)
    if (r.tipoalteracao === '1') {
      xml += tag('classificacaoaditivo', r.classificacaoaditivo)
      if (r.classificacaoaditivo === '1') {
        xml += tag('classificacaounilateral', r.classificacaounilateral)
        if (['1', '3'].includes(r.classificacaounilateral)) {
          xml += tag('modprojeto', r.modprojeto)
        }
        if (['2', '3', '5'].includes(r.classificacaounilateral)) {
          xml += tag('modvalor', r.modvalor)
          if (['1', '3'].includes(r.modvalor)) {
            xml += tag('valacrescimo', r.valacrescimo)
          }
          if (['2', '3'].includes(r.modvalor)) {
            xml += tag('valsupressao', r.valsupressao)
          }
        }
        if (['4', '5'].includes(r.classificacaounilateral)) {
          xml += tag('datavig', r.datavig)
        }
      }
      if (r.classificacaoaditivo === '2') {
        xml += tag('classificacaobilateral', r.classificacaobilateral)
        if (r.classificacaobilateral === '7') {
          xml += tag('descricaobilateral', r.descricaobilateral)
        }
        if (r.classificacaobilateral === '6') {
          xml += tag('datavig', r.datavig)
        }
      }
    }
    xml += tag('objeto', r.objeto)
    if (r.tipoalteracao === '2') {
      xml += tag('tipoapostilamento', r.tipoapostilamento)
      if (['1', '2', '3'].includes(r.tipoapostilamento)) {
        xml += tag('valapostilamento', r.valapostilamento)
      }
      if (r.tipoapostilamento === '7') {
        xml += tag('descricaoapostilamento', r.descricaoapostilamento)
      }
    }
    xml += tag('arquivo', r.arquivo)
    xml += '    </AcompanhamentoContratos>\n'
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<Raiz>\n',
    `  <MesAnoMovimento>${mesAnoDate(mes, ano)}</MesAnoMovimento>\n`,
    xml,
    '</Raiz>\n',
  ].join('')
}
