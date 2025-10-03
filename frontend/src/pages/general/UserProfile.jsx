import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    userName: "",
  });

  const navigate = useNavigate();

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/user/profile", { withCredentials: true });
        const u = res.data.user;
        setUser(u);
        setForm({
  firstName: u.fullName?.firstName || "",
  lastName: u.fullName?.lastName || "",
  email: u.email || "",
  mobile: u.mobile || "",
  userName: u.userName || "",
});
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Please login first");
        navigate("/user/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleUpdate = async () => {
    try {
      const res = await axios.put("http://localhost:3000/api/auth/user/update", form, { withCredentials: true });
      setUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/user/logout", { withCredentials: true });
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block font-semibold mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block font-semibold mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block font-semibold mb-1">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block font-semibold mb-1">Username</label>
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
