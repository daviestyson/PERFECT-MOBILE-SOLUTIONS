// components/OrderForm.js
import React, { useState } from 'react';

const OrderForm = ({ cartItems, total, onOrderSuccess }) => {
  const [orderData, setOrderData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderData, items: cartItems, total }),
      });
      const result = await response.json();
      if (result.success) {
        onOrderSuccess();
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div>
      <h2>Place Your Order</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="customerName" placeholder="Full Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
