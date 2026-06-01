<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDB } from '../stores/useDB'
import { useToast } from '../stores/useToast'
import { maskCNPJ, maskCPF } from '../composables/useMasks'
import { uid } from '../utils/format'
import { tipoContrato } from '../utils/constants'
import UploadBox from '../components/shared/UploadBox.vue'

const db = useDB()
const toast = useToast()

// --- RolContratos refs ---
const rcCnpj = ref('')
const rcIdContratoPNCP = ref('')
const rcIdContratacaoPNCP = ref('')
const rcTipo = ref('')
const rcNumInstrumentoContratual = ref('')
const rcAnoInstrumentoContratual = ref('')
const rcProcesso = ref('')
const rcAnoProc = ref('')
const rcCategoria = ref('')
const rcTpPessoa = ref('')
const rcContratado = ref('')
const rcObjeto = ref('')
const rcValIni = ref('')
const rcRecDes = ref('')
const rcSubContrato = ref('')
const rcVigenciaIndeterminada = ref('')
const rcDataVigInicio = ref('')
const rcDataVigFim = ref('')
const rcDataAssinatura = ref('')
const rcDataPub = ref('')
const rcLocalPub = ref('')
const rcUrlPublicacao = ref('')
const rcGarantia = ref('')
const rcValorGarantia = ref('')
const rcModalidadeGarantia = ref('')

// --- FiscalGestor refs ---
const fgCnpj = ref('')
const fgTipoAgente = ref('')
const fgIdentificadorAgente = ref('')
const fgNomeAgente = ref('')
const fgCpfAgente = ref('')
const fgCnpjAgente = ref('')
const fgNaturezaCargo = ref('')
const fgDescricaoNatureza = ref('')
const fgClassificacaoFiscal = ref('')
const fgDescricaoFiscal = ref('')
const fgClassificacaoGestor = ref('')
const fgDescricaoGestor = ref('')
const fgDesignacao = ref('')
const fgDescricaoDesignacao = ref('')
const fgNumeroDesignacao = ref('')
const fgAnoDesignacao = ref('')
const fgDataDesignacao = ref('')
const fgLocalDesignacao = ref('')
const fgUrlDesignacao = ref('')

// --- Conditional visibility ---
const showVigFim = computed(() => rcVigenciaIndeterminada.value === 'N')
const showGarantia = computed(() => rcGarantia.value === 'S')
const showCpfAgente = computed(() => fgIdentificadorAgente.value === '1')
const showCnpjAgente = computed(() => fgIdentificadorAgente.value === '2')
const showClassificacaoFiscal = computed(() => fgTipoAgente.value === '1')
const showClassificacaoGestor = computed(() => fgTipoAgente.value === '2')
const showDescricaoNatureza = computed(() => fgNaturezaCargo.value === '7')

// --- Contratado dynamic mask ---
const isContratadoFisica = computed(() => rcTpPessoa.value === 'F')
const isContratadoJuridica = computed(() => rcTpPessoa.value === 'J')
const isContratadoEstrangeiro = computed(() => rcTpPessoa.value === 'E')
const contratadoPlaceholder = computed(() =>
  isContratadoFisica.value ? '000.000.000-00' :
  isContratadoJuridica.value ? '00.000.000/0000-00' :
  'Nº do documento'
)
const contratadoMaxlen = computed(() =>
  isContratadoFisica.value ? 14 :
  isContratadoJuridica.value ? 18 : 20
)
const contratadoLabel = computed(() =>
  isContratadoFisica.value ? 'CPF do Contratado' :
  isContratadoJuridica.value ? 'CNPJ do Contratado' :
  isContratadoEstrangeiro.value ? 'Documento do Contratado' :
  'CNPJ/CPF do Contratado'
)


const rcUploadRef = ref<InstanceType<typeof UploadBox> | null>(null)

// --- Validation helpers ---
interface InvalidMap {
  rc: Set<string>
  fg: Set<string>
}

const invalids = ref<InvalidMap>({ rc: new Set(), fg: new Set() })

function setInv(prefix: string, field: string, invalid: boolean) {
  const key = prefix as 'rc' | 'fg'
  if (invalid) {
    invalids.value[key].add(field)
  } else {
    invalids.value[key].delete(field)
  }
}

function isInv(prefix: string, field: string): boolean {
  const key = prefix as 'rc' | 'fg'
  return invalids.value[key].has(field)
}

function valid(prefix: string, fields: string[]): boolean {
  let ok = true
  for (const f of fields) {
    const val = getRef(prefix, f)
    if (!val || !val.value.trim()) {
      setInv(prefix, f, true)
      ok = false
    } else {
      setInv(prefix, f, false)
    }
  }
  return ok
}

