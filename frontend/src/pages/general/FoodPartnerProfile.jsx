import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/api";

const FoodPartnerProfile = () => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(
          "/auth/food-partner/profile",
          { withCredentials: true }
        );
        setPartner(res.data.foodPartner);
      } catch (err) {
        console.error(err);
        toast.error("Please login first");
        navigate("/food-partner/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await API.get("/auth/food-partner/logout", {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
      navigate("/food-partner/login");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!partner) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {partner.businessName} Profile
      </h1>

      <p><b>Contact Name:</b> {partner.contactName}</p>
      <p><b>Email:</b> {partner.email}</p>
      <p><b>Phone:</b> {partner.phone}</p>
      <p><b>Address:</b> {partner.address}</p>
      <p><b>Cuisine:</b> {partner.cuisine.join(", ") || "N/A"}</p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default FoodPartnerProfile;
