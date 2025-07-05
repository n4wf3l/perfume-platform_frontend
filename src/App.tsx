import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Page imports
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ConfidentialityPage from "./pages/Confidentiality";
// Component imports
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Context imports
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Style imports
import "./index.css";
import ScrollToTop from "./components/ScrollToTop";
import AutoScrollToTop from "./components/AutoScrollToTop";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen bg-black text-amber-500">
          Loading...
        </div>
      }
    >
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen w-full">
              <AutoScrollToTop />
              {/* Le Header n'apparaît pas sur les pages du dashboard */}
              <Routes>
                <Route path="/dashboard/*" element={null} />
                <Route path="*" element={<Header />} />
              </Routes>
          <main className="flex-grow w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={<Auth />} />{" "}
              {/* Ajoutez cette ligne */}
              <Route
                path="/confidentiality"
                element={<ConfidentialityPage />}
              />{" "}
              {/* Ajout de la route pour la page de confidentialité */}
            </Routes>
          </main>
          {/* Le Footer n'apparaît pas sur les pages du dashboard */}
          <Routes>
            <Route path="/dashboard/*" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
        <ScrollToTop />
      </Router>
        </CartProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
