import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { RolContrato, FiscalGestor, RolObra, AcompContrato, AcompObra, ExoneracaoFiscal, SituacaoContrato, RespTecnico, FileEntry } from '../types'

const STORAGE_KEY = 'tce-db-vue'
const FILE_BANKS_KEY = 'tce-file-banks'

export const useDB = defineStore('db', () => {
  const rolContratos = ref<RolContrato[]>([])
  const fiscalGestor = ref<FiscalGestor[]>([])
  const rolObras = ref<RolObra[]>([])
  const respTecnico = ref<RespTecnico[]>([])
  const acompContratos = ref<AcompContrato[]>([])
  const acompObras = ref<AcompObra[]>([])
  const exoneracaoFiscal = ref<ExoneracaoFiscal[]>([])
  const situacaoContrato = ref<SituacaoContrato[]>([])

  const fileBanks = ref<Record<string, FileEntry[]>>({
    Contratos: [],
    AcompContratos: [],
    RelatorioFot: [],
    PlanObra: [],
    PlanLicitacao: [],
    PlanVencedora: [],
    ProjContratante: [],
    ProjContratada: []
  })

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        rolContratos.value = data.rolContratos || []
        fiscalGestor.value = data.fiscalGestor || []
        rolObras.value = data.rolObras || []
        respTecnico.value = data.respTecnico || []
        acompContratos.value = data.acompContratos || []
        acompObras.value = data.acompObras || []
        exoneracaoFiscal.value = data.exoneracaoFiscal || []
        situacaoContrato.value = data.situacaoContrato || []
      }
      const fileData = localStorage.getItem(FILE_BANKS_KEY)
      if (fileData) {
        fileBanks.value = JSON.parse(fileData)
      }
    } catch (e) {
      console.warn('Failed to load from localStorage', e)
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      rolContratos: rolContratos.value,
      fiscalGestor: fiscalGestor.value,
      rolObras: rolObras.value,
      respTecnico: respTecnico.value,
      acompContratos: acompContratos.value,
      acompObras: acompObras.value,
      exoneracaoFiscal: exoneracaoFiscal.value,
      situacaoContrato: situacaoContrato.value
    }))
  }

  function persistFileBanks() {
    localStorage.setItem(FILE_BANKS_KEY, JSON.stringify(fileBanks.value))
  }

  function delRec(collection: string, id: string) {
    const colMap: Record<string, any> = {
      rolContratos, fiscalGestor, rolObras, respTecnico,
      acompContratos, acompObras, exoneracaoFiscal, situacaoContrato
    }
    const col = colMap[collection]
    if (col) {
      col.value = col.value.filter((r: any) => r._id !== id)
      persist()
    }
  }

  function addFileToBank(bank: string, entry: FileEntry) {
    if (!fileBanks.value[bank]) fileBanks.value[bank] = []
    fileBanks.value[bank] = fileBanks.value[bank].filter(e => e.name !== entry.name)
    fileBanks.value[bank].push(entry)
    persistFileBanks()
  }

  return {
    rolContratos, fiscalGestor, rolObras, respTecnico,
    acompContratos, acompObras, exoneracaoFiscal, situacaoContrato,
    fileBanks, load, persist, delRec, addFileToBank
  }
})
