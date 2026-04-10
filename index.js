import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import './config/google.js'
import connectDB from './config/mongodb.js'
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            process.env.FRONTEND_URL
        ],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/', (req, res) => {
    res.json({ message: "server is running" })
})

connectDB();

app.listen(PORT, () => {
    console.log('server is running at ' + PORT);
});