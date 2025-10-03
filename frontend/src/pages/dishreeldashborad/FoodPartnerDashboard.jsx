import React, { useState } from "react";
import DishForm from "./DishForm"; // Form for creating a dish
import ReelForm from "./ReelForm"; // Form for uploading reel

const FoodPartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dish"); // 'dish' or 'reel'

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "dish"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border"
          }`}
          onClick={() => setActiveTab("dish")}
        >
          Create Dish
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "reel"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border"
          }`}
          onClick={() => setActiveTab("reel")}
        >
          Upload Reel
        </button>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        {activeTab === "dish" && <DishForm />}
        {activeTab === "reel" && <ReelForm />}
      </div>
    </div>
  );
};

export default FoodPartnerDashboard;
