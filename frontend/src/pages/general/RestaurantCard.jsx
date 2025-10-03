// src/pages/general/RestaurantCard.js
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
  // Fetch reviews when toggled (LOGIC UNTOUCHED)
  useEffect(() => {
    if (!showReviews) return;
    setLoadingReviews(true);
    API.get(`/reviews/${restaurant._id}`)
      .then((res) => setReviews(res.data.reviews || []))
      .catch((err) => console.error(err))
      .finally(() => setLoadingReviews(false));
  }, [showReviews, restaurant._id]);
  // Submit new review (LOGIC UNTOUCHED)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return; 
    try {
      setSubmitting(true);
      const res = await API.post("/reviews/submit", {
        foodPartnerId: restaurant._id, 
        rating: 5, 
        comment: newReview.trim(), 
      }  ,{ withCredentials: true });
      const createdReview = res.data.review;
      setReviews((prev) => [createdReview, ...prev]);
      setNewReview(""); 
    } catch (err) {
      console.error("Error submitting review:", err);
      const msg = err.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    // MODERN CARD DESIGN: Deep shadow, rounded-2xl, hover effect
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <img
        onClick={() => navigate(`/food-partner/${restaurant._id}`)}
        src={restaurant.coverImage || "/chad-montano-MqT0asuoIcU-unsplash.jpg"}
        alt={restaurant.businessName || "Restaurant"}
        // Image Scale Effect on Hover
        className="cursor-pointer w-full h-48 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 font-[font2]">{restaurant.businessName}</h2>
        <p className="text-brand-primary text-sm font-medium mt-1">
          {restaurant.cuisine?.join(", ") || "Mixed Cuisine"}
        </p>
        <p className="text-gray-500 text-xs mt-2 flex items-center">
          <span className="mr-1">📍</span> {restaurant.address || "Address info not available"}
        </p>
        
        {/* Toggle Button: Using a transparent/outline style for less distraction */}
        <button
          className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold transition-colors duration-200 
                      ${showReviews ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-red-700 md:bg-gray-200 text-white md:hover:bg-red-700'}`}
          onClick={() => setShowReviews(!showReviews)}
        >
          {showReviews ? "Collapse Reviews" : "View/Add Reviews"}
        </button>
        
        {showReviews && (
          <div className="mt-4 pt-4 border-t border-gray-100 max-h-96 overflow-y-auto custom-scrollbar">
            
            {/* Review Form */}
            <form onSubmit={handleReviewSubmit} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review... (e.g., 'Great food and fast service!')"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-primary/50 outline-none text-sm resize-none font-[font1]"
                rows={3}
                disabled={submitting}
              />
              <button
                type="submit"
                className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-semibold transition-colors"
                disabled={submitting}
              >
                {submitting ? "Posting Review..." : "Submit Review ✨"}
              </button>
            </form>
            
            {/* Reviews List */}
            {loadingReviews ? (
              <p className="text-center text-sm text-gray-500 mt-4">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-400 text-sm italic mt-4">Be the first to leave a review!</p>
            ) : (
              <div className="space-y-3">
                  {reviews.map((r) => (
                    <ReviewCard
                      key={r._id}
                      review={r}
                      // currentUser={currentUser} <-- Unchanged logic
                      onDelete={(deletedId) =>
                        setReviews((prev) =>
                          prev.filter((rev) => rev._id !== deletedId)
                        )
                      }
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default RestaurantCard;