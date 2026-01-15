<script setup>
import { useOcrStore } from './stores/ocr'
import UploadZone from './components/ocr/UploadZone.vue'
import { ref } from 'vue'

const store = useOcrStore()
const saveToSheet = ref(false)
const sheetName = ref('2')

const handleSingleProcess = () => {
  store.processOcr(saveToSheet.value, sheetName.value)
}

const handleBatchProcess = () => {
  store.processBatch(saveToSheet.value, sheetName.value)
}

const handlePreincludedProcess = () => {
  store.processPreincludedAssets(saveToSheet.value, sheetName.value)
}

const clearLogs = () => {
  store.clearLogs()
}
</script>

<template>
  <div class="mobile-container">
    <!-- Header -->
    <header class="mobile-header">
      <div class="brand">
        <div class="logo-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="logo-icon"
          >
            <path d="M15 12h5" />
            <path d="M15 8h5" />
            <path d="M19 17V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2Z" />
            <path d="M8 7v10" />
            <path d="M12 7v10" />
          </svg>
        </div>
        <h1>OCR Test</h1>
      </div>
      <div class="status-indicator">
        <div class="dot" :class="{ active: store.uploading || store.isProcessingBatch }"></div>
        <span>{{ store.uploading || store.isProcessingBatch ? 'Analyzing' : 'Ready' }}</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mobile-main">
      <!-- Upload Section -->
      <section class="section">
        <UploadZone />
      </section>

      <!-- Options Section -->
      <section class="section glass ops-card">
        <div class="options-header">
          <h3>Analysis Options</h3>
        </div>
        <div class="option-item">
          <label class="toggle-container">
            <input type="checkbox" v-model="saveToSheet" />
            <span class="toggle-slider"></span>
            Sync to Google Sheet
          </label>
        </div>
        <input
          v-if="saveToSheet"
          type="text"
          v-model="sheetName"
          placeholder="Enter sheet name"
          class="mobile-input"
        />
      </section>

      <!-- Action Buttons -->
      <section class="actions-group">
        <button
          v-if="store.batchFiles.length > 1"
          class="btn-action primary"
          :disabled="store.isProcessingBatch"
          @click="handleBatchProcess"
        >
          <span v-if="store.isProcessingBatch" class="mini-loader"></span>
          {{
            store.isProcessingBatch
              ? `Analyzing ${store.batchProgress}%`
              : `Start Batch (${store.batchFiles.length})`
          }}
        </button>

        <button
          v-else
          class="btn-action primary"
          :disabled="!store.selectedImage || store.uploading"
          @click="handleSingleProcess"
        >
          <span v-if="store.uploading" class="mini-loader"></span>
          {{ store.uploading ? 'Analyzing...' : 'Analyze Single' }}
        </button>

        <button
          class="btn-action secondary"
          :disabled="store.isProcessingBatch || store.uploading"
          @click="handlePreincludedProcess"
        >
          Analyze Pre-included (50)
        </button>
      </section>

      <!-- Log Window Section -->
      <section class="log-section">
        <div class="log-header">
          <h3>System Logs</h3>
          <button @click="clearLogs" class="btn-text">Clear</button>
        </div>
        <div class="log-window glass">
          <div v-if="store.logs.length === 0" class="log-empty">No logs yet.</div>
          <div v-for="(log, idx) in store.logs" :key="idx" class="log-entry" :class="log.type">
            <span class="log-time">[{{ log.timestamp }}]</span>
            <span class="log-msg">{{ log.message }}</span>
          </div>
        </div>
      </section>

      <!-- Final Summary Info (Only shows when done) -->
      <section
        v-if="store.results.comparison && !store.uploading && !store.isProcessingBatch"
        class="summary-card glass animate-fade-in"
      >
        <div class="summary-header">
          <div class="success-icon">✓</div>
          <div>
            <h4>Analysis Complete</h4>
            <p>
              Processed in {{ (store.metrics.googleSpeed + store.metrics.naverSpeed).toFixed(0) }}ms
              (Total)
            </p>
          </div>
        </div>
        <div class="recommendation">
          <strong>Result:</strong> {{ store.results.comparison.recommendation }}
        </div>
      </section>
    </main>
  </div>
</template>

<style>
@import './styles/main.css';

:root {
  --mobile-padding: 1.25rem;
}

body {
  background-color: #0b0f1a;
  overscroll-behavior-y: contain; /* Prevents pull-to-refresh */
}

#app {
  padding: 0;
  max-width: 500px;
  margin: 0 auto;
}

.mobile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.mobile-header {
  padding: 1.5rem var(--mobile-padding);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(11, 15, 26, 0.8);
  backdrop-filter: blur(10px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-circle {
  width: 32px;
  height: 32px;
  background: var(--accent-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  color: white;
}

.brand h1 {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.dot {
  width: 8px;
  height: 8px;
  background: #334155;
  border-radius: 50%;
}

.dot.active {
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: pulse 1s infinite;
}

.mobile-main {
  padding: 0 var(--mobile-padding);
}

.section {
  margin-bottom: 1.5rem;
}

.ops-card {
  padding: 1.25rem;
  border-radius: var(--radius-lg);
}

.options-header h3 {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.option-item {
  margin-bottom: 0.5rem;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}

.mobile-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--panel-border);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  margin-top: 1rem;
  color: white;
  outline: none;
}

.actions-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.btn-action {
  width: 100%;
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-action:active {
  transform: scale(0.98);
}

.btn-action.primary {
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 4px 20px rgba(56, 189, 248, 0.3);
}

.btn-action.secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--panel-border);
  color: var(--text-primary);
}

.btn-action:disabled {
  opacity: 0.5;
  filter: grayscale(0.5);
}

.log-section {
  margin-top: 1rem;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.log-header h3 {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.btn-text {
  background: none;
  border: none;
  color: var(--accent-primary);
  font-weight: 600;
  font-size: 0.85rem;
}

.log-window {
  height: 250px;
  border-radius: var(--radius-md);
  padding: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-color: rgba(255, 255, 255, 0.05);
}

.log-empty {
  color: var(--text-secondary);
  text-align: center;
  margin-top: 2rem;
  font-style: italic;
}

.log-entry {
  line-height: 1.4;
  word-break: break-all;
}

.log-time {
  color: var(--text-secondary);
  margin-right: 0.5rem;
}
.log-entry.success .log-msg {
  color: #10b981;
}
.log-entry.error .log-msg {
  color: #f87171;
}

.summary-card {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border-left: 4px solid #10b981;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.success-icon {
  width: 40px;
  height: 40px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
}

.summary-header h4 {
  font-size: 1.1rem;
}
.summary-header p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.recommendation {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.mini-loader {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
