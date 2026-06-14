const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 3000;

// ── HTTP server – sirve archivos estáticos ──────────────────────────
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

const httpServer = http.createServer((req, res) => {
  // health check para Render
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }
  let url = req.url.split("?")[0];
  if (url === "/") url = "/index.html";
  const filePath = path.join(__dirname, url);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

// ── WebSocket – salas multijugador ──────────────────────────────────
const wss = new WebSocketServer({ server: httpServer });

function randCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const rooms = new Map(); // code -> { host, guest, hostReady, guestReady }

wss.on("connection", (ws) => {
  let roomCode = null;
  let isHost = false;

  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case "create_room": {
        if (roomCode) return;
        let code;
        do { code = randCode(); } while (rooms.has(code));
        rooms.set(code, { host: ws, guest: null, hostReady: false, guestReady: false });
        roomCode = code;
        isHost = true;
        ws.send(JSON.stringify({ type: "room_created", code }));
        break;
      }

      case "join_room": {
        if (roomCode) return;
        const code = (msg.code || "").toUpperCase();
        const room = rooms.get(code);
        if (!room) {
          ws.send(JSON.stringify({ type: "error", message: "Código inválido" }));
          return;
        }
        if (room.guest) {
          ws.send(JSON.stringify({ type: "error", message: "Sala llena" }));
          return;
        }
        room.guest = ws;
        roomCode = code;
        isHost = false;
        ws.send(JSON.stringify({ type: "joined", code }));
        // avisar al host que alguien se unió
        room.host.send(JSON.stringify({ type: "opponent_joined" }));
        // arrancar el juego para ambos
        room.host.send(JSON.stringify({ type: "game_start", side: "player" }));
        room.guest.send(JSON.stringify({ type: "game_start", side: "enemy" }));
        break;
      }

      case "game_action": {
        if (!roomCode) return;
        const room = rooms.get(roomCode);
        if (!room) return;
        const target = isHost ? room.guest : room.host;
        if (target && target.readyState === 1) {
          target.send(JSON.stringify({ type: "opponent_action", action: msg.action }));
        }
        break;
      }

      case "sync": {
        if (!roomCode) return;
        const room = rooms.get(roomCode);
        if (!room) return;
        const target = isHost ? room.guest : room.host;
        if (target && target.readyState === 1) {
          target.send(JSON.stringify({ type: "sync", playerBaseHp: msg.playerBaseHp, enemyBaseHp: msg.enemyBaseHp }));
        }
        break;
      }

      case "game_over": {
        if (!roomCode) return;
        const room = rooms.get(roomCode);
        if (!room) return;
        // resetear flags de revancha al terminar
        room.hostReady = false; room.guestReady = false;
        const target = isHost ? room.guest : room.host;
        if (target && target.readyState === 1) {
          target.send(JSON.stringify({ type: "opponent_won" }));
        }
        break;
      }

      case "rematch": {
        if (!roomCode) return;
        const room = rooms.get(roomCode);
        if (!room || !room.host || !room.guest) {
          ws.send(JSON.stringify({ type: "rematch_failed" }));
          return;
        }
        if (isHost) room.hostReady = true; else room.guestReady = true;
        const opp = isHost ? room.guest : room.host;
        if (opp && opp.readyState === 1) opp.send(JSON.stringify({ type: "opponent_rematch" }));
        if (room.hostReady && room.guestReady) {
          room.hostReady = false; room.guestReady = false;
          room.host.send(JSON.stringify({ type: "game_start", side: "player" }));
          room.guest.send(JSON.stringify({ type: "game_start", side: "enemy" }));
        }
        break;
      }
    }
  });

  ws.on("close", () => {
    if (roomCode) {
      const room = rooms.get(roomCode);
      if (room) {
        const target = isHost ? room.guest : room.host;
        if (target && target.readyState === 1) {
          target.send(JSON.stringify({ type: "opponent_disconnected" }));
        }
        rooms.delete(roomCode);
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
