import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const MyAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(null);

    // Fetch user appointments
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(
                'http://localhost:8000/api/v1/appointments/getMyAppointments',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setAppointments(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to load appointments');
            }
        } finally {
            setLoading(false);
        }
    };

    // Cancel appointment
    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        setCancelling(appointmentId);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `http://localhost:8000/api/v1/appointments/cancel/${appointmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        cancellationReason: 'Cancelled by user'
                    }
                }
            );

            if (response.data.success) {
                // Refresh appointments list
                fetchAppointments();
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            setError('Failed to cancel appointment');
        } finally {
            setCancelling(null);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const getStatusColor = (status) => {
            switch (status) {
                case 'pending':
                    return 'bg-yellow-100 text-yellow-800';
                case 'confirmed':
                    return 'bg-green-100 text-green-800';
                case 'cancelled':
                    return 'bg-red-100 text-red-800';
                case 'completed':
                    return 'bg-blue-100 text-blue-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Manage your upcoming and past appointments
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate('/services')}
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-200"
                    >
                        Book New Appointment
                    </button>
                    <button
                        onClick={fetchAppointments}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                        Refresh
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Appointments List */}
                {appointments.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No appointments found</h3>
                        <p className="text-gray-600 mb-6">You haven't booked any appointments yet.</p>
                        <button
                            onClick={() => navigate('/services')}
                            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-200"
                        >
                            Book Your First Appointment
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {appointments.map((appointment) => (
                            <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    {/* Appointment Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {appointment.serviceId?.name || 'Service Not Found'}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {appointment.serviceId?.category}
                                                </p>
                                            </div>
                                            <StatusBadge status={appointment.status} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <span className="text-sm text-gray-500">Date</span>
                                                <p className="font-medium">
                                                    {formatDate(appointment.appointmentDate)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Time</span>
                                                <p className="font-medium">{appointment.appointmentTime}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Duration</span>
                                                <p className="font-medium">
                                                    {appointment.duration || appointment.serviceId?.duration || 'N/A'} min
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">Price</span>
                                                <p className="font-medium text-green-600">
                                                    ${appointment.price || appointment.serviceId?.price || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {appointment.staffId && (
                                            <div className="mb-4">
                                                <span className="text-sm text-gray-500">Staff</span>
                                                <p className="font-medium">
                                                    {appointment.staffId.fullName || appointment.staffId.username}
                                                </p>
                                            </div>
                                        )}

                                        {appointment.notes && (
                                            <div className="mb-4">
                                                <span className="text-sm text-gray-500">Notes</span>
                                                <p className="text-gray-700">{appointment.notes}</p>
                                            </div>
                                        )}

                                        {appointment.queueNumber && (
                                            <div className="mb-4">
                                                <span className="text-sm text-gray-500">Queue Number</span>
                                                <p className="font-medium">#{appointment.queueNumber}</p>
                                            </div>
                                        )}

                                        {appointment.cancellationReason && (
                                            <div className="mb-4">
                                                <span className="text-sm text-gray-500">Cancellation Reason</span>
                                                <p className="text-red-600">{appointment.cancellationReason}</p>
                                            </div>
                                        )}

                                        {/* Rating and Review for completed appointments */}
                                        {appointment.status === 'completed' && (appointment.rating || appointment.review) && (
                                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Your Feedback</h4>
                                                {appointment.rating && (
                                                    <div className="flex items-center mb-2">
                                                        <span className="text-sm text-gray-500 mr-2">Rating:</span>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span
                                                                    key={star}
                                                                    className={`text-lg ${
                                                                        star <= appointment.rating
                                                                            ? 'text-yellow-400'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                >
                                                                    ⭐
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {appointment.review && (
                                                    <div>
                                                        <span className="text-sm text-gray-500">Review:</span>
                                                        <p className="text-gray-700 mt-1">{appointment.review}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-6 mt-4 lg:mt-0">
                                        {appointment.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancelAppointment(appointment._id)}
                                                disabled={cancelling === appointment._id}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                                            >
                                                {cancelling === appointment._id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Cancelling...
                                                    </>
                                                ) : (
                                                    'Cancel'
                                                )}
                                            </button>
                                        )}
                                        
                                        {appointment.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleCancelAppointment(appointment._id)}
                                                disabled={cancelling === appointment._id}
                                                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        <button
                                            onClick={() => navigate(`/booking/${appointment.serviceId._id}`)}
                                            className="px-4 py-2 border border-pink-300 text-pink-600 rounded-lg hover:bg-pink-50 transition duration-200"
                                        >
                                            Book Again
                                        </button>
                                    </div>
                                </div>

                                {/* Appointment Timeline */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span>Created: {new Date(appointment.createdAt).toLocaleDateString()}</span>
                                        {appointment.updatedAt !== appointment.createdAt && (
                                            <span className="ml-4">
                                                Updated: {new Date(appointment.updatedAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;