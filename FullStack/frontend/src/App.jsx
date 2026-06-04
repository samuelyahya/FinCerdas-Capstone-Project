import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute  from './components/ProtectedRoute';

import LandingPage   from './pages/LandingPage';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Dashboard     from './pages/Dashboard';
import InputData     from './pages/InputData';
import HasilAnalisis from './pages/HasilAnalisis';
import Rekomendasi   from './pages/Rekomendasi';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/input-data" element={
            <ProtectedRoute><InputData /></ProtectedRoute>
          } />
          <Route path="/hasil-analisis" element={
            <ProtectedRoute><HasilAnalisis /></ProtectedRoute>
          } />
          <Route path="/rekomendasi" element={
            <ProtectedRoute><Rekomendasi /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
