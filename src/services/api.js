import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_OCR_BACKEND_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export const ocrService = {
  async compare(file) {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/compare', formData)
  },

  async googleVision(file) {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/google-vision', formData)
  },

  async naverClova(file) {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/naver-clova', formData)
  },
}

export default api
