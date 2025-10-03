import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserLogin from "../pages/auth/UserLogin";

import Register from "../pages/auth/Register";
import Home from "../pages/Home";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import CreateFood from "../pages/food-partner/CreateFood";
import Profile from "../pages/food-partner/Profile";
import FoodReels from "../pages/general/FoodReels";
import CreateDish from "../pages/dishreeldashborad/CreateDish";
import UserProfile from "../pages/general/UserProfile";
import PrivateRoute from "./PrivateRoute";
import Save from "../pages/general/Save";
import FoodPartnerProfile from "../pages/general/FoodPartnerProfile";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/user/register" element={<Navigate to="/register" />} />
        <Route
          path="/food-partner/register"
          element={<Navigate to="/register" />}
        />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route path="/" element={<Home />} />
        <Route path="/Reels" element={<FoodReels />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/food-partner/:id" element={<Profile />} />

        <Route path="/create-dish" element={<CreateDish />} />


        <Route path="/user/saved-reels" element={<Save />} />

        <Route
          path="/user/profile"
          element={
            <PrivateRoute type="user">
              <UserProfile />
            </PrivateRoute>
          }
        />

     <Route
  path="/food-partner/profile"
  element={
    <PrivateRoute type="food-partner">
      <FoodPartnerProfile />
    </PrivateRoute>
  }
/>


      </Routes>
    </div>
  );
};

export default AppRoutes;
