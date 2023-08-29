const express = require('express');
const app = express();

// Middleware để thiết lập header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

// Các tuyến đường và xử lý yêu cầu khác của ứng dụng

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});