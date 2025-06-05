import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  TrendingUpIcon, 
  DollarSignIcon, 
  ShoppingCartIcon, 
  UsersIcon,
  PieChartIcon,
  BarChartIcon
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      } else {
        toast.error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-gray-600">No analytics data available.</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSignIcon}
          color="bg-green-500"
          change={analytics.revenueChange}
        />
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders || 0}
          icon={ShoppingCartIcon}
          color="bg-blue-500"
          change={analytics.ordersChange}
        />
        <StatCard
          title="New Customers"
          value={analytics.newCustomers || 0}
          icon={UsersIcon}
          color="bg-purple-500"
          change={analytics.customersChange}
        />
        <StatCard
          title="Average Order Value"
          value={`₹${analytics.averageOrderValue?.toFixed(2) || 0}`}
          icon={TrendingUpIcon}
          color="bg-orange-500"
          change={analytics.aovChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <PieChartIcon className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
          </div>
          <div className="space-y-3">
            {analytics.orderStatusDistribution?.map((status) => (
              <div key={status._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{status._id}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(status.count / analytics.totalOrders) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{status.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <BarChartIcon className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Popular Pizza Bases</h3>
          </div>
          <div className="space-y-3">
            {analytics.popularBases?.map((base, index) => (
              <div key={base._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{base.name}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(base.count / analytics.popularBases[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{base.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {analytics.recentOrders?.map((order) => (
            <div key={order._id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order #{order.orderNumber}
                </p>
                <p className="text-sm text-gray-600">
                  {order.user?.name} • {order.items.length} item(s)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">₹{order.totalAmount}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {analytics.lowStockItems?.length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">⚠️ Low Stock Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.lowStockItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg p-4 border border-yellow-200">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                <p className="text-sm text-yellow-800">
                  Stock: {item.quantity} {item.unit} (Threshold: {item.threshold})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
