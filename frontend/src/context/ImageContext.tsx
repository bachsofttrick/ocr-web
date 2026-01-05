/**
 * ImageContext.tsx
 *
 * Global state management for the OCR app. Shares data across pages without prop drilling.
 * Flow: UploadPage (upload image + set API URL) → ConfirmPage (edit & process) → ResultPage (view results)
 */

import { createContext, useContext, useState, ReactNode } from 'react';
import config from '../../config.json';

// Define the shape of our shared state
interface ImageContextType {
  imageBase64: string;        // Base64-encoded image
  setImageBase64: (base64: string) => void;
  extractedText: string;      // OCR results from API
  setExtractedText: (text: string) => void;
  apiUrl: string;             // OCR API endpoint URL
  setApiUrl: (url: string) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

// Provider component - wraps the app in App.tsx to share state with all pages
export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [imageBase64, setImageBase64] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>(config.apiUrl);

  return (
    <ImageContext.Provider
      value={{
        imageBase64,
        setImageBase64,
        extractedText,
        setExtractedText,
        apiUrl,
        setApiUrl,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

// Custom hook to access the context. Usage: const { imageBase64, setImageBase64 } = useImage();
export const useImage = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};
