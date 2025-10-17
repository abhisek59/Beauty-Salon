import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      console.log('Fetching appointments with token:', token ? 'TOKEN_EXISTS' : 'NO_TOKEN');

      const response = await axios.get('http://localhost:8000/api/v1/appointments/getAllAppointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Appointments response:', response.data);

      if (response.data.success) {
        setAppointments(response.data.message.appointments || []);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Delete appointment function
  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(appointmentId);
      
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await axios.delete(`http://localhost:8000/api/v1/appointments/delete/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Remove the deleted appointment from the state
        setAppointments(prev => prev.filter(appointment => appointment._id !== appointmentId));
        alert('Appointment deleted successfully');
      } else {
        setError('Failed to delete appointment');
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete appointment');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        <span className="ml-2">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-bold text-red-800">Error Loading Appointments</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchAppointments}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Appointments Management</h1>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800">Found {appointments.length} appointments</p>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div key={appointment._id || index} className="bg-white p-4 rounded-lg shadow border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Customer</h3>
                  <p>{appointment.userId?.firstname} {appointment.userId?.lastname}</p>
                  <p className="text-sm text-gray-600">{appointment.userId?.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Service</h3>
                  <p>{appointment.serviceId?.name || 'Service Deleted'}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Status</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">${appointment.price || 0}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => deleteAppointment(appointment._id)}
                      disabled={deletingId === appointment._id}
                      className={`w-full px-3 py-1 text-sm rounded ${
                        deletingId === appointment._id
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {deletingId === appointment._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
              {appointment.notes && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm text-gray-600"><strong>Notes:</strong> {appointment.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;