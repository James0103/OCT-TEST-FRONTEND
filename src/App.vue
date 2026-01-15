<script setup>
import { useOcrStore } from './stores/ocr'
import UploadZone from './components/ocr/UploadZone.vue'
import ResultCard from './components/ocr/ResultCard.vue'
import MetricWidget from './components/ui/MetricWidget.vue'
// import BaseCard from './components/ui/BaseCard.vue'

const store = useOcrStore()

const handleProcess = () => {
  store.processOcr()
}
</script>

<template>
  <div class="app-container">
    <header class="app-header animate-fade-in">
      <div class="brand">
        <div class="logo-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
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
        <div class="brand-text">
          <h1>OCR Performance Comparator</h1>
          <p>Google Vision vs Naver Clova</p>
        </div>
      </div>

      <div class="header-actions">
        <button
          class="btn-primary"
          :disabled="!store.selectedImage || store.uploading"
          @click="handleProcess"
        >
          <span v-if="store.uploading" class="loader"></span>
          <span>{{ store.uploading ? 'Analyzing...' : 'Start Analysis' }}</span>
        </button>
      </div>
    </header>

    <main class="dashboard-grid">
      <!-- Top Section: Upload and Metrics -->
      <section class="top-section animate-fade-in" style="animation-delay: 0.1s">
        <div class="upload-container">
          <UploadZone />
        </div>

        <div class="metrics-sidebar">
          <MetricWidget label="CER" :value="store.metrics.cer" unit="%" color="#fbbf24">
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
            </template>
          </MetricWidget>

          <MetricWidget label="WER" :value="store.metrics.wer" unit="%" color="#f87171">
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 18h12" />
              </svg>
            </template>
          </MetricWidget>

          <MetricWidget label="Accuracy" value="98.2" unit="%" color="#34d399">
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </template>
          </MetricWidget>
        </div>
      </section>

      <!-- Results Comparison Section -->
      <section class="results-section animate-fade-in" style="animation-delay: 0.2s">
        <div class="results-grid">
          <ResultCard
            name="Google Vision"
            :speed="store.metrics.googleSpeed"
            :text="store.results.google?.text"
            :loading="store.uploading"
          />
          <ResultCard
            name="Naver Clova"
            :speed="store.metrics.naverSpeed"
            :text="store.results.naver?.text"
            :loading="store.uploading"
          />
        </div>
      </section>
    </main>

    <footer class="app-footer">
      <p>&copy; 2026 OCR Performance Comparison Tool. Built for KTB Final Project.</p>
    </footer>
  </div>
</template>

<style>
@import './styles/main.css';

.app-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--panel-border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-box {
  width: 48px;
  height: 48px;
  background: var(--accent-gradient);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(56, 189, 248, 0.4);
}

.logo-icon {
  color: white;
}

.brand-text h1 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.brand-text p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Button Styling */
.btn-primary {
  background: var(--accent-gradient);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(56, 189, 248, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.top-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.metrics-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.app-footer {
  margin-top: 4rem;
  padding: 2rem 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.85rem;
  border-top: 1px solid var(--panel-border);
}

/* Loader */
.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .top-section {
    grid-template-columns: 1fr;
  }

  .metrics-sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .metrics-sidebar > * {
    flex: 1;
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
