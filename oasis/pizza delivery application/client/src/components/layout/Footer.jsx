import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Pizza className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold">PizzaDelivery</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Delicious pizzas made with fresh ingredients and delivered hot to your doorstep. 
              Experience the perfect blend of taste and convenience.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Clock className="h-4 w-4" />
                <span>Open 24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pizza-builder" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Build Your Pizza
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-primary-400 transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+91 9999999999</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@pizzadelivery.com</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <MapPin className="h-4 w-4 mt-1" />
                <span>123 Pizza Street, Food City, FC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 PizzaDelivery. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/support" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
