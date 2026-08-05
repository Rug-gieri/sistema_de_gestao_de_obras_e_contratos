<script setup lang="ts">
</script>

<template>
  <footer class="main-footer">
    Desenvolvido pela <a href="https://semec.portovelho.ro.gov.br/" target="_blank" rel="noopener">SEMEC</a> - Versão de testes 0.1.0
  </footer>
</template>

<style scoped>
.main-footer {
  background: #fff;
  border-top: 1px solid var(--border);
  padding: 1rem 2rem;
  text-align: center;
  font-size: 11px;
  color: var(--muted);
  font-family: var(--font-head);
}

.main-footer a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 700;
}

.main-footer a:hover {
  text-decoration: underline;
}
</style>
