# FoodManagement

## 1. Giới thiệu

FoodManagement là ứng dụng web quản lý món ăn, được xây dựng nhằm thực hành phát triển ứng dụng web với React, Node.js, Express.js và MongoDB Atlas.

## 2. Công nghệ sử dụng

- Frontend: React
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Quản lý mã nguồn: Git và GitHub
- Đóng gói ứng dụng: Docker
- Triển khai: Render

## 3. Cấu trúc dự án

```text
FoodManagement/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
├── .gitignore
└── README.md
```

## 4. Cài đặt Backend

### Yêu cầu

- Node.js và npm
- MongoDB Atlas khi triển khai chức năng cơ sở dữ liệu

### Các bước chạy

1. Mở Terminal tại thư mục dự án.
2. Di chuyển vào thư mục Backend:

   ```bash
   cd backend
   ```

3. Cài đặt thư viện:

   ```bash
   npm install
   ```

4. Tạo file `.env` và cấu hình các biến môi trường cần thiết.
5. Khởi động Backend:

   ```bash
   npm run dev
   ```

Backend mặc định chạy tại `http://localhost:5000`.

## 5. API hiện có

| Phương thức | Đường dẫn | Chức năng |
|---|---|---|
| GET | `/` | Kiểm tra máy chủ |
| GET | `/health` | Kiểm tra trạng thái Backend |

## 6. Tiến độ dự án

- [x] Khởi tạo Backend bằng Express.js
- [x] Cài đặt các thư viện cần thiết
- [x] Tạo API kiểm tra máy chủ
- [x] Tạo API kiểm tra trạng thái
- [ ] Kết nối MongoDB Atlas
- [ ] Xây dựng API CRUD món ăn
- [ ] Xây dựng giao diện React
- [ ] Đóng gói ứng dụng bằng Docker
- [ ] Triển khai ứng dụng lên Render