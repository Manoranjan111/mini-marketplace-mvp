import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Home from "./pages/home";
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import Cart from './pages/cart';
import ProfilePage from './pages/profile';

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
            path="/signup"
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <SignupPage />
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/profile"
            element={
              isLoggedIn ? <ProfilePage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/"
            element={<Home />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  )

}

export default App
