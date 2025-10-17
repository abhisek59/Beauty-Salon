import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel.jsx';
import { Footer, Reviews } from '../components';

const Home = () => {
  const slides = [
    {
      image: '/images/salon-1.jpg',
      alt: 'Our beautiful salon',
      title: 'Welcome to Sunshine Threading',
      subtitle: 'Experience precise threading and beauty services by our expert stylists',
      cta: { text: 'Book Now', href: '/booking' }
    },
    {
      image: '/images/threading-salon.webp',
      alt: 'Threading salon interior',
      title: 'Relax, Beautify, Shine',
      subtitle: 'Our trained professionals ensure a comfortable and beautiful experience',
      cta: { text: 'Our Services', href: '/services' }
    },
    {
      image: '/images/thr-1.webp',
      alt: 'Professional threading service',
      title: 'Glow with Confidence',
      subtitle: 'Book your appointment and step out glowing',
      cta: { text: 'Contact Us', href: '/booking' }
    }
  ];

  // Debug: Log the slides data
  console.log('Carousel slides data:', slides);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      {/* Carousel hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Carousel slides={slides} interval={5000} />
      </div>

      {/* Services Preview */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-pink-800 mb-12">
          Our Premium Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-pink-700 mb-2">Eyebrow Threading</h3>
            <p className="text-gray-600">Perfect, precise eyebrow shaping with traditional threading techniques</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl mb-4">💄</div>
            <h3 className="text-xl font-semibold text-pink-700 mb-2">Facial Threading</h3>
            <p className="text-gray-600">Complete facial hair removal for smooth, glowing skin</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold text-pink-700 mb-2">Beauty Treatments</h3>
            <p className="text-gray-600">Comprehensive beauty services for your complete transformation</p>
          </div>
        </div>
        
        {/* View All Services Button */}
        <div className="text-center mt-8">
          <Link 
            to="/services"
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            View All Services
          </Link>
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews />

      {/* Call to Action */}
      <div className="bg-pink-200 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-pink-800 mb-4">
            Ready to Look Your Best?
          </h2>
          <p className="text-lg text-pink-700 mb-8">
            Book your appointment today and experience the Sunshine Threading difference
          </p>
          <div className="space-x-4">
            <Link 
              to="/services"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Browse Services
            </Link>
            <button className="bg-white hover:bg-gray-50 text-pink-600 font-bold py-3 px-8 rounded-lg border-2 border-pink-600 transition-colors duration-200">
              Schedule Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;