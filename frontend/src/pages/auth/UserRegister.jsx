import React from 'react'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

const UserRegister = () => {
  
  const navigate = useNavigate()

  const { register, reset, handleSubmit } = useForm();

  const UserRegisterHandler = async (user) => {
    try {
      console.log("RegisterUser:", user);

      const response = await API.post(
        "/auth/user/register",
        user,{
          withCredentials: true
        }
      )

      console.log(response.data);

      navigate("/")
      

      toast.success("User registered successfully! Please login to continue...");
      reset(); // form clear karne ke liye
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error in register:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit(UserRegisterHandler)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <input {...register("fullName.firstName")} placeholder="First Name" className="bg-gray-100 p-2 rounded-md" />
        <input {...register("fullName.lastName")} placeholder="Last Name" className="bg-gray-100 p-2 rounded-md" />
      </div>
      <input {...register("email")} placeholder="Email" className="bg-gray-100 p-2 rounded-md" />
      <input {...register("mobile")} placeholder="Mobile" className="bg-gray-100 p-2 rounded-md" />
      {/* <input {...register("username")} placeholder="Username" className="bg-gray-100 p-2 rounded-md" /> */}
      <input {...register("password")} type="password" placeholder="Password" className="bg-gray-100 p-2 rounded-md" />

      <button type="submit" className="bg-yellow-500 text-white py-2 rounded-md mt-2 hover:bg-yellow-600">
        Create User Account
      </button>
    </form>
  );
}

export default UserRegister;
