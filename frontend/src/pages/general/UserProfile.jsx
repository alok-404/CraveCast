import React, { useEffect, useState } from "react";
// import axios from "axios"; // Not used directly, relying on API instance
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Smartphone, AtSign, Save, LogOut, Loader2 } from "lucide-react"; // 💡 Added Lucide Icons
import API from "../../api/api";

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

  // LOGIC UNTOUCHED: Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/user/profile", { withCredentials: true });
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

  // LOGIC UNTOUCHED: Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // LOGIC UNTOUCHED: Handle profile update
  const handleUpdate = async () => {
    try {
      const res = await API.put("/auth/user/update", form, { withCredentials: true });
      setUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // LOGIC UNTOUCHED: Handle logout
  const handleLogout = async () => {
    try {
      await API.get("/auth/user/logout", { withCredentials: true });
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  if (loading) 
    // 💡 Enhanced Loading State
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-3 text-lg text-gray-700">Loading profile...</p>
      </div>
    );

  return (
    // 💡 Main Container: Centered, wider max-width on larger screens, subtle border and background
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-blue-500/10 rounded-full mb-4">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Your Profile</h1>
          <p className="text-gray-500 mt-2">Update your personal details and preferences.</p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. First Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 mr-2" /> First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* 2. Last Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 mr-2" /> Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* 3. Email */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 mr-2" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* 4. Mobile */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Smartphone className="w-4 h-4 mr-2" /> Mobile
            </label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* 5. Username (Full width for emphasis) */}
          <div className="md:col-span-2">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <AtSign className="w-4 h-4 mr-2" /> Username
            </label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="Choose a unique username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10 border-t pt-6">
          {/* Save Button */}
          <button
            onClick={handleUpdate}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-[1.01]"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 bg-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition transform hover:scale-[1.01]"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;