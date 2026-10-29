
import { useEffect, useState } from "react";
import { getFoods } from "./foodService";
import "./App.css";

function App() {
    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Lấy danh sách món ăn từ Backend
    const fetchFoods = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const result = await getFoods();

            if (!Array.isArray(result.data)) {
                throw new Error("Dữ liệu món ăn không hợp lệ.");
            }

            setFoods(result.data);
        } catch (err) {
            console.error("Lỗi lấy danh sách món ăn:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Không thể tải danh sách món ăn. Vui lòng kiểm tra Backend."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    // Định dạng giá tiền Việt Nam
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(Number(price) || 0);
    };

    // Tìm kiếm món ăn
    const keyword = search.trim().toLocaleLowerCase("vi");

    const filteredFoods = foods.filter((food) => {
        return (
            food.name?.toLocaleLowerCase("vi").includes(keyword) ||
            food.foodId?.toLocaleLowerCase("vi").includes(keyword) ||
            food.category?.toLocaleLowerCase("vi").includes(keyword) ||
            food.cuisine?.toLocaleLowerCase("vi").includes(keyword)
        );
    });

    return (
        <div className="app">
            <header className="header">
                <h1>🍜 Food Management</h1>
                <p>Hệ thống quản lý món ăn</p>
            </header>

            <main className="container">
                <h2>Danh sách món ăn</h2>

                {/* Thông báo thành công */}
                {success && (
                    <div className="message success" role="status">
                        <span>{success}</span>
                        <button
                            onClick={() => setSuccess("")}
                            aria-label="Đóng thông báo"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Thông báo lỗi */}
                {error && (
                    <div className="message error" role="alert">
                        <strong>Đã xảy ra lỗi!</strong>
                        <p>{error}</p>
                        <button
                            onClick={fetchFoods}
                            disabled={loading}
                        >
                            {loading ? "Đang tải..." : "Thử tải lại"}
                        </button>
                    </div>
                )}

                <p className="total">
                    Tổng số món ăn: <strong>{foods.length}</strong>
                </p>

                {/* Tìm kiếm */}
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm theo tên, mã món, danh mục, ẩm thực..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    {search && (
                        <button
                            className="clear-search"
                            onClick={() => setSearch("")}
                        >
                            Xóa tìm kiếm
                        </button>
                    )}
                </div>

                <p className="search-result">
                    Tìm thấy <strong>{filteredFoods.length}</strong> món ăn
                </p>

                {/* Trạng thái tải và danh sách */}
                {loading ? (
                    <div className="message loading" role="status">
                        <span className="spinner"></span>
                        Đang tải danh sách món ăn...
                    </div>
                ) : error ? (
                    <p>Không thể hiển thị danh sách món ăn.</p>
                ) : filteredFoods.length === 0 ? (
                    <p className="message">
                        {foods.length === 0
                            ? "Chưa có món ăn nào."
                            : "Không tìm thấy món ăn phù hợp."}
                    </p>
                ) : (
                    <div className="food-grid">
                        {filteredFoods.map((food) => (
                            <article className="food-card" key={food._id}>
                                <div className="food-image">
                                    {food.imageUrl ? (
                                        <img
                                            src={food.imageUrl}
                                            alt={food.name}
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="no-image">
                                            🍜 Chưa có hình ảnh
                                        </div>
                                    )}
                                </div>

                                <div className="food-content">
                                    <span className="food-id">
                                        {food.foodId}
                                    </span>

                                    <h3>{food.name}</h3>

                                    <p className="category">
                                        Danh mục: {food.category}
                                    </p>

                                    <p>Ẩm thực: {food.cuisine}</p>

                                    <p className="description">
                                        {food.description}
                                    </p>

                                    <p className="ingredients">
                                        <strong>Nguyên liệu:</strong>{" "}
                                        {Array.isArray(food.ingredients)
                                            ? food.ingredients.join(", ")
                                            : ""}
                                    </p>

                                    <div className="food-footer">
                                        <span className="price">
                                            {formatPrice(food.price)}
                                        </span>

                                        <span className="quantity">
                                            Còn {food.quantity} phần
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
