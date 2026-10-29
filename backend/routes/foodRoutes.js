
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Food = require("../models/Food");

// Chuyển tiếng Việt có dấu thành không dấu
function removeVietnameseAccents(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

// Kiểm tra MongoDB ObjectId
function isValidId(id) {
    return mongoose.isValidObjectId(id);
}

// Xử lý lỗi chung
function handleError(res, error, message) {
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Mã món ăn đã tồn tại"
        });
    }

    if (
        error.name === "ValidationError" ||
        error.name === "CastError"
    ) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            error: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message,
        error: error.message
    });
}

// GET /api/foods - Lấy danh sách và tìm kiếm món ăn
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;

        let foods = await Food.find().sort({ createdAt: -1 });

        if (search && search.trim()) {
            const keyword = removeVietnameseAccents(
                search.trim()
            ).toLowerCase();

            foods = foods.filter((food) => {
                const searchableFields = [
                    food.foodId,
                    food.name,
                    food.category,
                    food.cuisine
                ];

                return searchableFields.some((value) =>
                    removeVietnameseAccents(String(value || ""))
                        .toLowerCase()
                        .includes(keyword)
                );
            });
        }

        return res.status(200).json({
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Không thể lấy danh sách món ăn"
        );
    }
});

// GET /api/foods/:id - Lấy chi tiết món ăn
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID món ăn không hợp lệ"
            });
        }

        const food = await Food.findById(id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy món ăn"
            });
        }

        return res.status(200).json({
            success: true,
            data: food
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Không thể lấy thông tin món ăn"
        );
    }
});

// POST /api/foods - Thêm món ăn
router.post("/", async (req, res) => {
    try {
        const {
            foodId,
            name,
            category,
            cuisine,
            ingredients,
            price,
            quantity,
            description,
            imageUrl
        } = req.body;

        if (
            typeof foodId !== "string" || !foodId.trim() ||
            typeof name !== "string" || !name.trim() ||
            typeof category !== "string" || !category.trim() ||
            typeof cuisine !== "string" || !cuisine.trim() ||
            !Array.isArray(ingredients) ||
            price === undefined ||
            quantity === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin món ăn"
            });
        }

        if (
            typeof price !== "number" ||
            typeof quantity !== "number" ||
            !Number.isFinite(price) ||
            !Number.isFinite(quantity) ||
            price < 0 ||
            quantity < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Giá và số lượng phải là số không âm"
            });
        }

        const existingFood = await Food.findOne({
            foodId: foodId.trim()
        });

        if (existingFood) {
            return res.status(409).json({
                success: false,
                message: "Mã món ăn đã tồn tại"
            });
        }

        const newFood = await Food.create({
            foodId: foodId.trim(),
            name: name.trim(),
            category: category.trim(),
            cuisine: cuisine.trim(),
            ingredients,
            price,
            quantity,
            description,
            imageUrl
        });

        return res.status(201).json({
            success: true,
            message: "Thêm món ăn thành công",
            data: newFood
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Không thể thêm món ăn"
        );
    }
});

// PUT /api/foods/:id - Cập nhật món ăn
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID món ăn không hợp lệ"
            });
        }

        const allowedFields = [
            "foodId",
            "name",
            "category",
            "cuisine",
            "ingredients",
            "price",
            "quantity",
            "description",
            "imageUrl"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Không có dữ liệu cần cập nhật"
            });
        }

        if (
            updates.foodId !== undefined &&
            (
                typeof updates.foodId !== "string" ||
                !updates.foodId.trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Mã món ăn không hợp lệ"
            });
        }

        if (updates.foodId !== undefined) {
            updates.foodId = updates.foodId.trim();

            const existingFood = await Food.findOne({
                foodId: updates.foodId,
                _id: { $ne: id }
            });

            if (existingFood) {
                return res.status(409).json({
                    success: false,
                    message: "Mã món ăn đã tồn tại"
                });
            }
        }

        for (const field of ["name", "category", "cuisine"]) {
            if (
                updates[field] !== undefined &&
                (
                    typeof updates[field] !== "string" ||
                    !updates[field].trim()
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: `${field} không được để trống`
                });
            }

            if (typeof updates[field] === "string") {
                updates[field] = updates[field].trim();
            }
        }

        if (
            updates.price !== undefined &&
            (
                typeof updates.price !== "number" ||
                !Number.isFinite(updates.price) ||
                updates.price < 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Giá phải là số không âm"
            });
        }

        if (
            updates.quantity !== undefined &&
            (
                typeof updates.quantity !== "number" ||
                !Number.isFinite(updates.quantity) ||
                updates.quantity < 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Số lượng phải là số không âm"
            });
        }

        if (
            updates.ingredients !== undefined &&
            !Array.isArray(updates.ingredients)
        ) {
            return res.status(400).json({
                success: false,
                message: "Nguyên liệu phải là một mảng"
            });
        }

        const updatedFood = await Food.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedFood) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy món ăn"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật món ăn thành công",
            data: updatedFood
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Không thể cập nhật món ăn"
        );
    }
});

// DELETE /api/foods/:id - Xóa món ăn
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID món ăn không hợp lệ"
            });
        }

        const deletedFood = await Food.findByIdAndDelete(id);

        if (!deletedFood) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy món ăn"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa món ăn thành công",
            data: deletedFood
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Không thể xóa món ăn"
        );
    }
});

module.exports = router;
