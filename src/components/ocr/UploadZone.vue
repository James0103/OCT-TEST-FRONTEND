<template>
  <div
    class="upload-zone"
    :class="{ dragging: isDragging, 'has-file': store.imagePreview || store.batchFiles.length > 0 }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="$refs.fileInput.click()"
  >
    <input
      type="file"
      ref="fileInput"
      class="hidden-input"
      accept="image/*"
      multiple
      @change="handleFileChange"
    />

    <div v-if="!store.imagePreview && store.batchFiles.length === 0" class="empty-state">
      <div class="upload-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <p class="upload-text">Drag & drop receipts here</p>
      <span class="upload-hint">or click to browse multiple files</span>
    </div>

    <div v-else-if="store.batchFiles.length > 1" class="batch-state">
      <div class="batch-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <path d="M7 7h10" />
          <path d="M7 12h10" />
          <path d="M7 17h10" />
        </svg>
      </div>
      <p class="upload-text">{{ store.batchFiles.length }} files selected</p>
      <span class="upload-hint">Click to change selection</span>
    </div>

    <div v-else class="preview-state">
      <img :src="store.imagePreview" alt="Receipt Preview" class="preview-img" />
      <div class="preview-overlay">
        <p>Change Image</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useOcrStore } from '@/stores/ocr'

const store = useOcrStore()
const isDragging = ref(false)
const fileInput = ref(null)

const handleDrop = (e) => {
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 1) {
    store.setBatchFiles(files)
  } else if (files.length === 1 && files[0].type.startsWith('image/')) {
    store.setImage(files[0])
  }
}

const handleFileChange = (e) => {
  const files = e.target.files
  if (files.length > 1) {
    store.setBatchFiles(files)
  } else if (files.length === 1) {
    store.setImage(files[0])
  }
}
</script>

<style scoped>
.upload-zone {
  width: 100%;
  height: 300px;
  border: 2px dashed var(--panel-border);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  transition: var(--transition-normal);
  background: rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;
}

.upload-zone:hover,
.dragging {
  border-color: var(--accent-primary);
  background: rgba(56, 189, 248, 0.05);
}

.hidden-input {
  display: none;
}

.empty-state,
.batch-state {
  text-align: center;
  color: var(--text-secondary);
}

.upload-icon,
.batch-icon {
  margin-bottom: 1rem;
  color: var(--text-secondary);
  transition: var(--transition-normal);
}

.upload-zone:hover .upload-icon,
.upload-zone:hover .batch-icon {
  color: var(--accent-primary);
  transform: translateY(-5px);
}

.upload-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.upload-hint {
  font-size: 0.9rem;
}

.preview-state {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition-fast);
  color: white;
  font-weight: 600;
}

.upload-zone:hover .preview-overlay {
  opacity: 1;
}
</style>
