import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import { StarIcon, MapPinIcon, PhoneIcon, MailIcon, UtensilsCrossedIcon } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('dishes'); // 💡 New state for tab selection

  // Existing logic for fetching profile and videos (foodItems) - UNCHANGED
  useEffect(() => {
    API
      .get(`/food-partner/${id.trim()}`, {
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

  // Existing logic for fetching dishes - UNCHANGED
  useEffect(() => {
    API
      .get(`/dish?foodPartner=${id.trim()}`, {
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
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-700 bg-gray-50">
        Loading profile... 🍳
      </div>
    );
  }

  // Helper component for Tab Button
  const TabButton = ({ name, label, isActive, onClick, count }) => (
    <button
      onClick={() => onClick(name)}
      className={`py-2 px-4 text-sm font-semibold transition-all duration-200 border-b-2 
        ${isActive 
          ? 'text-brand-primary border-brand-primary' // Active state
          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300' // Inactive state
        }`}
    >
      {label} {count > 0 && `(${count})`}
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Header / Cover + Info */}
      <div className="relative mb-6 pb-4 md:pb-6">
        {/* Cover Image */}
        <div className="relative overflow-hidden h-64 sm:h-80 xl:h-96">
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt={`${profile.businessName} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                No Cover Image
            </div>
          )}
          {/* Overlay to darken image for better text contrast */}
          <div className="absolute inset-0 bg-black/30"></div> 
        </div>

        {/* Profile Info Card (positioned over cover) */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] -bottom-8 sm:-bottom-12 bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-xl border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">{profile.businessName}</h1>
              
              {/* Rating and Cuisine - Placeholder as actual data is missing */}
              <div className="flex items-center space-x-3 mt-1 text-sm">
                <div className="flex items-center text-amber-500 font-semibold">
                    <StarIcon size={16} className="fill-amber-500 mr-1"/> 
                    <span className="text-gray-800">4.5</span>
                </div>
                {profile.cuisine && 
                  <p className="text-gray-500 font-medium border border-gray-200 px-2 py-0.5 rounded-full capitalize">
                    {profile.cuisine}
                  </p>
                }
              </div>

              <div className="mt-3 space-y-2 text-sm text-gray-700">
                {profile.address && 
                  <p className="flex items-start">
                    <MapPinIcon size={16} className="text-brand-primary mr-2 mt-0.5 shrink-0"/> 
                    {profile.address}
                  </p>
                }
                {profile.phone && 
                  <p className="flex items-center">
                    <PhoneIcon size={16} className="text-brand-primary mr-2"/> 
                    {profile.phone}
                  </p>
                }
              </div>
            </div>

            {/* CTA/Status Button */}
            <button className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors shrink-0">
              Open Now
            </button>
          </div>
        </div>
      </div>
      {/* END Header/Cover + Info */}

      
      {/* Main Content Area */}
      <div className="px-4 sm:px-6 md:px-8 pt-16 md:pt-20"> {/* Padding added to account for floating header card */}
        
        {/* Contact Details (Hidden on profile card, showing here in compact form) */}
        <div className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-sm text-gray-700 space-y-2 md:hidden">
            <h3 className="font-bold text-lg mb-2 text-gray-800">Contact & Info</h3>
            {profile.contactName && <p className="text-gray-600">Contact Person: <span className="font-medium">{profile.contactName}</span></p>}
            {profile.email && 
                <p className="flex items-center">
                    <MailIcon size={16} className="text-brand-primary mr-2"/> 
                    {profile.email}
                </p>
            }
            {profile.cuisine && 
                <p className="flex items-center">
                    <UtensilsCrossedIcon size={16} className="text-brand-primary mr-2"/> 
                    Cuisine: <span className="font-medium ml-1 capitalize">{profile.cuisine}</span>
                </p>
            }
        </div>
        
        {/* Tabs for Dish/Video/Reviews */}
        <div className="flex border-b border-gray-200 sticky top-0 bg-gray-50 z-10 pt-4 mb-8">
            <TabButton 
                name="dishes" 
                label="Menu" 
                isActive={activeTab === 'dishes'} 
                onClick={setActiveTab}
                count={dishes.length}
            />
            <TabButton 
                name="videos" 
                label="Reels" 
                isActive={activeTab === 'videos'} 
                onClick={setActiveTab}
                count={videos.length}
            />
             {/* 💡 Reviews Tab (Placeholder) */}
            <TabButton 
                name="reviews" 
                label="Reviews" 
                isActive={activeTab === 'reviews'} 
                onClick={setActiveTab}
                count={0} 
            />
        </div>

        {/* Dish Section - Displayed when 'dishes' tab is active */}
        {activeTab === 'dishes' && (
          <div className="pb-10">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Popular Dishes</h2>
            {dishes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {dishes.map((dish) => (
                  <div key={dish._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden cursor-pointer">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-40 sm:h-48 object-cover transition-transform duration-350 hover:scale-[1.03]"
                    />
                    <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 truncate">{dish.name}</h3>
                        {dish.price && <p className="text-brand-primary font-extrabold mt-1">₹{dish.price}</p>}
                        {dish.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{dish.description}</p>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">This restaurant hasn't added any dishes yet.</p>
            )}
          </div>
        )}

        {/* Reels Section - Displayed when 'videos' tab is active */}
        {activeTab === 'videos' && videos.length > 0 && (
          <div className="pb-10">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Food Reels</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {videos.map((vid) => (
                <div key={vid._id} className="relative rounded-xl overflow-hidden group shadow-lg cursor-pointer">
                  <video
                    src={vid.video}
                    className="w-full h-64 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
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
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div> {/* Dimmer overlay */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-semibold text-base sm:text-lg">{vid.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
         {/* Reels Section - Displayed when 'videos' tab is active but videos.length is 0 */}
        {activeTab === 'videos' && videos.length === 0 && (
            <p className="text-gray-500 text-center py-10">No exciting food reels added yet. Check back soon!</p>
        )}
        
        {/* Reviews Section - Placeholder */}
        {activeTab === 'reviews' && (
             <p className="text-gray-500 text-center py-10">Reviews feature coming soon! 🚀</p>
        )}

      </div>
      {/* END Main Content Area */}
    </div>
  );
};

export default Profile;