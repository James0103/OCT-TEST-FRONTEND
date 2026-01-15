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
  }),

  actions: {
    setImage(file) {
      this.selectedImage = file
      if (this.imagePreview) URL.revokeObjectURL(this.imagePreview)
      this.imagePreview = URL.createObjectURL(file)
      this.resetResults()
    },

    resetResults() {
      this.results = { google: null, naver: null, comparison: null }
      this.error = null
    },

    async processOcr() {
      if (!this.selectedImage) return

      this.uploading = true
      this.error = null

      try {
        const response = await ocrService.compare(this.selectedImage)
        const data = response.data

        // Map backend response to store state
        // Assuming backend structure matches the API schema
        this.results.google = { text: data.google_vision?.text || '' }
        this.results.naver = { text: data.naver_clova?.text || '' }

        if (data.metrics) {
          this.metrics.googleSpeed = data.metrics.google_time || 0
          this.metrics.naverSpeed = data.metrics.naver_time || 0
          this.metrics.cer = data.metrics.cer || 0
          this.metrics.wer = data.metrics.wer || 0
        }
      } catch (err) {
        this.error = 'Failed to process OCR. Please check if backend is running.'
        console.error(err)
      } finally {
        this.uploading = false
      }
    },
  },
})
