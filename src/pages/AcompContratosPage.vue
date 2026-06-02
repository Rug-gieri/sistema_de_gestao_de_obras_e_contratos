<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDB } from '../stores/useDB'
import { useToast } from '../stores/useToast'
import { maskCNPJ } from '../composables/useMasks'
import { uid } from '../utils/format'
import UploadBox from '../components/shared/UploadBox.vue'

const db = useDB()
const toast = useToast()

const acCnpj = ref('')
const acIdContratoPNCP = ref('')
const acNumeroAlteracao = ref('')
const acAnoAlteracao = ref('')
const acSequencial = ref('')
const acDataAssinatura = ref('')
const acDataPub = ref('')
const acLocalPub = ref('')
const acUrlAlteracao = ref('')
const acTipoAlteracao = ref('')
const acClassificacaoAditivo = ref('')
const acClassificacaoUnilateral = ref('')
const acModProjeto = ref('')
const acModValor = ref('')
const acValAcrescimo = ref('')
const acValSupressao = ref('')
const acClassificacaoBilateral = ref('')
const acDescricaoBilateral = ref('')
const acDataVig = ref('')
const acTipoApostilamento = ref('')
const acValApostilamento = ref('')
const acDescricaoAdApostilamento = ref('')
const acObjeto = ref('')

const acUploadRef = ref<InstanceType<typeof UploadBox> | null>(null)

// --- Conditional visibility ---
const showAditivo = computed(() => acTipoAlteracao.value === '1')
const showApostilamento = computed(() => acTipoAlteracao.value === '2')

const showClassificacaoUnilateral = computed(() => showAditivo.value && acClassificacaoAditivo.value === '1')
const showClassificacaoBilateral = computed(() => showAditivo.value && acClassificacaoAditivo.value === '2')

const showModProjeto = computed(() => showClassificacaoUnilateral.value && (acClassificacaoUnilateral.value === '1' || acClassificacaoUnilateral.value === '3'))
const showModValor = computed(() => showClassificacaoUnilateral.value && (acClassificacaoUnilateral.value === '2' || acClassificacaoUnilateral.value === '3' || acClassificacaoUnilateral.value === '5'))
const showValAcrescimo = computed(() => showModValor.value && (acModValor.value === '1' || acModValor.value === '3'))
const showValSupressao = computed(() => showModValor.value && (acModValor.value === '2' || acModValor.value === '3'))
const showDataVigUnilateral = computed(() => showClassificacaoUnilateral.value && (acClassificacaoUnilateral.value === '4' || acClassificacaoUnilateral.value === '5'))

const showDescricaoBilateral = computed(() => showClassificacaoBilateral.value && acClassificacaoBilateral.value === '7')
const showDataVigBilateral = computed(() => showClassificacaoBilateral.value && acClassificacaoBilateral.value === '6')

const showValApostilamento = computed(() => showApostilamento.value && (acTipoApostilamento.value === '1' || acTipoApostilamento.value === '2' || acTipoApostilamento.value === '3'))
const showDescricaoApostilamento = computed(() => showApostilamento.value && acTipoApostilamento.value === '7')

// --- Validation ---
const invalids = ref<Set<string>>(new Set())

function setInv(field: string, invalid: boolean) {
  if (invalid) {
    invalids.value.add(field)
  } else {
    invalids.value.delete(field)
  }
}

function isInv(field: string): boolean {
  return invalids.value.has(field)
}

