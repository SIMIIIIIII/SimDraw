import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from "./components/Header/Header";
import { useAuth } from "./context/AuthContext";

const Home = lazy(() => import('./Page/Home/Home'));
const Search = lazy(() => import('./Page/Search/Search'));
const DrawingsBy = lazy(() => import('./Page/DrawingsBy/DrawingsBy'));
const Connexion = lazy(() => import('./Page/Connexion/Connexion'));
const Subscription = lazy(() => import('./Page/Subscription/Subscription'));
const Account = lazy(() => import('./Page/Account/Account'));
const CreateDrawing = lazy(() => import('./Page/CreateDrawing/CreateDrawing'));
const Draw = lazy(() => import('./Page/Draw/Draw'));
const Theme = lazy(() => import('./Page/Theme/Theme'));
const DrawingDetails = lazy(() => import('./Page/DrawingDetails/DrawingDetails'));

const AppContent = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Header user={user}/>

      <Suspense fallback={<div>Chargement...</div>}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/search" element={<Search/>} />
          <Route path="/by" element={<DrawingsBy/>} />
          <Route path="/login" element={<Connexion/>} />
          <Route path="/subscription" element={<Subscription/>} />
          <Route path="/account" element={<Account/>} />
          <Route path="/drawing/create" element={<CreateDrawing/>} />
          <Route path="/draw" element={<Draw/>} />
          <Route path="/draw/:id" element={<Draw/>} />
          <Route path="/theme" element={<Theme/>} />
          <Route path="/drawing/:id" element={<DrawingDetails/>} />
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