function getRef(prefix: string, field: string) {
  const map: Record<string, any> = {
    'rc-cnpj': rcCnpj, 'rc-idcontratopncp': rcIdContratoPNCP, 'rc-idcontratacaopncp': rcIdContratacaoPNCP,
    'rc-tipo': rcTipo, 'rc-numinstrumentocontratual': rcNumInstrumentoContratual, 'rc-anoinstrumentocontratual': rcAnoInstrumentoContratual,
    'rc-processo': rcProcesso, 'rc-anoproc': rcAnoProc, 'rc-categoria': rcCategoria,
    'rc-tppessoa': rcTpPessoa, 'rc-contratado': rcContratado,
    'rc-objeto': rcObjeto, 'rc-valini': rcValIni, 'rc-recdes': rcRecDes, 'rc-subcontrato': rcSubContrato,
    'rc-vigenciaindeterminada': rcVigenciaIndeterminada, 'rc-dataviginicio': rcDataVigInicio,
    'rc-datavigfim': rcDataVigFim, 'rc-dataassinatura': rcDataAssinatura, 'rc-datapub': rcDataPub,
    'rc-localpub': rcLocalPub, 'rc-urlpublicacao': rcUrlPublicacao, 'rc-garantia': rcGarantia,
    'rc-valorgarantia': rcValorGarantia, 'rc-modalidadegarantia': rcModalidadeGarantia,
    'fg-cnpj': fgCnpj, 'fg-tipoagente': fgTipoAgente, 'fg-identificadoragente': fgIdentificadorAgente,
    'fg-nomeagente': fgNomeAgente, 'fg-cpfagente': fgCpfAgente, 'fg-cnpjagente': fgCnpjAgente,
    'fg-naturezacargo': fgNaturezaCargo, 'fg-descricaonatureza': fgDescricaoNatureza,
    'fg-classificacaofiscal': fgClassificacaoFiscal, 'fg-descricaofiscal': fgDescricaoFiscal,
    'fg-classificacaogestor': fgClassificacaoGestor, 'fg-descricaogestor': fgDescricaoGestor,
    'fg-designacao': fgDesignacao, 'fg-descricaodesignacao': fgDescricaoDesignacao,
    'fg-numerodesignacao': fgNumeroDesignacao, 'fg-anodesignacao': fgAnoDesignacao,
    'fg-datadesignacao': fgDataDesignacao, 'fg-localdesignacao': fgLocalDesignacao,
    'fg-urldesignacao': fgUrlDesignacao,
  }
  return map[prefix + '-' + field]
}

function onCnpjInput() {
  rcCnpj.value = maskCNPJ(rcCnpj.value)
}
function onTpPessoaChange() {
  rcContratado.value = ''
  invalids.value.rc.delete('contratado')
}
function onContratadoInput() {
  if (rcTpPessoa.value === 'F') {
    rcContratado.value = maskCPF(rcContratado.value)
  } else if (rcTpPessoa.value === 'J') {
    rcContratado.value = maskCNPJ(rcContratado.value)
  }
}
function onFgCnpjInput() {
  fgCnpj.value = maskCNPJ(fgCnpj.value)
}
function onCpfInput() {
  fgCpfAgente.value = maskCPF(fgCpfAgente.value)
}
function onFgCnpjAgenteInput() {
  fgCnpjAgente.value = maskCNPJ(fgCnpjAgente.value)
}

function onTipoAgenteChange() {
  invalids.value.fg.delete('classificacaofiscal')
  invalids.value.fg.delete('classificacaogestor')
  invalids.value.fg.delete('naturezacargo')
}

function resetAll() {
  rcCnpj.value = ''
  rcIdContratoPNCP.value = ''
  rcIdContratacaoPNCP.value = ''
  rcTipo.value = ''
  rcNumInstrumentoContratual.value = ''
  rcAnoInstrumentoContratual.value = ''
  rcProcesso.value = ''
  rcAnoProc.value = ''
  rcCategoria.value = ''
  rcTpPessoa.value = ''
  rcContratado.value = ''
  rcObjeto.value = ''
  rcValIni.value = ''
  rcRecDes.value = ''
  rcSubContrato.value = ''
  rcVigenciaIndeterminada.value = ''
  rcDataVigInicio.value = ''
  rcDataVigFim.value = ''
  rcDataAssinatura.value = ''
  rcDataPub.value = ''
  rcLocalPub.value = ''
  rcUrlPublicacao.value = ''
  rcGarantia.value = ''
  rcValorGarantia.value = ''
  rcModalidadeGarantia.value = ''
  fgCnpj.value = ''
  fgTipoAgente.value = ''
  fgIdentificadorAgente.value = ''
  fgNomeAgente.value = ''
  fgCpfAgente.value = ''
  fgCnpjAgente.value = ''
  fgNaturezaCargo.value = ''
  fgDescricaoNatureza.value = ''
  fgClassificacaoFiscal.value = ''
  fgDescricaoFiscal.value = ''
  fgClassificacaoGestor.value = ''
  fgDescricaoGestor.value = ''
  fgDesignacao.value = ''
  fgDescricaoDesignacao.value = ''
  fgNumeroDesignacao.value = ''
  fgAnoDesignacao.value = ''
  fgDataDesignacao.value = ''
  fgLocalDesignacao.value = ''
  fgUrlDesignacao.value = ''
  invalids.value = { rc: new Set(), fg: new Set() }
  rcUploadRef.value?.reset()
}

