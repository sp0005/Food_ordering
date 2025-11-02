import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MenuAdmin from "./pages/MenuAdmin";
import AdminOrders from "./pages/AdminOrders";
import ReportsAdmin from "./pages/ReportsAdmin";
import UserDashboard from "./pages/userdashboard/UserDashboard";
import UserMenu from "./pages/userdashboard/UserMenu";
import UserCart from "./pages/userdashboard/UserCart";
import OrderHistory from "./pages/userdashboard/OrderHistory";
import Profile from "./pages/userdashboard/Profile";
import Checkout from "./pages/userdashboard/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import AdminContact from "./pages/AdminContact";

const PublicLayout = () => (
  <>
    <Navbar />
    <div className="flex-grow">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={<PublicLayout />} />

          {/* User Dashboard Routes (Protected) */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="menu" element={<UserMenu />} />
            <Route path="cart" element={<UserCart />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />}>
            <Route path="menu" element={<MenuAdmin />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reports" element={<ReportsAdmin />} />
            <Route path="message" element={<AdminContact />} />

          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;