import React from 'react'
import Header from '../Common/Header.jsx'
import Footer from '../Common/Footer.jsx'
import { Outlet } from 'react-router-dom'

const Userlayout = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] max-w-[2xl]">
      <Header />
      {/* This wrapper layout handles stretching the inner content and killing the margin gaps */}
      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Userlayout