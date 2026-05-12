import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InputForm from './pages/InputForm'
import ResultScreen from './pages/ResultScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputForm />} />
        <Route path="/result" element={<ResultScreen />} />
      </Routes>
    </BrowserRouter>
  )
}
