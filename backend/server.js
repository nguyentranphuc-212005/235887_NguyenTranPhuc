const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const foodRoutes = require("./routes/foodRoutes");

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

// Đăng ký API món ăn
app.use("/api/foods", foodRoutes);

// Khởi động máy chủ sau khi kết nối MongoDB
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "235887_NguyenTranPhuc"
        });

        console.log("Đã kết nối MongoDB Atlas thành công!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Không thể kết nối MongoDB:", error.message);
        process.exit(1);
    }
}

startServer();