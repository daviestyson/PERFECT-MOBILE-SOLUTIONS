// pages/api/orders.js
import mongoose from 'mongoose';

// MongoDB connection (reuse if already connected)
const connectMongo = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Define the Order schema
const orderSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  phone: String,
  address: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'POST') {
    try {
      const { customerName, email, phone, address, items, total } = req.body;
      const newOrder = new Order({ customerName, email, phone, address, items, total });
      await newOrder.save();
      return res.status(201).json({ success: true, message: 'Order placed successfully!' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to process order.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
