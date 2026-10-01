import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BackButton from './BackButton';
import Footer from './Footer';

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <BackButton />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
