import { useState } from "react";
import UserRegister from "./UserRegister";
import FoodPartnerRegister from "./FoodPartnerRegister";
import { Link } from "react-router-dom";

export default function Register() {
  const [mode, setMode] = useState("user"); // user | partner

  return (
    <div className="w-full max-w-5xl mx-auto mt-14 grid grid-cols-1 md:grid-cols-2 rounded-3xl shadow-xl overflow-hidden border border-gray-200">
      {/* Left Section */}
      <div className="hidden md:flex flex-col items-center justify-center relative">
        <img
          src="https://i.pinimg.com/736x/3a/85/36/3a8536a9f83b6b59a9d9c5e4a32ab2c1.jpg"
          alt="Food background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-yellow-600/60"></div>
        <div className="relative z-10 p-8 text-center text-white space-y-4">
          <h2 className="text-4xl font-bold">BUN VENIT!</h2>
          <p className="text-white/90 text-lg">
            {mode === "user"
              ? "Register as a foodie 🍴"
              : "Register as a food partner 🏪"}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col gap-4 p-10 bg-white/95 backdrop-blur-md">
        {/* Toggle */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setMode("user")}
            className={`flex-1 py-2 text-center font-medium ${
              mode === "user"
                ? "border-b-2 border-yellow-500 text-yellow-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            User Register
          </button>
          <button
            type="button"
            onClick={() => setMode("partner")}
            className={`flex-1 py-2 text-center font-medium ${
              mode === "partner"
                ? "border-b-2 border-yellow-500 text-yellow-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Food Partner Register
          </button>
        </div>

        

        {/* Conditional Render */}
        {mode === "user" ? <UserRegister/> : <FoodPartnerRegister />}
<p className="text-sm text-center text-gray-600 mt-4">
  Already have an account?{" "}
  {mode === "user" ? (
    <Link
      to="/user/login"
      className="text-yellow-600 font-medium hover:underline"
    >
      Login as User
    </Link>
  ) : (
    <Link
      to="/food-partner/login"
      className="text-yellow-600 font-medium hover:underline"
    >
      Login as Partner
    </Link>
  )}
</p>
      </div>


    </div>
  );
}
