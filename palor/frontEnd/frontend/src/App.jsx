import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import NavbarSimple from './components/NavbarSimple.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Booking from './pages/Booking.jsx'
import MyAppointments from './pages/MyAppointments.jsx'
import Login from './login.jsx'
import Register from './register.jsx'
import TestLogin from './pages/TestLogin.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminLayout from './pages/AdminLayout.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminServices from './pages/AdminServices.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminAppointments from './pages/AdminAppointments.jsx'
import AdminReviews from './pages/AdminReviews.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes with navbar */}
          <Route path="/" element={
            <>
              <NavbarSimple />
              <Home />
            </>
          } />
          <Route path="/services" element={
            <>
              <NavbarSimple />
              <Services />
            </>
          } />
          <Route path="/booking/:serviceId" element={
            <>
              <NavbarSimple />
              <Booking />
            </>
          } />
          <Route path="/my-appointments" element={
            <>
              <NavbarSimple />
              <MyAppointments />
            </>
          } />
          <Route path="/reviews" element={
            <>
              <NavbarSimple />
              <ReviewsPage />
            </>
          } />
          <Route path="/login" element={
            <>
              <NavbarSimple />
              <Login />
            </>
          } />
          <Route path="/register" element={
            <>
              <NavbarSimple />
              <Register />
            </>
          } />
          <Route path="/test-login" element={
            <>
              <NavbarSimple />
              <TestLogin />
            </>
          } />
          
          {/* Admin routes without navbar */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
