import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductList from './ProductList'
import ProductDetail from './ProductDetail';
import Navbar from './Navbar';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import Cart from './Cart';
import Checkout from './Checkout';
import OrderConfirmation from './OrderConfirmation';
import { CartProvider } from "./CartContext";
import './App.css'
  
function App() {
  return (
    <BrowserRouter>
    <CartProvider>
    <div className='App'>
      <Navbar />
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
        </main>
      </div>
    </CartProvider>
    </BrowserRouter>
  )
}

export default App
