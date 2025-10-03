import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children, type = "user" }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url =
          type === "food-partner"
            ? "http://localhost:3000/api/auth/food-partner/profile"
            : "http://localhost:3000/api/auth/user/profile";

      console.log("URL being called:", url);

        const res = await axios.get(url, { withCredentials: true });
        setAuth(res.data); // ya res.data.user / res.data.foodPartner
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err.response?.data || err);
        setAuth(false);
        setLoading(false);
      }
    };
    checkAuth();
  }, [type]);

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to={type === "user" ? "/user/login" : "/food-partner/login"} />;
  return children;
};

export default PrivateRoute;
