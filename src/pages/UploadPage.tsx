import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImage } from '../context/ImageContext';
import { fileToBase64 } from '../utils/imageUtils';
import './UploadPage.css';

const UploadPage = () => {
  const navigate = useNavigate();
  const { setImageBase64, apiUrl, setApiUrl } = useImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setImageBase64(base64);
        navigate('/confirm');
      } catch (error) {
        console.error('Error converting file to base64:', error);
        navigate('/error', {
          state: {
            errorMessage: 'Failed to process image. Please try again.',
          },
        });
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>OCR Image Upload</h1>

        <div className="api-url-input">
          <label htmlFor="apiUrl">API URL:</label>
          <input
            id="apiUrl"
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:8033"
          />
        </div>

        <div className="upload-icon-container" onClick={handleUploadClick}>
          <svg
            className="upload-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p>Click to upload an image</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default UploadPage;
