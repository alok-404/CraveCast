// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import API from '../api/api';
import RestaurantCard from './general/RestaurantCard';
import LoginModal from './general/LoginModal';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);


  useEffect(() => {
    API.get('/api/food-partner')
      .then(res => {
        setRestaurants(res.data.partners);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 401) {
        // If unauthorized, show login popup
        setShowLogin(true);
      }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

 return (
  <div className="p-4 sm:p-6 bg-white min-h-screen">
    {loading && <div className="text-center mt-10">Loading...</div>}

    {!loading && showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

    {!loading && !showLogin && (
      <>
        <h1 className="text-2xl font-bold mb-6">
          Restaurants near you ({restaurants.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurants.map(r => (
            <RestaurantCard key={r._id} restaurant={r} />
          ))}
        </div>
      </>
    )}
  </div>
);

};

export default Home;
