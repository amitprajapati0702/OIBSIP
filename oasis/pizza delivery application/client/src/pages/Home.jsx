import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Pizza, Clock, Truck, Star, ChefHat, Shield } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <ChefHat className="h-8 w-8 text-primary-600" />,
      title: "Fresh Ingredients",
      description: "We use only the freshest ingredients sourced locally for the best taste."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-600" />,
      title: "Fast Delivery",
      description: "Hot pizzas delivered to your doorstep in 30 minutes or less."
    },
    {
      icon: <Pizza className="h-8 w-8 text-primary-600" />,
      title: "Custom Pizzas",
      description: "Build your perfect pizza with our wide selection of toppings."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: "Quality Guaranteed",
      description: "100% satisfaction guaranteed or your money back."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Best pizza in town! The custom pizza builder is amazing and delivery is always on time."
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment: "Love the variety of toppings and the quality is consistently excellent. Highly recommended!"
    },
    {
      name: "Emily Davis",
      rating: 5,
      comment: "Great service and delicious pizzas. The app makes ordering so easy and convenient."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Delicious Pizzas
              <br />
              <span className="text-primary-200">Delivered Hot</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Create your perfect pizza with our custom pizza builder and enjoy fast, 
              reliable delivery to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/pizza-builder"
                    className="btn-primary btn-lg bg-white text-primary-600 hover:bg-gray-100"
                  >
                    Build Your Pizza
                  </Link>
                  <Link
                    to="/dashboard"
                    className="btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600"
                  >
                    View Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary btn-lg bg-white text-primary-600 hover:bg-gray-100"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PizzaDelivery?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to delivering the best pizza experience with quality ingredients, 
              fast service, and unmatched convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get your perfect pizza delivered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Choose Your Base
              </h3>
              <p className="text-gray-600">
                Select from our variety of pizza bases including thin crust, thick crust, and gluten-free options.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Add Toppings
              </h3>
              <p className="text-gray-600">
                Customize with your favorite sauce, cheese, vegetables, and meat toppings.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Enjoy Delivery
              </h3>
              <p className="text-gray-600">
                Pay securely and track your order in real-time until it arrives hot at your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <p className="font-semibold text-gray-900">
                  - {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order Your Perfect Pizza?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers and experience the best pizza delivery service.
          </p>
          {isAuthenticated ? (
            <Link
              to="/pizza-builder"
              className="btn-primary btn-lg bg-white text-primary-600 hover:bg-gray-100"
            >
              Start Building Now
            </Link>
          ) : (
            <Link
              to="/register"
              className="btn-primary btn-lg bg-white text-primary-600 hover:bg-gray-100"
            >
              Sign Up Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
