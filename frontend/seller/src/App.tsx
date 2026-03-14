import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Home from "./pages/home";
import LoginPage from "./pages/login";
import ProfilePage from './pages/profile';
import Orders from './pages/orders';
import Products from './pages/products';

function App() {
  const [isLoggedIn] = useState(() => {
    return !!Cookies.get('refresh_token');
  });

  return (
    <Router>
      <main>
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? <ProfilePage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/products"
            element={
              isLoggedIn ? <Products /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/orders"
            element={
              isLoggedIn ? <Orders /> : <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  )

}

export default App
