
import { io } from "socket.io-client";

export const socket = io("https://tambola-gn03.onrender.com", {
  transports: ["websocket"],
  autoConnect: true,
});
// export const socket = io("http://localhost:4000", {
//   transports: ["websocket"],
//   autoConnect: true,
// });
