import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import './App.css';

const API = 'https://claude-production-0b03.up.railway.app';
const socket = io(API);

export default function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [banner, setBanner] = useState({
    title: 'Yangi mahsulotlar! 🎉',
    subtitle: 'Har kuni yangi va mazali taomlar',
    emoji: '🍩'
  });

  useEffect(() => {
    loadProducts();
    loadBanner();

    const userPhone = localStorage.getItem('userPhone');

    socket.on('orderStatus', (data) => {
      if (userPhone && data.phone === userPhone) {
        showNotification(`Buyurtma #${data.id} holati: ${data.status}`);
      }
    });

    return () => {
      socket.off('orderStatus');
    };
  }, []);

  function showNotification(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  }

  async function loadProducts() {
    try {
      const res = await fetch(`
