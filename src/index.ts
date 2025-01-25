import { app } from "./app";
import { createServer as createHttpServer } from "http";
import { Server as newIOServer } from "socket.io";

const httpServer = createHttpServer(app);
const io = new newIOServer(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("hello", (res) => {
    console.log(res);
  });
});

httpServer.listen(3000, () => {
  console.log("Listening at: http://localhost:3000");
});