function saveNC() {
  invalids.value = { rc: new Set(), fg: new Set() }

  // --- RolContratos validation ---
  const rcReq = ['cnpj', 'idcontratopncp', 'idcontratacaopncp', 'tipo', 'numinstrumentocontratual',
    'anoinstrumentocontratual', 'processo', 'anoproc', 'categoria', 'tppessoa', 'contratado',
    'objeto', 'valini', 'vigenciaindeterminada', 'dataviginicio', 'dataassinatura', 'datapub',
    'localpub', 'urlpublicacao', 'recdes', 'garantia', 'subcontrato']
  let rcOk = valid('rc', rcReq)

  if (rcVigenciaIndeterminada.value === 'N' && !rcDataVigFim.value.trim()) {
    setInv('rc', 'datavigfim', true)
    rcOk = false
  }
  if (rcGarantia.value === 'S') {
    if (!rcValorGarantia.value.trim()) { setInv('rc', 'valorgarantia', true); rcOk = false }
    if (!rcModalidadeGarantia.value.trim()) { setInv('rc', 'modalidadegarantia', true); rcOk = false }
  }

  // Validar contratado conforme tipo de pessoa
  const rawContratado = rcContratado.value.replace(/\D/g, '')
  if (rcTpPessoa.value === 'F' && rawContratado.length !== 11) {
    setInv('rc', 'contratado', true); rcOk = false
  } else if (rcTpPessoa.value === 'J' && rawContratado.length !== 14) {
    setInv('rc', 'contratado', true); rcOk = false
  }

  const upOk = rcUploadRef.value?.validate() ?? false
  if (!upOk) {
    rcOk = false
  }

  // --- FiscalGestor validation (explicit) ---
  let fgOk = true
  if (!fgCnpj.value.trim()) { setInv('fg', 'cnpj', true); fgOk = false }
  else { setInv('fg', 'cnpj', false) }
  if (!fgTipoAgente.value.trim()) { setInv('fg', 'tipoagente', true); fgOk = false }
  else { setInv('fg', 'tipoagente', false) }
  if (!fgIdentificadorAgente.value.trim()) { setInv('fg', 'identificadoragente', true); fgOk = false }
  else { setInv('fg', 'identificadoragente', false) }
  if (!fgNomeAgente.value.trim()) { setInv('fg', 'nomeagente', true); fgOk = false }
  else { setInv('fg', 'nomeagente', false) }
  if (!fgNaturezaCargo.value.trim()) { setInv('fg', 'naturezacargo', true); fgOk = false }
  else { setInv('fg', 'naturezacargo', false) }
  if (!fgDesignacao.value.trim()) { setInv('fg', 'designacao', true); fgOk = false }
  else { setInv('fg', 'designacao', false) }
  if (!fgNumeroDesignacao.value.trim()) { setInv('fg', 'numerodesignacao', true); fgOk = false }
  else { setInv('fg', 'numerodesignacao', false) }
  if (!fgAnoDesignacao.value.trim()) { setInv('fg', 'anodesignacao', true); fgOk = false }
  else { setInv('fg', 'anodesignacao', false) }
  if (!fgDataDesignacao.value.trim()) { setInv('fg', 'datadesignacao', true); fgOk = false }
  else { setInv('fg', 'datadesignacao', false) }
  if (!fgLocalDesignacao.value.trim()) { setInv('fg', 'localdesignacao', true); fgOk = false }
  else { setInv('fg', 'localdesignacao', false) }
  if (!fgUrlDesignacao.value.trim()) { setInv('fg', 'urldesignacao', true); fgOk = false }
  else { setInv('fg', 'urldesignacao', false) }

  if (fgIdentificadorAgente.value === '1' && !fgCpfAgente.value.trim()) {
    setInv('fg', 'cpfagente', true); fgOk = false
  }
  if (fgIdentificadorAgente.value === '2' && !fgCnpjAgente.value.trim()) {
    setInv('fg', 'cnpjagente', true); fgOk = false
  }

  if (!rcOk || !fgOk) {
    window.alert('DEBUG: fgOk=' + fgOk + ' rcOk=' + rcOk + ' | FG empty')
    toast.show('Erro: Preencha todos os campos obrigatórios em ambas as seções.', 'err')
    return
  }

  // --- Build and save RolContratos ---
  const rcVals: Record<string, string> = { _id: uid() }
  const rcAllFields = [...rcReq, 'datavigfim', 'valorgarantia', 'modalidadegarantia']
  for (const f of rcAllFields) {
    const ref = getRef('rc', f)
    rcVals[f] = ref ? ref.value.trim() : ''
  }
  db.rolContratos.push(rcVals as any)

  // --- Build and save FiscalGestor ---
  const fgVals: Record<string, string> = { _id: uid(), idcontratopncp: rcVals.idcontratopncp }
  const fgFieldNames = ['cnpj', 'tipoagente', 'identificadoragente', 'nomeagente', 'naturezacargo',
    'descricaonatureza', 'classificacaofiscal', 'descricaofiscal', 'classificacaogestor', 'descricaogestor',
    'designacao', 'descricaodesignacao', 'numerodesignacao', 'anodesignacao', 'datadesignacao',
    'localdesignacao', 'urldesignacao', 'cpfagente', 'cnpjagente']
  for (const f of fgFieldNames) {
    const ref = getRef('fg', f)
    fgVals[f] = ref ? ref.value.trim() : ''
  }
  db.fiscalGestor.push(fgVals as any)
  db.persist()
  toast.show('Cadastro completo realizado com sucesso!', 'ok')
  resetAll()
}

