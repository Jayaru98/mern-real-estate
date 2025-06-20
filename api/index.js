import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';
import mlRouter from './routes/ml.route.js';
import cors from 'cors';
dotenv.config();



mongoose
.connect(process.env.MONGO)
.then(() => {
  console.log('Connected to MongoDB!');
})
.catch((err) => {
    console.log(err);
})
    
const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());


app.listen(3000, () => {
  console.log('Server is running on port 3000');
}
);

app.use('/api/user', userRoutes);
app.use('/api/auth', authRouter); 
app.use('/api/listing', listingRouter);
app.use('/api/ml', mlRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
});