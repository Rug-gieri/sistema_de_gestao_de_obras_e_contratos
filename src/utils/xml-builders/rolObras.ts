import { useDB } from '../../stores/useDB'
import { tag, digits, mesAnoDate } from './common'

export function rolObras(mes: string, ano: string): string | null {
  const db = useDB()
  const list = db.rolObras
  if (!list || list.length === 0) return null
  let xml = ''
  for (const r of list) {
    xml += '    <RolObras>\n'
    xml += tag('cnpj', digits(r.cnpj))
    xml += tag('idcontratopncp', r.idcontratopncp)
    xml += tag('idcontratacaopncp', r.idcontratacaopncp)
    xml += tag('tipoinstrumentocontratacao', r.tipoinstrumentocontratacao)
    xml += tag('numinstrumentocontratual', r.numinstrumentocontratual)
    xml += tag('anoinstrumentocontratual', r.anoinstrumentocontratual)
    xml += tag('bem', r.bem)
    xml += tag('desc', r.desc)
    xml += tag('tipo', r.tipo)
    xml += tag('unidmedida', r.unidmedida)
    xml += tag('tamanho', r.tamanho)
    xml += tag('setor', r.setor)
    xml += tag('tiposerv', r.tiposerv)
    xml += tag('qtdeend', r.qtdend)
    if (r.qtdend === '1') {
      xml += tag('endereco', r.endereco)
      xml += tag('bairro', r.bairro)
      xml += tag('municipio', r.municipio)
      xml += tag('cep', digits(r.cep))
    }
    xml += tag('lat', r.lat)
    xml += tag('long', r.long)
    xml += tag('linkpub', r.linkpub)
    xml += tag('cei', digits(r.cei))
    xml += tag('munibge', r.munibge)
    xml += tag('processo', r.processo)
    xml += tag('anoproc', r.anoproc)
    xml += tag('planlic', r.planlic)
    xml += tag('planven', r.planven)
    xml += tag('projcontratante', r.projcontratante)
    xml += tag('projcontratada', r.projcontratada)
    xml += '    </RolObras>\n'
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    '<Raiz>\n',
    `  <MesAnoMovimento>${mesAnoDate(mes, ano)}</MesAnoMovimento>\n`,
    xml,
    '</Raiz>\n',
  ].join('')
}
