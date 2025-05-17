const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes//authRoutes");

require("dotenv").config();

const app = express();

// Connect to Database
connectDB();

// Configure CORS
const allowedOrigins = [
  "http://localhost:8080",
  "http://10.0.0.4:8080",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes (specific routes first, generic last)
app.use("/api/auth", authRoutes);

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    {
      headers: req.headers,
      body: req.body,
    }
  );
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});