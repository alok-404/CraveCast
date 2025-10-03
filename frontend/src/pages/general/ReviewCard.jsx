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
    <div className="p-3 border-b">
      <p className="text-sm text-gray-700">{review.comment}</p>
      <p className="text-xs text-gray-400">
        by {review.user?.fullName?.firstName || review.user?.username || "Anonymous"}
      </p>

      {isOwner && (
        <button
          onClick={handleDelete}
          className="mt-1 text-xs text-red-500 hover:underline"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
