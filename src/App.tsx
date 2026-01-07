import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ImageProvider } from './context/ImageContext'
import UploadPage from './pages/UploadPage'
import ConfirmPage from './pages/ConfirmPage'
import ResultPage from './pages/ResultPage'
import ErrorPage from './pages/ErrorPage'
import './App.css'

function App() {
  return (
    <ImageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/confirm" element={<ConfirmPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Router>
    </ImageProvider>
  )
}

export default App
