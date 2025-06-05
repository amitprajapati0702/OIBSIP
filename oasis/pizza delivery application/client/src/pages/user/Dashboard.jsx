import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Pizza, Clock, Package, Star } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    recentOrders: [],
    activeOrders: [],
    stats: {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0
    }
  });

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setDashboardData({
        recentOrders: [
          {
            id: 1,
            orderNumber: 'PZ2024001',
            status: 'delivered',
            totalAmount: 599,
            createdAt: new Date().toISOString(),
            items: [{ name: 'Custom Pizza', quantity: 2 }]
          }
        ],
        activeOrders: [],
        stats: {
          totalOrders: 5,
          totalSpent: 2499,
          averageOrderValue: 499.8
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your pizza orders
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/pizza-builder"
            className="bg-primary-600 text-white p-6 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Pizza className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Build New Pizza</h3>
            <p className="text-primary-100">Create your perfect custom pizza</p>
          </Link>

          <Link
            to="/orders"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <Package className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">My Orders</h3>
            <p className="text-gray-600">Track your order history</p>
          </Link>

          <Link
            to="/profile"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <Star className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Profile</h3>
            <p className="text-gray-600">Manage your account settings</p>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{dashboardData.stats.totalSpent}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{dashboardData.stats.averageOrderValue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            {dashboardData.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{order.totalAmount}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Pizza className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders yet</p>
                <Link
                  to="/pizza-builder"
                  className="btn-primary btn-sm mt-4"
                >
                  Order Your First Pizza
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
