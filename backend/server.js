const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API kiểm tra máy chủ
app.get("/", (req, res) => {
    res.json({
        message: "FoodManagement API is running!"
    });
});

// API kiểm tra trạng thái Backend
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend is healthy"
    });
});

// Khởi động máy chủ
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});