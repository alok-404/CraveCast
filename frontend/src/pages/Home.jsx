// src/pages/Home.js
import React, { useEffect, useState, useMemo } from 'react'; // useMemo import karna zaroori hai
import API from '../api/api';
import RestaurantCard from './general/RestaurantCard';
import LoginModal from './general/LoginModal';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  // 💡 Naya State for Search Term
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    // Existing logic to fetch all restaurants
    API.get('/food-partner')
      .then(res => {
        setRestaurants(res.data.partners);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          setShowLogin(true);
        }
        setLoading(false);
      });
  }, []);

  // 💡 Filtering Logic using useMemo
  const filteredRestaurants = useMemo(() => {
    if (!searchTerm.trim()) {
      return restaurants; // Agar search term empty hai toh poori list return karo
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    // Filter logic: Restaurant ke name, cuisine, ya address mein search term dhoondo
    return restaurants.filter(restaurant => 
      restaurant.businessName?.toLowerCase().includes(lowerCaseSearch) ||
      restaurant.address?.toLowerCase().includes(lowerCaseSearch) ||
      restaurant.cuisine?.some(c => c.toLowerCase().includes(lowerCaseSearch))
    );
  }, [restaurants, searchTerm]); // Sirf tab recalculate hoga jab restaurants ya searchTerm badlega


  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary"></div>
      <p className="ml-4 text-gray-600 font-[font1]">Fetching delicious food...</p>
    </div>
  );
  
  // Ab UI mein `filteredRestaurants` use karenge aur Input ka handler set karenge
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen pb-24">
      
      <header className="mb-8 p-4 bg-white rounded-xl shadow-md sticky top-0 z-10 sm:p-6">
          <h1 className="text-3xl font-extrabold text-gray-900 font-[font2] tracking-tight">
            🍴 Crave Cast
          </h1>
          <p className="text-sm text-gray-500 mt-1">Discover the best restaurants near you.</p>
          
          {/* 💡 Search Bar Implementation */}
          <div className="mt-4 flex items-center bg-gray-100 p-3 rounded-xl border border-gray-200">
               <span className="text-xl mr-2 text-gray-500">🔍</span>
               <input 
                 type="text" 
                 placeholder="Search for food, cuisine, or restaurants..." 
                 className="w-full bg-gray-100 outline-none text-sm font-[font1]"
                 value={searchTerm} // Input value ko state se bind karo
                 onChange={(e) => setSearchTerm(e.target.value)} // Change hone par state update karo
               />
          </div>
      </header>
      
      {!loading && showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      
      {!loading && !showLogin && (
        <>
          <h2 className="text-xl font-bold mb-4 text-gray-800 font-[font2]">
            Top Picks ({filteredRestaurants.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* 💡 Yahaan filteredRestaurants use ho raha hai */}
            {filteredRestaurants.map(r => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
          
          {filteredRestaurants.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No restaurants match your search for "{searchTerm}".
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Home;