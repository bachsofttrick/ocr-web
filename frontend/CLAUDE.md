# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based OCR (Optical Character Recognition) web frontend that allows users to upload images, edit them (crop/resize), and extract text using a backend OCR API. The application sends images as base64-encoded data to an OpenAI-compatible chat completions endpoint.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview

# Lint TypeScript/TSX files
npm run lint
```

## Architecture

### State Management

The application uses React Context (`ImageContext`) for global state management. This context manages:
- `imageBase64`: The current image as a base64 string
- `extractedText`: OCR results from the API
- `apiUrl`: The backend API URL (loaded from `config.json`, defaults to `http://localhost:8033`)

All pages that need access to this state use the `useImage()` hook.

### Application Flow

1. **UploadPage** (`/`): User uploads an image, which is immediately converted to base64 in the browser
2. **ConfirmPage** (`/confirm`):
   - User can crop the image using `react-image-crop`
   - User can scale/resize the image (0.1x to 2x)
   - Image processing happens on an HTML5 canvas
   - On confirmation, sends POST request to `${apiUrl}/v1/chat/completions`
   - Navigates to result page on success or error page on failure
3. **ResultPage** (`/result`): Displays the processed image alongside extracted text
4. **ErrorPage** (`/error`): Shows error messages when API calls fail

### API Integration

The app communicates with an OpenAI-compatible API endpoint:

**Endpoint**: `POST ${apiUrl}/v1/chat/completions`

**Request format**:
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

**Expected response**:
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

The extracted text is read from `choices[0].message.content`.

### Configuration

- **API URL**: Configured in `config.json` at the project root (not in `src/`)
- The config is imported directly in `ImageContext.tsx` using `import config from '../../config.json'`
- Current default: `http://localhost:8033`

### Image Processing

Image manipulation (crop/resize) is handled client-side using:
- `react-image-crop` library for the cropping UI
- HTML5 Canvas API for applying transformations
- Utility function `canvasToBase64()` in `src/utils/imageUtils.ts` for converting canvas to base64

The workflow is:
1. Original image displayed in ReactCrop component
2. User adjusts crop area or scale slider
3. On "Apply Crop/Resize", the transformations are rendered to a hidden canvas
4. Canvas is converted to base64 and updates the context state
5. On "Confirm", the final image (cropped/scaled or original) is sent to the API

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for client-side routing
- **react-image-crop** for image cropping functionality
- **ESLint** with TypeScript rules for linting

## Important Notes

- All image processing happens in the browser - no images are uploaded to a server directly
- Images are stored in React state as base64 strings, which can be memory-intensive for large images
- The app assumes the backend follows the OpenAI chat completions API format
- Navigation guards are in place (e.g., ConfirmPage redirects to upload if no image is present)
