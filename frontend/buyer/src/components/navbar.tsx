import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { logout } from "@/services";
import { toast } from "react-toastify";

function Navbar() {
  const [cart, setCart] = useState<any[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!Cookies.get('refresh_token') || !!localStorage.getItem("refresh_token");
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart-item") || "[]")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(storedCart)
  }, [])

  const handleLogout = async () => {
    try {
      const res = await logout();
      console.log(res)
      if (!res.success) {
        toast.error(res.message || "Error while logging out");
        return;
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      toast.success(res.message || "Logged out successfully");
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message;
      console.error("Error while logging out", errorMessage);
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow">
      <h1
        className="font-bold text-lg cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        Mini Marketplace MVP
      </h1>
      <div className="flex items-center gap-3">

        {isLoggedIn ? (
          <>
            <span className="hidden sm:block">
              {localStorage.getItem("username")}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
          >
            Login
          </button>
        )}

        {/* CART */}
        <button
          onClick={() => (window.location.href = "/cart")}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
        >
          Cart ({cart?.length})
        </button>

      </div>
    </div>
  );
}

export default Navbar;