function getRef(field: string) {
  const map: Record<string, any> = {
    'ac-cnpj': acCnpj, 'ac-idcontratopncp': acIdContratoPNCP,
    'ac-numeroalteracao': acNumeroAlteracao, 'ac-anoalteracao': acAnoAlteracao,
    'ac-sequencial': acSequencial, 'ac-dataassinaturaalteracao': acDataAssinatura,
    'ac-datapubalteracao': acDataPub, 'ac-localpubalteracao': acLocalPub,
    'ac-urlalteracao': acUrlAlteracao, 'ac-tipoalteracao': acTipoAlteracao,
    'ac-classificacaoaditivo': acClassificacaoAditivo,
    'ac-classificacaounilateral': acClassificacaoUnilateral,
    'ac-modprojeto': acModProjeto, 'ac-modvalor': acModValor,
    'ac-valacrescimo': acValAcrescimo, 'ac-valsupressao': acValSupressao,
    'ac-classificacaobilateral': acClassificacaoBilateral,
    'ac-descricaobilateral': acDescricaoBilateral, 'ac-datavig': acDataVig,
    'ac-tipoapostilamento': acTipoApostilamento,
    'ac-valapostilamento': acValApostilamento,
    'ac-descricaoadapostilamento': acDescricaoAdApostilamento,
    'ac-objeto': acObjeto,
  }
  return map['ac-' + field]
}

function trimVal(v: any): string {
  return String(v ?? '').trim()
}

function valid(fields: string[]): boolean {
  let ok = true
  for (const f of fields) {
    const ref = getRef(f)
    if (!ref || !trimVal(ref.value)) {
      setInv(f, true)
      ok = false
    } else {
      setInv(f, false)
    }
  }
  return ok
}

function onCnpjInput() {
  acCnpj.value = maskCNPJ(acCnpj.value)
}

function resetAll() {
  acCnpj.value = ''
  acIdContratoPNCP.value = ''
  acNumeroAlteracao.value = ''
  acAnoAlteracao.value = ''
  acSequencial.value = ''
  acDataAssinatura.value = ''
  acDataPub.value = ''
  acLocalPub.value = ''
  acUrlAlteracao.value = ''
  acTipoAlteracao.value = ''
  acClassificacaoAditivo.value = ''
  acClassificacaoUnilateral.value = ''
  acModProjeto.value = ''
  acModValor.value = ''
  acValAcrescimo.value = ''
  acValSupressao.value = ''
  acClassificacaoBilateral.value = ''
  acDescricaoBilateral.value = ''
  acDataVig.value = ''
  acTipoApostilamento.value = ''
  acValApostilamento.value = ''
  acDescricaoAdApostilamento.value = ''
  acObjeto.value = ''
  invalids.value = new Set()
  acUploadRef.value?.reset()
}

function saveAC() {
  invalids.value = new Set()

  const req = ['cnpj', 'idcontratopncp', 'numeroalteracao', 'anoalteracao',
    'sequencial', 'dataassinaturaalteracao', 'datapubalteracao',
    'localpubalteracao', 'urlalteracao', 'tipoalteracao', 'objeto']
  let ok = valid(req)

  if (showAditivo.value && !trimVal(acClassificacaoAditivo.value)) {
    setInv('classificacaoaditivo', true); ok = false
  }
  if (showClassificacaoUnilateral.value && !trimVal(acClassificacaoUnilateral.value)) {
    setInv('classificacaounilateral', true); ok = false
  }
  if (showModProjeto.value && !trimVal(acModProjeto.value)) {
    setInv('modprojeto', true); ok = false
  }
  if (showModValor.value && !trimVal(acModValor.value)) {
    setInv('modvalor', true); ok = false
  }
  if (showValAcrescimo.value && !trimVal(acValAcrescimo.value)) {
    setInv('valacrescimo', true); ok = false
  }
  if (showValSupressao.value && !trimVal(acValSupressao.value)) {
    setInv('valsupressao', true); ok = false
  }
  if (showClassificacaoBilateral.value && !trimVal(acClassificacaoBilateral.value)) {
    setInv('classificacaobilateral', true); ok = false
  }
  if (showDescricaoBilateral.value && !trimVal(acDescricaoBilateral.value)) {
    setInv('descricaobilateral', true); ok = false
  }
  if ((showDataVigBilateral.value || showDataVigUnilateral.value) && !trimVal(acDataVig.value)) {
    setInv('datavig', true); ok = false
  }
  if (showApostilamento.value && !trimVal(acTipoApostilamento.value)) {
    setInv('tipoapostilamento', true); ok = false
  }
  if (showValApostilamento.value && !trimVal(acValApostilamento.value)) {
    setInv('valapostilamento', true); ok = false
  }
  if (showDescricaoApostilamento.value && !trimVal(acDescricaoAdApostilamento.value)) {
    setInv('descricaoadapostilamento', true); ok = false
  }

  const upOk = acUploadRef.value?.validate() ?? false
  if (!upOk) ok = false

  if (!ok) {
    toast.show('Preencha os campos obrigatórios e importe o arquivo do termo aditivo/apostilamento.', 'err')
    return
  }

  const vals: Record<string, string> = { _id: uid() }
  const allFields = [...req, 'classificacaoaditivo', 'classificacaounilateral',
    'classificacaobilateral', 'descricaobilateral', 'modprojeto', 'modvalor',
    'valacrescimo', 'valsupressao', 'datavig', 'tipoapostilamento',
    'valapostilamento', 'descricaoadapostilamento']
  for (const f of allFields) {
    const ref = getRef(f)
    vals[f] = ref ? trimVal(ref.value) : ''
  }

  db.acompContratos.push(vals as any)
  db.persist()
  toast.show('Acompanhamento salvo!', 'ok')
  resetAll()
}

