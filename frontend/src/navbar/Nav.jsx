// src/navbar/Nav.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Individual Navigation Item Component
const NavItem = ({ name, icon, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className={`relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-full 
                  transition-colors duration-200 ease-in-out focus:outline-none
                  ${isActive ? 'text-white' : 'text-gray-400'}`}
    >
      {/* Active dot indicator */}
      {isActive && (
        <span className="absolute -top-1 right-1/2 translate-x-1/2 w-2 h-2 bg-red-600 rounded-full"></span>
      )}
      
      {/* Icon and Background */}
      <div className={`text-xl ${isActive ? 'bg-[#fe5200] p-2 rounded-full' : ''}`}>
          {icon}
      </div>
      
      {/* Text Label: Hidden by default on small screens, shown on 'sm' and up */}
      <span className={`hidden sm:block text-black text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>
        {name}
      </span>
    </button>
  );
};

const Nav = () => {

    const navigate = useNavigate("")

  const [activeItem, setActiveItem] = useState('notifications'); 

 const navItems = [
    { name: 'Home', icon: '🏠', path: '/' },
    { name: 'Reels', icon: '🎬', path: '/Reels' },
    { name: 'Save', icon: '🔖', path: '/user/saved-reels' },
    { name: 'Notifications', icon: '🔔', path: '/notifications' },
    { name: 'Profile', icon: '👤', path: 'user/profile' },
  ]

  const handleNavClick = (name,path) => {
      setActiveItem(name.toLowerCase());
      navigate(path);
  }

  return (
    // Max-width is now applied from 'sm' breakpoint for better behavior on wide screens
    <nav className="relative flex justify-around items-center w-full sm:max-w-lg sm:mx-auto  bg-white rounded-t-lg sm:rounded-full py-2 shadow-lg mb-0 sm:mb-4">
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