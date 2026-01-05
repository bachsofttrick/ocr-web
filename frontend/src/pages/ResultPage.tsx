import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImage } from '../context/ImageContext';
import './ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const { imageBase64, extractedText } = useImage();

  useEffect(() => {
    if (!imageBase64 || !extractedText) {
      navigate('/');
    }
  }, [imageBase64, extractedText, navigate]);

  const handleNewImage = () => {
    navigate('/');
  };

  if (!imageBase64 || !extractedText) {
    return null;
  }

  return (
    <div className="result-page">
      <div className="result-container">
        <h1>Extracted Text</h1>

        <div className="result-content">
          <div className="image-preview">
            <h2>Original Image</h2>
            <img src={imageBase64} alt="Processed" />
          </div>

          <div className="text-result">
            <h2>Extracted Text</h2>
            <textarea
              value={extractedText}
              readOnly
              rows={15}
            />
          </div>
        </div>

        <div className="button-group">
          <button onClick={handleNewImage} className="new-image-btn">
            Process New Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
