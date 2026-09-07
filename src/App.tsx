import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './pages/CartPage';
import { NotificationToast } from './components/common/NotificationToast';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { SupportPage } from './pages/SupportPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPages } from './pages/PolicyPages';
import { AdminDashboard } from './pages/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { activePage } = useStore();

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'account':
        return <AccountPage />;
      case 'about':
        return <AboutPage />;
      case 'support':
        return <SupportPage />;
      case 'contact':
        return <ContactPage />;
      case 'policy-shopping':
      case 'policy-privacy':
      case 'policy-refund':
      case 'policy-terms':
        return <PolicyPages />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans text-slate-800 bg-[#F4FAF8] antialiased selection:bg-teal-200 selection:text-teal-950">
      <Header />
      <main className="flex-1">{renderActivePage()}</main>
      <Footer />
      <CartDrawer />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
