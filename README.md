# Medical Detection App

A cross-platform **React Native (Expo)** mobile app for identifying medical pills from a photo. It's the mobile companion to the **Pill Identification System** backend — snap or upload a pill image, and the app reads the imprint (OCR), detects the color and shape (HSV recognition), lets you adjust the results, and matches against a drug database to return the most likely medications with their indications, precautions, and side effects.

> **Part of a full-stack project:** this mobile app + the **[Pill Identification System backend](https://github.com/Rushikesh-Sontakke/Pill_Identification_Deep_Learning)** (Python/Flask · YOLO · OCR · HSV).
> 🔗 **Live backend demo:** https://rushijain-pill-identification.hf.space

## Features

- 📷 **Capture or upload** — take a photo with the camera or pick one from the gallery
- 🔤 **OCR imprint reading** — the pill's printed code is read server-side
- 🎨 **HSV color & shape recognition** — auto-detected and pre-filled
- ✏️ **Editable results** — adjust the imprint, colors, and shape before matching
- 💊 **Drug matching** — returns ranked medications with indications, precautions, and side effects
- 🌐 **English UI** with a clean, medical-themed design

## How It Works

```
   Camera / Gallery
          │  (image → base64)
          ▼
   POST /upload  ──►  backend: YOLO detect + OCR + HSV color/shape
          │  ◄── imprint text, colors, shape, cropped image
          ▼
   Review & edit (imprint / color / shape)
          │
          ▼
   POST /match   ──►  backend: match against drug database
          │  ◄── ranked medications + drug info
          ▼
   Results modal
```

The networking lives in [`services/api.ts`](services/api.ts) (`uploadImage`, `matchPill`).

> **Note on language:** the UI is fully English, but the color/shape **values** sent to the backend are kept in the original Chinese (e.g. `白色`, `圓形`) because the drug database matches on them. The pickers display English labels and submit Chinese values transparently.

## Tech Stack

Expo SDK 54 · React Native 0.81 · React 19 · TypeScript · expo-router (file-based routing) · expo-camera · expo-image-picker · react-native-paper · react-native-modal · axios

## Project Structure

```
.
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # main screen: capture, edit, match
│   │   └── _layout.tsx      # tab navigation
│   ├── _layout.tsx          # root layout
│   └── modal.tsx
├── components/
│   ├── ColorPicker.tsx      # color dropdown (EN label / 中文 value)
│   ├── ShapePicker.tsx      # shape dropdown (EN label / 中文 value)
│   └── ResultsModal.tsx     # drug results modal
├── services/
│   └── api.ts               # backend API calls + BASE_URL
├── constants/
└── app.json                 # Expo config
```

## Backend

The app talks to the **[Pill Identification System backend](https://github.com/Rushikesh-Sontakke/Pill_Identification_Deep_Learning)** (deployed on Hugging Face Spaces), configured in [`services/api.ts`](services/api.ts):

```ts
const BASE_URL = 'https://rushijain-pill-identification.hf.space';
```

Change this constant to point at a different deployment. The backend exposes `POST /upload` and `POST /match`.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo dev server
npx expo start
```

Then:
- Scan the QR code with the **Expo Go** app (iOS/Android), or
- Press `a` for Android emulator, `i` for iOS simulator, or `w` for web.

### Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run in the browser |
| `npm test` | Run tests (jest-expo) |

## Notes

- **Permissions:** the app requests camera and photo-library access on first launch.
- **Cold start:** the backend is hosted on a free tier that sleeps when idle, so the **first request after inactivity can take ~1–2 minutes** to wake up. Subsequent requests are fast.
- **Drug images:** thumbnail photos appear only if the backend has its image database enabled; the text drug info always works.
