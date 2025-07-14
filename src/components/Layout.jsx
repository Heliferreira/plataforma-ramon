import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      <main className="flex-grow container py-8 md:py-12">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;