# OCR Web Frontend

A React-based web application for extracting text from images using OCR (Optical Character Recognition).

## Features

- **Image Upload**: Upload images through a user-friendly interface
- **Image Editing**: Crop and resize images before processing
- **OCR Processing**: Extract text from images using a backend API
- **Results Display**: View extracted text alongside the processed image

## Tech Stack

- React 18
- TypeScript
- React Router for navigation
- React Image Crop for image manipulation
- Vite for fast development and building

## Getting Started

### Prerequisites

- Node.js (v21.7.3 or compatible)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Application Flow

1. **Upload Page** (`/`): Select an image to upload. The image is converted to base64 on the client side.
2. **Confirm Page** (`/confirm`):
   - Preview the uploaded image
   - Crop or resize the image as needed
   - Configure the API endpoint URL
   - Send the image to the OCR API
3. **Result Page** (`/result`): View the extracted text alongside the processed image

## API Configuration

The default API URL is configured in `config.json` in the root directory:

```json
{
  "apiUrl": "http://localhost:8000"
}
```

You can change this value to point to your OCR API server. The URL can also be modified in the UI on the Confirm page.

The application sends POST requests to `/v1/chat/completions` endpoint with the following format:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "Extract text from image"
    },
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "<base64-encoded-image>"
          }
        }
      ]
    }
  ]
}
```

Expected response format:

```json
{
  "choices": [
    {
      "message": {
        "content": "Extracted text here..."
      }
    }
  ]
}
```

## Project Structure

```
src/
├── components/          # Reusable React components
├── context/            # React context for state management
│   └── ImageContext.tsx
├── pages/              # Page components
│   ├── UploadPage.tsx
│   ├── ConfirmPage.tsx
│   └── ResultPage.tsx
├── utils/              # Utility functions
│   └── imageUtils.ts
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```
