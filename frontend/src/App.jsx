// src/App.js

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import Nav from './navbar/Nav';
import { ToastContainer } from 'react-toastify';
import LoginModal from './pages/general/LoginModal'; 
import API from './api/api'; 
import { Loader2 } from 'lucide-react';

const App = () => {
  // State will be true if EITHER a user OR a food partner is logged in.
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      let loggedIn = false;

      // 1. Check for User Authentication
      try {
        // Server checks for User's cookie
        await API.get('/auth/user/profile', { withCredentials: true });
        loggedIn = true; // User is logged in
      } catch (error) {
        console.log("User not logged in.");
      }

      // 2. Check for Food Partner Authentication (Only if User isn't logged in)
      if (!loggedIn) {
        try {
          // Server checks for Food Partner's cookie
          // 💡 NOTE: Replace '/auth/partner/profile' with your actual Food Partner status endpoint
          await API.get('/auth/partner/profile', { withCredentials: true }); 
          loggedIn = true; 

// Food Partner is logged in
        } catch (error) {
          console.log("Food Partner not logged in.");
        }
      }
      
      setIsLoggedIn(loggedIn);
      setIsAuthCheckComplete(true);
    };
    
    checkAuthStatus();
  }, []);


  // Logic to determine if the modal should be shown
  const isAuthPage = location.pathname.startsWith('/user/login') || 
                     location.pathname.startsWith('/user/register') ||
                     location.pathname.startsWith('/partner/'); // Assuming partner routes don't need the modal

  const shouldShowLoginModal = (
    !isLoggedIn && 
    isAuthCheckComplete && 
    !isAuthPage // Do not show on auth pages
  );


  if (!isAuthCheckComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    ); 
  }

  return (
    <div className='relative'> 
        
      <main className='pb-16'>
        <AppRoutes/>
      </main>
   
      {isLoggedIn && (
        <div className='fixed bottom-0 left-0 w-full z-50'>
          <Nav/>
        </div>
      )}
      
      {shouldShowLoginModal && <LoginModal />}

      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  )
}
export default App