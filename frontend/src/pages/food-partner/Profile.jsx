import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  // console.log("FoodPartner ID:", id);

  const [profile, setProfile] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/food-partner/${id.trim()}`, {
        withCredentials: true,
      })
      .then((response) => {
        const fp = response.data.foodPartner || {};
        setProfile(fp);
        setVideos(fp.foodItems || []); // assumes backend returns foodItems array
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, [id]);

  //for dishes
 useEffect(() => {
  axios
    .get(`http://localhost:3000/api/dish?foodPartner=${id.trim()}`, {
      withCredentials: true,
    })
    .then((response) => {
      setDishes(response.data.dishes); // directly set the dishes array
    })
    .catch((err) => {
      console.error("Error fetching dishes:", err);
    });
}, [id]);




  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
  {/* Header / Cover + Info */}
  <div className="relative">
    <div className="relative overflow-hidden h-60">
      {profile.coverImage && (
        <img
          src={profile.coverImage}
          alt="cover"
          className="h-full rounded-xl w-full object-cover"
        />
      )}
    </div>
    <div className="mt-16 px-4 -mt-10 bg-amber-200 p-5 rounded-xl">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h2 className="text-xl font-bold">{profile.businessName}</h2>
          {profile.contactName && <p className="text-gray-500">Contact: {profile.contactName}</p>}
          {profile.email && <p className="text-gray-700">Email: {profile.email}</p>}
          {profile.phone && <p className="text-gray-700">Phone: {profile.phone}</p>}
          {profile.address && <p className="text-gray-700">Address: {profile.address}</p>}
          {profile.cuisine && <p className="text-gray-700">Cuisine: {profile.cuisine}</p>}
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Veg</button>
      </div>
    </div>
  </div>


  {/* Dishes Section */}
<div className="mt-8 px-4">
  <h2 className="text-lg sm:text-xl font-bold mb-4">Dishes</h2>
  {dishes.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {dishes.map((dish) => (
        <div key={dish._id} className="bg-white rounded-lg shadow-md p-3">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-40 object-cover rounded-md"
          />
          <h3 className="mt-2 font-semibold text-gray-800">{dish.name}</h3>
          {dish.price && <p className="text-gray-600">₹{dish.price}</p>}
          {dish.description && (
            <p className="text-sm text-gray-500">{dish.description}</p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No dishes added yet.</p>
  )}
</div>

  {/* Reels Section */}
  {videos.length > 0 && (
    <div className="flex-1 overflow-y-auto mt-4 px-4">
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((vid) => (
          <div key={vid._id} className="relative rounded-md overflow-hidden group cursor-pointer">
            <video
              src={vid.video}
              className="w-full h-48 sm:h-56 lg:h-72 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
              muted
              loop
              playsInline
              autoPlay
              controls={false}
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white font-semibold text-sm sm:text-base">{vid.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

  );
};

export default Profile;
