require("dotenv").config();
const crypto = require("crypto");
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

// funciones de encripcion
function encodeDesECB(textToEncode, keyString) {
  var key = new Buffer.from(keyString.substring(0, 8), "utf8");

  var cipher = crypto.createCipheriv("des-ecb", key, "");

  var c = cipher.update(textToEncode, "utf8", "base64");
  c += cipher.final("base64");

  return c;
}

function decodeDesECB(textToDecode, keyString) {
  var key = new Buffer.from(keyString.substring(0, 8), "utf8");

  var decipher = crypto.createDecipheriv("des-ecb", key, "");

  var d = decipher.update(textToDecode, "base64", "utf8");

  d += decipher.final("utf8");

  return d;
}

// Argumentos de linea de comandos
var myArgs = process.argv.slice(2);
// Puerto es el primer argumento que se pasa
const port = myArgs[0] || process.env.PORT;
// const port = myArgs[0];
// Se almacenan los mensajes recibidos
var mensajes = [];
var globalKey = "";
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
  let encodedMessage = encodeDesECB(req.query.msg);
  req.query.msg = encodedMessage;
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
    // desencriptar payload.data
    payload.data = decodeDesECB(payload.data, globalKey);
    console.log("desencriptado: ", payload.data);
    io.emit("ToClient", payload);
  });
});

io.on("connection", (socket) => {
  socket.on("FromClient", (payload) => {
    // encriptar payload.data
    console.log(payload);
    let encodedMessage = encodeDesECB(payload.data);
    payload.data = encodedMessage;
    socketOut.emit("Mensaje ASCP", payload);
  });
});

io.on("connection", (socket) => {
  socket.on("ConnectionURL", (payload) => {
    socketOut = ioc(payload.url);
    globalKey = payload.encryptionKey;
    console.log("payload", payload);
    console.log(socketOut);
  });
});
// Escuchar en el puerto especificado en la línea de comandos
http.listen(port, () => {
  console.log(`Escuchando en http://localhost:${port}/`);
});
