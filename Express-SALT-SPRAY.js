const express = require('express')
const app = express()
const cors = require("cors")
const router = express.Router();
const bodyParser = require('body-parser');
const port = 14001
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ระบุ origin ถ้ามี
    methods: ["GET", "POST"]
  }
});


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  limit: '150mb',
  extended: true
}));
// app.use(express.limit('10M'));
app.use(cors())
app.use("/", require("./api"))

// เมื่อ client เชื่อมต่อ
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // รับ event 'update-data' จาก client A
  socket.on('update-data', (data) => {
    console.log('Received data:', data);

    // ส่งข้อมูลนี้ไปให้ client อื่น (ไม่รวมผู้ส่งเอง)
    socket.broadcast.emit('refresh-ui', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})