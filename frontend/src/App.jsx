// src/App.js

import React from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import Nav from './navbar/Nav'

const App = () => {
  return (
    <div className='min-h-screen'>
        
      <div className=''>
        <AppRoutes/>
      </div>

   
      <div className='fixed bottom-0 left-0 w-full z-50'>
        <Nav/>
      </div>
      
    </div>
  )
}

export default App