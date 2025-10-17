import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const Booking = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        serviceId: serviceId || '',
        appointmentDate: '',
        appointmentTime: '',
        staffId: '',
        notes: '',
        price: '',
        duration: ''
    });

    // Component state
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [service, setService] = useState(null);
    const [staff, setStaff] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    // Available time slots
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(time);
            }
        }
        return slots;
    };

    // Fetch service details
    const fetchService = async () => {
        if (!serviceId) return;
        
        try {
            setLoading(true);
            console.log('Fetching service with ID:', serviceId);
            const response = await axios.get(`http://localhost:8000/api/v1/services/getServiceById/${serviceId}`);
            console.log('Service response:', response.data);
            if (response.data.success) {
                const serviceData = response.data.message;
                setService(serviceData);
                setFormData(prev => ({
                    ...prev,
                    price: serviceData.price || '',
                    duration: serviceData.duration || ''
                }));
            }
        } catch (error) {
            console.error('Error fetching service:', error);
            setErrors({ service: 'Failed to load service details' });
        } finally {
            setLoading(false);
        }
    };

    // Fetch available staff
    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/user/getAllUsers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data.success) {
                // Filter for staff members (non-admin users)
                const staffMembers = response.data.message.users.filter(user => 
                    user.role === 'staff' || user.role === 'user'
                );
                setStaff(staffMembers);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    useEffect(() => {
        fetchService();
        fetchStaff();
        setTimeSlots(generateTimeSlots());
    }, [serviceId]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.serviceId) {
            newErrors.serviceId = 'Service is required';
        }
        if (!formData.appointmentDate) {
            newErrors.appointmentDate = 'Appointment date is required';
        } else {
            // Check if date is not in the past
            const selectedDate = new Date(formData.appointmentDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.appointmentDate = 'Appointment date cannot be in the past';
            }
        }
        if (!formData.appointmentTime) {
            newErrors.appointmentTime = 'Appointment time is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setErrors({});
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrors({ auth: 'Please login to book an appointment' });
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            console.log('Submitting booking with data:', formData);
            console.log('Token exists:', !!token);

            // Clean the form data - only send non-empty values
            const cleanFormData = {
                serviceId: formData.serviceId,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime
            };

            // Add optional fields only if they have values
            if (formData.staffId && formData.staffId.trim()) {
                cleanFormData.staffId = formData.staffId;
            }
            if (formData.notes && formData.notes.trim()) {
                cleanFormData.notes = formData.notes.trim();
            }
            if (formData.price && !isNaN(formData.price)) {
                cleanFormData.price = Number(formData.price);
            }
            if (formData.duration && !isNaN(formData.duration)) {
                cleanFormData.duration = Number(formData.duration);
            }

            console.log('Cleaned form data:', cleanFormData);

            const response = await axios.post(
                'http://localhost:8000/api/v1/appointments/create',
                cleanFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Booking response:', response.data);

            if (response.data.success) {
                setSuccess('Appointment booked successfully!');
                setTimeout(() => {
                    navigate('/my-appointments');
                }, 2000);
            }
        } catch (error) {
            console.error('Booking error:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            console.error('Form data sent:', formData);
            
            if (error.response?.status === 401) {
                setErrors({ auth: 'Session expired. Please login again.' });
                setTimeout(() => navigate('/login'), 2000);
            } else if (error.response?.status === 409) {
                setErrors({ conflict: 'This time slot is already booked. Please choose another time.' });
            } else if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message || 'Invalid booking data. Please check all fields.';
                setErrors({ submit: errorMessage });
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Failed to book appointment. Please try again.';
                setErrors({ submit: errorMessage });
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
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
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
                        {service && (
                            <p className="mt-2 text-lg text-gray-600">
                                Service: <span className="font-semibold text-pink-600">{service.name}</span>
                            </p>
                        )}
                    </div>

                    {/* Service Details */}
                    {service && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-600">Price:</span>
                                    <span className="ml-2 font-semibold text-green-600">
                                        ${service.price}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="ml-2 font-semibold">
                                        {service.duration} minutes
                                    </span>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="ml-2 font-semibold text-pink-600">
                                        {service.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error/Success Messages */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            {Object.values(errors).map((error, index) => (
                                <p key={index} className="text-red-600 text-sm">{error}</p>
                            ))}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-green-600 text-sm">{success}</p>
                        </div>
                    )}

                    {/* Booking Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Service Selection (if not pre-selected) */}
                        {!serviceId && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service *
                                </label>
                                <select
                                    name="serviceId"
                                    value={formData.serviceId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    required
                                >
                                    <option value="">Select a service</option>
                                    {/* Services would be populated here */}
                                </select>
                            </div>
                        )}

                        {/* Appointment Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Appointment Date *
                            </label>
                            <input
                                type="date"
                                name="appointmentDate"
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                min={getMinDate()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                required
                            />
                        </div>

                        {/* Appointment Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Appointment Time *
                            </label>
                            <select
                                name="appointmentTime"
                                value={formData.appointmentTime}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                required
                            >
                                <option value="">Select time</option>
                                {timeSlots.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        {/* Staff Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Staff (Optional)
                            </label>
                            <select
                                name="staffId"
                                value={formData.staffId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            >
                                <option value="">Any available staff</option>
                                {staff.map(member => (
                                    <option key={member._id} value={member._id}>
                                        {member.fullName || member.username}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Auto-filled from service"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50"
                                readOnly
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="Auto-filled from service"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50"
                                readOnly
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Any special requests or notes..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Booking...
                                    </>
                                ) : (
                                    'Book Appointment'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Note */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>* Required fields</p>
                        <p className="mt-1">You will receive a confirmation email once your appointment is confirmed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;