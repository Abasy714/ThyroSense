import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Navbar from './components/Navbar'
import ThemeSwitcher from './components/ThemeSwitcher'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientApp from './pages/PatientApp'
import PatientHome from './patient/PatientHome'
import PredictionForm from './patient/PredictionForm'
import PredictionResult from './patient/PredictionResult'
import PatientHistory from './patient/PatientHistory'
import PatientProfile from './patient/PatientProfile'
import DoctorApp from './doctor/DoctorApp'
import DoctorHome from './doctor/DoctorHome'
import PatientList from './doctor/PatientList'
import PatientDetail from './doctor/PatientDetail'
import DoctorProfile from './doctor/DoctorProfile'

function RequireAuth({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { pathname } = useLocation()
  const hideNavbar = pathname.startsWith('/patient') || pathname.startsWith('/doctor')

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/patient"
          element={
            <RequireAuth role="patient">
              <PatientApp />
            </RequireAuth>
          }
        >
          <Route index element={<PatientHome />} />
          <Route path="predict" element={<PredictionForm />} />
          <Route path="result" element={<PredictionResult />} />
          <Route path="history" element={<PatientHistory />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>
        <Route
          path="/doctor"
          element={
            <RequireAuth role="doctor">
              <DoctorApp />
            </RequireAuth>
          }
        >
          <Route index element={<DoctorHome />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ThemeSwitcher />
    </>
  )
}
