\## Câu 5: Đóng gói Backend bằng Docker



\### Docker Hub

\- Repository: `nguyentranphuc212005/foods-backend`

\- Tag: `1.0`

\- Image: `nguyentranphuc212005/foods-backend:1.0`



\### Build Docker image

cd backend

docker build -t foods-backend:1.0 .





\### Chạy Backend bằng Docker



Tạo file `.env` từ `.env.example`, điền thông tin kết nối MongoDB Atlas, sau đó chạy:





docker run -d --name food-backend -p 5000:5000 --env-file .env nguyentranphuc212005/foods-backend:1.0





\### Kiểm tra container





docker ps

docker logs food-backend