function confirmDel(col: string, id: string) {
  if (!confirm(`Excluir este acompanhamento?`)) return
  db.delRec(col, id)
  toast.show('Registro excluído.', 'err')
}
</script>

<template>
  <div class="pt">Registre uma alteração contratual</div>
  <div class="ps">Alterações contratuais (Termos Aditivos e Apostilamentos)</div>

  <div class="card">
    <div class="ch"><h3>Alteração Contratual</h3></div>
    <div class="cb">
      <div class="section-title">Identificação</div>
      <div class="fg c3">
        <div class="fgi">
          <label>CNPJ da UG <span class="req">*</span></label>
          <input type="text" id="ac-cnpj" v-model="acCnpj" maxlength="18"
            placeholder="00.000.000/0000-00" @input="onCnpjInput"
            :class="{ inv: isInv('cnpj') }">
        </div>
        <div class="fgi s2">
          <label>ID Contrato PNCP <span class="req">*</span><span class="maxlen">28 car.</span></label>
          <input type="text" id="ac-idcontratopncp" v-model="acIdContratoPNCP" maxlength="28"
            placeholder="ID do contrato sendo alterado"
            :class="{ inv: isInv('idcontratopncp') }">
        </div>
        <div class="fgi">
          <label>Nº da Alteração <span class="req">*</span><span class="maxlen">20 car.</span></label>
          <input type="text" id="ac-numeroalteracao" v-model="acNumeroAlteracao" maxlength="20"
            placeholder="Ex: TA-001/2025" :class="{ inv: isInv('numeroalteracao') }">
        </div>
        <div class="fgi">
          <label>Ano da Alteração <span class="req">*</span></label>
          <input type="number" id="ac-anoalteracao" v-model="acAnoAlteracao"
            min="2000" max="2099" placeholder="aaaa"
            :class="{ inv: isInv('anoalteracao') }">
        </div>
        <div class="fgi">
          <label>Sequencial <span class="req">*</span><span class="hint">1º aditivo = 1, 2º = 2...</span></label>
          <input type="number" id="ac-sequencial" v-model="acSequencial" min="1" max="999"
            placeholder="Ex: 1" :class="{ inv: isInv('sequencial') }">
        </div>
      </div>

      <div class="section-title">Datas e Publicação</div>
      <div class="fg c3">
        <div class="fgi">
          <label>Data de Assinatura <span class="req">*</span></label>
          <input type="date" id="ac-dataassinaturaalteracao" v-model="acDataAssinatura"
            :class="{ inv: isInv('dataassinaturaalteracao') }">
        </div>
        <div class="fgi">
          <label>Data de Publicação <span class="req">*</span></label>
          <input type="date" id="ac-datapubalteracao" v-model="acDataPub"
            :class="{ inv: isInv('datapubalteracao') }">
        </div>
        <div class="fgi">
          <label>Local de Publicação <span class="req">*</span></label>
          <select id="ac-localpubalteracao" v-model="acLocalPub"
            :class="{ inv: isInv('localpubalteracao') }">
            <option value="">Selecione...</option>
            <option value="1">1 - Diário Oficial</option>
            <option value="2">2 - Jornal de circulação</option>
            <option value="3">3 - Sítio eletrônico oficial</option>
            <option value="4">4 - Portal de Transparência</option>
            <option value="5">5 - Afixação em ambiente público</option>
            <option value="6">6 - PNCP</option>
          </select>
        </div>
        <div class="fgi s3">
          <label>URL de Publicação <span class="req">*</span><span class="maxlen">1024 car.</span></label>
          <input type="url" id="ac-urlalteracao" v-model="acUrlAlteracao" maxlength="1024"
            placeholder="https://" :class="{ inv: isInv('urlalteracao') }">
        </div>
      </div>

      <div class="section-title">Tipo da Alteração</div>
      <div class="fg c3">
        <div class="fgi">
          <label>Tipo de Alteração <span class="req">*</span></label>
          <select id="ac-tipoalteracao" v-model="acTipoAlteracao"
            :class="{ inv: isInv('tipoalteracao') }">
            <option value="">Selecione...</option>
            <option value="1">1 - Termo aditivo</option>
            <option value="2">2 - Termo de apostilamento</option>
          </select>
        </div>

        <!-- Aditivo: classificação -->
        <div class="fgi" v-show="showAditivo">
          <label>Classificação do Aditivo <span class="req">*</span></label>
          <select id="ac-classificacaoaditivo" v-model="acClassificacaoAditivo">
            <option value="">Selecione...</option>
            <option value="1">1 - Alteração unilateral</option>
            <option value="2">2 - Alteração bilateral</option>
          </select>
        </div>

        <div class="fgi" v-show="showClassificacaoUnilateral">
          <label>Classificação Unilateral <span class="req">*</span></label>
          <select id="ac-classificacaounilateral" v-model="acClassificacaoUnilateral">
            <option value="">Selecione...</option>
            <option value="1">1 - Modificação de projeto/especificações</option>
            <option value="2">2 - Modificação do valor</option>
            <option value="3">3 - Alteração qualitativa e quantitativa</option>
            <option value="4">4 - Modificação de prazo</option>
            <option value="5">5 - Modificação de valor e prazo</option>
          </select>
        </div>

        <div class="fgi s3" v-show="showModProjeto">
          <label>Modificação do Projeto/Especificações <span class="req">*</span><span class="maxlen">5120 car.</span></label>
          <textarea id="ac-modprojeto" v-model="acModProjeto" maxlength="5120" rows="2"
            placeholder="Descreva as mudanças efetuadas"></textarea>
        </div>

        <div class="fgi" v-show="showModValor">
          <label>Tipo da Modificação de Valor <span class="req">*</span></label>
          <select id="ac-modvalor" v-model="acModValor">
            <option value="">Selecione...</option>
            <option value="1">1 - Acréscimo</option>
            <option value="2">2 - Supressão</option>
            <option value="3">3 - Acréscimo e supressão simultaneamente</option>
          </select>
        </div>

        <div class="fgi" v-show="showValAcrescimo">
          <label>Valor do Acréscimo (R$) <span class="req">*</span></label>
          <input type="number" id="ac-valacrescimo" v-model="acValAcrescimo" min="0" step="0.01" placeholder="0,00">
        </div>

        <div class="fgi" v-show="showValSupressao">
          <label>Valor da Supressão (R$) <span class="req">*</span></label>
          <input type="number" id="ac-valsupressao" v-model="acValSupressao" min="0" step="0.01" placeholder="0,00">
        </div>

        <div class="fgi" v-show="showClassificacaoBilateral">
          <label>Classificação Bilateral <span class="req">*</span></label>
          <select id="ac-classificacaobilateral" v-model="acClassificacaoBilateral">
            <option value="">Selecione...</option>
            <option value="1">1 - Substituição da garantia</option>
            <option value="2">2 - Regime de execução</option>
            <option value="3">3 - Modo de fornecimento</option>
            <option value="4">4 - Forma de pagamento</option>
            <option value="5">5 - Equilíbrio econômico-financeiro</option>
            <option value="6">6 - Modificação de prazo</option>
            <option value="7">7 - Outro</option>
          </select>
        </div>

        <div class="fgi s2" v-show="showDescricaoBilateral">
          <label>Descrição do Aditivo Bilateral <span class="req">*</span><span class="maxlen">1024 car.</span></label>
          <textarea id="ac-descricaobilateral" v-model="acDescricaoBilateral" maxlength="1024" rows="2"
            placeholder="Descreva a modificação"></textarea>
        </div>

        <div class="fgi" v-show="showDataVigBilateral || showDataVigUnilateral">
          <label>Nova Data de Vigência <span class="req">*</span></label>
          <input type="date" id="ac-datavig" v-model="acDataVig">
        </div>

        <!-- Apostilamento -->
        <div class="fgi" v-show="showApostilamento">
          <label>Tipo do Apostilamento <span class="req">*</span></label>
          <select id="ac-tipoapostilamento" v-model="acTipoApostilamento">
            <option value="">Selecione...</option>
            <option value="1">1 - Reajuste</option>
            <option value="2">2 - Repactuação</option>
            <option value="3">3 - Reequilíbrio</option>
            <option value="4">4 - Atualizações/penalidades</option>
            <option value="5">5 - Alterações na razão social</option>
            <option value="6">6 - Empenho de dotações</option>
            <option value="7">7 - Outro</option>
          </select>
        </div>

        <div class="fgi" v-show="showValApostilamento">
          <label>Valor do Apostilamento (R$) <span class="req">*</span></label>
          <input type="number" id="ac-valapostilamento" v-model="acValApostilamento" min="0" step="0.01" placeholder="0,00">
        </div>

        <div class="fgi s2" v-show="showDescricaoApostilamento">
          <label>Descrição do Apostilamento <span class="req">*</span><span class="maxlen">1024 car.</span></label>
          <textarea id="ac-descricaoadapostilamento" v-model="acDescricaoAdApostilamento" maxlength="1024" rows="2"
            placeholder="Descreva a modificação"></textarea>
        </div>
      </div>

      <div class="section-title">Histórico e Arquivo</div>
      <div class="fg c1">
        <div class="fgi">
          <label>Histórico da Alteração <span class="req">*</span><span class="maxlen">5000 car.</span></label>
          <textarea id="ac-objeto" v-model="acObjeto" maxlength="5000" rows="3"
            placeholder="Descreva o histórico da alteração contratual"
            :class="{ inv: isInv('objeto') }"></textarea>
        </div>
      </div>

      <UploadBox ref="acUploadRef" prefix="ac" label="Nome do arquivo PDF"
        hint="Termo aditivo ou apostilamento — máx. 20 car." />

      <div class="acts">
        <button class="btn btn-p" @click="saveAC">Salvar Acompanhamento</button>
        <button class="btn btn-s" @click="resetAll">Limpar</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="ch">
      <h3>Acompanhamentos Registrados</h3>
      <span class="tag">{{ db.acompContratos.length }} registros</span>
    </div>
    <div class="cb">
      <div class="tw" v-if="db.acompContratos.length">
        <table>
          <thead>
            <tr>
              <th>ID PNCP</th>
              <th>Nº Alteração</th>
              <th>Ano</th>
              <th>Seq.</th>
              <th>Tipo</th>
              <th>Assinatura</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in db.acompContratos" :key="r._id">
              <td>{{ r.idcontratopncp || '-' }}</td>
              <td><strong>{{ r.numeroalteracao || '-' }}</strong></td>
              <td>{{ r.anoalteracao || '-' }}</td>
              <td>{{ r.sequencial || '-' }}</td>
              <td>{{ r.tipoalteracao === '1' ? 'Termo Aditivo' : 'Apostilamento' }}</td>
              <td>{{ r.dataassinaturaalteracao || '-' }}</td>
              <td><button class="btn btn-d btn-sm" @click="confirmDel('acompContratos', r._id)">Excluir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="empty" v-else>
        <div class="empty-icon">📋</div>
        <h4>Nenhum acompanhamento</h4>
        <p>Adicione alterações acima</p>
      </div>
    </div>
  </div>
</template>


