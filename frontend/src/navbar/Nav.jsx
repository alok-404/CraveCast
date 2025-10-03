// src/navbar/Nav.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Tailwind Colors: 'brand-primary' is assumed to be a modern red/orange, e.g., #FF5733
const PRIMARY_COLOR = '#FF5733'; // Using a hex for explicit styling

// Individual Navigation Item Component (Refined)
const NavItem = ({ name, icon, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className={`relative flex flex-col items-center justify-center h-14 w-1/5 min-w-0 transition-all duration-300 ease-in-out focus:outline-none`}
      style={{ color: isActive ? PRIMARY_COLOR : 'rgb(156 163 175)' /* Gray-400 */ }}
    >
      
      {/* Icon Area */}
      <div 
        className={`text-2xl transition-all duration-300 ${isActive ? 'scale-110' : ''}`}
        // The icon itself is the only visible element, no background
      >
        {icon}
      </div>
      
      {/* Text Label: Always visible, but smaller on small screens */}
      <span className={`text-xs mt-1 transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'}`}>
        {name}
      </span>

      {/* Active Bar Indicator (Instead of a dot) */}
      {isActive && (
        <div 
            className="absolute top-0 w-8 h-1 rounded-b-full transition-all duration-300"
            style={{ backgroundColor: PRIMARY_COLOR }}
        ></div>
      )}
    </button>
  );
};

const Nav = () => {
    const navigate = useNavigate();
  // Changed default to 'home' to match the visible UI and likely landing page
  const [activeItem, setActiveItem] = useState('home'); 
  
  const navItems = [
    { name: 'Home', icon: '🏠', path: '/' },
    { name: 'Reels', icon: '🎬', path: '/Reels' },
    { name: 'Save', icon: '🔖', path: '/user/saved-reels' },
    { name: 'Notifications', icon: '🔔', path: '/notification' },
    { name: 'Profile', icon: '👤', path: 'user/profile' },
  ]
  
  const handleNavClick = (name,path) => {
      const lowerName = name.toLowerCase();
      setActiveItem(lowerName);
      navigate(path);
  }
  
  return (
    // Full width, fixed bottom, strong white background, deep shadow.
    <nav className="flex justify-around items-center w-full h-16 bg-white shadow-2xl">
      {navItems.map((item) => (
        <NavItem 
          key={item.name} 
          name={item.name} 
          icon={item.icon} 
          isActive={activeItem === item.name.toLowerCase()} 
          onClick={() => handleNavClick(item.name, item.path)}
        />
      ))}
    </nav>
  );
};

export default Nav;