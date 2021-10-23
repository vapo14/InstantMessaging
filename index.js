require("dotenv").config();
const app = require("express")();
// Servidor HTTP
const http = require("http").Server(app);
// Servidor para socket.io, aquí RECIBIMOS mensajes
// Nos aseguramos que podemos recibir referencias cruzadas
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// Argumentos de linea de comandos
var myArgs = process.argv.slice(2);
// Puerto es el primer argumento que se pasa
// const port = process.env.PORT || myArgs[0];
const port = myArgs[0];
// Se almacenan los mensajes recibidos
var mensajes = [];
// Se usa para ENVIAR mensajes
var socketOut = null;
app.get("/", (req, res) => {
  res.send("ASCP framework");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Cliente
const ioc = require("socket.io-client");

// Conectar a otro host
app.get("/conectar", (req, res) => {
  res.send("Host " + req.query.host);
  socketOut = ioc(req.query.host);
  console.log(socketOut);
});

// Enviar mensaje al host al que se encuentra conectado
app.get("/enviar_mensaje", (req, res) => {
  res.send("Mensaje " + req.query.msg);
  socketOut.emit("Mensaje ASCP", { function: 1, data: req.query.msg });
});
// Obtener el último mensaje
app.get("/obtener_ultimo_mensaje", (req, res) => {
  res.send("Ultimo: " + mensajes[mensajes.length - 1]);
});
// Recibir mensajes
io.on("connection", (socket) => {
  socket.on("Mensaje ASCP", (payload) => {
    console.log(socket.id + " " + payload.data);
    mensajes.push(payload.data);
    io.emit("ToClient", payload);
  });
});

io.on("connection", (socket) => {
  socket.on("FromClient", (payload) => {
    socketOut.emit("Mensaje ASCP", payload);
  });
});
// Escuchar en el puerto especificado en la línea de comandos
http.listen(port, () => {
  console.log(`Escuchando en http://localhost:${port}/`);
});
