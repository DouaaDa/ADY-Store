import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;

export const getSocket = () => socket;

const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const connected = useRef(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      // Disconnect if not admin
      if (socket) {
        socket.disconnect();
        socket = null;
        connected.current = false;
      }
      return;
    }

    if (connected.current) return;

    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      connected.current = true;
    });

    socket.on('disconnect', () => {
      connected.current = false;
    });

    // ── Real-time Event Handlers ───────────────────────────────────────────────

    socket.on('new_order', (data) => {
      toast.success(
        `🛒 Nouvelle commande de ${data.customer} — ${Number(data.total).toLocaleString('fr-DZ')} DZD`,
        { toastId: `order-${data.orderId}`, autoClose: 6000 }
      );
    });

    socket.on('new_customer', (data) => {
      toast.info(
        `👤 Nouveau client inscrit : ${data.name}`,
        { toastId: `customer-${data.userId}`, autoClose: 5000 }
      );
    });

    socket.on('new_message', (data) => {
      toast.info(
        `✉️ Nouveau message de ${data.name} : "${data.subject}"`,
        { toastId: `msg-${data.messageId}`, autoClose: 6000 }
      );
    });

    socket.on('low_stock', (data) => {
      const icon = data.type === 'out_of_stock' ? '❌' : '⚠️';
      const label = data.type === 'out_of_stock'
        ? `${data.productName} est en rupture de stock !`
        : `${data.productName} — stock bas (${data.stock} restants)`;
      toast.warning(`${icon} ${label}`, {
        toastId: `stock-${data.productName}`,
        autoClose: 7000
      });
    });

    socket.on('order_delivered', (data) => {
      toast.success(
        `🚚 Commande livrée à ${data.customerName || 'un client'}`,
        { toastId: `delivered-${data.orderId}`, autoClose: 5000 }
      );
    });

    return () => {
      if (socket) {
        socket.off('new_order');
        socket.off('new_customer');
        socket.off('new_message');
        socket.off('low_stock');
        socket.off('order_delivered');
        socket.disconnect();
        socket = null;
        connected.current = false;
      }
    };
  }, [user]);

  return <>{children}</>;
};

export default SocketProvider;
