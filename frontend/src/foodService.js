import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/foods`;

// Lấy danh sách món ăn
export const getFoods = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Lấy thông tin một món ăn
export const getFoodById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Thêm món ăn
export const createFood = async (food) => {
    const response = await axios.post(API_URL, food);
    return response.data;
};

// Cập nhật món ăn
export const updateFood = async (id, food) => {
    const response = await axios.put(`${API_URL}/${id}`, food);
    return response.data;
};

// Xóa món ăn
export const deleteFood = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};