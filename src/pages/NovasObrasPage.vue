<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDB } from '../stores/useDB'
import { useToast } from '../stores/useToast'
import { maskCNPJ, maskCPF, maskCEP } from '../composables/useMasks'
import { uid } from '../utils/format'
import { tipoObra, tipoServ } from '../utils/constants'
import UploadBox from '../components/shared/UploadBox.vue'

const db = useDB()
const toast = useToast()

// --- RolObras refs ---
const roCnpj = ref('')
const roIdContratoPNCP = ref('')
const roIdContratacaoPNCP = ref('')
const roTipoInstrumentoContratacao = ref('')
const roNumInstrumentoContratual = ref('')
const roAnoInstrumentoContratual = ref('')
const roProcesso = ref('')
const roAnoProc = ref('')
const roBem = ref('')
const roDesc = ref('')
const roTipo = ref('')
const roTipoServ = ref('')
const roSetor = ref('')
const roUnidMedida = ref('')
const roTamanho = ref('')
const roQtdEnd = ref('')
const roEndereco = ref('')
const roBairro = ref('')
const roMunicipio = ref('')
const roCep = ref('')
const roLat = ref('')
const roLong = ref('')
const roMunIbge = ref('')
const roCei = ref('')
const roLinkPub = ref('')

// --- RespTecnico refs ---
const rtCnpj = ref('')
const rtIdContratoPNCP = ref('')
const rtNumInstrumentoContratual = ref('')
const rtAnoInstrumentoContratual = ref('')
const rtProcesso = ref('')
const rtAnoProc = ref('')
const rtArtTipo = ref('')
const rtArtNum = ref('')
const rtArtData = ref('')
const rtArtCpf = ref('')
const rtArtRegistro = ref('')
const rtArtConselho = ref('')

// --- UploadBox refs ---
const roPlanLicRef = ref<InstanceType<typeof UploadBox> | null>(null)
const roPlanVenRef = ref<InstanceType<typeof UploadBox> | null>(null)
const roProjContratanteRef = ref<InstanceType<typeof UploadBox> | null>(null)
const roProjContratadaRef = ref<InstanceType<typeof UploadBox> | null>(null)

// --- Conditional visibility ---
const showCondFields = computed(() => roQtdEnd.value === '1')

// --- Validation ---
interface InvalidMap {
  ro: Set<string>
  rt: Set<string>
}

const invalids = ref<InvalidMap>({ ro: new Set(), rt: new Set() })

function setInv(prefix: string, field: string, invalid: boolean) {
  const key = prefix as 'ro' | 'rt'
  if (invalid) invalids.value[key].add(field)
  else invalids.value[key].delete(field)
}

function isInv(prefix: string, field: string): boolean {
  const key = prefix as 'ro' | 'rt'
  return invalids.value[key].has(field)
}

function trimVal(v: any): string {
  return String(v ?? '').trim()
}

