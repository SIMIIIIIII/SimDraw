import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from "./components/Header/Header";

const Home = lazy(() => import('./Page/Home/Home'));

const AppContent = () => {
  //const { user } = useAuth();

  return (
    <BrowserRouter>
      <Header />

      <Suspense fallback={<div>Chargement...</div>}>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
