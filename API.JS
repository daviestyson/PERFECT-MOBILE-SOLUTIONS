// pages/api/contact.js
import mongoose from 'mongoose';

// MongoDB connection (reuses the connection if already connected)
const connectMongo = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Define a simple schema for the contact message
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
}, { timestamps: true });

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactSchema);

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'POST') {
    try {
      const { name, email, phone, message } = req.body;
      const newMessage = new ContactMessage({ name, email, phone, message });
      await newMessage.save();
      return res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to send message.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
