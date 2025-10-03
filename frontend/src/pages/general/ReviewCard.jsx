// src/pages/general/ReviewCard.js
import React from "react";
import API from "../../api/api";
const ReviewCard = ({ review, onDelete, currentUser }) => {
const isOwner = currentUser?._id?.toString() === review.user?._id?.toString();
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await API.delete(`/reviews/${review._id}`, {
        withCredentials: true, // <-- send cookies/session
      });
      onDelete(review._id); // notify parent to remove from state
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Failed to delete review");
    }
  };
  return (
    // Clean, slightly elevated design
    <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
      <p className="text-sm text-gray-800 italic font-[font1] leading-relaxed">
        "{review.comment}"
      </p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500 font-medium">
          — <span className="font-semibold text-gray-600">{review.user?.fullName?.firstName || review.user?.username || "Anonymous"}</span>
        </p>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
          >
            Delete 🗑️
          </button>
        )}
      </div>
    </div>
  );
};
export default ReviewCard;