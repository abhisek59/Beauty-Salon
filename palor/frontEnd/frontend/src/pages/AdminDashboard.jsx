import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader } from '../components';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalServices: 0,
    totalRevenue: 0,
    todayAppointments: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust the base URL if your API is mounted under /api
        const res = await axios.get('http://localhost:8000/api/v1/dashboard/overview', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        // backend returns flat fields: totalUsers, totalServices, totalAppointments, todayAppointments, pendingAppointments, totalRevenue
        const data = res.data?.data || {};
        if (!mounted) return;

        setStats(prev => ({
          ...prev,
          totalUsers: data.totalUsers ?? prev.totalUsers,
          totalAppointments: data.totalAppointments ?? prev.totalAppointments,
          totalServices: data.totalServices ?? prev.totalServices,
          totalRevenue: data.totalRevenue ?? prev.totalRevenue,
          todayAppointments: data.todayAppointments ?? prev.todayAppointments,
          pendingAppointments: data.pendingAppointments ?? prev.pendingAppointments
        }));
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
        if (!mounted) return;
        setError(err.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();
    return () => { mounted = false; };
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white text-2xl`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to  admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon="📅"
          color="bg-green-500"
        />
        <StatCard
          title="Total Services"
          value={stats.totalServices}
          icon="✨"
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="bg-yellow-500"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon="📊"
          color="bg-pink-500"
        />
        <StatCard
          title="Pending Appointments"
          value={stats.pendingAppointments}
          icon="⏳"
          color="bg-red-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded hover:bg-gray-50 border">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">➕</span>
                  <div>
                    <p className="font-medium">Add New Service</p>
                    <p className="text-sm text-gray-600">Create a new service offering</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded hover:bg-gray-50 border">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">👤</span>
                  <div>
                    <p className="font-medium">Create Walk-in User</p>
                    <p className="text-sm text-gray-600">Add a walk-in customer</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded hover:bg-gray-50 border">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📅</span>
                  <div>
                    <p className="font-medium">View Today's Schedule</p>
                    <p className="text-sm text-gray-600">Check today's appointments</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded">
                <span className="text-green-500 mr-3">✅</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">New appointment booked</p>
                  <p className="text-xs text-gray-600">Sarah Johnson - Eyebrow Threading</p>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded">
                <span className="text-blue-500 mr-3">👤</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-gray-600">Mike Davis joined as customer</p>
                </div>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded">
                <span className="text-purple-500 mr-3">💰</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-gray-600">$45 - Facial Threading</p>
                </div>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;