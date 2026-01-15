# OCR Test Frontend 🚀

Modern Vue 3 dashboard for comparing Google Vision and Naver Clova OCR performance.

## 🛠 Features

- **Modern UI**: Dark mode, Glassmorphism, Responsive design.
- **Real-time Analysis**: Compare OCR results side-by-side.
- **Performance Metrics**: CER, WER, and Processing time visualization.
- **API Integration**: Ready to connect with the FastAPI OCR backend.

## 🚀 Getting Started

### 1. Installation

```sh
npm install
```

### 2. Configuration

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Development

```sh
npm run dev
```

### 4. Build

```sh
npm run build
```

## 📂 Project Structure

- `src/assets`: Place your PNG images here.
- `src/components`: UI and OCR-specific components.
- `src/stores`: State management via Pinia.
- `src/services`: API communication layer.

## 📸 Assets

The project is configured to include all assets from `src/assets` and `public/assets` in the build.

- Move your images to `src/assets/images/` for Vite processing.
- Move static files to `public/assets/images/` to copy them as-is.