function confirmDel(col: string, id: string) {
  const name = col === 'rolContratos' ? 'contrato' : 'registro'
  if (!confirm(`Excluir este ${name}?`)) return
  db.delRec(col, id)
  toast.show('Registro excluído.', 'err')
}

function fmtBRL(v: string): string {
  const n = parseFloat(v)
  if (isNaN(n)) return '—'
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

const tipoLabel: Record<string, string> = {
  '1': 'Contrato', '2': 'Convênio', '5': 'Carta Contrato', '9': 'Empenho'
}
</script>

<template>
  <div class="pt">Cadastre um novo contrato</div>
  <div class="ps">Preencha as seções abaixo para registrar o contrato e designar o fiscal/gestor</div>

  <div id="combined-form">
    <!-- Card: Sessão 1 - Dados do Contrato -->
    <div class="card">
      <div class="ch"><h3>Sessão 1: Dados do Contrato</h3></div>
      <div class="cb">
        <div class="section-title">Identificação da Unidade Gestora</div>
        <div class="fg c3">
          <div class="fgi">
            <label>CNPJ da UG <span class="req">*</span><span class="maxlen">14 car.</span></label>
            <input type="text" id="rc-cnpj" v-model="rcCnpj" maxlength="18"
              placeholder="00.000.000/0000-00" @input="onCnpjInput"
              :class="{ inv: isInv('rc', 'cnpj') }">
          </div>
          <div class="fgi">
            <label>ID Contrato PNCP <span class="req">*</span></label>
            <input type="text" id="rc-idcontratopncp" v-model="rcIdContratoPNCP" maxlength="28"
              placeholder="Ex: 12345678000100-1-000001/2025"
              :class="{ inv: isInv('rc', 'idcontratopncp') }">
          </div>
          <div class="fgi">
            <label>ID Contratação PNCP <span class="req">*</span></label>
            <input type="text" id="rc-idcontratacaopncp" v-model="rcIdContratacaoPNCP" maxlength="28"
              placeholder="ID da contratação de origem"
              :class="{ inv: isInv('rc', 'idcontratacaopncp') }">
          </div>
        </div>

        <div class="section-title">Instrumento Contratual</div>
        <div class="fg c3">
          <div class="fgi">
            <label>Tipo de Instrumento <span class="req">*</span></label>
            <select id="rc-tipo" v-model="rcTipo" :class="{ inv: isInv('rc', 'tipo') }">
              <option value="">Selecione...</option>
              <option value="1">1 - Contrato</option>
              <option value="2">2 - Convênio</option>
              <option value="3">3 - Acordo de Cooperação</option>
              <option value="4">4 - Termo de Adesão</option>
              <option value="5">5 - Carta Contrato</option>
              <option value="6">6 - Comodato</option>
              <option value="7">7 - Arrendamento</option>
              <option value="8">8 - Concessão</option>
              <option value="9">9 - Empenho</option>
              <option value="10">10 - Outros</option>
            </select>
          </div>
          <div class="fgi">
            <label>Nº do Instrumento <span class="req">*</span></label>
            <input type="text" id="rc-numinstrumentocontratual" v-model="rcNumInstrumentoContratual" maxlength="20"
              placeholder="Ex: 001" :class="{ inv: isInv('rc', 'numinstrumentocontratual') }">
          </div>
          <div class="fgi">
            <label>Ano do Instrumento <span class="req">*</span></label>
            <input type="number" id="rc-anoinstrumentocontratual" v-model="rcAnoInstrumentoContratual"
              min="2000" max="2099" placeholder="aaaa"
              :class="{ inv: isInv('rc', 'anoinstrumentocontratual') }">
          </div>
          <div class="fgi">
            <label>Nº do Processo <span class="req">*</span></label>
            <input type="text" id="rc-processo" v-model="rcProcesso" maxlength="50"
              placeholder="Número do processo" :class="{ inv: isInv('rc', 'processo') }">
          </div>
          <div class="fgi">
            <label>Ano do Processo <span class="req">*</span></label>
            <input type="number" id="rc-anoproc" v-model="rcAnoProc" min="2000" max="2099" placeholder="aaaa"
              :class="{ inv: isInv('rc', 'anoproc') }">
          </div>
          <div class="fgi">
            <label>Categoria <span class="req">*</span></label>
            <select id="rc-categoria" v-model="rcCategoria" :class="{ inv: isInv('rc', 'categoria') }">
              <option value="">Selecione...</option>
              <option value="1">1 - Cessão</option>
              <option value="2">2 - Compras</option>
              <option value="3">3 - Informática</option>
              <option value="4">4 - Internacional</option>
              <option value="5">5 - Locação Imóveis</option>
              <option value="6">6 - Mão de Obra</option>
              <option value="7">7 - Obras</option>
              <option value="8">8 - Serviços</option>
              <option value="9">9 - Serviços de Engenharia</option>
              <option value="10">10 - Serviços de Saúde</option>
              <option value="11">11 - Alienação</option>
            </select>
          </div>
        </div>

        <div class="section-title">Contratado</div>
        <div class="fg c3">
          <div class="fgi">
            <label>Tipo de Pessoa <span class="req">*</span></label>
            <select id="rc-tppessoa" v-model="rcTpPessoa" @change="onTpPessoaChange"
              :class="{ inv: isInv('rc', 'tppessoa') }">
              <option value="">Selecione...</option>
              <option value="F">F - Física</option>
              <option value="J">J - Jurídica</option>
              <option value="E">E - Estrangeira</option>
            </select>
          </div>
          <div class="fgi s2">
            <label>{{ contratadoLabel }} <span class="req">*</span></label>
            <input type="text" id="rc-contratado" v-model="rcContratado"
              :maxlength="contratadoMaxlen" :placeholder="contratadoPlaceholder"
              @input="onContratadoInput"
              :class="{ inv: isInv('rc', 'contratado') }">
          </div>
        </div>

        <div class="section-title">Objeto e Valores</div>
        <div class="fg c1">
          <div class="fgi">
            <label>Objeto da Contratação <span class="req">*</span></label>
            <textarea id="rc-objeto" v-model="rcObjeto" maxlength="5120" rows="3"
              placeholder="Descreva o objeto" :class="{ inv: isInv('rc', 'objeto') }"></textarea>
          </div>
        </div>
        <div class="fg c3">
          <div class="fgi">
            <label>Valor Contratado (R$) <span class="req">*</span></label>
            <input type="number" id="rc-valini" v-model="rcValIni" min="0" step="0.01" placeholder="0,00"
              :class="{ inv: isInv('rc', 'valini') }">
          </div>
          <div class="fgi">
            <label>Receita ou Despesa <span class="req">*</span></label>
            <select id="rc-recdes" v-model="rcRecDes" :class="{ inv: isInv('rc', 'recdes') }">
              <option value="">Selecione...</option>
              <option value="D">D - Despesa</option>
              <option value="R">R - Receita</option>
            </select>
          </div>
          <div class="fgi">
            <label>Subcontratação <span class="req">*</span></label>
            <select id="rc-subcontrato" v-model="rcSubContrato" :class="{ inv: isInv('rc', 'subcontrato') }">
              <option value="">Selecione...</option>
              <option value="S">S - Sim</option>
              <option value="N">N - Não</option>
            </select>
          </div>
        </div>

        <div class="section-title">Vigência</div>
        <div class="fg c3">
          <div class="fgi">
            <label>Vigência Indeterminada <span class="req">*</span></label>
            <select id="rc-vigenciaindeterminada" v-model="rcVigenciaIndeterminada"
              :class="{ inv: isInv('rc', 'vigenciaindeterminada') }">
              <option value="">Selecione...</option>
              <option value="S">S - Sim</option>
              <option value="N">N - Não</option>
            </select>
          </div>
          <div class="fgi">
            <label>Início Vigência <span class="req">*</span></label>
            <input type="date" id="rc-dataviginicio" v-model="rcDataVigInicio"
              :class="{ inv: isInv('rc', 'dataviginicio') }">
          </div>
          <div class="fgi" v-show="showVigFim" :class="{ inv: isInv('rc', 'datavigfim') }">
            <label>Fim Vigência <span class="req">*</span></label>
            <input type="date" id="rc-datavigfim" v-model="rcDataVigFim"
              :class="{ inv: isInv('rc', 'datavigfim') }">
          </div>
          <div class="fgi">
            <label>Data Assinatura <span class="req">*</span></label>
            <input type="date" id="rc-dataassinatura" v-model="rcDataAssinatura"
              :class="{ inv: isInv('rc', 'dataassinatura') }">
          </div>
          <div class="fgi">
            <label>Data Publicação <span class="req">*</span></label>
            <input type="date" id="rc-datapub" v-model="rcDataPub"
              :class="{ inv: isInv('rc', 'datapub') }">
          </div>
        </div>

        <div class="section-title">Publicação e Garantia</div>
        <div class="fg c3">
          <div class="fgi">
            <label>Local Publicação <span class="req">*</span></label>
            <select id="rc-localpub" v-model="rcLocalPub" :class="{ inv: isInv('rc', 'localpub') }">
              <option value="">Selecione...</option>
              <option value="1">1 - Diário Oficial</option>
              <option value="6">6 - PNCP</option>
              <option value="3">3 - Sítio oficial</option>
            </select>
          </div>
          <div class="fgi s2">
            <label>URL de Publicação <span class="req">*</span></label>
            <input type="url" id="rc-urlpublicacao" v-model="rcUrlPublicacao" placeholder="https://"
              :class="{ inv: isInv('rc', 'urlpublicacao') }">
          </div>
          <div class="fgi">
            <label>Possui Garantia <span class="req">*</span></label>
            <select id="rc-garantia" v-model="rcGarantia" :class="{ inv: isInv('rc', 'garantia') }">
              <option value="">Selecione...</option>
              <option value="S">S - Sim</option>
              <option value="N">N - Não</option>
            </select>
          </div>
          <div class="fgi" v-show="showGarantia" :class="{ inv: isInv('rc', 'valorgarantia') }">
            <label>Valor Garantia (R$) <span class="req">*</span></label>
            <input type="number" id="rc-valorgarantia" v-model="rcValorGarantia" step="0.01" placeholder="0,00"
              :class="{ inv: isInv('rc', 'valorgarantia') }">
          </div>
          <div class="fgi" v-show="showGarantia" :class="{ inv: isInv('rc', 'modalidadegarantia') }">
            <label>Modalidade <span class="req">*</span></label>
            <select id="rc-modalidadegarantia" v-model="rcModalidadeGarantia"
              :class="{ inv: isInv('rc', 'modalidadegarantia') }">
              <option value="">Selecione...</option>
              <option value="3">3 - Seguro-garantia</option>
              <option value="4">4 - Fiança-bancária</option>
            </select>
          </div>
        </div>

        <div class="section-title">Arquivo do Instrumento Contratual</div>
        <div class="fg c1">
          <UploadBox ref="rcUploadRef" prefix="rc" label="Nome do arquivo PDF" hint="máx. 20 car." />
        </div>
      </div>
    </div>

    <!-- Card: Sessão 2 - Designar Agente -->
    <div class="card">
      <div class="ch"><h3>Sessão 2: Designar Agente</h3></div>
      <div class="cb">
        <div class="section-title">Identificação do Agente</div>
        <div class="fg c3">
          <div class="fgi">
            <label>CNPJ da UG <span class="req">*</span></label>
            <input type="text" id="fg-cnpj" v-model="fgCnpj" maxlength="18"
              placeholder="00.000.000/0000-00" @input="onFgCnpjInput"
              :class="{ inv: isInv('fg', 'cnpj') }">
          </div>
          <div class="fgi">
            <label>Tipo de Agente <span class="req">*</span></label>
            <select id="fg-tipoagente" v-model="fgTipoAgente" @change="onTipoAgenteChange"
              :class="{ inv: isInv('fg', 'tipoagente') }">
              <option value="">Selecione...</option>
              <option value="1">1 - Fiscal de contrato</option>
              <option value="2">2 - Gestor de contrato</option>
              <option value="3">3 - Terceiro contratado</option>
            </select>
          </div>
          <div class="fgi">
            <label>Forma Identificação <span class="req">*</span></label>
            <select id="fg-identificadoragente" v-model="fgIdentificadorAgente"
              :class="{ inv: isInv('fg', 'identificadoragente') }">
              <option value="">Selecione...</option>
              <option value="1">1 - CPF</option>
              <option value="2">2 - CNPJ</option>
            </select>
          </div>
        </div>

        <div class="fg c3">
          <div class="fgi">
            <label>Nome do Agente <span class="req">*</span></label>
            <input type="text" id="fg-nomeagente" v-model="fgNomeAgente" maxlength="200"
              placeholder="Nome completo" :class="{ inv: isInv('fg', 'nomeagente') }">
          </div>
          <div class="fgi" v-show="showCpfAgente">
            <label>CPF Agente <span class="req">*</span></label>
            <input type="text" id="fg-cpfagente" v-model="fgCpfAgente" maxlength="14"
              placeholder="000.000.000-00" @input="onCpfInput"
              :class="{ inv: isInv('fg', 'cpfagente') }">
          </div>
          <div class="fgi" v-show="showCnpjAgente">
            <label>CNPJ Agente <span class="req">*</span></label>
            <input type="text" id="fg-cnpjagente" v-model="fgCnpjAgente" maxlength="18"
              placeholder="00.000.000/0000-00" @input="onFgCnpjAgenteInput"
              :class="{ inv: isInv('fg', 'cnpjagente') }">
          </div>
          <div class="fgi">
            <label>Natureza do Cargo <span class="req">*</span></label>
            <select id="fg-naturezacargo" v-model="fgNaturezaCargo"
              :class="{ inv: isInv('fg', 'naturezacargo') }">
              <option value="">Selecione...</option>
              <option value="1">1 - Efetivo civil</option>
              <option value="5">5 - Comissionado</option>
              <option value="6">6 - Terceiro</option>
              <option value="7">7 - Outro</option>
            </select>
          </div>
        </div>

        <div class="fg c3">
          <div class="fgi" v-show="showDescricaoNatureza">
            <label>Descrição Natureza <span class="req">*</span></label>
            <input type="text" id="fg-descricaonatureza" v-model="fgDescricaoNatureza" maxlength="100"
              placeholder="Descreva a natureza" :class="{ inv: isInv('fg', 'descricaonatureza') }">
          </div>
          <div class="fgi" v-show="showClassificacaoFiscal">
            <label>Classificação Fiscal <span class="req">*</span></label>
            <select id="fg-classificacaofiscal" v-model="fgClassificacaoFiscal"
              :class="{ inv: isInv('fg', 'classificacaofiscal') }">
              <option value="">Selecione...</option>
              <option value="1">1 - Fiscal titular</option>
              <option value="2">2 - Fiscal suplente</option>
            </select>
          </div>
          <div class="fgi" v-show="showClassificacaoGestor">
            <label>Classificação Gestor <span class="req">*</span></label>
            <select id="fg-classificacaogestor" v-model="fgClassificacaoGestor"
              :class="{ inv: isInv('fg', 'classificacaogestor') }">
              <option value="">Selecione...</option>
              <option value="1">1 - Gestor titular</option>
              <option value="2">2 - Gestor suplente</option>
            </select>
          </div>
        </div>

        <div class="section-title">Ato de Designação</div>
        <div class="fg c3">
          <div class="fgi">
            <label>Tipo Designação <span class="req">*</span></label>
            <select id="fg-designacao" v-model="fgDesignacao"
              :class="{ inv: isInv('fg', 'designacao') }">
              <option value="">Selecione...</option>
              <option value="2">2 - Portaria</option>
              <option value="1">1 - Decreto</option>
              <option value="5">5 - Contrato</option>
            </select>
          </div>
          <div class="fgi">
            <label>Nº do Ato <span class="req">*</span></label>
            <input type="text" id="fg-numerodesignacao" v-model="fgNumeroDesignacao" maxlength="16"
              placeholder="Número" :class="{ inv: isInv('fg', 'numerodesignacao') }">
          </div>
          <div class="fgi">
            <label>Ano Designação <span class="req">*</span></label>
            <input type="number" id="fg-anodesignacao" v-model="fgAnoDesignacao" min="2000" max="2099"
              placeholder="aaaa" :class="{ inv: isInv('fg', 'anodesignacao') }">
          </div>
          <div class="fgi">
            <label>Data Publicação Ato <span class="req">*</span></label>
            <input type="date" id="fg-datadesignacao" v-model="fgDataDesignacao"
              :class="{ inv: isInv('fg', 'datadesignacao') }">
          </div>
          <div class="fgi">
            <label>Local Publicação <span class="req">*</span></label>
            <select id="fg-localdesignacao" v-model="fgLocalDesignacao"
              :class="{ inv: isInv('fg', 'localdesignacao') }">
              <option value="">Selecione...</option>
              <option value="1">1 - Diário Oficial</option>
              <option value="6">6 - PNCP</option>
            </select>
          </div>
          <div class="fgi s3">
            <label>URL de Publicação do Ato <span class="req">*</span></label>
            <input type="url" id="fg-urldesignacao" v-model="fgUrlDesignacao" placeholder="https://"
              :class="{ inv: isInv('fg', 'urldesignacao') }">
          </div>
        </div>
      </div>
    </div>

    <!-- Card: Save Buttons -->
    <div class="card">
      <div class="cb">
        <div class="acts" style="justify-content: center; padding: 1rem 0;">
          <button class="btn btn-p" style="padding: 10px 28px; font-size: 13px;" @click="saveNC">💾 Salvar Cadastro Completo</button>
          <button class="btn btn-s" style="padding: 10px 28px; font-size: 13px;" @click="resetAll">🔄 Limpar Tudo</button>
        </div>
        <p style="text-align: center; font-size: 11px; color: var(--muted); margin-top: 8px;">
          <span class="req">*</span> Campos obrigatórios em ambas as seções
        </p>
      </div>
    </div>
  </div>

  <!-- Card: Contratos Cadastrados table -->
  <div class="card">
    <div class="ch">
      <h3>Contratos Cadastrados</h3>
      <span class="tag">{{ db.rolContratos.length }} registros</span>
    </div>
    <div class="cb">
      <div class="tw" v-if="db.rolContratos.length">
        <table>
          <thead>
            <tr>
              <th>Nº Instrumento</th>
              <th>Ano</th>
              <th>Tipo</th>
              <th>Contratado</th>
              <th>Valor</th>
              <th>Vig. Início</th>
              <th>Vig. Fim</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in db.rolContratos" :key="r._id">
              <td><strong>{{ r.numinstrumentocontratual || '-' }}</strong></td>
              <td>{{ r.anoinstrumentocontratual || '-' }}</td>
              <td>{{ tipoLabel[r.tipo] || (tipoContrato[r.tipo] || 'Tipo ' + r.tipo) }}</td>
              <td>{{ r.contratado || '-' }}</td>
              <td>{{ fmtBRL(r.valini) }}</td>
              <td>{{ r.dataviginicio || '-' }}</td>
              <td>{{ r.vigenciaindeterminada === 'S' ? 'Indeterminada' : (r.datavigfim || '-') }}</td>
              <td><button class="btn btn-d btn-sm" @click="confirmDel('rolContratos', r._id)">Excluir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="empty" v-else>
        <div class="empty-icon">📄</div>
        <h4>Nenhum contrato cadastrado</h4>
        <p>Preencha o formulário acima</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pt {
  font-size: 18px;
  font-weight: 700;
  color: var(--text, #1a1f2e);
  margin-bottom: 2px;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.ps {
  font-size: 12px;
  color: var(--muted, #5a6478);
  margin-bottom: 1.25rem;
}
.card {
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #cdd6e8);
  border-radius: 8px;
  margin-bottom: 1.25rem;
  overflow: hidden;
}
.ch {
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--border, #cdd6e8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #002a68;
}
.ch h3 {
  font-size: 13px;
  font-weight: 600;
  color: #eef2f8;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
  margin: 0;
}
.ch .tag {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: #f3f4f6;
  color: var(--muted, #5a6478);
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.cb {
  padding: 1rem 1.25rem;
}
.fg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}
.fg.c3 {
  grid-template-columns: 1fr 1fr 1fr;
}
.fg.c1 {
  grid-template-columns: 1fr;
}
.fgi {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.fgi.s2 {
  grid-column: span 2;
}
.fgi.s3 {
  grid-column: span 3;
}
label {
  font-size: 11px;
  font-weight: 600;
  color: var(--label, #374151);
  display: flex;
  align-items: center;
  gap: 3px;
}
label .req {
  color: var(--danger, #c62828);
  font-size: 13px;
  line-height: 1;
}
label .maxlen {
  font-weight: 400;
  color: var(--muted, #5a6478);
  font-size: 10px;
  margin-left: auto;
}
input[type="text"],
input[type="date"],
input[type="number"],
input[type="url"],
select,
textarea {
  width: 100%;
  padding: 7px 9px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12.5px;
  color: var(--text, #1a1f2e);
  background: var(--input-bg, #ffffff);
  font-family: var(--font, 'Open Sans', system-ui, sans-serif);
  transition: border 0.12s, box-shadow 0.12s;
  outline: none;
}
input:focus,
select:focus,
textarea:focus {
  border-color: var(--primary, #0a4a8f);
  box-shadow: 0 0 0 3px rgba(10, 74, 143, 0.08);
}
input.inv,
select.inv,
textarea.inv {
  border-color: var(--danger, #c62828) !important;
  box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.1);
}
textarea {
  resize: vertical;
  min-height: 65px;
}
select {
  cursor: pointer;
}
.section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted, #5a6478);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 1rem 0 0.5rem;
  padding-bottom: 4px;
  border-bottom: 1px solid #e5e7eb;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.acts {
  display: flex;
  gap: 8px;
  margin-top: 1rem;
}
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}
.btn-p {
  background: var(--primary, #0a4a8f);
  color: #fff;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.btn-p:hover {
  background: var(--primary-light, #1565c0);
}
.btn-s {
  background: #fff;
  color: var(--text, #1a1f2e);
  border: 1px solid var(--border, #cdd6e8);
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
.btn-s:hover {
  border-color: var(--primary, #0a4a8f);
  color: var(--primary, #0a4a8f);
}
.btn-d {
  background: #fef2f2;
  color: var(--danger, #c62828);
}
.btn-sm {
  padding: 5px 10px;
  font-size: 11px;
}
.tw {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
th {
  padding: 7px 10px;
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  color: var(--muted, #5a6478);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border, #cdd6e8);
  background: #fafafa;
  white-space: nowrap;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
}
td {
  padding: 8px 10px;
  border-bottom: 1px solid #f5f5f5;
  color: var(--text, #1a1f2e);
}
tr:last-child td {
  border-bottom: none;
}
tr:hover td {
  background: #fafafa;
}
.empty {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--muted, #5a6478);
}
.empty-icon {
  font-size: 36px;
  margin-bottom: 0.6rem;
}
.empty h4 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 3px;
  font-family: var(--font-head, 'Montserrat', system-ui, sans-serif);
  color: var(--text, #1a1f2e);
}
.empty p {
  font-size: 12px;
  color: var(--muted, #5a6478);
}
</style>
