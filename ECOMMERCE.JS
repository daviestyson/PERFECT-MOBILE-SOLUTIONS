// pages/api/products.js
import mongoose from 'mongoose';

// MongoDB connection (reuses the connection if already connected)
const connectMongo = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Product schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'GET') {
    try {
      const products = await Product.find({});
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch products.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
