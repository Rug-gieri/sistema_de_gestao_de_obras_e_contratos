import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { RolContrato, FiscalGestor, RolObra, AcompContrato, AcompObra, ExoneracaoFiscal, SituacaoContrato, RespTecnico, FileEntry, PersistedFileEntry } from '../types'

const STORAGE_KEY = 'tce-db-vue'
const FILE_BANKS_KEY = 'tce-file-banks'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function base64ToFile(base64: string, name: string, type: string): File {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new File([bytes], name, { type })
}

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
        const parsed: Record<string, PersistedFileEntry[]> = JSON.parse(fileData)
        for (const [bank, entries] of Object.entries(parsed)) {
          fileBanks.value[bank] = entries.map(e => ({
            name: e.name,
            file: base64ToFile(e.base64, e.name, e.type)
          }))
        }
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

  async function persistFileBanks() {
    const persisted: Record<string, PersistedFileEntry[]> = {}
    for (const [bank, entries] of Object.entries(fileBanks.value)) {
      persisted[bank] = await Promise.all(
        entries.map(async e => ({
          name: e.name,
          base64: await fileToBase64(e.file),
          type: e.file.type
        }))
      )
    }
    localStorage.setItem(FILE_BANKS_KEY, JSON.stringify(persisted))
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

  async function addFileToBank(bank: string, entry: FileEntry) {
    if (!fileBanks.value[bank]) fileBanks.value[bank] = []
    fileBanks.value[bank] = fileBanks.value[bank].filter(e => e.name !== entry.name)
    fileBanks.value[bank].push(entry)
    await persistFileBanks()
  }

  return {
    rolContratos, fiscalGestor, rolObras, respTecnico,
    acompContratos, acompObras, exoneracaoFiscal, situacaoContrato,
    fileBanks, load, persist, delRec, addFileToBank
  }
})
