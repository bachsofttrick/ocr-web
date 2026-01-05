import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.errorMessage || 'An unknown error occurred';

  useEffect(() => {
    if (!location.state?.errorMessage) {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1>Error</h1>
        <p className="error-message">{errorMessage}</p>
        <button onClick={handleReturnHome} className="return-home-btn">
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
