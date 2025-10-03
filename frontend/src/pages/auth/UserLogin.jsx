// src/pages/LoginPage.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/api"; // your axios instance with baseURL and withCredentials

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("user"); // 'user' or 'food-partner'
  const { register, handleSubmit, reset } = useForm();

  const LoginHandler = async (data) => {
    try {
      // Use API instance instead of hardcoded URLs
      const endpoint =
        loginType === "food-partner"
          ? "/auth/food-partner/login"
          : "/auth/user/login";

      const response = await API.post(endpoint, data); // sends cookies automatically

      toast.success("Login successful! 🎉");
       window.location.href = "/"; 
      reset();

      // Redirect
      if (loginType === "food-partner") {
        toast.success("Login successful! 🎉");
       window.location.href = "/"; 

        navigate("/create-food");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/0b8301e05875377ef712b261f79cb418.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen w-full flex items-center justify-center"
    >
      <div className="w-[90%] max-w-sm h-auto flex flex-col items-center">
        <div className="w-full z-50 rounded-t-3xl p-8 pb-32 text-white relative shadow-lg">
          <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 w-[90%] mx-auto bg-[#F5F5F5] rounded-3xl p-6 shadow-xl">
            {/* Toggle Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded-full font-semibold ${
                  loginType === "user" ? "bg-[#80D8C3] text-white" : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setLoginType("user")}
              >
                User
              </button>
              <button
                className={`px-4 py-2 rounded-full font-semibold ${
                  loginType === "food-partner" ? "bg-[#80D8C3] text-white" : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setLoginType("food-partner")}
              >
                Food Partner
              </button>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {loginType === "food-partner" ? "Food Partner Login" : "Login"}
            </h2>

            <form onSubmit={handleSubmit(LoginHandler)} className="flex flex-col gap-4">
              {/* Email */}
              <div className="relative">
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#80D8C3] placeholder-gray-400 pl-12 text-gray-700"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#80D8C3] placeholder-gray-400 pl-12 text-gray-700"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
              </div>

              <div className="text-right mt-1 mb-4">
                <a href="#" className="text-xs text-gray-400 hover:text-[#80D8C3] font-medium">
                  Forgot Password
                </a>
              </div>

              <button
                type="submit"
                className="bg-[#80D8C3] text-white p-4 rounded-xl font-semibold text-lg hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-md"
              >
                Login
              </button>
            </form>

            <div className="flex items-center justify-center my-6">
              <hr className="flex-grow border-t border-gray-200" />
              <span className="text-sm text-gray-400 mx-3">Or login with</span>
              <hr className="flex-grow border-t border-gray-200" />
            </div>

            <div className="text-center text-sm">
              Don’t have an account?{" "}
              <Link to="/user/register" className="text-[#80D8C3] font-bold hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <div className="h-64"></div>
      </div>
    </div>
  );
};

export default LoginPage;
