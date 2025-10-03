import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const { register, reset, handleSubmit } = useForm();

  

  const LoginHandler = async (FoodPartner) => {
    try {
      console.log("Submitted User:", FoodPartner);

      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/login",
        FoodPartner,
        { withCredentials: true }
      );

      toast.success("Login successful! 🎉");
      reset(); // form clear karne ke liye
      console.log("API Response:", response.data);

      navigate("/create-food"); // login ke baad home ya dashboard pe redirect
    } catch (error) {
      console.error("Error in login:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error("Login error details:", error);

    }
  };
  

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f1f4ff]">
      <div className="flex w-[90%] h-1/2 max-w-5xl bg-white rounded-3xl overflow-hidden shadow-xl">
        {/* Left image section */}
        <div
          className="w-1/2 hidden md:block bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/736x/f1/1c/c3/f11cc35edc45c04064194793ab020215.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>

        {/* Right login form section */}
        <div className="w-full md:w-1/2 p-10 gap-10 bg-white relative">
          <div
            onClick={() => navigate("/")}
            className="absolute top-5 right-5 px-5 py-1 bg-gray-200 rounded-full hover:bg-red-500 cursor-pointer active:scale-95"
          >
            x
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-5">
            Don’t have an account?{" "}
            <Link to="/user/register" className="text-red-500 font-medium">
              Sign up
            </Link>
          </p>

          <form
            onSubmit={handleSubmit(LoginHandler)}
            className="flex flex-col gap-4"
          >
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email"
              className="bg-gray-100 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />

            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className="bg-gray-100 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-3 rounded-md font-semibold hover:opacity-90 active:scale-95 cursor-pointer"
            >
              Continue
            </button>

            <div className="flex items-center gap-2 my-4">
              <hr className="flex-grow border-t" />
              <span className="text-sm text-gray-400">USER</span>
              <hr className="flex-grow border-t" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
