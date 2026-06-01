<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDB } from './stores/useDB'
import AppHeader from './components/layout/AppHeader.vue'
import Sidebar from './components/layout/Sidebar.vue'
import SidebarOverlay from './components/layout/SidebarOverlay.vue'
import { useToast } from './stores/useToast'
import ExportModal from './components/export/ExportModal.vue'

const router = useRouter()
const route = useRoute()
const db = useDB()

const sidebarOpen = ref(false)
const exportOpen = ref(false)
const toast = useToast()

const pageMap: Record<string, string> = {
  'home': '/', 'dash': '/dashboard', 'nc': '/contratos', 'no': '/obras',
  'ac': '/acomp-contratos', 'ao': '/acomp-obras', 'ef': '/exoneracao', 'sc': '/situacao'
}
const routeToPage: Record<string, string> = Object.fromEntries(
  Object.entries(pageMap).map(([k, v]) => [v, k])
)

const currentRoute = computed(() => routeToPage[route.path] || 'home')

const badges = computed(() => ({
  nc: db.rolContratos.length,
  no: db.rolObras.length,
  ac: db.acompContratos.length,
  ao: db.acompObras.length,
  ef: db.exoneracaoFiscal.length,
  sc: db.situacaoContrato.length,
}))

onMounted(() => {
  db.load()
})

