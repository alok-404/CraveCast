import React from 'react'
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const FoodPartnerRegister = () => {
  const navigate = useNavigate()
 const { register, handleSubmit } = useForm();

 const FoodPartnerRegisterHandler = async (FoodPartner) =>{

  try {
    console.log("RegisterFoodPartner:" , FoodPartner);
    const response = await axios.post("http://localhost:3000/api/auth/food-partner/register" , FoodPartner , {
      withCredentials:true
    })
        
    toast.success("Food Partner registered successfully!");
      // reset(); // form clear karne ke liye
      console.log("API Response:", response.data);
      navigate("/create-food")

  } catch (error) {
    console.error("Error in login:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
  }
 }

 return (
    <form onSubmit={handleSubmit(FoodPartnerRegisterHandler)} className="flex flex-col gap-4">
      <input {...register("businessName")} placeholder="Business Name" className="bg-gray-100 p-2 rounded-md" />
      <input {...register("email")} placeholder="Business Email" className="bg-gray-100 p-2 rounded-md" />
      <input {...register("address")} placeholder="Business Address" className="bg-gray-100 p-2 rounded-md" />
      <input {...register("contactName")} placeholder="Contact Name" className="bg-gray-100 p-2 rounded-md" />
      <input {...register("phone")} placeholder="Phone" className="bg-gray-100 p-2 rounded-md" />
      {/* <input {...register("username")} placeholder="Username" className="bg-gray-100 p-2 rounded-md" /> */}
      <input {...register("password")} type="password" placeholder="Password" className="bg-gray-100 p-2 rounded-md" />

      <button type="submit" className="bg-yellow-500 text-white py-2 rounded-md mt-2 hover:bg-yellow-600">
        Create Food Partner Account
      </button>
    </form>
  );
}

export default FoodPartnerRegister
