import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const API = import.meta.env.VITE_API_BASE;
        
        const res = await fetch(`${API}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  return { isAuthenticated, loading };
};

export default useAuth;
