<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'open-export': []
  'toggle-sidebar': []
}>()

const logoError = ref(false)

const topLinks = [
  { href: 'https://www.portovelho.ro.gov.br/transparencia', label: 'Transparência' },
  { href: 'https://www.portovelho.ro.gov.br/ouvidoria', label: 'Ouvidoria' },
  { href: 'https://www.portovelho.ro.gov.br', label: 'Site Oficial' },
]
</script>

<template>
  <div class="app-header">
    <div class="topo-inst">
      <span>Prefeitura de Porto Velho — RO</span>
      <nav class="topo-links">
        <a v-for="link in topLinks" :key="link.href" :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
      </nav>
    </div>
    <header>
      <button class="mobile-menu-btn" @click="emit('toggle-sidebar')" aria-label="Abrir menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div class="brand">
        <a href="https://www.portovelho.ro.gov.br" target="_blank" rel="noopener" class="logo-oficial">
          <img
            v-if="!logoError"
            src="https://www.portovelho.ro.gov.br/assets/site/img/logos/Prefeitura_Horizontal_Azul.svg"
            alt="Prefeitura de Porto Velho"
            class="brand-logo"
            @error="logoError = true"
          />
          <span v-else class="logo-fallback">Prefeitura<br />Porto Velho</span>
        </a>
        <span class="brand-sep">|</span>
        <div class="brand-sys">
          <span class="brand-sys-label">Sistema</span>
          <span class="brand-sys-name">Gestão de Contratos &amp; Obras</span>
          <span class="brand-sys-sub">Remessa TCE-RO · PNCP</span>
        </div>
      </div>
      <button class="btn-export" @click="emit('open-export')" title="Exportar remessa">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>Exportar</span>
      </button>
    </header>
  </div>
</template>

<style scoped>
.topo-inst {
  background: #f8f9fa;
  color: #6b7280;
  font-size: 11px;
  font-family: var(--font);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 32px;
  border-bottom: 1px solid #e5e7eb;
}

.topo-inst span {
  letter-spacing: 0;
  font-weight: 500;
}

.topo-inst a {
  color: #6b7280;
  text-decoration: none;
  margin-left: 20px;
  font-size: 11px;
  font-weight: 500;
  transition: color .15s;
}

.topo-inst a:hover {
  color: var(--primary);
}

header {
  background: #fff;
  color: var(--text);
  padding: 0 2rem;
  display: flex;
  align-items: center;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e5e7eb;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  height: 36px;
}

.logo-oficial:hover {
  opacity: .85;
}

.logo-fallback {
  font-family: var(--font-head);
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1.2;
}

.brand-sep {
  color: var(--border);
  font-size: 18px;
  font-weight: 300;
}

.brand-sys {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-sys-label {
  display: none;
}

.brand-sys-name {
  font-size: 15px;
  font-weight: 700;
  font-family: var(--font-head);
  color: var(--text);
  line-height: 1.2;
  letter-spacing: -0.3px;
}

.brand-sys-sub {
  font-size: 11px;
  color: var(--muted);
  font-family: var(--font);
  font-weight: 500;
  line-height: 1;
}

.btn-export {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-head);
  letter-spacing: 0;
  text-transform: none;
  transition: all .15s;
  flex-shrink: 0;
  margin-left: auto;
}

.btn-export:hover {
  background: #f3f4f6;
  border-color: var(--primary);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 8px;
  margin-right: 10px;
  z-index: 110;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .topo-inst {
    flex-direction: column;
    height: auto;
    padding: 8px 1rem;
    gap: 6px;
    text-align: center;
  }

  .topo-inst a {
    margin: 0 8px;
    display: inline-block;
  }

  header {
    padding: 0 1rem;
    height: 60px;
  }

  .brand-logo {
    height: 28px;
  }

  .brand-sep, .brand-sys-sub {
    display: none;
  }

  .brand-sys-name {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  .btn-export {
    padding: 8px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    justify-content: center;
  }

  .btn-export span {
    display: none;
  }
}
</style>
