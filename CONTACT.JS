// pages/contact.js
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [responseMessage, setResponseMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setResponseMessage('Message sent successfully!');
      } else {
        setResponseMessage('Failed to send message.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setResponseMessage('Error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required />
        <textarea name="message" placeholder="Message" onChange={handleChange} required></textarea>
        <button type="submit">Send Message</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Contact;
