import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RestaurantCard = ({ restaurant }) => {
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Fetch reviews when toggled
  useEffect(() => {
    if (!showReviews) return;
    setLoadingReviews(true);

    API.get(`/reviews/${restaurant._id}`)
      .then((res) => setReviews(res.data.reviews || []))
      .catch((err) => console.error(err))
      .finally(() => setLoadingReviews(false));
  }, [showReviews, restaurant._id]);

  // Submit new review
  // Submit new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return; // Empty review block

    try {
      setSubmitting(true);

      const res = await API.post("/reviews/submit", {
        foodPartnerId: restaurant._id, // backend expects "foodPartner"
        rating: 5, // ya user se select karwa lo
        comment: newReview.trim(), // backend expects "comment"
      }  ,{ withCredentials: true });

      // Add the newly created review to local state
      const createdReview = res.data.review;
      setReviews((prev) => [createdReview, ...prev]);
      setNewReview(""); // Clear textarea
    } catch (err) {
      console.error("Error submitting review:", err);
      // Backend se message use karte hue
  const msg = err.response?.data?.message || "Failed to submit review";
  toast.error(msg); // <-- Toastify call
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <img
        onClick={() => navigate(`/food-partner/${restaurant._id}`)}
        src={restaurant.coverImage || "/chad-montano-MqT0asuoIcU-unsplash.jpg"}
        alt={restaurant.businessName || "Restaurant"}
        className="cursor-pointer w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{restaurant.businessName}</h2>
        <p className="text-gray-500 text-sm">
          {restaurant.cuisine?.join(", ") || "Cuisine not specified"}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          {restaurant.address || "Address info not available"}
        </p>

        <button
          className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => setShowReviews(!showReviews)}
        >
          {showReviews ? "Hide Reviews" : "Show Reviews"}
        </button>

        {showReviews && (
          <div className="mt-3 border-t pt-2 max-h-96 overflow-y-auto">
            {/* Review Form */}
            <form onSubmit={handleReviewSubmit} className="mb-3">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm resize-none"
                rows={2}
                disabled={submitting}
              />
              <button
                type="submit"
                className="mt-2 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600 text-sm"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>

            {/* Reviews List */}
            {loadingReviews ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet.</p>
            ) : (
              reviews.map((r) => (
                <ReviewCard
                  key={r._id}
                  review={r}
                  // currentUser={currentUser}
                  onDelete={(deletedId) =>
                    setReviews((prev) =>
                      prev.filter((rev) => rev._id !== deletedId)
                    )
                  }
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