function valid(prefix: string, fields: string[]): boolean {
  let ok = true
  for (const f of fields) {
    const r = getRef(prefix, f)
    if (!r || !trimVal(r.value)) {
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
    'ro-cnpj': roCnpj, 'ro-idcontratopncp': roIdContratoPNCP,
    'ro-idcontratacaopncp': roIdContratacaoPNCP, 'ro-tipoinstrumentocontratacao': roTipoInstrumentoContratacao,
    'ro-numinstrumentocontratual': roNumInstrumentoContratual, 'ro-anoinstrumentocontratual': roAnoInstrumentoContratual,
    'ro-processo': roProcesso, 'ro-anoproc': roAnoProc,
    'ro-bem': roBem, 'ro-desc': roDesc, 'ro-tipo': roTipo, 'ro-tiposerv': roTipoServ,
    'ro-setor': roSetor, 'ro-unidmedida': roUnidMedida, 'ro-tamanho': roTamanho,
    'ro-qtdend': roQtdEnd, 'ro-endereco': roEndereco, 'ro-bairro': roBairro,
    'ro-municipio': roMunicipio, 'ro-cep': roCep, 'ro-lat': roLat, 'ro-long': roLong,
    'ro-munibge': roMunIbge, 'ro-cei': roCei, 'ro-linkpub': roLinkPub,
    'rt-cnpj': rtCnpj, 'rt-idcontratopncp': rtIdContratoPNCP,
    'rt-numinstrumentocontratual': rtNumInstrumentoContratual,
    'rt-anoinstrumentocontratual': rtAnoInstrumentoContratual,
    'rt-processo': rtProcesso, 'rt-anoproc': rtAnoProc,
    'rt-arttipo': rtArtTipo, 'rt-artnum': rtArtNum, 'rt-artdata': rtArtData,
    'rt-artcpf': rtArtCpf, 'rt-artregistro': rtArtRegistro, 'rt-artconselho': rtArtConselho,
  }
  return map[prefix + '-' + field]
}

function onRoCnpjInput() { roCnpj.value = maskCNPJ(roCnpj.value) }
function onRoCepInput() { roCep.value = maskCEP(roCep.value) }
function onRtCnpjInput() { rtCnpj.value = maskCNPJ(rtCnpj.value) }
function onRtCpfInput() { rtArtCpf.value = maskCPF(rtArtCpf.value) }

function resetAll() {
  roCnpj.value = ''; roIdContratoPNCP.value = ''; roIdContratacaoPNCP.value = ''
  roTipoInstrumentoContratacao.value = ''; roNumInstrumentoContratual.value = ''
  roAnoInstrumentoContratual.value = ''; roProcesso.value = ''; roAnoProc.value = ''
  roBem.value = ''; roDesc.value = ''; roTipo.value = ''; roTipoServ.value = ''
  roSetor.value = ''; roUnidMedida.value = ''; roTamanho.value = ''
  roQtdEnd.value = ''; roEndereco.value = ''; roBairro.value = ''
  roMunicipio.value = ''; roCep.value = ''; roLat.value = ''; roLong.value = ''
  roMunIbge.value = ''; roCei.value = ''; roLinkPub.value = ''
  rtCnpj.value = ''; rtIdContratoPNCP.value = ''; rtNumInstrumentoContratual.value = ''
  rtAnoInstrumentoContratual.value = ''; rtProcesso.value = ''; rtAnoProc.value = ''
  rtArtTipo.value = ''; rtArtNum.value = ''; rtArtData.value = ''
  rtArtCpf.value = ''; rtArtRegistro.value = ''; rtArtConselho.value = ''
  invalids.value = { ro: new Set(), rt: new Set() }
  roPlanLicRef.value?.reset(); roPlanVenRef.value?.reset()
  roProjContratanteRef.value?.reset(); roProjContratadaRef.value?.reset()
}

function saveNO() {
  invalids.value = { ro: new Set(), rt: new Set() }

  const roReq = ['cnpj', 'idcontratopncp', 'idcontratacaopncp', 'tipoinstrumentocontratacao',
    'numinstrumentocontratual', 'anoinstrumentocontratual', 'bem', 'desc', 'tipo',
    'unidmedida', 'tamanho', 'setor', 'tiposerv', 'qtdend', 'lat', 'long',
    'munibge', 'cei', 'processo', 'anoproc']
  let roOk = valid('ro', roReq)

  let roCondOk = true
  if (roQtdEnd.value === '1') {
    ;['endereco', 'bairro', 'municipio', 'cep'].forEach(f => {
      const r = getRef('ro', f)
      if (!r || !trimVal(r.value)) {
        setInv('ro', f, true)
        roCondOk = false
      }
    })
  }

  const upOk =
    (roPlanLicRef.value?.validate() ?? false) &&
    (roPlanVenRef.value?.validate() ?? false) &&
    (roProjContratanteRef.value?.validate() ?? false) &&
    (roProjContratadaRef.value?.validate() ?? false)

  const rtReq = ['cnpj', 'idcontratopncp', 'numinstrumentocontratual',
    'anoinstrumentocontratual', 'processo', 'anoproc', 'arttipo', 'artnum',
    'artdata', 'artcpf', 'artregistro', 'artconselho']
  const rtOk = valid('rt', rtReq)

  if (!roOk || !roCondOk || !upOk || !rtOk) {
    toast.show('Erro: Preencha todos os campos obrigatórios em ambas as seções.', 'err')
    return
  }

  const roVals: Record<string, string> = { _id: uid() }
  const roAllFields = [...roReq, 'endereco', 'bairro', 'municipio', 'cep', 'linkpub']
  for (const f of roAllFields) {
    const r = getRef('ro', f)
    roVals[f] = r ? trimVal(r.value) : ''
  }
  db.rolObras.push(roVals as any)

  const rtVals: Record<string, string> = { _id: uid() }
  for (const f of rtReq) {
    const r = getRef('rt', f)
    rtVals[f] = r ? trimVal(r.value) : ''
  }
  db.respTecnico.push(rtVals as any)

  db.persist()
  toast.show('Cadastro completo realizado com sucesso!', 'ok')
  resetAll()
}

function confirmDel(col: string, id: string) {
  const name = col === 'rolObras' ? 'obra' : 'registro'
  if (!confirm(`Excluir esta ${name}?`)) return
  db.delRec(col, id)
  toast.show('Registro excluído.', 'err')
}
</script>

<template>
  <div class="pt">Cadastre uma nova obra</div>
  <div class="ps">Preencha as seções abaixo para registrar a obra e o responsável técnico</div>

  <div id="combined-form">
    <!-- Card: Sessão 1 - Dados da Obra -->
    <div class="card">
      <div class="ch"><h3>Sessão 1: Dados da Obra</h3></div>
      <div class="cb">
        <div class="section-title">Identificação</div>
        <div class="fg c3">
          <div class="fgi">
            <label>CNPJ da UG <span class="req">*</span><span class="maxlen">14 car.</span></label>
            <input type="text" id="ro-cnpj" v-model="roCnpj" maxlength="18"
              placeholder="00.000.000/0000-00" @input="onRoCnpjInput"
              :class="{ inv: isInv('ro', 'cnpj') }">
          </div>
          <div class="fgi">
            <label>ID Contrato PNCP <span class="req">*</span><span class="maxlen">28 car.</span></label>
            <input type="text" id="ro-idcontratopncp" v-model="roIdContratoPNCP" maxlength="28"
              placeholder="ID do contrato no PNCP"
              :class="{ inv: isInv('ro', 'idcontratopncp') }">
          </div>
          <div class="fgi">
            <label>ID Contratação PNCP <span class="req">*</span><span class="maxlen">28 car.</span></label>
            <input type="text" id="ro-idcontratacaopncp" v-model="roIdContratacaoPNCP" maxlength="28"
              placeholder="ID da contratação"
              :class="{ inv: isInv('ro', 'idcontratacaopncp') }">
          </div>
          <div class="fgi">
            <label>Tipo do Instrumento <span class="req">*</span></label>
            <select id="ro-tipoinstrumentocontratacao" v-model="roTipoInstrumentoContratacao"
              :class="{ inv: isInv('ro', 'tipoinstrumentocontratacao') }">
              <option value="">Selecione...</option>
              <option value="01">01 - Contrato</option>
              <option value="02">02 - Empenho</option>
            </select>
          </div>
          <div class="fgi">
            <label>Nº do Instrumento Contratual <span class="req">*</span><span class="maxlen">20 car.</span></label>
            <input type="text" id="ro-numinstrumentocontratual" v-model="roNumInstrumentoContratual" maxlength="20"
              placeholder="Número do contrato/empenho"
              :class="{ inv: isInv('ro', 'numinstrumentocontratual') }">
          </div>
          <div class="fgi">
            <label>Ano do Instrumento <span class="req">*</span><span class="maxlen">4 dígitos</span></label>
            <input type="number" id="ro-anoinstrumentocontratual" v-model="roAnoInstrumentoContratual"
              min="2000" max="2099" placeholder="aaaa"
              :class="{ inv: isInv('ro', 'anoinstrumentocontratual') }">
          </div>
          <div class="fgi">
            <label>Nº do Processo Adm. <span class="req">*</span><span class="maxlen">50 car.</span></label>
            <input type="text" id="ro-processo" v-model="roProcesso" maxlength="50"
              placeholder="Número do processo"
              :class="{ inv: isInv('ro', 'processo') }">
          </div>
          <div class="fgi">
            <label>Ano do Processo <span class="req">*</span><span class="maxlen">4 dígitos</span></label>
            <input type="number" id="ro-anoproc" v-model="roAnoProc" min="2000" max="2099" placeholder="aaaa"
              :class="{ inv: isInv('ro', 'anoproc') }">
          </div>
        </div>

        <div class="section-title">Descrição da Obra</div>
        <div class="fg c3">
          <div class="fgi s3">
            <label>Nome do Bem Público <span class="req">*</span><span class="maxlen">255 car.</span></label>
            <input type="text" id="ro-bem" v-model="roBem" maxlength="255" placeholder="Nome da obra"
              :class="{ inv: isInv('ro', 'bem') }">
          </div>
          <div class="fgi s3">
            <label>Descrição do Objeto <span class="req">*</span><span class="maxlen">255 car.</span></label>
            <textarea id="ro-desc" v-model="roDesc" maxlength="255" rows="2"
              placeholder="Descrição detalhada da obra"
              :class="{ inv: isInv('ro', 'desc') }"></textarea>
          </div>
          <div class="fgi">
            <label>Tipo da Obra <span class="req">*</span></label>
            <select id="ro-tipo" v-model="roTipo" :class="{ inv: isInv('ro', 'tipo') }">
              <option value="">Selecione...</option>
              <option v-for="(l, k) in tipoObra" :key="k" :value="k">{{ k }} - {{ l }}</option>
            </select>
          </div>
          <div class="fgi">
            <label>Tipo do Serviço <span class="req">*</span></label>
            <select id="ro-tiposerv" v-model="roTipoServ" :class="{ inv: isInv('ro', 'tiposerv') }">
              <option value="">Selecione...</option>
              <option v-for="(l, k) in tipoServ" :key="k" :value="k">{{ k }} - {{ l }}</option>
            </select>
          </div>
          <div class="fgi">
            <label>Setor Beneficiado <span class="req">*</span></label>
            <select id="ro-setor" v-model="roSetor" :class="{ inv: isInv('ro', 'setor') }">
              <option value="">Selecione...</option>
              <option value="01">01 - Cultura</option>
              <option value="02">02 - Educação</option>
              <option value="03">03 - Esporte</option>
              <option value="04">04 - Infraestrutura</option>
              <option value="05">05 - Meio Ambiente</option>
              <option value="06">06 - Saneamento</option>
              <option value="07">07 - Saúde</option>
              <option value="08">08 - Segurança</option>
              <option value="09">09 - Turismo</option>
              <option value="10">10 - Habitação</option>
              <option value="12">12 - Administração</option>
              <option value="13">13 - Ação Social</option>
              <option value="15">15 - Assistência Social</option>
              <option value="16">16 - Outros</option>
              <option value="17">17 - Legislativo</option>
            </select>
          </div>
          <div class="fgi">
            <label>Unidade de Medida <span class="req">*</span></label>
            <select id="ro-unidmedida" v-model="roUnidMedida"
              :class="{ inv: isInv('ro', 'unidmedida') }">
              <option value="">Selecione...</option>
              <option value="1">1 - Metro(s) quadrado(s)</option>
              <option value="2">2 - Metro(s) cúbico(s)</option>
              <option value="3">3 - Quilômetro(s)</option>
              <option value="4">4 - Metro(s)</option>
              <option value="5">5 - Unidade</option>
              <option value="6">6 - Outros</option>
            </select>
          </div>
          <div class="fgi">
            <label>Tamanho <span class="req">*</span></label>
            <input type="number" id="ro-tamanho" v-model="roTamanho" min="0" step="0.01"
              placeholder="Dimensão da obra"
              :class="{ inv: isInv('ro', 'tamanho') }">
          </div>
        </div>

        <div class="section-title">Localização</div>
        <div class="fg c3">
          <div class="fgi">
            <label>Qtd. de Endereços <span class="req">*</span></label>
            <input type="number" id="ro-qtdend" v-model="roQtdEnd" min="1" max="99"
              placeholder="Ex: 1" :class="{ inv: isInv('ro', 'qtdend') }">
          </div>
          <div class="fgi cond-field" v-show="showCondFields">
            <label>Endereço <span class="req">*</span><span class="maxlen">255 car.</span></label>
            <input type="text" id="ro-endereco" v-model="roEndereco" maxlength="255" placeholder="Endereço da obra"
              :class="{ inv: isInv('ro', 'endereco') }">
          </div>
          <div class="fgi cond-field" v-show="showCondFields">
            <label>Bairro <span class="req">*</span><span class="maxlen">100 car.</span></label>
            <input type="text" id="ro-bairro" v-model="roBairro" maxlength="100" placeholder="Bairro"
              :class="{ inv: isInv('ro', 'bairro') }">
          </div>
          <div class="fgi cond-field" v-show="showCondFields">
            <label>Município <span class="req">*</span><span class="maxlen">100 car.</span></label>
            <input type="text" id="ro-municipio" v-model="roMunicipio" maxlength="100" placeholder="Município"
              :class="{ inv: isInv('ro', 'municipio') }">
          </div>
          <div class="fgi cond-field" v-show="showCondFields">
            <label>CEP <span class="req">*</span><span class="maxlen">8 dígitos</span></label>
            <input type="text" id="ro-cep" v-model="roCep" maxlength="9" placeholder="00000-000"
              @input="onRoCepInput" :class="{ inv: isInv('ro', 'cep') }">
          </div>
          <div class="fgi">
            <label>Latitude <span class="req">*</span></label>
            <input type="number" id="ro-lat" v-model="roLat" min="-90" max="90" step="0.000001"
              placeholder="Ex: -15.782310" :class="{ inv: isInv('ro', 'lat') }">
          </div>
          <div class="fgi">
            <label>Longitude <span class="req">*</span></label>
            <input type="number" id="ro-long" v-model="roLong" min="-180" max="180" step="0.000001"
              placeholder="Ex: -47.929290" :class="{ inv: isInv('ro', 'long') }">
          </div>
          <div class="fgi">
            <label>Código IBGE do Município <span class="req">*</span><span class="maxlen">7 dígitos</span></label>
            <input type="number" id="ro-munibge" v-model="roMunIbge" maxlength="7"
              placeholder="Ex: 1100023" :class="{ inv: isInv('ro', 'munibge') }">
          </div>
          <div class="fgi">
            <label>Nº CEI/CNO <span class="req">*</span><span class="hint">Se não houver, informe 0</span></label>
            <input type="text" id="ro-cei" v-model="roCei" maxlength="100" placeholder="Matrícula da obra"
              :class="{ inv: isInv('ro', 'cei') }">
          </div>
          <div class="fgi">
            <label>Link de Publicação da Obra</label>
            <input type="url" id="ro-linkpub" v-model="roLinkPub" maxlength="1024"
              placeholder="https:// (facultativo)">
          </div>
        </div>

        <div class="section-title">Arquivos</div>
        <div class="fg c3">
          <UploadBox ref="roPlanLicRef" prefix="ro-planlic" label="Planilha Licitação"
            hint="Planilha estimativa licitação" file-icon="📊" />
          <UploadBox ref="roPlanVenRef" prefix="ro-planven" label="Planilha Vencedor"
            hint="Planilha empresa vencedora" file-icon="📊" />
          <UploadBox ref="roProjContratanteRef" prefix="ro-projcontratante" label="Projetos Contratante"
            hint="Projetos da contratante" file-icon="🗂" />
          <UploadBox ref="roProjContratadaRef" prefix="ro-projcontratada" label="Projetos Contratada"
            hint="Projetos da contratada" file-icon="🗂" />
        </div>
      </div>
    </div>

    <!-- Card: Sessão 2 - Responsável Técnico -->
    <div class="card">
      <div class="ch"><h3>Sessão 2: Responsável Técnico</h3></div>
      <div class="cb">
        <div class="section-title">Identificação</div>
        <div class="fg c3">
          <div class="fgi">
            <label>CNPJ da UG <span class="req">*</span><span class="maxlen">14 car.</span></label>
            <input type="text" id="rt-cnpj" v-model="rtCnpj" maxlength="18"
              placeholder="00.000.000/0000-00" @input="onRtCnpjInput"
              :class="{ inv: isInv('rt', 'cnpj') }">
          </div>
          <div class="fgi">
            <label>ID Contrato PNCP <span class="req">*</span><span class="maxlen">28 car.</span></label>
            <input type="text" id="rt-idcontratopncp" v-model="rtIdContratoPNCP" maxlength="28"
              placeholder="ID do contrato"
              :class="{ inv: isInv('rt', 'idcontratopncp') }">
          </div>
          <div class="fgi">
            <label>Nº do Instrumento Contratual <span class="req">*</span><span class="maxlen">20 car.</span></label>
            <input type="text" id="rt-numinstrumentocontratual" v-model="rtNumInstrumentoContratual" maxlength="20"
              placeholder="Número do contrato"
              :class="{ inv: isInv('rt', 'numinstrumentocontratual') }">
          </div>
          <div class="fgi">
            <label>Ano do Instrumento <span class="req">*</span></label>
            <input type="number" id="rt-anoinstrumentocontratual" v-model="rtAnoInstrumentoContratual"
              min="2000" max="2099" placeholder="aaaa"
              :class="{ inv: isInv('rt', 'anoinstrumentocontratual') }">
          </div>
          <div class="fgi">
            <label>Nº do Processo Adm. <span class="req">*</span><span class="maxlen">16 car.</span></label>
            <input type="text" id="rt-processo" v-model="rtProcesso" maxlength="16"
              placeholder="Número do processo"
              :class="{ inv: isInv('rt', 'processo') }">
          </div>
          <div class="fgi">
            <label>Ano do Processo <span class="req">*</span></label>
            <input type="number" id="rt-anoproc" v-model="rtAnoProc" min="2000" max="2099" placeholder="aaaa"
              :class="{ inv: isInv('rt', 'anoproc') }">
          </div>
        </div>

        <div class="section-title">ART / RRT</div>
        <div class="fg c3">
          <div class="fgi">
            <label>Tipo ART <span class="req">*</span></label>
            <select id="rt-arttipo" v-model="rtArtTipo" :class="{ inv: isInv('rt', 'arttipo') }">
              <option value="">Selecione...</option>
              <option value="1">1 - Projeto</option>
              <option value="2">2 - Orçamento</option>
              <option value="3">3 - Execução</option>
              <option value="4">4 - Fiscalização</option>
              <option value="5">5 - Projeto e Orçamento</option>
            </select>
          </div>
          <div class="fgi">
            <label>Número da ART/RRT <span class="req">*</span></label>
            <input type="text" id="rt-artnum" v-model="rtArtNum" maxlength="100"
              placeholder="Número fornecido pelo conselho"
              :class="{ inv: isInv('rt', 'artnum') }">
          </div>
          <div class="fgi">
            <label>Data de Registro ART/RRT <span class="req">*</span></label>
            <input type="date" id="rt-artdata" v-model="rtArtData"
              :class="{ inv: isInv('rt', 'artdata') }">
          </div>
          <div class="fgi">
            <label>CPF do Profissional <span class="req">*</span><span class="maxlen">11 car.</span></label>
            <input type="text" id="rt-artcpf" v-model="rtArtCpf" maxlength="14"
              placeholder="000.000.000-00" @input="onRtCpfInput"
              :class="{ inv: isInv('rt', 'artcpf') }">
          </div>
          <div class="fgi">
            <label>Nº Registro no Conselho <span class="req">*</span><span class="maxlen">100 car.</span></label>
            <input type="text" id="rt-artregistro" v-model="rtArtRegistro" maxlength="100"
              placeholder="Número de registro"
              :class="{ inv: isInv('rt', 'artregistro') }">
          </div>
          <div class="fgi">
            <label>Conselho <span class="req">*</span></label>
            <select id="rt-artconselho" v-model="rtArtConselho"
              :class="{ inv: isInv('rt', 'artconselho') }">
              <option value="">Selecione...</option>
              <option value="1">1 - CREA</option>
              <option value="2">2 - CAU</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Card: Save Buttons -->
    <div class="card">
      <div class="cb">
        <div class="acts" style="justify-content: center; padding: 1rem 0;">
          <button class="btn btn-p" style="padding: 10px 28px; font-size: 13px;" @click="saveNO">💾 Salvar Cadastro Completo</button>
          <button class="btn btn-s" style="padding: 10px 28px; font-size: 13px;" @click="resetAll">🔄 Limpar Tudo</button>
        </div>
        <p style="text-align: center; font-size: 11px; color: var(--muted); margin-top: 8px;">
          <span class="req">*</span> Campos obrigatórios em ambas as seções
        </p>
      </div>
    </div>
  </div>

  <!-- Card: Obras Cadastradas table -->
  <div class="card">
    <div class="ch">
      <h3>Obras Cadastradas</h3>
      <span class="tag">{{ db.rolObras.length }} registros</span>
    </div>
    <div class="cb">
      <div class="tw" v-if="db.rolObras.length">
        <table>
          <thead>
            <tr>
              <th>Instrumento</th>
              <th>Ano</th>
              <th>Bem</th>
              <th>Tipo</th>
              <th>Setor</th>
              <th>CEI</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in db.rolObras" :key="r._id">
              <td><strong>{{ r.numinstrumentocontratual || '-' }}</strong></td>
              <td>{{ r.anoinstrumentocontratual || '-' }}</td>
              <td>{{ r.bem || '-' }}</td>
              <td>{{ r.tipo || '-' }}</td>
              <td>{{ r.setor || '-' }}</td>
              <td>{{ r.cei || '-' }}</td>
              <td><button class="btn btn-d btn-sm" @click="confirmDel('rolObras', r._id)">Excluir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="empty" v-else>
        <div class="empty-icon">🏗</div>
        <h4>Nenhuma obra cadastrada</h4>
        <p>Preencha o formulário acima</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cond-field { display: none; }
.cond-field.show { display: block; }
</style>
