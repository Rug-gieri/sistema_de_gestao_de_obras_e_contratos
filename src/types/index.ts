export interface RolContrato {
  _id: string
  cnpj: string
  idcontratopncp: string
  idcontratacaopncp: string
  tipo: string
  processo: string
  anoproc: string
  numinstrumentocontratual: string
  anoinstrumentocontratual: string
  categoria: string
  tppessoa: string
  contratado: string
  objeto: string
  valini: string
  vigenciaindeterminada: string
  dataviginicio: string
  datavigfim: string
  dataassinatura: string
  datapub: string
  localpub: string
  urlpublicacao: string
  recdes: string
  garantia: string
  valorgarantia: string
  modalidadegarantia: string
  bensgarantia: string
  valbensgarantia: string
  subcontrato: string
  arquivo: string
}

export interface FiscalGestor {
  _id: string
  idcontratopncp: string
  cnpj: string
  tipoagente: string
  identificadoragente: string
  nomeagente: string
  cpfagente: string
  cnpjagente: string
  naturezacargo: string
  descricaonatureza: string
  classificacaofiscal: string
  descricaofiscal: string
  classificacaogestor: string
  descricaogestor: string
  designacao: string
  descricaodesignacao: string
  numerodesignacao: string
  anodesignacao: string
  datadesignacao: string
  localdesignacao: string
  urldesignacao: string
}

export interface RolObra {
  _id: string
  cnpj: string
  idcontratopncp: string
  idcontratacaopncp: string
  tipoinstrumentocontratacao: string
  numinstrumentocontratual: string
  anoinstrumentocontratual: string
  bem: string
  desc: string
  tipo: string
  unidmedida: string
  tamanho: string
  setor: string
  tiposerv: string
  qtdend: string
  endereco: string
  bairro: string
  municipio: string
  cep: string
  lat: string
  long: string
  linkpub: string
  cei: string
  munibge: string
  processo: string
  anoproc: string
  planlic: string
  planven: string
  projcontratante: string
  projcontratada: string
  qtdeend?: string
}

export interface AcompContrato {
  _id: string
  cnpj: string
  idcontratopncp: string
  numeroalteracao: string
  anoalteracao: string
  sequencial: string
  dataassinaturaalteracao: string
  datapubalteracao: string
  localpubalteracao: string
  urlalteracao: string
  tipoalteracao: string
  classificacaoaditivo: string
  classificacaounilateral: string
  classificacaobilateral: string
  descricaobilateral: string
  modprojeto: string
  modvalor: string
  valacrescimo: string
  valsupressao: string
  datavig: string
  objeto: string
  tipoapostilamento: string
  valapostilamento: string
  descricaoapostilamento: string
  descricaoadapostilamento: string
  arquivo: string
}

export interface AcompObra {
  _id: string
  cnpj: string
  idcontratopncp: string
  numinstrumentocontratual: string
  anoinstrumentocontratual: string
  situacao: string
  medicaonum: string
  medicaoval: string
  medicaoperc: string
  medicaodata: string
  medicaovalac: string
  medicaopercac: string
  processo: string
  anoproc: string
  relfot: string
  planobra: string
}

export interface ExoneracaoFiscal {
  _id: string
  cnpj: string
  idcontratopncp: string
  identificadoragente: string
  cpfagente: string
  cnpjagente: string
  dataexoneracao: string
  exoneracao: string
  descricaoexoneracao: string
  numeroexoneracao: string
  anoexoneracao: string
  datapubliexoneracao: string
  localexoneracao: string
  urlexoneracao: string
}

export interface SituacaoContrato {
  _id: string
  cnpj: string
  idcontratopncp: string
  codigosituacaoinstrumentocontratacao: string
  justificativasituacao: string
}

export interface RespTecnico {
  _id: string
  cnpj: string
  idcontratopncp: string
  numinstrumentocontratual: string
  anoinstrumentocontratual: string
  processo: string
  anoproc: string
  arttipo: string
  artnum: string
  artdata: string
  artcpf: string
  artregistro: string
  artconselho: string
}

export interface FileEntry {
  name: string
  file: File
}

export interface PersistedFileEntry {
  name: string
  base64: string
  type: string
}
