import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Save = () => {
  const [savedReels, setSavedReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedReels = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/food/user/saved-reels", {
          withCredentials: true,
        });
        setSavedReels(res.data.savedReels);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load saved reels");
        setLoading(false);
      }
    };
    fetchSavedReels();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!savedReels.length)
    return <div className="text-center mt-10">No saved reels yet!</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Saved Reels</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {savedReels.map((reel) => (
          <div
            key={reel._id}
            className="border rounded shadow overflow-hidden hover:scale-105 transition-transform"
          >
            <video
              src={reel.video}
              controls
              className="w-full h-64 object-cover"
            ></video>
            <div className="p-2">
              <h2 className="font-semibold">{reel.name}</h2>
              <p className="text-sm text-gray-500">{reel.description}</p>
              <p className="text-xs text-gray-400">
                By: {reel.foodPartner?.businessName || "Unknown"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Save;
