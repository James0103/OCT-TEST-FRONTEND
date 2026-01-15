import { defineStore } from 'pinia'
import { ocrService } from '@/services/api'

export const useOcrStore = defineStore('ocr', {
  state: () => ({
    uploading: false,
    selectedImage: null,
    imagePreview: null,
    results: {
      google: null,
      naver: null,
      comparison: null,
    },
    metrics: {
      googleSpeed: 0,
      naverSpeed: 0,
      cer: 0,
      wer: 0,
    },
    error: null,

    // Batch Processing State
    batchFiles: [],
    batchResults: [],
    batchProgress: 0,
    isProcessingBatch: false,
    batchCurrentIndex: -1,

    // Logging State
    logs: [],
  }),

  actions: {
    addLog(message, type = 'info') {
      const timestamp = new Date().toLocaleTimeString([], {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      this.logs.unshift({ timestamp, message, type })
    },

    clearLogs() {
      this.logs = []
    },

    setImage(file) {
      this.selectedImage = file
      if (this.imagePreview) URL.revokeObjectURL(this.imagePreview)
      this.imagePreview = URL.createObjectURL(file)
      this.batchFiles = []
      this.addLog(`Selected image: ${file.name}`)
      this.resetResults()
    },

    setBatchFiles(files) {
      this.batchFiles = Array.from(files)
      this.selectedImage = null
      this.imagePreview = null
      this.addLog(`${files.length} files selected for batch analysis`)
      this.batchResults = []
      this.batchProgress = 0
    },

    resetResults() {
      this.results = { google: null, naver: null, comparison: null }
      this.error = null
    },

    async processOcr(saveToSheet = false, sheetName = 'OCR Result') {
      if (!this.selectedImage) return

      this.uploading = true
      this.error = null
      this.addLog(
        `Starting single analysis for ${this.selectedImage.name}${saveToSheet ? ` (Saving to ${sheetName})` : ''}...`,
      )

      try {
        const response = await ocrService.compare(this.selectedImage, saveToSheet, sheetName)
        this.updateCurrentResults(response.data)
        this.addLog(
          `Analysis complete. Time: ${response.data.comparison?.processing_time_comparison?.google_vision?.toFixed(0)}ms (G) / ${response.data.comparison?.processing_time_comparison?.naver_clova?.toFixed(0)}ms (N)`,
          'success',
        )
      } catch (err) {
        this.error = 'Failed to process OCR.'
        this.addLog(`Error: ${err.message}`, 'error')
      } finally {
        this.uploading = false
      }
    },

    async processBatch(saveToSheet = false, sheetName = 'Batch OCR') {
      const filesToProcess =
        this.batchFiles.length > 0
          ? this.batchFiles
          : this.selectedImage
            ? [this.selectedImage]
            : []
      if (filesToProcess.length === 0) return

      this.isProcessingBatch = true
      this.batchResults = []
      this.batchProgress = 0
      this.addLog(`Starting batch process for ${filesToProcess.length} files...`)

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i]
        this.batchCurrentIndex = i
        this.addLog(`Analyzing [${i + 1}/${filesToProcess.length}] ${file.name}...`)

        try {
          const response = await ocrService.compare(file, saveToSheet, sheetName)
          const result = {
            fileName: file.name,
            data: response.data,
            success: true,
          }
          this.batchResults.push(result)
          this.addLog(
            `✔ Finished ${file.name}: ${response.data.comparison?.similarity_score}% similarity`,
            'success',
          )

          if (i === 0 || i === filesToProcess.length - 1) {
            this.updateCurrentResults(response.data)
          }
        } catch (err) {
          this.addLog(`✘ Failed ${file.name}: ${err.message}`, 'error')
          this.batchResults.push({
            fileName: file.name,
            error: err.message,
            success: false,
          })
        } finally {
          this.batchProgress = Math.round(((i + 1) / filesToProcess.length) * 100)
        }
      }

      this.addLog(`Batch analysis finished. Total files: ${filesToProcess.length}`, 'info')
      this.isProcessingBatch = false
      this.batchCurrentIndex = -1
    },

    async processPreincludedAssets(saveToSheet = false, sheetName = 'Preincluded Batch') {
      this.addLog('Initializing analysis for 50 pre-included assets...')
      this.isProcessingBatch = true
      this.batchProgress = 0

      const assetNames = []
      // Normal images 1-25
      for (let i = 1; i <= 25; i++) assetNames.push(`${i}.png`)
      // Mobile images m_1-m_25
      for (let i = 1; i <= 25; i++) assetNames.push(`m_${i}.png`)

      this.batchResults = []

      for (let i = 0; i < assetNames.length; i++) {
        const name = assetNames[i]
        const url = `/assets/images/${name}`
        this.batchCurrentIndex = i
        this.addLog(`Fetching and analyzing asset [${i + 1}/50]: ${name}...`)

        try {
          const response = await fetch(url)
          const blob = await response.blob()
          const file = new File([blob], name, { type: 'image/png' })

          const ocrResponse = await ocrService.compare(file, saveToSheet, sheetName)
          this.batchResults.push({
            fileName: name,
            data: ocrResponse.data,
            success: true,
          })
          this.addLog(`✔ Finished ${name}`, 'success')
          this.updateCurrentResults(ocrResponse.data)
        } catch (err) {
          this.addLog(`✘ Error processing ${name}: ${err.message}`, 'error')
        } finally {
          this.batchProgress = Math.round(((i + 1) / assetNames.length) * 100)
        }
      }

      this.addLog('All pre-included assets processed.', 'info')
      this.isProcessingBatch = false
    },

    updateCurrentResults(data) {
      this.results.google = { text: data.google_vision?.full_text || '' }
      this.results.naver = { text: data.naver_clova?.full_text || '' }

      if (data.comparison) {
        this.results.comparison = data.comparison
        this.metrics.googleSpeed = data.google_vision?.process_time || 0
        this.metrics.naverSpeed = data.naver_clova?.process_time || 0
        this.metrics.cer = data.comparison.similarity_score
          ? (100 - data.comparison.similarity_score).toFixed(2)
          : 0
      }
    },
  },
})