function navigate(page: string) {
  const path = pageMap[page] || '/'
  router.push(path)
  sidebarOpen.value = false
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <AppHeader @toggle-sidebar="toggleSidebar" @open-export="exportOpen = true" />

  <div class="layout">
    <Sidebar
      :current-route="currentRoute"
      :badges="badges"
      :open="sidebarOpen"
      @navigate="navigate"
    />
    <main>
      <router-view />
    </main>
    <SidebarOverlay :visible="sidebarOpen" @close="sidebarOpen = false" />
  </div>

  <footer class="main-footer">
    Desenvolvido pela <a href="https://semec.portovelho.ro.gov.br/" target="_blank">SEMEC</a> - Versão de testes
  </footer>

  <!-- inline toast -->
  <Transition name="tst">
    <div v-if="toast.visible" class="toast-global" :class="'toast-' + toast.type">
      {{ toast.message }}
    </div>
  </Transition>
  <ExportModal v-if="exportOpen" @close="exportOpen = false" />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600&display=swap');

:root {
  --primary: #0a4a8f;
  --primary-light: #1565c0;
  --primary-dark: #062d5a;
  --accent: #e7bc61;
  --accent-dark: #c98a00;
  --green: #2e7d32;
  --danger: #c62828;
  --success: #1b7a4e;
  --bg: #eef2f8;
  --card: #ffffff;
  --border: #cdd6e8;
  --text: #1a1f2e;
  --muted: #5a6478;
  --label: #374151;
  --input-bg: #ffffff;
  --font-head: 'Montserrat', 'Segoe UI', system-ui, sans-serif;
  --font: 'Open Sans', 'Segoe UI', system-ui, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.topo-inst {
  background: #f8f9fa; color: #6b7280; font-size: 11px;
  font-family: var(--font); display: flex; align-items: center;
  justify-content: space-between; padding: 0 2rem;
  height: 32px; border-bottom: 1px solid #e5e7eb;
}
.topo-inst a { color: #6b7280; text-decoration: none; margin-left: 20px; font-size: 11px; font-weight: 500; }
.topo-inst a:hover { color: var(--primary); }

.layout {
  display: flex;
  min-height: calc(100vh - 96px);
}

main {
  flex: 1;
  padding: 1.75rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.main-footer {
  background: #fff; border-top: 1px solid var(--border);
  padding: 1rem 2rem; text-align: center; font-size: 11px;
  color: var(--muted); font-family: var(--font-head);
}
.main-footer a { color: var(--primary); text-decoration: none; font-weight: 700; }
.main-footer a:hover { text-decoration: underline; }

/* Shared styles */
.pt { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 2px; font-family: var(--font-head); }
.ps { font-size: 12px; color: var(--muted); margin-bottom: 1.25rem; }

.card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 8px; margin-bottom: 1.25rem; overflow: hidden;
}
.ch {
  padding: .75rem 1.25rem; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  background: #002a68;
}
.ch h3 { font-size: 13px; font-weight: 600; color: var(--bg); font-family: var(--font-head); }
.ch .tag { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; background: #f3f4f6; color: var(--muted); font-family: var(--font-head); }
.cb { padding: 1rem 1.25rem; }

.fg { display: grid; grid-template-columns: 1fr 1fr; gap: .85rem; }
.fg.c3 { grid-template-columns: 1fr 1fr 1fr; }
.fg.c1 { grid-template-columns: 1fr; }
.fgi { display: flex; flex-direction: column; gap: 3px; }
.fgi.s2 { grid-column: span 2; }
.fgi.s3 { grid-column: span 3; }

label { font-size: 11px; font-weight: 600; color: var(--label); display: flex; align-items: center; gap: 3px; }
label .req { color: var(--danger); font-size: 13px; }
label .hint { font-weight: 400; color: var(--muted); font-size: 10px; margin-left: 3px; }
label .maxlen { font-weight: 400; color: var(--muted); font-size: 10px; margin-left: auto; }

input[type="text"], input[type="date"], input[type="number"], input[type="url"],
select, textarea {
  width: 100%; padding: 7px 9px; border: 1px solid #d1d5db;
  border-radius: 6px; font-size: 12.5px; color: var(--text);
  background: var(--input-bg); font-family: var(--font);
  transition: border .12s, box-shadow .12s; outline: none;
}
input:focus, select:focus, textarea:focus {
  border-color: var(--primary); box-shadow: 0 0 0 3px rgba(10,74,143,0.08);
}
.inv { border-color: var(--danger) !important; box-shadow: 0 0 0 3px rgba(185,28,28,0.1); }
textarea { resize: vertical; min-height: 65px; }
select { cursor: pointer; }

.btn { padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; font-family: var(--font-head); }
.btn-p { background: var(--primary); color: #fff; }
.btn-p:hover { background: var(--primary-light); }
.btn-s { background: #fff; color: var(--text); border: 1px solid var(--border); }
.btn-s:hover { border-color: var(--primary); color: var(--primary); }
.btn-d { background: #fef2f2; color: var(--danger); }
.btn-sm { padding: 5px 10px; font-size: 11px; }
.acts { display: flex; gap: 8px; margin-top: 1rem; }

.tw { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th { padding: 7px 10px; text-align: left; font-size: 10px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; border-bottom: 1px solid var(--border); background: #fafafa; white-space: nowrap; }
td { padding: 8px 10px; border-bottom: 1px solid #f5f5f5; color: var(--text); }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #fafafa; }

.empty { text-align: center; padding: 2.5rem 1rem; color: var(--muted); }
.empty-icon { font-size: 36px; margin-bottom: .6rem; }
.empty h4 { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
.empty p { font-size: 12px; }

.section-title {
  font-size: 11px; font-weight: 600; color: var(--muted);
  text-transform: uppercase; letter-spacing: .5px;
  margin: 1rem 0 .5rem; padding-bottom: 4px;
  border-bottom: 1px solid #e5e7eb; font-family: var(--font-head);
}

.toast-global {
  position: fixed; bottom: 20px; right: 20px; z-index: 999;
  background: #1a1f2e; color: #fff; padding: 10px 18px;
  border-radius: 6px; font-size: 12px; font-weight: 600;
  box-shadow: 0 4px 20px rgba(0,0,0,.2); max-width: 320px;
}
.toast-err { border-left: 4px solid #c62828; }
.toast-ok { border-left: 4px solid #22c55e; }
.tst-enter-active { transition: all .25s ease; }
.tst-leave-active { transition: all .25s ease; }
.tst-enter-from { transform: translateY(80px); opacity: 0; }
.tst-leave-to { transform: translateY(80px); opacity: 0; }

@media (max-width: 768px) {
  .fg, .fg.c3 { grid-template-columns: 1fr; }
  .fgi.s2, .fgi.s3 { grid-column: span 1; }
  main { padding: 1rem; }
  .pt { font-size: 18px; }
}
</style>
