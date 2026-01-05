import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useImage } from '../context/ImageContext';
import { canvasToBase64 } from '../utils/imageUtils';
import './ConfirmPage.css';

const ConfirmPage = () => {
  const navigate = useNavigate();
  const { imageBase64, setImageBase64, setExtractedText, apiUrl } = useImage();
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageBase64) {
      navigate('/');
    }
  }, [imageBase64, navigate]);

  const getCroppedImg = (): string | null => {
    const image = imgRef.current;
    const canvas = canvasRef.current;

    if (!image || !canvas) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (completedCrop) {
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );
    } else {
      canvas.width = image.naturalWidth * scale;
      canvas.height = image.naturalHeight * scale;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    return canvasToBase64(canvas);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);

    const processedImage = getCroppedImg();
    const finalImage = processedImage || imageBase64;

    if (processedImage) {
      setImageBase64(processedImage);
    }

    try {
      const response = await fetch(`${apiUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'Extract text from image',
            },
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: finalImage,
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const extractedText = data.choices[0]?.message?.content || 'No text extracted';
      setExtractedText(extractedText);
      navigate('/result');
    } catch (error) {
      console.error('Error processing image:', error);
      navigate('/error', {
        state: {
          errorMessage: `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCropResize = () => {
    const processedImage = getCroppedImg();
    if (processedImage) {
      setImageBase64(processedImage);
      setCrop(undefined);
      setCompletedCrop(undefined);
      setScale(1);
    }
  };

  const handleReset = () => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
  };

  if (!imageBase64) {
    return null;
  }

  return (
    <div className="confirm-page">
      <div className="confirm-container">
        <h1>Confirm and Edit Image</h1>

        <div className="image-controls">
          <div className="control-group">
            <label htmlFor="scale">Scale: {scale.toFixed(2)}x</label>
            <input
              id="scale"
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </div>
          <div className="button-controls">
            <button onClick={handleApplyCropResize} className="apply-btn">
              Apply Crop/Resize
            </button>
            <button onClick={handleReset} className="reset-btn">
              Reset
            </button>
          </div>
        </div>

        <div className="image-container">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img
              ref={imgRef}
              src={imageBase64}
              alt="Upload preview"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            />
          </ReactCrop>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="button-group">
          <button onClick={() => navigate('/')} disabled={isProcessing}>
            Back
          </button>
          <button onClick={handleConfirm} disabled={isProcessing} className="confirm-btn">
            {isProcessing ? 'Processing...' : 'Confirm & Extract Text'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPage;
