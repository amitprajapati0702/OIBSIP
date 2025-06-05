import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
        upgrade: true,
      });

      const socket = socketRef.current;

      // Connection event handlers
      socket.on('connect', () => {
        console.log('Connected to server');
        
        // Join appropriate rooms based on user role
        if (user.role === 'admin') {
          socket.emit('join-admin-room');
        }
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      // Order-related event handlers
      socket.on('order-status-update', (data) => {
        const { orderId, status, timestamp, notes } = data;
        
        // Show notification to user
        const statusMessages = {
          confirmed: 'Your order has been confirmed!',
          preparing: 'Your order is being prepared',
          baking: 'Your pizza is in the oven!',
          ready: 'Your order is ready!',
          'out-for-delivery': 'Your order is out for delivery!',
          delivered: 'Your order has been delivered!',
          cancelled: 'Your order has been cancelled'
        };

        const message = statusMessages[status] || `Order status updated to ${status}`;
        
        if (status === 'delivered') {
          toast.success(message, {
            duration: 6000,
            icon: '🍕',
          });
        } else if (status === 'cancelled') {
          toast.error(message);
        } else {
          toast(message, {
            icon: '📦',
          });
        }

        // Dispatch custom event for components to listen to
        window.dispatchEvent(new CustomEvent('orderStatusUpdate', {
          detail: { orderId, status, timestamp, notes }
        }));
      });

      // Admin-specific event handlers
      if (user.role === 'admin') {
        socket.on('new-order', (data) => {
          const { orderNumber, totalAmount } = data;
          toast.success(`New order received: #${orderNumber} - ₹${totalAmount}`, {
            duration: 6000,
            icon: '🔔',
          });

          // Dispatch custom event for admin components
          window.dispatchEvent(new CustomEvent('newOrder', {
            detail: data
          }));
        });

        socket.on('order-updated', (data) => {
          // Dispatch custom event for admin components
          window.dispatchEvent(new CustomEvent('orderUpdated', {
            detail: data
          }));
        });

        socket.on('low-stock-alert', (data) => {
          const { items } = data;
          toast.error(`Low stock alert: ${items.length} items need restocking`, {
            duration: 8000,
            icon: '⚠️',
          });

          // Dispatch custom event for admin components
          window.dispatchEvent(new CustomEvent('lowStockAlert', {
            detail: data
          }));
        });
      }

      // Cleanup function
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [isAuthenticated, user]);

  // Join order room for real-time updates
  const joinOrderRoom = (orderId) => {
    if (socketRef.current) {
      socketRef.current.emit('join-order-room', orderId);
    }
  };

  // Leave order room
  const leaveOrderRoom = (orderId) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-order-room', orderId);
    }
  };

  // Emit custom events
  const emitEvent = (eventName, data) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, data);
    }
  };

  // Listen to custom events
  const onEvent = (eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
    }
  };

  // Remove event listener
  const offEvent = (eventName, callback) => {
    if (socketRef.current) {
      socketRef.current.off(eventName, callback);
    }
  };

  // Check if socket is connected
  const isConnected = () => {
    return socketRef.current?.connected || false;
  };

  const value = {
    socket: socketRef.current,
    joinOrderRoom,
    leaveOrderRoom,
    emitEvent,
    onEvent,
    offEvent,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Custom hook for order status updates
export const useOrderStatusUpdates = (orderId, onStatusUpdate) => {
  const { joinOrderRoom, leaveOrderRoom } = useSocket();

  useEffect(() => {
    if (orderId) {
      joinOrderRoom(orderId);

      const handleStatusUpdate = (event) => {
        if (event.detail.orderId === orderId && onStatusUpdate) {
          onStatusUpdate(event.detail);
        }
      };

      window.addEventListener('orderStatusUpdate', handleStatusUpdate);

      return () => {
        leaveOrderRoom(orderId);
        window.removeEventListener('orderStatusUpdate', handleStatusUpdate);
      };
    }
  }, [orderId, onStatusUpdate, joinOrderRoom, leaveOrderRoom]);
};

// Custom hook for admin notifications
export const useAdminNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const handleNewOrder = (event) => {
      // Handle new order notification
      console.log('New order received:', event.detail);
    };

    const handleOrderUpdate = (event) => {
      // Handle order update notification
      console.log('Order updated:', event.detail);
    };

    const handleLowStock = (event) => {
      // Handle low stock alert
      console.log('Low stock alert:', event.detail);
    };

    window.addEventListener('newOrder', handleNewOrder);
    window.addEventListener('orderUpdated', handleOrderUpdate);
    window.addEventListener('lowStockAlert', handleLowStock);

    return () => {
      window.removeEventListener('newOrder', handleNewOrder);
      window.removeEventListener('orderUpdated', handleOrderUpdate);
      window.removeEventListener('lowStockAlert', handleLowStock);
    };
  }, [user]);
};

export default SocketContext;
